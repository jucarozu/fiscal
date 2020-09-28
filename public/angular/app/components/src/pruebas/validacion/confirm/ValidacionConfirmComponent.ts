import { Component, Input, OnInit } from '@angular/core';
import { Router, ROUTER_DIRECTIVES } from '@angular/router-deprecated';

import { IDeteccion } from "../../../../../interfaces/IDeteccion";
import { IDeteccionSeguimiento } from "../../../../../interfaces/IDeteccionSeguimiento";
import { IPropietario } from "../../../../../interfaces/IPropietario";
import { IInfraDeteccion } from "../../../../../interfaces/IInfraDeteccion";
import { IAgente } from "../../../../../interfaces/IAgente";

import { IUsuario } from "../../../../../interfaces/IUsuario";
import { IOpcion } from "../../../../../interfaces/IOpcion";

import { ValidacionService } from "../../../../../services/ValidacionService";
import { AgenteService } from "../../../../../services/AgenteService";
import { GeneralService } from "../../../../../services/GeneralService";
import { AuditoriaService } from "../../../../../services/AuditoriaService";

import { NotificationsService } from 'angular2-notifications/components';
import { SimpleNotificationsComponent } from 'angular2-notifications/components';
 
declare var jQuery : any;
 
@Component({
    selector: 'validacion-confirm',
    templateUrl: './app/components/src/pruebas/validacion/confirm/validacion-confirm.html',
    bindings: [ValidacionService, AgenteService, GeneralService, AuditoriaService, NotificationsService],
    directives: [
        SimpleNotificationsComponent
    ]
})
 
export class ValidacionConfirmComponent implements OnInit
{
    isLoading: boolean = false;

    accionAudit: number = 2; // Adicionar

    userLogin: IUsuario;
    opcion: IOpcion;

    @Input('deteccion') deteccionForm: IDeteccion;
    @Input('deteccionSeguimiento') deteccionSeguimientoForm: IDeteccionSeguimiento;
    @Input('propietario') propietarioForm: IPropietario;
    @Input('infraccionesValidadas') infraccionesValidadas: Array<IInfraDeteccion>;
    @Input('infraccionesNoValidadas') infraccionesNoValidadas: Array<IInfraDeteccion>;

    errores: Array<Object> = [];

    agtCodigo = null;

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
                private agenteService: AgenteService,
                private generalService: GeneralService,
                private auditoriaService: AuditoriaService,
                private notificationService: NotificationsService) {}

    ngOnInit()
    {
        if (this.userLogin == null)
            this.userLogin = JSON.parse(localStorage.getItem('user_login'));

        if (this.opcion == null)
            this.opcion = JSON.parse(localStorage.getItem('opcion'));

        this.getAgtCodigo();
    }

    private getAgtCodigo() : void
    {
        this.agtCodigo = null;

        this.agenteService.getByUsuario(this.userLogin.usuario)
            .then(agente =>
                {
                    if (agente != null)
                    {
                        this.agtCodigo = agente.agente;
                    }
                }
            );
    }

    private validar() : void
    {
        this.isLoading = true;

        // Datos de detección.
        this.deteccionForm.estado = 5; // Estado: Validada

        // Datos de seguimiento de detección.
        this.deteccionSeguimientoForm.usuario = this.userLogin.usuario;
        this.deteccionSeguimientoForm.estado = 5; // Estado: Validada

        let validacionString = this.generarValidacionString(this.deteccionForm, this.deteccionSeguimientoForm, this.propietarioForm);

        this.validacionService.validar(validacionString).then(
            (res) => {
                this.auditar(this.deteccionForm);
                this.isLoading = false;

                this.notificationService.success("Operación exitosa", "La detección ha sido validada correctamente.");
                this.cerrarVentana();
                this.router.navigate(['PruebasValidacionView']);
            },
            (error) => {
                this.notificationService.error("Error", JSON.parse(error._body).mensaje);
                this.isLoading = false;
            }
        );
    }

    private generarValidacionString(deteccion, deteccionSeguimiento, propietario) : string
    {
        let json_validacion: Object = {};

        json_validacion = {
            deteccion : deteccion.deteccion,
            estado : deteccion.estado,
            seguimiento : this.generarDeteccionSeguimientoJSON(deteccionSeguimiento),
            comparendo : this.generarComparendoJSON(deteccion, propietario),
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

    private generarComparendoJSON(deteccion, propietario) : Object
    {
        let json_comparendo: Object = {};
        let json_infracciones: Array<Object> = [];

        let infraccionesValidadas = this.infraccionesValidadas;

        for (let i in infraccionesValidadas)
        {
            json_infracciones.push({
                infraccion : infraccionesValidadas[i]['infraccion'], 
                codigo : infraccionesValidadas[i]['codigo']
            });
        }

        json_comparendo = {
            infractor : propietario.persona,
            dir_direccion_infractor : propietario.dir_direccion,
            dir_divipo_infractor : propietario.dir_divipo,
            dir_descripcion_infractor : propietario.dir_descripcion,
            telefono_infractor : propietario.numero_celular,
            email_infractor : propietario.email,
            edad_infractor : null,
            lcond_numero : null,
            lcond_categoria : null,
            lcond_expedicion : null,
            lcond_vencimiento : null,
            lcond_organismo : null,
            agente : this.agtCodigo,
            infracciones : json_infracciones,
            fecha_deteccion : deteccion.fecha + ' ' + deteccion.hora,
            fecha_imposicion : this.generalService.getFechaActualYMDHM(),
            divipo : null,
            direccion : deteccion.direccion,
            longitud : deteccion.longitud,
            latitud : deteccion.latitud,
            placa_vehiculo : deteccion.placa,
            clase_vehiculo : deteccion.tipo_vehiculo,
            servicio_vehiculo : deteccion.servicio,
            organismo_vehiculo : null,
            licencia_vehiculo : null,
            propietario_vehiculo : propietario.persona,
            polca : 0,
            estado : 1,
            etapa_proceso : 1,
            inmovilizado : 0,
            observaciones : deteccion.observaciones,
            nit_empresa_tte : null, 
            nombre_empresa : null,
            tarjeta_operacion : null,
            modalidad : null,
            radio_accion : null,
            tipo_pasajero : null,
            usuario : this.userLogin.usuario
        };

        return json_comparendo;
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
        jQuery('#confirm-validacion').modal('hide');
    }

    private loading() : boolean
    {
        return this.isLoading;
    }
}