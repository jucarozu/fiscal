import { Http, Headers, Response } from "@angular/http";
import { Injectable } from "@angular/core";

import { URL_APP } from "../constants/URL_APP";
 
@Injectable()
export class NotifColaService
{
    url: string = URL_APP + "notificaciones/notifCola/";
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
                        .then(res => res.json().notifCola);
    }

    public insert(notifCola)
    {
        return this.http.post(this.url + "api/", notifCola, { headers: this.headers })
                        .toPromise()
                        .then(res => res.json());
    }

    public getByFilters(notificacion)
    {
        return this.http.get(this.url + "getByFilters/" + notificacion)
                        .toPromise()
                        .then(res => res.json().notifColas);
    }
}