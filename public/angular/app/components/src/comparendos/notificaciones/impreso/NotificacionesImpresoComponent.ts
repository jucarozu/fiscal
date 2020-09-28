import { Component } from '@angular/core';
 
declare var jQuery : any;
 
@Component({
    selector: 'notificaciones-impreso',
    templateUrl: './app/components/src/comparendos/notificaciones/impreso/notificaciones-impreso.html'
})
 
export class NotificacionesImpresoComponent
{
    constructor() {}

    private confirmar() : void
    {
        jQuery('#is-impreso-notificaciones').val('1');
        this.cerrarVentana();
    }

    private cancelar() : void
    {
        jQuery('#is-impreso-notificaciones').val('0');
        this.cerrarVentana();
    }

    private cerrarVentana() : void
    {
        jQuery('#impreso-notificaciones').modal('hide');
    }
}