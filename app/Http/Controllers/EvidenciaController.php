<?php

namespace App\Http\Controllers;

use Illuminate\Support\Collection as Collection;

use App\Http\Requests;
use Illuminate\Http\Request;
use App\Http\Requests\EvidenciaAddForm;

use App\Models\Deteccion;
use App\Models\Evidencia;

use App\Services\EvidenciaService;
use App\Services\GeneralService;

use Storage;
use FFMpeg;

class EvidenciaController extends Controller
{
    protected $evidenciaService;

    public function __construct(EvidenciaService $evidenciaService)
    {
        $this->evidenciaService = $evidenciaService;
    }

    /**
     * Obtiene el listado de evidencias.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $evidencias = Evidencia::all();
        return response()->json(['evidencias' => $evidencias]);
    }

    /**
     * Obtiene la evidencia especificada.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $evidencia = Evidencia::find($id);
        return response()->json(['evidencia' => $evidencia]);
    }

    /**
     * Registra una nueva evidencia.
     *
     * @param  \App\Http\Requests\EvidenciaAddForm  $request
     * @return \Illuminate\Http\Response
     */
    public function store(EvidenciaAddForm $request)
    {
        $evidenciaForm = [
            'deteccion' => $request->input('deteccion'),
            'nombre_archivo' => $request->input('nombre_archivo'),
            'tamano_kb' => $request->input('tamano_kb'),
            'tipo_archivo' => $request->input('tipo_archivo'),
            'array_bytes' => $request->input('array_bytes'),
        ];

        if (! $evidencia = $this->insertEvidencia($evidenciaForm))
        {
            return response()->json(['estado' => 'ERROR', 'mensaje' => 'Error al registrar evidencia asociada a la detección ' . $request->input('deteccion')], 500);
        }

        return response()->json(['estado' => 'OK', 'mensaje' => 'Evidencia registrada', 'evidencia' => $evidencia->evidencia]);
    }

