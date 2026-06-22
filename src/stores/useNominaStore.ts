import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { NominaEntry } from './types';
import { EMPLEADO_IDS } from './useEmpleadoStore';
import { SUCURSAL_IDS } from './useSucursalStore';

const SEED_ENTRIES: NominaEntry[] = [
  {
    id: 'nomina-0001-0000-0000-000000000001',
    empleadoId: EMPLEADO_IDS.ricardoMorales,
    sucursalId: SUCURSAL_IDS.ranchoSanJose,
    fecha: '2024-05-12',
    monto: 12450,
    status: 'paid',
    createdAt: '2024-05-12T00:00:00.000Z',
  },
  {
    id: 'nomina-0002-0000-0000-000000000002',
    empleadoId: EMPLEADO_IDS.elenaGomez,
    sucursalId: SUCURSAL_IDS.invernaderoValle,
    fecha: '2024-05-14',
    monto: 8900,
    status: 'pending',
    createdAt: '2024-05-14T00:00:00.000Z',
  },
  {
    id: 'nomina-0003-0000-0000-000000000003',
    empleadoId: EMPLEADO_IDS.arturoSilva,
    sucursalId: SUCURSAL_IDS.ranchoSanJose,
    fecha: '2024-05-10',
    monto: 15200,
    status: 'overdue',
    createdAt: '2024-05-10T00:00:00.000Z',
  },
  {
    id: 'nomina-0004-0000-0000-000000000004',
    empleadoId: EMPLEADO_IDS.juliaLopez,
    sucursalId: SUCURSAL_IDS.huertoEsperanza,
    fecha: '2024-05-13',
    monto: 11100,
    status: 'paid',
    createdAt: '2024-05-13T00:00:00.000Z',
  },
];

interface NominaState {
  entries: NominaEntry[];
  addEntry: (data: Omit<NominaEntry, 'id' | 'createdAt'>) => void;
  updateEntry: (id: string, data: Partial<Omit<NominaEntry, 'id' | 'createdAt'>>) => void;
  deleteEntry: (id: string) => void;
  getEntriesByDate: (fecha: string) => NominaEntry[];
}

export const useNominaStore = create<NominaState>()(
  persist(
    (set, get) => ({
      entries: SEED_ENTRIES,

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

      getEntriesByDate: (fecha) =>
        get().entries.filter((e) => e.fecha === fecha),
    }),
    {
      name: 'agropay-nomina',
    }
  )
);
