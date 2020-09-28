"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var router_deprecated_1 = require('@angular/router-deprecated');
var ValidacionService_1 = require("../../../../../services/ValidacionService");
var AgenteService_1 = require("../../../../../services/AgenteService");
var GeneralService_1 = require("../../../../../services/GeneralService");
var AuditoriaService_1 = require("../../../../../services/AuditoriaService");
var components_1 = require('angular2-notifications/components');
var components_2 = require('angular2-notifications/components');
var ValidacionConfirmComponent = (function () {
    function ValidacionConfirmComponent(router, validacionService, agenteService, generalService, auditoriaService, notificationService) {
        this.router = router;
        this.validacionService = validacionService;
        this.agenteService = agenteService;
        this.generalService = generalService;
        this.auditoriaService = auditoriaService;
        this.notificationService = notificationService;
        this.isLoading = false;
        this.accionAudit = 2; // Adicionar
        this.errores = [];
        this.agtCodigo = null;
        this.notificationsOptions = {
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
    }
    ValidacionConfirmComponent.prototype.ngOnInit = function () {
        if (this.userLogin == null)
            this.userLogin = JSON.parse(localStorage.getItem('user_login'));
        if (this.opcion == null)
            this.opcion = JSON.parse(localStorage.getItem('opcion'));
        this.getAgtCodigo();
    };
    ValidacionConfirmComponent.prototype.getAgtCodigo = function () {
        var _this = this;
        this.agtCodigo = null;
        this.agenteService.getByUsuario(this.userLogin.usuario)
            .then(function (agente) {
            if (agente != null) {
                _this.agtCodigo = agente.agente;
            }
        });
    };
    ValidacionConfirmComponent.prototype.validar = function () {
        var _this = this;
        this.isLoading = true;
        // Datos de detección.
        this.deteccionForm.estado = 5; // Estado: Validada
        // Datos de seguimiento de detección.
        this.deteccionSeguimientoForm.usuario = this.userLogin.usuario;
        this.deteccionSeguimientoForm.estado = 5; // Estado: Validada
        var validacionString = this.generarValidacionString(this.deteccionForm, this.deteccionSeguimientoForm, this.propietarioForm);
        this.validacionService.validar(validacionString).then(function (res) {
            _this.auditar(_this.deteccionForm);
            _this.isLoading = false;
            _this.notificationService.success("Operación exitosa", "La detección ha sido validada correctamente.");
            _this.cerrarVentana();
            _this.router.navigate(['PruebasValidacionView']);
        }, function (error) {
            _this.notificationService.error("Error", JSON.parse(error._body).mensaje);
            _this.isLoading = false;
        });
    };
    ValidacionConfirmComponent.prototype.generarValidacionString = function (deteccion, deteccionSeguimiento, propietario) {
        var json_validacion = {};
        json_validacion = {
            deteccion: deteccion.deteccion,
            estado: deteccion.estado,
            seguimiento: this.generarDeteccionSeguimientoJSON(deteccionSeguimiento),
            comparendo: this.generarComparendoJSON(deteccion, propietario),
            detallesDescarte: this.generarDetalleDescarteJSON(deteccion)
        };
        return '&validacion=' + JSON.stringify(json_validacion).replace(/"/g, '\\"');
    };
    ValidacionConfirmComponent.prototype.generarDeteccionSeguimientoJSON = function (deteccionSeguimiento) {
        var json_seguimiento = {};
        json_seguimiento = {
            usuario: deteccionSeguimiento.usuario,
            estado: deteccionSeguimiento.estado,
            observaciones: deteccionSeguimiento.observaciones
        };
        return json_seguimiento;
    };
    ValidacionConfirmComponent.prototype.generarComparendoJSON = function (deteccion, propietario) {
        var json_comparendo = {};
        var json_infracciones = [];
        var infraccionesValidadas = this.infraccionesValidadas;
        for (var i in infraccionesValidadas) {
            json_infracciones.push({
                infraccion: infraccionesValidadas[i]['infraccion'],
                codigo: infraccionesValidadas[i]['codigo']
            });
        }
        json_comparendo = {
            infractor: propietario.persona,
            dir_direccion_infractor: propietario.dir_direccion,
            dir_divipo_infractor: propietario.dir_divipo,
            dir_descripcion_infractor: propietario.dir_descripcion,
            telefono_infractor: propietario.numero_celular,
            email_infractor: propietario.email,
            edad_infractor: null,
            lcond_numero: null,
            lcond_categoria: null,
            lcond_expedicion: null,
            lcond_vencimiento: null,
            lcond_organismo: null,
            agente: this.agtCodigo,
            infracciones: json_infracciones,
            fecha_deteccion: deteccion.fecha + ' ' + deteccion.hora,
            fecha_imposicion: this.generalService.getFechaActualYMDHM(),
            divipo: null,
            direccion: deteccion.direccion,
            longitud: deteccion.longitud,
            latitud: deteccion.latitud,
            placa_vehiculo: deteccion.placa,
            clase_vehiculo: deteccion.tipo_vehiculo,
            servicio_vehiculo: deteccion.servicio,
            organismo_vehiculo: null,
            licencia_vehiculo: null,
            propietario_vehiculo: propietario.persona,
            polca: 0,
            estado: 1,
            etapa_proceso: 1,
            inmovilizado: 0,
            observaciones: deteccion.observaciones,
            nit_empresa_tte: null,
            nombre_empresa: null,
            tarjeta_operacion: null,
            modalidad: null,
            radio_accion: null,
            tipo_pasajero: null,
            usuario: this.userLogin.usuario
        };
        return json_comparendo;
    };
    ValidacionConfirmComponent.prototype.generarDetalleDescarteJSON = function (deteccion) {
        var json_detalles_descarte = [];
        var infraccionesNoValidadas = this.infraccionesNoValidadas;
        for (var i in infraccionesNoValidadas) {
            json_detalles_descarte.push({
                infra_deteccion: infraccionesNoValidadas[i]['infra_deteccion'],
                codigo: infraccionesNoValidadas[i]['codigo'],
                motivo: infraccionesNoValidadas[i]['motivo']
            });
        }
        return json_detalles_descarte;
    };
    ValidacionConfirmComponent.prototype.auditar = function (deteccion) {
        try {
            var deteccionAudit = this.generarDeteccionAudit(deteccion);
            this.auditoriaService.insert(this.opcion.opcion, this.accionAudit, deteccionAudit);
            return true;
        }
        catch (error) {
            return false;
        }
    };
    ValidacionConfirmComponent.prototype.generarDeteccionAudit = function (deteccion) {
        var deteccionAudit = {
            deteccion: deteccion.deteccion,
            fecha: deteccion.fecha,
            hora: deteccion.hora,
            fuente: deteccion.fuente,
            referencia_disp: deteccion.referencia_disp,
            latitud: deteccion.latitud,
            longitud: deteccion.longitud,
            direccion: deteccion.direccion,
            complemento_direccion: deteccion.complemento_direccion,
            placa: deteccion.placa,
            tipo_vehiculo: deteccion.tipo_vehiculo,
            color: deteccion.color,
            servicio: deteccion.servicio,
            nivel: deteccion.nivel,
            carril: deteccion.carril,
            sentido: deteccion.sentido,
            velocidad: deteccion.velocidad,
            unidad_velocidad: deteccion.unidad_velocidad,
            observaciones: deteccion.observaciones,
            estado: deteccion.estado
        };
        return JSON.stringify(deteccionAudit);
    };
    ValidacionConfirmComponent.prototype.cerrarVentana = function () {
        jQuery('#confirm-validacion').modal('hide');
    };
    ValidacionConfirmComponent.prototype.loading = function () {
        return this.isLoading;
    };
    __decorate([
        core_1.Input('deteccion'), 
        __metadata('design:type', Object)
    ], ValidacionConfirmComponent.prototype, "deteccionForm", void 0);
    __decorate([
        core_1.Input('deteccionSeguimiento'), 
        __metadata('design:type', Object)
    ], ValidacionConfirmComponent.prototype, "deteccionSeguimientoForm", void 0);
    __decorate([
        core_1.Input('propietario'), 
        __metadata('design:type', Object)
    ], ValidacionConfirmComponent.prototype, "propietarioForm", void 0);
    __decorate([
        core_1.Input('infraccionesValidadas'), 
        __metadata('design:type', Array)
    ], ValidacionConfirmComponent.prototype, "infraccionesValidadas", void 0);
    __decorate([
        core_1.Input('infraccionesNoValidadas'), 
        __metadata('design:type', Array)
    ], ValidacionConfirmComponent.prototype, "infraccionesNoValidadas", void 0);
    ValidacionConfirmComponent = __decorate([
        core_1.Component({
            selector: 'validacion-confirm',
            templateUrl: './app/components/src/pruebas/validacion/confirm/validacion-confirm.html',
            bindings: [ValidacionService_1.ValidacionService, AgenteService_1.AgenteService, GeneralService_1.GeneralService, AuditoriaService_1.AuditoriaService, components_1.NotificationsService],
            directives: [
                components_2.SimpleNotificationsComponent
            ]
        }), 
        __metadata('design:paramtypes', [router_deprecated_1.Router, ValidacionService_1.ValidacionService, AgenteService_1.AgenteService, GeneralService_1.GeneralService, AuditoriaService_1.AuditoriaService, components_1.NotificationsService])
    ], ValidacionConfirmComponent);
    return ValidacionConfirmComponent;
}());
exports.ValidacionConfirmComponent = ValidacionConfirmComponent;
//# sourceMappingURL=ValidacionConfirmComponent.js.map