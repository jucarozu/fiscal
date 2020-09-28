import { Component, OnInit } from '@angular/core';

import { IUsuario } from "../../../../../interfaces/IUsuario";
import { IPersona } from "../../../../../interfaces/IPersona";
import { IOpcion } from "../../../../../interfaces/IOpcion";

import { UsuarioService } from "../../../../../services/UsuarioService";
import { RolService } from "../../../../../services/RolService";
import { PersonaService } from "../../../../../services/PersonaService";
import { ParametroService } from "../../../../../services/ParametroService";
import { AuditoriaService } from "../../../../../services/AuditoriaService";

import { PersonaAddComponent } from "../../../administracion/personas/add/PersonaAddComponent";

import { NotificationsService } from 'angular2-notifications/components';
import { SimpleNotificationsComponent } from 'angular2-notifications/components';

declare var jQuery : any;
 
@Component({
    selector: 'usuario-add',
    templateUrl: './app/components/src/seguridad/usuarios/add/usuario-add.html',
    bindings: [UsuarioService, RolService, PersonaService, ParametroService, AuditoriaService, NotificationsService],
    directives: [
        PersonaAddComponent, 
        SimpleNotificationsComponent
    ]
})
 
export class UsuarioAddComponent implements OnInit
{
    isLoading: boolean = false;

    accionAudit: number = 2; // Adicionar
    gpTipoDocumento: number = 1;
    gpCargo: number = 4;

    userLogin: IUsuario;
    opcion: IOpcion;

    usuarioForm: IUsuario;
    personaForm: IPersona;
    
    mensaje: string;
    errores: Array<Object> = [];
    
    documentos: Array<Object> = [];
    cargos: Array<Object> = [];
    roles: Array<Object> = [];

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

    constructor(private usuarioService: UsuarioService, 
                private rolService: RolService,
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
        this.parametroService.getByGrupo(this.gpTipoDocumento).then(documentos => { this.documentos = documentos});
        this.parametroService.getByGrupo(this.gpCargo).then(cargos => { this.cargos = cargos });
    }

    private cargarRoles() : void
    {
        this.rolService.get()
            .then(roles => 
                {
                    this.roles = [];
                    
                    for (let i in roles)
                    {
                        this.roles.push({
                            rol : roles[i]['rol'], 
                            nombre : roles[i]['nombre'], 
                            tiene_rol : roles[i]['tiene_rol']
                        });
                    }
                });
    }

    public cargarPersona()
    {
        this.personaService.getByDocumento(this.usuarioForm.tipo_doc, this.usuarioForm.numero_doc)
            .then(persona =>
                {
                    if (persona != null)
                    {
                        this.usuarioForm.persona = persona.persona;
                        this.usuarioForm.nombres_apellidos = persona.nombres_apellidos;
                        this.usuarioForm.login = this.usuarioForm.numero_doc.toString();
                    }
                }
            );
    }

    private getPersonaByDocumento() : void
    {
        this.errores = [];

        if (this.usuarioForm.tipo_doc == null)
            return;

        if (this.usuarioForm.numero_doc == "")
            return;

        if (isNaN(Number(this.usuarioForm.numero_doc)))
        {
            this.errores.push("El número de documento debe ser numérico.");
            return;
        }

        this.personaService.getByDocumento(this.usuarioForm.tipo_doc, this.usuarioForm.numero_doc)
            .then(persona =>
                {
                    this.personaForm.tipo_doc = this.usuarioForm.tipo_doc;
                    this.personaForm.numero_doc = this.usuarioForm.numero_doc;

                    if (persona != null)
                    {
                        this.usuarioForm.persona = persona.persona;
                        this.usuarioForm.nombres_apellidos = persona.nombres_apellidos;
                        this.usuarioForm.login = this.usuarioForm.numero_doc.toString();
                    }
                    else
                    {
                        this.usuarioForm.persona = null;
                        this.usuarioForm.nombres_apellidos = "";
                        this.usuarioForm.login = "";

                        localStorage.setItem('input-persona', JSON.stringify(this.personaForm));
                        jQuery('#add-persona').modal({ backdrop: 'static' });
                    }
                }
            );
    }

    private insertar() : void
    {
        this.resetErrores();

        if (!this.validarRoles(this.roles))
        {
            return;
        }

        this.isLoading = true;

        let usuarioString = this.generarUsuarioString(this.usuarioForm, this.roles);

        this.usuarioService.insert(usuarioString).then(
            (res) => {
                this.auditar(res.usuario, this.roles);
                this.isLoading = false;
                
                this.notificationService.success("Operación exitosa", "El usuario fue creado correctamente.");
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
                    this.errores.push("Ha ocurrido un error al crear el usuario.");
                }
            }
        );
    }

    private validarRoles(roles) : boolean
    {
        for (let i in roles)
        {
            if (roles[i]['tiene_rol'])
            {
                return true;
            }
        }

        this.errores.push("El usuario debe tener al menos un rol asignado.");
        return false;
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

    private auditar(usuario, roles) : boolean
    {
        try
        {
            let usuarioAudit = this.generarUsuarioAudit(usuario, roles);
            this.auditoriaService.insert(this.opcion.opcion, this.accionAudit, usuarioAudit);

            return true;
        }
        catch(error)
        {
            return false;
        }
    }

    private generarUsuarioAudit(usuario, roles) : string
    {
        let usuarioAudit = {
            usuario : usuario["usuario"],
            persona : usuario['persona'], 
            login : usuario['login'], 
            contrasena : usuario['contrasena'], 
            cargo : usuario['cargo'], 
            fecha_alta : usuario['fecha_alta'],
            fecha_baja : usuario['fecha_baja'],
            email : usuario['email'],
            estado : usuario['estado'],
            usuario_registra : usuario['usuario_registra'],
            fecha_password : usuario['fecha_password'],
            fecha_vence_passw : usuario['fecha_vence_passw'],
            roles : []
        };

        for (let i in roles)
        {
            if (roles[i]['tiene_rol'])
            {
                usuarioAudit['roles'].push(
                    {
                        'rol' : roles[i]['rol'], 
                        'nombre' : roles[i]['nombre']
                    }
                );
            }
        }

        return JSON.stringify(usuarioAudit);
    }

    private resetErrores() : void
    {
        this.errores = [];
    }

    private resetFormulario() : void
    {
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

        this.cargarRoles();
    }

    private cerrarVentana() : void
    {
        jQuery('#add-usuario').modal('hide');
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