<?php

namespace App\Http\Requests;

use App\Http\Requests\Request;

class FuenteEditForm extends Request
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
            'desde' => 'required',
            'referencia_ubicacion' => 'required',
        ];
    }

    public function messages()
    {
        return [
            'desde.required' => 'Debe indicar una fecha inicial de activación.',
            'referencia_ubicacion.required' => 'Debe ingresar una referencia de ubicación.',
        ];
    }
}
