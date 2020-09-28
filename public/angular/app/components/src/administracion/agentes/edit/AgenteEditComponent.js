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
var AgenteService_1 = require("../../../../../services/AgenteService");
var UsuarioService_1 = require("../../../../../services/UsuarioService");
var ParametroService_1 = require("../../../../../services/ParametroService");
var AuditoriaService_1 = require("../../../../../services/AuditoriaService");
var components_1 = require('angular2-notifications/components');
var components_2 = require('angular2-notifications/components');
var ng2_file_upload_1 = require('ng2-file-upload');
var urlFirma = "http://localhost:8000/fiscalizacion/administracion/agentes/cargarFirma";
var AgenteEditComponent = (function () {
    function AgenteEditComponent(agenteService, usuarioService, parametroService, auditoriaService, notificationService) {
        this.agenteService = agenteService;
        this.usuarioService = usuarioService;
        this.parametroService = parametroService;
        this.auditoriaService = auditoriaService;
        this.notificationService = notificationService;
        this.isLoading = false;
        this.accionAudit = 3; // Editar
        this.gpTipoDocumento = 1;
        this.gpEntidad = 10;
        this.gpEstado = 11;
        this.errores = [];
        this.departamentos = [];
        this.municipios = [];
        this.documentos = [];
        this.entidades = [];
        this.estados = [];
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
        this.uploader = new ng2_file_upload_1.FileUploader({ url: urlFirma });
    }
    AgenteEditComponent.prototype.ngOnInit = function () {
        if (this.userLogin == null)
            this.userLogin = JSON.parse(localStorage.getItem('user_login'));
        if (this.opcion == null)
            this.opcion = JSON.parse(localStorage.getItem('opcion'));
        this.agregarEventos();
        this.cargarCombos();
    };
    AgenteEditComponent.prototype.agregarEventos = function () {
        jQuery('#edit-agente').on('show.bs.modal', function () {
            jQuery('#btn-reset').click();
        });
    };
    AgenteEditComponent.prototype.cargarCombos = function () {
        var _this = this;
        this.parametroService.getByGrupo(this.gpTipoDocumento).then(function (documentos) { _this.documentos = documentos; });
        this.parametroService.getByGrupo(this.gpEntidad).then(function (entidades) { _this.entidades = entidades; });
        this.parametroService.getByGrupo(this.gpEstado).then(function (estados) { _this.estados = estados; });
    };
    AgenteEditComponent.prototype.mostrarFirma = function () {
        this.agenteService.mostrarFirma(this.agenteForm.persona);
    };
    AgenteEditComponent.prototype.cargarFirma = function () {
        this.errores = [];
        var imgFirma = jQuery('#img-firma-edit')[0];
        var inputFirma = jQuery('#input-firma-edit')[0];
        var file = inputFirma.files[0];
        var reader = new FileReader();
        reader.onload = function () {
            imgFirma.src = reader.result;
        };
        if (file) {
            inputFirma.value = null;
            imgFirma.style.display = 'block';
            reader.readAsDataURL(file);
            this.uploader.uploadAll();
        }
        else {
            imgFirma.style.display = 'none';
            this.errores.push("Debe seleccionar un archivo para cargar la firma.");
        }
    };
    AgenteEditComponent.prototype.actualizar = function () {
        var _this = this;
        this.isLoading = true;
        // Se valida que se haya cargado la firma.
        /*let imgFirma = jQuery('#img-firma-edit')[0];

        if (imgFirma.getAttribute('src') == "")
        {
            this.errores.push("Debe cargar una firma para el agente de tránsito.");
            return;
        }*/
        this.resetErrores();
        var agenteString = this.generarAgenteString(this.agenteForm);
        this.agenteService.update(agenteString, this.agenteForm.agente).then(function (res) {
            _this.auditar(res.agente);
            _this.isLoading = false;
            _this.notificationService.success("Operación exitosa", "El agente de tránsito fue modificado correctamente.");
            _this.cerrarVentana();
        }, function (error) {
            _this.isLoading = false;
            // Código de respuesta de Laravel cuando falla la validación
            if (error.status === 422) {
                var errores = error.json();
                for (var key in errores) {
                    _this.errores.push(errores[key]);
                }
            }
            else {
                _this.errores.push("Ha ocurrido un error al modificar el agente de tránsito.");
            }
        });
    };
    AgenteEditComponent.prototype.generarAgenteString = function (agente) {
        return '&agente=' + (agente.agente != null ? agente.agente : '') +
            '&entidad=' + (agente.entidad != null ? agente.entidad : '') +
            '&placa=' + (agente.placa != null ? agente.placa : '') +
            '&usuario_registra=' + this.userLogin.usuario;
    };
    AgenteEditComponent.prototype.auditar = function (agente) {
        try {
            var agenteAudit = this.generarAgenteAudit(agente);
            this.auditoriaService.insert(this.opcion.opcion, this.accionAudit, agenteAudit);
            return true;
        }
        catch (error) {
            return false;
        }
    };
    AgenteEditComponent.prototype.generarAgenteAudit = function (agente) {
        var agenteAudit = {
            agente: agente['agente'],
            entidad: agente['entidad'],
            placa: agente['placa']
        };
        return JSON.stringify(agenteAudit);
    };
    AgenteEditComponent.prototype.resetFormulario = function () {
        var _this = this;
        this.agenteService.getById(this.agenteForm.agente).then(function (agente) {
            _this.agenteForm = agente;
        });
        document.getElementById('input-firma-edit').setAttribute('value', null);
        document.getElementById('img-firma-edit').setAttribute('src', "");
        document.getElementById('img-firma-edit').style.display = 'none';
        this.agenteService.borrarFirma();
        this.resetErrores();
    };
    AgenteEditComponent.prototype.resetErrores = function () {
        this.errores = [];
    };
    AgenteEditComponent.prototype.cerrarVentana = function () {
        jQuery('#edit-agente').modal('hide');
    };
    AgenteEditComponent.prototype.close = function () {
        this.resetErrores();
        this.cerrarVentana();
    };
    AgenteEditComponent.prototype.loading = function () {
        return this.isLoading;
    };
    __decorate([
        core_1.Input('agente'), 
        __metadata('design:type', Object)
    ], AgenteEditComponent.prototype, "agenteForm", void 0);
    AgenteEditComponent = __decorate([
        core_1.Component({
            selector: 'agente-edit',
            templateUrl: './app/components/src/administracion/agentes/edit/agente-edit.html',
            bindings: [AgenteService_1.AgenteService, UsuarioService_1.UsuarioService, ParametroService_1.ParametroService, AuditoriaService_1.AuditoriaService, components_1.NotificationsService],
            directives: [
                components_2.SimpleNotificationsComponent,
                ng2_file_upload_1.FILE_UPLOAD_DIRECTIVES
            ]
        }), 
        __metadata('design:paramtypes', [AgenteService_1.AgenteService, UsuarioService_1.UsuarioService, ParametroService_1.ParametroService, AuditoriaService_1.AuditoriaService, components_1.NotificationsService])
    ], AgenteEditComponent);
    return AgenteEditComponent;
}());
exports.AgenteEditComponent = AgenteEditComponent;
//# sourceMappingURL=AgenteEditComponent.js.map