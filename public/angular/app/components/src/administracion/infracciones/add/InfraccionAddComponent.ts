import { Component, Input, OnInit } from '@angular/core';

import { IInfraccion } from "../../../../../interfaces/IInfraccion";

import { IUsuario } from "../../../../../interfaces/IUsuario";
import { IOpcion } from "../../../../../interfaces/IOpcion";

import { InfraccionService } from "../../../../../services/InfraccionService";
import { AuditoriaService } from "../../../../../services/AuditoriaService";

import { NotificationsService } from 'angular2-notifications/components';
import { SimpleNotificationsComponent } from 'angular2-notifications/components';

declare var jQuery : any;
 
@Component({
    selector: 'infraccion-add',
    templateUrl: './app/components/src/administracion/infracciones/add/infraccion-add.html',
    bindings: [InfraccionService, AuditoriaService, NotificationsService],
    directives: [
        SimpleNotificationsComponent
    ]
})

export class InfraccionAddComponent implements OnInit
{
	isLoading: boolean = false;

    accionAudit: number = 2; // Adicionar

    userLogin: IUsuario;
    opcion: IOpcion;

    infraccionForm: IInfraccion;
    
    errores: Array<Object> = [];

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

    constructor(private infraccionService: InfraccionService,
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

    private insertar() : void
    {
        this.isLoading = true;
        this.resetErrores();

    	let infraccionString = this.generarInfraccionString(this.infraccionForm);
 
        this.infraccionService.insert(infraccionString).then(
            (res) => {
                this.auditar(res.infraccion);
                this.isLoading = false;
            
                this.notificationService.success("Operación exitosa", "La infracción fue creada correctamente.");
                this.resetFormulario();
                this.cerrarVentana();

                this.isLoading = false;
            },
            (error) => {
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
                    this.errores.push("Ha ocurrido un error al crear la infracción.");
                }

                this.isLoading = false;
            }
        );
    }

    private generarInfraccionString(infraccion) : string
    {
        return '&codigo=' + (infraccion.codigo != null ? infraccion.codigo : '') +
               '&nombre_corto=' + (infraccion.nombre_corto != null ? infraccion.nombre_corto : '') +
               '&descripcion=' + (infraccion.descripcion != null ? infraccion.descripcion : '') +
               '&salarios_dia=' + (infraccion.salarios_dia != null ? infraccion.salarios_dia : '') +
               '&reporta_simit=' + (infraccion.reporta_simit ? 1 : 0) +
               '&sancion_auto=' + (infraccion.sancion_auto ? 1 : 0) +
               '&usuario=' + this.userLogin.usuario;
    }

    private auditar(infraccion) : boolean
    {
        try
        {
            let infraccionAudit = this.generarInfraccionAudit(infraccion);
            this.auditoriaService.insert(this.opcion.opcion, this.accionAudit, infraccionAudit);

            return true;
        }
        catch(error)
        {
            return false;
        }
    }

    private generarInfraccionAudit(infraccion) : string
    {
        let infraccionAudit = {
            infraccion: infraccion['infraccion'],
            codigo: infraccion['codigo'],
            nombre_corto: infraccion['nombre_corto'],
            descripcion: infraccion['descripcion'],
            salarios_dia: infraccion['salarios_dia'],
            reporta_simit: infraccion['reporta_simit'],
            sancion_auto: infraccion['sancion_auto'],
            usuario: infraccion['usuario'],
            fecha_registra: infraccion['fecha_registra']
        };

        return JSON.stringify(infraccionAudit);
    }

    private resetErrores() : void
    {
        this.errores = [];
    }

    private resetFormulario() : void
    {
        this.infraccionForm = JSON.parse('{' + 
            ' "codigo" : null,' +
            ' "nombre_corto" : "",' +
            ' "descripcion" : "",' +
            ' "salarios_dia" : "",' +
            ' "reporta_simit" : false,' +
            ' "sancion_auto" : false' +
        '}');

        this.resetErrores();
    }

    private cerrarVentana() : void
    {
        jQuery('#add-infraccion').modal('hide');
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