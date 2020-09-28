import { Component, Input, OnInit } from '@angular/core';

import { IInfraDeteccion } from "../../../../../interfaces/IInfraDeteccion";
import { IDeteccion } from "../../../../../interfaces/IDeteccion";

import { IUsuario } from "../../../../../interfaces/IUsuario";
import { IOpcion } from "../../../../../interfaces/IOpcion";

import { InfraDeteccionService } from "../../../../../services/InfraDeteccionService";
import { InfraccionService } from "../../../../../services/InfraccionService";

import { NotificationsService } from 'angular2-notifications/components';
import { SimpleNotificationsComponent } from 'angular2-notifications/components';

declare var jQuery : any;
 
@Component({
    selector: 'infra-deteccion-add',
    templateUrl: './app/components/src/pruebas/infra-detecciones/add/infra-deteccion-add.html',
    bindings: [InfraDeteccionService, InfraccionService, NotificationsService],
    directives: [
        SimpleNotificationsComponent
    ]
})

export class InfraDeteccionAddComponent implements OnInit
{
	isLoading: boolean = false;

    accionAudit: number = 2; // Adicionar

    userLogin: IUsuario;
    opcion: IOpcion;

    @Input('deteccion') deteccionForm: IDeteccion;
    infraDeteccionForm: IInfraDeteccion;
    
    errores: Array<Object> = [];

    infracciones: Array<Object> = [];

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

    constructor(private infraDeteccionService: InfraDeteccionService,
                private infraccionService: InfraccionService,
                private notificationService: NotificationsService) {}

    ngOnInit()
    {
        if (this.userLogin == null)
            this.userLogin = JSON.parse(localStorage.getItem('user_login'));

        if (this.opcion == null)
            this.opcion = JSON.parse(localStorage.getItem('opcion'));

        this.resetFormulario();
    }

    private getInfracciones() : void
    {
        this.isLoading = true;

        this.infraccionService.get().then(infracciones => 
            {
                this.infracciones = [];
                
                for (let i in infracciones)
                {
                    this.infracciones.push({
                        infraccion : infracciones[i]['infraccion'], 
                        codigo : infracciones[i]['codigo'], 
                        nombre_corto : infracciones[i]['nombre_corto'], 
                        observacion : infracciones[i]['observacion'], 
                    });
                }

                this.isLoading = false;
            }
        );
    }

    private insertar() : void
    {
        this.isLoading = true;
        this.resetErrores();

    	let infraDeteccionString = this.generarInfraDeteccionString(this.infraDeteccionForm, this.deteccionForm.deteccion);
 
        this.infraDeteccionService.insert(infraDeteccionString).then(
            (res) => {
                this.isLoading = false;

                this.notificationService.success("Operación exitosa", "La infracción fue asociada a la detección correctamente.");
                this.resetFormulario();
                this.cerrarVentana();

                this.isLoading = false;
            },
            (error) => {
                // Código de respuesta de Laravel cuando falla la validación
                if (error.status === 422)
                {
                    this.errores.push(error.json());
                }
                else
                {
                    this.errores.push("Ha ocurrido un error al asociar la infracción a la detección.");
                }

                this.isLoading = false;
            }
        );
    }

    private generarInfraDeteccionString(infraDeteccion, deteccion) : string
    {
        return '&deteccion=' + deteccion +
               '&codigo=' + (infraDeteccion.codigo != null ? infraDeteccion.codigo : '') +
               '&observacion=' + (infraDeteccion.observacion != null ? infraDeteccion.observacion : '');
    }

    private resetErrores() : void
    {
        this.errores = [];
    }

    private resetFormulario() : void
    {
        this.infraDeteccionForm = JSON.parse('{' + 
            ' "infraccion" : null,' +
            ' "deteccion" : null,' +
            ' "codigo" : null,' +
            ' "nombre_corto" : "",' +
            ' "observacion" : ""' +
        '}');

        this.getInfracciones();

        this.resetErrores();
    }

    private cerrarVentana() : void
    {
        jQuery('#add-infra-deteccion').modal('hide');
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