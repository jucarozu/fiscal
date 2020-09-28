<?php

namespace App\Http\Requests;

use App\Http\Requests\Request;

class PersonaEditForm extends Request
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
            'nombres' => 'required',
            'apellidos' => 'required',
            'email' => 'email|unique:persona,email,'.$this->persona.',persona',
            'numero_celular' => 'numeric',
        ];
    }

    public function messages()
    {
        return [
            'nombres.required' => 'El nombre es obligatorio.',

            'apellidos.required' => 'El apellido es obligatorio.',

            'email.email' => 'Debe especificar un email válido.',
            'email.unique' => 'El email ya se encuentra registrado.',

            'numero_celular.numeric' => 'El teléfono móvil debe ser numérico.',
        ];
    }
}
