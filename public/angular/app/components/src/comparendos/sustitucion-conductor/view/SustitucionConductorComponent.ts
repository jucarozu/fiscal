import { Component, Input, OnInit } from '@angular/core';
import { Router, ROUTER_DIRECTIVES } from '@angular/router-deprecated';

import { IComparendo } from "../../../../../interfaces/IComparendo";
import { ISustitucionConductor } from "../../../../../interfaces/ISustitucionConductor";
import { IPersona } from "../../../../../interfaces/IPersona";

import { IUsuario } from "../../../../../interfaces/IUsuario";
import { IOpcion } from "../../../../../interfaces/IOpcion";

import { ComparendoService } from "../../../../../services/ComparendoService";
import { PersonaService } from "../../../../../services/PersonaService";
import { DivipoService } from "../../../../../services/DivipoService";
import { ParametroService } from "../../../../../services/ParametroService";
import { GeneralService } from "../../../../../services/GeneralService";
import { AuditoriaService } from "../../../../../services/AuditoriaService";

import { NotificationsService } from 'angular2-notifications/components';
import { SimpleNotificationsComponent } from 'angular2-notifications/components';

import { DataTable, Column } from 'primeng/primeng';

declare var jQuery : any;
 
@Component({
    selector: 'sustitucion-conductor',
    templateUrl: './app/components/src/comparendos/sustitucion-conductor/view/sustitucion-conductor-view.html',
    bindings: [ComparendoService, PersonaService, DivipoService, ParametroService, GeneralService, AuditoriaService, NotificationsService],
    directives: [
        DataTable, Column,
        SimpleNotificationsComponent
    ]
})

export class SustitucionConductorComponent implements OnInit
{
	isLoading: boolean = false;

    accionAudit: number = 5; // Procesar

    gpTipoDocumento: number = 1;
    gpOrganismo: number = 28;
    gpCategoria: number = 44;

    userLogin: IUsuario;
    opcion: IOpcion;

    @Input('comparendo') comparendoForm: IComparendo;
    sustitucionConductorForm: ISustitucionConductor;
    personaForm: IPersona;

    errores: Array<Object> = [];

    documentos: Array<Object> = [];
    organismos: Array<Object> = [];
    categorias: Array<Object> = [];

