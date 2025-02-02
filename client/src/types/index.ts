export interface conductor {
    id: number;
    nombres: string;
    apellidos: string;
    numero_licencia: string;
    telefono: string;
    correo: string;
}

export interface vehiculo {
    placa: string;
    modelo: string;
    color: string;
    marca: string;
    capacidad_carga: number;
}