import { Http, Headers, Response } from "@angular/http";
import { Injectable } from "@angular/core";

import { URL_APP } from "../constants/URL_APP";
 
@Injectable()
export class NotifDescarteService
{
    url: string = URL_APP + "notificaciones/notifDescarte/";
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
                        .then(res => res.json().notifDescarte);
    }

    public insert(notifDescarte)
    {
        return this.http.post(this.url + "api/", notifDescarte, { headers: this.headers })
                        .toPromise()
                        .then(res => res.json());
    }

    public getByFilters(notificacion)
    {
        return this.http.get(this.url + "getByFilters/" + notificacion)
                        .toPromise()
                        .then(res => res.json().notifDescartadas);
    }
}