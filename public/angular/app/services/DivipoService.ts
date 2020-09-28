import { Http, Headers, Response } from "@angular/http";
import { Injectable } from "@angular/core";

import { URL_APP } from "../constants/URL_APP";
 
@Injectable()
export class DivipoService
{
    url: string = URL_APP + "administracion/divipos/";
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
                        .then(res => res.json().divipos);
    }
 
    public getById(id)
    {
        return this.http.get(this.url + "api/" + id)
                        .toPromise()
                        .then(res => res.json().divipo);
    }

    public insert(divipo)
    {
        return this.http.post(this.url + "api/", divipo, { headers: this.headers })
                        .toPromise()
                        .then(res => res.json());
    }
 
    public update(divipo, id)
    {
        return this.http.patch(this.url + "api/" + id, divipo, { headers: this.headers })
                        .toPromise()
                        .then(res => res.json());
    }

    public getDepartamentos()
    {
        return this.http.get(this.url + "getDepartamentos/")
                        .toPromise()
                        .then(res => res.json().departamentos);
    }

    public getMunicipios(cod_departamento)
    {
        return this.http.get(this.url + "getMunicipios/" + cod_departamento)
                        .toPromise()
                        .then(res => res.json().municipios);
    }

    public getPoblados(cod_municipio)
    {
        return this.http.get(this.url + "getPoblados/" + cod_municipio)
                        .toPromise()
                        .then(res => res.json().poblados);
    }
}