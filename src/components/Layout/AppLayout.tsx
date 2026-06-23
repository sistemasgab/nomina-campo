import { useEffect, useMemo, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Bell, Question } from '@phosphor-icons/react';

import { useEmpresaStore } from '../../stores/useEmpresaStore';
import { useSucursalStore } from '../../stores/useSucursalStore';
import { usePuestoStore } from '../../stores/usePuestoStore';
import type { FilterContextValue } from '../../context/FilterContext';
import { FilterBar, type FilterDef } from './FilterBar';
import { Sidebar } from './Sidebar';
import './AppLayout.css';

const ROUTE_TITLES: Record<string, string> = {
  '/general/empresas': 'Empresas',
  '/general/sucursales': 'Sucursales',
  '/nomina': 'Dashboard',
  '/nomina/empleados': 'Empleados',
  '/nomina/puestos': 'Puestos',
  '/nomina/encargados': 'Encargados',
  '/nomina/captura': 'Captura de Nomina',
  '/preparaciones': 'Preparaciones Agricolas',
  '/configuracion': 'Configuracion',
};

const ROUTES_WITH_FILTERBAR = new Set([
  '/general/empresas',
  '/general/sucursales',
  '/nomina/empleados',
  '/nomina/puestos',
  '/nomina/encargados',
  '/nomina/captura',
]);

function routeHasFilterBar(pathname: string): boolean {
  return ROUTES_WITH_FILTERBAR.has(pathname) || /^\/nomina\/captura\/.+/.test(pathname);
}

function getPageTitle(pathname: string): string {
  return ROUTE_TITLES[pathname] ?? (/^\/nomina\/captura\/.+/.test(pathname) ? 'Detalle de Nomina' : 'AgroPay Manager');
}

function useFilterDefs(pathname: string): FilterDef[] {
  const { empresas } = useEmpresaStore();
  const { sucursales } = useSucursalStore();
  const { puestos } = usePuestoStore();

  return useMemo(() => {
    switch (pathname) {
      case '/general/sucursales':
        return [{
          id: 'empresaId',
          label: 'Empresa',
          options: [
            { value: '', label: 'Todas' },
            ...empresas.map((e) => ({ value: e.id, label: e.nombre })),
          ],
        }];
      case '/nomina/empleados':
        return [
          {
            id: 'estado',
            label: 'Estado',
            options: [
              { value: '', label: 'Todos' },
              { value: 'activo', label: 'Activo' },
              { value: 'inactivo', label: 'Inactivo' },
            ],
          },
          {
            id: 'sucursalId',
            label: 'Sucursal',
            options: [
              { value: '', label: 'Todas' },
              ...sucursales.map((s) => ({ value: s.id, label: s.nombre })),
            ],
          },
          {
            id: 'puestoId',
            label: 'Puesto',
            options: [
              { value: '', label: 'Todos' },
              ...puestos.map((p) => ({ value: p.id, label: p.nombre })),
            ],
          },
        ];
      case '/nomina/encargados':
        return [{
          id: 'estado',
          label: 'Estado',
          options: [
            { value: '', label: 'Todos' },
            { value: 'activo', label: 'Activo' },
            { value: 'inactivo', label: 'Inactivo' },
          ],
        }];
      case '/nomina/captura':
        return [{
          id: 'sucursalId',
          label: 'Sucursal',
          options: [
            { value: '', label: 'Todas' },
            ...sucursales.map((s) => ({ value: s.id, label: s.nombre })),
          ],
        }];
      default:
        if (/^\/nomina\/captura\/.+/.test(pathname)) {
          return [{
            id: 'status',
            label: 'Estatus',
            options: [
              { value: '', label: 'Todos' },
              { value: 'pending', label: 'Pendiente' },
              { value: 'paid', label: 'Pagado' },
              { value: 'overdue', label: 'Vencido' },
            ],
          }];
        }
        return [];
    }
  }, [pathname, empresas, sucursales, puestos]);
}

export function AppLayout() {
  const location = useLocation();
  const pageTitle = getPageTitle(location.pathname);
  const filterDefs = useFilterDefs(location.pathname);

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<Record<string, string>>({});

  useEffect(() => {
    setSearch('');
    setFilters({});
  }, [location.pathname]);

  function setFilter(id: string, value: string) {
    setFilters((prev) => ({ ...prev, [id]: value }));
  }

  function clearFilters() {
    setSearch('');
    setFilters({});
  }

  const outletContext: FilterContextValue = {
    search,
    setSearch,
    filters,
    setFilter,
    clearFilters,
  };

  return (
    <div className="app-layout">
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed((c) => !c)} />
      <div className="app-layout__main">
        <header className="app-layout__header">
          <h1 className="app-layout__page-title">{pageTitle}</h1>

          <div className="app-layout__header-actions">
            <button className="app-layout__icon-btn" aria-label="Notificaciones">
              <Bell size={18} />
            </button>
            <button className="app-layout__icon-btn" aria-label="Ayuda">
              <Question size={18} />
            </button>
            <div className="app-layout__avatar" role="button" aria-label="Perfil de usuario" tabIndex={0}>
              AU
            </div>
          </div>
        </header>

        {routeHasFilterBar(location.pathname) && (
          <FilterBar
            search={search}
            onSearchChange={setSearch}
            filters={filters}
            onFilterChange={setFilter}
            filterDefs={filterDefs}
          />
        )}

        <main className="app-layout__content">
          <Outlet context={outletContext} />
        </main>
      </div>
    </div>
  );
}
