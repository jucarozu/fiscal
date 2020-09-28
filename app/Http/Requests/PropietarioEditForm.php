<?php

namespace App\Http\Requests;

use App\Http\Requests\Request;

class PropietarioEditForm extends Request
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
            'tipo' => 'required',
            'locatario' => 'different:persona',
        ];
    }

    public function messages()
    {
        return [
            'fuente.required' => 'Debe seleccionar una fuente.',
            'tipo.required' => 'Debe seleccionar un tipo de propietario.',
            'locatario.different' => 'El locatario debe ser diferente del propietario.',
        ];
    }
}
