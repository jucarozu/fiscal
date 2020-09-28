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
    selector: 'propietario-edit',
    templateUrl: './app/components/src/administracion/propietarios/edit/propietario-edit.html',
    bindings: [PropietarioService, PersonaService, ParametroService, AuditoriaService, NotificationsService],
    directives: [
        SimpleNotificationsComponent
    ]
})
 
export class PropietarioEditComponent implements OnInit
{
    isLoading: boolean = false;

    accionAudit: number = 3; // Editar

    gpTipoDocumento: number = 1;
    gpFuente: number = 14;
    gpTipoPropietario: number = 15;

    userLogin: IUsuario;
    opcion: IOpcion;

    @Input('propietario') propietarioForm: IPropietario;
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

        this.agregarEventos();
        this.cargarCombos();
    }

    private agregarEventos()
    {
        jQuery('#edit-propietario').on('show.bs.modal', function() {
            jQuery('#btn-reset-edit').click();
        });

        jQuery('#add-persona').on('hide.bs.modal', function() {
            jQuery('#btn-load-persona-edit').click();
            jQuery('#btn-load-locatario-edit').click();
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
            document.getElementById('locatario-edit').style.display = 'block';
        }
        else
        {
            this.propietarioForm.locatario = null;
            this.propietarioForm.loc_tipo_doc = null;
            this.propietarioForm.loc_numero_doc = "";
            this.propietarioForm.loc_nombres_apellidos = "";

            document.getElementById('locatario-edit').style.display = 'none';
        }
    }

    public cargarPersona()
    {
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

    private actualizar()
    {
        this.isLoading = true;
        this.resetErrores();

    	let propietarioString = this.generarPropietarioString(this.propietarioForm);
 
        this.propietarioService.update(propietarioString, this.propietarioForm.propietario).then(
            (res) => {
                this.auditar(res.propietario);
                this.isLoading = false;
                
                this.notificationService.success("Operación exitosa", "El propietario fue modificado correctamente.");
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
                    this.errores.push("Ha ocurrido un error al modificar el propietario.");
                }
            }
        );
    }

    private generarPropietarioString(propietario) : string
    {
        return '&persona=' + (propietario.persona != null ? propietario.persona : '') +
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
            persona : propietario['persona'],
            fuente : propietario['fuente'],
            tipo : propietario['tipo'],
            locatario : propietario['locatario'],
            desde : propietario['desde'],
            hasta : propietario['hasta']
        };

        return JSON.stringify(propietarioAudit);
    }

    private resetFormulario() : void
    {
        this.isLoading = true;

        this.propietarioService.getById(this.propietarioForm.propietario).then(
            propietario => {
                this.propietarioForm = propietario;
                document.getElementById('locatario-edit').style.display = this.propietarioForm.tipo == 2 ? 'block' : 'none';
                
                this.isLoading = false;
            }
        );

        this.personaForm = JSON.parse('{' +
            ' "tipo_doc" : null,' +
            ' "numero_doc" : ""' +
        '}');

        this.resetErrores();
    }

    private resetErrores() : void
    {
        this.errores = [];
    }

    private cerrarVentana() : void
    {
        jQuery('#edit-propietario').modal('hide');
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