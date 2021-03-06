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
    selector: 'persona-edit',
    templateUrl: './app/components/src/administracion/personas/edit/persona-edit.html',
    bindings: [PersonaService, DivipoService, ParametroService, AuditoriaService, NotificationsService],
    directives: [SimpleNotificationsComponent]
})
 
export class PersonaEditComponent implements OnInit
{
    isLoading: boolean = false;

    accionAudit: number = 3; // Editar

    gpTipoDocumento: number = 1;
    gpGenero: number = 2;
	gpGrupoSanguineo: number = 3;

    userLogin: IUsuario;
    opcion: IOpcion;

    @Input('persona') personaForm: IPersona;

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

        this.agregarEventos();
        this.cargarCombos();
    }

    private agregarEventos()
    {
        jQuery('#edit-persona').on('show.bs.modal', function() {
            jQuery('#btn-reset').click();
        });
    }

    private cargarCombos()
    {
        this.divipoService.getDepartamentos().then(departamentos => { this.departamentos = departamentos; });

        this.parametroService.getByGrupo(this.gpTipoDocumento).then(documentos => { this.documentos = documentos; });
        this.parametroService.getByGrupo(this.gpGenero).then(generos => { this.generos = generos; });
        this.parametroService.getByGrupo(this.gpGrupoSanguineo).then(gruposSanguineos => { this.gruposSanguineos = gruposSanguineos; });
    }

    private cargarMunicipios(cod_departamento)
    {
        this.isLoading = true;

        if (cod_departamento != null)
        {
            this.divipoService.getMunicipios(cod_departamento).then(
                municipios => { 
                    this.municipios = municipios;
                    this.isLoading = false;
                }
            );
        }            
        else
        {
            this.municipios = null;
            this.isLoading = false;
        }
    }
 
    private actualizar()
    {
        this.isLoading = true;
        this.resetErrores();

    	let personaString = this.generarPersonaString(this.personaForm);
 
        this.personaService.update(personaString, this.personaForm.persona).then(
            (res) => {
                this.auditar(res.persona);
                this.isLoading = false;
                
                this.notificationService.success("Operación exitosa", "La persona fue modificada correctamente.");
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
                    this.errores.push("Ha ocurrido un error al modificar la persona.");
                }
            }
        );
    }

    private generarPersonaString(persona) : string
    {
        return '&persona=' + persona.persona +
        	   '&fecha_exped_doc=' + (persona.fecha_exped_doc != null ? persona.fecha_exped_doc : '') +
        	   '&divipo_doc=' + (persona.cod_municipio_doc != null ? persona.cod_municipio_doc + '000' : '') +
        	   '&nombres=' + (persona.nombres != null ? persona.nombres : '') +
        	   '&apellidos=' + (persona.apellidos != null ? persona.apellidos : '') +
               '&email=' + (persona.email != null ? persona.email : '') +
               '&genero=' + (persona.genero != null ? persona.genero : '') +
               '&grupo_sanguineo=' + (persona.grupo_sanguineo != null ? persona.grupo_sanguineo : '') +
               '&numero_celular=' + (persona.numero_celular != null ? persona.numero_celular : '');
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
            fecha_exped_doc : persona['fecha_exped_doc'], 
            divipo_doc : persona['divipo_doc'], 
            nombres : persona['nombres'], 
            apellidos : persona['apellidos'], 
            email : persona['email'], 
            genero : persona['genero'], 
            grupo_sanguineo : persona['grupo_sanguineo'], 
            numero_celular : persona['numero_celular']
        };

        return JSON.stringify(personaAudit);
    }

    private resetFormulario() : void
    {
        this.personaForm.cod_municipio_doc = null;

        this.personaService.getById(this.personaForm.persona).then(
            persona => {
                this.personaForm = persona;
                this.cargarMunicipios(persona.cod_departamento_doc);
            }
        );
    }

    private resetErrores() : void
    {
        this.errores = [];
    }

    private cerrarVentana() : void
    {
        jQuery('#edit-persona').modal('hide');
    }

    private close() : void
    {
        this.resetErrores();
        this.cerrarVentana();
    }

    private loading() : boolean
    {
        return this.isLoading;
    }
}