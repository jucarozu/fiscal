<?php

namespace App\Http\Requests;

use App\Http\Requests\Request;

class PersonaAddForm extends Request
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
            'tipo_doc' => 'required|unique_with:persona,numero_doc',
            'numero_doc' => 'required|numeric', 
            'nombres' => 'required',
            'apellidos' => 'required',
            'email' => 'email|unique:persona,email',
            'numero_celular' => 'numeric',
        ];
    }

    public function messages()
    {
        return [
            'tipo_doc.required' => 'El tipo de documento es obligatorio.',
            'tipo_doc.unique_with' => 'Existe una persona con el tipo y número de documento ingresado.',

            'numero_doc.required' => 'El número de documento es obligatorio.',
            'numero_doc.numeric' => 'El número de documento debe ser numérico.',

            'nombres.required' => 'El nombre es obligatorio.',

            'apellidos.required' => 'El apellido es obligatorio.',

            'email.email' => 'Debe especificar un email válido.',
            'email.unique' => 'El email ya se encuentra registrado.',

            'numero_celular.numeric' => 'El teléfono móvil debe ser numérico.',
        ];
    }
}
