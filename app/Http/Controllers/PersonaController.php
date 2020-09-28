<?php

namespace App\Http\Controllers;

use App\Http\Requests;
use App\Http\Requests\PersonaAddForm;
use App\Http\Requests\PersonaEditForm;

use App\Models\Persona;
use App\Models\VTPersona;

class PersonaController extends Controller
{
    /**
     * Display a listing of the persons.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $personas = VTPersona::all();
        return response()->json(['personas' => $personas]);
    }

    /**
     * Display the specified person.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $persona = VTPersona::find($id);
        return response()->json(['persona' => $persona]);
    }

    /**
     * Store a newly created person in storage.
     *
     * @param  \App\Http\Requests\PersonaAddForm  $request
     * @return \Illuminate\Http\Response
     */
    public function store(PersonaAddForm $request)
    {
        if ($request->ajax())
        {
            $persona = new Persona();
            $persona->tipo_doc = $request->input('tipo_doc');
            $persona->numero_doc = $request->input('numero_doc');
            $persona->fecha_exped_doc = $request->input('fecha_exped_doc');
            $persona->divipo_doc = $request->input('divipo_doc');
            $persona->nombres = strtoupper($request->input('nombres'));
            $persona->apellidos = strtoupper($request->input('apellidos'));
            $persona->email = $request->input('email');
            $persona->genero = $request->input('genero');
            $persona->grupo_sanguineo = $request->input('grupo_sanguineo');
            $persona->numero_celular = $request->input('numero_celular');
            $persona->usuario_registra = $request->input('usuario_registra');
            
            if ($persona->save())
            {
                return response()->json(['mensaje' => 'Persona registrada', 'persona' => $persona]);
            }
        }
    }

    /**
     * Update the specified person in storage.
     *
     * @param  \App\Http\Requests\PersonaEditForm  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(PersonaEditForm $request, $id)
    {
        if ($request->ajax())
        {
            $persona = Persona::find($id);
            $persona->fecha_exped_doc = $request->input('fecha_exped_doc');
            $persona->divipo_doc = $request->input('divipo_doc');
            $persona->nombres = strtoupper($request->input('nombres'));
            $persona->apellidos = strtoupper($request->input('apellidos'));
            $persona->email = $request->input('email');
            $persona->genero = $request->input('genero');
            $persona->grupo_sanguineo = $request->input('grupo_sanguineo');
            $persona->numero_celular = $request->input('numero_celular');
            
            if ($persona->save())
            {
                return response()->json(['mensaje' => 'Persona actualizada', 'persona' => $persona]);
            }
        }
    }

    /**
     * Display the specified person by filters.
     *
     * @param  int  $tipo_doc
     * @param  int  $numero_doc
     * @param  int  $nombres
     * @param  int  $apellidos
     * @return \Illuminate\Http\Response
     */
    public function getByFilters($tipo_doc, $numero_doc, $nombres, $apellidos)
    {
        $personas = VTPersona::whereRaw($tipo_doc != 0 ? ('TIPO_DOC = '.$tipo_doc) : ('TIPO_DOC = TIPO_DOC'))
                             ->whereRaw($numero_doc != "0" ? ('NUMERO_DOC = '.$numero_doc) : ('NUMERO_DOC = NUMERO_DOC'))
                             ->whereRaw($nombres != "0" ? ('LOWER(NOMBRES) LIKE \'%'.strtolower($nombres).'%\'') : ('NOMBRES = NOMBRES'))
                             ->whereRaw($apellidos != "0" ? ('LOWER(APELLIDOS) LIKE \'%'.strtolower($apellidos).'%\'') : ('APELLIDOS = APELLIDOS'))
                             ->orderBy('nombres')
                             ->orderBy('apellidos')
                             ->get();

        return response()->json(['personas' => $personas]);
    }

    /**
     * Display the specified person by document.
     *
     * @param  int  $tipo_doc
     * @param  int  $numero_doc
     * @return \Illuminate\Http\Response
     */
    public function getByDocumento($tipo_doc, $numero_doc)
    {
        $persona = VTPersona::where('tipo_doc', $tipo_doc)
                            ->where('numero_doc', $numero_doc)
                            ->get()
                            ->first();

        return response()->json(['persona' => $persona]);
    }
}
