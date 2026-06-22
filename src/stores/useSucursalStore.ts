import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Sucursal } from './types';
import { EMPRESA_IDS } from './useEmpresaStore';

// Fixed UUIDs for seed data so cross-store references work
export const SUCURSAL_IDS = {
  ranchoSanJose: 'sucursal-0001-0000-0000-000000000001',
  invernaderoValle: 'sucursal-0002-0000-0000-000000000002',
  huertoEsperanza: 'sucursal-0003-0000-0000-000000000003',
} as const;

const SEED_SUCURSALES: Sucursal[] = [
  {
    id: SUCURSAL_IDS.ranchoSanJose,
    empresaId: EMPRESA_IDS.agricolaNorte,
    nombre: 'Rancho San José',
    ubicacion: 'Municipio de Hermosillo, Sonora',
    createdAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: SUCURSAL_IDS.invernaderoValle,
    empresaId: EMPRESA_IDS.agricolaNorte,
    nombre: 'Invernaderos del Valle',
    ubicacion: 'Valle del Yaqui, Sonora',
    createdAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: SUCURSAL_IDS.huertoEsperanza,
    empresaId: EMPRESA_IDS.camposSol,
    nombre: 'Huerto La Esperanza',
    ubicacion: 'Culiacán, Sinaloa',
    createdAt: '2024-01-01T00:00:00.000Z',
  },
];

interface SucursalState {
  sucursales: Sucursal[];
  addSucursal: (data: Omit<Sucursal, 'id' | 'createdAt'>) => void;
  updateSucursal: (id: string, data: Partial<Omit<Sucursal, 'id' | 'createdAt'>>) => void;
  deleteSucursal: (id: string) => void;
}

export const useSucursalStore = create<SucursalState>()(
  persist(
    (set) => ({
      sucursales: SEED_SUCURSALES,

      addSucursal: (data) =>
        set((state) => ({
          sucursales: [
            ...state.sucursales,
            {
              ...data,
              id: crypto.randomUUID(),
              createdAt: new Date().toISOString(),
            },
          ],
        })),

      updateSucursal: (id, data) =>
        set((state) => ({
          sucursales: state.sucursales.map((s) =>
            s.id === id ? { ...s, ...data } : s
          ),
        })),

      deleteSucursal: (id) =>
        set((state) => ({
          sucursales: state.sucursales.filter((s) => s.id !== id),
        })),
    }),
    {
      name: 'agropay-sucursales',
    }
  )
);
