<?php

namespace App\Http\Requests;

use App\Http\Requests\Request;

class DeteccionAddForm extends Request
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
            'fecha' => 'required',
            'fuente' => 'required',
            'referencia_disp' => 'required',
            'direccion' => 'required',
            'sentido' => 'required',
        ];
    }

    public function messages()
    {
        return [
            'fecha.required' => 'Debe indicar la fecha de la detección.',
            'fuente.required' => 'Debe seleccionar una fuente de evidencias.',
            'referencia_disp.required' => 'Debe ingresar la referencia del dispositivo.',
            'direccion.required' => 'Debe ingresar una dirección.',
            'sentido.required' => 'Debe seleccionar un sentido.',
        ];
    }
}
