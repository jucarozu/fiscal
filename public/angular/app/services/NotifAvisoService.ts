import { Http, Headers, Response } from "@angular/http";
import { Injectable } from "@angular/core";

import { URL_APP } from "../constants/URL_APP";
 
@Injectable()
export class NotifAvisoService
{
    url: string = URL_APP + "notificaciones/notifAviso/";
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
                        .then(res => res.json().notifAviso);
    }

    public insert(notifAviso)
    {
        return this.http.post(this.url + "api/", notifAviso, { headers: this.headers })
                        .toPromise()
                        .then(res => res.json());
    }

    public update(notifAviso, id)
    {
        return this.http.patch(this.url + "api/" + id, notifAviso, { headers: this.headers })
                        .toPromise()
                        .then(res => res.json());
    }

    public getByNotificacion(notificacion)
    {
        return this.http.get(this.url + "getByNotificacion/" + notificacion)
                        .toPromise()
                        .then(res => res.json().aviso);
    }
}