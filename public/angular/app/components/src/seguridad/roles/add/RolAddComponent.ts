import { Component, OnInit } from '@angular/core';

import { IRol } from "../../../../../interfaces/IRol";

import { IUsuario } from "../../../../../interfaces/IUsuario";
import { IOpcion } from "../../../../../interfaces/IOpcion";

import { RolService } from "../../../../../services/RolService";
import { OpcionService } from "../../../../../services/OpcionService";
import { AuditoriaService } from "../../../../../services/AuditoriaService";

import { NotificationsService } from 'angular2-notifications/components';
import { SimpleNotificationsComponent } from 'angular2-notifications/components';

declare var jQuery : any;
 
@Component({
    selector: 'rol-add',
    templateUrl: './app/components/src/seguridad/roles/add/rol-add.html',
    bindings: [RolService, OpcionService, AuditoriaService, NotificationsService],
    directives: [SimpleNotificationsComponent]
})
 
export class RolAddComponent implements OnInit
{
    isLoading: boolean = false;

    accionAudit: number = 2; // Adicionar

    rolForm: IRol;
    
    errores: Array<Object> = [];

    userLogin: IUsuario;
    opcion: IOpcion;

    opciones: Array<Object> = [];

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
                private opcionService: OpcionService, 
                private auditoriaService: AuditoriaService, 
                private notificationService: NotificationsService) {}

    ngOnInit()
    {
        if (this.userLogin == null)
            this.userLogin = JSON.parse(localStorage.getItem('user_login'));

        if (this.opcion == null)
            this.opcion = JSON.parse(localStorage.getItem('opcion'));

        this.resetFormulario();
    }

    private getOpciones() : void
    {
        this.opcionService.get()
            .then(opciones => 
                {
                    this.opciones = [];
                    
                    for (let i in opciones)
                    {
                        this.opciones.push({
                            modulo : opciones[i]['modulo'], 
                            modulo_nombre : opciones[i]['modulo_nombre'], 
                            opcion : opciones[i]['opcion'], 
                            opcion_nombre : opciones[i]['opcion_nombre'], 
                            consulta : opciones[i]['consulta'], 
                            adiciona : opciones[i]['adiciona'], 
                            edita : opciones[i]['edita'], 
                            elimina : opciones[i]['elimina'], 
                            ejecuta : opciones[i]['ejecuta'], 
                        });
                    }
                });
    }
 
    private insertar() : void
    {
        this.isLoading = true;
        this.resetErrores();

        let rolString = this.generarRolString(this.rolForm, this.opciones);
 
        this.rolService.insert(rolString).then(
            (res) => {
                this.auditar(res.rol, this.opciones);
                this.isLoading = false;
                
                this.notificationService.success("Operación exitosa", "El rol fue creado correctamente.");
                this.resetFormulario();
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
                    this.errores.push("Ha ocurrido un error al crear el rol.");
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
 
    private generarRolString(rol, opciones) : string
    {
        return '&nombre=' + (rol.nombre != null ? rol.nombre : '') +
               '&descripcion=' + (rol.descripcion != null ? rol.descripcion : '') +
               '&opciones=' + JSON.stringify(opciones).replace(/"/g, '\\"') +
               '&usuario_asigna=' + this.userLogin.usuario;
    }

    private generarRolAudit(rol, opciones) : string
    {
        let rolAudit = {
            rol : rol['rol'],
            nombre : rol['nombre'],
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

    private resetFormulario() : void
    {
        this.rolForm = JSON.parse('{' + 
            ' "nombre" : "",' + 
            ' "descripcion" : ""' + 
        '}');
        
        this.getOpciones();
    }

    private cerrarVentana() : void
    {
        jQuery('#add-rol').modal('hide');
    }

    private close() : void
    {
        this.resetErrores();
        this.resetFormulario();
        this.cerrarVentana();
    }

    private loading() : boolean
    {
        return this.isLoading;
    }
}