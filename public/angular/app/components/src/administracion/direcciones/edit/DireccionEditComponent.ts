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
    selector: 'direccion-edit',
    templateUrl: './app/components/src/administracion/direcciones/edit/direccion-edit.html',
    bindings: [DireccionService, PersonaService, DivipoService, ParametroService, AuditoriaService, NotificationsService],
    directives: [
        SimpleNotificationsComponent
    ]
})
 
export class DireccionEditComponent implements OnInit
{
    isLoading: boolean = false;

    accionAudit: number = 3; // Editar

    gpTipoDocumento: number = 1;
    gpFuente: number = 13;

    userLogin: IUsuario;
    opcion: IOpcion;

    @Input('direccion') direccionForm: IDireccion;

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

        this.agregarEventos();
        this.cargarCombos();
    }

    private agregarEventos()
    {
        jQuery('#edit-direccion').on('show.bs.modal', function() {
            jQuery('#btn-reset').click();
        });
    }

    private cargarCombos()
    {
        this.divipoService.getDepartamentos().then(departamentos => { this.departamentos = departamentos; });

        this.parametroService.getByGrupo(this.gpTipoDocumento).then(documentos => { this.documentos = documentos });
        this.parametroService.getByGrupo(this.gpFuente).then(fuentes => { this.fuentes = fuentes });
    }

    private cargarMunicipios(cod_departamento)
    {
        if (cod_departamento != null)
        {
            this.divipoService.getMunicipios(cod_departamento)
                .then(municipios => { 
                    this.municipios = municipios;
                }
            );
        }
        else
        {
            this.municipios = null;
            this.direccionForm.cod_municipio = null;

            this.poblados = null;
            this.direccionForm.cod_poblado = null;
        }
    }

    private cargarPoblados(cod_municipio)
    {
        if (cod_municipio != null)
        {
            this.divipoService.getPoblados(cod_municipio)
                .then(poblados => { 
                    this.poblados = poblados;                    
                    this.direccionForm.cod_poblado = 0;
                }
            );
        }
        else
        {
            this.poblados = null;
            this.direccionForm.cod_poblado = null;
        }
    }
 
    private actualizar()
    {
        this.isLoading = true;
        this.resetErrores();

    	let direccionString = this.generarDireccionString(this.direccionForm);
 
        this.direccionService.update(direccionString, this.direccionForm.direccion).then(
            (res) => {
                this.auditar(res.direccion);
                this.isLoading = false;
                
                this.notificationService.success("Operación exitosa", "La dirección fue modificada correctamente.");
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
                    this.errores.push("Ha ocurrido un error al modificar la dirección.");
                }
            }
        );
    }

    private generarDireccionString(direccion) : string
    {
        let pad = '000';
        let cod_poblado = pad.substring(0, pad.length - direccion.cod_poblado.toString().length) + direccion.cod_poblado.toString();

        return '&direccion=' + (direccion.direccion != null ? direccion.direccion : '') +
               '&fuente=' + (direccion.fuente != null ? direccion.fuente : '') +
               '&observaciones=' + (direccion.observaciones != null ? direccion.observaciones : '') +
               '&divipo=' + (direccion.cod_municipio + cod_poblado) +
               '&descripcion=' + (direccion.descripcion != null ? direccion.descripcion : '');
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
            fuente : direccion['fuente'],
            observaciones : direccion['observaciones'],
            divipo : direccion['divipo'],
            descripcion : direccion['descripcion']
        };

        return JSON.stringify(direccionAudit);
    }

    private resetFormulario() : void
    {
        this.isLoading = true;

        this.direccionForm.cod_municipio = null;
        this.direccionForm.cod_poblado = null;

        this.direccionService.getById(this.direccionForm.direccion).then(
            direccion => {
                this.direccionForm = direccion;
                this.cargarMunicipios(direccion.cod_departamento);
                this.cargarPoblados(direccion.cod_municipio);

                this.isLoading = false;
            }
        );

        this.resetErrores();
    }

    private resetErrores() : void
    {
        this.errores = [];
    }

    private cerrarVentana() : void
    {
        jQuery('#edit-direccion').modal('hide');
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