    /**
     * Recorta una sección de la evidencia especificada y la asocia a la detección como una evidencia nueva.
     *
     * @param  \App\Http\Requests\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function recortarEvidencia(Request $request)
    {
        try
        {
            // Se crea la estructura de los datos del recorte.
            $recorteForm = [
                'is_video' => $request->input('is_video'),
                'time' => $request->input('time'),
                'x1' => $request->input('x1'),
                'y1' => $request->input('y1'),
                'width' => $request->input('width'),
                'height' => $request->input('height')
            ];

            // Se define la carpeta donde se almacenará temporalmente el recorte.
            $carpeta = 'evidencias';

            // Se obtiene la extensión del archivo a partir del nombre original.
            $archivo_original = explode('.', $request->input('nombre_archivo'));
            $extension = end($archivo_original);

            // Se establece el nombre del archivo del recorte.
            if ($request->input('is_video') == 'false')
            {
                // Si es una imagen se obtiene la extensión del archivo original.
                $nombre_archivo = $request->input('evidencia') . '_placa.' . $extension;
            }
            else
            {
                // Si es un video se asigna una extensión predeterminada.
                $nombre_archivo = $request->input('evidencia') . '_placa.' . 'jpg';
            }

            // Se obtiene la ruta donde se encuentra almacenada la evidencia a recortar.
            $ruta_evidencia = $request->input('ruta') . str_pad($request->input('evidencia'), 10, '0', STR_PAD_LEFT) . '.' . $extension;

            // Se envía la información necesaria para recortar la imagen de la evidencia.
            if (! $ruta_recorte = $this->recortarImagen($recorteForm, $carpeta, $nombre_archivo, $ruta_evidencia, $request->input('deteccion')))
            {
                return response()->json(['estado' => 'ERROR', 'mensaje' => 'Error al recortar la imagen de la evidencia asociada a la detección ' . $request->input('deteccion')], 500);
            }
        }
        catch(\Exception $e)
        {
            return response()->json(['estado' => 'ERROR', 'mensaje' => 'Error al recortar la imagen de la evidencia asociada a la detección ' . $request->input('deteccion')], 500);
        }

        try
        {
            // Se crea la estructura de los datos de la evidencia.
            $evidenciaForm = [
                'deteccion' => $request->input('deteccion'),
                'nombre_archivo' => $nombre_archivo,
                'tamano_kb' => filesize($ruta_recorte) / 1024,
                'tipo_archivo' => 1,
                'array_bytes' => rawurlencode(base64_encode(file_get_contents($ruta_recorte))),
                'placa' => 1
            ];

            // Se elimina el archivo del recorte almacenado de manera temporal.
            unlink($ruta_recorte);

            // Se registra la evidencia.
            if (! $evidencia = $this->insertEvidencia($evidenciaForm))
            {
                return response()->json(['estado' => 'ERROR', 'mensaje' => 'Error al registrar evidencia asociada a la detección ' . $request->input('deteccion')], 500);
            }
        }
        catch(\Exception $e)
        {
            return response()->json(['estado' => 'ERROR', 'mensaje' => 'Error al registrar evidencia asociada a la detección ' . $request->input('deteccion')], 500);
        }

        try
        {
            // Si la evidencia base del recorte es una imagen se procede a marcarla como principal.
            if ($recorteForm['is_video'] == 'false')
            {
                // Se crea la estructura de los datos de la evidencia.
                $evidenciaForm = [
                    'evidencia' => $request->input('evidencia'),
                    'deteccion' => $request->input('deteccion'),
                    'principal' => 1
                ];

                // Se marca la evidencia base del recorte de la placa como evidencia principal de la detección.
                if (!$this->updateEvidencia($evidenciaForm))
                {
                    return response()->json(['estado' => 'ERROR', 'mensaje' => 'Error al marcar evidencia base como principal en la detección ' . $request->input('deteccion')], 500);
                }
            }
        }
        catch(\Exception $e)
        {
            return response()->json(['estado' => 'ERROR', 'mensaje' => 'Error al marcar evidencia base como principal en la detección ' . $request->input('deteccion')], 500);
        }

        return response()->json(['estado' => 'OK', 'mensaje' => 'Evidencia registrada', 'evidencia' => $evidencia->evidencia]);
    }

    /**
     * Recorta una sección de la evidencia especificada y la asocia a la detección como una evidencia nueva.
     *
     * @param  \App\Http\Requests\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function recortarImagen($recorteForm, $carpeta, $nombre_archivo, $ruta_evidencia, $deteccion)
    {
        try
        {
            // Ubicación del archivo original de la evidencia a recortar.
            $ruta = $ruta_evidencia;

            // Si la evidencia es de tipo video, se almacena una imagen de la captura del fotograma a recortar.
            if ($recorteForm['is_video'] == 'true')
            {
                // Obtener el video.
                $ffmpeg = FFMpeg\FFMpeg::create([
                    'ffmpeg.binaries'  => 'C:/FFmpeg/bin/ffmpeg.exe', // the path to the FFMpeg binary
                    'ffprobe.binaries' => 'C:/FFmpeg/bin/ffprobe.exe', // the path to the FFProbe binary
                    'timeout'          => 3600, // the timeout for the underlying process
                    'ffmpeg.threads'   => 12,   // the number of threads that FFMpeg should use
                ]);

                $video = $ffmpeg->open($ruta);

                // Capturar una imagen del video en el tiempo especificado.
                $ruta = Storage::disk($carpeta)->getDriver()->getAdapter()->getPathPrefix() . "img-video.jpg";
                $frame = $video->frame(FFMpeg\Coordinate\TimeCode::fromSeconds($recorteForm['time']));
                $frame->save($ruta);
            }
            
            // Ancho y alto del recorte.
            $ancho_recorte = $recorteForm['width'];
            $alto_recorte = $recorteForm['height'];

            // Coordenadas del punto de inicio del recorte.
            $x1 = $recorteForm['x1'];
            $y1 = $recorteForm['y1'];

            // Extensión del archivo de la imagen original.
            $array_ruta = explode('.', $ruta);
            $extension = end($array_ruta);

            // Obtener la imagen original.
            switch ($extension)
            {
                case 'jpg':
                    $img_original = imagecreatefromjpeg($ruta);
                    break;
                case 'png':
                    $img_original = imagecreatefrompng($ruta);
                    break;
            }

            // Definir parámetros para escalar la imagen recortada.
            $scaleX = 300 / $ancho_recorte;
            $scaleY = 200 / $alto_recorte;

            $ancho_redim = round($scaleX * 600);
            $alto_redim = round($scaleY * 400);

            $x1 = round($scaleX * $x1) * (-1);
            $y1 = round($scaleY * $y1) * (-1);

            // Redimensionar la imagen original de manera proporcional a la escala del recorte.
            list($ancho_original, $alto_original) = getimagesize($ruta);
            $img_redim = imagecreatetruecolor($ancho_redim, $alto_redim);
            imagecopyresampled($img_redim, $img_original, 0, 0, 0, 0, $ancho_redim, $alto_redim, $ancho_original, $alto_original);

            $ancho_recorte = $ancho_redim;
            $alto_recorte = $alto_redim;
            
            // Aplicar el recorte a la imagen original.
            if ($recorteForm['is_video'] == 'true')
            {
                // Guardar una nueva evidencia de tipo imagen a partir del fotograma del video a recortar y marcarla como evidencia principal.
                $evidenciaForm = [
                    'deteccion' => $deteccion,
                    'nombre_archivo' => 'img_video_principal.jpg',
                    'tamano_kb' => filesize($ruta) / 1024,
                    'tipo_archivo' => 1,
                    'array_bytes' => rawurlencode(base64_encode(file_get_contents($ruta))),
                    'principal' => 1
                ];

                if (! $evidencia = $this->insertEvidencia($evidenciaForm))
                {
                    return false;
                }

                // Se elimina la imagen de la captura del fotograma a recortar.
                unlink($ruta);
            }
            
            // Generar una nueva imagen con el ancho y alto del recorte a partir de la imagen original redimensionada.
            $img_recortada = imagecreatetruecolor(300, 200);
            imagecopyresampled($img_recortada, $img_redim, $x1, $y1, 0, 0, $ancho_recorte, $alto_recorte, $ancho_recorte, $alto_recorte);
            

            // Especificar la ruta donde se almacenará la imagen recortada.
            $ruta = Storage::disk($carpeta)->getDriver()->getAdapter()->getPathPrefix() . $nombre_archivo;

            // Guardar la imagen recortada.
            switch ($extension)
            {
                case 'jpg':
                    header('Content-type: image/jpeg');
                    imagejpeg($img_recortada, $ruta);
                    break;
                case 'png':
                    header('Content-type: image/png');
                    imagepng($img_recortada, $ruta);
                    break;
            }
        }
        catch(\Exception $e)
        {
            return false;
        }

        return $ruta;
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \App\Http\Requests\EvidenciaAddForm  $request
     * @return \Illuminate\Http\Response
     */
    public function insertEvidencia($evidenciaForm)
    {
        try
        {
            // Se obtiene la fecha de la detección y la ruta de las evidencias.
            $deteccion = Deteccion::find($evidenciaForm['deteccion']);

            if (!is_null($deteccion))
            {
                $fechaDeteccion = explode("-", GeneralService::getFechaFormato('Y-m-d', strtotime($deteccion->fecha)));
                $directorio = $fechaDeteccion[0] . "\\" . $fechaDeteccion[1] . "\\" . $fechaDeteccion[2];
                $ruta = Storage::disk('evidencias')->getDriver()->getAdapter()->getPathPrefix() . $directorio . "\\";
            }
            else
            {
                return false;
            }
        }
        catch(\Exception $e)
        {
            return false;
        }

        try
        {
            // Se guardan los datos de la evidencia.
            $evidencia = new Evidencia();
            $evidencia->deteccion = $evidenciaForm['deteccion'];
            $evidencia->ruta = $ruta;
            $evidencia->nombre_archivo = $evidenciaForm['nombre_archivo'];
            $evidencia->tamano_kb = $evidenciaForm['tamano_kb'];
            $evidencia->tipo_archivo = $evidenciaForm['tipo_archivo'];
            $evidencia->principal = isset($evidenciaForm['principal']) ? $evidenciaForm['principal'] : null;
            $evidencia->placa = isset($evidenciaForm['placa']) ? $evidenciaForm['placa'] : null;
            $evidencia->save();

            // Se decodifica la URL y se convierte la cadena de bytes de la evidencia a archivo binario.
            $array_bytes = base64_decode(rawurldecode($evidenciaForm['array_bytes']));

            // Se obtiene la extensión del archivo.
            $archivo = explode('.', $evidenciaForm['nombre_archivo']);
            $extension = end($archivo);

            // Se crea el nombre del archivo a partir del código de la evidencia y la extensión.
            $nombre_archivo = str_pad($evidencia->evidencia, 10, '0', STR_PAD_LEFT) . '.' . $extension;
            
            // Se crean las carpetas YYYY/MM/DD en la ruta de las evidencias y se guarda el archivo.
            Storage::makeDirectory($directorio);
            Storage::disk('evidencias')->put($directorio. "\\" .$nombre_archivo, $array_bytes);
        }
        catch(\Exception $e)
        {
            if (!is_null($evidencia->evidencia))
            {
                $this->rollback($evidencia);
            }
            
            return false;
        }

        return $evidencia;
    }

