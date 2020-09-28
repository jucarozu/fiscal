export interface IFuente {
    fuente: number;
    tipo: number;
    tipo_desc: string;
    nombre: string;
    proveedor: number;
    prov_tipo_doc: number;
    prov_tipo_doc_desc: string;
    prov_numero_doc: string;
    prov_nombre: string;
    desde: string;
    hasta: string;
    latitud: number;
    longitud: number;
    referencia_ubicacion: string;
    observaciones: string;
    ws: number;
    ftp: number;
    usuario: number;
    usuario_desc: string;
    fecha_registra: string;
}