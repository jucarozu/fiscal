<?php

namespace App\Http\Requests;

use App\Http\Requests\Request;

class DireccionAddForm extends Request
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
            'fuente' => 'required',
            'descripcion' => 'required',
        ];
    }

    public function messages()
    {
        return [
            'fuente.required' => 'Debe seleccionar una fuente.',
            'descripcion.required' => 'Debe ingresar una dirección.',
        ];
    }
}
