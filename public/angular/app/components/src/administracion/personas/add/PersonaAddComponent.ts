import { Component, Input, OnInit } from '@angular/core';

import { IPersona } from "../../../../../interfaces/IPersona";

import { IUsuario } from "../../../../../interfaces/IUsuario";
import { IOpcion } from "../../../../../interfaces/IOpcion";

import { PersonaService } from "../../../../../services/PersonaService";
import { DivipoService } from "../../../../../services/DivipoService";
import { ParametroService } from "../../../../../services/ParametroService";
import { AuditoriaService } from "../../../../../services/AuditoriaService";

import { NotificationsService } from 'angular2-notifications/components';
import { SimpleNotificationsComponent } from 'angular2-notifications/components';

declare var jQuery : any;
 
@Component({
    selector: 'persona-add',
    templateUrl: './app/components/src/administracion/personas/add/persona-add.html',
    bindings: [PersonaService, DivipoService, ParametroService, AuditoriaService, NotificationsService],
    directives: [SimpleNotificationsComponent]
})
 
export class PersonaAddComponent
{
	isLoading: boolean = false;

    accionAudit: number = 2; // Adicionar

    gpTipoDocumento: number = 1;
    gpGenero: number = 2;
	gpGrupoSanguineo: number = 3;

    userLogin: IUsuario;
    opcion: IOpcion;

    personaForm: IPersona;
    inputForm: IPersona;
    
    errores: Array<Object> = [];

    departamentos: Array<Object> = [];
    municipios: Array<Object> = [];

    documentos: Array<Object> = [];
    generos: Array<Object> = [];
    gruposSanguineos: Array<Object> = [];

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

    constructor(private personaService: PersonaService, 
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
        jQuery('#add-persona').on('show.bs.modal', function() {
            jQuery('#btn-load-input').click();
        });
    }

    private cargarCombos()
    {
        this.divipoService.getDepartamentos().then(departamentos => { this.departamentos = departamentos; });

        this.parametroService.getByGrupo(this.gpTipoDocumento).then(documentos => { this.documentos = documentos; });
        this.parametroService.getByGrupo(this.gpGenero).then(generos => { this.generos = generos; });
        this.parametroService.getByGrupo(this.gpGrupoSanguineo).then(gruposSanguineos => { this.gruposSanguineos = gruposSanguineos; });
    }

    private cargarInput()
    {
        if (localStorage.getItem('input-persona') != null)
        {
            this.inputForm = JSON.parse(localStorage.getItem('input-persona'));
            localStorage.removeItem('input-persona');

            this.personaForm.tipo_doc = this.inputForm.tipo_doc;
            this.personaForm.numero_doc = this.inputForm.numero_doc;
        }
    }

    private cargarMunicipios(cod_departamento)
    {
        if (cod_departamento != null)
        {
            this.divipoService.getMunicipios(cod_departamento).then(municipios => { this.municipios = municipios; });
        }
        else
        {
            this.municipios = null;
        }
    }

    private insertar() : void
    {
        this.isLoading = true;
        this.resetErrores();

    	let personaString = this.generarPersonaString(this.personaForm);
 
        this.personaService.insert(personaString).then(
            (res) => {
                this.auditar(res.persona);
                this.isLoading = false;
                
                this.notificationService.success("Operación exitosa", "La persona fue creada correctamente.");
                this.resetFormulario();
                this.cerrarVentana();
            },
            (error) => {
                this.isLoading = false;
                
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
                    this.errores.push("Ha ocurrido un error al crear la persona.");
                }
            }
        );
    }

    private generarPersonaString(persona) : string
    {
        return '&tipo_doc=' + (persona.tipo_doc != null ? persona.tipo_doc : '') +
        	   '&numero_doc=' + (persona.numero_doc != null ? persona.numero_doc : '') +
        	   '&fecha_exped_doc=' + (persona.fecha_exped_doc != null ? persona.fecha_exped_doc : '') +
        	   '&divipo_doc=' + (persona.cod_municipio_doc != null ? persona.cod_municipio_doc + '000' : '') +
        	   '&nombres=' + (persona.nombres != null ? persona.nombres : '') +
        	   '&apellidos=' + (persona.apellidos != null ? persona.apellidos : '') +
               '&email=' + (persona.email != null ? persona.email : '') +
               '&genero=' + (persona.genero != null ? persona.genero : '') +
               '&grupo_sanguineo=' + (persona.grupo_sanguineo != null ? persona.grupo_sanguineo : '') +
               '&numero_celular=' + (persona.numero_celular != null ? persona.numero_celular : '') +
               '&usuario_registra=' + this.userLogin.usuario;
    }

    private auditar(persona) : boolean
    {
        try
        {
            let personaAudit = this.generarPersonaAudit(persona);
            this.auditoriaService.insert(this.opcion.opcion, this.accionAudit, personaAudit);

            return true;
        }
        catch(error)
        {
            return false;
        }
    }

    private generarPersonaAudit(persona) : string
    {
        let personaAudit = {
            persona : persona['persona'],
            tipo_doc : persona['tipo_doc'],
            numero_doc : persona['numero_doc'],
            fecha_exped_doc : persona['fecha_exped_doc'], 
            divipo_doc : persona['divipo_doc'], 
            nombres : persona['nombres'], 
            apellidos : persona['apellidos'], 
            email : persona['email'], 
            genero : persona['genero'], 
            grupo_sanguineo : persona['grupo_sanguineo'], 
            numero_celular : persona['numero_celular'],
            usuario_registra: persona['usuario_registra']
        };

        return JSON.stringify(personaAudit);
    }

    private resetErrores() : void
    {
        this.errores = [];
    }

    private resetFormulario() : void
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

        jQuery('#fecha_exped_doc').val("");

        this.municipios = null;
    }

    private cerrarVentana() : void
    {
        jQuery('#add-persona').modal('hide');
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