import { Component, Input, OnInit } from '@angular/core';

import { IInteres } from "../../../../../interfaces/IInteres";

import { IPersona } from "../../../../../interfaces/IPersona";
import { IUsuario } from "../../../../../interfaces/IUsuario";
import { IOpcion } from "../../../../../interfaces/IOpcion";

import { InteresService } from "../../../../../services/InteresService";
import { PersonaService } from "../../../../../services/PersonaService";
import { ParametroService } from "../../../../../services/ParametroService";
import { AuditoriaService } from "../../../../../services/AuditoriaService";

import { NotificationsService } from 'angular2-notifications/components';
import { SimpleNotificationsComponent } from 'angular2-notifications/components';

declare var jQuery : any;
 
@Component({
    selector: 'interes-add',
    templateUrl: './app/components/src/administracion/intereses/add/interes-add.html',
    bindings: [InteresService, PersonaService, ParametroService, AuditoriaService, NotificationsService],
    directives: [
        SimpleNotificationsComponent
    ]
})

export class InteresAddComponent implements OnInit
{
	isLoading: boolean = false;

    accionAudit: number = 2; // Adicionar

    gpTipoDocumento: number = 1;

    userLogin: IUsuario;
    opcion: IOpcion;

    interesForm: IInteres;
    personaForm: IPersona;
    
    errores: Array<Object> = [];

    documentos: Array<Object> = [];

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

    constructor(private interesService: InteresService,
                private personaService: PersonaService,
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
        jQuery('#add-persona').on('hide.bs.modal', function() {
            jQuery('#btn-load-persona').click();
        });
    }

    private cargarCombos()
    {
        this.parametroService.getByGrupo(this.gpTipoDocumento).then(documentos => { this.documentos = documentos });
    }

    public cargarPersona()
    {
        this.personaService.getByDocumento(this.interesForm.ent_tipo_doc, this.interesForm.ent_numero_doc)
            .then(persona =>
                {
                    if (persona != null)
                    {
                        this.interesForm.entidad = persona.persona;
                        this.interesForm.ent_nombre = persona.nombres_apellidos;
                    }
                }
            );
    }

    private getPersonaByDocumento() : void
    {
        this.errores = [];

        if (this.interesForm.ent_tipo_doc == null)
            return;

        if (this.interesForm.ent_numero_doc == "")
            return;

        if (isNaN(Number(this.interesForm.ent_numero_doc)))
        {
            this.errores.push("El número de documento debe ser numérico.");
            return;
        }

        this.personaService.getByDocumento(this.interesForm.ent_tipo_doc, this.interesForm.ent_numero_doc)
            .then(persona =>
                {
                    this.personaForm.tipo_doc = this.interesForm.ent_tipo_doc;
                    this.personaForm.numero_doc = this.interesForm.ent_numero_doc;

                    if (persona != null)
                    {
                        this.interesForm.entidad = persona.persona;
                        this.interesForm.ent_nombre = persona.nombres_apellidos;
                    }
                    else
                    {
                        this.interesForm.entidad = null;
                        this.interesForm.ent_nombre = "";

                        localStorage.setItem('input-persona', JSON.stringify(this.personaForm));
                        jQuery('#add-persona').modal({ backdrop: 'static' });
                    }
                }
            );
    }

    private insertar() : void
    {
        this.isLoading = true;
        this.resetErrores();

        if (this.interesForm.desde > this.interesForm.hasta)
        {
            this.errores.push("La fecha inicial no puede ser mayor a la fecha final.");
            this.isLoading = false;
            return;
        }

        if (this.interesForm.desde < this.interesForm.fecha_resolucion)
        {
            this.errores.push("La fecha inicial debe ser mayor o igual a la fecha de resolución.");
            this.isLoading = false;
            return;
        }

    	let interesString = this.generarInteresString(this.interesForm);
 
        this.interesService.insert(interesString).then(
            (res) => {
                this.auditar(res.interes);
                this.isLoading = false;
            
                this.notificationService.success("Operación exitosa", "El interés de mora fue creado correctamente.");
                this.resetFormulario();
                this.cerrarVentana();

                this.isLoading = false;
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
                    this.errores.push("Ha ocurrido un error al crear el interés de mora.");
                }

                this.isLoading = false;
            }
        );
    }

    private generarInteresString(interes) : string
    {
        return '&resolucion=' + (interes.resolucion != null ? interes.resolucion : '') +
               '&fecha_resolucion=' + (interes.fecha_resolucion != null ? interes.fecha_resolucion : '') +
               '&entidad=' + (interes.entidad != null ? interes.entidad : '') +
               '&desde=' + (interes.desde != null ? interes.desde : '') +
               '&hasta=' + (interes.hasta != null ? interes.hasta : '') +
               '&tasa=' + (interes.tasa != null ? interes.tasa : '') +
               '&usuario=' + this.userLogin.usuario;
    }

    private auditar(interes) : boolean
    {
        try
        {
            let interesAudit = this.generarInteresAudit(interes);
            this.auditoriaService.insert(this.opcion.opcion, this.accionAudit, interesAudit);

            return true;
        }
        catch(error)
        {
            return false;
        }
    }

    private generarInteresAudit(interes) : string
    {
        let interesAudit = {
            interes: interes['interes'],
            resolucion: interes['resolucion'],
            fecha_resolucion: interes['fecha_resolucion'],
            entidad: interes['entidad'],
            desde: interes['desde'],
            hasta: interes['hasta'],
            tasa: interes['tasa'],
            usuario: interes['usuario'],
            fecha_registra: interes['fecha_registra']
        };

        return JSON.stringify(interesAudit);
    }

    private resetErrores() : void
    {
        this.errores = [];
    }

    private resetFormulario() : void
    {
        this.interesForm = JSON.parse('{' + 
            ' "resolucion" : "",' +
            ' "fecha_resolucion" : "",' +
            ' "entidad" : null,' +
            ' "ent_tipo_doc" : null,' + 
            ' "ent_numero_doc" : "",' + 
            ' "ent_nombre" : "",' +
            ' "desde" : "",' +
            ' "hasta" : "",' +
            ' "tasa" : null' +
        '}');

        jQuery('#desde, #hasta').val("");

        this.personaForm = JSON.parse('{' +
            ' "tipo_doc" : null,' +
            ' "numero_doc" : ""' +
        '}');

        this.resetErrores();
    }

    private cerrarVentana() : void
    {
        jQuery('#add-interes').modal('hide');
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