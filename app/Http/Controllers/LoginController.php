<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Exceptions\Exception;

use JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;

use App\Services\GeneralService;

use App\Models\VTUsuarioRol;

class LoginController extends Controller
{
    public function __construct()
    {
        $this->middleware('jwt.auth', ['except' => ['login']]);
    }
 
    public function login(Request $request)
    {
        // Obtener credenciales del usuario.
        $credentials = [ 'login' => $request->input('login'), 'password' => $request->input('password'), 'estado' => 1 ];
 
        try
        {
            // Validar credenciales del usuario.
            if (! $token = JWTAuth::attempt($credentials))
            {
                return response()->json(['estado' => 'ERROR', 'mensaje' => 'Credenciales incorrectas'], 401);
            }
            
            // Obtener los datos del usuario.
            $user_login = $this->getUsuario($credentials['login']);

            // Validar que el usuario tenga configurado un menú de opciones.
            if (! $menu = GeneralService::getMenuAplicacion($user_login['usuario']))
            {
                return response()->json(['estado' => 'ERROR', 'mensaje' => 'El usuario no tiene configurado un menú de opciones'], 403);
            }

            // Obtener las variables de configuración de la aplicación.
            $config_variables = GeneralService::getVariablesConfiguracion();
        }
        catch (JWTException $e)
        {
            return response()->json(['estado' => 'ERROR', 'mensaje' => 'No se pudo generar el token para el usuario'], 500);
        }
 
        return response()->json(compact('token', 'user_login', 'menu', 'config_variables'));
    }

    public function getUsuario($login)
    {
        $roles = VTUsuarioRol::where("login", $login)
                             ->where("estado", 1)
                             ->orderBy("rol_nombre")
                             ->get();

        $usuario["usuario"] = $roles->first()->usuario;
        $usuario["persona"] = $roles->first()->persona;
        $usuario["tipo_doc"] = $roles->first()->tipo_doc;
        $usuario["tipo_doc_desc"] = $roles->first()->tipo_doc_desc;
        $usuario["numero_doc"] = $roles->first()->numero_doc;
        $usuario["nombres"] = $roles->first()->nombres;
        $usuario["apellidos"] = $roles->first()->apellidos;
        $usuario["nombres_apellidos"] = $roles->first()->nombres_apellidos;
        $usuario["login"] = $roles->first()->login;
        $usuario["password"] = $roles->first()->password;
        $usuario["cargo"] = $roles->first()->cargo;
        $usuario["cargo_desc"] = $roles->first()->cargo_desc;
        $usuario["fecha_alta"] = $roles->first()->fecha_alta;
        $usuario["fecha_baja"] = $roles->first()->fecha_baja;
        $usuario["email"] = $roles->first()->email;
        $usuario["estado"] = $roles->first()->estado;
        $usuario["estado_desc"] = $roles->first()->estado_desc;
        $usuario["usuario_registra"] = $roles->first()->usuario_registra;
        $usuario["fecha_password"] = $roles->first()->fecha_password;
        $usuario["fecha_vence_passw"] = $roles->first()->fecha_vence_passw;

        $i=0;

        foreach ($roles as $rol)
        {
            $usuario["roles"][$i]["rol"] = $rol->rol;
            $usuario["roles"][$i]["nombre"] = $rol->rol_nombre;

            $i++;
        }

        return $usuario;
    }
}
