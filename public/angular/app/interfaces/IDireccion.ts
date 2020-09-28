export interface IDireccion {
    direccion: number;
    persona: number;
    tipo_doc: number;
    tipo_doc_desc: string;
    numero_doc: string;
    nombres: string;
    apellidos: string;
    nombres_apellidos: string;
    fuente: number;
    fuente_desc: string;
    observaciones: string;
    divipo: number;
    cod_departamento: number;
    departamento: string;
    cod_municipio: number;
    municipio: string;
    cod_poblado: number;
    poblado: string;
    descripcion: string;
    fecha_registra: string;
    usuario: number;
    usuario_desc: string;
    is_selected: boolean;
}