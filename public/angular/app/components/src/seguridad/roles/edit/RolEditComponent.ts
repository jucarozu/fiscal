import { Component, Input, OnInit } from '@angular/core';

import { IRol } from "../../../../../interfaces/IRol";
import { IUsuario } from "../../../../../interfaces/IUsuario";
import { IOpcion } from "../../../../../interfaces/IOpcion";

import { RolService } from "../../../../../services/RolService";
import { AuditoriaService } from "../../../../../services/AuditoriaService";

import { NotificationsService } from 'angular2-notifications/components';
import { SimpleNotificationsComponent } from 'angular2-notifications/components';

declare var jQuery : any;
 
@Component({
    selector: 'rol-edit',
    templateUrl: './app/components/src/seguridad/roles/edit/rol-edit.html',
    bindings: [RolService, AuditoriaService, NotificationsService],
    directives: [SimpleNotificationsComponent]
})
 
export class RolEditComponent implements OnInit
{
    isLoading: boolean = false;

    accionAudit: number = 3; // Editar

    @Input('rol') rolForm: IRol;
    
    errores: Array<Object> = [];
    
    userLogin: IUsuario;
    opcion: IOpcion;

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

    constructor(private rolService: RolService, 
                private auditoriaService: AuditoriaService, 
                private notificationService: NotificationsService) {}

    ngOnInit()
    {
        if (this.userLogin == null)
            this.userLogin = JSON.parse(localStorage.getItem('user_login'));

        if (this.opcion == null)
            this.opcion = JSON.parse(localStorage.getItem('opcion'));
    }
 
    private actualizar()
    {
        this.isLoading = true;
        this.resetErrores();

        let rolString = this.generarRolString(this.rolForm);
 
        this.rolService.update(rolString, this.rolForm.rol).then(
            (res) => {
                this.isLoading = false;

                if (this.auditar(res.rol, this.rolForm.opciones))
                {
                    this.notificationService.success("Operación exitosa", "El rol fue modificado correctamente.");
                    this.cerrarVentana();
                }
                else
                {
                    this.errores.push("Ha ocurrido un error al modificar el rol.");
                }
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
                    this.errores.push("Ha ocurrido un error al modificar el rol.");
                }
            }
        );
    }

    private auditar(rol, opciones) : boolean
    {
        try
        {
            let rolAudit = this.generarRolAudit(rol, opciones);
            this.auditoriaService.insert(this.opcion.opcion, this.accionAudit, rolAudit);

            return true;
        }
        catch(error)
        {
            return false;
        }
    }
 
    private generarRolString(rol) : string
    {
        return '&rol=' + rol.rol +
               '&descripcion=' + (rol.descripcion != undefined ? rol.descripcion : '') +
               '&opciones=' + JSON.stringify(rol.opciones).replace(/"/g, '\\"') +
               '&usuario_asigna=' + this.userLogin.usuario;
    }

    private generarRolAudit(rol, opciones) : string
    {
        let rolAudit = {
            rol : rol['rol'],
            descripcion : rol['descripcion'],
            opciones : []
        };

        for (let i in opciones)
        {
            if (opciones[i]['consulta'] || opciones[i]['adiciona'] || opciones[i]['edita'] || opciones[i]['elimina'] || opciones[i]['ejecuta'])
            {
                rolAudit['opciones'].push(
                    {
                        'modulo' : opciones[i]['modulo'], 
                        'opcion' : opciones[i]['opcion'], 
                        'consulta' : opciones[i]['consulta'], 
                        'adiciona' : opciones[i]['adiciona'], 
                        'edita' : opciones[i]['edita'], 
                        'elimina' : opciones[i]['elimina'], 
                        'ejecuta' : opciones[i]['ejecuta']
                    }
                );
            }
        }

        return JSON.stringify(rolAudit);
    }

    private resetErrores() : void
    {
        this.errores = [];
    }

    private cerrarVentana() : void
    {
        jQuery('#edit-rol').modal('hide');
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