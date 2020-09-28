<?php

namespace App\Http\Controllers;

use App\Http\Requests;
use App\Http\Requests\UsuarioAddForm;
use App\Http\Requests\UsuarioEditForm;
use App\Http\Requests\PasswordForm;

use App\Services\GeneralService;

use App\Models\Usuario;
use App\Models\Rol;
use App\Models\RolUsuario;
use App\Models\VTUsuario;
use App\Models\VTUsuarioRol;

use Hash;

class UsuarioController extends Controller
{
    /**
     * Display a listing of the users.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $i=0;

        foreach (VTUsuario::orderBy('nombres')->get() as $usuario)
        {
            $roles = Rol::orderBy('nombre')->get();

            if (!empty($roles->toArray()))
            {
                $usuarios[$i]['usuario'] = $usuario->usuario;
                $usuarios[$i]['persona'] = $usuario->persona;
                $usuarios[$i]['tipo_doc'] = $usuario->tipo_doc;
                $usuarios[$i]['tipo_doc_desc'] = $usuario->tipo_doc_desc;
                $usuarios[$i]['numero_doc'] = $usuario->numero_doc;
                $usuarios[$i]['nombres'] = $usuario->nombres;
                $usuarios[$i]['apellidos'] = $usuario->apellidos;
                $usuarios[$i]['nombres_apellidos'] = $usuario->nombres_apellidos;
                $usuarios[$i]['login'] = $usuario->login;
                $usuarios[$i]['password'] = $usuario->password;
                $usuarios[$i]['cargo'] = $usuario->cargo;
                $usuarios[$i]['cargo_desc'] = $usuario->cargo_desc;
                $usuarios[$i]['fecha_alta'] = $usuario->fecha_alta;
                $usuarios[$i]['fecha_baja'] = $usuario->fecha_baja;
                $usuarios[$i]['email'] = $usuario->email;
                $usuarios[$i]['estado'] = $usuario->estado;
                $usuarios[$i]['estado_desc'] = $usuario->estado_desc;
                $usuarios[$i]['usuario_registra'] = $usuario->usuario_registra;
                $usuarios[$i]['fecha_password'] = $usuario->fecha_password;
                $usuarios[$i]['fecha_vence_passw'] = $usuario->fecha_vence_passw;

                $j=0;

                foreach ($roles as $rol)
                {
                    $usuarios[$i]['roles'][$j]['rol'] = $rol->rol;
                    $usuarios[$i]['roles'][$j]['nombre'] = $rol->nombre;
                    $usuarios[$i]['roles'][$j]['descripcion'] = $rol->descripcion;

                    $vtUsuarioRol = VTUsuarioRol::where('usuario', $usuario->usuario)
                                                ->where('rol', $rol->rol)
                                                ->select('rol')
                                                ->orderBy('rol_nombre')
                                                ->get()
                                                ->first();

                    if (!empty($vtUsuarioRol))
                    {
                        $usuarios[$i]['roles'][$j]['tiene_rol'] = true;
                    }
                    else
                    {
                        $usuarios[$i]['roles'][$j]['tiene_rol'] = false;
                    }

                    $j++;
                }

                $i++;
            }
        }

        return response()->json(['usuarios' => $usuarios]);
    }

    /**
     * Display the specified user.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $usuario = VTUsuario::find($id);
        return response()->json(['usuario' => $usuario]);
    }

    /**
     * Store a newly created user in storage.
     *
     * @param  \App\Http\Requests\UsuarioAddForm  $request
     * @return \Illuminate\Http\Response
     */
    public function store(UsuarioAddForm $request)
    {
        if ($request->ajax())
        {
            $password = $this->generatePassword();
            $fechaActual = GeneralService::getFechaActual('Y-m-d');

            $usuario = new Usuario();
            $usuario->persona = $request->input('persona');
            $usuario->login = $request->input('login');
            $usuario->contrasena = Hash::make($password);
            $usuario->cargo = $request->input('cargo');
            $usuario->email = $request->input('email');
            $usuario->estado = 1;
            $usuario->usuario_registra = $request->input('usuario_registra');
            $usuario->fecha_password = $fechaActual;
            $usuario->fecha_vence_passw = $fechaActual;
            
            if ($usuario->save())
            {
                if ($request->input('roles') != null)
                {
                    $roles = json_decode(stripslashes($request->input('roles')));

                    foreach ($roles as $rol)
                    {
                        if ($rol->tiene_rol)
                        {
                            $rolUsuario = new RolUsuario();
                            $rolUsuario->rol = $rol->rol;
                            $rolUsuario->usuario = $usuario->usuario;
                            
                            $rolUsuario->save();
                        }
                    }
                }

                if (!$this->sendPassword($usuario, $password))
                {
                    return response()->json(['error' => 'Error al enviar el email de confirmación.'], 500);
                }
            }

            return response()->json(['mensaje' => 'Usuario registrado', 'usuario' => $usuario]);
        }
    }

