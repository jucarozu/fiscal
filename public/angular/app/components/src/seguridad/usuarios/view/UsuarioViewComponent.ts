import { Component, OnInit } from '@angular/core';

import { CanActivate, ComponentInstruction, ROUTER_DIRECTIVES, Router } from '@angular/router-deprecated';
import { IsLoggedIn } from '../../../../../constants/IsLoggedIn';

import { IUsuario } from "../../../../../interfaces/IUsuario";
import { IOpcion } from "../../../../../interfaces/IOpcion";

import { AuthService } from '../../../../../services/AuthService';
import { UsuarioService } from "../../../../../services/UsuarioService";
import { AuditoriaService } from "../../../../../services/AuditoriaService";

import { UsuarioAddComponent } from "../add/UsuarioAddComponent";
import { UsuarioDetailComponent } from "../detail/UsuarioDetailComponent";
import { UsuarioEditComponent } from "../edit/UsuarioEditComponent";
import { UsuarioDeleteComponent } from "../delete/UsuarioDeleteComponent";

import { PersonaAddComponent } from "../../../administracion/personas/add/PersonaAddComponent";

import { DataTable, Column } from 'primeng/primeng';

declare var jQuery : any;

@Component({
    selector: 'usuario-view',
    templateUrl: './app/components/src/seguridad/usuarios/view/usuario-view.html',
    bindings: [AuthService, UsuarioService, AuditoriaService],
    directives: [
        ROUTER_DIRECTIVES, 
        UsuarioAddComponent, 
        UsuarioDetailComponent, 
        UsuarioEditComponent, 
        UsuarioDeleteComponent,
        PersonaAddComponent, 
        DataTable, Column
    ]
})

@CanActivate((next: ComponentInstruction, previous: ComponentInstruction) => {
    return IsLoggedIn(next, previous);
})
 
export class UsuarioViewComponent implements OnInit
{
    isLoading: boolean = false;

    accionAudit: number = 1; // Consultar

    opcion: IOpcion;
    
    usuarios: Array<IUsuario>;
    selectedUsuario: Object = {};

    constructor(private router: Router,
                private authService: AuthService,
                private usuarioService: UsuarioService, 
                private auditoriaService: AuditoriaService) {}

    ngOnInit()
    {
        if (!this.authService.authorize())
            this.router.navigate(['Perfil']);
            
        if (this.opcion == null)
            this.opcion = JSON.parse(localStorage.getItem('opcion'));

        this.getUsuarios();

        this.agregarEventos();
        
        this.auditoriaService.insert(this.opcion.opcion, this.accionAudit);
    }

    private agregarEventos()
    {
        // Eventos para refrescar la tabla al insertar o actualizar un usuario.
        jQuery('#add-usuario, #edit-usuario, #delete-usuario').on('hide.bs.modal', function() {
            jQuery('#btn-buscar').click();
        });
    }

    private getUsuarios()
    {
        this.isLoading = true;

        this.usuarioService.get().then(
            usuarios => {
                this.usuarios = usuarios;
                this.isLoading = false;
            }
        );
    }

    private selectUsuario(usuario)
    {
        this.selectedUsuario = usuario;
    }

    private loading() : boolean
    {
        return this.isLoading;
    }
}