<?php

namespace App\Http\Requests;

use App\Http\Requests\Request;

class RolAddForm extends Request
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
            'nombre' => 'required|unique:rol|max:30',
        ];
    }

    public function messages()
    {
        return [
            'nombre.required' => 'Debe ingresar el nombre del rol.',
            'nombre.unique' => 'El nombre del rol ya se encuentra registrado.',
            'nombre.max' => 'El nombre del rol debe tener máximo :max caracteres.',
        ];
    }
}