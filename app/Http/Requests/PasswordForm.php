<?php

namespace App\Http\Requests;

use App\Http\Requests\Request;

use App\Models\Usuario;

use Hash;

class PasswordForm extends Request
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
            'password_actual' => 'required',
            'password_actual_hashed' => 'exists:usuario,contrasena,usuario,'.$this->usuario,
            'password_nueva' => 'bail|required|min:8|different:password_actual|confirmed',
            'password_nueva_confirmation' => 'required',
        ];
    }

    public function messages()
    {
        return [
            'password_actual.required' => 'Ingrese la contraseña actual.',
            
            'password_actual_hashed.exists' => 'La contraseña actual no es correcta.',

            'password_nueva.required' => 'Ingrese una nueva contraseña.',
            'password_nueva.min' => 'La nueva contraseña debe tener mínimo 8 caracteres.',
            'password_nueva.different' => 'La nueva contraseña debe ser diferente a la actual.',
            'password_nueva.confirmed' => 'Las contraseñas no coinciden.',

            'password_nueva_confirmation.required' => 'Confirme la nueva contraseña.',
        ];
    }

    public function all()
    {
        $input = parent::all();
        $input['password_actual_hashed'] = $input['password_actual'];

        $usuario = Usuario::find($input['usuario']);

        if (Hash::check($input['password_actual'], $usuario->contrasena))
        {
            $input['password_actual_hashed'] = $usuario->contrasena;
        }

        return $input;
    }
}
