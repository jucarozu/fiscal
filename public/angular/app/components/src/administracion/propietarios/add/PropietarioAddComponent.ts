import { Component, Input, OnInit } from '@angular/core';

import { IPropietario } from "../../../../../interfaces/IPropietario";

import { IPersona } from "../../../../../interfaces/IPersona";
import { IUsuario } from "../../../../../interfaces/IUsuario";
import { IOpcion } from "../../../../../interfaces/IOpcion";

import { PropietarioService } from "../../../../../services/PropietarioService";
import { PersonaService } from "../../../../../services/PersonaService";
import { ParametroService } from "../../../../../services/ParametroService";
import { AuditoriaService } from "../../../../../services/AuditoriaService";

import { NotificationsService } from 'angular2-notifications/components';
import { SimpleNotificationsComponent } from 'angular2-notifications/components';

declare var jQuery : any;
 
@Component({
    selector: 'propietario-add',
    templateUrl: './app/components/src/administracion/propietarios/add/propietario-add.html',
    bindings: [PropietarioService, PersonaService, ParametroService, AuditoriaService, NotificationsService],
    directives: [
        SimpleNotificationsComponent
    ]
})
 
export class PropietarioAddComponent
{
	isLoading: boolean = false;

    accionAudit: number = 2; // Adicionar

    gpTipoDocumento: number = 1;
    gpFuente: number = 14;
    gpTipoPropietario: number = 15;

    userLogin: IUsuario;
    opcion: IOpcion;

    propietarioForm: IPropietario;
    personaForm: IPersona;
    
    errores: Array<Object> = [];

    documentos: Array<Object> = [];
    fuentes: Array<Object> = [];
    tipos_prop: Array<Object> = [];

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

    constructor(private propietarioService: PropietarioService,
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
        jQuery('#add-propietario').on('show.bs.modal', function() {
            jQuery('#btn-reset-add').click();
        });

        jQuery('#add-persona').on('hide.bs.modal', function() {
            jQuery('#btn-load-persona-add').click();
            jQuery('#btn-load-locatario-add').click();
        });
    }

    private cargarCombos()
    {
        this.parametroService.getByGrupo(this.gpTipoDocumento).then(documentos => { this.documentos = documentos });
        this.parametroService.getByGrupo(this.gpFuente).then(fuentes => { this.fuentes = fuentes });
        this.parametroService.getByGrupo(this.gpTipoPropietario).then(tipos_prop => { this.tipos_prop = tipos_prop });
    }

    private convertPlacaToUpper()
    {
        this.propietarioForm.placa = this.propietarioForm.placa.toUpperCase();
    }

    private mostrarLocatario()
    {
        if (this.propietarioForm.tipo == 2)
        {
            document.getElementById('locatario-add').style.display = 'block';
        }
        else
        {
            this.propietarioForm.locatario = null;
            this.propietarioForm.loc_tipo_doc = null;
            this.propietarioForm.loc_numero_doc = "";
            this.propietarioForm.loc_nombres_apellidos = "";

            document.getElementById('locatario-add').style.display = 'none';
        }
    }

    public cargarPersona()
    {
        if (this.propietarioForm.tipo_doc == null)
            return;

        if (this.propietarioForm.numero_doc == "")
            return;

        this.personaService.getByDocumento(this.propietarioForm.tipo_doc, this.propietarioForm.numero_doc)
            .then(persona =>
                {
                    if (persona != null)
                    {
                        this.propietarioForm.persona = persona.persona;
                        this.propietarioForm.nombres_apellidos = persona.nombres_apellidos;
                    }
                }
            );        
    }

    private getPersonaByDocumento() : void
    {
        this.errores = [];

        if (this.propietarioForm.tipo_doc == null)
            return;

        if (this.propietarioForm.numero_doc == "")
            return;

        if (isNaN(Number(this.propietarioForm.numero_doc)))
        {
            this.errores.push("El número de documento debe ser numérico.");
            return;
        }

        this.personaService.getByDocumento(this.propietarioForm.tipo_doc, this.propietarioForm.numero_doc)
            .then(persona =>
                {
                    this.personaForm.tipo_doc = this.propietarioForm.tipo_doc;
                    this.personaForm.numero_doc = this.propietarioForm.numero_doc;
                        
                    if (persona != null)
                    {
                        this.propietarioForm.persona = persona.persona;
                        this.propietarioForm.nombres_apellidos = persona.nombres_apellidos;
                    }
                    else
                    {
                        this.propietarioForm.persona = null;
                        this.propietarioForm.nombres_apellidos = "";

                        localStorage.setItem('input-persona', JSON.stringify(this.personaForm));
                        jQuery('#add-persona').modal({ backdrop: 'static' });
                    }
                }
            );
    }

