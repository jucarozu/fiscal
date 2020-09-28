import { Component, Input, OnInit } from '@angular/core';

import { IAgente } from "../../../../../interfaces/IAgente";

import { IPersona } from "../../../../../interfaces/IPersona";
import { IUsuario } from "../../../../../interfaces/IUsuario";
import { IOpcion } from "../../../../../interfaces/IOpcion";

import { AgenteService } from "../../../../../services/AgenteService";
import { UsuarioService } from "../../../../../services/UsuarioService";
import { PersonaService } from "../../../../../services/PersonaService";
import { ParametroService } from "../../../../../services/ParametroService";
import { AuditoriaService } from "../../../../../services/AuditoriaService";

import { NotificationsService } from 'angular2-notifications/components';
import { SimpleNotificationsComponent } from 'angular2-notifications/components';

import { FILE_UPLOAD_DIRECTIVES, FileUploader } from 'ng2-file-upload';

declare var jQuery : any;

const urlFirma = "http://localhost:8000/fiscalizacion/administracion/agentes/cargarFirma";
 
@Component({
    selector: 'agente-add',
    templateUrl: './app/components/src/administracion/agentes/add/agente-add.html',
    bindings: [AgenteService, UsuarioService, PersonaService, ParametroService, AuditoriaService, NotificationsService],
    directives: [
        SimpleNotificationsComponent, 
        FILE_UPLOAD_DIRECTIVES
    ]
})
 
export class AgenteAddComponent
{
	isLoading: boolean = false;

    accionAudit: number = 2; // Adicionar

    gpTipoDocumento: number = 1;
    gpEntidad: number = 10;
    gpEstado: number = 11;

    userLogin: IUsuario;
    opcion: IOpcion;

    agenteForm: IAgente;
    usuarioForm: IUsuario;
    personaForm: IPersona;

    isUpdateUsuario: boolean = false;
    
