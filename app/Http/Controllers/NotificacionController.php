<?php

namespace App\Http\Controllers;

use App\Http\Requests;
use Illuminate\Http\Request;

use App\Models\Notificacion;
use App\Models\VTNotificacion;
use App\Models\NotificacionMasiva;
use App\Models\Comparendo;
use App\Models\VTInstitucion;

use App\Services\NotificacionService;
use App\Services\ResponsableService;
use App\Services\GeneralService;

use DB;
use Storage;
use View;

use PDF; // PDF
use DNS1D; // Código de barras

class NotificacionController extends Controller
{
    protected $notificacionService;
    protected $responsableService;
    protected $generalService;

    public function __construct(NotificacionService $notificacionService, 
                                ResponsableService $responsableService, 
                                GeneralService $generalService)
    {
        $this->notificacionService = $notificacionService;
        $this->responsableService = $responsableService;
        $this->generalService = $generalService;
    }

    public function index()
    {
        
    }

    public function store(Request $request)
    {
        try
        {
            // Decodificar el JSON a un array para obtener los filtros para generar las notificaciones.
            $notificacionFilter = json_decode(stripslashes($request->input('notificacionFilter')));

            $notificacionArray = array(
                $notificacionFilter->infra_desde != '0' ? $notificacionFilter->infra_desde . ' 00:00' : null,
                $notificacionFilter->infra_hasta != '0' ? $notificacionFilter->infra_hasta . ' 23:59' : null,
                $notificacionFilter->verifica_desde != '0' ? $notificacionFilter->verifica_desde . ' 00:00' : null,
                $notificacionFilter->verifica_hasta != '0' ? $notificacionFilter->verifica_hasta . ' 23:59' : null,
                $notificacionFilter->detec_sitio != '0' ? $notificacionFilter->detec_sitio : null,
                $notificacionFilter->detec_agente != '0' ? $notificacionFilter->detec_agente : null,
                $notificacionFilter->dir_divipo != '0' ? $notificacionFilter->dir_divipo : null,
                $notificacionFilter->usuario
            );

            // Ejecutar el procedimiento almacenado que realiza la generación de las notificaciones.
            DB::statement(
                'CALL SP_INSERT_NOTIFICACIONES(?,?,?,?,?,?,?,?)',
                $notificacionArray
            );
        }
        catch(\Exception $e)
        {
            return response()->json(['estado' => 'ERROR', 'mensaje' => 'Error al generar las notificaciones.', 'excepcion' => $e->getMessage()], 500);
        }

        return response()->json(['estado' => 'OK', 'mensaje' => 'Notificaciones generadas con éxito.', 'notificacionFilter' => $notificacionFilter]);
    }

    public function imprimir($imp_orden, $imp_modo)
    {
        try
        {
            // Eliminar archivos temporales de firmas asociadas a notificación de comparendos.
            $ruta_notif_firmas = storage_path('app\\notif_firmas');
            $this->generalService->eliminarArchivosCarpeta($ruta_notif_firmas);

            // Eliminar archivo temporal de firma del funcionario responsable de acto de comparendo.
            $ruta_resp_firma = storage_path('app\\responsable_firma');
            $this->generalService->eliminarArchivosCarpeta($ruta_resp_firma);

            // Obtener código de notificación masiva que agrupa el listado de notificaciones generadas.
            $notimasiva = NotificacionMasiva::select('notimasiva')
                                            ->orderBy('notimasiva', 'desc')
                                            ->first()
                                            ->notimasiva;

            // Consultar el listado de notificaciones generadas para su posterior impresión.
            $notificaciones = VTNotificacion::where('notimasiva', $notimasiva)
                                            ->orderBy('notificacion')
                                            ->get();

            // Definir las vistas de las páginas de comparendo y carta que componen las notificaciones.
            $paginas = array();

            // Orden 1: Carta - comparendo
            if ($imp_orden == 1)
            {
                $paginas[0] = 'pdf.cartas';
                $paginas[1] = 'pdf.comparendos';
            }
            // Orden 2: Comparendo - carta
            else
            {
                $paginas[0] = 'pdf.comparendos';
                $paginas[1] = 'pdf.cartas';
            }

            // Generar nombre de archivo aleatorio.
            $caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";

            // Array de la ruta de las firmas asociadas al comparendo.
            $notif_ruta_firmas = array();
            $i = 0;

            // Array del detalle de notificaciones para el archivo CSV.
            $detalleNotif = array();

            foreach ($notificaciones as $notif)
            {
                // Obtener firmas asociadas al comparendo y guardarlas en almacenamiento local.
                $notif_nombre_archivo = "";
                
                for ($j = 0; $j < 10; $j++)
                {
                    $notif_nombre_archivo .= substr($caracteres, rand(0, strlen($caracteres)), 1);
                }

                $notif_nombre_archivo .= '.png';

                $notif_ruta_firmas[$i] = storage_path() . '\\app\\notif_firmas\\' . $notif_nombre_archivo;
                $notif_img_firma = base64_decode($notif->agt_firma);
                Storage::disk('notif_firmas')->put($notif_nombre_archivo, $notif_img_firma);

                // Se agregan los datos necesarios para el detalle de la notificación para el archivo CSV.
                array_push($detalleNotif, array(
                    $notif->notificacion, $notif->notif_fecha, $notif->notif_medio_desc, $notif->notif_tipo_desc, $notif->numero, 
                    $notif->notif_tipo_doc, $notif->notif_numero_doc, $notif->notif_nombres_apellidos, $notif->notif_dir_departamento, $notif->notif_dir_municipio, 
                    $notif->notif_dir_descripcion, null, $notif->notif_celular, $notif->notif_email
                ));

                $i++;
            }

            // Obtener firma del funcionario responsable de emitir el acto de comparendo.        
            $responsable = $this->responsableService->getByTipoActo(1);
            $resp_nombre_archivo = 'responsable_firma.png';
            $resp_ruta_firma = storage_path() . '\\app\\responsable_firma\\' . $resp_nombre_archivo;
            $resp_img_firma = base64_decode($responsable->firma);
            Storage::disk('responsable_firma')->put($resp_nombre_archivo, $resp_img_firma);

            // Obtener datos institucionales del organismo de tránsito.
            $institucion = VTInstitucion::all()->first();

            // Definir la ruta para almacenar el archivo PDF de forma temporal.
            $ruta = storage_path() . '\\app\\notif_pdf\\tmp.pdf';

            // Generar el PDF a partir de la vista HTML.
            $view = PDF::loadView('pdf.notificaciones', compact('notificaciones', 'paginas', 'institucion', 'notif_ruta_firmas', 'responsable', 'resp_ruta_firma', 'imp_modo'));
            $pdf = \App::make('snappy.pdf');
            $pdf->generateFromHtml($view->html, $ruta);

            // Convertir el archivo PDF a una cadena de bytes para enviarla como respuesta.
            $array_bytes = rawurlencode(base64_encode(file_get_contents($ruta)));

            // Eliminar el archivo temporal.
            unlink($ruta);
        }
        catch (\Exception $e)
        {
            return response()->json(['estado' => 'ERROR', 'mensaje' => 'Error al imprimir las notificaciones.', 'excepcion' => $e->getMessage()], 500);
        }

        return response()->json(['estado' => 'OK', 'mensaje' => 'Notificaciones impresas.', 'pdfNotificaciones' => $array_bytes, 'detalleNotif' => $detalleNotif]);
    }

