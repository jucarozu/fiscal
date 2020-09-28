<?php

namespace App\Http\Controllers;

use App\Http\Requests;
use Illuminate\Http\Request;

use Storage;
use FFMpeg;
use File;

class CropController extends Controller
{
	/**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        // Ubicación del video.
        $ruta_video = Storage::disk('evidencias')->getDriver()->getAdapter()->getPathPrefix() . "\\videos\\video.mp4";

        // Obtener el video.
        $ffmpeg = FFMpeg\FFMpeg::create([
            'ffmpeg.binaries'  => 'C:/FFmpeg/bin/ffmpeg.exe', // the path to the FFMpeg binary
            'ffprobe.binaries' => 'C:/FFmpeg/bin/ffprobe.exe', // the path to the FFProbe binary
            'timeout'          => 3600, // the timeout for the underlying process
            'ffmpeg.threads'   => 12,   // the number of threads that FFMpeg should use
        ]);

        $video = $ffmpeg->open($ruta_video);

        // Capturar una imagen del video en el tiempo especificado.
        //$frame = $video->frame(FFMpeg\Coordinate\TimeCode::fromSeconds($_POST['time']));
        $frame = $video->frame(FFMpeg\Coordinate\TimeCode::fromSeconds(50));
        $frame->save(Storage::disk('evidencias')->getDriver()->getAdapter()->getPathPrefix() . "\\videos\\img-video.jpg");
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \App\Http\Requests\DeteccionAddForm  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
    	try
    	{
    		// Ubicación del archivo original.
			$ruta = Storage::disk('evidencias')->getDriver()->getAdapter()->getPathPrefix() . $request->input('ruta');

	    	if ($request->input('is_video') == 'true')
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
		        $ruta = Storage::disk('evidencias')->getDriver()->getAdapter()->getPathPrefix() . "\\videos\\img-video.jpg";
		        $frame = $video->frame(FFMpeg\Coordinate\TimeCode::fromSeconds($request->input('time')));
		        $frame->save($ruta);
	    	}
	        
	        // Ancho y alto del recorte.
			$ancho = $request->input('width');
			$alto = $request->input('height');

			// Coordenadas del punto de inicio del recorte.
			$x1 = $request->input('x1');
			$y1 = $request->input('y1');

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

			// Generar una nueva imagen con el ancho y alto del recorte.
			$img_recortada = imagecreatetruecolor($ancho, $alto);

			// Recortar la imagen original.
			imagecopyresampled($img_recortada, $img_original, 0, 0, $x1, $y1, $ancho, $alto, $ancho, $alto);

			// Especificar la ruta donde se almacenará la imagen recortada.
			if ($request->input('is_video') == 'true')
			{
				unlink($ruta);
				$ruta = Storage::disk('evidencias')->getDriver()->getAdapter()->getPathPrefix() . "\\videos\\img-recortada." . $extension;
			}
			else
			{
				$ruta = Storage::disk('evidencias')->getDriver()->getAdapter()->getPathPrefix() . "\\img\\img-recortada." . $extension;
			}			

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
            return response()->json(['mensaje' => $e->getMessage()], 500);
        }

        return response()->json(['mensaje' => 'Imagen recortada']);
    }
}
