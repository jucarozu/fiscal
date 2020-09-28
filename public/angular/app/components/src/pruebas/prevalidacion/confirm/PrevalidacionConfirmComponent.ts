import { Component, Input, OnInit } from '@angular/core';
import { Router, ROUTER_DIRECTIVES } from '@angular/router-deprecated';

import { IDeteccion } from "../../../../../interfaces/IDeteccion";
import { IDeteccionSeguimiento } from "../../../../../interfaces/IDeteccionSeguimiento";

import { IUsuario } from "../../../../../interfaces/IUsuario";
import { IOpcion } from "../../../../../interfaces/IOpcion";

import { PrevalidacionService } from "../../../../../services/PrevalidacionService";
import { AuditoriaService } from "../../../../../services/AuditoriaService";

import { NotificationsService } from 'angular2-notifications/components';
import { SimpleNotificationsComponent } from 'angular2-notifications/components';
 
declare var jQuery : any;
 
@Component({
    selector: 'prevalidacion-confirm',
    templateUrl: './app/components/src/pruebas/prevalidacion/confirm/prevalidacion-confirm.html',
    bindings: [PrevalidacionService, AuditoriaService, NotificationsService],
    directives: [
        SimpleNotificationsComponent
    ]
})
 
export class PrevalidacionConfirmComponent implements OnInit
{
    isLoading: boolean = false;

    accionAudit: number = 2; // Adicionar

    userLogin: IUsuario;
    opcion: IOpcion;

    @Input('deteccion') deteccionForm: IDeteccion;
    @Input('deteccionSeguimiento') deteccionSeguimientoForm: IDeteccionSeguimiento;

    errores: Array<Object> = [];

    constructor(private router: Router,
                private prevalidacionService: PrevalidacionService,
                private auditoriaService: AuditoriaService,
                private notificationService: NotificationsService) {}

    ngOnInit()
    {
        if (this.userLogin == null)
            this.userLogin = JSON.parse(localStorage.getItem('user_login'));

        if (this.opcion == null)
            this.opcion = JSON.parse(localStorage.getItem('opcion'));
    }

    private validar() : void
    {
        this.isLoading = true;

        // Datos de detección.
        this.deteccionForm.estado = 3; // Estado: Prevalidada

        // Datos de seguimiento de detección.
        this.deteccionSeguimientoForm.usuario = this.userLogin.usuario;
        this.deteccionSeguimientoForm.estado = 3; // Estado: Prevalidada

        let prevalidacionString = this.generarPrevalidacionString(this.deteccionForm, this.deteccionSeguimientoForm);

        this.prevalidacionService.validar(prevalidacionString).then(
            (res) => {
                this.auditar(this.deteccionForm);
                this.isLoading = false;

                this.notificationService.success("Operación exitosa", "La detección ha sido prevalidada correctamente.");
                this.cerrarVentana();
                this.router.navigate(['PruebasPrevalidacionView']);
            },
            (error) => {
                this.notificationService.error("Error", JSON.parse(error._body).mensaje);
                this.isLoading = false;
            }
        );
    }

    private generarPrevalidacionString(deteccion, deteccionSeguimiento) : string
    {
        let json_prevalidacion: Object = {};

        json_prevalidacion = {
            deteccion : deteccion.deteccion,
            fecha : deteccion.fecha,
            hora : deteccion.hora,
            fuente : deteccion.fuente,
            referencia_disp : deteccion.referencia_disp,
            latitud : deteccion.latitud,
            longitud : deteccion.longitud,
            direccion : deteccion.direccion,
            complemento_direccion : deteccion.complemento_direccion,
            placa : deteccion.placa,
            tipo_vehiculo : deteccion.tipo_vehiculo,
            color : deteccion.color,
            servicio : deteccion.servicio,
            nivel : deteccion.nivel,
            carril : deteccion.carril,
            sentido : deteccion.sentido,
            velocidad : deteccion.velocidad,
            unidad_velocidad : deteccion.unidad_velocidad,
            observaciones : deteccion.observaciones,
            estado : deteccion.estado,
            seguimiento : this.generarDeteccionSeguimientoJSON(deteccionSeguimiento)
        };

        return '&prevalidacion=' + JSON.stringify(json_prevalidacion).replace(/"/g, '\\"');
    }

    private generarDeteccionSeguimientoJSON(deteccionSeguimiento) : Object
    {
        let json_seguimiento: Object = {};

        json_seguimiento = {
            usuario : deteccionSeguimiento.usuario, 
            estado : deteccionSeguimiento.estado,
            observaciones : deteccionSeguimiento.observaciones
        };

        return json_seguimiento;
    }

    private auditar(deteccion) : boolean
    {
        try
        {
            let deteccionAudit = this.generarDeteccionAudit(deteccion);
            this.auditoriaService.insert(this.opcion.opcion, this.accionAudit, deteccionAudit);

            return true;
        }
        catch(error)
        {
            return false;
        }
    }

    private generarDeteccionAudit(deteccion) : string
    {
        let deteccionAudit = {
            deteccion : deteccion.deteccion,
            fecha : deteccion.fecha,
            hora : deteccion.hora,
            fuente : deteccion.fuente,
            referencia_disp : deteccion.referencia_disp,
            latitud : deteccion.latitud,
            longitud : deteccion.longitud,
            direccion : deteccion.direccion,
            complemento_direccion : deteccion.complemento_direccion,
            placa : deteccion.placa,
            tipo_vehiculo : deteccion.tipo_vehiculo,
            color : deteccion.color,
            servicio : deteccion.servicio,
            nivel : deteccion.nivel,
            carril : deteccion.carril,
            sentido : deteccion.sentido,
            velocidad : deteccion.velocidad,
            unidad_velocidad : deteccion.unidad_velocidad,
            observaciones : deteccion.observaciones,
            estado : deteccion.estado
        };

        return JSON.stringify(deteccionAudit);
    }

    private cerrarVentana() : void
    {
        jQuery('#confirm-prevalidacion').modal('hide');
    }
}