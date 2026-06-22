import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Empleado } from './types';
import { PUESTO_IDS } from './usePuestoStore';
import { SUCURSAL_IDS } from './useSucursalStore';

// Fixed UUIDs for seed data so cross-store references work
export const EMPLEADO_IDS = {
  ricardoMorales: 'empleado-0001-0000-0000-000000000001',
  elenaGomez: 'empleado-0002-0000-0000-000000000002',
  arturoSilva: 'empleado-0003-0000-0000-000000000003',
  juliaLopez: 'empleado-0004-0000-0000-000000000004',
  miguelTorres: 'empleado-0005-0000-0000-000000000005',
} as const;

const SEED_EMPLEADOS: Empleado[] = [
  {
    id: EMPLEADO_IDS.ricardoMorales,
    nombre: 'Ricardo',
    apellido: 'Morales',
    puestoId: PUESTO_IDS.jornalero,
    sucursalId: SUCURSAL_IDS.ranchoSanJose,
    fechaIngreso: '2023-03-15',
    activo: true,
    createdAt: '2023-03-15T00:00:00.000Z',
  },
  {
    id: EMPLEADO_IDS.elenaGomez,
    nombre: 'Elena',
    apellido: 'Gómez',
    puestoId: PUESTO_IDS.supervisorCampo,
    sucursalId: SUCURSAL_IDS.invernaderoValle,
    fechaIngreso: '2022-08-01',
    activo: true,
    createdAt: '2022-08-01T00:00:00.000Z',
  },
  {
    id: EMPLEADO_IDS.arturoSilva,
    nombre: 'Arturo',
    apellido: 'Silva',
    puestoId: PUESTO_IDS.operadorMaquinaria,
    sucursalId: SUCURSAL_IDS.ranchoSanJose,
    fechaIngreso: '2023-06-20',
    activo: true,
    createdAt: '2023-06-20T00:00:00.000Z',
  },
  {
    id: EMPLEADO_IDS.juliaLopez,
    nombre: 'Julia',
    apellido: 'Lopez',
    puestoId: PUESTO_IDS.capturista,
    sucursalId: SUCURSAL_IDS.huertoEsperanza,
    fechaIngreso: '2023-01-10',
    activo: true,
    createdAt: '2023-01-10T00:00:00.000Z',
  },
  {
    id: EMPLEADO_IDS.miguelTorres,
    nombre: 'Miguel',
    apellido: 'Torres',
    puestoId: PUESTO_IDS.jornalero,
    sucursalId: SUCURSAL_IDS.ranchoSanJose,
    fechaIngreso: '2024-02-05',
    activo: true,
    createdAt: '2024-02-05T00:00:00.000Z',
  },
];

interface EmpleadoState {
  empleados: Empleado[];
  addEmpleado: (data: Omit<Empleado, 'id' | 'createdAt'>) => void;
  updateEmpleado: (id: string, data: Partial<Omit<Empleado, 'id' | 'createdAt'>>) => void;
  deleteEmpleado: (id: string) => void;
}

export const useEmpleadoStore = create<EmpleadoState>()(
  persist(
    (set) => ({
      empleados: SEED_EMPLEADOS,

      addEmpleado: (data) =>
        set((state) => ({
          empleados: [
            ...state.empleados,
            {
              ...data,
              id: crypto.randomUUID(),
              createdAt: new Date().toISOString(),
            },
          ],
        })),

      updateEmpleado: (id, data) =>
        set((state) => ({
          empleados: state.empleados.map((e) =>
            e.id === id ? { ...e, ...data } : e
          ),
        })),

      deleteEmpleado: (id) =>
        set((state) => ({
          empleados: state.empleados.filter((e) => e.id !== id),
        })),
    }),
    {
      name: 'agropay-empleados',
    }
  )
);
