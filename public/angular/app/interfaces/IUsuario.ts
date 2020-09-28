export interface IUsuario {
    usuario: number;
    persona: number;
    tipo_doc: number;
    tipo_doc_desc: string;
    numero_doc: string;
    nombres: string;
    apellidos: string;
    nombres_apellidos: string;
    login: string;
    password: string;
    cargo: number;
    cargo_desc: string;
    fecha_alta: string;
    fecha_baja: string;
    email: string;
    estado: number;
    estado_desc: string;
    usuario_registra: number;
    usuario_registra_nombre: string;
    fecha_password: string;
    fecha_vence_passw: string;
    roles: Object;
}