import { Component, Input, OnInit } from '@angular/core';
import { Router, ROUTER_DIRECTIVES } from '@angular/router-deprecated';

import { IDeteccion } from "../../../../../interfaces/IDeteccion";
import { IDeteccionSeguimiento } from "../../../../../interfaces/IDeteccionSeguimiento";
import { IDeteccionDescarte } from "../../../../../interfaces/IDeteccionDescarte";
import { IInfraDeteccion } from "../../../../../interfaces/IInfraDeteccion";

import { IUsuario } from "../../../../../interfaces/IUsuario";
import { IOpcion } from "../../../../../interfaces/IOpcion";

import { ValidacionService } from "../../../../../services/ValidacionService";
import { ParametroService } from "../../../../../services/ParametroService";

import { NotificationsService } from 'angular2-notifications/components';
import { SimpleNotificationsComponent } from 'angular2-notifications/components';

declare var jQuery : any;
 
@Component({
    selector: 'validacion-descarte',
    templateUrl: './app/components/src/pruebas/validacion/descarte/validacion-descarte.html',
    bindings: [ValidacionService, ParametroService, NotificationsService],
    directives: [
        SimpleNotificationsComponent
    ]
})

export class ValidacionDescarteComponent implements OnInit
{
	isLoading: boolean = false;

    accionAudit: number = 2; // Adicionar

    gpMotivo: number = 24;

    userLogin: IUsuario;
    opcion: IOpcion;

    @Input('deteccion') deteccionForm: IDeteccion;
    @Input('deteccionSeguimiento') deteccionSeguimientoForm: IDeteccionSeguimiento;
    @Input('infraccionesNoValidadas') infraccionesNoValidadas: Array<IInfraDeteccion>;
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
                private validacionService: ValidacionService,
                private parametroService: ParametroService,
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
        this.deteccionForm.estado = 6; // Estado: Descartada en validación

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

        let validacionString = this.generarValidacionString(this.deteccionForm, this.deteccionSeguimientoForm, this.deteccionDescarteForm);

        this.validacionService.descartar(validacionString).then(
            (res) => {
                this.notificationService.success("Operación exitosa", "La detección ha sido descartada correctamente.");
                this.cerrarVentana();
                this.router.navigate(['PruebasValidacionView']);
                this.isLoading = false;
            },
            (error) => {
                this.notificationService.error("Error", JSON.parse(error._body).mensaje);
                this.isLoading = false;
            }
        );
    }

    private generarValidacionString(deteccion, deteccionSeguimiento, deteccionDescarte) : string
    {
        let json_validacion: Object = {};

        json_validacion = {
            deteccion : deteccion.deteccion,
            estado : deteccion.estado,
            seguimiento : this.generarDeteccionSeguimientoJSON(deteccionSeguimiento),
            descarte : this.generarDeteccionDescarteJSON(deteccion, deteccionDescarte),
            detallesDescarte : this.generarDetalleDescarteJSON(deteccion)
        };

        return '&validacion=' + JSON.stringify(json_validacion).replace(/"/g, '\\"');
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

    private generarDetalleDescarteJSON(deteccion) : Array<Object>
    {
        let json_detalles_descarte: Array<Object> = [];

        let infraccionesNoValidadas = this.infraccionesNoValidadas;

        for (let i in infraccionesNoValidadas)
        {
            json_detalles_descarte.push({
                infra_deteccion : infraccionesNoValidadas[i]['infra_deteccion'], 
                codigo : infraccionesNoValidadas[i]['codigo'],
                motivo : infraccionesNoValidadas[i]['motivo']
            });
        }

        return json_detalles_descarte;
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
        jQuery('#descarte-validacion').modal('hide');
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