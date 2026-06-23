import { useEffect, useMemo, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useEmpresaStore } from '../../stores/useEmpresaStore';
import { useSucursalStore } from '../../stores/useSucursalStore';
import { usePuestoStore } from '../../stores/usePuestoStore';
import type { FilterContextValue } from '../../context/FilterContext';
import { FilterBar, type FilterDef } from './FilterBar';
import { Sidebar } from './Sidebar';
import './AppLayout.css';

const ROUTE_TITLES: Record<string, string> = {
  '/': 'Dashboard',
  '/empresas': 'Empresas',
  '/sucursales': 'Sucursales',
  '/empleados': 'Empleados',
  '/puestos': 'Puestos',
  '/captura-nomina': 'Captura de Nómina',
  '/configuracion': 'Configuración',
};

const ROUTES_WITH_FILTERBAR = new Set([
  '/empresas',
  '/sucursales',
  '/empleados',
  '/puestos',
  '/captura-nomina',
]);

function routeHasFilterBar(pathname: string): boolean {
  return ROUTES_WITH_FILTERBAR.has(pathname) || /^\/captura-nomina\/.+/.test(pathname);
}

function getPageTitle(pathname: string): string {
  return ROUTE_TITLES[pathname] ?? (/^\/captura-nomina\/.+/.test(pathname) ? 'Detalle de Nómina' : 'AgroPay Manager');
}

function IconBell() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

function IconHelp() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

function useFilterDefs(pathname: string): FilterDef[] {
  const { empresas } = useEmpresaStore();
  const { sucursales } = useSucursalStore();
  const { puestos } = usePuestoStore();

  return useMemo(() => {
    switch (pathname) {
      case '/sucursales':
        return [{
          id: 'empresaId',
          label: 'Empresa',
          options: [
            { value: '', label: 'Todas' },
            ...empresas.map((e) => ({ value: e.id, label: e.nombre })),
          ],
        }];
      case '/empleados':
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
      case '/captura-nomina':
        return [{
          id: 'sucursalId',
          label: 'Sucursal',
          options: [
            { value: '', label: 'Todas' },
            ...sucursales.map((s) => ({ value: s.id, label: s.nombre })),
          ],
        }];
      default:
        if (/^\/captura-nomina\/.+/.test(pathname)) {
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
              <IconBell />
            </button>
            <button className="app-layout__icon-btn" aria-label="Ayuda">
              <IconHelp />
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
