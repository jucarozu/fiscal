<?php

namespace App\Http\Controllers;

use App\Http\Requests;
use Illuminate\Http\Request;

use App\Services\GeneralService;

use App\Models\Vehiculo;
use App\Models\Parametro;

class CargaInformacionController extends Controller
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

            // Contador para identificar la fila evaluada.
            $i = 1;
            $linea = $request->input('tiene_encabezados') == 'true' ? $i + 1 : $i;

            foreach ($informacion as $fila)
            {
                // ---------------------------------------------------------                
                // VALIDACIÓN DE PLACA
                // ---------------------------------------------------------
                if (!(isset($fila->placa) && !empty($fila->placa)))
                {
                    array_push($errores, [
                        'linea' => $linea,
                        'mensaje' => 'No se ha encontrado informacion de la placa del vehiculo.'
                    ]);

                    // Si no se encuentra información de la placa del vehículo, se continúa con la siguiente fila.
                    $i++;
                    $linea++;
                    continue;
                }

                // Validación de formato de placa.
                if (!preg_match("/^[A-Za-z]{3}[0-9]{3}$|^[A-Za-z]{3}(0[1-9]|[1-9][0-9])[A-Za-z]?$|^[0-9]{3}[A-Za-z]{3}$|^[Mm]([Aa]|[Ii]|[Cc])[0-9]{6}$|^[A-Za-z][0-9]{5}$/", $fila->placa))
                {
                    array_push($errores, [
                        'linea' => $linea,
                        'mensaje' => 'El formato de la placa del vehiculo no es valido.'
                    ]);

                    // Si el formato de la placa del vehículo no es válido, se continúa con la siguiente fila.
                    $i++;
                    $linea++;
                    continue;
                }

                // Bandera para determinar si solo la placa fue el campo aceptado en el proceso de validación.
                $solo_placa = true;

                // ---------------------------------------------------------                
                // VALIDACIÓN DE LICENCIA DE TRÁNSITO
                // ---------------------------------------------------------
                if (!(isset($fila->lic_transito) && !empty($fila->lic_transito)))
                {
                    array_push($advertencias, [
                        'linea' => $linea,
                        'campo' => 'Lic transito',
                        'mensaje' => 'No se ha encontrado informacion de la licencia de transito del vehiculo.'
                    ]);
                }
                else
                {
                    $solo_placa = false;
                }

                // ---------------------------------------------------------
                // VALIDACIÓN DE PARÁMETROS
                // ---------------------------------------------------------

                // ---------------------------------------------------------
                // Validación 1: Parámetro ORGANISMO DE TRÁNSITO
                // ---------------------------------------------------------
                
                $grupo = 28;
                $cumple_formato = true;

                // Se verifica que el campo Divipo OT sea de tipo numérico.
                if (isset($fila->divipo_ot) && !empty($fila->divipo_ot) && !preg_match("/^[0-9]+$/", $fila->divipo_ot))
                {
                    array_push($advertencias, [
                        'linea' => $linea,
                        'campo' => 'Divipo OT',
                        'mensaje' => 'El campo no cumple con el formato numerico.'
                    ]);

                    // Si no se cumple con la validación, se eliminan del registro los campos del parámetro Organismo de tránsito.
                    unset($fila->divipo_ot, $fila->nombre_ot);
                    $cumple_formato = false;
                }

                if ($cumple_formato)
                {
                    if (isset($fila->divipo_ot) && !empty($fila->divipo_ot) && 
                        isset($fila->nombre_ot) && !empty($fila->nombre_ot))
                    {
                        // Se reportan el código y la descripción.
                        $parametro = Parametro::where('grupo', $grupo)
                                              ->where('parametro', $fila->divipo_ot)
                                              ->whereRaw("LOWER(nombre) = '" . strtolower($fila->nombre_ot) . "'")
                                              ->first();

                        if (!isset($parametro->parametro))
                        {
                            $parametro = new Parametro();
                            $parametro->grupo = $grupo;
                            $parametro->parametro = $fila->divipo_ot;
                            $parametro->nombre = ucfirst(strtolower($fila->nombre_ot));
                            $parametro->save();
                        }

                        $solo_placa = false;
                    }
                    elseif (isset($fila->divipo_ot) && !empty($fila->divipo_ot) && 
                            !(isset($fila->nombre_ot) && !empty($fila->nombre_ot)))
                    {
                        // Se reporta solo el código.
                        $parametro = Parametro::where('grupo', $grupo)
                                              ->where('parametro', $fila->divipo_ot)
                                              ->first();

                        if (!isset($parametro->parametro))
                        {
                            array_push($advertencias, [
                                'linea' => $linea,
                                'campo' => 'Divipo OT',
                                'mensaje' => 'El organismo de transito con divipo '.$fila->divipo_ot.' no se encuentra registrado.'
                            ]);
                        }
                        else
                        {
                            $solo_placa = false;
                        }
                    }
                    elseif (!(isset($fila->divipo_ot) && !empty($fila->divipo_ot)) && 
                            isset($fila->nombre_ot) && !empty($fila->nombre_ot))
                    {
                        // Se reporta solo la descripción.
                        $parametro = Parametro::where('grupo', $grupo)
                                              ->whereRaw("LOWER(nombre) = '" . strtolower($fila->nombre_ot) . "'")
                                              ->first();

                        if (!isset($parametro->parametro))
                        {
                            array_push($advertencias, [
                                'linea' => $linea,
                                'campo' => 'Nombre OT',
                                'mensaje' => 'El organismo de transito con nombre '.$fila->nombre_ot.' no se encuentra registrado.'
                            ]);
                        }
                        else
                        {
                            $solo_placa = false;
                        }
                    }
                    else
                    {
                        array_push($advertencias, [
                            'linea' => $linea,
                            'campo' => 'Divipo OT',
                            'mensaje' => 'No se ha encontrado informacion del organismo de transito del vehiculo.'
                        ]);
                    }
                }

                // ---------------------------------------------------------
                // Validación 2: Parámetro CLASE
                // ---------------------------------------------------------
                
                $grupo = 17;
                $cumple_formato = true;

                // Se verifica que el campo Cod Clase sea de tipo numérico.
                if (isset($fila->cod_clase) && !empty($fila->cod_clase) && !preg_match("/^[0-9]+$/", $fila->cod_clase))
                {
                    array_push($advertencias, [
                        'linea' => $linea,
                        'campo' => 'Cod Clase',
                        'mensaje' => 'El campo no cumple con el formato numerico.'
                    ]);

                    // Si no se cumple con la validación, se eliminan del registro los campos del parámetro Clase.
                    unset($fila->cod_clase, $fila->clase);
                    $cumple_formato = false;
                }                

                if ($cumple_formato)
                {
                    if (isset($fila->cod_clase) && !empty($fila->cod_clase) && 
                        isset($fila->clase) && !empty($fila->clase))
                    {
                        // Se reportan el código y la descripción.
                        $parametro = Parametro::where('grupo', $grupo)
                                              ->where('parametro', $fila->cod_clase)
                                              ->whereRaw("LOWER(nombre) = '" . strtolower($fila->clase) . "'")
                                              ->first();

                        if (!isset($parametro->parametro))
                        {
                            $parametro = new Parametro();
                            $parametro->grupo = $grupo;
                            $parametro->parametro = $fila->cod_clase;
                            $parametro->nombre = ucfirst(strtolower($fila->clase));
                            $parametro->save();
                        }

                        $solo_placa = false;
                    }
                    elseif (isset($fila->cod_clase) && !empty($fila->cod_clase) && 
                            !(isset($fila->clase) && !empty($fila->clase)))
                    {
                        // Se reporta solo el código.
                        $parametro = Parametro::where('grupo', $grupo)
                                              ->where('parametro', $fila->cod_clase)
                                              ->first();

                        if (!isset($parametro->parametro))
                        {
                            array_push($advertencias, [
                                'linea' => $linea,
                                'campo' => 'Cod Clase',
                                'mensaje' => 'La clase con codigo '.$fila->cod_clase.' no se encuentra registrada.'
                            ]);
                        }
                        else
                        {
                            $solo_placa = false;
                        }
                    }
                    elseif (!(isset($fila->cod_clase) && !empty($fila->cod_clase)) && 
                            isset($fila->clase) && !empty($fila->clase))
                    {
                        // Se reporta solo la descripción.
                        $parametro = Parametro::where('grupo', $grupo)
                                              ->whereRaw("LOWER(nombre) = '" . strtolower($fila->clase) . "'")
                                              ->first();

                        if (!isset($parametro->parametro))
                        {
                            array_push($advertencias, [
                                'linea' => $linea,
                                'campo' => 'Clase',
                                'mensaje' => 'La clase con descripcion '.$fila->clase.' no se encuentra registrada.'
                            ]);
                        }
                        else
                        {
                            $solo_placa = false;
                        }
                    }
                    else
                    {
                        array_push($advertencias, [
                            'linea' => $linea,
                            'campo' => 'Cod Clase',
                            'mensaje' => 'No se ha encontrado informacion de la clase del vehiculo.'
                        ]);
                    }
                }

                // ---------------------------------------------------------
                // Validación 3: Parámetro SERVICIO
                // ---------------------------------------------------------
                
                $grupo = 18;
                $cumple_formato = true;

                // Se verifica que el campo Cod Servicio sea de tipo numérico.
                if (isset($fila->cod_servicio) && !empty($fila->cod_servicio) && !preg_match("/^[0-9]+$/", $fila->cod_servicio))
                {
                    array_push($advertencias, [
                        'linea' => $linea,
                        'campo' => 'Cod Servicio',
                        'mensaje' => 'El campo no cumple con el formato numerico.'
                    ]);

                    // Si no se cumple con la validación, se eliminan del registro los campos del parámetro Servicio.
                    unset($fila->cod_servicio, $fila->servicio);
                    $cumple_formato = false;
                }                

                if ($cumple_formato)
                {
                    if (isset($fila->cod_servicio) && !empty($fila->cod_servicio) && 
                        isset($fila->servicio) && !empty($fila->servicio))
                    {
                        // Se reportan el código y la descripción.
                        $parametro = Parametro::where('grupo', $grupo)
                                              ->where('parametro', $fila->cod_servicio)
                                              ->whereRaw("LOWER(nombre) = '" . strtolower($fila->servicio) . "'")
                                              ->first();

                        if (!isset($parametro->parametro))
                        {
                            $parametro = new Parametro();
                            $parametro->grupo = $grupo;
                            $parametro->parametro = $fila->cod_servicio;
                            $parametro->nombre = ucfirst(strtolower($fila->servicio));
                            $parametro->save();
                        }

                        $solo_placa = false;
                    }
                    elseif (isset($fila->cod_servicio) && !empty($fila->cod_servicio) && 
                            !(isset($fila->servicio) && !empty($fila->servicio)))
                    {
                        // Se reporta solo el código.
                        $parametro = Parametro::where('grupo', $grupo)
                                              ->where('parametro', $fila->cod_servicio)
                                              ->first();

                        if (!isset($parametro->parametro))
                        {
                            array_push($advertencias, [
                                'linea' => $linea,
                                'campo' => 'Cod Servicio',
                                'mensaje' => 'El servicio con codigo '.$fila->cod_servicio.' no se encuentra registrado.'
                            ]);
                        }
                        else
                        {
                            $solo_placa = false;
                        }
                    }
                    elseif (!(isset($fila->cod_servicio) && !empty($fila->cod_servicio)) && 
                            isset($fila->servicio) && !empty($fila->servicio))
                    {
                        // Se reporta solo la descripción.
                        $parametro = Parametro::where('grupo', $grupo)
                                              ->whereRaw("LOWER(nombre) = '" . strtolower($fila->servicio) . "'")
                                              ->first();

                        if (!isset($parametro->parametro))
                        {
                            array_push($advertencias, [
                                'linea' => $linea,
                                'campo' => 'Servicio',
                                'mensaje' => 'El servicio con descripcion '.$fila->servicio.' no se encuentra registrado.'
                            ]);
                        }
                        else
                        {
                            $solo_placa = false;
                        }
                    }
                    else
                    {
                        array_push($advertencias, [
                            'linea' => $linea,
                            'campo' => 'Cod Servicio',
                            'mensaje' => 'No se ha encontrado informacion del servicio del vehiculo.'
                        ]);
                    }
                }

                // ---------------------------------------------------------
                // Validación 4: Parámetro RADIO DE ACCIÓN
                // ---------------------------------------------------------
                
                $grupo = 29;
                $cumple_formato = true;

                // Se verifica que el campo Cod Radio Accion sea de tipo numérico.
                if (isset($fila->cod_radio_accion) && !empty($fila->cod_radio_accion) && !preg_match("/^[0-9]+$/", $fila->cod_radio_accion))
                {
                    array_push($advertencias, [
                        'linea' => $linea,
                        'campo' => 'Cod Radio Accion',
                        'mensaje' => 'El campo no cumple con el formato numerico.'
                    ]);

                    // Si no se cumple con la validación, se eliminan del registro los campos del parámetro Radio de acción.
                    unset($fila->cod_radio_accion, $fila->radio_accion);
                    $cumple_formato = false;
                }                

                if ($cumple_formato)
                {
                    if (isset($fila->cod_radio_accion) && !empty($fila->cod_radio_accion) && 
                        isset($fila->radio_accion) && !empty($fila->radio_accion))
                    {
                        // Se reportan el código y la descripción.
                        $parametro = Parametro::where('grupo', $grupo)
                                              ->where('parametro', $fila->cod_radio_accion)
                                              ->whereRaw("LOWER(nombre) = '" . strtolower($fila->radio_accion) . "'")
                                              ->first();

                        if (!isset($parametro->parametro))
                        {
                            $parametro = new Parametro();
                            $parametro->grupo = $grupo;
                            $parametro->parametro = $fila->cod_radio_accion;
                            $parametro->nombre = ucfirst(strtolower($fila->radio_accion));
                            $parametro->save();
                        }

                        $solo_placa = false;
                    }
                    elseif (isset($fila->cod_radio_accion) && !empty($fila->cod_radio_accion) && 
                            !(isset($fila->radio_accion) && !empty($fila->radio_accion)))
                    {
                        // Se reporta solo el código.
                        $parametro = Parametro::where('grupo', $grupo)
                                              ->where('parametro', $fila->cod_radio_accion)                                          
                                              ->first();

                        if (!isset($parametro->parametro))
                        {
                            array_push($advertencias, [
                                'linea' => $linea,
                                'campo' => 'Cod Radio Accion',
                                'mensaje' => 'El radio de accion con codigo '.$fila->cod_radio_accion.' no se encuentra registrado.'
                            ]);
                        }
                        else
                        {
                            $solo_placa = false;
                        }
                    }
                    elseif (!(isset($fila->cod_radio_accion) && !empty($fila->cod_radio_accion)) && 
                            isset($fila->radio_accion) && !empty($fila->radio_accion))
                    {
                        // Se reporta solo la descripción.
                        $parametro = Parametro::where('grupo', $grupo)
                                              ->whereRaw("LOWER(nombre) = '" . strtolower($fila->radio_accion) . "'")
                                              ->first();

                        if (!isset($parametro->parametro))
                        {
                            array_push($advertencias, [
                                'linea' => $linea,
                                'campo' => 'Radio Accion',
                                'mensaje' => 'El radio de accion con descripcion '.$fila->radio_accion.' no se encuentra registrado.'
                            ]);
                        }
                        else
                        {
                            $solo_placa = false;
                        }
                    }
                    else
                    {
                        array_push($advertencias, [
                            'linea' => $linea,
                            'campo' => 'Cod Radio Accion',
                            'mensaje' => 'No se ha encontrado informacion del radio de accion del vehiculo.'
                        ]);
                    }
                }

                // ---------------------------------------------------------
                // Validación 5: Parámetro MODALIDAD
                // ---------------------------------------------------------
                
                $grupo = 30;
                $cumple_formato = true;

                // Se verifica que el campo Cod Modalidad sea de tipo numérico.
                if (isset($fila->cod_modalidad) && !empty($fila->cod_modalidad) && !preg_match("/^[0-9]+$/", $fila->cod_modalidad))
                {
                    array_push($advertencias, [
                        'linea' => $linea,
                        'campo' => 'Cod Modalidad',
                        'mensaje' => 'El campo no cumple con el formato numerico.'
                    ]);

                    // Si no se cumple con la validación, se eliminan del registro los campos del parámetro Modalidad.
                    unset($fila->cod_modalidad, $fila->modalidad);
                    $cumple_formato = false;
                }                

                if ($cumple_formato)
                {
                    if (isset($fila->cod_modalidad) && !empty($fila->cod_modalidad) && 
                        isset($fila->modalidad) && !empty($fila->modalidad))
                    {
                        // Se reportan el código y la descripción.
                        $parametro = Parametro::where('grupo', $grupo)
                                              ->where('parametro', $fila->cod_modalidad)
                                              ->whereRaw("LOWER(nombre) = '" . strtolower($fila->modalidad) . "'")
                                              ->first();

                        if (!isset($parametro->parametro))
                        {
                            $parametro = new Parametro();
                            $parametro->grupo = $grupo;
                            $parametro->parametro = $fila->cod_modalidad;
                            $parametro->nombre = ucfirst(strtolower($fila->modalidad));
                            $parametro->save();
                        }

                        $solo_placa = false;
                    }
                    elseif (isset($fila->cod_modalidad) && !empty($fila->cod_modalidad) && 
                            !(isset($fila->modalidad) && !empty($fila->modalidad)))
                    {
                        // Se reporta solo el código.
                        $parametro = Parametro::where('grupo', $grupo)
                                              ->where('parametro', $fila->cod_modalidad)
                                              ->first();

                        if (!isset($parametro->parametro))
                        {
                            array_push($advertencias, [
                                'linea' => $linea,
                                'campo' => 'Cod Modalidad',
                                'mensaje' => 'La modalidad con codigo '.$fila->cod_modalidad.' no se encuentra registrada.'
                            ]);
                        }
                        else
                        {
                            $solo_placa = false;
                        }
                    }
                    elseif (!(isset($fila->cod_modalidad) && !empty($fila->cod_modalidad)) && 
                            isset($fila->modalidad) && !empty($fila->modalidad))
                    {
                        // Se reporta solo la descripción.
                        $parametro = Parametro::where('grupo', $grupo)
                                              ->whereRaw("LOWER(nombre) = '" . strtolower($fila->modalidad) . "'")
                                              ->first();

                        if (!isset($parametro->parametro))
                        {
                            array_push($advertencias, [
                                'linea' => $linea,
                                'campo' => 'Modalidad',
                                'mensaje' => 'La modalidad con descripcion '.$fila->modalidad.' no se encuentra registrada.'
                            ]);
                        }
                        else
                        {
                            $solo_placa = false;
                        }
                    }
                    else
                    {
                        array_push($advertencias, [
                            'linea' => $linea,
                            'campo' => 'Cod Modalidad',
                            'mensaje' => 'No se ha encontrado informacion de la modalidad del vehiculo.'
                        ]);
                    }
                }

                // ---------------------------------------------------------
                // Validación 6: Parámetro TIPO PASAJEROS
                // ---------------------------------------------------------
                
                $grupo = 31;
                $cumple_formato = true;

                // Se verifica que el campo Cod Tipo Pasajeros sea de tipo numérico.
                if (isset($fila->cod_tipo_pasajeros) && !empty($fila->cod_tipo_pasajeros) && !preg_match("/^[0-9]+$/", $fila->cod_tipo_pasajeros))
                {
                    array_push($advertencias, [
                        'linea' => $linea,
                        'campo' => 'Cod Tipo Pasajeros',
                        'mensaje' => 'El campo no cumple con el formato numerico.'
                    ]);

                    // Si no se cumple con la validación, se eliminan del registro los campos del parámetro Tipo de pasajeros.
                    unset($fila->cod_tipo_pasajeros, $fila->tipo_pasajeros);
                    $cumple_formato = false;
                }                

                if ($cumple_formato)
                {
                    if (isset($fila->cod_tipo_pasajeros) && !empty($fila->cod_tipo_pasajeros) && 
                        isset($fila->tipo_pasajeros) && !empty($fila->tipo_pasajeros))
                    {
                        // Se reportan el código y la descripción.
                        $parametro = Parametro::where('grupo', $grupo)
                                              ->where('parametro', $fila->cod_tipo_pasajeros)
                                              ->whereRaw("LOWER(nombre) = '" . strtolower($fila->tipo_pasajeros) . "'")
                                              ->first();

                        if (!isset($parametro->parametro))
                        {
                            $parametro = new Parametro();
                            $parametro->grupo = $grupo;
                            $parametro->parametro = $fila->cod_tipo_pasajeros;
                            $parametro->nombre = ucfirst(strtolower($fila->tipo_pasajeros));
                            $parametro->save();
                        }

                        $solo_placa = false;
                    }
                    elseif (isset($fila->cod_tipo_pasajeros) && !empty($fila->cod_tipo_pasajeros) && 
                            !(isset($fila->tipo_pasajeros) && !empty($fila->tipo_pasajeros)))
                    {
                        // Se reporta solo el código.
                        $parametro = Parametro::where('grupo', $grupo)
                                              ->where('parametro', $fila->cod_tipo_pasajeros)
                                              ->first();

                        if (!isset($parametro->parametro))
                        {
                            array_push($advertencias, [
                                'linea' => $linea,
                                'campo' => 'Cod Tipo Pasajeros',
                                'mensaje' => 'El tipo de pasajeros con codigo '.$fila->cod_tipo_pasajeros.' no se encuentra registrado.'
                            ]);
                        }
                        else
                        {
                            $solo_placa = false;
                        }
                    }
                    elseif (!(isset($fila->cod_tipo_pasajeros) && !empty($fila->cod_tipo_pasajeros)) && 
                            isset($fila->tipo_pasajeros) && !empty($fila->tipo_pasajeros))
                    {
                        // Se reporta solo la descripción.
                        $parametro = Parametro::where('grupo', $grupo)
                                              ->whereRaw("LOWER(nombre) = '" . strtolower($fila->tipo_pasajeros) . "'")
                                              ->first();

                        if (!isset($parametro->parametro))
                        {
                            array_push($advertencias, [
                                'linea' => $linea,
                                'campo' => 'Tipo Pasajeros',
                                'mensaje' => 'El tipo de pasajeros con descripcion '.$fila->tipo_pasajeros.' no se encuentra registrado.'
                            ]);
                        }
                        else
                        {
                            $solo_placa = false;
                        }
                    }
                    else
                    {
                        array_push($advertencias, [
                            'linea' => $linea,
                            'campo' => 'Cod Tipo Pasajeros',
                            'mensaje' => 'No se ha encontrado informacion del tipo de pasajeros del vehiculo.'
                        ]);
                    }
                }

                // Si la placa es el único campo aceptado en la validación, se rechaza la fila evaluada y se eliminan las advertencias asociadas a dicho registro.
                // Si no, se agrega la fila al listado de registros válidos.
                if ($solo_placa)
                {
                    array_push($errores, [
                        'linea' => $linea,
                        'mensaje' => 'La informacion aceptada solo fue la placa.'
                    ]);

                    for ($j = 0; $j < count($advertencias); $j++)
                    {
                        if ($advertencias[$j]['linea'] == $linea)
                        {
                            array_splice($advertencias, $j);
                        }
                    }
                }
                else
                {
                    array_push($registros, $fila);
                }

                $i++;
                $linea++;
            }

            // Si existen registros válidos en las filas procesadas, se procede a actualizar la información de los vehículos.
            foreach ($registros as $registro)
            {
                // Se verifica si el vehículo existe en la base de datos.
                $vehiculo = Vehiculo::where('placa', $registro->placa)
                                    ->first();

                if (!isset($vehiculo->vehiculo))
                {
                    // Si el vehículo no existe, se crea con su información correspondiente en la base de datos.
                    $vehiculo = new Vehiculo();
                    $vehiculo->placa = $registro->placa;
                    $vehiculo->licencia_transito = isset($registro->lic_transito) ? $registro->lic_transito : null;
                    $vehiculo->organismo = isset($registro->divipo_ot) ? $registro->divipo_ot : null;
                    $vehiculo->clase = isset($registro->cod_clase) ? $registro->cod_clase : null;
                    $vehiculo->servicio = isset($registro->cod_servicio) ? $registro->cod_servicio : null;
                    $vehiculo->radio_accion = isset($registro->cod_radio_accion) ? $registro->cod_radio_accion : null;
                    $vehiculo->modalidad = isset($registro->cod_modalidad) ? $registro->cod_modalidad : null;
                    $vehiculo->tipo_pasajeros = isset($registro->cod_tipo_pasajeros) ? $registro->cod_tipo_pasajeros : null;
                    $vehiculo->fecha_informacion = GeneralService::getFechaActual('Y-m-d H:i:s');
                    
                    // Si ocurre un error al guardar el vehículo, se continúa con el siguiente registro.
                    if (!$vehiculo->save())
                    {
                        continue;
                    }
                }
                else
                {
                    // Si el vehículo existe, se actualiza la información del mismo en la base de datos.
                    $vehiculo->placa = $registro->placa;
                    $vehiculo->licencia_transito = isset($registro->lic_transito) ? $registro->lic_transito : $vehiculo->licencia_transito;
                    $vehiculo->organismo = isset($registro->divipo_ot) ? $registro->divipo_ot : $vehiculo->organismo;
                    $vehiculo->clase = isset($registro->cod_clase) ? $registro->cod_clase : $vehiculo->clase;
                    $vehiculo->servicio = isset($registro->cod_servicio) ? $registro->cod_servicio : $vehiculo->servicio;
                    $vehiculo->radio_accion = isset($registro->cod_radio_accion) ? $registro->cod_radio_accion : $vehiculo->radio_accion;
                    $vehiculo->modalidad = isset($registro->cod_modalidad) ? $registro->cod_modalidad : $vehiculo->modalidad;
                    $vehiculo->tipo_pasajeros = isset($registro->cod_tipo_pasajeros) ? $registro->cod_tipo_pasajeros : $vehiculo->tipo_pasajeros;
                    $vehiculo->fecha_informacion = GeneralService::getFechaActual('Y-m-d H:i:s');
                    
                    // Si ocurre un error al actualizar el vehículo, se continúa con el siguiente registro.
                    if (!$vehiculo->save())
                    {
                        continue;
                    }
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
            'informacion' => $request->input('informacion'), 
            'advertencias' => $advertencias, 
            'errores' => $errores
        ]);
    }
}
