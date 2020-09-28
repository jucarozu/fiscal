<?php

namespace App\Http\Requests;

use App\Http\Requests\Request;

class FuenteAddForm extends Request
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'tipo' => 'required',
            'nombre' => 'required|unique:fuente_evidencia,nombre',
            'proveedor' => 'required',
            'desde' => 'required',
            'referencia_ubicacion' => 'required',
        ];
    }

    public function messages()
    {
        return [
            'tipo.required' => 'Debe seleccionar un tipo de fuente de evidencia.',
            'nombre.required' => 'Debe ingresar un nombre.',
            'nombre.unique' => 'Ya existe una fuente de evidencia con el nombre ingresado.',
            'proveedor.required' => 'Debe seleccionar un proveedor.',
            'desde.required' => 'Debe indicar una fecha inicial de activación.',
            'referencia_ubicacion.required' => 'Debe ingresar una referencia de ubicación.',
        ];
    }
}
