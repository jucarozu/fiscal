import { Http, Headers, Response } from "@angular/http";
import { Injectable } from "@angular/core";

import { URL_APP } from "../constants/URL_APP";
 
@Injectable()
export class AgenteService
{
    url: string = URL_APP + "administracion/agentes/";
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
                        .then(res => res.json().agentes);
    }
 
    public getById(id)
    {
        return this.http.get(this.url + "api/" + id)
                        .toPromise()
                        .then(res => res.json().agente);
    }

    public insert(agente)
    {
        return this.http.post(this.url + "api/", agente, { headers: this.headers })
                        .toPromise()
                        .then(res => res.json());
    }
 
    public update(agente, id)
    {
        return this.http.patch(this.url + "api/" + id, agente, { headers: this.headers })
                        .toPromise()
                        .then(res => res.json());
    }

    public delete(id)
    {
        return this.http.delete(this.url + "api/" + id, { headers: this.headers })
                        .toPromise()
                        .then(res => res.json());
    }

    public getByFilters(entidad, placa, tipo_doc, numero_doc, nombres_apellidos, estado)
    {
        return this.http.get(this.url + "getByFilters/" + entidad + "/" + placa + "/" + tipo_doc + "/" + numero_doc + "/" + nombres_apellidos + "/" + estado)
                        .toPromise()
                        .then(res => res.json().agentes);
    }

    public getByUsuario(usuario)
    {
        return this.http.get(this.url + "getByUsuario/" + usuario)
                        .toPromise()
                        .then(res => res.json().agente);
    }

    public mostrarFirma(persona)
    {
        return window.open(this.url + "mostrarFirma/" + persona);
    }

    public borrarFirma()
    {
        return this.http.delete(this.url + "borrarFirma/", { headers: this.headers })
                        .toPromise()
                        .then(res => res.json());
    }
}