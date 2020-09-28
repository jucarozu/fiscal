import { Component, Input, OnInit } from '@angular/core';

import { ROUTER_DIRECTIVES, Router, RouteParams } from '@angular/router-deprecated';

import { IDeteccion } from "../../../../../interfaces/IDeteccion";
import { IDeteccionSeguimiento } from "../../../../../interfaces/IDeteccionSeguimiento";
import { IEvidencia } from "../../../../../interfaces/IEvidencia";
import { IInfraccion } from "../../../../../interfaces/IInfraccion";
import { IPropietario } from "../../../../../interfaces/IPropietario";
import { IDireccion } from "../../../../../interfaces/IDireccion";
import { IFuente } from "../../../../../interfaces/IFuente";
import { IUsuario } from "../../../../../interfaces/IUsuario";
import { IOpcion } from "../../../../../interfaces/IOpcion";

import { DeteccionService } from "../../../../../services/DeteccionService";
import { DeteccionSeguimientoService } from "../../../../../services/DeteccionSeguimientoService";
import { EvidenciaService } from "../../../../../services/EvidenciaService";
import { InfraccionService } from "../../../../../services/InfraccionService";
import { InfraDeteccionService } from "../../../../../services/InfraDeteccionService";
import { PropietarioService } from "../../../../../services/PropietarioService";
import { DireccionService } from "../../../../../services/DireccionService";
import { FuenteService } from "../../../../../services/FuenteService";
import { ParametroService } from "../../../../../services/ParametroService";
import { AuditoriaService } from "../../../../../services/AuditoriaService";

import { PrevalidacionPlacaComponent } from "../placa/PrevalidacionPlacaComponent";
import { PrevalidacionDescarteComponent } from "../descarte/PrevalidacionDescarteComponent";
import { PrevalidacionConfirmComponent } from "../confirm/PrevalidacionConfirmComponent";
import { InfraDeteccionAddComponent } from "../../../pruebas/infra-detecciones/add/InfraDeteccionAddComponent";
import { InfraDeteccionDeleteComponent } from "../../../pruebas/infra-detecciones/delete/InfraDeteccionDeleteComponent";

import { NotificationsService } from 'angular2-notifications/components';
import { SimpleNotificationsComponent } from 'angular2-notifications/components';

import { GOOGLE_MAPS_DIRECTIVES, MouseEvent } from 'angular2-google-maps/core';

import { FILE_UPLOAD_DIRECTIVES, FileUploader } from 'ng2-file-upload';

import { TabView, TabPanel } from 'primeng/primeng';

declare var jQuery : any;
 
@Component({
    selector: 'prevalidacion-add',
    templateUrl: './app/components/src/pruebas/prevalidacion/add/prevalidacion-add.html',
    bindings: [
        DeteccionService, DeteccionSeguimientoService, EvidenciaService, InfraccionService, InfraDeteccionService, PropietarioService, DireccionService, 
        FuenteService, ParametroService, AuditoriaService, NotificationsService
    ],
    directives: [
        PrevalidacionPlacaComponent,
        PrevalidacionDescarteComponent,
        PrevalidacionConfirmComponent,
        InfraDeteccionAddComponent,
        InfraDeteccionDeleteComponent,
        SimpleNotificationsComponent,
        GOOGLE_MAPS_DIRECTIVES,
        FILE_UPLOAD_DIRECTIVES,
        ROUTER_DIRECTIVES,
        TabView, TabPanel
    ]
})

export class PrevalidacionAddComponent implements OnInit
{
	isLoading: boolean = false;

    accionAudit: number = 3; // Editar

    gpEstado: number = 16;
    gpTipoVehiculo: number = 17;
    gpServicio: number = 18;
    gpNivel: number = 19;
    gpSentido: number = 20;
    gpUnidadVelocidad: number = 21;
    gpTipoEvidencia: number = 23;

    gpTipoDocumento: number = 1;
    gpFuenteProp: number = 14;
    gpTipoPropietario: number = 15;

    userLogin: IUsuario;
    opcion: IOpcion;

    deteccionForm: IDeteccion;
    deteccionSeguimientoForm: IDeteccionSeguimiento;
    propietarioForm: IPropietario;
    
    errores: Array<Object> = [];

