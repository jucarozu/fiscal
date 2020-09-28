<?php

namespace App\Http\Controllers;

use App\Http\Requests;
use Illuminate\Http\Request;
use App\Http\Requests\AgenteAddForm;
use App\Http\Requests\AgenteEditForm;

use App\Models\Agente;
use App\Models\VTAgente;
use App\Models\Firma;

use Storage;
use File;

class AgenteController extends Controller
{
    /**
     * Display a listing of items.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $agentes = VTAgente::all();
        return response()->json(['agentes' => $agentes]);
    }

    /**
     * Display the specified item.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $agente = VTAgente::find($id);
        return response()->json(['agente' => $agente]);
    }

    /**
     * Store a newly created item in storage.
     *
     * @param  \App\Http\Requests\AgenteAddForm  $request
     * @return \Illuminate\Http\Response
     */
    public function store(AgenteAddForm $request)
    {
        if ($request->ajax())
        {
            $agente = new Agente();
            $agente->persona = $request->input('persona');
            $agente->entidad = $request->input('entidad');
            $agente->placa = $request->input('placa');
            $agente->estado = 1;
            $agente->usuario_registra = $request->input('usuario_registra');
            
            if (!$agente->save())
            {
                return response()->json(['error' => 'internal_error'], 500);
            }

            if (Storage::exists("firma.jpg"))
            {
                $firma = new Firma();
                $firma->persona = $request->input('persona');
                $firma->firma = base64_encode(file_get_contents(storage_path('app/local/firma.jpg')));
                $firma->usuario_registra = $request->input('usuario_registra');
                
                if (!$firma->save())
                {
                    return response()->json(['error' => 'internal_error'], 500);
                }
            }

            return response()->json(['mensaje' => 'Agente registrado', 'agente' => $agente]);
        }
    }

    /**
     * Update the specified item in storage.
     *
     * @param  \App\Http\Requests\AgenteEditForm  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(AgenteEditForm $request, $id)
    {
        if ($request->ajax())
        {
            $agente = Agente::find($id);
            $agente->entidad = $request->input('entidad');
            $agente->placa = $request->input('placa');

            if (!$agente->save())
            {
                return response()->json(['error' => 'internal_error'], 500);
            }

            if (Storage::exists("firma.jpg"))
            {
                $firma = Firma::find($agente->persona);
                $firma->firma = base64_encode(file_get_contents(storage_path('app/local/firma.jpg')));
                $firma->usuario_registra = $request->input('usuario_registra');

                if (!$firma->save())
                {
                    return response()->json(['error' => 'internal_error'], 500);
                }
            }

            return response()->json(['mensaje' => 'Agente actualizado', 'agente' => $agente]);
        }
    }

    /**
     * Deactivate the specified item.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $agente = Agente::find($id);
        $agente->estado = 2;
        
        if (!$agente->save())
        {
            return response()->json(['error' => 'Error al inactivar el agente'], 500);
        }

        return response()->json(['mensaje' => 'Agente inactivado']);
    }

    /**
     * Display the specified item by filters.
     *
     * @param  int  $entidad
     * @param  int  $placa
     * @param  int  $tipo_doc
     * @param  int  $numero_doc
     * @param  int  $nombres_apellidos
     * @param  int  $estado
     * @return \Illuminate\Http\Response
     */
    public function getByFilters($entidad, $placa, $tipo_doc, $numero_doc, $nombres_apellidos, $estado)
    {
        $agentes = VTAgente::whereRaw($entidad != 0 ? ('ENTIDAD = '.$entidad) : ('ENTIDAD = ENTIDAD'))
                           ->whereRaw($placa != "0" ? ('LOWER(PLACA) LIKE \'%'.strtolower($placa).'%\'') : ('PLACA = PLACA'))
                           ->whereRaw($tipo_doc != 0 ? ('TIPO_DOC = '.$tipo_doc) : ('TIPO_DOC = TIPO_DOC'))
                           ->whereRaw($numero_doc != "0" ? ('NUMERO_DOC = '.$numero_doc) : ('NUMERO_DOC = NUMERO_DOC'))
                           ->whereRaw($nombres_apellidos != "0" ? ('LOWER(NOMBRES_APELLIDOS) LIKE \'%'.strtolower($nombres_apellidos).'%\'') : ('NOMBRES_APELLIDOS = NOMBRES_APELLIDOS'))
                           ->whereRaw($estado != 0 ? ('ESTADO = '.$estado) : ('ESTADO = ESTADO'))
                           ->orderBy('nombres_apellidos')
                           ->get();

        return response()->json(['agentes' => $agentes]);
    }

    public function getByUsuario($usuario)
    {
        $agente = VTAgente::where('usuario', $usuario)
                          ->get()
                          ->first();

        return response()->json(['agente' => $agente]);
    }

    public function cargarFirma(Request $request)
    {
        $firma = $request->file('file');
        $nombre = "firma.jpg";
        Storage::disk('local')->put($nombre, File::get($firma));

        return response()->json(['mensaje' => 'Firma cargada']);
    }

    public function mostrarFirma($persona)
    {
        $firma = Firma::find($persona);
        $imgFirma = imagecreatefromstring(base64_decode($firma->firma));

        if ($imgFirma !== false)
        {
            header('Content-Type: image/jpeg');
            imagejpeg($imgFirma);
            imagedestroy($imgFirma);
        }
    }

    public function borrarFirma()
    {
        if (Storage::exists('firma.jpg'))
        {
            unlink(storage_path('app/local/firma.jpg'));
        }

        return response()->json(['mensaje' => 'Firma borrada']);
    }
}