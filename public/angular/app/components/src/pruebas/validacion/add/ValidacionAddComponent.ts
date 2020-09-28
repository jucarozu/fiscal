import { Component, Input, OnInit } from '@angular/core';

import { ROUTER_DIRECTIVES, Router, RouteParams } from '@angular/router-deprecated';

import { IDeteccion } from "../../../../../interfaces/IDeteccion";
import { IDeteccionSeguimiento } from "../../../../../interfaces/IDeteccionSeguimiento";
import { IEvidencia } from "../../../../../interfaces/IEvidencia";
import { IInfraccion } from "../../../../../interfaces/IInfraccion";
import { IInfraDeteccion } from "../../../../../interfaces/IInfraDeteccion";
import { IPropietario } from "../../../../../interfaces/IPropietario";
import { IDireccion } from "../../../../../interfaces/IDireccion";
import { IFuente } from "../../../../../interfaces/IFuente";
import { IUsuario } from "../../../../../interfaces/IUsuario";
import { IOpcion } from "../../../../../interfaces/IOpcion";
import { IVariable } from "../../../../../interfaces/IVariable";

import { DeteccionService } from "../../../../../services/DeteccionService";
import { DeteccionSeguimientoService } from "../../../../../services/DeteccionSeguimientoService";
import { EvidenciaService } from "../../../../../services/EvidenciaService";
import { InfraccionService } from "../../../../../services/InfraccionService";
import { InfraDeteccionService } from "../../../../../services/InfraDeteccionService";
import { PropietarioService } from "../../../../../services/PropietarioService";
import { DireccionService } from "../../../../../services/DireccionService";
import { FuenteService } from "../../../../../services/FuenteService";
import { ParametroService } from "../../../../../services/ParametroService";

import { ValidacionConfirmComponent } from "../confirm/ValidacionConfirmComponent";
import { ValidacionDescarteComponent } from "../descarte/ValidacionDescarteComponent";
import { InfraDeteccionAddComponent } from "../../../pruebas/infra-detecciones/add/InfraDeteccionAddComponent";
import { InfraDeteccionDeleteComponent } from "../../../pruebas/infra-detecciones/delete/InfraDeteccionDeleteComponent";

import { NotificationsService } from 'angular2-notifications/components';
import { SimpleNotificationsComponent } from 'angular2-notifications/components';

import { GOOGLE_MAPS_DIRECTIVES, MouseEvent } from 'angular2-google-maps/core';

import { FILE_UPLOAD_DIRECTIVES, FileUploader } from 'ng2-file-upload';

import { TabView, TabPanel } from 'primeng/primeng';

declare var jQuery : any;
 
@Component({
    selector: 'validacion-add',
    templateUrl: './app/components/src/pruebas/validacion/add/validacion-add.html',
    bindings: [
        DeteccionService, DeteccionSeguimientoService, EvidenciaService, InfraccionService, InfraDeteccionService, PropietarioService, DireccionService, 
        FuenteService, ParametroService, NotificationsService
    ],
    directives: [
        ValidacionConfirmComponent,
        ValidacionDescarteComponent,
        InfraDeteccionAddComponent,
        InfraDeteccionDeleteComponent,
        SimpleNotificationsComponent,
        GOOGLE_MAPS_DIRECTIVES,
        FILE_UPLOAD_DIRECTIVES,
        ROUTER_DIRECTIVES,
        TabView, TabPanel
    ]
})

export class ValidacionAddComponent implements OnInit
{
	isLoading: boolean = false;

    gpEstado: number = 16;
    gpTipoVehiculo: number = 17;
    gpServicio: number = 18;
    gpNivel: number = 19;
    gpSentido: number = 20;
    gpUnidadVelocidad: number = 21;
    gpTipoEvidencia: number = 23;
    gpMotivo: number = 33;

    gpTipoDocumento: number = 1;
    gpFuenteProp: number = 14;
    gpTipoPropietario: number = 15;

    userLogin: IUsuario;
    opcion: IOpcion;

    configVariables: Array<IVariable>;
    infraDeteccionValidacion: IVariable;

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
    motivos: Array<Object> = [];
    fuentes: Array<IFuente> = [];
    
    documentos: Array<Object> = [];
    fuentes_prop: Array<Object> = [];
    tipos_prop: Array<Object> = [];

    departamentos: Array<Object> = [];
    municipios: Array<Object> = [];
    poblados: Array<Object> = [];

    evidencias: Array<IEvidencia> = [];
    infraDetecciones: Array<IInfraDeteccion> = [];
    propietarios: Array<IPropietario> = [];

