import { Component, Input, OnInit } from '@angular/core';

import { IAgente } from "../../../../../interfaces/IAgente";

import { IPersona } from "../../../../../interfaces/IPersona";
import { IUsuario } from "../../../../../interfaces/IUsuario";
import { IOpcion } from "../../../../../interfaces/IOpcion";

import { AgenteService } from "../../../../../services/AgenteService";
import { UsuarioService } from "../../../../../services/UsuarioService";
import { ParametroService } from "../../../../../services/ParametroService";
import { AuditoriaService } from "../../../../../services/AuditoriaService";

import { NotificationsService } from 'angular2-notifications/components';
import { SimpleNotificationsComponent } from 'angular2-notifications/components';

import { FILE_UPLOAD_DIRECTIVES, FileUploader } from 'ng2-file-upload';

declare var jQuery : any;

const urlFirma = "http://localhost:8000/fiscalizacion/administracion/agentes/cargarFirma";

@Component({
    selector: 'agente-edit',
    templateUrl: './app/components/src/administracion/agentes/edit/agente-edit.html',
    bindings: [AgenteService, UsuarioService, ParametroService, AuditoriaService, NotificationsService],
    directives: [
        SimpleNotificationsComponent,
        FILE_UPLOAD_DIRECTIVES
    ]
})
 
export class AgenteEditComponent implements OnInit
{
    isLoading: boolean = false;

    accionAudit: number = 3; // Editar

    gpTipoDocumento: number = 1;
    gpEntidad: number = 10;
    gpEstado: number = 11;

    userLogin: IUsuario;
    opcion: IOpcion;

    @Input('agente') agenteForm: IAgente;

    errores: Array<Object> = [];

    departamentos: Array<Object> = [];
    municipios: Array<Object> = [];

    documentos: Array<Object> = [];
    entidades: Array<Object> = [];
    estados: Array<Object> = [];

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

    uploader: FileUploader = new FileUploader({ url: urlFirma });

    constructor(private agenteService: AgenteService,
                private usuarioService: UsuarioService,
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
        jQuery('#edit-agente').on('show.bs.modal', function() {
            jQuery('#btn-reset').click();
        });
    }

    private cargarCombos()
    {
        this.parametroService.getByGrupo(this.gpTipoDocumento).then(documentos => { this.documentos = documentos });
        this.parametroService.getByGrupo(this.gpEntidad).then(entidades => { this.entidades = entidades });
        this.parametroService.getByGrupo(this.gpEstado).then(estados => { this.estados = estados });
    }

    private mostrarFirma()
    {
        this.agenteService.mostrarFirma(this.agenteForm.persona);
    }

    private cargarFirma()
    {
        this.errores = [];

        let imgFirma = jQuery('#img-firma-edit')[0];
        let inputFirma = jQuery('#input-firma-edit')[0];
        
        let file = inputFirma.files[0];
        let reader = new FileReader();

        reader.onload = function() {
            imgFirma.src = reader.result;
        }

        if (file)
        {
            inputFirma.value = null;
            imgFirma.style.display = 'block';
            reader.readAsDataURL(file);
            this.uploader.uploadAll();
        }
        else
        {
            imgFirma.style.display = 'none';
            this.errores.push("Debe seleccionar un archivo para cargar la firma.");
        }
    }
 
    private actualizar()
    {
        this.isLoading = true;

        // Se valida que se haya cargado la firma.
        /*let imgFirma = jQuery('#img-firma-edit')[0];

        if (imgFirma.getAttribute('src') == "")
        {
            this.errores.push("Debe cargar una firma para el agente de tránsito.");
            return;
        }*/

        this.resetErrores();

    	let agenteString = this.generarAgenteString(this.agenteForm);
 
        this.agenteService.update(agenteString, this.agenteForm.agente).then(
            (res) => {
                this.auditar(res.agente);
                this.isLoading = false;
                
                this.notificationService.success("Operación exitosa", "El agente de tránsito fue modificado correctamente.");
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
                    this.errores.push("Ha ocurrido un error al modificar el agente de tránsito.");
                }
            }
        );
    }

    private generarAgenteString(agente) : string
    {
        return '&agente=' + (agente.agente != null ? agente.agente : '') +
               '&entidad=' + (agente.entidad != null ? agente.entidad : '') +
               '&placa=' + (agente.placa != null ? agente.placa : '') +
               '&usuario_registra=' + this.userLogin.usuario;
    }

    private auditar(agente) : boolean
    {
        try
        {
            let agenteAudit = this.generarAgenteAudit(agente);
            this.auditoriaService.insert(this.opcion.opcion, this.accionAudit, agenteAudit);

            return true;
        }
        catch(error)
        {
            return false;
        }
    }

    private generarAgenteAudit(agente) : string
    {
        let agenteAudit = {
            agente : agente['agente'],
            entidad : agente['entidad'],
            placa : agente['placa']
        };

        return JSON.stringify(agenteAudit);
    }

    private resetFormulario() : void
    {
        this.agenteService.getById(this.agenteForm.agente).then(
            agente => {
                this.agenteForm = agente;
            }
        );

        document.getElementById('input-firma-edit').setAttribute('value', null);
        document.getElementById('img-firma-edit').setAttribute('src', "");
        document.getElementById('img-firma-edit').style.display = 'none';

        this.agenteService.borrarFirma();

        this.resetErrores();
    }

    private resetErrores() : void
    {
        this.errores = [];
    }

    private cerrarVentana() : void
    {
        jQuery('#edit-agente').modal('hide');
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