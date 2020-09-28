import { Component } from '@angular/core';
 
declare var jQuery : any;
 
@Component({
    selector: 'sustitucion-sancionado',
    templateUrl: './app/components/src/comparendos/sustitucion-conductor/sancionado/sustitucion-sancionado.html'
})
 
export class SustitucionSancionadoComponent
{
    constructor() {}

    private confirmar() : void
    {
        jQuery('#is-sustitucion-conductor').val('1');
        jQuery('#conductor-sustitucion').modal('show');
        this.cerrarVentana();
    }

    private cancelar() : void
    {
        jQuery('#is-sustitucion-conductor').val('0');
        this.cerrarVentana();
    }

    private cerrarVentana() : void
    {
        jQuery('#sancionado-sustitucion').modal('hide');
    }
}