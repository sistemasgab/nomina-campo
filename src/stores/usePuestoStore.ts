import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Puesto } from './types';

// Fixed UUIDs for seed data so cross-store references work
export const PUESTO_IDS = {
  jornalero: 'puesto-0001-0000-0000-000000000001',
  supervisorCampo: 'puesto-0002-0000-0000-000000000002',
  operadorMaquinaria: 'puesto-0003-0000-0000-000000000003',
  capturista: 'puesto-0004-0000-0000-000000000004',
} as const;

const SEED_PUESTOS: Puesto[] = [
  {
    id: PUESTO_IDS.jornalero,
    nombre: 'Jornalero',
    descripcion: 'Trabajos generales de campo y cosecha',
    salarioBase: 250,
    createdAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: PUESTO_IDS.supervisorCampo,
    nombre: 'Supervisor de Campo',
    descripcion: 'Supervisión y coordinación de actividades agrícolas',
    salarioBase: 450,
    createdAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: PUESTO_IDS.operadorMaquinaria,
    nombre: 'Operador de Maquinaria',
    descripcion: 'Operación y mantenimiento de equipo agrícola',
    salarioBase: 380,
    createdAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: PUESTO_IDS.capturista,
    nombre: 'Capturista',
    descripcion: 'Registro y control de datos de producción y nómina',
    salarioBase: 320,
    createdAt: '2024-01-01T00:00:00.000Z',
  },
];

interface PuestoState {
  puestos: Puesto[];
  addPuesto: (data: Omit<Puesto, 'id' | 'createdAt'>) => void;
  updatePuesto: (id: string, data: Partial<Omit<Puesto, 'id' | 'createdAt'>>) => void;
  deletePuesto: (id: string) => void;
}

export const usePuestoStore = create<PuestoState>()(
  persist(
    (set) => ({
      puestos: SEED_PUESTOS,

      addPuesto: (data) =>
        set((state) => ({
          puestos: [
            ...state.puestos,
            {
              ...data,
              id: crypto.randomUUID(),
              createdAt: new Date().toISOString(),
            },
          ],
        })),

      updatePuesto: (id, data) =>
        set((state) => ({
          puestos: state.puestos.map((p) =>
            p.id === id ? { ...p, ...data } : p
          ),
        })),

      deletePuesto: (id) =>
        set((state) => ({
          puestos: state.puestos.filter((p) => p.id !== id),
        })),
    }),
    {
      name: 'agropay-puestos',
    }
  )
);
