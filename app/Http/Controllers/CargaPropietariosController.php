<?php

namespace App\Http\Controllers;

use App\Http\Requests;
use Illuminate\Http\Request;

use App\Services\GeneralService;

use App\Models\HomologaParam;
use App\Models\Persona;
use App\Models\Propietario;
use App\Models\Direccion;

use App\Models\VTPropietario;
use App\Models\VTPersona;

class CargaPropietariosController extends Controller
{
    /**
     * Display a listing of the agentes.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \App\Http\Requests\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        try
        {
            // Se decodifica el JSON a un array con la información a cargar.
            $informacion = json_decode(stripslashes($request->input('informacion')));

            // Listado de advertencias (Información ignorada).
            $advertencias = array();

            // Listado de errores (Información rechazada).
            $errores = array();

            // Listado de registros que superan las validaciones.
            $registros = array();

            // Expresión regular número.
            $regex_numero = "/^[0-9]+$/";

            // Expresión regular placa.
            $regex_placa = "/^[A-Za-z]{3}[0-9]{3}$|^[A-Za-z]{3}(0[1-9]|[1-9][0-9])[A-Za-z]?$|^[0-9]{3}[A-Za-z]{3}$|^[Mm]([Aa]|[Ii]|[Cc])[0-9]{6}$|^[A-Za-z][0-9]{5}$/";

            // Contador para identificar la fila evaluada.
            $i = 1;
            $linea = $request->input('tiene_encabezados') == 'true' ? $i + 1 : $i;

            foreach ($informacion as $fila)
            {
                // Bandera para determinar si el registro es válido.
                $registro_valido = true;

                // ---------------------------------------------------------
                // VALIDACIÓN DE PLACA
                // ---------------------------------------------------------
                if (!(isset($fila->placa) && !empty($fila->placa)))
                {
                    array_push($errores, [
                        'linea' => $linea,
                        'mensaje' => 'No se ha encontrado informacion del campo Placa.'
                    ]);

                    $registro_valido = false;
                }
                // Validación de formato de placa.
                else if (!preg_match($regex_placa, $fila->placa))
                {
                    array_push($errores, [
                        'linea' => $linea,
                        'mensaje' => 'El formato del campo Placa no es valido.'
                    ]);

                    $registro_valido = false;
                }

                // ---------------------------------------------------------
                // VALIDACIÓN DE TIPO DE DOCUMENTO
                // ---------------------------------------------------------
                if (!(isset($fila->tipo_doc) && !empty($fila->tipo_doc)))
                {
                    array_push($errores, [
                        'linea' => $linea,
                        'mensaje' => 'No se ha encontrado informacion del campo Tipo de documento.'
                    ]);

                    $registro_valido = false;
                }

                // ---------------------------------------------------------
                // VALIDACIÓN DE NÚMERO DE DOCUMENTO
                // ---------------------------------------------------------
                if (!(isset($fila->numero_doc) && !empty($fila->numero_doc)))
                {
                    array_push($errores, [
                        'linea' => $linea,
                        'mensaje' => 'No se ha encontrado informacion del campo Numero de documento.'
                    ]);

                    $registro_valido = false;
                }

                // ---------------------------------------------------------
                // VALIDACIÓN DE NOMBRES
                // ---------------------------------------------------------
                if (!(isset($fila->nombres) && !empty($fila->nombres)))
                {
                    array_push($errores, [
                        'linea' => $linea,
                        'mensaje' => 'No se ha encontrado informacion del campo Nombres.'
                    ]);

                    $registro_valido = false;
                }

                // ---------------------------------------------------------
                // VALIDACIÓN DE APELLIDOS
                // ---------------------------------------------------------
                if (!(isset($fila->apellidos) && !empty($fila->apellidos)))
                {
                    array_push($errores, [
                        'linea' => $linea,
                        'mensaje' => 'No se ha encontrado informacion del campo Apellidos.'
                    ]);

                    $registro_valido = false;
                }

                // ---------------------------------------------------------
                // VALIDACIÓN DE DIRECCIÓN
                // ---------------------------------------------------------
                if (!(isset($fila->direccion) && !empty($fila->direccion)))
                {
                    array_push($errores, [
                        'linea' => $linea,
                        'mensaje' => 'No se ha encontrado informacion del campo Direccion.'
                    ]);

                    $registro_valido = false;
                }

                // ---------------------------------------------------------
                // VALIDACIÓN DE CIUDAD
                // ---------------------------------------------------------
                if (!(isset($fila->ciudad) && !empty($fila->ciudad)))
                {
                    array_push($errores, [
                        'linea' => $linea,
                        'mensaje' => 'No se ha encontrado informacion del campo Ciudad.'
                    ]);

                    $registro_valido = false;
                }
                // Validación de formato del campo Ciudad.
                else if (!preg_match($regex_numero, $fila->ciudad))
                {
                    array_push($errores, [
                        'linea' => $linea,
                        'mensaje' => 'El formato del campo Ciudad no es valido.'
                    ]);

                    $registro_valido = false;
                }

                // ---------------------------------------------------------
                // VALIDACIÓN DE TELÉFONO
                // ---------------------------------------------------------
                if (!(isset($fila->telefono) && !empty($fila->telefono)))
                {
                    array_push($advertencias, [
                        'linea' => $linea,
                        'campo' => 'Telefono',
                        'mensaje' => 'No se ha encontrado informacion del campo Telefono.'
                    ]);
                }

                // ---------------------------------------------------------
                // VALIDACIÓN DE FECHA DIRECCIÓN
                // ---------------------------------------------------------
                if (!(isset($fila->fecha_direccion) && !empty($fila->fecha_direccion)))
                {
                    array_push($errores, [
                        'linea' => $linea,
                        'mensaje' => 'No se ha encontrado informacion del campo Fecha direccion.'
                    ]);

                    $registro_valido = false;
                }
                // Validación de formato del campo Fecha dirección.
                else if (!GeneralService::validarFechaFormato('d/m/Y', $fila->fecha_direccion))
                {
                    array_push($errores, [
                        'linea' => $linea,
                        'mensaje' => 'El formato del campo Fecha direccion no es valido.'
                    ]);

                    $registro_valido = false;
                }

                // ---------------------------------------------------------
                // VALIDACIÓN DE FECHA PROPIETARIO
                // ---------------------------------------------------------
                if (!(isset($fila->fecha_propietario) && !empty($fila->fecha_propietario)))
                {
                    array_push($errores, [
                        'linea' => $linea,
                        'mensaje' => 'No se ha encontrado informacion del campo Fecha propietario.'
                    ]);

                    $registro_valido = false;
                }
                // Validación de formato del campo Fecha propietario.
                else if (!GeneralService::validarFechaFormato('d/m/Y', $fila->fecha_propietario))
                {
                    array_push($errores, [
                        'linea' => $linea,
                        'mensaje' => 'El formato del campo Fecha propietario no es valido.'
                    ]);

                    $registro_valido = false;
                }

                if ($registro_valido)
                {
                    // Se agrega la fila al listado de registros válidos.
                    array_push($registros, $fila);
                }

                $i++;
                $linea++;
            }

            // Si existen registros válidos en las filas procesadas, se procede a actualizar la información de los propietarios.
            foreach ($registros as $registro)
            {
                // Se obtiene el valor correspondiente al parámetro Tipo de documento, de acuerdo a la homologación con el Runt.
                $homologa_param = HomologaParam::where('grupo', 1) // Grupo: Tipo documento
                                               ->where('entidad', 1) // Entidad: Runt
                                               ->where('tipo', 'A') // Tipo: Alfanúmerico
                                               ->where('val_alfanumerico', $registro->tipo_doc)
                                               ->first();

                // Se verifica si el propietario existe en la base de datos.
                $propietario = VTPropietario::where('placa', $registro->placa)
                                            ->where('tipo_doc', $homologa_param->parametro)
                                            ->where('numero_doc', $registro->numero_doc)
                                  		    ->first();

                // Si no existe el propietario, se procede a crearlo en la base de datos.
                if (!isset($propietario->propietario))
                {
                    // Se verifica si la persona existe en la base de datos.
                    $persona = VTPersona::where('tipo_doc', $homologa_param->parametro)
                                        ->where('numero_doc', $registro->numero_doc)
                                        ->first();

                    // Si no existe la persona, se procede a crearla en la base de datos.
                    if (!isset($persona->persona))
                    {
                        $persona = new Persona();
                        $persona->tipo_doc = $homologa_param->parametro;
                        $persona->numero_doc = $registro->numero_doc;
                        $persona->nombres = $registro->nombres;
                        $persona->apellidos = $registro->apellidos;
                        $persona->numero_celular = isset($registro->telefono) ? $registro->telefono : null;
                        $persona->usuario_registra = $request->input('usuario_registra');
                        
                        // Si ocurre un error al guardar la persona, se continúa con el siguiente registro.
                        if (!$persona->save())
                        {
                            continue;
                        }
                    }
                    // Si la persona existe, se actualiza el número de teléfono.
                    else
                    {
                        $persona = Persona::find($persona->persona);
                        $persona->numero_celular = isset($registro->telefono) ? $registro->telefono : $persona->numero_celular;
                        $persona->save();
                    }

                    // Se guardan los datos del propietario.
                    $propietario = new Propietario();
                    $propietario->placa = $registro->placa;
                    $propietario->persona = $persona->persona;
                    $propietario->fuente = 2; // Fuente: Runt
                    $propietario->tipo = 1; // Tipo propietario: Propio
                    $propietario->desde = GeneralService::getFechaFormato('Y-m-d', strtotime(str_replace('/', '-', $registro->fecha_propietario)));
                    $propietario->usuario = $request->input('usuario_registra');
                    
                    // Si ocurre un error al guardar el propietario, se continúa con el siguiente registro.
                    if (!$propietario->save())
                    {
                        continue;
                    }
                }
                // Si el propietario existe, se actualizan los datos de persona y propietario.
                else
                {
                    // Se actualiza el número de teléfono de la persona.
                    $persona = Persona::find($propietario->persona);
                    $persona->numero_celular = isset($registro->telefono) ? $registro->telefono : $persona->numero_celular;
                    $persona->save();

                    // Se actualizan los datos del propietario.
                    $propietario = Propietario::find($propietario->propietario);
                    $propietario->fuente = 2; // Fuente: Runt
                    $propietario->desde = GeneralService::getFechaFormato('Y-m-d', strtotime(str_replace('/', '-', $registro->fecha_propietario)));
                    $propietario->usuario = $request->input('usuario_registra');
                    $propietario->save();
                }

                // Se guardan los datos de las direcciones del propietario.
                $direccion = new Direccion();
                $direccion->persona = $propietario->persona;
                $direccion->fuente = 2; // Fuente: Runt
                $direccion->observaciones = "Tomado del Runt";
                $direccion->divipo = $registro->ciudad;
                $direccion->descripcion = $registro->direccion;
                $direccion->fecha_registra = GeneralService::getFechaFormato('Y-m-d', strtotime(str_replace('/', '-', $registro->fecha_direccion)));
                $direccion->usuario = $request->input('usuario_registra');

                // Si ocurre un error al guardar la dirección, se continúa con el siguiente registro.
                if (!$direccion->save())
                {
                    continue;
                }
            }
        }
        catch(\Exception $e)
        {
            return response()->json(['estado' => 'ERROR', 'mensaje' => 'Error al procesar la informacion cargada.'], 500);
        }

        return response()->json([
            'estado' => 'OK', 
            'mensaje' => 'Informacion procesada con exito', 
            'advertencias' => $advertencias, 
            'errores' => $errores
        ]);
    }
}
