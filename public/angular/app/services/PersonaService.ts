import { Http, Headers, Response } from "@angular/http";
import { Injectable } from "@angular/core";

import { URL_APP } from "../constants/URL_APP";
 
@Injectable()
export class PersonaService
{
    url: string = URL_APP + "administracion/personas/";
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
                        .then(res => res.json().personas);
    }
 
    public getById(id)
    {
        return this.http.get(this.url + "api/" + id)
                        .toPromise()
                        .then(res => res.json().persona);
    }

    public insert(persona)
    {
        return this.http.post(this.url + "api/", persona, { headers: this.headers })
                        .toPromise()
                        .then(res => res.json());
    }
 
    public update(persona, id)
    {
        return this.http.patch(this.url + "api/" + id, persona, { headers: this.headers })
                        .toPromise()
                        .then(res => res.json());
    }

    public getByFilters(tipo_doc, numero_doc, nombres, apellidos)
    {
        return this.http.get(this.url + "getByFilters/" + tipo_doc + "/" + numero_doc + "/" + nombres + "/" + apellidos)
                        .toPromise()
                        .then(res => res.json().personas);
    }

    public getByDocumento(tipo_doc, numero_doc)
    {
        return this.http.get(this.url + "getByDocumento/" + tipo_doc + "/" + numero_doc)
                        .toPromise()
                        .then(res => res.json().persona);
    }
}