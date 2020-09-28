import { Component, Input, OnInit } from '@angular/core';
import { Router, ROUTER_DIRECTIVES } from '@angular/router-deprecated';

import { IDeteccion } from "../../../../../interfaces/IDeteccion";
import { IDeteccionDescarte } from "../../../../../interfaces/IDeteccionDescarte";
import { IDeteccionSeguimiento } from "../../../../../interfaces/IDeteccionSeguimiento";

import { IUsuario } from "../../../../../interfaces/IUsuario";
import { IOpcion } from "../../../../../interfaces/IOpcion";

import { PrevalidacionService } from "../../../../../services/PrevalidacionService";
import { ParametroService } from "../../../../../services/ParametroService";
import { AuditoriaService } from "../../../../../services/AuditoriaService";

import { NotificationsService } from 'angular2-notifications/components';
import { SimpleNotificationsComponent } from 'angular2-notifications/components';

declare var jQuery : any;
 
@Component({
    selector: 'prevalidacion-descarte',
    templateUrl: './app/components/src/pruebas/prevalidacion/descarte/prevalidacion-descarte.html',
    bindings: [PrevalidacionService, ParametroService, AuditoriaService, NotificationsService],
    directives: [
        SimpleNotificationsComponent
    ]
})

export class PrevalidacionDescarteComponent implements OnInit
{
	isLoading: boolean = false;

    accionAudit: number = 4; // Eliminar

    gpMotivo: number = 24;

    userLogin: IUsuario;
    opcion: IOpcion;

    @Input('deteccion') deteccionForm: IDeteccion;
    @Input('deteccionSeguimiento') deteccionSeguimientoForm: IDeteccionSeguimiento;
    deteccionDescarteForm: IDeteccionDescarte;
    
    errores: Array<Object> = [];

    motivos: Array<Object> = [];

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

    constructor(private router: Router,
                private prevalidacionService: PrevalidacionService,
                private parametroService: ParametroService,
                private auditoriaService: AuditoriaService,
                private notificationService: NotificationsService) {}

    ngOnInit()
    {
        if (this.userLogin == null)
            this.userLogin = JSON.parse(localStorage.getItem('user_login'));

        if (this.opcion == null)
            this.opcion = JSON.parse(localStorage.getItem('opcion'));

        this.resetFormulario();
        this.cargarCombos();
    }

    private cargarCombos()
    {
        this.parametroService.getByGrupo(this.gpMotivo).then(motivos => { this.motivos = motivos });
    }

    private descartar() : void
    {
        this.isLoading = true;

        // Datos de detección.
        this.deteccionForm.estado = 4; // Estado: Descartada en prevalidación

        // Datos de seguimiento de detección.
        this.deteccionSeguimientoForm.deteccion = this.deteccionForm.deteccion;
        this.deteccionSeguimientoForm.usuario = this.userLogin.usuario;
        this.deteccionSeguimientoForm.estado = 1; // Estado: Descartada

        // Datos de descarte de detección.
        this.deteccionDescarteForm.deteccion = this.deteccionForm.deteccion;
        this.deteccionDescarteForm.tipo_descarte = 1;
        this.deteccionDescarteForm.usuario = this.userLogin.usuario;
        this.deteccionDescarteForm.observacion = this.deteccionSeguimientoForm.observaciones;
        this.deteccionDescarteForm.estado = 1; // Estado: Descartada

        let prevalidacionString = this.generarPrevalidacionString(this.deteccionForm, this.deteccionSeguimientoForm, this.deteccionDescarteForm);

        this.prevalidacionService.descartar(prevalidacionString).then(
            (res) => {
                this.auditar(this.deteccionDescarteForm);
                this.isLoading = false;

                this.notificationService.success("Operación exitosa", "La detección ha sido descartada correctamente.");
                this.cerrarVentana();
                this.router.navigate(['PruebasPrevalidacionView']);
            },
            (error) => {
                this.notificationService.error("Error", JSON.parse(error._body).mensaje);
                this.isLoading = false;
            }
        );
    }

    private generarPrevalidacionString(deteccion, deteccionSeguimiento, deteccionDescarte) : string
    {
        let json_prevalidacion: Object = {};

        json_prevalidacion = {
            deteccion : deteccion.deteccion,
            estado : deteccion.estado,
            seguimiento : this.generarDeteccionSeguimientoJSON(deteccionSeguimiento),
            descarte : this.generarDeteccionDescarteJSON(deteccion, deteccionDescarte)
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

    private generarDeteccionDescarteJSON(deteccion, deteccionDescarte) : Object
    {
        let json_descarte: Object = {};

        json_descarte = {
            tipo_descarte : deteccionDescarte.tipo_descarte,
            motivo: deteccionDescarte.motivo,
            usuario : deteccionDescarte.usuario, 
            estado : deteccionDescarte.estado,
            observacion : deteccionDescarte.observacion
        };

        return json_descarte;
    }

    private auditar(deteccionDescarte) : boolean
    {
        try
        {
            let deteccionDescarteAudit = this.generarDeteccionDescarteAudit(deteccionDescarte);
            this.auditoriaService.insert(this.opcion.opcion, this.accionAudit, deteccionDescarteAudit);

            return true;
        }
        catch(error)
        {
            return false;
        }
    }

    private generarDeteccionDescarteAudit(deteccionDescarte) : string
    {
        let deteccionDescarteAudit = {
            deteccion : deteccionDescarte.deteccion,
            tipo_descarte : deteccionDescarte.tipo_descarte,
            motivo: deteccionDescarte.motivo,
            usuario : deteccionDescarte.usuario, 
            estado : deteccionDescarte.estado,
            observacion : deteccionDescarte.observacion
        };

        return JSON.stringify(deteccionDescarteAudit);
    }

    private resetFormulario() : void
    {
        this.deteccionDescarteForm = {
            descarte : null,
            deteccion : null,
            tipo_descarte : null,
            fecha : null,
            motivo : null,
            usuario : null,
            estado : null,
            observacion : null,
            fecha_aprueba : null,
            usuario_aprueba : null
        };

        this.resetErrores();
    }

    private resetErrores() : void
    {
        this.errores = [];
    }

    private cerrarVentana() : void
    {
        jQuery('#descarte-prevalidacion').modal('hide');
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