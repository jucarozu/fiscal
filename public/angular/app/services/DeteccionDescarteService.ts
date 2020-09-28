import { Http, Headers, Response } from "@angular/http";
import { Injectable } from "@angular/core";

import { URL_APP } from "../constants/URL_APP";
 
@Injectable()
export class DeteccionDescarteService
{
    url: string = URL_APP + "pruebas/deteccionesDescarte/";
    headers: Headers = new Headers;
 
    constructor(private http: Http)
    {
        this.headers.append('Content-Type', 'application/x-www-form-urlencoded');
        this.headers.append('X-Requested-With', 'XMLHttpRequest');
    }
 
    public get()
    {
        return this.http.get(this.url + "api/")
                        .toPromise()
                        .then(res => res.json().deteccionesDescarte);
    }

    public getById(id)
    {
        return this.http.get(this.url + "api/" + id)
                        .toPromise()
                        .then(res => res.json().deteccionDescarte);
    }
 
    public insert(deteccionDescarte)
    {
        return this.http.post(this.url + "api/", deteccionDescarte, { headers: this.headers })
                        .toPromise()
                        .then(res => res.json());
    }
}