    estados: Array<Object> = [];
    tiposVehiculo: Array<Object> = [];
    servicios: Array<Object> = [];
    niveles: Array<Object> = [];
    sentidos: Array<Object> = [];
    unidadesVelocidad: Array<Object> = [];
    tiposEvidencia: Array<Object> = [];
    fuentes: Array<IFuente> = [];
    
    documentos: Array<Object> = [];
    fuentes_prop: Array<Object> = [];
    tipos_prop: Array<Object> = [];

    departamentos: Array<Object> = [];
    municipios: Array<Object> = [];
    poblados: Array<Object> = [];

    evidencias: Array<IEvidencia> = [];
    evidenciasAdd: Array<Object> = [];
    infraDetecciones: Array<Object> = [];
    propietarios: Array<IPropietario> = [];

    evidArrayBytes: Array<Object> = [];
    selectedEvidencia: Object = {};
    selectedInfraDeteccion: Object = {};

    spanInfoProp : string = "Cargando información de propietario...";

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

    uploader: FileUploader = new FileUploader({ url: "" });

    constructor(private router: Router,
                private routeParams: RouteParams,
                private deteccionService: DeteccionService,
                private deteccionSeguimientoService: DeteccionSeguimientoService,
                private evidenciaService: EvidenciaService,
                private infraccionService: InfraccionService,
                private infraDeteccionService: InfraDeteccionService,
                private propietarioService: PropietarioService,
                private direccionService: DireccionService,
                private fuenteService: FuenteService,
                private parametroService: ParametroService,
                private auditoriaService: AuditoriaService,
                private notificationService: NotificationsService) {}

    ngOnInit()
    {
        if (this.userLogin == null)
            this.userLogin = JSON.parse(localStorage.getItem('user_login'));

        if (this.opcion == null)
            this.opcion = JSON.parse(localStorage.getItem('opcion'));

        this.resetFormulario();
        this.agregarEventos();
        this.cargarCombos();

        this.getDeteccion();
    }

    private agregarEventos()
    {
        // Eventos para refrescar el listado de evidencias al validar la placa.
        jQuery('#placa-prevalidacion').on('hide.bs.modal', function() {
            jQuery('#btn-load-validacion').click();
        });

        // Eventos para refrescar el listado de infracciones al agregar o eliminar una infracción.
        jQuery('#add-infra-deteccion, #delete-infra-deteccion').on('hide.bs.modal', function() {
            jQuery('#btn-load-infra-detecciones').click();
        });

        // Guardar la cadena de bytes de los archivos de evidencias en el array correspondiente.
        document.getElementById('input-evidencia-add').addEventListener('change', function() {
            var fileList = this.files;

            if (FileReader && fileList && fileList.length)
            {
                for (let i = 0; i < fileList.length; i++)
                {
                    var reader = new FileReader();

                    reader.onload = function() {
                        // btoa: Convierte el archivo binario a una cadena de bytes.
                        // encodeURIComponent: Codifica los caracteres especiales de la cadena de bytes.
                        var binaryString = encodeURIComponent(btoa(this.result));
                        document.getElementById('evid-array-bytes-add').innerHTML = binaryString;
                        jQuery('#btn-load-evidencia-add').click();
                    }

                    reader.readAsBinaryString(fileList[i]);
                }
            }
        }, false);
    }

    private cargarCombos()
    {
        // Detección
        this.parametroService.getByGrupo(this.gpEstado).then(estados => { this.estados = estados });
        this.parametroService.getByGrupo(this.gpTipoVehiculo).then(tiposVehiculo => { this.tiposVehiculo = tiposVehiculo });
        this.parametroService.getByGrupo(this.gpServicio).then(servicios => { this.servicios = servicios });
        this.parametroService.getByGrupo(this.gpNivel).then(niveles => { this.niveles = niveles });
        this.parametroService.getByGrupo(this.gpSentido).then(sentidos => { this.sentidos = sentidos });
        this.parametroService.getByGrupo(this.gpUnidadVelocidad).then(unidadesVelocidad => { this.unidadesVelocidad = unidadesVelocidad });
        this.parametroService.getByGrupo(this.gpTipoEvidencia).then(tiposEvidencia => { this.tiposEvidencia = tiposEvidencia });
        this.fuenteService.get().then(fuentes => { this.fuentes = fuentes });

        // Propietario
        this.parametroService.getByGrupo(this.gpTipoDocumento).then(documentos => { this.documentos = documentos });
        this.parametroService.getByGrupo(this.gpFuenteProp).then(fuentes_prop => { this.fuentes_prop = fuentes_prop });
        this.parametroService.getByGrupo(this.gpTipoPropietario).then(tipos_prop => { this.tipos_prop = tipos_prop });
    }

