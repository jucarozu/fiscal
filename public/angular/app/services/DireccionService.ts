import { Http, Headers, Response } from "@angular/http";
import { Injectable } from "@angular/core";

import { URL_APP } from "../constants/URL_APP";
 
@Injectable()
export class DireccionService
{
    url: string = URL_APP + "administracion/direcciones/";
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
                        .then(res => res.json().direcciones);
    }
 
    public getById(id)
    {
        return this.http.get(this.url + "api/" + id)
                        .toPromise()
                        .then(res => res.json().direccion);
    }

    public insert(direccion)
    {
        return this.http.post(this.url + "api/", direccion, { headers: this.headers })
                        .toPromise()
                        .then(res => res.json());
    }
 
    public update(direccion, id)
    {
        return this.http.patch(this.url + "api/" + id, direccion, { headers: this.headers })
                        .toPromise()
                        .then(res => res.json());
    }

    public getByFilters(tipo_doc, numero_doc)
    {
        return this.http.get(this.url + "getByFilters/" + tipo_doc + "/" + numero_doc)
                        .toPromise()
                        .then(res => res.json().direcciones);
    }

    public getByPersona(persona)
    {
        return this.http.get(this.url + "getByPersona/" + persona)
                        .toPromise()
                        .then(res => res.json().direccion);
    }

    public getAllByPersona(persona)
    {
        return this.http.get(this.url + "getAllByPersona/" + persona)
                        .toPromise()
                        .then(res => res.json().direcciones);
    }
}