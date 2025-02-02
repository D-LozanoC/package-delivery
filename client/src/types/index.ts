export interface conductor {
    id: string;
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

export interface detalles {
    id: string;
    latitud: number;
    longitud: number;
    direccion: string;
    numero_paquete: string;
    rutaId: number;
}

export type Ruta = {
    conductor: conductor;
    vehiculo: vehiculo;
    detalles: detalles[];
    id: number;
    fecha: string;
    conductorId: number;
    vehiculoPlaca: string;
}