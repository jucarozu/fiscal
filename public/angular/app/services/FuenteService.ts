import { Http, Headers, Response } from "@angular/http";
import { Injectable } from "@angular/core";

import { URL_APP } from "../constants/URL_APP";
 
@Injectable()
export class FuenteService
{
    url: string = URL_APP + "administracion/fuentes/";
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
                        .then(res => res.json().fuentes);
    }
 
    public getById(id)
    {
        return this.http.get(this.url + "api/" + id)
                        .toPromise()
                        .then(res => res.json().fuente);
    }

    public insert(fuente)
    {
        return this.http.post(this.url + "api/", fuente, { headers: this.headers })
                        .toPromise()
                        .then(res => res.json());
    }
 
    public update(fuente, id)
    {
        return this.http.patch(this.url + "api/" + id, fuente, { headers: this.headers })
                        .toPromise()
                        .then(res => res.json());
    }

    public getByFilters(tipo, nombre, prov_nombre, referenciaUbicacion)
    {
        return this.http.get(this.url + "getByFilters/" + tipo + "/" + nombre + "/" + prov_nombre + "/" + referenciaUbicacion)
                        .toPromise()
                        .then(res => res.json().fuentes);
    }
}