<?php

namespace App\Http\Controllers;

use App\Http\Requests;
use Illuminate\Http\Request;
use App\Http\Requests\DeteccionAddForm;

use App\Models\Deteccion;
use App\Models\VTDeteccion;
use App\Models\Evidencia;
use App\Models\InfraDeteccion;
use App\Models\VTUsuarioRol;

use App\Services\DeteccionService;

use Storage;

class DeteccionController extends Controller
{
    protected $deteccionService;

    public function __construct(DeteccionService $deteccionService)
    {
        $this->deteccionService = $deteccionService;
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $detecciones = VTDeteccion::all();
        return response()->json(['detecciones' => $detecciones]);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $deteccion = VTDeteccion::find($id);
        return response()->json(['deteccion' => $deteccion]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \App\Http\Requests\DeteccionAddForm  $request
     * @return \Illuminate\Http\Response
     */
    public function store(DeteccionAddForm $request)
    {
        try
        {
            // Se valida que existan evidencias asociadas a la detección.
            if (is_null($request->input('evidencias')))
            {
                return response()->json(['estado' => 'ERROR', 'mensaje' => 'No existen evidencias asociadas a la detección.'], 500);
            }

            // Se decodifica el JSON a un array con los datos de las evidencias y se asocia a la detección.
            $evidencias = json_decode(stripslashes($request->input('evidencias')));
        }
        catch(\Exception $e)
        {
            return response()->json(['estado' => 'ERROR', 'mensaje' => 'El listado de evidencias asociadas a la detección no cumple con el formato especificado.'], 500);
        }
        
        try
        {
            // Se valida que existan infracciones asociadas a la detección.
            if (is_null($request->input('infracciones')))
            {
                return response()->json(['estado' => 'ERROR', 'mensaje' => 'No existen infracciones asociadas a la detección.'], 500);
            }

            // Se decodifica el JSON a un array con los datos de las infracciones y se asocia a la detección.
            $infracciones = json_decode(stripslashes($request->input('infracciones')));
        }
        catch(\Exception $e)
        {
            return response()->json(['estado' => 'ERROR', 'mensaje' => 'El listado de infracciones asociadas a la detección no cumple con el formato especificado.'], 500);
        }

        try
        {
            // Se guardan los datos de la detección.
            $deteccion = new Deteccion();
            $deteccion->fecha = $request->input('fecha') . ' ' . $request->input('hora');
            $deteccion->estado = 1;
            $deteccion->fuente = $request->input('fuente');
            $deteccion->referencia_disp = $request->input('referencia_disp');
            $deteccion->latitud = $request->input('latitud');
            $deteccion->longitud = $request->input('longitud');
            $deteccion->direccion = $request->input('direccion');
            $deteccion->complemento_direccion = $request->input('complemento_direccion');
            $deteccion->placa = $request->input('placa');
            $deteccion->tipo_vehiculo = $request->input('tipo_vehiculo');
            $deteccion->color = $request->input('color');
            $deteccion->servicio = $request->input('servicio');
            $deteccion->nivel = $request->input('nivel');
            $deteccion->carril = $request->input('carril');
            $deteccion->sentido = $request->input('sentido');
            $deteccion->velocidad = $request->input('velocidad');
            $deteccion->unidad_velocidad = $request->input('unidad_velocidad');
            $deteccion->observaciones = $request->input('observaciones');
            $deteccion->modo_carga = $request->input('modo_carga');
            $deteccion->usuario = $request->input('usuario');
            $deteccion->direccion_ip = $_SERVER['REMOTE_ADDR'];
            $deteccion->save();
        }
        catch(\Exception $e)
        {
            if (!is_null($deteccion->deteccion))
            {
                $this->rollback($deteccion);
            }

            return response()->json(['estado' => 'ERROR', 'mensaje' => 'Error al registrar la detección.'], 500);
        }

        // Se guardan los datos de las evidencias.
        if (!empty($evidencias))
        {
            try
            {
                // Se obtiene la fecha de la detección y la ruta de las evidencias.
                $fechaDeteccion = explode("-", $request->input('fecha'));
                $directorio = $fechaDeteccion[0] . "\\" . $fechaDeteccion[1] . "\\" . $fechaDeteccion[2];
                $ruta = Storage::disk('evidencias')->getDriver()->getAdapter()->getPathPrefix() . $directorio . "\\";

                foreach ($evidencias as $evid)
                {
                    // Se guarda el registro de la evidencia en base de datos.
                    $evidencia = new Evidencia();
                    $evidencia->deteccion = $deteccion->deteccion;
                    $evidencia->ruta = $ruta;
                    $evidencia->nombre_archivo = $evid->nombre_archivo;
                    $evidencia->tamano_kb = $evid->tamano_kb;
                    $evidencia->tipo_archivo = $evid->tipo_archivo;
                    $evidencia->save();

                    // Se decodifica la URL y se convierte la cadena de bytes de la evidencia a archivo binario.
                    $imgEvidencia = base64_decode(rawurldecode($evid->array_bytes));

                    // Se obtiene la extensión del archivo.
                    $archivo = explode(".", $evid->nombre_archivo);
                    $extension = end($archivo);

                    // Se crea el nombre del archivo a partir del código de la evidencia y la extensión.
                    $nombre_archivo = str_pad($evidencia->evidencia, 10, '0', STR_PAD_LEFT) . '.' . $extension;
                    
                    // Se crean las carpetas YYYY/MM/DD en la ruta de las evidencias y se guarda el archivo.
                    Storage::makeDirectory($directorio);
                    Storage::disk('evidencias')->put($directorio . "\\" . $nombre_archivo, $imgEvidencia);
                }
            } 
            catch(\Exception $e)
            {
                if (!is_null($deteccion->deteccion))
                {
                    $this->rollback($deteccion);
                }

                return response()->json(['estado' => 'ERROR', 'mensaje' => 'Error al registrar las evidencias asociadas a la detección.'], 500);
            }
        }

        // Se guardan los datos de las infracciones.
        if (!empty($infracciones))
        {
            try
            {
                foreach ($infracciones as $infra)
                {
                    // Se guarda el registro de la infracción en base de datos.
                    $infraDeteccion = new InfraDeteccion();
                    $infraDeteccion->deteccion = $deteccion->deteccion;
                    
                    $infraccionController = new InfraccionController();
                    $infraDeteccion->infraccion = $infraccionController->getByCodigo($infra->codigo)->infraccion;
                    
                    $infraDeteccion->observacion = $infra->observacion;
                    $infraDeteccion->save();
                }
            }
            catch(\Exception $e)
            {
                if (!is_null($deteccion->deteccion))
                {
                    $this->rollback($deteccion);
                }

                return response()->json(['estado' => 'ERROR', 'mensaje' => 'Error al registrar las infracciones asociadas a la detección.'], 500);
            }
        }

        return response()->json(['estado' => 'OK', 'mensaje' => 'Detección registrada', 'deteccion' => $deteccion->deteccion]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \App\Http\Requests\DeteccionAddForm  $request
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        try
        {
            $deteccion = array(
                'fecha' => $request->input('fecha') != null ? $request->input('fecha') : null,
                'hora' => $request->input('hora') != null ? $request->input('hora') : null,
                'estado' => $request->input('estado') != null ? $request->input('estado') : null,
                'fuente' => $request->input('fuente') != null ? $request->input('fuente') : null,
                'referencia_disp' => $request->input('referencia_disp') != null ? $request->input('referencia_disp') : null,
                'latitud' => $request->input('latitud') != null ? $request->input('latitud') : null,
                'longitud' => $request->input('longitud') != null ? $request->input('longitud') : null,
                'direccion' => $request->input('direccion') != null ? $request->input('direccion') : null,
                'complemento_direccion' => $request->input('complemento_direccion') != null ? $request->input('complemento_direccion') : null,
                'placa' => $request->input('placa') != null ? $request->input('placa') : null,
                'tipo_vehiculo' => $request->input('tipo_vehiculo') != null ? $request->input('tipo_vehiculo') : null,
                'color' => $request->input('color') != null ? $request->input('color') : null,
                'servicio' => $request->input('servicio') != null ? $request->input('servicio') : null,
                'nivel' => $request->input('nivel') != null ? $request->input('nivel') : null,
                'carril' => $request->input('carril') != null ? $request->input('carril') : null,
                'sentido' => $request->input('sentido') != null ? $request->input('sentido') : null,
                'velocidad' => $request->input('velocidad') != null ? $request->input('velocidad') : null,
                'unidad_velocidad' => $request->input('unidad_velocidad') != null ? $request->input('unidad_velocidad') : null,
                'observaciones' => $request->input('observaciones') != null ? $request->input('observaciones') : null
            );
            
            if (!$this->deteccionService->update($deteccion, $id))
            {
                return response()->json(['estado' => 'ERROR', 'mensaje' => 'Error al actualizar la detección.'], 500);
            }
        }
        catch(\Exception $e)
        {
            return response()->json(['estado' => 'ERROR', 'mensaje' => 'Error al actualizar la detección.'], 500);
        }

        return response()->json(['estado' => 'OK', 'mensaje' => 'Detección actualizada', 'deteccion' => $id]);
    }

    /**
     * Display the specified resource by filters.
     *
     * @param  int  $fuente
     * @param  int  $estado
     * @return \Illuminate\Http\Response
     */
    public function getByFilters($fuente, $estado)
    {
        $detecciones = VTDeteccion::whereRaw($fuente != 0 ? ('FUENTE = '.$fuente) : ('FUENTE = FUENTE'))
                                  ->whereRaw($estado != 0 ? ('ESTADO = '.$estado) : ('ESTADO = ESTADO'))
                                  ->orderBy('fecha')
                                  ->get();

        return response()->json(['detecciones' => $detecciones]);
    }

    public function rollback($deteccion)
    {
        $evidencias = Evidencia::where('deteccion', $deteccion->deteccion)->get();

        foreach ($evidencias as $evid)
        {
            Evidencia::find($evid->evidencia)->delete();
            
            $archivo = explode(".", $evid->nombre_archivo);
            $extension = $archivo[count($archivo) - 1];
            $nombre_archivo = str_pad($evid->evidencia, 10, '0', STR_PAD_LEFT) . '.' . $extension;
            unlink($evid->ruta . $nombre_archivo);
        }

        InfraDeteccion::where('deteccion', $deteccion->deteccion)->delete();
        Deteccion::find($deteccion->deteccion)->delete();
    }
}
