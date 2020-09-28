import { Http, Headers, Response } from "@angular/http";
import { Injectable } from "@angular/core";

import { URL_APP } from "../constants/URL_APP";

@Injectable()
export class OpcionService
{
    url: string = URL_APP + "seguridad/opciones/";
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
                        .then(res => res.json().opciones);
    }

    public getById(id)
    {
        return this.http.get(this.url + "api/" + id)
                        .toPromise()
                        .then(res => res.json().opcion);
    }

    public insert(opcion)
    {
        return this.http.post(this.url + "api/", opcion, { headers: this.headers })
                        .toPromise()
                        .then(res => res.json());
    }
 
    public update(opcion, id)
    {
        return this.http.patch(this.url + "api/" + id, opcion, { headers: this.headers })
                        .toPromise()
                        .then(res => res.json());
    }
 
    public delete(id)
    {
        return this.http.delete(this.url + "api/" + id, { headers: this.headers })
                        .toPromise()
                        .then(res => res.json());
    }
}