    errores: Array<Object> = [];

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
        this.parametroService.getByGrupo(this.gpEntidad).then(entidades => { this.entidades = entidades });
        this.parametroService.getByGrupo(this.gpEstado).then(estados => { this.estados = estados });
    }

    private cargarFirma()
    {
        this.errores = [];

        let imgFirma = jQuery('#img-firma-add')[0];
        let inputFirma = jQuery('#input-firma-add')[0];

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

    public cargarPersona()
    {
        this.personaService.getByDocumento(this.agenteForm.tipo_doc, this.agenteForm.numero_doc)
            .then(persona =>
                {
                    if (persona != null)
                    {
                        this.agenteForm.persona = persona.persona;
                        this.agenteForm.nombres_apellidos = persona.nombres_apellidos;
                        this.agenteForm.login = this.agenteForm.numero_doc.toString();

                        this.getUsuarioByPersona(persona.persona);
                    }
                }
            );
    }

    private getPersonaByDocumento() : void
    {
        this.errores = [];

        if (this.agenteForm.tipo_doc == null)
            return;

        if (this.agenteForm.numero_doc == "")
            return;

        if (isNaN(Number(this.agenteForm.numero_doc)))
        {
            this.errores.push("El número de documento debe ser numérico.");
            return;
        }

        this.personaService.getByDocumento(this.agenteForm.tipo_doc, this.agenteForm.numero_doc)
            .then(persona =>
                {
                    this.personaForm.tipo_doc = this.agenteForm.tipo_doc;
                    this.personaForm.numero_doc = this.agenteForm.numero_doc;
                        
                    if (persona != null)
                    {
                        this.agenteForm.persona = persona.persona;
                        this.agenteForm.nombres_apellidos = persona.nombres_apellidos;
                        this.agenteForm.login = this.agenteForm.numero_doc.toString();

                        this.getUsuarioByPersona(persona.persona);
                    }
                    else
                    {
                        this.agenteForm.persona = null;
                        this.agenteForm.nombres_apellidos = "";
                        this.agenteForm.login = "";

                        this.agenteForm.entidad = null;
                        this.agenteForm.placa = "";
                        this.agenteForm.email = "";

                        localStorage.setItem('input-persona', JSON.stringify(this.personaForm));
                        jQuery('#add-persona').modal({ backdrop: 'static' });
                    }
                }
            );
    }

    private getUsuarioByPersona(persona) : void
    {
        this.usuarioService.getByPersona(persona)
            .then(usuario =>
                {
                    if (usuario != null)
                    {
                        this.agenteForm.email = usuario.email;
                        this.isUpdateUsuario = true;
                    }
                    else
                    {
                        this.agenteForm.email = "";
                        this.isUpdateUsuario = false;
                    }
                }
            );
    }

    private insertar() : void
    {
        this.resetErrores();

        // Se valida que se haya cargado la firma.
        let imgFirma = jQuery('#img-firma-add')[0];

        if (imgFirma.getAttribute('src') == "")
        {
            this.errores.push("Debe cargar una firma para el agente de tránsito.");
            return;
        }

        this.isLoading = true;

    	let agenteString = this.generarAgenteString(this.agenteForm);
 
        this.agenteService.insert(agenteString).then(
            (res) => {
                console.log(res);

                if (!this.isUpdateUsuario)
                {
                    if (!this.procesarUsuario())
                    {
                        this.errores.push("Ha ocurrido un error al crear el usuario del agente de tránsito.");
                        this.isLoading = false;
                        return;
                    }
                }
                
                this.auditar(res.agente);
                this.isLoading = false;
            
                this.notificationService.success("Operación exitosa", "El agente de tránsito fue creado correctamente.");
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
                    this.errores.push("Ha ocurrido un error al crear el agente de tránsito.");
                }

                this.isLoading = false;
            }
        );
    }

    private procesarUsuario() : boolean
    {
        try
        {
            this.usuarioForm.persona = this.agenteForm.persona;
            this.usuarioForm.login = this.agenteForm.login;
            this.usuarioForm.cargo = 1;
            this.usuarioForm.email = this.agenteForm.email;

            let roles: Array<Object> = [];
            roles.push({ rol : 25, tiene_rol : true });

            let usuarioString = this.generarUsuarioString(this.usuarioForm, roles);

            // Insertar usuario
            this.usuarioService.insert(usuarioString);

            return true;
        }
        catch(error)
        {
            return false;
        }
    }

    private generarAgenteString(agente) : string
    {
        return '&persona=' + (agente.persona != null ? agente.persona : '') +
               '&entidad=' + (agente.entidad != null ? agente.entidad : '') +
               '&placa=' + (agente.placa != null ? agente.placa : '') +
               '&usuario_registra=' + this.userLogin.usuario;
    }

    private generarUsuarioString(usuario, roles) : string
    {
        return '&persona=' + usuario.persona +
               '&login=' + (usuario.login != null ? usuario.login : '') +
               '&cargo=' + (usuario.cargo != null ? usuario.cargo : '') +
               '&email=' + (usuario.email != null ? usuario.email : '') +
               '&roles=' + JSON.stringify(roles).replace(/"/g, '\\"') +
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
            persona : agente['persona'],
            entidad : agente['entidad'],
            placa : agente['placa'],
            fecha_registra: agente['fecha_registra'],
            usuario_registra: agente['usuario_registra']
        };

        return JSON.stringify(agenteAudit);
    }

    private resetErrores() : void
    {
        this.errores = [];
    }

    private resetFormulario() : void
    {
        this.agenteForm = JSON.parse('{' + 
            ' "persona" : null,' + 
            ' "tipo_doc" : null,' + 
            ' "numero_doc" : "",' + 
            ' "nombres_apellidos" : "",' + 
            ' "entidad" : null,' + 
            ' "placa" : "",' + 
            ' "email" : "",' + 
            ' "firma" : null' + 
        '}');

        this.usuarioForm = JSON.parse('{' + 
            ' "persona" : null,' + 
            ' "tipo_doc" : null,' + 
            ' "numero_doc" : "",' + 
            ' "nombres_apellidos" : "",' + 
            ' "login" : "",' + 
            ' "cargo" : null,' + 
            ' "email" : ""' + 
        '}');

        this.personaForm = JSON.parse('{' +
            ' "tipo_doc" : null,' +
            ' "numero_doc" : ""' +
        '}');

        document.getElementById('input-firma-add').setAttribute('value', null);
        document.getElementById('img-firma-add').setAttribute('src', "");
        document.getElementById('img-firma-add').style.display = 'none';

        this.agenteService.borrarFirma();

        this.resetErrores();
    }

    private cerrarVentana() : void
    {
        jQuery('#add-agente').modal('hide');
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