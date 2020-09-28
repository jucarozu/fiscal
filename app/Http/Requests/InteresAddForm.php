<?php

namespace App\Http\Requests;

use App\Http\Requests\Request;

class InteresAddForm extends Request
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
            'desde' => 'required',
            'hasta' => 'required',
            'tasa' => 'required',
        ];
    }

    public function messages()
    {
        return [
            'desde.required' => 'Debe ingresar una fecha inicial de la vigencia.',
            'hasta.required' => 'Debe ingresar una fecha final de la vigencia.',
            'tasa.required' => 'Debe ingresar una tasa de interés.',
        ];
    }
}
