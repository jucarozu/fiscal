<?php

namespace App\Http\Requests;

use App\Http\Requests\Request;

class UsuarioAddForm extends Request
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
            'login' => 'required|unique:usuario,login,NULL,usuario,estado,1',
            'email' => 'required|email|unique:usuario,email,NULL,usuario,estado,1',
        ];
    }

    public function messages()
    {
        return [
            'login.required' => 'El nombre de usuario es obligatorio.',
            'login.unique' => 'El nombre de usuario ya se encuentra registrado.',

            'email.required' => 'El email es obligatorio.',
            'email.email' => 'Debe especificar un email válido.',
            'email.unique' => 'El email ya se encuentra registrado.',
        ];
    }
}