    private getDeteccion() : void
    {
        this.isLoading = true;

        this.deteccionService.getById(this.routeParams.get('deteccion')).then(deteccion => 
            {
                if (deteccion == null)
                {
                    this.router.navigate(['Perfil']);
                    this.isLoading = false;
                    return;
                }

                this.deteccionForm = JSON.parse('{' + 
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

                this.getSeguimiento();
                this.getEvidencias();
                this.getInfraDetecciones();

                if (deteccion.placa != null)
                {
                    this.getPropietarios(deteccion.placa);
                }

                this.isLoading = false;
            }
        );
    }

    private getSeguimiento()
    {
        this.isLoading = true;

        this.deteccionSeguimientoService.getByFilters(this.routeParams.get('deteccion'), 2).then(deteccionSeguimiento => 
            {
                if (deteccionSeguimiento != null)
                {
                    this.deteccionSeguimientoForm.observaciones = deteccionSeguimiento.observaciones;
                }
                
                this.isLoading = false;
            }
        );
    }

    private getEvidencias() : void
    {
        this.isLoading = true;

        this.evidenciaService.getByDeteccion(this.routeParams.get('deteccion')).then(evidencias =>
            {
                this.evidencias = evidencias;
                this.visualizarEvidencia(this.evidencias[0]);

                jQuery("#txt-placa").removeAttr('disabled');
                jQuery("#btn-validar-placa").removeAttr('disabled');

                this.isLoading = false;
            }
        );
    }

    private getInfraDetecciones() : void
    {
        this.isLoading = true;

        this.infraDeteccionService.getByDeteccion(this.routeParams.get('deteccion')).then(infraDetecciones => 
            {
                this.infraDetecciones = [];
                
                for (let i in infraDetecciones)
                {
                    this.infraDetecciones.push({
                        infra_deteccion : infraDetecciones[i]['infra_deteccion'],
                        infraccion : infraDetecciones[i]['infraccion'], 
                        codigo : infraDetecciones[i]['codigo'], 
                        nombre_corto : infraDetecciones[i]['nombre_corto'], 
                        observacion : infraDetecciones[i]['observacion']
                    });
                }

                this.isLoading = false;
            }
        );
    }

    private getPropietarios(placa) : void
    {
        this.propietarioService.getByFilters(placa, 0, 0).then(propietarios => 
            {
                this.propietarios = propietarios.filter(propietario => 
                    propietario.hasta != null ? (
                        this.deteccionForm.fecha >= propietario.desde && this.deteccionForm.fecha <= propietario.hasta
                    ) : (
                        this.deteccionForm.fecha >= propietario.desde
                    )
                );

                if (this.propietarios.length == 0)
                {
                    this.spanInfoProp = "No hay información de propietario.";
                    return;
                }

                this.propietarioForm = this.propietarios[0];

                for (let i in this.propietarios)
                {
                    this.direccionService.getByPersona(this.propietarios[i].persona).then(direccion =>
                        {
                            if (direccion != null)
                            {
                                this.propietarios[i].dir_departamento = direccion.departamento;
                                this.propietarios[i].dir_municipio = direccion.municipio;
                                this.propietarios[i].dir_poblado = direccion.poblado;
                                this.propietarios[i].dir_descripcion = direccion.descripcion;
                            }
                            else
                            {
                                this.propietarios[i].dir_departamento = "";
                                this.propietarios[i].dir_municipio = "";
                                this.propietarios[i].dir_poblado = "";
                                this.propietarios[i].dir_descripcion = "";
                            }
                        }
                    );
                }
            }
        );
    }

    private visualizarEvidencia(evidencia)
    {
        let array_bytes = this.evidencias[this.evidencias.indexOf(evidencia)].array_bytes;

        switch (evidencia.tipo_archivo)
        {
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
    }

    private cargarEvidencia()
    {
        this.evidArrayBytes.push(document.getElementById('evid-array-bytes-add').innerHTML);
        document.getElementById('evid-array-bytes-add').innerHTML = "";
    }

    private borrarEvidencia(item)
    {
        let index = this.uploader.queue.indexOf(item);
        this.evidArrayBytes.splice(index, 1);
        this.uploader.queue[index].remove();
    }

    private insertEvidencias()
    {
        // Se valida que se hayan cargado evidencias asociadas a la detección.
        if (!this.validarEvidenciasAdd())
        {
            return;
        }

        this.isLoading = true;

        for (let item in this.evidenciasAdd)
        {
            let evidenciaString = this.generarEvidenciaString(this.evidenciasAdd[item], this.routeParams.get('deteccion'));

            this.evidenciaService.insert(evidenciaString).then(
                (res) => {
                    this.isLoading = false;

                    this.notificationService.success("Operación exitosa", "Las evidencias fueron cargadas correctamente.");
                    this.resetEvidencias();
                    this.resetErrores();

                    this.getEvidencias();
                },
                (error) => {
                    // Código de respuesta de Laravel cuando falla la validación
                    if (error.status === 422)
                    {
                        let errores = error.json();

                        for (var key in errores)
                        {
                            this.errores.push(errores[key]);
                        }
                    }
                    else
                    {
                        this.errores.push("Ha ocurrido un error al cargar las evidencias.");
                    }

                    this.isLoading = false;
                }
            );
        }        
    }

    private validarEvidenciasAdd() : boolean
    {
        this.evidenciasAdd = [];
        let items = this.uploader.queue;

        for (let item in items)
        {
            if (items[item].file.type == 'image/jpeg')
            {
                items[item].file.tipo_archivo = 1;
                items[item].file.extension = 'jpg';
            }
            else if (items[item].file.type == 'image/png')
            {
                items[item].file.tipo_archivo = 1;
                items[item].file.extension = 'png';
            }
            else if (items[item].file.type == 'video/mp4')
            {
                items[item].file.tipo_archivo = 2;
                items[item].file.extension = 'mp4';
            }
            else if (items[item].file.type == 'video/avi')
            {
                items[item].file.tipo_archivo = 2;
                items[item].file.extension = 'avi';
            }
            else
            {
                this.errores.push("Solo se aceptan archivos de tipo imagen (JPG/PNG) o video (MP4/AVI).");
                return false;
            }

            this.evidenciasAdd.push({
                nombre_archivo : items[item].file.name, 
                tamano_kb : items[item].file.size / 1024,
                tipo_archivo : items[item].file.tipo_archivo,
                array_bytes : this.evidArrayBytes[item]
            });
        }

        return true;
    }

    private generarEvidenciaString(evidencia, deteccion) : string
    {
        return '&deteccion=' + (deteccion != null ? deteccion : '') +
               '&nombre_archivo=' + (evidencia.nombre_archivo != null ? evidencia.nombre_archivo : '') +
               '&tamano_kb=' + (evidencia.tamano_kb != null ? evidencia.tamano_kb : '') +
               '&tipo_archivo=' + (evidencia.tipo_archivo != null ? evidencia.tipo_archivo : '') +
               '&array_bytes=' + (evidencia.array_bytes != null ? evidencia.array_bytes : '');
    }

    private cargarPropietario(event)
    {
        this.propietarioForm = this.propietarios[event.index];
    }    

    private convertPlacaToUpper()
    {
        if (this.deteccionForm.placa != "")
        {
            this.deteccionForm.placa = this.deteccionForm.placa.toUpperCase();
            jQuery("#txt-placa").removeAttr('disabled');
            jQuery("#btn-validar-placa").removeAttr('disabled');
        }
    }

    private validarPlaca() : void
    {
        this.getPropietarios(this.deteccionForm.placa);        
        this.resetErrores();

        // Se verifica si existe un seguimiento de la validación de la placa.
        this.deteccionSeguimientoService.getByFilters(this.deteccionForm.deteccion, 4).then(deteccionSeguimiento => 
            {
                if (deteccionSeguimiento == null)
                {
                    jQuery('#placa-prevalidacion').modal({backdrop: 'static', keyboard: false});
                }
                else
                {
                    this.errores.push("La detección ya tiene un registro de validación de placa.");
                }
            }
        );
    }

    private verificarValidacionPlaca()
    {
        let isValidPlaca = jQuery('#is-valid-placa').val();

        // Se verifica que se haya validado la placa.
        if (isValidPlaca == 'true')
        {
            this.getDeteccion();
            this.resetErrores();
        }
    }

    private validar() : void
    {
        this.resetErrores();

        // Se valida que se haya seleccionado el tipo de vehículo.
        if (this.deteccionForm.tipo_vehiculo == null)
        {
            this.notificationService.error("Tipo de vehículo", "Debe seleccionar un tipo de vehículo.");
            return;
        }

        // Se valida que se haya seleccionado el servicio.
        if (this.deteccionForm.servicio == null)
        {
            this.notificationService.error("Servicio", "Debe seleccionar el servicio del vehículo.");
            return;
        }

        this.isLoading = true;

        // Se comprueba que se haya validado la placa.
        this.deteccionSeguimientoService.getByFilters(this.deteccionForm.deteccion, 4).then(deteccionSeguimiento => 
            {
                if (deteccionSeguimiento == null)
                {
                    this.notificationService.error("Placa", "Debe validar la placa para continuar con el proceso.");
                    this.isLoading = false;
                    return;
                }

                // Se valida que se hayan cargado infracciones asociadas a la detección.
                if (this.infraDetecciones.length == 0)
                {
                    this.errores.push("Debe especificar al menos una infracción para la detección.");
                    this.isLoading = false;
                    return;
                }

                jQuery('#confirm-prevalidacion').modal({backdrop: 'static', keyboard: false});

                this.isLoading = false;
            }
        );
    }

    private guardar() : void
    {
        // Se valida que se hayan cargado infracciones asociadas a la detección.
        if (this.infraDetecciones.length == 0)
        {
            this.errores.push("Debe especificar al menos una infracción para la detección.");
            return;
        }

        this.resetErrores();
        this.isLoading = true;

        let deteccionString = this.generarDeteccionString(this.deteccionForm);

        this.deteccionService.update(deteccionString, this.deteccionForm.deteccion).then(
            (res) => {
                this.deteccionSeguimientoForm.deteccion = this.deteccionForm.deteccion;
                this.deteccionSeguimientoForm.usuario = this.userLogin.usuario;

                // Estado 2: Guardada
                this.deteccionSeguimientoForm.estado = 2;

                let deteccionSeguimientoString = this.generarDeteccionSeguimientoString(this.deteccionSeguimientoForm);

                this.deteccionSeguimientoService.insert(deteccionSeguimientoString).then(
                    (res) => {
                        this.auditar(this.deteccionForm);
                        this.isLoading = false;

                        this.notificationService.success("Operación exitosa", "La detección ha sido guardada correctamente.");
                        this.resetFormulario();
                        this.router.navigate(['PruebasPrevalidacionView']);
                    },
                    (error) => {
                        this.errores.push("Ha ocurrido un error al registrar el seguimiento de la detección.");
                        this.isLoading = false;
                    }
                );
            },
            (error) => {
                this.errores.push("Ha ocurrido un error al actualizar los datos de la detección.");
                this.isLoading = false;
            }
        );
    }

    private generarDeteccionString(deteccion) : string
    {
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
    }

    private generarDeteccionSeguimientoString(deteccionSeguimiento) : string
    {
        return '&deteccion=' + (deteccionSeguimiento.deteccion != null ? deteccionSeguimiento.deteccion : '') +
               '&usuario=' + (deteccionSeguimiento.usuario != null ? deteccionSeguimiento.usuario : '') +
               '&estado=' + (deteccionSeguimiento.estado != null ? deteccionSeguimiento.estado : '') +
               '&observaciones=' + (deteccionSeguimiento.observaciones != null ? deteccionSeguimiento.observaciones : '');
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
            deteccion : deteccion['deteccion'],
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
            observaciones : deteccion.observaciones
        };

        return JSON.stringify(deteccionAudit);
    }

    private resetEvidencias()
    {
        this.evidencias = [];
        this.evidArrayBytes = [];

        this.uploader.clearQueue();
        document.getElementById('input-evidencia-add').setAttribute('value', null);
    }

    private resetErrores() : void
    {
        this.errores = [];
    }

    private resetFormulario() : void
    {
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
    }

    private selectInfraDeteccion(infraDeteccion)
    {
        this.selectedInfraDeteccion = infraDeteccion;
    }

    private loading() : boolean
    {
        return this.isLoading;
    }
}