    selectedEvidencia: Object = {};
    selectedInfraDeteccion: Object = {};

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
                private notificationService: NotificationsService) {}

    ngOnInit()
    {
        if (this.userLogin == null)
            this.userLogin = JSON.parse(localStorage.getItem('user_login'));

        if (this.opcion == null)
            this.opcion = JSON.parse(localStorage.getItem('opcion'));

        if (this.configVariables == null)
            this.configVariables = JSON.parse(localStorage.getItem('config_variables'));

        this.infraDeteccionValidacion = this.configVariables.filter(configVariable => configVariable.nombre == "INFRA_DETECCION_VALIDACION")[0];

        this.resetFormulario();
        this.agregarEventos();
        this.cargarCombos();

        this.getDeteccion();
    }

    private agregarEventos()
    {
        // Eventos para refrescar el listado de infracciones al agregar una infracción.
        jQuery('#add-infra-deteccion').on('hide.bs.modal', function() {
            jQuery('#btn-load-infra-detecciones').click();
        });
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
        this.parametroService.getByGrupo(this.gpMotivo).then(motivos => { this.motivos = motivos });
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
                
                this.deteccionForm.deteccion = deteccion.deteccion;
                this.deteccionForm.fecha = deteccion.fecha.split(" ")[0];
                this.deteccionForm.hora = deteccion.fecha.split(" ")[1];
                this.deteccionForm.fuente = deteccion.fuente;
                this.deteccionForm.referencia_disp = deteccion.referencia_disp;
                this.deteccionForm.latitud = deteccion.latitud;
                this.deteccionForm.longitud = deteccion.longitud;
                this.deteccionForm.direccion = deteccion.direccion;
                this.deteccionForm.complemento_direccion = deteccion.complemento_direccion;
                this.deteccionForm.placa = deteccion.placa;
                this.deteccionForm.tipo_vehiculo = deteccion.tipo_vehiculo;
                this.deteccionForm.color = deteccion.color;
                this.deteccionForm.servicio = deteccion.servicio;
                this.deteccionForm.nivel = deteccion.nivel;
                this.deteccionForm.carril = deteccion.carril;
                this.deteccionForm.sentido = deteccion.sentido;
                this.deteccionForm.velocidad = deteccion.velocidad;
                this.deteccionForm.unidad_velocidad = deteccion.unidad_velocidad;
                this.deteccionForm.observaciones = deteccion.observaciones;
                
                this.getSeguimiento();
                this.getPropietarios(deteccion.placa);
                this.getInfraDetecciones();
                this.getEvidencias();

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

    private getPropietarios(placa) : void
    {
        this.isLoading = true;

        this.propietarioService.getByFilters(placa, 0, 0).then(propietarios => 
            {
                this.propietarios = propietarios.filter(propietario => 
                    propietario.hasta != null ? (
                        this.deteccionForm.fecha >= propietario.desde && this.deteccionForm.fecha <= propietario.hasta
                    ) : (
                        this.deteccionForm.fecha >= propietario.desde
                    )
                );
                
                this.propietarioForm = this.propietarios[0];
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
                        deteccion : infraDetecciones[i]['deteccion'], 
                        codigo : infraDetecciones[i]['codigo'], 
                        nombre_corto : infraDetecciones[i]['nombre_corto'], 
                        observacion : infraDetecciones[i]['observacion'], 
                        tiene_infraccion : true,
                        motivo : null
                    });
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

                this.isLoading = false;
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

    private cargarPropietario(event)
    {
        this.propietarioForm = this.propietarios[event.index];
    }

    private getInfraccionesValidadas() : any
    {
        // Se obtienen las infracciones validadas por el agente de tránsito.
        return this.infraDetecciones.filter(infraDeteccion => infraDeteccion.tiene_infraccion == true);
    }

    private getInfraccionesNoValidadas() : any
    {
        // Se obtienen las infracciones no validadas por el agente de tránsito.
        return this.infraDetecciones.filter(infraDeteccion => infraDeteccion.tiene_infraccion == false);
    }

    private procesarValidacion() : void
    {
        this.resetErrores();

        // Se obtiene la cantidad de infracciones validadas por el agente de tránsito.
        if (this.getInfraccionesValidadas().length > 0)
        {
            // Si existe al menos una infracción asociada, se procede a validar la detección.
            jQuery('#confirm-validacion').modal({backdrop: 'static', keyboard: false});
        }
        else
        {
            // Si se rechazaron todas las infracciones asociadas, se procede a descartar la detección.
            jQuery('#descarte-validacion').modal({backdrop: 'static', keyboard: false});
        }
    }

    private resetErrores() : void
    {
        this.errores = [];
    }

    private resetFormulario() : void
    {
        this.deteccionForm = { 
            deteccion : null,
            fecha : "",
            hora : "",
            estado : null,
            estado_desc : "",
            fuente : null, 
            referencia_disp : "", 
            latitud : null,
            longitud : null,
            direccion : "",
            complemento_direccion : "",
            placa : "",
            tipo_vehiculo : null,
            tipo_vehiculo_desc : "",
            color : "",
            servicio : null,
            servicio_desc : "",
            nivel : null,
            nivel_desc : "",
            carril : "",
            sentido : null,
            sentido_desc : "",
            velocidad : null,
            unidad_velocidad : null,
            unidad_velocidad_desc : "",
            observaciones : "",
            modo_carga : null,
            modo_carga_desc : "",
            usuario : null,
            usuario_desc : "",
            fecha_registra : null,
            direccion_ip : null,
            evidencias : null,
            infracciones : null
        };

        this.deteccionSeguimientoForm = {
            seguimiento : null,
            deteccion : null,
            fecha : null,
            usuario : null,
            estado : null,
            observaciones : ""
        };

        this.propietarioForm = {
            propietario : null,
            placa : "",
            persona : null,
            tipo_doc : null,
            tipo_doc_desc : "",
            numero_doc : "",
            nombres : "",
            apellidos : "",
            nombres_apellidos : "",
            fuente : null,
            fuente_desc : "",
            tipo : null,
            tipo_desc : "",
            locatario : null,
            loc_tipo_doc : null,
            loc_tipo_doc_desc : "",
            loc_numero_doc : "",
            loc_nombres : "",
            loc_apellidos : "",
            loc_nombres_apellidos : "",
            desde : null,
            hasta : null,
            fecha_registra : null,
            dias_registro : null,
            usuario : null,
            usuario_desc : "",
            dir_direccion : null,
            dir_divipo : null,
            dir_cod_departamento : null,
            dir_departamento : "",
            dir_cod_municipio : null,
            dir_municipio : "",
            dir_cod_poblado : null,
            dir_poblado : "",
            dir_descripcion : ""
        };

        this.getInfraDetecciones();

        this.resetErrores();
    }

    private loading() : boolean
    {
        return this.isLoading;
    }
}