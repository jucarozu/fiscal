import { Http, Headers, Response } from "@angular/http";
import { Injectable } from "@angular/core";

import { URL_APP } from "../constants/URL_APP";

@Injectable()
export class ParametroService
{
    url: string = URL_APP + "administracion/parametros/";
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
                        .then(res => res.json().parametros);
    }
 
    public getById(id)
    {
        return this.http.get(this.url + "api/" + id)
                        .toPromise()
                        .then(res => res.json().parametro);
    }

    public insert(parametro)
    {
        return this.http.post(this.url + "api/", parametro, { headers: this.headers })
                        .toPromise()
                        .then(res => res.json());
    }
 
    public update(parametro, id)
    {
        return this.http.patch(this.url + "api/" + id, parametro, { headers: this.headers })
                        .toPromise()
                        .then(res => res.json());
    }
 
    public delete(id)
    {
        return this.http.delete(this.url + "api/" + id, { headers: this.headers })
                        .toPromise()
                        .then(res => res.json());
    }
 
    public getByGrupo(grupo)
    {
        return this.http.get(this.url + "getByGrupo/" + grupo)
                        .toPromise()
                        .then(res => res.json().parametros);
    }
}