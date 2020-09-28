export interface ISustitucionConductor {
    comparendo: number;
    numero_resolucion: string;
    fecha_resolucion: string;
    infractor: number;
    infr_tipo_doc: number;
    infr_numero_doc: string;
    infr_nombres: string;
    infr_apellidos: string;
    infr_edad: number;
    lic_numero: string;
    lic_categoria: string;
    lic_organismo: number;
    lic_expedicion: string;
    lic_vencimiento: string;
    contacto_direccion: string;
    contacto_departamento: number;
    contacto_municipio: number;
    contacto_telefono: string;
    contacto_celular: string;
    contacto_email: string;
    observaciones: string;
    infractor_presente: boolean;
}