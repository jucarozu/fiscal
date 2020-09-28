<?php

namespace App\Services;

use App\Models\Modulo;
use App\Models\Parametro;
use App\Models\Variable;

use App\Models\VTOpcionPermiso;
use App\Models\VTAgente;

use Storage;
use FFMpeg;
use Jenssegers\Date\Date;

class GeneralService
{
    public static function getMenuAplicacion($usuario)
    {
        $menu = array();
        
        $posModulo = 0;

        // Crear estructura jerárquica de opciones de la aplicación.
        foreach (Modulo::orderBy("nombre")->get() as $modulo)
        {
            $moduloTieneOpciones = false;

            $vtOpciones = VTOpcionPermiso::where("usuario", $usuario)
                                         ->where("modulo", $modulo->modulo)
                                         ->where("estado", 1)
                                         ->where("tipo", 1)
                                         ->select("opcion", "opcion_nombre", "enlace", "ruta", "consulta", "adiciona", "edita", "elimina", "ejecuta")
                                         ->orderBy("modulo_nombre")
                                         ->orderBy("opcion_nombre")
                                         ->get();

            // Validar si el módulo tiene opciones permitidas para el usuario.
            if (!empty($vtOpciones->toArray()))
            {
                $posOpcion = 0;

                foreach ($vtOpciones as $opcion)
                {
                    if ($opcion->consulta == 1)
                    {
                        // Si el módulo tiene al menos una opción con permisos de consulta, se agrega al menú.
                        if (!isset($menu[$posModulo]['modulo']))
                        {
                            $menu[$posModulo]['modulo'] = $modulo->modulo;
                            $menu[$posModulo]['modulo_nombre'] = $modulo->nombre;

                            $moduloTieneOpciones = true;
                        }

                        $menu[$posModulo]['opciones'][$posOpcion]['opcion'] = $opcion->opcion;
                        $menu[$posModulo]['opciones'][$posOpcion]['opcion_nombre'] = $opcion->opcion_nombre;
                        $menu[$posModulo]['opciones'][$posOpcion]['enlace'] = $opcion->enlace;
                        $menu[$posModulo]['opciones'][$posOpcion]['ruta'] = $opcion->ruta;
                        $menu[$posModulo]['opciones'][$posOpcion]['consulta'] = $opcion->consulta == 1 ? true : false;
                        $menu[$posModulo]['opciones'][$posOpcion]['adiciona'] = $opcion->adiciona == 1 ? true : false;
                        $menu[$posModulo]['opciones'][$posOpcion]['edita'] = $opcion->edita == 1 ? true : false;
                        $menu[$posModulo]['opciones'][$posOpcion]['elimina'] = $opcion->elimina == 1 ? true : false;
                        $menu[$posModulo]['opciones'][$posOpcion]['ejecuta'] = $opcion->ejecuta == 1 ? true : false;
                        
                        $posOpcion++;
                    }
                }

                // Si se agrega el módulo al menú, se incrementa el contador del índice del array.
                if ($moduloTieneOpciones)
                {
                    $posModulo++;
                }
            }
        }

        if (empty($menu))
        {
            return false;
        }

        return $menu;
    }

    public static function getVariablesConfiguracion()
    {
        $variables = Variable::all();
        return $variables;
    }

    public static function validarFechaFormato($formato, $fecha)
    {
        $d = \DateTime::createFromFormat($formato, $fecha);
        return $d && $d->format($formato) === $fecha;
    }

    public static function getFechaFormato($formato, $fecha)
    {
        Date::setLocale('es');
        $date = new Date($fecha);
        return $date->format($formato);
    }

    public static function getFechaActual($formato)
    {
        date_default_timezone_set(env('TIME_ZONE'));
        return GeneralService::getFechaFormato($formato, time());
    }

    public static function enviarEmail($email, $nombre, $asunto, $mensaje)
    {
        try
        {
            $mail = new \PHPMailer(true);
            $mail->CharSet = env('GMAIL_CHARSET');
            $mail->isSMTP();
            $mail->SMTPAuth = true;
            $mail->SMTPSecure = env('GMAIL_SMTP_SECURE');
            $mail->Host = env('GMAIL_HOST');
            $mail->Port = env('GMAIL_PORT');
            $mail->Username = env('GMAIL_USERNAME');
            $mail->Password = env('GMAIL_PASSWORD');
            $mail->SetFrom(env('GMAIL_USERNAME'), env('GMAIL_NAME'));
            $mail->AddAddress($email, $nombre);
            $mail->Subject = $asunto;
            $mail->MsgHTML($mensaje);
            
            if ($mail->Send())
            {
                return true;
            }
            else
            {
                return false;
            }
        }
        catch(phpmailerException $e)
        {
            return false;
        }
    }

    public static function getParametroDesc($grupo, $parametro)
    {
        $parametro = Parametro::where("grupo", $grupo)
                              ->where("parametro", $parametro)
                              ->get()
                              ->first();

        return $parametro->nombre;
    }

    public static function getAgenteByPersona($persona)
    {
        $agente = VTAgente::where('persona', $persona)
                          ->get()
                          ->first();

        return $agente;
    }

    public static function eliminarArchivosCarpeta($ruta)
    {
        try
        {
            $handle = opendir($ruta);

            while ($file = readdir($handle))
            {
                $firma = $ruta . '/' . $file;

                if (is_file($firma))
                {
                    unlink($firma);
                }
            }
        }
        catch(\Exception $e)
        {
            return false;
        }

        return true;
    }    
}