    public cargarLocatario()
    {
        if (this.propietarioForm.loc_tipo_doc == null)
            return;

        if (this.propietarioForm.loc_numero_doc == "")
            return;

        this.personaService.getByDocumento(this.propietarioForm.loc_tipo_doc, this.propietarioForm.loc_numero_doc)
            .then(persona =>
                {
                    if (persona != null)
                    {
                        this.propietarioForm.locatario = persona.persona;
                        this.propietarioForm.loc_nombres_apellidos = persona.nombres_apellidos;
                    }
                }
            );
    }

    private getLocatarioByDocumento() : void
    {
        this.errores = [];

        if (this.propietarioForm.loc_tipo_doc == null)
            return;

        if (this.propietarioForm.loc_numero_doc == "")
            return;

        if (isNaN(Number(this.propietarioForm.loc_numero_doc)))
        {
            this.errores.push("El número de documento debe ser numérico.");
            return;
        }

        this.personaService.getByDocumento(this.propietarioForm.loc_tipo_doc, this.propietarioForm.loc_numero_doc)
            .then(persona =>
                {
                    this.personaForm.tipo_doc = this.propietarioForm.loc_tipo_doc;
                    this.personaForm.numero_doc = this.propietarioForm.loc_numero_doc;
                        
                    if (persona != null)
                    {
                        this.propietarioForm.locatario = persona.persona;
                        this.propietarioForm.loc_nombres_apellidos = persona.nombres_apellidos;
                    }
                    else
                    {
                        this.propietarioForm.locatario = null;
                        this.propietarioForm.loc_nombres_apellidos = "";

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
        
        if (this.propietarioForm.hasta != null && this.propietarioForm.desde > this.propietarioForm.hasta)
        {
            this.errores.push("La fecha inicial no puede ser mayor a la fecha final.");
            this.isLoading = false;
            return;
        }

    	let propietarioString = this.generarPropietarioString(this.propietarioForm);

        this.propietarioService.insert(propietarioString).then(
            (res) => {
                this.auditar(res.propietario);
                this.isLoading = false;
            
                this.notificationService.success("Operación exitosa", "El propietario fue creado correctamente.");
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
                    this.errores.push("Ha ocurrido un error al crear el propietario.");
                }

                this.isLoading = false;
            }
        );
    }

    private generarPropietarioString(propietario) : string
    {
        return '&placa=' + (propietario.placa != null ? propietario.placa : '') +
               '&persona=' + (propietario.persona != null ? propietario.persona : '') +
               '&fuente=' + (propietario.fuente != null ? propietario.fuente : '') +
               '&tipo=' + (propietario.tipo != null ? propietario.tipo : '') +
               '&locatario=' + (propietario.locatario != null ? propietario.locatario : '') +
               '&desde=' + (propietario.desde != null ? propietario.desde : '') +
               '&hasta=' + (propietario.hasta != null ? propietario.hasta : '') +
               '&usuario=' + this.userLogin.usuario;
    }

    private auditar(propietario) : boolean
    {
        try
        {
            let propietarioAudit = this.generarPropietarioAudit(propietario);
            this.auditoriaService.insert(this.opcion.opcion, this.accionAudit, propietarioAudit);

            return true;
        }
        catch(error)
        {
            return false;
        }
    }

    private generarPropietarioAudit(propietario) : string
    {
        let propietarioAudit = {
            propietario : propietario['propietario'],
            placa : propietario['placa'],
            persona : propietario['persona'],
            fuente : propietario['fuente'],
            tipo : propietario['tipo'],
            locatario : propietario['locatario'],
            desde : propietario['desde'],
            hasta : propietario['hasta'],
            fecha_registra: propietario['fecha_registra'],
            usuario: propietario['usuario']
        };

        return JSON.stringify(propietarioAudit);
    }

    private resetErrores() : void
    {
        this.errores = [];
    }

    private resetFormulario() : void
    {
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
            ' "hasta" : null' +
        '}');

        jQuery('#desde, #hasta').val("");

        this.personaForm = JSON.parse('{' +
            ' "tipo_doc" : null,' +
            ' "numero_doc" : ""' +
        '}');

        document.getElementById('locatario-add').style.display = 'none';

        this.resetErrores();
    }

    private cerrarVentana() : void
    {
        jQuery('#add-propietario').modal('hide');
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