    public function updateEvidencia($evidenciaForm)
    {
        try
        {
            // Se actualizan los datos de la evidencia para marcarla como evidencia principal de la detección.
            $evidencia = Evidencia::find($evidenciaForm['evidencia']);
            $evidencia->deteccion = $evidenciaForm['deteccion'];
            $evidencia->principal = isset($evidenciaForm['principal']) ? $evidenciaForm['principal'] : null;
            $evidencia->save();
        }
        catch(\Exception $e)
        {
            if (!is_null($evidencia->evidencia))
            {
                $this->rollback($evidencia);
            }
            
            return false;
        }

        return true;
    }

    /**
     * Display a listing of the parameters by resource.
     *
     * @param  int  $deteccion
     * @return \Illuminate\Http\Response
     */
    public function getByDeteccion($deteccion)
    {
        $evidencias = $this->evidenciaService->getByDeteccion($deteccion);
        return response()->json(['evidencias' => $evidencias]);
    }

    /**
     * Revierte el proceso de almacenamiento de la evidencia.
     *
     * @param  \App\Http\Requests\EvidenciaAddForm  $request
     * @return \Illuminate\Http\Response
     */
    public function rollback($evidencia)
    {
        // Se elimina el registro de la evidencia en base de datos.
        Evidencia::find($evidencia->evidencia)->delete();
        
        // Se elimina el archivo asociado a la evidencia en el almacenamiento físico.
        $archivo = explode(".", $evidencia->nombre_archivo);
        $extension = $archivo[count($archivo) - 1];
        $nombre_archivo = str_pad($evidencia->evidencia, 10, '0', STR_PAD_LEFT) . '.' . $extension;
        unlink($evidencia->ruta . $nombre_archivo);
    }
}
