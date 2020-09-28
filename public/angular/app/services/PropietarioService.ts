import { Http, Headers, Response } from "@angular/http";
import { Injectable } from "@angular/core";

import { URL_APP } from "../constants/URL_APP";
 
@Injectable()
export class PropietarioService
{
    url: string = URL_APP + "administracion/propietarios/";
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
                        .then(res => res.json().propietarios);
    }
 
    public getById(id)
    {
        return this.http.get(this.url + "api/" + id)
                        .toPromise()
                        .then(res => res.json().propietario);
    }

    public insert(propietario)
    {
        return this.http.post(this.url + "api/", propietario, { headers: this.headers })
                        .toPromise()
                        .then(res => res.json());
    }
 
    public update(propietario, id)
    {
        return this.http.patch(this.url + "api/" + id, propietario, { headers: this.headers })
                        .toPromise()
                        .then(res => res.json());
    }

    public getByFilters(placa, tipo_doc, numero_doc)
    {
        return this.http.get(this.url + "getByFilters/" + placa + "/" + tipo_doc + "/" + numero_doc)
                        .toPromise()
                        .then(res => res.json().propietarios);
    }
}