    /**
     * Update the specified user in storage.
     *
     * @param  \App\Http\Requests\UsuarioEditForm  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(UsuarioEditForm $request, $id)
    {
        if ($request->ajax())
        {
            $usuario = Usuario::find($id);
            $usuario->cargo = $request->input('cargo');
            $usuario->email = $request->input('email');

            if ($usuario->save())
            {
                RolUsuario::where("usuario", $usuario->usuario)->delete();
                $roles = json_decode(stripslashes($request->input('roles')));

                foreach ($roles as $rol)
                {
                    if ($rol->tiene_rol)
                    {
                        $rolUsuario = new RolUsuario();
                        $rolUsuario->rol = $rol->rol;
                        $rolUsuario->usuario = $usuario->usuario;

                        $rolUsuario->save();
                    }
                }
            }

            return response()->json(['mensaje' => 'Usuario actualizado', 'usuario' => $usuario]);
        }
    }

    /**
     * Deactivate the specified user.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $usuario = Usuario::find($id);
        $usuario->fecha_baja = GeneralService::getFechaActual('Y-m-d');
        $usuario->estado = 2;
        
        if (!$usuario->save())
        {
            return response()->json(['error' => 'Error al inactivar el usuario'], 500);
        }

        return response()->json(['mensaje' => 'Usuario inactivado']);
    }

    /**
     * Display the specified user by person.
     *
     * @param  int  $persona
     * @return \Illuminate\Http\Response
     */
    public function getByPersona($persona)
    {
        $usuario = VTUsuario::where('persona', $persona)
                            ->get()
                            ->first();

        return response()->json(['usuario' => $usuario]);
    }

    /**
     * Reset password the specified user.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function resetPassword($id)
    {
        $password = $this->generatePassword();
        $fechaActual = GeneralService::getFechaActual('Y-m-d');

        $usuario = Usuario::find($id);
        $usuario->contrasena = Hash::make($password);
        $usuario->fecha_password = $fechaActual;
        $usuario->fecha_vence_passw = $fechaActual;

        if ($usuario->save())
        {
            $asunto = "Restablecimiento de contraseña";

            $mensaje = "<p>Señor(a) " . VTUsuario::find($usuario->usuario)->nombres_apellidos . ",</p>"
                     . "<p>Se ha generado una nueva contraseña para su usuario. Ingrese en la aplicación con los siguientes datos: </p>"
                     . "<ul>"
                     . "<li><b>Usuario:</b> " . $usuario->login . "</li>"
                     . "<li><b>Contraseña:</b> " . $password . "</li>"
                     . "</ul>";

            if (!GeneralService::enviarEmail($usuario->email, $usuario->nombres_apellidos, $asunto, $mensaje))
            {
                return response()->json(['error' => 'Error al enviar email de restablecimiento de contraseña'], 500);
            }
        }
        else
        {
            return response()->json(['error' => 'Error al restablecer contraseña'], 500);
        }

        return response()->json(['mensaje' => 'Contraseña restablecida']);
    }

    /**
     * Force change of password the specified user.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function forcePassword($id)
    {
        $fechaActual = GeneralService::getFechaActual('Y-m-d');

        $usuario = Usuario::find($id);
        $usuario->fecha_vence_passw = $fechaActual;

        if (!$usuario->save())
        {
            return response()->json(['error' => 'Error al forzar cambio de contraseña'], 500);
        }

        return response()->json(['mensaje' => 'Cambio de contraseña forzado']);
    }

    /**
     * Change of password the specified user.
     *
     * @param  \App\Http\Requests\PasswordForm  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function changePassword(PasswordForm $request, $id)
    {
        if ($request->ajax())
        {
            $fechaActual = GeneralService::getFechaActual('Y-m-d');

            $usuario = Usuario::find($id);
            $usuario->contrasena = Hash::make($request->input('password_nueva'));
            $usuario->fecha_password = $fechaActual;
            $usuario->fecha_vence_passw = null;

            if (!$usuario->save())
            {
                return response()->json(['error' => 'Error al cambiar contraseña'], 500);
            }

            return response()->json(['mensaje' => 'Contraseña cambiada']);
        }
    }

    /**
     * Send email with user's password.
     *
     * @param  App\Usuario  $usuario
     * @param  string  $password
     * @return boolean
     */
    public function sendPassword($usuario, $password)
    {
        $asunto = "Confirmación de registro de usuario";

        $mensaje = "<p>¡Bienvenido, " . VTUsuario::find($usuario->usuario)->nombres_apellidos . "!</p>"
                 . "<p>Su usuario ha sido creado correctamente. Ingrese en la aplicación con los siguientes datos: </p>"
                 . "<ul>"
                 . "<li><b>Usuario:</b> " . $usuario->login . "</li>"
                 . "<li><b>Contraseña:</b> " . $password . "</li>"
                 . "</ul>"
                 . "<p>Por motivos de seguridad, en su próximo inicio de sesión se le pedirá que cambie su contraseña.</p>";

        if (!GeneralService::enviarEmail($usuario->email, $usuario->nombres_apellidos, $asunto, $mensaje))
        {
            return false;
        }
        
        return true;
    }

    /**
     * Generate user's password.
     *
     * @return string
     */
    public function generatePassword()
    {
        return substr(md5(microtime()), 1, 8);
    }
}
