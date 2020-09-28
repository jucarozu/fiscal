<?php

namespace App\Http\Requests;

use App\Http\Requests\Request;

class InfraccionEditForm extends Request
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
            'descripcion' => 'required',
            'salarios_dia' => 'required',
            'salarios_dia' => 'required|regex:[\d{1,6}(\.\d{1,2})?]',
        ];
    }

    public function messages()
    {
        return [
            'descripcion.required' => 'Debe ingresar una descripción.',
            'salarios_dia.required' => 'Debe ingresar la cantidad de salarios diarios a los que equivale la infracción.',
            'salarios_dia.regex' => 'La cantidad de salarios diarios debe ser un número positivo con máximo dos decimales.',
        ];
    }
}
