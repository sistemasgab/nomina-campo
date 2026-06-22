import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Nomina, NominaEntry } from './types';
import { EMPLEADO_IDS } from './useEmpleadoStore';
import { SUCURSAL_IDS } from './useSucursalStore';

const SEED_NOMINAS: Nomina[] = [
  {
    id: 'nomina-header-0001',
    folio: 'NOM-001',
    sucursalId: SUCURSAL_IDS.ranchoSanJose,
    fecha: '2024-05-12',
    createdAt: '2024-05-12T00:00:00.000Z',
  },
  {
    id: 'nomina-header-0002',
    folio: 'NOM-002',
    sucursalId: SUCURSAL_IDS.invernaderoValle,
    fecha: '2024-05-14',
    createdAt: '2024-05-14T00:00:00.000Z',
  },
  {
    id: 'nomina-header-0003',
    folio: 'NOM-003',
    sucursalId: SUCURSAL_IDS.huertoEsperanza,
    fecha: '2024-05-13',
    createdAt: '2024-05-13T00:00:00.000Z',
  },
];

const SEED_ENTRIES: NominaEntry[] = [
  {
    id: 'nomina-0001-0000-0000-000000000001',
    nominaId: 'nomina-header-0001',
    empleadoId: EMPLEADO_IDS.ricardoMorales,
    monto: 12450,
    status: 'paid',
    createdAt: '2024-05-12T00:00:00.000Z',
  },
  {
    id: 'nomina-0002-0000-0000-000000000002',
    nominaId: 'nomina-header-0002',
    empleadoId: EMPLEADO_IDS.elenaGomez,
    monto: 8900,
    status: 'pending',
    createdAt: '2024-05-14T00:00:00.000Z',
  },
  {
    id: 'nomina-0003-0000-0000-000000000003',
    nominaId: 'nomina-header-0001',
    empleadoId: EMPLEADO_IDS.arturoSilva,
    monto: 15200,
    status: 'overdue',
    createdAt: '2024-05-10T00:00:00.000Z',
  },
  {
    id: 'nomina-0004-0000-0000-000000000004',
    nominaId: 'nomina-header-0003',
    empleadoId: EMPLEADO_IDS.juliaLopez,
    monto: 11100,
    status: 'paid',
    createdAt: '2024-05-13T00:00:00.000Z',
  },
];

function generateFolio(nominas: Nomina[]): string {
  let max = 0;
  for (const n of nominas) {
    const num = parseInt(n.folio.replace('NOM-', ''), 10);
    if (num > max) max = num;
  }
  return `NOM-${String(max + 1).padStart(3, '0')}`;
}

interface NominaState {
  nominas: Nomina[];
  entries: NominaEntry[];
  addNomina: (data: Omit<Nomina, 'id' | 'folio' | 'createdAt'>) => string;
  updateNomina: (id: string, data: Partial<Omit<Nomina, 'id' | 'folio' | 'createdAt'>>) => void;
  deleteNomina: (id: string) => void;
  addEntry: (data: Omit<NominaEntry, 'id' | 'createdAt'>) => void;
  updateEntry: (id: string, data: Partial<Omit<NominaEntry, 'id' | 'createdAt'>>) => void;
  deleteEntry: (id: string) => void;
  getEntriesByNomina: (nominaId: string) => NominaEntry[];
}

export const useNominaStore = create<NominaState>()(
  persist(
    (set, get) => ({
      nominas: SEED_NOMINAS,
      entries: SEED_ENTRIES,

      addNomina: (data) => {
        const id = crypto.randomUUID();
        set((state) => ({
          nominas: [
            ...state.nominas,
            {
              ...data,
              id,
              folio: generateFolio(state.nominas),
              createdAt: new Date().toISOString(),
            },
          ],
        }));
        return id;
      },

      updateNomina: (id, data) =>
        set((state) => ({
          nominas: state.nominas.map((n) =>
            n.id === id ? { ...n, ...data } : n
          ),
        })),

      deleteNomina: (id) =>
        set((state) => ({
          nominas: state.nominas.filter((n) => n.id !== id),
          entries: state.entries.filter((e) => e.nominaId !== id),
        })),

      addEntry: (data) =>
        set((state) => ({
          entries: [
            ...state.entries,
            {
              ...data,
              id: crypto.randomUUID(),
              createdAt: new Date().toISOString(),
            },
          ],
        })),

      updateEntry: (id, data) =>
        set((state) => ({
          entries: state.entries.map((e) =>
            e.id === id ? { ...e, ...data } : e
          ),
        })),

      deleteEntry: (id) =>
        set((state) => ({
          entries: state.entries.filter((e) => e.id !== id),
        })),

      getEntriesByNomina: (nominaId) =>
        get().entries.filter((e) => e.nominaId === nominaId),
    }),
    {
      name: 'agropay-nomina',
    }
  )
);
