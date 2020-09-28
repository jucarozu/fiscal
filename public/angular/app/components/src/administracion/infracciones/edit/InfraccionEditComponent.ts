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
    selector: 'infraccion-edit',
    templateUrl: './app/components/src/administracion/infracciones/edit/infraccion-edit.html',
    bindings: [InfraccionService, AuditoriaService, NotificationsService],
    directives: [
        SimpleNotificationsComponent
    ]
})

export class InfraccionEditComponent implements OnInit
{
    isLoading: boolean = false;

    accionAudit: number = 3; // Editar

    userLogin: IUsuario;
    opcion: IOpcion;

    @Input('infraccion') infraccionForm: IInfraccion;

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
    }

    private agregarEventos()
    {
        jQuery('#edit-infraccion').on('show.bs.modal', function() {
            jQuery('#btn-reset').click();
        });
    }

    private actualizar()
    {
        this.isLoading = true;
        this.resetErrores();

    	let infraccionString = this.generarInfraccionString(this.infraccionForm);
 
        this.infraccionService.update(infraccionString, this.infraccionForm.infraccion).then(
            (res) => {
                this.auditar(res.infraccion);
                this.isLoading = false;
                
                this.notificationService.success("Operación exitosa", "La infracción fue modificada correctamente.");
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
                    this.errores.push("Ha ocurrido un error al modificar la infracción.");
                }
            }
        );
    }

    private generarInfraccionString(infraccion) : string
    {
        return '&infraccion=' + (infraccion.infraccion != null ? infraccion.infraccion : '') +
               '&descripcion=' + (infraccion.descripcion != null ? infraccion.descripcion : '') +
               '&salarios_dia=' + (infraccion.salarios_dia != null ? infraccion.salarios_dia : '') +
               '&reporta_simit=' + (infraccion.reporta_simit ? 1 : 0) +
               '&sancion_auto=' + (infraccion.sancion_auto ? 1 : 0);
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
            descripcion: infraccion['descripcion'],
            salarios_dia: infraccion['salarios_dia'],
            reporta_simit: infraccion['reporta_simit'],
            sancion_auto: infraccion['sancion_auto']
        };

        return JSON.stringify(infraccionAudit);
    }

    private resetFormulario() : void
    {
        this.infraccionService.getById(this.infraccionForm.infraccion).then(
            infraccion => {
                this.infraccionForm = infraccion;
            }
        );
    }

    private resetErrores() : void
    {
        this.errores = [];
    }

    private cerrarVentana() : void
    {
        jQuery('#edit-infraccion').modal('hide');
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