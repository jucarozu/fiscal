import { Component, Input, OnInit } from '@angular/core';

import { CanActivate, ComponentInstruction, ROUTER_DIRECTIVES, Router } from '@angular/router-deprecated';
import { IsLoggedIn } from '../../../../constants/IsLoggedIn';

import { IDeteccion } from "../../../../interfaces/IDeteccion";

import { IFuente } from "../../../../interfaces/IFuente";
import { IInfraccion } from "../../../../interfaces/IInfraccion";
import { IUsuario } from "../../../../interfaces/IUsuario";
import { IOpcion } from "../../../../interfaces/IOpcion";

import { AuthService } from '../../../../services/AuthService';
import { DeteccionService } from "../../../../services/DeteccionService";
import { FuenteService } from "../../../../services/FuenteService";
import { InfraccionService } from "../../../../services/InfraccionService";
import { ParametroService } from "../../../../services/ParametroService";
import { AuditoriaService } from "../../../../services/AuditoriaService";

import { NotificationsService } from 'angular2-notifications/components';
import { SimpleNotificationsComponent } from 'angular2-notifications/components';

import { GOOGLE_MAPS_DIRECTIVES, MouseEvent } from 'angular2-google-maps/core';

import { FILE_UPLOAD_DIRECTIVES, FileUploader } from 'ng2-file-upload';

declare var jQuery : any;
 
@Component({
    selector: 'carga-individual-view',
    templateUrl: './app/components/src/pruebas/carga-individual/carga-individual-view.html',
    bindings: [AuthService, DeteccionService, FuenteService, InfraccionService, ParametroService, AuditoriaService, NotificationsService],
    directives: [
        SimpleNotificationsComponent,
        GOOGLE_MAPS_DIRECTIVES,
        FILE_UPLOAD_DIRECTIVES
    ]
})

@CanActivate((next: ComponentInstruction, previous: ComponentInstruction) => {
    return IsLoggedIn(next, previous);
})

export class CargaIndividualComponent implements OnInit
{
	isLoading: boolean = false;

    accionAudit: number = 2; // Adicionar

    gpEstado: number = 16;
    gpTipoVehiculo: number = 17;
    gpServicio: number = 18;
    gpNivel: number = 19;
    gpSentido: number = 20;
    gpUnidadVelocidad: number = 21;
    gpTipoEvidencia: number = 23;

    userLogin: IUsuario;
    opcion: IOpcion;

    deteccionForm: IDeteccion;
    
    errores: Array<Object> = [];

    estados: Array<Object> = [];
    tiposVehiculo: Array<Object> = [];
    servicios: Array<Object> = [];
    niveles: Array<Object> = [];
    sentidos: Array<Object> = [];
    unidadesVelocidad: Array<Object> = [];
    tiposEvidencia: Array<Object> = [];

    fuentes: Array<IFuente> = [];
    evidencias: Array<Object> = [];
    infracciones: Array<Object> = [];

    evidArrayBytes: Array<Object> = [];

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

    zoom: number = 15;
    lat: number = 10.335733927654234;
    lng: number = -75.41285991668701;

    uploader: FileUploader = new FileUploader({ url: "" });

    constructor(private router: Router,
                private authService: AuthService,
                private deteccionService: DeteccionService,
                private fuenteService: FuenteService,
                private infraccionService: InfraccionService,
                private parametroService: ParametroService,
                private auditoriaService: AuditoriaService,
                private notificationService: NotificationsService) {}

    ngOnInit()
    {
        if (!this.authService.authorize())
            this.router.navigate(['Perfil']);

        if (this.userLogin == null)
            this.userLogin = JSON.parse(localStorage.getItem('user_login'));

        if (this.opcion == null)
            this.opcion = JSON.parse(localStorage.getItem('opcion'));

        this.resetFormulario();
        this.cargarCombos();

        this.agregarEventos();
    }

