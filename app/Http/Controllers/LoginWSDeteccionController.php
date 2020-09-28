<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Exceptions\Exception;

use JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;

use App\Models\VTUsuarioRol;

class LoginWSDeteccionController extends Controller
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
                return response()->json(['estado' => 'ERROR']);
            }

            // Validar si el usuario tiene asignado el rol de Web Service.
            $usuario = VTUsuarioRol::where("login", $credentials['login'])
                                   ->where("estado", $credentials['estado'])
                                   ->where("rol", 64)
                                   ->orderBy("rol_nombre")
                                   ->get()
                                   ->first();

            if (count($usuario) > 0)
            {
                return response()->json(['estado' => 'OK', 'usuario' => $usuario->usuario]);
            }

            return response()->json(['estado' => 'ERROR']);
        }
        catch (JWTException $e)
        {
            return response()->json(['estado' => 'ERROR']);
        }
    }
}
