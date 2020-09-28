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
var DeteccionService_1 = require("../../../../../services/DeteccionService");
var DeteccionSeguimientoService_1 = require("../../../../../services/DeteccionSeguimientoService");
var EvidenciaService_1 = require("../../../../../services/EvidenciaService");
var components_1 = require('angular2-notifications/components');
var components_2 = require('angular2-notifications/components');
var PrevalidacionPlacaComponent = (function () {
    function PrevalidacionPlacaComponent(deteccionService, deteccionSeguimientoService, evidenciaService, notificationService) {
        this.deteccionService = deteccionService;
        this.deteccionSeguimientoService = deteccionSeguimientoService;
        this.evidenciaService = evidenciaService;
        this.notificationService = notificationService;
        this.isLoading = false;
        this.placa_confirm = "";
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
    PrevalidacionPlacaComponent.prototype.ngOnInit = function () {
        if (this.userLogin == null)
            this.userLogin = JSON.parse(localStorage.getItem('user_login'));
        this.resetFormulario();
        this.agregarEventos();
    };
    PrevalidacionPlacaComponent.prototype.agregarEventos = function () {
        jQuery('#placa-prevalidacion').on('show.bs.modal', function () {
            jQuery('#btn-load-evidencia-placa').click();
        });
        jQuery('#placa-confirm').on('hide.bs.modal', function () {
            jQuery('#btn-insertar').click();
        });
    };
    PrevalidacionPlacaComponent.prototype.cargarEvidencia = function () {
        switch (this.evidenciaForm.tipo_archivo) {
            case '1':
                // Asignar la fuente de datos de la imagen al visor de la evidencia para el recorte.
                jQuery('#img-evidencia-placa, #img-miniatura-placa').prop('src', 'data:image/' + this.evidenciaForm.extension + '; base64, ' + this.evidenciaForm.array_bytes);
                // Establecer parámetros del área del recorte.
                jQuery('#img-evidencia-placa').imgAreaSelect({
                    handles: true,
                    onSelectChange: function (img, selection) {
                        var scaleX = 300 / (selection.width || 1);
                        var scaleY = 200 / (selection.height || 1);
                        jQuery('#img-miniatura-placa').css({
                            width: Math.round(scaleX * 600) + 'px',
                            height: Math.round(scaleY * 400) + 'px',
                            marginLeft: '-' + Math.round(scaleX * selection.x1) + 'px',
                            marginTop: '-' + Math.round(scaleY * selection.y1) + 'px'
                        });
                        jQuery('#x1').val(selection.x1);
                        jQuery('#y1').val(selection.y1);
                        jQuery('#width').val(selection.width);
                        jQuery('#height').val(selection.height);
                    }
                });
                break;
            case '2':
                // Asignar la fuente de datos del video al visor de la evidencia para el recorte.
                jQuery('#video-evidencia-placa, #video-miniatura-placa').prop('src', 'data:video/' + this.evidenciaForm.extension + '; base64, ' + this.evidenciaForm.array_bytes);
                // Establecer parámetros del área del recorte.
                jQuery('#video-evidencia-placa').imgAreaSelect({
                    handles: true,
                    onSelectChange: function (img, selection) {
                        var scaleX = 300 / (selection.width || 1);
                        var scaleY = 200 / (selection.height || 1);
                        jQuery('#video-miniatura-placa').css({
                            width: Math.round(scaleX * 600) + 'px',
                            height: Math.round(scaleY * 400) + 'px',
                            marginLeft: '-' + Math.round(scaleX * selection.x1) + 'px',
                            marginTop: '-' + Math.round(scaleY * selection.y1) + 'px'
                        });
                        jQuery('#x1').val(selection.x1);
                        jQuery('#y1').val(selection.y1);
                        jQuery('#width').val(selection.width);
                        jQuery('#height').val(selection.height);
                    }
                });
                // Sincronizar video con la miniatura.
                jQuery('#video-evidencia-placa').on('pause', function () {
                    jQuery('#video-miniatura-placa')[0].currentTime = this.currentTime;
                    jQuery('#time').val(this.currentTime);
                });
                break;
            default:
                break;
        }
    };
    PrevalidacionPlacaComponent.prototype.convertPlacaToUpper = function () {
        this.placa_confirm = this.placa_confirm.toUpperCase();
    };
    PrevalidacionPlacaComponent.prototype.compararPlacas = function () {
        if (this.placa != this.placa_confirm) {
            jQuery('#placa-confirm').modal({ backdrop: 'static', keyboard: false });
            return;
        }
        jQuery('#is-confirm-placa').val('true');
        this.insertar();
    };
    PrevalidacionPlacaComponent.prototype.confirmarValidacionPlaca = function () {
        jQuery('#is-confirm-placa').val('true');
        this.cerrarVentanaConfirm();
    };
    PrevalidacionPlacaComponent.prototype.cerrarVentanaConfirm = function () {
        jQuery('#placa-confirm').modal('hide');
    };
    PrevalidacionPlacaComponent.prototype.verificarConfirmacionPlaca = function () {
        var isConfirmPlaca = jQuery('#is-confirm-placa').val();
        // Se verifica que se haya validado la placa.
        if (isConfirmPlaca == 'false') {
            return false;
        }
        return true;
    };
    PrevalidacionPlacaComponent.prototype.verificarRecortePlaca = function () {
        // Se verifica que se haya recortado la placa.
        if (this.cropForm.x1 == 0 && this.cropForm.y1 == 0 && this.cropForm.width == 0 && this.cropForm.height == 0) {
            return false;
        }
        return true;
    };
    PrevalidacionPlacaComponent.prototype.insertar = function () {
        var _this = this;
        if (!this.verificarConfirmacionPlaca()) {
            return;
        }
        this.cropForm.is_video = jQuery('#is_video').val();
        this.cropForm.time = jQuery('#time').val();
        this.cropForm.x1 = jQuery('#x1').val();
        this.cropForm.y1 = jQuery('#y1').val();
        this.cropForm.width = jQuery('#width').val();
        this.cropForm.height = jQuery('#height').val();
        if (!this.verificarRecortePlaca()) {
            this.errores.push("Debe indicar la sección de la evidencia que se tomará para la validación de la placa.");
            return;
        }
        this.resetErrores();
        this.isLoading = true;
        this.deteccionForm.deteccion = this.evidenciaForm.deteccion;
        this.deteccionForm.placa = this.placa_confirm;
        var deteccionString = this.generarDeteccionString(this.deteccionForm);
        this.deteccionService.update(deteccionString, this.deteccionForm.deteccion).then(function (res) {
            var recorteString = _this.generarEvidenciaCropString(_this.evidenciaForm, _this.cropForm);
            _this.evidenciaService.recortarEvidencia(recorteString).then(function (res) {
                _this.deteccionSeguimientoForm.deteccion = _this.deteccionForm.deteccion;
                _this.deteccionSeguimientoForm.usuario = _this.userLogin.usuario;
                _this.deteccionSeguimientoForm.observaciones = "Placa original: " + _this.placa + " - Placa validada: " + _this.placa_confirm;
                // Estado 4: Placa validada
                _this.deteccionSeguimientoForm.estado = 4;
                var deteccionSeguimientoString = _this.generarDeteccionSeguimientoString(_this.deteccionSeguimientoForm);
                _this.deteccionSeguimientoService.insert(deteccionSeguimientoString).then(function (res) {
                    _this.notificationService.success("Operación exitosa", "La placa fue validada correctamente.");
                    jQuery('#is-valid-placa').val('true');
                    _this.cerrarVentana();
                    _this.isLoading = false;
                }, function (error) {
                    _this.errores.push("Ha ocurrido un error al registrar el seguimiento de la detección.");
                    _this.isLoading = false;
                });
            }, function (error) {
                _this.errores.push("Ha ocurrido un error al registrar la evidencia de la validación de la placa.");
                _this.isLoading = false;
            });
        }, function (error) {
            _this.errores.push("Ha ocurrido un error al validar la placa asociada a la detección.");
            _this.isLoading = false;
        });
    };
    PrevalidacionPlacaComponent.prototype.generarDeteccionString = function (deteccion) {
        return '&placa=' + (deteccion.placa != null ? deteccion.placa : '');
    };
    PrevalidacionPlacaComponent.prototype.generarEvidenciaCropString = function (evidencia, crop) {
        return '&deteccion=' + (evidencia.deteccion != null ? evidencia.deteccion : '') +
            '&evidencia=' + (evidencia.evidencia != null ? evidencia.evidencia : '') +
            '&ruta=' + (evidencia.ruta != null ? evidencia.ruta : '') +
            '&nombre_archivo=' + (evidencia.nombre_archivo != null ? evidencia.nombre_archivo : '') +
            '&is_video=' + (crop.is_video != null ? crop.is_video : '') +
            '&time=' + (crop.time != null ? crop.time : '') +
            '&x1=' + (crop.x1 != null ? crop.x1 : '') +
            '&y1=' + (crop.y1 != null ? crop.y1 : '') +
            '&width=' + (crop.width != null ? crop.width : '') +
            '&height=' + (crop.height != null ? crop.height : '');
    };
    PrevalidacionPlacaComponent.prototype.generarDeteccionSeguimientoString = function (deteccionSeguimiento) {
        return '&deteccion=' + (deteccionSeguimiento.deteccion != null ? deteccionSeguimiento.deteccion : '') +
            '&usuario=' + (deteccionSeguimiento.usuario != null ? deteccionSeguimiento.usuario : '') +
            '&estado=' + (deteccionSeguimiento.estado != null ? deteccionSeguimiento.estado : '') +
            '&observaciones=' + (deteccionSeguimiento.observaciones != null ? deteccionSeguimiento.observaciones : '');
    };
    PrevalidacionPlacaComponent.prototype.resetFormulario = function () {
        this.deteccionForm = JSON.parse('{' +
            ' "fecha" : "",' +
            ' "hora" : "",' +
            ' "fuente" : null,' +
            ' "referencia_disp" : "",' +
            ' "latitud" : null,' +
            ' "longitud" : null,' +
            ' "direccion" : "",' +
            ' "complemento_direccion" : "",' +
            ' "placa" : "",' +
            ' "tipo_vehiculo" : null,' +
            ' "color" : "",' +
            ' "servicio" : null,' +
            ' "nivel" : null,' +
            ' "carril" : "",' +
            ' "sentido" : null,' +
            ' "velocidad" : null,' +
            ' "unidad_velocidad" : null,' +
            ' "observaciones" : ""' +
            '}');
        this.cropForm = JSON.parse('{' +
            ' "is_video" : null,' +
            ' "time" : 0,' +
            ' "x1" : 0,' +
            ' "y1" : 0,' +
            ' "width" : 0,' +
            ' "height" : 0' +
            '}');
        this.deteccionSeguimientoForm = JSON.parse('{' +
            ' "deteccion" : null,' +
            ' "usuario" : null,' +
            ' "estado" : null,' +
            ' "observaciones" : ""' +
            '}');
        this.placa_confirm = "";
    };
    PrevalidacionPlacaComponent.prototype.resetErrores = function () {
        this.errores = [];
    };
    PrevalidacionPlacaComponent.prototype.cerrarVentana = function () {
        this.resetFormulario();
        this.resetErrores();
        jQuery('#img-evidencia-placa').imgAreaSelect({ remove: true });
        jQuery('#video-evidencia-placa').imgAreaSelect({ remove: true });
        jQuery('#placa-prevalidacion').modal('hide');
    };
    PrevalidacionPlacaComponent.prototype.loading = function () {
        return this.isLoading;
    };
    __decorate([
        core_1.Input('evidencia'), 
        __metadata('design:type', Object)
    ], PrevalidacionPlacaComponent.prototype, "evidenciaForm", void 0);
    __decorate([
        core_1.Input('placa'), 
        __metadata('design:type', String)
    ], PrevalidacionPlacaComponent.prototype, "placa", void 0);
    PrevalidacionPlacaComponent = __decorate([
        core_1.Component({
            selector: 'prevalidacion-placa',
            templateUrl: './app/components/src/pruebas/prevalidacion/placa/prevalidacion-placa.html',
            bindings: [DeteccionService_1.DeteccionService, DeteccionSeguimientoService_1.DeteccionSeguimientoService, components_1.NotificationsService],
            directives: [components_2.SimpleNotificationsComponent]
        }), 
        __metadata('design:paramtypes', [DeteccionService_1.DeteccionService, DeteccionSeguimientoService_1.DeteccionSeguimientoService, EvidenciaService_1.EvidenciaService, components_1.NotificationsService])
    ], PrevalidacionPlacaComponent);
    return PrevalidacionPlacaComponent;
}());
exports.PrevalidacionPlacaComponent = PrevalidacionPlacaComponent;
//# sourceMappingURL=PrevalidacionPlacaComponent.js.map