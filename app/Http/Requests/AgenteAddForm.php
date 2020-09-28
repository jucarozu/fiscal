<?php

namespace App\Http\Requests;

use App\Http\Requests\Request;

use App\Services\GeneralService;

class AgenteAddForm extends Request
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
            'persona' => 'unique:agente_transito,persona,NULL,agente,estado,1',
            'entidad' => 'required|unique_with:agente_transito,placa',
            'placa' => 'required',
        ];
    }

    public function messages()
    {
        return [
            'persona.unique' => 'La persona ya se encuentra como agente activo con placa '.$this->placa_actual.' para la entidad '.$this->entidad_actual_desc.'.',

            'entidad.required' => 'Debe seleccionar una entidad.',
            'entidad.unique_with' => 'Ya existe agente con placa '.$this->placa.' para la entidad '.$this->entidad_desc.'.',

            'placa.required' => 'La placa es obligatoria.',
        ];
    }

    public function all()
    {
        $input = parent::all();
        $input['entidad_desc'] = GeneralService::getParametroDesc(10, $input['entidad']);

        $agente = GeneralService::getAgenteByPersona($input['persona']);
        
        if (!is_null($agente))
        {
            $input['placa_actual'] = $agente->placa;
            $input['entidad_actual_desc'] = $agente->entidad_desc;
        }

        return $input;
    }
}
