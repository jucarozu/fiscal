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
var ComparendoService_1 = require("../../../../../services/ComparendoService");
var PersonaService_1 = require("../../../../../services/PersonaService");
var DivipoService_1 = require("../../../../../services/DivipoService");
var ParametroService_1 = require("../../../../../services/ParametroService");
var GeneralService_1 = require("../../../../../services/GeneralService");
var AuditoriaService_1 = require("../../../../../services/AuditoriaService");
var components_1 = require('angular2-notifications/components');
var components_2 = require('angular2-notifications/components');
var primeng_1 = require('primeng/primeng');
var SustitucionConductorComponent = (function () {
    function SustitucionConductorComponent(router, comparendoService, personaService, divipoService, parametroService, generalService, auditoriaService, notificationService) {
        this.router = router;
        this.comparendoService = comparendoService;
        this.personaService = personaService;
        this.divipoService = divipoService;
        this.parametroService = parametroService;
        this.generalService = generalService;
        this.auditoriaService = auditoriaService;
        this.notificationService = notificationService;
        this.isLoading = false;
        this.accionAudit = 5; // Procesar
        this.gpTipoDocumento = 1;
        this.gpOrganismo = 28;
        this.gpCategoria = 44;
        this.errores = [];
        this.documentos = [];
        this.organismos = [];
        this.categorias = [];
        this.departamentos = [];
        this.municipios = [];
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
    SustitucionConductorComponent.prototype.ngOnInit = function () {
        if (this.userLogin == null)
            this.userLogin = JSON.parse(localStorage.getItem('user_login'));
        if (this.opcion == null)
            this.opcion = JSON.parse(localStorage.getItem('opcion'));
        this.resetFormulario();
        this.agregarEventos();
        this.cargarCombos();
    };
    SustitucionConductorComponent.prototype.agregarEventos = function () {
        /*jQuery('#detalle-envios').on('show.bs.modal', function() {
            jQuery('#btn-get-detalles').click();
        });*/
        jQuery('#add-persona').on('hide.bs.modal', function () {
            jQuery('#btn-load-persona').click();
        });
    };
    SustitucionConductorComponent.prototype.cargarCombos = function () {
        var _this = this;
        this.divipoService.getDepartamentos().then(function (departamentos) { _this.departamentos = departamentos; });
        this.parametroService.getByGrupo(this.gpTipoDocumento).then(function (documentos) { _this.documentos = documentos; });
        this.parametroService.getByGrupo(this.gpOrganismo).then(function (organismos) { _this.organismos = organismos; });
        this.parametroService.getByGrupo(this.gpCategoria).then(function (categorias) { _this.categorias = categorias; });
    };
    SustitucionConductorComponent.prototype.cargarPersona = function () {
        var _this = this;
        this.personaService.getByDocumento(this.sustitucionConductorForm.infr_tipo_doc, this.sustitucionConductorForm.infr_numero_doc)
            .then(function (persona) {
            if (persona != null) {
                _this.sustitucionConductorForm.infractor = persona.persona;
                _this.sustitucionConductorForm.infr_nombres = persona.nombres;
                _this.sustitucionConductorForm.infr_apellidos = persona.apellidos;
            }
        });
    };
    SustitucionConductorComponent.prototype.getPersonaByDocumento = function () {
        var _this = this;
        this.errores = [];
        if (this.sustitucionConductorForm.infr_tipo_doc == null)
            return;
        if (this.sustitucionConductorForm.infr_numero_doc == "")
            return;
        if (isNaN(Number(this.sustitucionConductorForm.infr_numero_doc))) {
            this.errores.push("El número de documento debe ser numérico.");
            return;
        }
        this.personaService.getByDocumento(this.sustitucionConductorForm.infr_tipo_doc, this.sustitucionConductorForm.infr_numero_doc)
            .then(function (persona) {
            _this.personaForm.tipo_doc = _this.sustitucionConductorForm.infr_tipo_doc;
            _this.personaForm.numero_doc = _this.sustitucionConductorForm.infr_numero_doc;
            if (persona != null) {
                _this.sustitucionConductorForm.infractor = persona.persona;
                _this.sustitucionConductorForm.infr_nombres = persona.nombres;
                _this.sustitucionConductorForm.infr_apellidos = persona.apellidos;
            }
            else {
                _this.sustitucionConductorForm.infractor = null;
                _this.sustitucionConductorForm.infr_nombres = "";
                _this.sustitucionConductorForm.infr_apellidos = "";
                localStorage.setItem('input-persona', JSON.stringify(_this.personaForm));
                jQuery('#add-persona').modal({ backdrop: 'static' });
            }
        });
    };
    SustitucionConductorComponent.prototype.cargarMunicipios = function (cod_departamento) {
        var _this = this;
        this.municipios = null;
        this.sustitucionConductorForm.contacto_municipio = null;
        if (cod_departamento != null) {
            this.divipoService.getMunicipios(cod_departamento)
                .then(function (municipios) {
                _this.municipios = municipios;
            });
        }
    };
    SustitucionConductorComponent.prototype.procesar = function () {
        var _this = this;
        this.isLoading = true;
        var sustitucionConductorString = this.generarSustitucionConductorString(this.comparendoForm, this.sustitucionConductorForm);
        this.comparendoService.sustituirConductor(sustitucionConductorString).then(function (res) {
            _this.auditar(_this.comparendoForm, _this.sustitucionConductorForm);
            _this.isLoading = false;
            _this.notificationService.success("Operación exitosa", "La sustitución de conductor ha sido realizada con éxito.");
            _this.close();
        }, function (error) {
            _this.notificationService.error("Error", JSON.parse(error._body).mensaje);
            _this.isLoading = false;
        });
    };
    SustitucionConductorComponent.prototype.generarSustitucionConductorString = function (comparendo, sustitucionConductor) {
        return '&comparendo=' + (comparendo.comparendo != null ? comparendo.comparendo : '') +
            '&deteccion=' + (comparendo.deteccion != null ? comparendo.deteccion : '') +
            '&numero_resolucion=' + (sustitucionConductor.numero_resolucion != null ? sustitucionConductor.numero_resolucion : '') +
            '&fecha_resolucion=' + (sustitucionConductor.fecha_resolucion != null ? sustitucionConductor.fecha_resolucion : '') +
            '&infractor=' + (sustitucionConductor.infractor != null ? sustitucionConductor.infractor : '') +
            '&dir_divipo_infractor=' + (sustitucionConductor.contacto_municipio != null ? (sustitucionConductor.contacto_municipio + '000') : '') +
            '&dir_descripcion_infractor=' + (sustitucionConductor.contacto_direccion != null ? sustitucionConductor.contacto_direccion : '') +
            '&telefono_infractor=' + (sustitucionConductor.contacto_telefono != null ? sustitucionConductor.contacto_telefono : '') +
            '&email_infractor=' + (sustitucionConductor.contacto_email != null ? sustitucionConductor.contacto_email : '') +
            '&edad_infractor=' + (sustitucionConductor.infr_edad != null ? sustitucionConductor.infr_edad : '') +
            '&lcond_numero=' + (sustitucionConductor.lic_numero != null ? sustitucionConductor.lic_numero : '') +
            '&lcond_categoria=' + (sustitucionConductor.lic_categoria != null ? sustitucionConductor.lic_categoria : '') +
            '&lcond_expedicion=' + (sustitucionConductor.lic_expedicion != null ? sustitucionConductor.lic_expedicion : '') +
            '&lcond_vencimiento=' + (sustitucionConductor.lic_vencimiento != null ? sustitucionConductor.lic_vencimiento : '') +
            '&lcond_organismo=' + (sustitucionConductor.lic_organismo != null ? sustitucionConductor.lic_organismo : '') +
            '&agente=' + (comparendo.agente != null ? comparendo.agente : '') +
            '&infraccion=' + (comparendo.infraccion != null ? comparendo.infraccion : '') +
            '&fecha_deteccion=' + (comparendo.fecha_deteccion + ' ' + comparendo.hora_deteccion) +
            '&fecha_imposicion=' + (comparendo.fecha_imposicion + ' ' + comparendo.hora_imposicion) +
            '&divipo=' + (comparendo.divipo != null ? comparendo.divipo : '') +
            '&direccion=' + (comparendo.direccion != null ? comparendo.direccion : '') +
            '&longitud=' + (comparendo.longitud != null ? comparendo.longitud : '') +
            '&latitud=' + (comparendo.latitud != null ? comparendo.latitud : '') +
            '&placa_vehiculo=' + (comparendo.placa_vehiculo != null ? comparendo.placa_vehiculo : '') +
            '&clase_vehiculo=' + (comparendo.clase_vehiculo != null ? comparendo.clase_vehiculo : '') +
            '&servicio_vehiculo=' + (comparendo.servicio_vehiculo != null ? comparendo.servicio_vehiculo : '') +
            '&organismo_vehiculo=' + (comparendo.organismo_vehiculo != null ? comparendo.organismo_vehiculo : '') +
            '&licencia_vehiculo=' + (comparendo.licencia_vehiculo != null ? comparendo.licencia_vehiculo : '') +
            '&propietario_vehiculo=' + (comparendo.propietario_vehiculo != null ? comparendo.propietario_vehiculo : '') +
            '&polca=' + (comparendo.polca != null ? comparendo.polca : '') +
            '&estado=' + 5 +
            '&etapa_proceso=' + 5 +
            '&inmovilizado=' + (comparendo.inmovilizado != null ? comparendo.inmovilizado : '') +
            '&observaciones=' + (sustitucionConductor.observaciones != null ? sustitucionConductor.observaciones : '') +
            '&nit_empresa_tte=' + (comparendo.nit_empresa_tte != null ? comparendo.nit_empresa_tte : '') +
            '&nombre_empresa=' + (comparendo.nombre_empresa != null ? comparendo.nombre_empresa : '') +
            '&tarjeta_operacion=' + (comparendo.tarjeta_operacion != null ? comparendo.tarjeta_operacion : '') +
            '&modalidad=' + (comparendo.modalidad != null ? comparendo.modalidad : '') +
            '&radio_accion=' + (comparendo.radio_accion != null ? comparendo.radio_accion : '') +
            '&tipo_pasajero=' + (comparendo.tipo_pasajero != null ? comparendo.tipo_pasajero : '') +
            '&usuario=' + this.userLogin.usuario +
            '&infractor_presente=' + (sustitucionConductor.infractor_presente ? 1 : 0);
    };
    SustitucionConductorComponent.prototype.auditar = function (comparendo, sustitucionConductor) {
        try {
            var sustitucionAudit = this.generarSustitucionAudit(comparendo, sustitucionConductor);
            this.auditoriaService.insert(this.opcion.opcion, this.accionAudit, sustitucionAudit);
            return true;
        }
        catch (error) {
            return false;
        }
    };
    SustitucionConductorComponent.prototype.generarSustitucionAudit = function (comparendo, sustitucionConductor) {
        var sustitucionAudit = {
            comparendo: comparendo.comparendo,
            deteccion: comparendo.deteccion,
            numero_resolucion: sustitucionConductor.numero_resolucion,
            fecha_resolucion: sustitucionConductor.fecha_resolucion,
            infractor: sustitucionConductor.infractor,
            dir_divipo_infractor: sustitucionConductor.contacto_municipio,
            dir_descripcion_infractor: sustitucionConductor.contacto_direccion,
            telefono_infractor: sustitucionConductor.contacto_telefono,
            email_infractor: sustitucionConductor.contacto_email,
            edad_infractor: sustitucionConductor.infr_edad,
            lcond_numero: sustitucionConductor.lic_numero,
            lcond_categoria: sustitucionConductor.lic_categoria,
            lcond_expedicion: sustitucionConductor.lic_expedicion,
            lcond_vencimiento: sustitucionConductor.lic_vencimiento,
            lcond_organismo: sustitucionConductor.lic_organismo,
            agente: comparendo.agente,
            infraccion: comparendo.infraccion,
            fecha_deteccion: comparendo.fecha_deteccion,
            fecha_imposicion: comparendo.fecha_imposicion,
            divipo: comparendo.divipo,
            direccion: comparendo.direccion,
            longitud: comparendo.longitud,
            latitud: comparendo.latitud,
            placa_vehiculo: comparendo.placa_vehiculo,
            clase_vehiculo: comparendo.clase_vehiculo,
            servicio_vehiculo: comparendo.servicio_vehiculo,
            organismo_vehiculo: comparendo.organismo_vehiculo,
            licencia_vehiculo: comparendo.licencia_vehiculo,
            propietario_vehiculo: comparendo.propietario_vehiculo,
            polca: comparendo.polca,
            estado: 5,
            etapa_proceso: 5,
            inmovilizado: comparendo.inmovilizado,
            observaciones: sustitucionConductor.observaciones,
            nit_empresa_tte: comparendo.nit_empresa_tte,
            nombre_empresa: comparendo.nombre_empresa,
            tarjeta_operacion: comparendo.tarjeta_operacion,
            modalidad: comparendo.modalidad,
            radio_accion: comparendo.radio_accion,
            tipo_pasajero: comparendo.tipo_pasajero,
            usuario: this.userLogin.usuario,
            infractor_presente: (sustitucionConductor.infractor_presente ? 1 : 0)
        };
        return JSON.stringify(sustitucionAudit);
    };
    SustitucionConductorComponent.prototype.resetFormulario = function () {
        this.personaForm = JSON.parse('{' +
            ' "tipo_doc" : null,' +
            ' "numero_doc" : "",' +
            ' "fecha_exped_doc" : "",' +
            ' "divipo_doc" : null,' +
            ' "cod_departamento_doc" : null,' +
            ' "cod_municipio_doc" : null,' +
            ' "nombres" : "",' +
            ' "apellidos" : "",' +
            ' "email" : "",' +
            ' "genero" : null,' +
            ' "grupo_sanguineo" : null,' +
            ' "numero_celular" : ""' +
            '}');
        this.sustitucionConductorForm = {
            comparendo: null,
            numero_resolucion: "",
            fecha_resolucion: this.generalService.getFechaActualYMD(),
            infractor: null,
            infr_tipo_doc: null,
            infr_numero_doc: "",
            infr_nombres: "",
            infr_apellidos: "",
            infr_edad: null,
            lic_numero: "",
            lic_categoria: "",
            lic_organismo: null,
            lic_expedicion: "",
            lic_vencimiento: "",
            contacto_direccion: "",
            contacto_departamento: null,
            contacto_municipio: null,
            contacto_telefono: "",
            contacto_celular: "",
            contacto_email: "",
            observaciones: "",
            infractor_presente: false
        };
        this.municipios = null;
        this.resetErrores();
    };
    SustitucionConductorComponent.prototype.resetErrores = function () {
        this.errores = [];
    };
    SustitucionConductorComponent.prototype.cerrarVentana = function () {
        jQuery('#conductor-sustitucion').modal('hide');
    };
    SustitucionConductorComponent.prototype.close = function () {
        this.resetFormulario();
        this.cerrarVentana();
    };
    SustitucionConductorComponent.prototype.loading = function () {
        return this.isLoading;
    };
    __decorate([
        core_1.Input('comparendo'), 
        __metadata('design:type', Object)
    ], SustitucionConductorComponent.prototype, "comparendoForm", void 0);
    SustitucionConductorComponent = __decorate([
        core_1.Component({
            selector: 'sustitucion-conductor',
            templateUrl: './app/components/src/comparendos/sustitucion-conductor/view/sustitucion-conductor-view.html',
            bindings: [ComparendoService_1.ComparendoService, PersonaService_1.PersonaService, DivipoService_1.DivipoService, ParametroService_1.ParametroService, GeneralService_1.GeneralService, AuditoriaService_1.AuditoriaService, components_1.NotificationsService],
            directives: [
                primeng_1.DataTable, primeng_1.Column,
                components_2.SimpleNotificationsComponent
            ]
        }), 
        __metadata('design:paramtypes', [router_deprecated_1.Router, ComparendoService_1.ComparendoService, PersonaService_1.PersonaService, DivipoService_1.DivipoService, ParametroService_1.ParametroService, GeneralService_1.GeneralService, AuditoriaService_1.AuditoriaService, components_1.NotificationsService])
    ], SustitucionConductorComponent);
    return SustitucionConductorComponent;
}());
exports.SustitucionConductorComponent = SustitucionConductorComponent;
//# sourceMappingURL=SustitucionConductorComponent.js.map