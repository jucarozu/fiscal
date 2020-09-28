import { Http, Headers, Response } from "@angular/http";
import { Injectable } from "@angular/core";

import { URL_APP } from "../constants/URL_APP";
 
@Injectable()
export class EvidenciaService
{
    url: string = URL_APP + "pruebas/evidencias/";
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
                        .then(res => res.json().evidencias);
    }
 
    public getById(id)
    {
        return this.http.get(this.url + "api/" + id)
                        .toPromise()
                        .then(res => res.json().evidencia);
    }

    public insert(infraDeteccion)
    {
        return this.http.post(this.url + "api/", infraDeteccion, { headers: this.headers })
                        .toPromise()
                        .then(res => res.json());
    }

    public delete(id)
    {
        return this.http.delete(this.url + "api/" + id, { headers: this.headers })
                        .toPromise()
                        .then(res => res.json());
    }

    public getByDeteccion(deteccion)
    {
        return this.http.get(this.url + "getByDeteccion/" + deteccion)
                        .toPromise()
                        .then(res => res.json().evidencias);
    }

    public recortarEvidencia(recorteEvidencia)
    {
        return this.http.post(this.url + "recortarEvidencia/", recorteEvidencia, { headers: this.headers })
                        .toPromise()
                        .then(res => res.json());
    }
}