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
var PersonaService_1 = require("../../../../../services/PersonaService");
var ParametroService_1 = require("../../../../../services/ParametroService");
var AuditoriaService_1 = require("../../../../../services/AuditoriaService");
var components_1 = require('angular2-notifications/components');
var components_2 = require('angular2-notifications/components');
var ng2_file_upload_1 = require('ng2-file-upload');
var urlFirma = "http://localhost:8000/fiscalizacion/administracion/agentes/cargarFirma";
var AgenteAddComponent = (function () {
    function AgenteAddComponent(agenteService, usuarioService, personaService, parametroService, auditoriaService, notificationService) {
        this.agenteService = agenteService;
        this.usuarioService = usuarioService;
        this.personaService = personaService;
        this.parametroService = parametroService;
        this.auditoriaService = auditoriaService;
        this.notificationService = notificationService;
        this.isLoading = false;
        this.accionAudit = 2; // Adicionar
        this.gpTipoDocumento = 1;
        this.gpEntidad = 10;
        this.gpEstado = 11;
        this.isUpdateUsuario = false;
        this.errores = [];
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
    AgenteAddComponent.prototype.ngOnInit = function () {
        if (this.userLogin == null)
            this.userLogin = JSON.parse(localStorage.getItem('user_login'));
        if (this.opcion == null)
            this.opcion = JSON.parse(localStorage.getItem('opcion'));
        this.resetFormulario();
        this.agregarEventos();
        this.cargarCombos();
    };
    AgenteAddComponent.prototype.agregarEventos = function () {
        jQuery('#add-persona').on('hide.bs.modal', function () {
            jQuery('#btn-load-persona').click();
        });
    };
    AgenteAddComponent.prototype.cargarCombos = function () {
        var _this = this;
        this.parametroService.getByGrupo(this.gpTipoDocumento).then(function (documentos) { _this.documentos = documentos; });
        this.parametroService.getByGrupo(this.gpEntidad).then(function (entidades) { _this.entidades = entidades; });
        this.parametroService.getByGrupo(this.gpEstado).then(function (estados) { _this.estados = estados; });
    };
    AgenteAddComponent.prototype.cargarFirma = function () {
        this.errores = [];
        var imgFirma = jQuery('#img-firma-add')[0];
        var inputFirma = jQuery('#input-firma-add')[0];
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
    AgenteAddComponent.prototype.cargarPersona = function () {
        var _this = this;
        this.personaService.getByDocumento(this.agenteForm.tipo_doc, this.agenteForm.numero_doc)
            .then(function (persona) {
            if (persona != null) {
                _this.agenteForm.persona = persona.persona;
                _this.agenteForm.nombres_apellidos = persona.nombres_apellidos;
                _this.agenteForm.login = _this.agenteForm.numero_doc.toString();
                _this.getUsuarioByPersona(persona.persona);
            }
        });
    };
    AgenteAddComponent.prototype.getPersonaByDocumento = function () {
        var _this = this;
        this.errores = [];
        if (this.agenteForm.tipo_doc == null)
            return;
        if (this.agenteForm.numero_doc == "")
            return;
        if (isNaN(Number(this.agenteForm.numero_doc))) {
            this.errores.push("El número de documento debe ser numérico.");
            return;
        }
        this.personaService.getByDocumento(this.agenteForm.tipo_doc, this.agenteForm.numero_doc)
            .then(function (persona) {
            _this.personaForm.tipo_doc = _this.agenteForm.tipo_doc;
            _this.personaForm.numero_doc = _this.agenteForm.numero_doc;
            if (persona != null) {
                _this.agenteForm.persona = persona.persona;
                _this.agenteForm.nombres_apellidos = persona.nombres_apellidos;
                _this.agenteForm.login = _this.agenteForm.numero_doc.toString();
                _this.getUsuarioByPersona(persona.persona);
            }
            else {
                _this.agenteForm.persona = null;
                _this.agenteForm.nombres_apellidos = "";
                _this.agenteForm.login = "";
                _this.agenteForm.entidad = null;
                _this.agenteForm.placa = "";
                _this.agenteForm.email = "";
                localStorage.setItem('input-persona', JSON.stringify(_this.personaForm));
                jQuery('#add-persona').modal({ backdrop: 'static' });
            }
        });
    };
    AgenteAddComponent.prototype.getUsuarioByPersona = function (persona) {
        var _this = this;
        this.usuarioService.getByPersona(persona)
            .then(function (usuario) {
            if (usuario != null) {
                _this.agenteForm.email = usuario.email;
                _this.isUpdateUsuario = true;
            }
            else {
                _this.agenteForm.email = "";
                _this.isUpdateUsuario = false;
            }
        });
    };
    AgenteAddComponent.prototype.insertar = function () {
        var _this = this;
        this.resetErrores();
        // Se valida que se haya cargado la firma.
        var imgFirma = jQuery('#img-firma-add')[0];
        if (imgFirma.getAttribute('src') == "") {
            this.errores.push("Debe cargar una firma para el agente de tránsito.");
            return;
        }
        this.isLoading = true;
        var agenteString = this.generarAgenteString(this.agenteForm);
        this.agenteService.insert(agenteString).then(function (res) {
            console.log(res);
            if (!_this.isUpdateUsuario) {
                if (!_this.procesarUsuario()) {
                    _this.errores.push("Ha ocurrido un error al crear el usuario del agente de tránsito.");
                    _this.isLoading = false;
                    return;
                }
            }
            _this.auditar(res.agente);
            _this.isLoading = false;
            _this.notificationService.success("Operación exitosa", "El agente de tránsito fue creado correctamente.");
            _this.resetFormulario();
            _this.cerrarVentana();
            _this.isLoading = false;
        }, function (error) {
            // Código de respuesta de Laravel cuando falla la validación
            if (error.status === 422) {
                var errores = error.json();
                for (var key in errores) {
                    _this.errores.push(errores[key]);
                }
            }
            else {
                _this.errores.push("Ha ocurrido un error al crear el agente de tránsito.");
            }
            _this.isLoading = false;
        });
    };
    AgenteAddComponent.prototype.procesarUsuario = function () {
        try {
            this.usuarioForm.persona = this.agenteForm.persona;
            this.usuarioForm.login = this.agenteForm.login;
            this.usuarioForm.cargo = 1;
            this.usuarioForm.email = this.agenteForm.email;
            var roles = [];
            roles.push({ rol: 25, tiene_rol: true });
            var usuarioString = this.generarUsuarioString(this.usuarioForm, roles);
            // Insertar usuario
            this.usuarioService.insert(usuarioString);
            return true;
        }
        catch (error) {
            return false;
        }
    };
    AgenteAddComponent.prototype.generarAgenteString = function (agente) {
        return '&persona=' + (agente.persona != null ? agente.persona : '') +
            '&entidad=' + (agente.entidad != null ? agente.entidad : '') +
            '&placa=' + (agente.placa != null ? agente.placa : '') +
            '&usuario_registra=' + this.userLogin.usuario;
    };
    AgenteAddComponent.prototype.generarUsuarioString = function (usuario, roles) {
        return '&persona=' + usuario.persona +
            '&login=' + (usuario.login != null ? usuario.login : '') +
            '&cargo=' + (usuario.cargo != null ? usuario.cargo : '') +
            '&email=' + (usuario.email != null ? usuario.email : '') +
            '&roles=' + JSON.stringify(roles).replace(/"/g, '\\"') +
            '&usuario_registra=' + this.userLogin.usuario;
    };
    AgenteAddComponent.prototype.auditar = function (agente) {
        try {
            var agenteAudit = this.generarAgenteAudit(agente);
            this.auditoriaService.insert(this.opcion.opcion, this.accionAudit, agenteAudit);
            return true;
        }
        catch (error) {
            return false;
        }
    };
    AgenteAddComponent.prototype.generarAgenteAudit = function (agente) {
        var agenteAudit = {
            agente: agente['agente'],
            persona: agente['persona'],
            entidad: agente['entidad'],
            placa: agente['placa'],
            fecha_registra: agente['fecha_registra'],
            usuario_registra: agente['usuario_registra']
        };
        return JSON.stringify(agenteAudit);
    };
    AgenteAddComponent.prototype.resetErrores = function () {
        this.errores = [];
    };
    AgenteAddComponent.prototype.resetFormulario = function () {
        this.agenteForm = JSON.parse('{' +
            ' "persona" : null,' +
            ' "tipo_doc" : null,' +
            ' "numero_doc" : "",' +
            ' "nombres_apellidos" : "",' +
            ' "entidad" : null,' +
            ' "placa" : "",' +
            ' "email" : "",' +
            ' "firma" : null' +
            '}');
        this.usuarioForm = JSON.parse('{' +
            ' "persona" : null,' +
            ' "tipo_doc" : null,' +
            ' "numero_doc" : "",' +
            ' "nombres_apellidos" : "",' +
            ' "login" : "",' +
            ' "cargo" : null,' +
            ' "email" : ""' +
            '}');
        this.personaForm = JSON.parse('{' +
            ' "tipo_doc" : null,' +
            ' "numero_doc" : ""' +
            '}');
        document.getElementById('input-firma-add').setAttribute('value', null);
        document.getElementById('img-firma-add').setAttribute('src', "");
        document.getElementById('img-firma-add').style.display = 'none';
        this.agenteService.borrarFirma();
        this.resetErrores();
    };
    AgenteAddComponent.prototype.cerrarVentana = function () {
        jQuery('#add-agente').modal('hide');
    };
    AgenteAddComponent.prototype.close = function () {
        this.resetErrores();
        this.resetFormulario();
        this.cerrarVentana();
    };
    AgenteAddComponent.prototype.loading = function () {
        return this.isLoading;
    };
    AgenteAddComponent = __decorate([
        core_1.Component({
            selector: 'agente-add',
            templateUrl: './app/components/src/administracion/agentes/add/agente-add.html',
            bindings: [AgenteService_1.AgenteService, UsuarioService_1.UsuarioService, PersonaService_1.PersonaService, ParametroService_1.ParametroService, AuditoriaService_1.AuditoriaService, components_1.NotificationsService],
            directives: [
                components_2.SimpleNotificationsComponent,
                ng2_file_upload_1.FILE_UPLOAD_DIRECTIVES
            ]
        }), 
        __metadata('design:paramtypes', [AgenteService_1.AgenteService, UsuarioService_1.UsuarioService, PersonaService_1.PersonaService, ParametroService_1.ParametroService, AuditoriaService_1.AuditoriaService, components_1.NotificationsService])
    ], AgenteAddComponent);
    return AgenteAddComponent;
}());
exports.AgenteAddComponent = AgenteAddComponent;
//# sourceMappingURL=AgenteAddComponent.js.map