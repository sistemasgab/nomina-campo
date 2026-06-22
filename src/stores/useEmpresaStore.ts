import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Empresa } from './types';

// Fixed UUIDs for seed data so cross-store references work
export const EMPRESA_IDS = {
  agricolaNorte: 'empresa-0001-0000-0000-000000000001',
  camposSol: 'empresa-0002-0000-0000-000000000002',
} as const;

const SEED_EMPRESAS: Empresa[] = [
  {
    id: EMPRESA_IDS.agricolaNorte,
    nombre: 'Agrícola del Norte',
    rfc: 'ANO850101ABC',
    direccion: 'Carretera Federal km 12, Sonora',
    createdAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: EMPRESA_IDS.camposSol,
    nombre: 'Campos del Sol',
    rfc: 'CDS900215DEF',
    direccion: 'Blvd. Agrícola 456, Sinaloa',
    createdAt: '2024-01-01T00:00:00.000Z',
  },
];

interface EmpresaState {
  empresas: Empresa[];
  addEmpresa: (data: Omit<Empresa, 'id' | 'createdAt'>) => void;
  updateEmpresa: (id: string, data: Partial<Omit<Empresa, 'id' | 'createdAt'>>) => void;
  deleteEmpresa: (id: string) => void;
}

export const useEmpresaStore = create<EmpresaState>()(
  persist(
    (set) => ({
      empresas: SEED_EMPRESAS,

      addEmpresa: (data) =>
        set((state) => ({
          empresas: [
            ...state.empresas,
            {
              ...data,
              id: crypto.randomUUID(),
              createdAt: new Date().toISOString(),
            },
          ],
        })),

      updateEmpresa: (id, data) =>
        set((state) => ({
          empresas: state.empresas.map((e) =>
            e.id === id ? { ...e, ...data } : e
          ),
        })),

      deleteEmpresa: (id) =>
        set((state) => ({
          empresas: state.empresas.filter((e) => e.id !== id),
        })),
    }),
    {
      name: 'agropay-empresas',
    }
  )
);
