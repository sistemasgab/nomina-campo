import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import './AppLayout.css';

const ROUTE_TITLES: Record<string, string> = {
  '/': 'Dashboard',
  '/empresas': 'Empresas',
  '/sucursales': 'Sucursales',
  '/empleados': 'Empleados',
  '/puestos': 'Puestos',
  '/captura-nomina': 'Captura de Nómina',
};

function IconSearch() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
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

export function AppLayout() {
  const location = useLocation();
  const pageTitle = ROUTE_TITLES[location.pathname] ?? 'AgroPay Manager';

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="app-layout__main">
        <header className="app-layout__header">
          <div className="app-layout__header-left">
            <h1 className="app-layout__page-title">{pageTitle}</h1>
            <div className="app-layout__search">
              <span className="app-layout__search-icon"><IconSearch /></span>
              <input
                className="app-layout__search-input"
                type="search"
                placeholder="Buscar..."
                aria-label="Buscar"
              />
            </div>
          </div>

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

        <main className="app-layout__content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
