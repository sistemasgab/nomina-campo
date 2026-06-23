import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Encargado } from './types';

const SEED_ENCARGADOS: Encargado[] = [
  {
    id: 'encargado-0001-0000-0000-000000000001',
    nombre: 'Carlos Mendoza',
    activo: true,
    createdAt: '2023-01-10T00:00:00.000Z',
  },
  {
    id: 'encargado-0002-0000-0000-000000000002',
    nombre: 'Laura Herrera',
    activo: true,
    createdAt: '2023-03-22T00:00:00.000Z',
  },
  {
    id: 'encargado-0003-0000-0000-000000000003',
    nombre: 'Fernando Ruiz',
    activo: false,
    createdAt: '2022-11-05T00:00:00.000Z',
  },
];

interface EncargadoState {
  encargados: Encargado[];
  addEncargado: (data: Omit<Encargado, 'id' | 'createdAt'>) => void;
  updateEncargado: (id: string, data: Partial<Omit<Encargado, 'id' | 'createdAt'>>) => void;
  deleteEncargado: (id: string) => void;
}

export const useEncargadoStore = create<EncargadoState>()(
  persist(
    (set) => ({
      encargados: SEED_ENCARGADOS,

      addEncargado: (data) =>
        set((state) => ({
          encargados: [
            ...state.encargados,
            {
              ...data,
              id: crypto.randomUUID(),
              createdAt: new Date().toISOString(),
            },
          ],
        })),

      updateEncargado: (id, data) =>
        set((state) => ({
          encargados: state.encargados.map((e) =>
            e.id === id ? { ...e, ...data } : e
          ),
        })),

      deleteEncargado: (id) =>
        set((state) => ({
          encargados: state.encargados.filter((e) => e.id !== id),
        })),
    }),
    {
      name: 'agropay-encargados',
    }
  )
);
