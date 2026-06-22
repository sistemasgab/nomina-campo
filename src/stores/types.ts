export interface Empresa {
  id: string;
  nombre: string;
  rfc: string;
  direccion: string;
  createdAt: string;
}

export interface Sucursal {
  id: string;
  empresaId: string;
  nombre: string;
  ubicacion: string;
  createdAt: string;
}

export interface Puesto {
  id: string;
  nombre: string;
  descripcion: string;
  salarioBase: number;
  createdAt: string;
}

export interface Empleado {
  id: string;
  nombre: string;
  apellido: string;
  puestoId: string;
  sucursalId: string;
  fechaIngreso: string;
  activo: boolean;
  createdAt: string;
}

export interface Nomina {
  id: string;
  folio: string;
  sucursalId: string;
  fecha: string;
  createdAt: string;
}

export type NominaStatus = 'paid' | 'pending' | 'overdue';

export interface NominaEntry {
  id: string;
  nominaId: string;
  empleadoId: string;
  monto: number;
  status: NominaStatus;
  createdAt: string;
}
