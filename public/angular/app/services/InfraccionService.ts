import { Http, Headers, Response } from "@angular/http";
import { Injectable } from "@angular/core";

import { URL_APP } from "../constants/URL_APP";
 
@Injectable()
export class InfraccionService
{
    url: string = URL_APP + "administracion/infracciones/";
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
                        .then(res => res.json().infracciones);
    }
 
    public getById(id)
    {
        return this.http.get(this.url + "api/" + id)
                        .toPromise()
                        .then(res => res.json().infraccion);
    }

    public insert(infraccion)
    {
        return this.http.post(this.url + "api/", infraccion, { headers: this.headers })
                        .toPromise()
                        .then(res => res.json());
    }
 
    public update(infraccion, id)
    {
        return this.http.patch(this.url + "api/" + id, infraccion, { headers: this.headers })
                        .toPromise()
                        .then(res => res.json());
    }

    public getByFilters(codigo, nombre_corto, descripcion)
    {
        return this.http.get(this.url + "getByFilters/" + codigo + "/" + nombre_corto + "/" + descripcion)
                        .toPromise()
                        .then(res => res.json().infracciones);
    }
}