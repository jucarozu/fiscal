import { Component, Input, OnInit } from '@angular/core';

import { IDireccion } from "../../../../../interfaces/IDireccion";

import { IPersona } from "../../../../../interfaces/IPersona";
import { IUsuario } from "../../../../../interfaces/IUsuario";
import { IOpcion } from "../../../../../interfaces/IOpcion";

import { DireccionService } from "../../../../../services/DireccionService";
import { PersonaService } from "../../../../../services/PersonaService";
import { DivipoService } from "../../../../../services/DivipoService";
import { ParametroService } from "../../../../../services/ParametroService";
import { AuditoriaService } from "../../../../../services/AuditoriaService";

import { NotificationsService } from 'angular2-notifications/components';
import { SimpleNotificationsComponent } from 'angular2-notifications/components';

declare var jQuery : any;
 
@Component({
    selector: 'direccion-add',
    templateUrl: './app/components/src/administracion/direcciones/add/direccion-add.html',
    bindings: [DireccionService, PersonaService, DivipoService, ParametroService, AuditoriaService, NotificationsService],
    directives: [
        SimpleNotificationsComponent
    ]
})
 
export class DireccionAddComponent
{
	isLoading: boolean = false;

    accionAudit: number = 2; // Adicionar

    gpTipoDocumento: number = 1;
    gpFuente: number = 13;

    userLogin: IUsuario;
    opcion: IOpcion;

    @Input('persona') personaForm: IPersona;
    direccionForm: IDireccion;
    
    errores: Array<Object> = [];

    departamentos: Array<Object> = [];
    municipios: Array<Object> = [];
    poblados: Array<Object> = [];

    documentos: Array<Object> = [];
    fuentes: Array<Object> = [];

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

    constructor(private direccionService: DireccionService,
                private personaService: PersonaService,
                private divipoService: DivipoService,
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
    }

    private agregarEventos()
    {
        jQuery('#add-direccion').on('show.bs.modal', function() {
            jQuery('#btn-reset').click();
        });

        jQuery('#add-persona').on('hide.bs.modal', function() {
            jQuery('#btn-load-persona').click();
        });
    }

    private cargarCombos()
    {
        this.divipoService.getDepartamentos().then(departamentos => { this.departamentos = departamentos; });

        this.parametroService.getByGrupo(this.gpTipoDocumento).then(documentos => { this.documentos = documentos });
        this.parametroService.getByGrupo(this.gpFuente).then(fuentes => { this.fuentes = fuentes });
    }

    public cargarPersona()
    {
        this.personaService.getByDocumento(this.direccionForm.tipo_doc, this.direccionForm.numero_doc)
            .then(persona =>
                {
                    if (persona != null)
                    {
                        this.direccionForm.persona = persona.persona;
                        this.direccionForm.nombres_apellidos = persona.nombres_apellidos;
                    }
                }
            );
    }

    private getPersonaByDocumento() : void
    {
        this.errores = [];

        if (this.direccionForm.tipo_doc == null)
            return;

        if (this.direccionForm.numero_doc == "")
            return;

        if (isNaN(Number(this.direccionForm.numero_doc)))
        {
            this.errores.push("El número de documento debe ser numérico.");
            return;
        }

        this.personaService.getByDocumento(this.direccionForm.tipo_doc, this.direccionForm.numero_doc)
            .then(persona =>
                {
                    this.personaForm.tipo_doc = this.direccionForm.tipo_doc;
                    this.personaForm.numero_doc = this.direccionForm.numero_doc;
                        
                    if (persona != null)
                    {
                        this.direccionForm.persona = persona.persona;
                        this.direccionForm.nombres_apellidos = persona.nombres_apellidos;
                    }
                    else
                    {
                        this.direccionForm.persona = null;
                        this.direccionForm.nombres_apellidos = "";

                        localStorage.setItem('input-persona', JSON.stringify(this.personaForm));
                        jQuery('#add-persona').modal({ backdrop: 'static' });
                    }
                }
            );
    }

