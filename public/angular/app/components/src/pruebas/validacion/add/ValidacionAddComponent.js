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
var DeteccionService_1 = require("../../../../../services/DeteccionService");
var DeteccionSeguimientoService_1 = require("../../../../../services/DeteccionSeguimientoService");
var EvidenciaService_1 = require("../../../../../services/EvidenciaService");
var InfraccionService_1 = require("../../../../../services/InfraccionService");
var InfraDeteccionService_1 = require("../../../../../services/InfraDeteccionService");
var PropietarioService_1 = require("../../../../../services/PropietarioService");
var DireccionService_1 = require("../../../../../services/DireccionService");
var FuenteService_1 = require("../../../../../services/FuenteService");
var ParametroService_1 = require("../../../../../services/ParametroService");
var ValidacionConfirmComponent_1 = require("../confirm/ValidacionConfirmComponent");
var ValidacionDescarteComponent_1 = require("../descarte/ValidacionDescarteComponent");
var InfraDeteccionAddComponent_1 = require("../../../pruebas/infra-detecciones/add/InfraDeteccionAddComponent");
var InfraDeteccionDeleteComponent_1 = require("../../../pruebas/infra-detecciones/delete/InfraDeteccionDeleteComponent");
var components_1 = require('angular2-notifications/components');
var components_2 = require('angular2-notifications/components');
var core_2 = require('angular2-google-maps/core');
var ng2_file_upload_1 = require('ng2-file-upload');
var primeng_1 = require('primeng/primeng');
var ValidacionAddComponent = (function () {
    function ValidacionAddComponent(router, routeParams, deteccionService, deteccionSeguimientoService, evidenciaService, infraccionService, infraDeteccionService, propietarioService, direccionService, fuenteService, parametroService, notificationService) {
        this.router = router;
        this.routeParams = routeParams;
        this.deteccionService = deteccionService;
        this.deteccionSeguimientoService = deteccionSeguimientoService;
        this.evidenciaService = evidenciaService;
        this.infraccionService = infraccionService;
        this.infraDeteccionService = infraDeteccionService;
        this.propietarioService = propietarioService;
        this.direccionService = direccionService;
        this.fuenteService = fuenteService;
        this.parametroService = parametroService;
        this.notificationService = notificationService;
        this.isLoading = false;
        this.gpEstado = 16;
        this.gpTipoVehiculo = 17;
        this.gpServicio = 18;
        this.gpNivel = 19;
        this.gpSentido = 20;
        this.gpUnidadVelocidad = 21;
        this.gpTipoEvidencia = 23;
        this.gpMotivo = 33;
        this.gpTipoDocumento = 1;
        this.gpFuenteProp = 14;
        this.gpTipoPropietario = 15;
        this.errores = [];
        this.estados = [];
        this.tiposVehiculo = [];
        this.servicios = [];
        this.niveles = [];
        this.sentidos = [];
        this.unidadesVelocidad = [];
        this.tiposEvidencia = [];
        this.motivos = [];
        this.fuentes = [];
        this.documentos = [];
        this.fuentes_prop = [];
        this.tipos_prop = [];
        this.departamentos = [];
        this.municipios = [];
        this.poblados = [];
        this.evidencias = [];
        this.infraDetecciones = [];
        this.propietarios = [];
        this.selectedEvidencia = {};
        this.selectedInfraDeteccion = {};
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
    ValidacionAddComponent.prototype.ngOnInit = function () {
        if (this.userLogin == null)
            this.userLogin = JSON.parse(localStorage.getItem('user_login'));
        if (this.opcion == null)
            this.opcion = JSON.parse(localStorage.getItem('opcion'));
        if (this.configVariables == null)
            this.configVariables = JSON.parse(localStorage.getItem('config_variables'));
        this.infraDeteccionValidacion = this.configVariables.filter(function (configVariable) { return configVariable.nombre == "INFRA_DETECCION_VALIDACION"; })[0];
        this.resetFormulario();
        this.agregarEventos();
        this.cargarCombos();
        this.getDeteccion();
    };
    ValidacionAddComponent.prototype.agregarEventos = function () {
        // Eventos para refrescar el listado de infracciones al agregar una infracción.
        jQuery('#add-infra-deteccion').on('hide.bs.modal', function () {
            jQuery('#btn-load-infra-detecciones').click();
        });
    };
    ValidacionAddComponent.prototype.cargarCombos = function () {
        var _this = this;
        // Detección
        this.parametroService.getByGrupo(this.gpEstado).then(function (estados) { _this.estados = estados; });
        this.parametroService.getByGrupo(this.gpTipoVehiculo).then(function (tiposVehiculo) { _this.tiposVehiculo = tiposVehiculo; });
        this.parametroService.getByGrupo(this.gpServicio).then(function (servicios) { _this.servicios = servicios; });
        this.parametroService.getByGrupo(this.gpNivel).then(function (niveles) { _this.niveles = niveles; });
        this.parametroService.getByGrupo(this.gpSentido).then(function (sentidos) { _this.sentidos = sentidos; });
        this.parametroService.getByGrupo(this.gpUnidadVelocidad).then(function (unidadesVelocidad) { _this.unidadesVelocidad = unidadesVelocidad; });
        this.parametroService.getByGrupo(this.gpTipoEvidencia).then(function (tiposEvidencia) { _this.tiposEvidencia = tiposEvidencia; });
        this.parametroService.getByGrupo(this.gpMotivo).then(function (motivos) { _this.motivos = motivos; });
        this.fuenteService.get().then(function (fuentes) { _this.fuentes = fuentes; });
        // Propietario
        this.parametroService.getByGrupo(this.gpTipoDocumento).then(function (documentos) { _this.documentos = documentos; });
        this.parametroService.getByGrupo(this.gpFuenteProp).then(function (fuentes_prop) { _this.fuentes_prop = fuentes_prop; });
        this.parametroService.getByGrupo(this.gpTipoPropietario).then(function (tipos_prop) { _this.tipos_prop = tipos_prop; });
    };
    ValidacionAddComponent.prototype.getDeteccion = function () {
        var _this = this;
        this.isLoading = true;
        this.deteccionService.getById(this.routeParams.get('deteccion')).then(function (deteccion) {
            if (deteccion == null) {
                _this.router.navigate(['Perfil']);
                _this.isLoading = false;
                return;
            }
            _this.deteccionForm.deteccion = deteccion.deteccion;
            _this.deteccionForm.fecha = deteccion.fecha.split(" ")[0];
            _this.deteccionForm.hora = deteccion.fecha.split(" ")[1];
            _this.deteccionForm.fuente = deteccion.fuente;
            _this.deteccionForm.referencia_disp = deteccion.referencia_disp;
            _this.deteccionForm.latitud = deteccion.latitud;
            _this.deteccionForm.longitud = deteccion.longitud;
            _this.deteccionForm.direccion = deteccion.direccion;
            _this.deteccionForm.complemento_direccion = deteccion.complemento_direccion;
            _this.deteccionForm.placa = deteccion.placa;
            _this.deteccionForm.tipo_vehiculo = deteccion.tipo_vehiculo;
            _this.deteccionForm.color = deteccion.color;
            _this.deteccionForm.servicio = deteccion.servicio;
            _this.deteccionForm.nivel = deteccion.nivel;
            _this.deteccionForm.carril = deteccion.carril;
            _this.deteccionForm.sentido = deteccion.sentido;
            _this.deteccionForm.velocidad = deteccion.velocidad;
            _this.deteccionForm.unidad_velocidad = deteccion.unidad_velocidad;
            _this.deteccionForm.observaciones = deteccion.observaciones;
            _this.getSeguimiento();
            _this.getPropietarios(deteccion.placa);
            _this.getInfraDetecciones();
            _this.getEvidencias();
            _this.isLoading = false;
        });
    };
    ValidacionAddComponent.prototype.getSeguimiento = function () {
        var _this = this;
        this.isLoading = true;
        this.deteccionSeguimientoService.getByFilters(this.routeParams.get('deteccion'), 2).then(function (deteccionSeguimiento) {
            if (deteccionSeguimiento != null) {
                _this.deteccionSeguimientoForm.observaciones = deteccionSeguimiento.observaciones;
            }
            _this.isLoading = false;
        });
    };
    ValidacionAddComponent.prototype.getPropietarios = function (placa) {
        var _this = this;
        this.isLoading = true;
        this.propietarioService.getByFilters(placa, 0, 0).then(function (propietarios) {
            _this.propietarios = propietarios.filter(function (propietario) {
                return propietario.hasta != null ? (_this.deteccionForm.fecha >= propietario.desde && _this.deteccionForm.fecha <= propietario.hasta) : (_this.deteccionForm.fecha >= propietario.desde);
            });
            _this.propietarioForm = _this.propietarios[0];
            _this.isLoading = false;
        });
    };
    ValidacionAddComponent.prototype.getInfraDetecciones = function () {
        var _this = this;
        this.isLoading = true;
        this.infraDeteccionService.getByDeteccion(this.routeParams.get('deteccion')).then(function (infraDetecciones) {
            _this.infraDetecciones = [];
            for (var i in infraDetecciones) {
                _this.infraDetecciones.push({
                    infra_deteccion: infraDetecciones[i]['infra_deteccion'],
                    infraccion: infraDetecciones[i]['infraccion'],
                    deteccion: infraDetecciones[i]['deteccion'],
                    codigo: infraDetecciones[i]['codigo'],
                    nombre_corto: infraDetecciones[i]['nombre_corto'],
                    observacion: infraDetecciones[i]['observacion'],
                    tiene_infraccion: true,
                    motivo: null
                });
            }
            _this.isLoading = false;
        });
    };
    ValidacionAddComponent.prototype.getEvidencias = function () {
        var _this = this;
        this.isLoading = true;
        this.evidenciaService.getByDeteccion(this.routeParams.get('deteccion')).then(function (evidencias) {
            _this.evidencias = evidencias;
            _this.visualizarEvidencia(_this.evidencias[0]);
            _this.isLoading = false;
        });
    };
    ValidacionAddComponent.prototype.visualizarEvidencia = function (evidencia) {
        var array_bytes = this.evidencias[this.evidencias.indexOf(evidencia)].array_bytes;
        switch (evidencia.tipo_archivo) {
            case '1':
                document.getElementById('div-evidencia').style.display = 'block';
                document.getElementById('img-evidencia').style.display = 'block';
                document.getElementById('video-evidencia').style.display = 'none';
                document.getElementById('img-evidencia').setAttribute('src', "data:image/" + evidencia.extension + "; base64, " + array_bytes);
                break;
            case '2':
                document.getElementById('div-evidencia').style.display = 'block';
                document.getElementById('img-evidencia').style.display = 'none';
                document.getElementById('video-evidencia').style.display = 'block';
                document.getElementById('video-evidencia').setAttribute('src', "data:video/" + evidencia.extension + "; base64, " + array_bytes);
                break;
            default:
                document.getElementById('div-evidencia').style.display = 'none';
                break;
        }
        this.selectedEvidencia = evidencia;
    };
    ValidacionAddComponent.prototype.cargarPropietario = function (event) {
        this.propietarioForm = this.propietarios[event.index];
    };
    ValidacionAddComponent.prototype.getInfraccionesValidadas = function () {
        // Se obtienen las infracciones validadas por el agente de tránsito.
        return this.infraDetecciones.filter(function (infraDeteccion) { return infraDeteccion.tiene_infraccion == true; });
    };
    ValidacionAddComponent.prototype.getInfraccionesNoValidadas = function () {
        // Se obtienen las infracciones no validadas por el agente de tránsito.
        return this.infraDetecciones.filter(function (infraDeteccion) { return infraDeteccion.tiene_infraccion == false; });
    };
    ValidacionAddComponent.prototype.procesarValidacion = function () {
        this.resetErrores();
        // Se obtiene la cantidad de infracciones validadas por el agente de tránsito.
        if (this.getInfraccionesValidadas().length > 0) {
            // Si existe al menos una infracción asociada, se procede a validar la detección.
            jQuery('#confirm-validacion').modal({ backdrop: 'static', keyboard: false });
        }
        else {
            // Si se rechazaron todas las infracciones asociadas, se procede a descartar la detección.
            jQuery('#descarte-validacion').modal({ backdrop: 'static', keyboard: false });
        }
    };
    ValidacionAddComponent.prototype.resetErrores = function () {
        this.errores = [];
    };
    ValidacionAddComponent.prototype.resetFormulario = function () {
        this.deteccionForm = {
            deteccion: null,
            fecha: "",
            hora: "",
            estado: null,
            estado_desc: "",
            fuente: null,
            referencia_disp: "",
            latitud: null,
            longitud: null,
            direccion: "",
            complemento_direccion: "",
            placa: "",
            tipo_vehiculo: null,
            tipo_vehiculo_desc: "",
            color: "",
            servicio: null,
            servicio_desc: "",
            nivel: null,
            nivel_desc: "",
            carril: "",
            sentido: null,
            sentido_desc: "",
            velocidad: null,
            unidad_velocidad: null,
            unidad_velocidad_desc: "",
            observaciones: "",
            modo_carga: null,
            modo_carga_desc: "",
            usuario: null,
            usuario_desc: "",
            fecha_registra: null,
            direccion_ip: null,
            evidencias: null,
            infracciones: null
        };
        this.deteccionSeguimientoForm = {
            seguimiento: null,
            deteccion: null,
            fecha: null,
            usuario: null,
            estado: null,
            observaciones: ""
        };
        this.propietarioForm = {
            propietario: null,
            placa: "",
            persona: null,
            tipo_doc: null,
            tipo_doc_desc: "",
            numero_doc: "",
            nombres: "",
            apellidos: "",
            nombres_apellidos: "",
            fuente: null,
            fuente_desc: "",
            tipo: null,
            tipo_desc: "",
            locatario: null,
            loc_tipo_doc: null,
            loc_tipo_doc_desc: "",
            loc_numero_doc: "",
            loc_nombres: "",
            loc_apellidos: "",
            loc_nombres_apellidos: "",
            desde: null,
            hasta: null,
            fecha_registra: null,
            dias_registro: null,
            usuario: null,
            usuario_desc: "",
            dir_direccion: null,
            dir_divipo: null,
            dir_cod_departamento: null,
            dir_departamento: "",
            dir_cod_municipio: null,
            dir_municipio: "",
            dir_cod_poblado: null,
            dir_poblado: "",
            dir_descripcion: ""
        };
        this.getInfraDetecciones();
        this.resetErrores();
    };
    ValidacionAddComponent.prototype.loading = function () {
        return this.isLoading;
    };
    ValidacionAddComponent = __decorate([
        core_1.Component({
            selector: 'validacion-add',
            templateUrl: './app/components/src/pruebas/validacion/add/validacion-add.html',
            bindings: [
                DeteccionService_1.DeteccionService, DeteccionSeguimientoService_1.DeteccionSeguimientoService, EvidenciaService_1.EvidenciaService, InfraccionService_1.InfraccionService, InfraDeteccionService_1.InfraDeteccionService, PropietarioService_1.PropietarioService, DireccionService_1.DireccionService,
                FuenteService_1.FuenteService, ParametroService_1.ParametroService, components_1.NotificationsService
            ],
            directives: [
                ValidacionConfirmComponent_1.ValidacionConfirmComponent,
                ValidacionDescarteComponent_1.ValidacionDescarteComponent,
                InfraDeteccionAddComponent_1.InfraDeteccionAddComponent,
                InfraDeteccionDeleteComponent_1.InfraDeteccionDeleteComponent,
                components_2.SimpleNotificationsComponent,
                core_2.GOOGLE_MAPS_DIRECTIVES,
                ng2_file_upload_1.FILE_UPLOAD_DIRECTIVES,
                router_deprecated_1.ROUTER_DIRECTIVES,
                primeng_1.TabView, primeng_1.TabPanel
            ]
        }), 
        __metadata('design:paramtypes', [router_deprecated_1.Router, router_deprecated_1.RouteParams, DeteccionService_1.DeteccionService, DeteccionSeguimientoService_1.DeteccionSeguimientoService, EvidenciaService_1.EvidenciaService, InfraccionService_1.InfraccionService, InfraDeteccionService_1.InfraDeteccionService, PropietarioService_1.PropietarioService, DireccionService_1.DireccionService, FuenteService_1.FuenteService, ParametroService_1.ParametroService, components_1.NotificationsService])
    ], ValidacionAddComponent);
    return ValidacionAddComponent;
}());
exports.ValidacionAddComponent = ValidacionAddComponent;
//# sourceMappingURL=ValidacionAddComponent.js.map