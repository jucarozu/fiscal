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
var AuditoriaService_1 = require("../../../../../services/AuditoriaService");
var PrevalidacionPlacaComponent_1 = require("../placa/PrevalidacionPlacaComponent");
var PrevalidacionDescarteComponent_1 = require("../descarte/PrevalidacionDescarteComponent");
var PrevalidacionConfirmComponent_1 = require("../confirm/PrevalidacionConfirmComponent");
var InfraDeteccionAddComponent_1 = require("../../../pruebas/infra-detecciones/add/InfraDeteccionAddComponent");
var InfraDeteccionDeleteComponent_1 = require("../../../pruebas/infra-detecciones/delete/InfraDeteccionDeleteComponent");
var components_1 = require('angular2-notifications/components');
var components_2 = require('angular2-notifications/components');
var core_2 = require('angular2-google-maps/core');
var ng2_file_upload_1 = require('ng2-file-upload');
var primeng_1 = require('primeng/primeng');
var PrevalidacionAddComponent = (function () {
    function PrevalidacionAddComponent(router, routeParams, deteccionService, deteccionSeguimientoService, evidenciaService, infraccionService, infraDeteccionService, propietarioService, direccionService, fuenteService, parametroService, auditoriaService, notificationService) {
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
        this.auditoriaService = auditoriaService;
        this.notificationService = notificationService;
        this.isLoading = false;
        this.accionAudit = 3; // Editar
        this.gpEstado = 16;
        this.gpTipoVehiculo = 17;
        this.gpServicio = 18;
        this.gpNivel = 19;
        this.gpSentido = 20;
        this.gpUnidadVelocidad = 21;
        this.gpTipoEvidencia = 23;
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
        this.fuentes = [];
        this.documentos = [];
        this.fuentes_prop = [];
        this.tipos_prop = [];
        this.departamentos = [];
        this.municipios = [];
        this.poblados = [];
        this.evidencias = [];
        this.evidenciasAdd = [];
        this.infraDetecciones = [];
        this.propietarios = [];
        this.evidArrayBytes = [];
        this.selectedEvidencia = {};
        this.selectedInfraDeteccion = {};
        this.spanInfoProp = "Cargando información de propietario...";
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
        this.uploader = new ng2_file_upload_1.FileUploader({ url: "" });
    }
    PrevalidacionAddComponent.prototype.ngOnInit = function () {
        if (this.userLogin == null)
            this.userLogin = JSON.parse(localStorage.getItem('user_login'));
        if (this.opcion == null)
            this.opcion = JSON.parse(localStorage.getItem('opcion'));
        this.resetFormulario();
        this.agregarEventos();
        this.cargarCombos();
        this.getDeteccion();
    };
    PrevalidacionAddComponent.prototype.agregarEventos = function () {
        // Eventos para refrescar el listado de evidencias al validar la placa.
        jQuery('#placa-prevalidacion').on('hide.bs.modal', function () {
            jQuery('#btn-load-validacion').click();
        });
        // Eventos para refrescar el listado de infracciones al agregar o eliminar una infracción.
        jQuery('#add-infra-deteccion, #delete-infra-deteccion').on('hide.bs.modal', function () {
            jQuery('#btn-load-infra-detecciones').click();
        });
        // Guardar la cadena de bytes de los archivos de evidencias en el array correspondiente.
        document.getElementById('input-evidencia-add').addEventListener('change', function () {
            var fileList = this.files;
            if (FileReader && fileList && fileList.length) {
                for (var i = 0; i < fileList.length; i++) {
                    var reader = new FileReader();
                    reader.onload = function () {
                        // btoa: Convierte el archivo binario a una cadena de bytes.
                        // encodeURIComponent: Codifica los caracteres especiales de la cadena de bytes.
                        var binaryString = encodeURIComponent(btoa(this.result));
                        document.getElementById('evid-array-bytes-add').innerHTML = binaryString;
                        jQuery('#btn-load-evidencia-add').click();
                    };
                    reader.readAsBinaryString(fileList[i]);
                }
            }
        }, false);
    };
    PrevalidacionAddComponent.prototype.cargarCombos = function () {
        var _this = this;
        // Detección
        this.parametroService.getByGrupo(this.gpEstado).then(function (estados) { _this.estados = estados; });
        this.parametroService.getByGrupo(this.gpTipoVehiculo).then(function (tiposVehiculo) { _this.tiposVehiculo = tiposVehiculo; });
        this.parametroService.getByGrupo(this.gpServicio).then(function (servicios) { _this.servicios = servicios; });
        this.parametroService.getByGrupo(this.gpNivel).then(function (niveles) { _this.niveles = niveles; });
        this.parametroService.getByGrupo(this.gpSentido).then(function (sentidos) { _this.sentidos = sentidos; });
        this.parametroService.getByGrupo(this.gpUnidadVelocidad).then(function (unidadesVelocidad) { _this.unidadesVelocidad = unidadesVelocidad; });
        this.parametroService.getByGrupo(this.gpTipoEvidencia).then(function (tiposEvidencia) { _this.tiposEvidencia = tiposEvidencia; });
        this.fuenteService.get().then(function (fuentes) { _this.fuentes = fuentes; });
        // Propietario
        this.parametroService.getByGrupo(this.gpTipoDocumento).then(function (documentos) { _this.documentos = documentos; });
        this.parametroService.getByGrupo(this.gpFuenteProp).then(function (fuentes_prop) { _this.fuentes_prop = fuentes_prop; });
        this.parametroService.getByGrupo(this.gpTipoPropietario).then(function (tipos_prop) { _this.tipos_prop = tipos_prop; });
    };
    PrevalidacionAddComponent.prototype.getDeteccion = function () {
        var _this = this;
        this.isLoading = true;
        this.deteccionService.getById(this.routeParams.get('deteccion')).then(function (deteccion) {
            if (deteccion == null) {
                _this.router.navigate(['Perfil']);
                _this.isLoading = false;
                return;
            }
            _this.deteccionForm = JSON.parse('{' +
                ' "deteccion" : "' + deteccion.deteccion + '",' +
                ' "fecha" : "' + deteccion.fecha.split(" ")[0] + '",' +
                ' "hora" : "' + deteccion.fecha.split(" ")[1] + '",' +
                ' "fuente" : ' + deteccion.fuente + ',' +
                ' "referencia_disp" : "' + deteccion.referencia_disp + '",' +
                ' "latitud" : ' + deteccion.latitud + ',' +
                ' "longitud" : ' + deteccion.longitud + ',' +
                ' "direccion" : "' + deteccion.direccion + '",' +
                ' "complemento_direccion" : "' + (deteccion.complemento_direccion != null ? deteccion.complemento_direccion : "") + '",' +
                ' "placa" : "' + (deteccion.placa != null ? deteccion.placa : "") + '",' +
                ' "tipo_vehiculo" : ' + deteccion.tipo_vehiculo + ',' +
                ' "color" : "' + (deteccion.color != null ? deteccion.color : "") + '",' +
                ' "servicio" : ' + deteccion.servicio + ',' +
                ' "nivel" : ' + deteccion.nivel + ',' +
                ' "carril" : "' + (deteccion.carril != null ? deteccion.carril : "") + '",' +
                ' "sentido" : ' + deteccion.sentido + ',' +
                ' "velocidad" : ' + deteccion.velocidad + ',' +
                ' "unidad_velocidad" : ' + deteccion.unidad_velocidad + ',' +
                ' "observaciones" : "' + (deteccion.observaciones != null ? deteccion.observaciones : "") + '"' +
                '}');
            _this.getSeguimiento();
            _this.getEvidencias();
            _this.getInfraDetecciones();
            if (deteccion.placa != null) {
                _this.getPropietarios(deteccion.placa);
            }
            _this.isLoading = false;
        });
    };
    PrevalidacionAddComponent.prototype.getSeguimiento = function () {
        var _this = this;
        this.isLoading = true;
        this.deteccionSeguimientoService.getByFilters(this.routeParams.get('deteccion'), 2).then(function (deteccionSeguimiento) {
            if (deteccionSeguimiento != null) {
                _this.deteccionSeguimientoForm.observaciones = deteccionSeguimiento.observaciones;
            }
            _this.isLoading = false;
        });
    };
    PrevalidacionAddComponent.prototype.getEvidencias = function () {
        var _this = this;
        this.isLoading = true;
        this.evidenciaService.getByDeteccion(this.routeParams.get('deteccion')).then(function (evidencias) {
            _this.evidencias = evidencias;
            _this.visualizarEvidencia(_this.evidencias[0]);
            jQuery("#txt-placa").removeAttr('disabled');
            jQuery("#btn-validar-placa").removeAttr('disabled');
            _this.isLoading = false;
        });
    };
    PrevalidacionAddComponent.prototype.getInfraDetecciones = function () {
        var _this = this;
        this.isLoading = true;
        this.infraDeteccionService.getByDeteccion(this.routeParams.get('deteccion')).then(function (infraDetecciones) {
            _this.infraDetecciones = [];
            for (var i in infraDetecciones) {
                _this.infraDetecciones.push({
                    infra_deteccion: infraDetecciones[i]['infra_deteccion'],
                    infraccion: infraDetecciones[i]['infraccion'],
                    codigo: infraDetecciones[i]['codigo'],
                    nombre_corto: infraDetecciones[i]['nombre_corto'],
                    observacion: infraDetecciones[i]['observacion']
                });
            }
            _this.isLoading = false;
        });
    };
    PrevalidacionAddComponent.prototype.getPropietarios = function (placa) {
        var _this = this;
        this.propietarioService.getByFilters(placa, 0, 0).then(function (propietarios) {
            _this.propietarios = propietarios.filter(function (propietario) {
                return propietario.hasta != null ? (_this.deteccionForm.fecha >= propietario.desde && _this.deteccionForm.fecha <= propietario.hasta) : (_this.deteccionForm.fecha >= propietario.desde);
            });
            if (_this.propietarios.length == 0) {
                _this.spanInfoProp = "No hay información de propietario.";
                return;
            }
            _this.propietarioForm = _this.propietarios[0];
            var _loop_1 = function(i) {
                _this.direccionService.getByPersona(_this.propietarios[i].persona).then(function (direccion) {
                    if (direccion != null) {
                        _this.propietarios[i].dir_departamento = direccion.departamento;
                        _this.propietarios[i].dir_municipio = direccion.municipio;
                        _this.propietarios[i].dir_poblado = direccion.poblado;
                        _this.propietarios[i].dir_descripcion = direccion.descripcion;
                    }
                    else {
                        _this.propietarios[i].dir_departamento = "";
                        _this.propietarios[i].dir_municipio = "";
                        _this.propietarios[i].dir_poblado = "";
                        _this.propietarios[i].dir_descripcion = "";
                    }
                });
            };
            for (var i in _this.propietarios) {
                _loop_1(i);
            }
        });
    };
    PrevalidacionAddComponent.prototype.visualizarEvidencia = function (evidencia) {
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
    PrevalidacionAddComponent.prototype.cargarEvidencia = function () {
        this.evidArrayBytes.push(document.getElementById('evid-array-bytes-add').innerHTML);
        document.getElementById('evid-array-bytes-add').innerHTML = "";
    };
    PrevalidacionAddComponent.prototype.borrarEvidencia = function (item) {
        var index = this.uploader.queue.indexOf(item);
        this.evidArrayBytes.splice(index, 1);
        this.uploader.queue[index].remove();
    };
    PrevalidacionAddComponent.prototype.insertEvidencias = function () {
        var _this = this;
        // Se valida que se hayan cargado evidencias asociadas a la detección.
        if (!this.validarEvidenciasAdd()) {
            return;
        }
        this.isLoading = true;
        for (var item in this.evidenciasAdd) {
            var evidenciaString = this.generarEvidenciaString(this.evidenciasAdd[item], this.routeParams.get('deteccion'));
            this.evidenciaService.insert(evidenciaString).then(function (res) {
                _this.isLoading = false;
                _this.notificationService.success("Operación exitosa", "Las evidencias fueron cargadas correctamente.");
                _this.resetEvidencias();
                _this.resetErrores();
                _this.getEvidencias();
            }, function (error) {
                // Código de respuesta de Laravel cuando falla la validación
                if (error.status === 422) {
                    var errores = error.json();
                    for (var key in errores) {
                        _this.errores.push(errores[key]);
                    }
                }
                else {
                    _this.errores.push("Ha ocurrido un error al cargar las evidencias.");
                }
                _this.isLoading = false;
            });
        }
    };
    PrevalidacionAddComponent.prototype.validarEvidenciasAdd = function () {
        this.evidenciasAdd = [];
        var items = this.uploader.queue;
        for (var item in items) {
            if (items[item].file.type == 'image/jpeg') {
                items[item].file.tipo_archivo = 1;
                items[item].file.extension = 'jpg';
            }
            else if (items[item].file.type == 'image/png') {
                items[item].file.tipo_archivo = 1;
                items[item].file.extension = 'png';
            }
            else if (items[item].file.type == 'video/mp4') {
                items[item].file.tipo_archivo = 2;
                items[item].file.extension = 'mp4';
            }
            else if (items[item].file.type == 'video/avi') {
                items[item].file.tipo_archivo = 2;
                items[item].file.extension = 'avi';
            }
            else {
                this.errores.push("Solo se aceptan archivos de tipo imagen (JPG/PNG) o video (MP4/AVI).");
                return false;
            }
            this.evidenciasAdd.push({
                nombre_archivo: items[item].file.name,
                tamano_kb: items[item].file.size / 1024,
                tipo_archivo: items[item].file.tipo_archivo,
                array_bytes: this.evidArrayBytes[item]
            });
        }
        return true;
    };
    PrevalidacionAddComponent.prototype.generarEvidenciaString = function (evidencia, deteccion) {
        return '&deteccion=' + (deteccion != null ? deteccion : '') +
            '&nombre_archivo=' + (evidencia.nombre_archivo != null ? evidencia.nombre_archivo : '') +
            '&tamano_kb=' + (evidencia.tamano_kb != null ? evidencia.tamano_kb : '') +
            '&tipo_archivo=' + (evidencia.tipo_archivo != null ? evidencia.tipo_archivo : '') +
            '&array_bytes=' + (evidencia.array_bytes != null ? evidencia.array_bytes : '');
    };
    PrevalidacionAddComponent.prototype.cargarPropietario = function (event) {
        this.propietarioForm = this.propietarios[event.index];
    };
    PrevalidacionAddComponent.prototype.convertPlacaToUpper = function () {
        if (this.deteccionForm.placa != "") {
            this.deteccionForm.placa = this.deteccionForm.placa.toUpperCase();
            jQuery("#txt-placa").removeAttr('disabled');
            jQuery("#btn-validar-placa").removeAttr('disabled');
        }
    };
    PrevalidacionAddComponent.prototype.validarPlaca = function () {
        var _this = this;
        this.getPropietarios(this.deteccionForm.placa);
        this.resetErrores();
        // Se verifica si existe un seguimiento de la validación de la placa.
        this.deteccionSeguimientoService.getByFilters(this.deteccionForm.deteccion, 4).then(function (deteccionSeguimiento) {
            if (deteccionSeguimiento == null) {
                jQuery('#placa-prevalidacion').modal({ backdrop: 'static', keyboard: false });
            }
            else {
                _this.errores.push("La detección ya tiene un registro de validación de placa.");
            }
        });
    };
    PrevalidacionAddComponent.prototype.verificarValidacionPlaca = function () {
        var isValidPlaca = jQuery('#is-valid-placa').val();
        // Se verifica que se haya validado la placa.
        if (isValidPlaca == 'true') {
            this.getDeteccion();
            this.resetErrores();
        }
    };
    PrevalidacionAddComponent.prototype.validar = function () {
        var _this = this;
        this.resetErrores();
        // Se valida que se haya seleccionado el tipo de vehículo.
        if (this.deteccionForm.tipo_vehiculo == null) {
            this.notificationService.error("Tipo de vehículo", "Debe seleccionar un tipo de vehículo.");
            return;
        }
        // Se valida que se haya seleccionado el servicio.
        if (this.deteccionForm.servicio == null) {
            this.notificationService.error("Servicio", "Debe seleccionar el servicio del vehículo.");
            return;
        }
        this.isLoading = true;
        // Se comprueba que se haya validado la placa.
        this.deteccionSeguimientoService.getByFilters(this.deteccionForm.deteccion, 4).then(function (deteccionSeguimiento) {
            if (deteccionSeguimiento == null) {
                _this.notificationService.error("Placa", "Debe validar la placa para continuar con el proceso.");
                _this.isLoading = false;
                return;
            }
            // Se valida que se hayan cargado infracciones asociadas a la detección.
            if (_this.infraDetecciones.length == 0) {
                _this.errores.push("Debe especificar al menos una infracción para la detección.");
                _this.isLoading = false;
                return;
            }
            jQuery('#confirm-prevalidacion').modal({ backdrop: 'static', keyboard: false });
            _this.isLoading = false;
        });
    };
    PrevalidacionAddComponent.prototype.guardar = function () {
        var _this = this;
        // Se valida que se hayan cargado infracciones asociadas a la detección.
        if (this.infraDetecciones.length == 0) {
            this.errores.push("Debe especificar al menos una infracción para la detección.");
            return;
        }
        this.resetErrores();
        this.isLoading = true;
        var deteccionString = this.generarDeteccionString(this.deteccionForm);
        this.deteccionService.update(deteccionString, this.deteccionForm.deteccion).then(function (res) {
            _this.deteccionSeguimientoForm.deteccion = _this.deteccionForm.deteccion;
            _this.deteccionSeguimientoForm.usuario = _this.userLogin.usuario;
            // Estado 2: Guardada
            _this.deteccionSeguimientoForm.estado = 2;
            var deteccionSeguimientoString = _this.generarDeteccionSeguimientoString(_this.deteccionSeguimientoForm);
            _this.deteccionSeguimientoService.insert(deteccionSeguimientoString).then(function (res) {
                _this.auditar(_this.deteccionForm);
                _this.isLoading = false;
                _this.notificationService.success("Operación exitosa", "La detección ha sido guardada correctamente.");
                _this.resetFormulario();
                _this.router.navigate(['PruebasPrevalidacionView']);
            }, function (error) {
                _this.errores.push("Ha ocurrido un error al registrar el seguimiento de la detección.");
                _this.isLoading = false;
            });
        }, function (error) {
            _this.errores.push("Ha ocurrido un error al actualizar los datos de la detección.");
            _this.isLoading = false;
        });
    };
    PrevalidacionAddComponent.prototype.generarDeteccionString = function (deteccion) {
        return '&fecha=' + (deteccion.fecha != null ? deteccion.fecha : '') +
            '&hora=' + (deteccion.hora != null ? deteccion.hora : '') +
            '&fuente=' + (deteccion.fuente != null ? deteccion.fuente : '') +
            '&referencia_disp=' + (deteccion.referencia_disp != null ? deteccion.referencia_disp : '') +
            '&latitud=' + (deteccion.latitud != null ? deteccion.latitud : '') +
            '&longitud=' + (deteccion.longitud != null ? deteccion.longitud : '') +
            '&direccion=' + (deteccion.direccion != null ? deteccion.direccion : '') +
            '&complemento_direccion=' + (deteccion.complemento_direccion != null ? deteccion.complemento_direccion : '') +
            '&placa=' + (deteccion.placa != null ? deteccion.placa : '') +
            '&tipo_vehiculo=' + (deteccion.tipo_vehiculo != null ? deteccion.tipo_vehiculo : '') +
            '&color=' + (deteccion.color != null ? deteccion.color : '') +
            '&servicio=' + (deteccion.servicio != null ? deteccion.servicio : '') +
            '&nivel=' + (deteccion.nivel != null ? deteccion.nivel : '') +
            '&carril=' + (deteccion.carril != null ? deteccion.carril : '') +
            '&sentido=' + (deteccion.sentido != null ? deteccion.sentido : '') +
            '&velocidad=' + (deteccion.velocidad != null ? deteccion.velocidad : '') +
            '&unidad_velocidad=' + (deteccion.unidad_velocidad != null ? deteccion.unidad_velocidad : '') +
            '&observaciones=' + (deteccion.observaciones != null ? deteccion.observaciones : '');
    };
    PrevalidacionAddComponent.prototype.generarDeteccionSeguimientoString = function (deteccionSeguimiento) {
        return '&deteccion=' + (deteccionSeguimiento.deteccion != null ? deteccionSeguimiento.deteccion : '') +
            '&usuario=' + (deteccionSeguimiento.usuario != null ? deteccionSeguimiento.usuario : '') +
            '&estado=' + (deteccionSeguimiento.estado != null ? deteccionSeguimiento.estado : '') +
            '&observaciones=' + (deteccionSeguimiento.observaciones != null ? deteccionSeguimiento.observaciones : '');
    };
    PrevalidacionAddComponent.prototype.auditar = function (deteccion) {
        try {
            var deteccionAudit = this.generarDeteccionAudit(deteccion);
            this.auditoriaService.insert(this.opcion.opcion, this.accionAudit, deteccionAudit);
            return true;
        }
        catch (error) {
            return false;
        }
    };
    PrevalidacionAddComponent.prototype.generarDeteccionAudit = function (deteccion) {
        var deteccionAudit = {
            deteccion: deteccion['deteccion'],
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
            observaciones: deteccion.observaciones
        };
        return JSON.stringify(deteccionAudit);
    };
    PrevalidacionAddComponent.prototype.resetEvidencias = function () {
        this.evidencias = [];
        this.evidArrayBytes = [];
        this.uploader.clearQueue();
        document.getElementById('input-evidencia-add').setAttribute('value', null);
    };
    PrevalidacionAddComponent.prototype.resetErrores = function () {
        this.errores = [];
    };
    PrevalidacionAddComponent.prototype.resetFormulario = function () {
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
        this.deteccionSeguimientoForm = JSON.parse('{' +
            ' "deteccion" : null,' +
            ' "usuario" : null,' +
            ' "estado" : null,' +
            ' "observaciones" : ""' +
            '}');
        this.propietarioForm = JSON.parse('{' +
            ' "placa" : "",' +
            ' "persona" : null,' +
            ' "tipo_doc" : null,' +
            ' "numero_doc" : "",' +
            ' "nombres_apellidos" : "",' +
            ' "fuente" : null,' +
            ' "tipo" : null,' +
            ' "locatario" : null,' +
            ' "loc_tipo_doc" : null,' +
            ' "loc_numero_doc" : "",' +
            ' "loc_nombres_apellidos" : "",' +
            ' "desde" : null,' +
            ' "hasta" : null, ' +
            ' "fecha_registra" : null, ' +
            ' "dias_registro" : null, ' +
            ' "dir_divipo" : null,' +
            ' "dir_cod_departamento" : null,' +
            ' "dir_departamento" : "",' +
            ' "dir_cod_municipio" : null,' +
            ' "dir_municipio" : "",' +
            ' "dir_cod_poblado" : null,' +
            ' "dir_poblado" : "",' +
            ' "dir_descripcion" : ""' +
            '}');
        this.getInfraDetecciones();
        this.resetEvidencias();
        this.resetErrores();
    };
    PrevalidacionAddComponent.prototype.selectInfraDeteccion = function (infraDeteccion) {
        this.selectedInfraDeteccion = infraDeteccion;
    };
    PrevalidacionAddComponent.prototype.loading = function () {
        return this.isLoading;
    };
    PrevalidacionAddComponent = __decorate([
        core_1.Component({
            selector: 'prevalidacion-add',
            templateUrl: './app/components/src/pruebas/prevalidacion/add/prevalidacion-add.html',
            bindings: [
                DeteccionService_1.DeteccionService, DeteccionSeguimientoService_1.DeteccionSeguimientoService, EvidenciaService_1.EvidenciaService, InfraccionService_1.InfraccionService, InfraDeteccionService_1.InfraDeteccionService, PropietarioService_1.PropietarioService, DireccionService_1.DireccionService,
                FuenteService_1.FuenteService, ParametroService_1.ParametroService, AuditoriaService_1.AuditoriaService, components_1.NotificationsService
            ],
            directives: [
                PrevalidacionPlacaComponent_1.PrevalidacionPlacaComponent,
                PrevalidacionDescarteComponent_1.PrevalidacionDescarteComponent,
                PrevalidacionConfirmComponent_1.PrevalidacionConfirmComponent,
                InfraDeteccionAddComponent_1.InfraDeteccionAddComponent,
                InfraDeteccionDeleteComponent_1.InfraDeteccionDeleteComponent,
                components_2.SimpleNotificationsComponent,
                core_2.GOOGLE_MAPS_DIRECTIVES,
                ng2_file_upload_1.FILE_UPLOAD_DIRECTIVES,
                router_deprecated_1.ROUTER_DIRECTIVES,
                primeng_1.TabView, primeng_1.TabPanel
            ]
        }), 
        __metadata('design:paramtypes', [router_deprecated_1.Router, router_deprecated_1.RouteParams, DeteccionService_1.DeteccionService, DeteccionSeguimientoService_1.DeteccionSeguimientoService, EvidenciaService_1.EvidenciaService, InfraccionService_1.InfraccionService, InfraDeteccionService_1.InfraDeteccionService, PropietarioService_1.PropietarioService, DireccionService_1.DireccionService, FuenteService_1.FuenteService, ParametroService_1.ParametroService, AuditoriaService_1.AuditoriaService, components_1.NotificationsService])
    ], PrevalidacionAddComponent);
    return PrevalidacionAddComponent;
}());
exports.PrevalidacionAddComponent = PrevalidacionAddComponent;
//# sourceMappingURL=PrevalidacionAddComponent.js.map