    private cargarMunicipios(cod_departamento)
    {
        this.municipios = null;
        this.direccionForm.cod_municipio = null;

        this.poblados = null;
        this.direccionForm.cod_poblado = null;

        if (cod_departamento != null)
        {
            this.divipoService.getMunicipios(cod_departamento)
                .then(municipios => { 
                    this.municipios = municipios;
                }
            );
        }
    }

    private cargarPoblados(cod_municipio)
    {
        this.poblados = null;        
        this.direccionForm.cod_poblado = null;

        if (cod_municipio != null)
        {
            this.divipoService.getPoblados(cod_municipio)
                .then(poblados => { 
                    this.poblados = poblados;
                    this.direccionForm.cod_poblado = 0;
                }
            );
        }
    }

    private insertar() : void
    {
        this.isLoading = true;
        this.resetErrores();

    	let direccionString = this.generarDireccionString(this.direccionForm);
 
        this.direccionService.insert(direccionString).then(
            (res) => {
                this.auditar(res.direccion);
                this.isLoading = false;

                jQuery('#nueva-direccion').val(res.direccion.direccion);
            
                this.notificationService.success("Operación exitosa", "La dirección fue creada correctamente.");
                this.resetFormulario();
                this.cerrarVentana();
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
                    this.errores.push("Ha ocurrido un error al crear la dirección.");
                }

                this.isLoading = false;
            }
        );
    }

    private generarDireccionString(direccion) : string
    {
        let pad = '000';
        let cod_poblado = pad.substring(0, pad.length - direccion.cod_poblado.toString().length) + direccion.cod_poblado.toString();

        return '&persona=' + (direccion.persona != null ? direccion.persona : '') +
               '&fuente=' + (direccion.fuente != null ? direccion.fuente : '') +
               '&observaciones=' + (direccion.observaciones != null ? direccion.observaciones : '') +
               '&divipo=' + (direccion.cod_municipio + cod_poblado) +
               '&descripcion=' + (direccion.descripcion != null ? direccion.descripcion : '') +
               '&usuario=' + this.userLogin.usuario;
    }

    private auditar(direccion) : boolean
    {
        try
        {
            let direccionAudit = this.generarDireccionAudit(direccion);
            this.auditoriaService.insert(this.opcion.opcion, this.accionAudit, direccionAudit);

            return true;
        }
        catch(error)
        {
            return false;
        }
    }

    private generarDireccionAudit(direccion) : string
    {
        let direccionAudit = {
            direccion : direccion['direccion'],
            persona : direccion['persona'],
            fuente : direccion['fuente'],
            observaciones : direccion['observaciones'],
            divipo : direccion['divipo'],
            descripcion : direccion['descripcion'],
            fecha_registra: direccion['fecha_registra'],
            usuario: direccion['usuario']
        };

        return JSON.stringify(direccionAudit);
    }

    private resetErrores() : void
    {
        this.errores = [];
    }

    private resetFormulario() : void
    {
        if (this.personaForm == null)
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
        }

        this.direccionForm = {
            direccion: null,
            persona: (this.personaForm != null ? this.personaForm.persona : null), 
            tipo_doc: (this.personaForm != null ? this.personaForm.tipo_doc : null),
            tipo_doc_desc: null,
            numero_doc: (this.personaForm != null ? this.personaForm.numero_doc : ""),
            nombres: "",
            apellidos: "",
            nombres_apellidos: (this.personaForm != null ? this.personaForm.nombres_apellidos : ""),
            fuente: null,
            fuente_desc: "",
            observaciones: "",
            divipo: null, 
            cod_departamento: null,
            departamento: "",
            cod_municipio: null,
            municipio: "",
            cod_poblado: null,
            poblado: null,
            descripcion: "",
            fecha_registra: "",
            usuario: null,
            usuario_desc: "",
            is_selected: null
        };

        this.resetErrores();
    }

    private cerrarVentana() : void
    {
        jQuery('#add-direccion').modal('hide');
    }

    private close() : void
    {
        this.resetErrores();
        this.resetFormulario();
        this.cerrarVentana();
    }

    private loading() : boolean
    {
        return this.isLoading;
    }
}