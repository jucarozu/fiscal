import { Http, Headers, Response } from "@angular/http";
import { Injectable } from "@angular/core";

import { URL_APP } from "../constants/URL_APP";
 
@Injectable()
export class NotificacionService
{
    url: string = "http://localhost/fiscal/public/fiscalizacion/comparendos/notificaciones/";
    headers: Headers = new Headers;
 
    constructor(private http: Http)
    {
        this.headers.append('Content-Type', 'application/x-www-form-urlencoded');
        this.headers.append('X-Requested-With', 'XMLHttpRequest');
    }
 
    public get()
    {
        return this.http.get(this.url + "api")
                        .toPromise()
                        .then(res => res.json().notificaciones);
    }
 
    public getById(id)
    {
        return this.http.get(this.url + "api/" + id)
                        .toPromise()
                        .then(res => res.json().notificacion);
    }

    public insert(notificacionFilter)
    {
        return this.http.post(this.url + "api", notificacionFilter, { headers: this.headers })
                        .toPromise()
                        .then(res => res.json());
    }

    public update(notificacion, id)
    {
        return this.http.patch(this.url + "api/" + id, notificacion, { headers: this.headers })
                        .toPromise()
                        .then(res => res.json());
    }

    public getByFilters(notificacion, notif_tipo, numero, notif_tipo_doc, notif_numero_doc, estado)
    {
        return this.http.get(this.url + "getByFilters/" + notificacion + "/" + notif_tipo + "/" + numero + "/" + notif_tipo_doc + "/" + notif_numero_doc + "/" + estado)
                        .toPromise()
                        .then(res => res.json().notificaciones);
    }

    public imprimir(imp_orden, imp_modo)
    {
        return this.http.get(this.url + "imprimir/" + imp_orden + "/" + imp_modo)
                        .toPromise()
                        .then(res => res.json());
    }

    public marcarImpreso(usuario_imprime)
    {
        return this.http.patch(this.url + "marcarImpreso", "&usuario_imprime=" + usuario_imprime, { headers: this.headers })
                        .toPromise()
                        .then(res => res.json());
    }
}