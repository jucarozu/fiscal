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
var NotifColaService_1 = require("../../../../../services/NotifColaService");
var NotificacionService_1 = require("../../../../../services/NotificacionService");
var NotifSeguimientoService_1 = require("../../../../../services/NotifSeguimientoService");
var DireccionService_1 = require("../../../../../services/DireccionService");
var AuditoriaService_1 = require("../../../../../services/AuditoriaService");
var components_1 = require('angular2-notifications/components');
var components_2 = require('angular2-notifications/components');
var EnviosColaComponent = (function () {
    function EnviosColaComponent(router, notifColaService, notificacionService, notifSeguimientoService, direccionService, auditoriaService, notificationService) {
        this.router = router;
        this.notifColaService = notifColaService;
        this.notificacionService = notificacionService;
        this.notifSeguimientoService = notifSeguimientoService;
        this.direccionService = direccionService;
        this.auditoriaService = auditoriaService;
        this.notificationService = notificationService;
        this.isLoading = false;
        this.accionAudit = 5; // Ejecutar
        this.direcciones = [];
        this.errores = [];
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
    EnviosColaComponent.prototype.ngOnInit = function () {
        if (this.userLogin == null)
            this.userLogin = JSON.parse(localStorage.getItem('user_login'));
        if (this.opcion == null)
            this.opcion = JSON.parse(localStorage.getItem('opcion'));
        this.agregarEventos();
        this.resetFormulario();
    };
    EnviosColaComponent.prototype.agregarEventos = function () {
        jQuery('#cola-envios').on('show.bs.modal', function () {
            jQuery('#btn-get-direcciones').click();
        });
        jQuery('#add-direccion').on('hide.bs.modal', function () {
            jQuery('#btn-get-direcciones').click();
        });
    };
    EnviosColaComponent.prototype.getNotifDirecciones = function () {
        var _this = this;
        this.isLoading = true;
        this.direccionService.getAllByPersona(this.notificacionForm.notif_persona).then(function (direcciones) {
            var direccion_selected = null;
            if (jQuery('#nueva-direccion').val() != "") {
                direccion_selected = jQuery('#nueva-direccion').val();
                jQuery('#nueva-direccion').val("");
            }
            _this.direcciones = [];
            for (var i in direcciones) {
                _this.direcciones.push({
                    direccion: direcciones[i]['direccion'],
                    persona: direcciones[i]['persona'],
                    tipo_doc: direcciones[i]['tipo_doc'],
                    tipo_doc_desc: direcciones[i]['tipo_doc_desc'],
                    numero_doc: direcciones[i]['numero_doc'],
                    nombres: direcciones[i]['nombres'],
                    apellidos: direcciones[i]['apellidos'],
                    nombres_apellidos: direcciones[i]['nombres_apellidos'],
                    fuente: direcciones[i]['fuente'],
                    fuente_desc: direcciones[i]['fuente_desc'],
                    observaciones: direcciones[i]['observaciones'],
                    divipo: direcciones[i]['divipo'],
                    cod_departamento: direcciones[i]['cod_departamento'],
                    departamento: direcciones[i]['departamento'],
                    cod_municipio: direcciones[i]['cod_municipio'],
                    municipio: direcciones[i]['municipio'],
                    cod_poblado: direcciones[i]['cod_poblado'],
                    poblado: direcciones[i]['poblado'],
                    descripcion: direcciones[i]['descripcion'],
                    fecha_registra: direcciones[i]['fecha_registra'],
                    usuario: direcciones[i]['usuario'],
                    usuario_desc: direcciones[i]['usuario_desc'],
                    is_selected: direccion_selected == direcciones[i]['direccion'] ? true : false,
                });
            }
            _this.isLoading = false;
        });
    };
    EnviosColaComponent.prototype.setDireccion = function (direccion) {
        this.notificacionForm.notif_direccion = direccion.direccion;
        this.notificacionForm.notif_dir_divipo = direccion.divipo;
        this.notificacionForm.notif_dir_descripcion = direccion.descripcion;
        for (var i in this.direcciones) {
            this.direcciones[i].is_selected = this.direcciones[i].direccion == this.notificacionForm.notif_direccion;
        }
    };
    EnviosColaComponent.prototype.insertar = function () {
        var _this = this;
        this.resetErrores();
        var is_selected = false;
        for (var i in this.direcciones) {
            if (this.direcciones[i].is_selected) {
                is_selected = true;
            }
        }
        if (!is_selected) {
            this.errores.push("Debe seleccionar una dirección para el envío.");
            return;
        }
        this.isLoading = true;
        // Datos de notificación en cola.
        this.notifColaForm.medio = this.notificacionForm.notif_medio;
        this.notifColaForm.tipo = this.notificacionForm.notif_tipo;
        this.notifColaForm.persona = this.notificacionForm.notif_persona;
        this.notifColaForm.referencia = this.notificacionForm.notif_referencia;
        this.notifColaForm.estado = 8; // Estado: En cola
        this.notifColaForm.usuario = this.userLogin.usuario;
        this.notifColaForm.observaciones = "Notificación ID " + this.notificacionForm.notificacion + ": Puesta en cola.";
        this.notifColaComparendoForm.comparendo = this.notificacionForm.comparendo;
        this.notifColaDireccionForm.direccion = this.notificacionForm.notif_direccion != null ? this.notificacionForm.notif_direccion : null;
        this.notifColaDireccionForm.divipo = this.notificacionForm.notif_dir_divipo != null ? this.notificacionForm.notif_dir_divipo : null;
        this.notifColaDireccionForm.descripcion = this.notificacionForm.notif_dir_descripcion != null ? this.notificacionForm.notif_dir_descripcion : null;
        var notifColaString = this.generarNotifColaString(this.notifColaForm, this.notifColaComparendoForm, this.notifColaDireccionForm);
        this.notifColaService.insert(notifColaString).then(function (res) {
            // Datos de notificación.
            _this.notificacionForm.estado = 8; // Estado: En cola
            var notificacionString = _this.generarNotificacionString(_this.notificacionForm);
            _this.notificacionService.update(notificacionString, _this.notificacionForm.notificacion).then(function (res) {
                // Datos de seguimiento de notificación.
                _this.notifSeguimientoForm.notificacion = _this.notificacionForm.notificacion;
                _this.notifSeguimientoForm.estado = 8; // Estado: En cola
                _this.notifSeguimientoForm.usuario = _this.userLogin.usuario;
                _this.notifSeguimientoForm.observaciones = _this.notifColaForm.observaciones;
                var notifSeguimientoString = _this.generarNotifSeguimientoString(_this.notifSeguimientoForm);
                _this.notifSeguimientoService.insert(notifSeguimientoString).then(function (res) {
                    _this.auditar(_this.notifColaForm, _this.notifColaComparendoForm, _this.notifColaDireccionForm);
                    _this.isLoading = false;
                    _this.notificationService.success("Operación exitosa", "La notificación ha sido puesta En cola.");
                    _this.close();
                }, function (error) {
                    _this.notificationService.error("Error", JSON.parse(error._body).mensaje);
                    _this.isLoading = false;
                });
            }, function (error) {
                _this.notificationService.error("Error", JSON.parse(error._body).mensaje);
                _this.isLoading = false;
            });
        }, function (error) {
            _this.notificationService.error("Error", JSON.parse(error._body).mensaje);
            _this.isLoading = false;
        });
    };
    EnviosColaComponent.prototype.generarNotifColaString = function (notifCola, notifColaComparendo, notifColaDireccion) {
        var json_notif_cola = {};
        json_notif_cola = {
            medio: (notifCola.medio != null ? notifCola.medio : ''),
            tipo: (notifCola.tipo != null ? notifCola.tipo : ''),
            persona: (notifCola.persona != null ? notifCola.persona : ''),
            referencia: (notifCola.referencia != null ? notifCola.referencia : ''),
            estado: (notifCola.estado != null ? notifCola.estado : ''),
            usuario: this.userLogin.usuario,
            observaciones: (notifCola.observaciones != null ? notifCola.observaciones : ''),
            cola: 1,
            comparendo: (notifColaComparendo.comparendo != null ? notifColaComparendo.comparendo : ''),
            direccion: (notifColaDireccion.direccion != null ? notifColaDireccion.direccion : ''),
            divipo: (notifColaDireccion.divipo != null ? notifColaDireccion.divipo : ''),
            descripcion: (notifColaDireccion.descripcion != null ? notifColaDireccion.descripcion : '')
        };
        return '&notif_cola=' + JSON.stringify(json_notif_cola).replace(/"/g, '\\"');
    };
    EnviosColaComponent.prototype.generarNotificacionString = function (notificacion) {
        return '&notificacion=' + (notificacion.notificacion != null ? notificacion.notificacion : '') +
            '&estado=' + (notificacion.estado != null ? notificacion.estado : '') +
            '&usuario=' + this.userLogin.usuario;
    };
    EnviosColaComponent.prototype.generarNotifSeguimientoString = function (notifSeguimiento) {
        return '&notificacion=' + (notifSeguimiento.notificacion != null ? notifSeguimiento.notificacion : '') +
            '&estado=' + (notifSeguimiento.estado != null ? notifSeguimiento.estado : '') +
            '&usuario=' + this.userLogin.usuario +
            '&observaciones=' + (notifSeguimiento.observaciones != null ? notifSeguimiento.observaciones : '');
    };
    EnviosColaComponent.prototype.auditar = function (notifCola, notifColaComparendo, notifColaDireccion) {
        try {
            var notifColaAudit = this.generarNotifColaAudit(notifCola, notifColaComparendo, notifColaDireccion);
            this.auditoriaService.insert(this.opcion.opcion, this.accionAudit, notifColaAudit);
            return true;
        }
        catch (error) {
            return false;
        }
    };
    EnviosColaComponent.prototype.generarNotifColaAudit = function (notifCola, notifColaComparendo, notifColaDireccion) {
        var notifSeguimientoAudit = {
            medio: notifCola.medio,
            tipo: notifCola.tipo,
            persona: notifCola.persona,
            referencia: notifCola.referencia,
            estado: notifCola.estado,
            usuario: this.userLogin.usuario,
            observaciones: notifCola.observaciones,
            cola: 1,
            comparendo: notifColaComparendo.comparendo,
            direccion: notifColaDireccion.direccion,
            divipo: notifColaDireccion.divipo,
            descripcion: notifColaDireccion.descripcion
        };
        return JSON.stringify(notifSeguimientoAudit);
    };
    EnviosColaComponent.prototype.resetFormulario = function () {
        this.notifColaForm = {
            notificacion_cola: null,
            medio: null,
            tipo: null,
            fecha: "",
            persona: null,
            referencia: "",
            estado: null,
            fecha_desde: "",
            fecha_hasta: "",
            motivo_rechazo: null,
            usuario: null,
            observaciones: "",
            cola: null,
            notimasiva: null
        };
        this.notifColaComparendoForm = {
            notif_cola_comparendo: null,
            notif_cola: null,
            comparendo: null
        };
        this.notifColaDireccionForm = {
            notif_cola_direccion: null,
            notif_cola: null,
            direccion: null,
            divipo: null,
            descripcion: ""
        };
        this.notifSeguimientoForm = {
            seguimiento: null,
            notificacion: null,
            fecha: "",
            estado: null,
            estado_desc: "",
            usuario: null,
            usuario_desc: "",
            observaciones: "",
        };
        this.resetErrores();
    };
    EnviosColaComponent.prototype.resetErrores = function () {
        this.errores = [];
    };
    EnviosColaComponent.prototype.cerrarVentana = function () {
        jQuery('#cola-envios').modal('hide');
    };
    EnviosColaComponent.prototype.close = function () {
        this.resetFormulario();
        this.cerrarVentana();
    };
    EnviosColaComponent.prototype.loading = function () {
        return this.isLoading;
    };
    __decorate([
        core_1.Input('notificacion'), 
        __metadata('design:type', Object)
    ], EnviosColaComponent.prototype, "notificacionForm", void 0);
    EnviosColaComponent = __decorate([
        core_1.Component({
            selector: 'envios-cola',
            templateUrl: './app/components/src/comparendos/envios/cola/envios-cola.html',
            bindings: [NotifColaService_1.NotifColaService, NotificacionService_1.NotificacionService, NotifSeguimientoService_1.NotifSeguimientoService, DireccionService_1.DireccionService, AuditoriaService_1.AuditoriaService, components_1.NotificationsService],
            directives: [
                components_2.SimpleNotificationsComponent
            ]
        }), 
        __metadata('design:paramtypes', [router_deprecated_1.Router, NotifColaService_1.NotifColaService, NotificacionService_1.NotificacionService, NotifSeguimientoService_1.NotifSeguimientoService, DireccionService_1.DireccionService, AuditoriaService_1.AuditoriaService, components_1.NotificationsService])
    ], EnviosColaComponent);
    return EnviosColaComponent;
}());
exports.EnviosColaComponent = EnviosColaComponent;
//# sourceMappingURL=EnviosColaComponent.js.map