<?php

namespace App\Http\Requests;

use App\Http\Requests\Request;

class PropietarioAddForm extends Request
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
            'placa' => 'required',
            'fuente' => 'required',
            'tipo' => 'required',
            'desde' => 'required',
            'locatario' => 'different:persona',
        ];
    }

    public function messages()
    {
        return [
            'placa.required' => 'Debe ingresar la placa.',
            'fuente.required' => 'Debe seleccionar una fuente.',
            'tipo.required' => 'Debe seleccionar un tipo de propietario.',
            'desde.required' => 'Debe indicar la fecha de inicio del propietario.',
            'locatario.different' => 'El locatario debe ser diferente del propietario.',
        ];
    }
}
