<?php

namespace App\Http\Requests;

use App\Http\Requests\Request;

class RolEditForm extends Request
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
            // 'nombre' => 'required|unique:rol',
        ];
    }

    public function messages()
    {
        return [
            // 'nombre.required' => 'Debe ingresar el nombre del rol.',
            // 'nombre.unique' => 'El nombre del rol ya se encuentra registrado.',
        ];
    }
}
