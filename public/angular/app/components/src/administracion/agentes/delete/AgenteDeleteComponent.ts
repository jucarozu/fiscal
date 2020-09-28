import { Component, Input } from '@angular/core';
import { Router, ROUTER_DIRECTIVES } from '@angular/router-deprecated';

import { IAgente } from "../../../../../interfaces/IAgente";

import { AgenteService } from "../../../../../services/AgenteService";
import { UsuarioService } from "../../../../../services/UsuarioService";

import { NotificationsService } from 'angular2-notifications/components';
import { SimpleNotificationsComponent } from 'angular2-notifications/components';
 
declare var jQuery : any;
 
@Component({
    selector: 'agente-delete',
    templateUrl: './app/components/src/administracion/agentes/delete/agente-delete.html',
    bindings: [AgenteService, UsuarioService, NotificationsService],
    directives: [SimpleNotificationsComponent]
})
 
export class AgenteDeleteComponent
{
    @Input('agente') agenteForm: IAgente;

    constructor(private agenteService: AgenteService, 
                private usuarioService: UsuarioService,
                private notificationService: NotificationsService) {}

    private inactivarAgente(id)
    {
        this.agenteService.delete(id).then(
            (res) => {
                this.usuarioService.delete(this.agenteForm.usuario);

                jQuery("#delete-agente").modal("hide");
                jQuery("#edit-agente").modal("hide");
            }
        );
    }
}