    departamentos: Array<Object> = [];
    municipios: Array<Object> = [];

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
                private comparendoService: ComparendoService,
                private personaService: PersonaService,
                private divipoService: DivipoService,
    			private parametroService: ParametroService,
                private generalService: GeneralService,
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
    }

    private agregarEventos()
    {
        /*jQuery('#detalle-envios').on('show.bs.modal', function() {
            jQuery('#btn-get-detalles').click();
        });*/

        jQuery('#add-persona').on('hide.bs.modal', function() {
            jQuery('#btn-load-persona').click();
        });
    }

    private cargarCombos()
    {
        this.divipoService.getDepartamentos().then(departamentos => { this.departamentos = departamentos; });

        this.parametroService.getByGrupo(this.gpTipoDocumento).then(documentos => { this.documentos = documentos });
        this.parametroService.getByGrupo(this.gpOrganismo).then(organismos => { this.organismos = organismos });
        this.parametroService.getByGrupo(this.gpCategoria).then(categorias => { this.categorias = categorias });
    }

    public cargarPersona()
    {
        this.personaService.getByDocumento(this.sustitucionConductorForm.infr_tipo_doc, this.sustitucionConductorForm.infr_numero_doc)
            .then(persona =>
                {
                    if (persona != null)
                    {
                        this.sustitucionConductorForm.infractor = persona.persona;
                        this.sustitucionConductorForm.infr_nombres = persona.nombres;
                        this.sustitucionConductorForm.infr_apellidos = persona.apellidos;
                    }
                }
            );
    }

    private getPersonaByDocumento() : void
    {
        this.errores = [];

        if (this.sustitucionConductorForm.infr_tipo_doc == null)
            return;

        if (this.sustitucionConductorForm.infr_numero_doc == "")
            return;

        if (isNaN(Number(this.sustitucionConductorForm.infr_numero_doc)))
        {
            this.errores.push("El número de documento debe ser numérico.");
            return;
        }

        this.personaService.getByDocumento(this.sustitucionConductorForm.infr_tipo_doc, this.sustitucionConductorForm.infr_numero_doc)
            .then(persona =>
                {
                    this.personaForm.tipo_doc = this.sustitucionConductorForm.infr_tipo_doc;
                    this.personaForm.numero_doc = this.sustitucionConductorForm.infr_numero_doc;
                        
                    if (persona != null)
                    {
                        this.sustitucionConductorForm.infractor = persona.persona;
                        this.sustitucionConductorForm.infr_nombres = persona.nombres;
                        this.sustitucionConductorForm.infr_apellidos = persona.apellidos;
                    }
                    else
                    {
                        this.sustitucionConductorForm.infractor = null;
                        this.sustitucionConductorForm.infr_nombres = "";
                        this.sustitucionConductorForm.infr_apellidos = "";

                        localStorage.setItem('input-persona', JSON.stringify(this.personaForm));
                        jQuery('#add-persona').modal({ backdrop: 'static' });
                    }
                }
            );
    }

    private cargarMunicipios(cod_departamento)
    {
        this.municipios = null;
        this.sustitucionConductorForm.contacto_municipio = null;

        if (cod_departamento != null)
        {
            this.divipoService.getMunicipios(cod_departamento)
                .then(municipios => { 
                    this.municipios = municipios;
                }
            );
        }
    }

    private procesar() : void
    {
        this.isLoading = true;

        let sustitucionConductorString = this.generarSustitucionConductorString(this.comparendoForm, this.sustitucionConductorForm);

        this.comparendoService.sustituirConductor(sustitucionConductorString).then(
            (res) => {
                this.auditar(this.comparendoForm, this.sustitucionConductorForm);
                this.isLoading = false;

                this.notificationService.success("Operación exitosa", "La sustitución de conductor ha sido realizada con éxito.");
                this.close();                
            },
            (error) => {
                this.notificationService.error("Error", JSON.parse(error._body).mensaje);
                this.isLoading = false;
            }
        );
    }

    private generarSustitucionConductorString(comparendo, sustitucionConductor) : string
    {
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
    }

    private auditar(comparendo, sustitucionConductor) : boolean
    {
        try
        {
            let sustitucionAudit = this.generarSustitucionAudit(comparendo, sustitucionConductor);
            this.auditoriaService.insert(this.opcion.opcion, this.accionAudit, sustitucionAudit);

            return true;
        }
        catch(error)
        {
            return false;
        }
    }

    private generarSustitucionAudit(comparendo, sustitucionConductor) : string
    {
        let sustitucionAudit = {
            comparendo : comparendo.comparendo,
            deteccion : comparendo.deteccion,
            numero_resolucion : sustitucionConductor.numero_resolucion,
            fecha_resolucion : sustitucionConductor.fecha_resolucion,
            infractor : sustitucionConductor.infractor,
            dir_divipo_infractor : sustitucionConductor.contacto_municipio,
            dir_descripcion_infractor : sustitucionConductor.contacto_direccion,
            telefono_infractor : sustitucionConductor.contacto_telefono,
            email_infractor : sustitucionConductor.contacto_email,
            edad_infractor : sustitucionConductor.infr_edad,
            lcond_numero : sustitucionConductor.lic_numero,
            lcond_categoria : sustitucionConductor.lic_categoria,
            lcond_expedicion : sustitucionConductor.lic_expedicion,
            lcond_vencimiento : sustitucionConductor.lic_vencimiento,
            lcond_organismo : sustitucionConductor.lic_organismo,
            agente : comparendo.agente,
            infraccion : comparendo.infraccion,
            fecha_deteccion : comparendo.fecha_deteccion,
            fecha_imposicion : comparendo.fecha_imposicion,
            divipo : comparendo.divipo,
            direccion : comparendo.direccion,
            longitud : comparendo.longitud,
            latitud : comparendo.latitud,
            placa_vehiculo : comparendo.placa_vehiculo,
            clase_vehiculo : comparendo.clase_vehiculo,
            servicio_vehiculo : comparendo.servicio_vehiculo,
            organismo_vehiculo : comparendo.organismo_vehiculo,
            licencia_vehiculo : comparendo.licencia_vehiculo,
            propietario_vehiculo : comparendo.propietario_vehiculo,
            polca : comparendo.polca,
            estado : 5,
            etapa_proceso : 5,
            inmovilizado : comparendo.inmovilizado,
            observaciones : sustitucionConductor.observaciones,
            nit_empresa_tte : comparendo.nit_empresa_tte,
            nombre_empresa : comparendo.nombre_empresa,
            tarjeta_operacion : comparendo.tarjeta_operacion,
            modalidad : comparendo.modalidad,
            radio_accion : comparendo.radio_accion,
            tipo_pasajero : comparendo.tipo_pasajero,
            usuario : this.userLogin.usuario,
            infractor_presente : (sustitucionConductor.infractor_presente ? 1 : 0)
        };

        return JSON.stringify(sustitucionAudit);
    }

    private resetFormulario()
    {
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
    }

    private resetErrores() : void
    {
        this.errores = [];
    }

    private cerrarVentana() : void
    {
        jQuery('#conductor-sustitucion').modal('hide');
    }

    private close() : void
    {
        this.resetFormulario();
        this.cerrarVentana();
    }

    private loading() : boolean
    {
        return this.isLoading;
    }
}