    public function marcarImpreso(Request $request)
    {
        try
        {
            // Obtener código de notificación masiva que agrupa el listado de notificaciones generadas.
            $notimasiva = NotificacionMasiva::select('notimasiva')
                                            ->orderBy('notimasiva', 'desc')
                                            ->first()
                                            ->notimasiva;

            // Ejecutar el procedimiento almacenado que marca como impresas las notificaciones.
            DB::statement(
                'CALL SP_MARCA_IMPRESO_NOTIF(?,?)', 
                array($notimasiva, $request->input('usuario_imprime'))
            );
        }
        catch(\Exception $e)
        {
            return response()->json(['estado' => 'ERROR', 'mensaje' => 'Error al actualizar los comparendos.', 'excepcion' => $e->getMessage()], 500);
        }

        return response()->json(['estado' => 'OK', 'mensaje' => 'Comparendos marcados como impresos.']);
    }

    public function update(Request $request, $id)
    {
        try
        {
            $notificacion = Notificacion::find($id);
            $notificacion->estado = !is_null($request->input('estado')) ? $request->input('estado') : $notificacion->estado;
            $notificacion->fecha_hasta = !is_null($request->input('fecha_hasta')) ? $request->input('fecha_hasta') : $notificacion->fecha_hasta;
            $notificacion->motivo_rechazo = !is_null($request->input('motivo_rechazo')) ? $request->input('motivo_rechazo') : $notificacion->motivo_rechazo;
            $notificacion->save();
        }
        catch(\Exception $e)
        {
            return response()->json(['estado' => 'ERROR', 'mensaje' => 'Error al actualizar el estado de la notificación.'], 500);
        }

        return response()->json(['estado' => 'OK', 'mensaje' => 'Notificación actualizada.']);
    }

    public function getByFilters($notificacion, $notif_tipo, $numero, $notif_tipo_doc, $notif_numero_doc, $estado)
    {
        $notificaciones = VTNotificacion::whereRaw($notificacion != 0 ? ('NOTIFICACION = '.$notificacion) : ('NOTIFICACION = NOTIFICACION'))
                                        ->whereRaw($notif_tipo != 0 ? ('NOTIF_TIPO = '.$notif_tipo) : ('NOTIF_TIPO = NOTIF_TIPO'))
                                        ->whereRaw($numero != "0" ? ('NUMERO = '.$numero) : ('NUMERO = NUMERO'))
                                        ->whereRaw($notif_tipo_doc != 0 ? ('NOTIF_TIPO_DOC = '.$notif_tipo_doc) : ('NOTIF_TIPO_DOC = NOTIF_TIPO_DOC'))
                                        ->whereRaw($notif_numero_doc != "0" ? ('NOTIF_NUMERO_DOC = '.$notif_numero_doc) : ('NOTIF_NUMERO_DOC = NOTIF_NUMERO_DOC'))
                                        ->whereRaw($estado != 0 ? ('NOTIF_ESTADO = '.$estado) : ('NOTIF_ESTADO = NOTIF_ESTADO'))
                                        ->orderBy('notificacion', 'asc')
                                        ->get();

        return response()->json(['notificaciones' => $notificaciones]);
    }
}
