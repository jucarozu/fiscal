import { Http, Headers, Response } from "@angular/http";
import { Injectable } from "@angular/core";

import { URL_APP } from "../constants/URL_APP";
 
@Injectable()
export class NotifDevueltaService
{
    url: string = URL_APP + "notificaciones/notifDevuelta/";
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
                        .then(res => res.json().notifDevuelta);
    }

    public insert(notifDevuelta)
    {
        return this.http.post(this.url + "api/", notifDevuelta, { headers: this.headers })
                        .toPromise()
                        .then(res => res.json());
    }

    public getByFilters(notificacion)
    {
        return this.http.get(this.url + "getByFilters/" + notificacion)
                        .toPromise()
                        .then(res => res.json().notifDevueltas);
    }
}