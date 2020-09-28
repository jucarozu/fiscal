<?php

namespace App\Http\Requests;

use App\Http\Requests\Request;

class UsuarioEditForm extends Request
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
            'email' => 'required|email|unique:usuario,email,'.$this->usuario.',usuario,estado,1',
        ];
    }

    public function messages()
    {
        return [
            'email.required' => 'El email es obligatorio.',
            'email.email' => 'Debe especificar un email válido.',
            'email.unique' => 'El email ya se encuentra registrado.',
        ];
    }
}