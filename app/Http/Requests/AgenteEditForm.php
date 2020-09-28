<?php

namespace App\Http\Requests;

use App\Http\Requests\Request;

use App\Services\GeneralService;

class AgenteEditForm extends Request
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
            'entidad' => 'required|unique_with:agente_transito,placa,'.$this->agente.' = agente',
            'placa' => 'required',
        ];
    }

    public function messages()
    {
        return [
            'entidad.required' => 'Debe seleccionar una entidad.',
            'entidad.unique_with' => 'Ya existe agente con placa '.$this->placa.' para la entidad '.$this->entidad_desc.'.',

            'placa.required' => 'La placa es obligatoria.',
        ];
    }

    public function all()
    {
        $input = parent::all();
        $input['entidad_desc'] = GeneralService::getParametroDesc(10, $input['entidad']);

        return $input;
    }
}
