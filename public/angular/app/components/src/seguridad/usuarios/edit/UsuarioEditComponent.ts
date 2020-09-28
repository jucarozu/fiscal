import { Component, Input, OnInit } from '@angular/core';

import { IUsuario } from "../../../../../interfaces/IUsuario";
import { IOpcion } from "../../../../../interfaces/IOpcion";

import { UsuarioService } from "../../../../../services/UsuarioService";
import { ParametroService } from "../../../../../services/ParametroService";
import { AuditoriaService } from "../../../../../services/AuditoriaService";

import { NotificationsService } from 'angular2-notifications/components';
import { SimpleNotificationsComponent } from 'angular2-notifications/components';

declare var jQuery : any;
 
@Component({
    selector: 'usuario-edit',
    templateUrl: './app/components/src/seguridad/usuarios/edit/usuario-edit.html',
    bindings: [UsuarioService, ParametroService, AuditoriaService, NotificationsService],
    directives: [SimpleNotificationsComponent]
})
 
export class UsuarioEditComponent implements OnInit
{
    isLoading: boolean = false;

    accionAudit: number = 3; // Editar

    gpTipoDocumento: number = 1;
    gpCargo: number = 4;

    userLogin: IUsuario;
    opcion: IOpcion;

    @Input('usuario') usuarioForm: IUsuario;
    
    mensaje: string;
    errores: Array<Object> = [];

    documentos: Array<Object> = [];
    cargos: Array<Object> = [];

    notificationsOptions = {
        timeOut: 5000,
        lastOnBottom: false,
        clickToClose: true,
        maxLength: 0,
        maxStack: 7,
        showProgressBar: false,
        pauseOnHover: true,
        preventDuplicates: true,
        preventLastDuplicates: false
    };

    constructor(private usuarioService: UsuarioService, 
    			private parametroService: ParametroService, 
                private auditoriaService: AuditoriaService, 
                private notificationService: NotificationsService) {}

    ngOnInit()
    {
        if (this.userLogin == null)
            this.userLogin = JSON.parse(localStorage.getItem('user_login'));

        if (this.opcion == null)
            this.opcion = JSON.parse(localStorage.getItem('opcion'));

        this.cargarCombos();
    }

    private cargarCombos()
    {
        this.parametroService.getByGrupo(this.gpTipoDocumento).then(documentos => { this.documentos = documentos });
        this.parametroService.getByGrupo(this.gpCargo).then(cargos => { this.cargos = cargos });
    }
 
    private actualizar()
    {
        this.isLoading = true;
        this.resetErrores();

    	if (!this.validarRoles(this.usuarioForm.roles))
        {
            this.isLoading = false;
            return;
        }

        let usuarioString = this.generarUsuarioString(this.usuarioForm);
 
        this.usuarioService.update(usuarioString, this.usuarioForm.usuario).then(
            (res) => {
                this.auditar(res.usuario, this.usuarioForm.roles);
                this.isLoading = false;
                
                this.notificationService.success("Operación exitosa", "El usuario fue modificado correctamente.");
                this.cerrarVentana();
            },
            (error) => {
                this.isLoading = false;
                
                // Código de respuesta de Laravel cuando falla la validación
                if (error.status === 422)
                {
                    let errores = error.json();

                    for (var key in errores)
                    {
                        this.errores.push(errores[key]);
                    }
                }
                else
                {
                    this.errores.push("Ha ocurrido un error al modificar el usuario.");
                }
            }
        );
    }

    private validarRoles(roles) : boolean
    {
        for (let i in roles)
        {
            if (roles[i]['tiene_rol'])
            {
                return true;
            }
        }

        this.errores.push("El usuario debe tener al menos un rol asignado.");        
        return false;
    }
 
    private generarUsuarioString(usuario) : string
    {
        return '&usuario=' + usuario.usuario +
        	   '&cargo=' + (usuario.cargo != null ? usuario.cargo : '') +
               '&email=' + (usuario.email != null ? usuario.email : '') +
               '&roles=' + JSON.stringify(usuario.roles).replace(/"/g, '\\"');
    }

    private auditar(usuario, roles) : boolean
    {
        try
        {
            let usuarioAudit = this.generarUsuarioAudit(usuario, roles);
            this.auditoriaService.insert(this.opcion.opcion, this.accionAudit, usuarioAudit);

            return true;
        }
        catch(error)
        {
            return false;
        }
    }

    private generarUsuarioAudit(usuario, roles) : string
    {
        let usuarioAudit = {
            usuario : usuario["usuario"],
            cargo : usuario['cargo'], 
            email : usuario['email'],
            roles : []
        };

        for (let i in roles)
        {
            if (roles[i]['tiene_rol'])
            {
                usuarioAudit['roles'].push(
                    {
                        'rol' : roles[i]['rol'], 
                        'nombre' : roles[i]['nombre']
                    }
                );
            }
        }

        return JSON.stringify(usuarioAudit);
    }

    private restablecerPassword()
    {
        this.isLoading = true;
        this.resetErrores();

        this.usuarioService.resetPassword(this.usuarioForm.usuario).then(
            (res) => {
                this.isLoading = false;
                this.mensaje = "La contraseña fue restablecida correctamente.";
            },
            (error) => {
                this.isLoading = false;
                this.errores.push("Ha ocurrido un error al restablecer la contraseña.");
            }
        );
    }

    private forzarPassword()
    {
        this.isLoading = true;
        this.resetErrores();
        
        this.usuarioService.forcePassword(this.usuarioForm.usuario).then(
            (res) => {
                this.isLoading = false;
                this.mensaje = "Cambio de contraseña forzado correctamente.";
            },
            (error) => {
                this.isLoading = false;
                this.errores.push("Ha ocurrido un error al forzar el cambio de contraseña.");
            }
        );
    }

    private resetErrores() : void
    {
        this.mensaje = "";
        this.errores = [];
    }

    private cerrarVentana() : void
    {
        jQuery('#edit-usuario').modal('hide');
    }

    private close() : void
    {
        this.resetErrores();
        this.cerrarVentana();
    }

    private loading() : boolean
    {
        return this.isLoading;
    }
}