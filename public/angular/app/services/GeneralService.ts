import { Injectable } from "@angular/core";
 
@Injectable()
export class GeneralService
{ 
    constructor() {}
 
    public getFechaActualYMD() : string
    {
        var fechaActual = new Date();
        var pad = '00';

        var mes = fechaActual.getMonth() + 1;
        var dia = fechaActual.getDate();

        var yyyy = fechaActual.getFullYear();
        var mm = pad.substring(0, pad.length - mes.toString().length) + mes.toString();
        var dd = pad.substring(0, pad.length - dia.toString().length) + dia.toString();
        
        return yyyy + '-' + mm + '-' + dd;
    }

    public getFechaActualYMDHM() : string
    {
        var fechaActual = new Date();
        var pad = '00';

        var mes = fechaActual.getMonth() + 1;
        var dia = fechaActual.getDate();
        var horas = fechaActual.getHours();
        var minutos = fechaActual.getMinutes();

        var yyyy = fechaActual.getFullYear();
        var mm = pad.substring(0, pad.length - mes.toString().length) + mes.toString();
        var dd = pad.substring(0, pad.length - dia.toString().length) + dia.toString();
        var hh = pad.substring(0, pad.length - horas.toString().length) + horas.toString();
        var mi = pad.substring(0, pad.length - minutos.toString().length) + minutos.toString();
        
        return yyyy + '-' + mm + '-' + dd + ' ' + hh + ':' + mi;
    }
}