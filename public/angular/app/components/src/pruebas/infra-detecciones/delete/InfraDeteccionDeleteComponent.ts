import { Component, Input, OnInit } from '@angular/core';
import { Router, ROUTER_DIRECTIVES } from '@angular/router-deprecated';

import { InfraDeteccionService } from "../../../../../services/InfraDeteccionService";
 
declare var jQuery : any;
 
@Component({
    selector: 'infra-deteccion-delete',
    templateUrl: './app/components/src/pruebas/infra-detecciones/delete/infra-deteccion-delete.html',
    bindings: [InfraDeteccionService],
    directives: [ROUTER_DIRECTIVES]
})
 
export class InfraDeteccionDeleteComponent implements OnInit
{
    @Input('infra-deteccion') infraDeteccionForm: Object;

    constructor(private infraDeteccionService: InfraDeteccionService) {}

    ngOnInit()
    {
        this.agregarEventos();
    }
 
    private eliminarInfraDeteccion(id)
    {
        this.infraDeteccionService.delete(id);
        jQuery("#delete-infra-deteccion").modal("hide");
    }

    private agregarEventos()
    {
        jQuery('#delete-infra-deteccion').on('hide.bs.modal', function() {
            jQuery('#btn-load-infra-detecciones').click();
        });
    }
}