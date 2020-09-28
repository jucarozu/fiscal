import { Component, Input, OnInit } from '@angular/core';

import { IFuente } from "../../../../../interfaces/IFuente";

import { FuenteService } from "../../../../../services/FuenteService";
import { ParametroService } from "../../../../../services/ParametroService";

import { GOOGLE_MAPS_DIRECTIVES, MouseEvent } from 'angular2-google-maps/core';

declare var jQuery : any;

@Component({
    selector: 'fuente-detail',
    templateUrl: './app/components/src/administracion/fuentes/detail/fuente-detail.html',
    bindings: [FuenteService, ParametroService],
    directives: [
        GOOGLE_MAPS_DIRECTIVES
    ]
})
 
export class FuenteDetailComponent implements OnInit
{
    gpTipoFuente: number = 12;

    @Input('fuente') fuenteForm: IFuente;

    tiposFuentes: Array<Object> = [];

    constructor(private fuenteService: FuenteService,
                private parametroService: ParametroService) {}

    ngOnInit()
    {
        this.agregarEventos();
        this.cargarCombos();

        this.fuenteForm.latitud = 0.0;
        this.fuenteForm.longitud = 0.0;
    }

    private agregarEventos()
    {
        jQuery('#detail-fuente').on('shown.bs.modal', function() {
            jQuery('#btn-reset-detail').click();
            jQuery('#btn-load-mapa-detail').click();
        });
    }

    private cargarCombos()
    {
        this.parametroService.getByGrupo(this.gpTipoFuente).then(tiposFuentes => { this.tiposFuentes = tiposFuentes });
    }

    private resetFormulario() : void
    {
        this.fuenteService.getById(this.fuenteForm.fuente).then(
            fuente => {
                this.fuenteForm = fuente;
                
                if (this.fuenteForm.latitud != null && this.fuenteForm.longitud != null)
                {
                    this.fuenteForm.latitud = parseFloat(this.fuenteForm.latitud);
                    this.fuenteForm.longitud = parseFloat(this.fuenteForm.longitud);
                }
            }
        );
    }
}