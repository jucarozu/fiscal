import { Http, Headers, Response } from "@angular/http";
import { Injectable } from "@angular/core";

import { URL_APP } from "../constants/URL_APP";
 
@Injectable()
export class ComparendoService
{
    url: string = URL_APP + "comparendos/comparendos/";
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
                        .then(res => res.json().comparendos);
    }

    public getById(id)
    {
        return this.http.get(this.url + "api/" + id)
                        .toPromise()
                        .then(res => res.json().comparendo);
    }
 
    public insert(comparendo)
    {
        return this.http.post(this.url + "api/", comparendo, { headers: this.headers })
                        .toPromise()
                        .then(res => res.json())
                        .catch(error => error.json());
    }

    public update(comparendo, id)
    {
        return this.http.patch(this.url + "api/" + id, comparendo, { headers: this.headers })
                        .toPromise()
                        .then(res => res.json());
    }

    public sustituirConductor(sustitucionConductor)
    {
        return this.http.post(this.url + "sustituirConductor/", sustitucionConductor, { headers: this.headers })
                        .toPromise()
                        .then(res => res.json())
                        .catch(error => error.json());
    }

    public getComparendosPorNotificar(infra_desde, infra_hasta, verifica_desde, verifica_hasta, detec_sitio, detec_agente, dir_divipo)
    {
        return this.http.get(this.url + "getComparendosPorNotificar/" + infra_desde + "/" + infra_hasta + "/" + verifica_desde + "/" + verifica_hasta + "/" 
                                                                      + detec_sitio + "/" + detec_agente + "/" + dir_divipo)
                        .toPromise()
                        .then(res => res.json().comparendosPorNotificar);
    }

    public getByFilters(numero, infr_tipo_doc, infr_numero_doc, estado)
    {
        return this.http.get(this.url + "getByFilters/" + numero + "/" + infr_tipo_doc + "/" + infr_numero_doc + "/" + estado)
                        .toPromise()
                        .then(res => res.json().comparendos);
    }
}