    private agregarEventos()
    {
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
                        document.getElementById('evid-array-bytes').innerHTML = binaryString;
                        jQuery('#btn-load-evidencia').click();
                    }

                    reader.readAsBinaryString(fileList[i]);
                }
            }
        }, false);
    }

    private getInfracciones() : void
    {
        this.isLoading = true;

        this.infraccionService.get().then(infracciones => 
            {
                this.infracciones = [];
                
                for (let i in infracciones)
                {
                    this.infracciones.push({
                        infraccion : infracciones[i]['infraccion'], 
                        codigo : infracciones[i]['codigo'], 
                        nombre_corto : infracciones[i]['nombre_corto'], 
                        tiene_infraccion : infracciones[i]['tiene_infraccion'], 
                        observacion : infracciones[i]['observacion'], 
                    });
                }

                this.isLoading = false;
            }
        );
    }

    private cargarCombos()
    {
        this.parametroService.getByGrupo(this.gpEstado).then(estados => { this.estados = estados });
        this.parametroService.getByGrupo(this.gpTipoVehiculo).then(tiposVehiculo => { this.tiposVehiculo = tiposVehiculo });
        this.parametroService.getByGrupo(this.gpServicio).then(servicios => { this.servicios = servicios });
        this.parametroService.getByGrupo(this.gpNivel).then(niveles => { this.niveles = niveles });
        this.parametroService.getByGrupo(this.gpSentido).then(sentidos => { this.sentidos = sentidos });
        this.parametroService.getByGrupo(this.gpUnidadVelocidad).then(unidadesVelocidad => { this.unidadesVelocidad = unidadesVelocidad });
        this.parametroService.getByGrupo(this.gpTipoEvidencia).then(tiposEvidencia => { this.tiposEvidencia = tiposEvidencia });

        this.fuenteService.get().then(fuentes => { this.fuentes = fuentes });
    }

    private cargarEvidencia()
    {
        this.evidArrayBytes.push(document.getElementById('evid-array-bytes').innerHTML);
        document.getElementById('evid-array-bytes').innerHTML = "";
    }

    private borrarEvidencia(item)
    {
        let index = this.uploader.queue.indexOf(item);
        this.evidArrayBytes.splice(index, 1);
        this.uploader.queue[index].remove();
    }

    private cargarUbicacionFuente()
    {
        if (this.deteccionForm.fuente != null)
        {
            this.fuenteService.getById(this.deteccionForm.fuente).then(fuente => 
                {
                    this.deteccionForm.latitud = fuente.latitud != null ? parseFloat(fuente.latitud) : null;
                    this.deteccionForm.longitud = fuente.longitud != null ? parseFloat(fuente.longitud) : null;
                    this.deteccionForm.direccion = fuente.referencia_ubicacion;
                }
            );
        }
    }

    private convertPlacaToUpper()
    {
        this.deteccionForm.placa = this.deteccionForm.placa.toUpperCase();
    }

    private insertar() : void
    {
        this.resetErrores();

        // Se valida que la fecha de detección no sea mayor a la fecha actual.
        if (Date.parse(this.deteccionForm.fecha) > new Date().getTime())
        {
            this.errores.push("La fecha de la detección no puede ser mayor a la fecha actual.");
            return;
        }

        // Se valida que se haya indicado la ubicación geográfica de la detección.
        if (this.deteccionForm.latitud == null || this.deteccionForm.longitud == null)
        {
            this.errores.push("Debe indicar en el mapa la ubicación de la detección.");
            return;
        }

        // Se valida que se hayan cargado evidencias asociadas a la detección.
        if (!this.validarEvidencias())
        {
            return;
        }

        // Se valida que se hayan cargado infracciones asociadas a la detección.
        let infraccionesSelected = this.validarInfracciones(this.infracciones);

        if (infraccionesSelected.length == 0)
        {
            this.errores.push("Debe seleccionar al menos una infracción para la detección.");
            return;
        }

        this.isLoading = true;
    	let deteccionString = this.generarDeteccionString(this.deteccionForm, this.evidencias, infraccionesSelected);

        this.deteccionService.insert(deteccionString).then(
            (res) => {
                this.deteccionForm.deteccion = res.deteccion;
                this.auditar(this.deteccionForm, this.evidencias, infraccionesSelected);
                this.isLoading = false;
            
                this.notificationService.success("Operación exitosa", "La detección fue cargada correctamente.");
                this.resetFormulario();
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
                    this.errores.push("Ha ocurrido un error al cargar la detección.");
                }

                this.isLoading = false;
            }
        );
    }

    private validarEvidencias() : boolean
    {
        this.evidencias = [];
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

            this.evidencias.push({
                nombre_archivo : items[item].file.name, 
                tamano_kb : items[item].file.size / 1024,
                tipo_archivo : items[item].file.tipo_archivo,
                extension : items[item].file.extension,
                array_bytes : this.evidArrayBytes[item]
            });
        }

        if (this.evidencias.length == 0)
        {
            this.errores.push("Debe cargar al menos una evidencia para la detección.");
            return false;
        }

        return true;
    }

    private validarInfracciones(infracciones)
    {
        let infraccionesSelected : Array<Object> = [];

        for (let i in infracciones)
        {
            if (infracciones[i]['tiene_infraccion'])
            {
                infraccionesSelected.push({ 
                    infraccion : infracciones[i]['infraccion'], 
                    codigo : infracciones[i]['codigo'], 
                    observacion : infracciones[i]['observacion'] 
                });
            }
        }

        return infraccionesSelected;
    }

    private generarDeteccionString(deteccion, evidencias, infracciones) : string
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
               '&observaciones=' + (deteccion.observaciones != null ? deteccion.observaciones : '') +
               '&modo_carga=' + 1 +
               '&usuario=' + this.userLogin.usuario +
               '&evidencias=' + JSON.stringify(evidencias).replace(/"/g, '\\"') +
               '&infracciones=' + JSON.stringify(infracciones).replace(/"/g, '\\"');
    }

    private auditar(deteccion, evidencias, infracciones) : boolean
    {
        try
        {
            let deteccionAudit = this.generarDeteccionAudit(deteccion, evidencias, infracciones);
            this.auditoriaService.insert(this.opcion.opcion, this.accionAudit, deteccionAudit);

            return true;
        }
        catch(error)
        {
            return false;
        }
    }

    private generarDeteccionAudit(deteccion, evidencias, infracciones) : string
    {
        let array_evidencias = [];

        for (let i in evidencias)
        {
            array_evidencias.push(
                {
                    'nombre_archivo' : evidencias[i]['nombre_archivo'],
                    'tamano_kb' : evidencias[i]['tamano_kb'],
                    'tipo_archivo' : evidencias[i]['tipo_archivo']
                }
            );
        }

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
            modo_carga : 1,
            usuario : this.userLogin.usuario,
            evidencias : JSON.stringify(array_evidencias).replace(/"/g, '\\"'),
            infracciones : JSON.stringify(infracciones).replace(/"/g, '\\"')
        };

        return JSON.stringify(deteccionAudit);
    }

    private resetEvidencias()
    {
        this.evidencias = [];
        this.evidArrayBytes = [];

        this.uploader.clearQueue();
        jQuery('#input-evidencia-add').val(null);
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

        jQuery('#fecha').val("");

        this.getInfracciones();
        this.resetEvidencias();

        this.resetErrores();
    }

    private loading() : boolean
    {
        return this.isLoading;
    }

    mapClicked($event: MouseEvent)
    {
        this.deteccionForm.latitud = $event.coords.lat;
        this.deteccionForm.longitud = $event.coords.lng;
    }

    markerDragEnd($event: MouseEvent)
    {
        this.deteccionForm.latitud = $event.coords.lat;
        this.deteccionForm.longitud = $event.coords.lng;
    }
}