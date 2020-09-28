import { Component, Input } from '@angular/core';
import { Router, ROUTER_DIRECTIVES } from '@angular/router-deprecated';

import { UsuarioService } from "../../../../../services/UsuarioService";
 
declare var jQuery : any;
 
@Component({
    selector: 'usuario-delete',
    templateUrl: './app/components/src/seguridad/usuarios/delete/usuario-delete.html',
    bindings: [UsuarioService],
    directives: [ROUTER_DIRECTIVES]
})
 
export class UsuarioDeleteComponent
{
    @Input('usuario') usuarioForm: Object;

    constructor(private usuarioService: UsuarioService) {}
 
    private inactivarUsuario(id)
    {
        this.usuarioService.delete(id);
        jQuery("#delete-usuario").modal("hide");
    }
}