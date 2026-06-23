import { NavLink, useNavigate } from 'react-router-dom';
import './Sidebar.css';

function IconChevronLeft() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function IconChevronRight() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

function IconHouse() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function IconBuilding() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M9 3v18M15 3v18M3 9h18M3 15h18" />
    </svg>
  );
}

function IconMapPin() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function IconUsers() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function IconBriefcase() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
      <line x1="12" y1="12" x2="12" y2="12" />
      <path d="M2 12h20" />
    </svg>
  );
}

function IconClipboard() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
      <line x1="9" y1="12" x2="15" y2="12" />
      <line x1="9" y1="16" x2="13" y2="16" />
    </svg>
  );
}

function IconSettings() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14" />
      <path d="M12 2v2M12 20v2M2 12h2M20 12h2" />
    </svg>
  );
}

function IconLogout() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const navigate = useNavigate();

  return (
    <aside className={`sidebar${collapsed ? ' sidebar--collapsed' : ''}`}>
      <div className="sidebar__logo">
        {!collapsed && (
          <div className="sidebar__logo-title">AgroPay Manager</div>
        )}
        <button
          className="sidebar__toggle"
          onClick={onToggle}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <IconChevronRight /> : <IconChevronLeft />}
        </button>
      </div>

      <nav className="sidebar__nav" aria-label="Navegación principal">
        <NavLink to="/" end className={({ isActive }) => `sidebar__link${isActive ? ' active' : ''}`} title="Dashboard">
          <span className="sidebar__link-icon"><IconHouse /></span>
          {!collapsed && <span>Dashboard</span>}
        </NavLink>

        {!collapsed && <span className="sidebar__section-label">Catálogos</span>}

        <NavLink to="/empresas" className={({ isActive }) => `sidebar__link${isActive ? ' active' : ''}`} title="Empresas">
          <span className="sidebar__link-icon"><IconBuilding /></span>
          {!collapsed && <span>Empresas</span>}
        </NavLink>

        <NavLink to="/sucursales" className={({ isActive }) => `sidebar__link${isActive ? ' active' : ''}`} title="Sucursales">
          <span className="sidebar__link-icon"><IconMapPin /></span>
          {!collapsed && <span>Sucursales</span>}
        </NavLink>

        <NavLink to="/empleados" className={({ isActive }) => `sidebar__link${isActive ? ' active' : ''}`} title="Empleados">
          <span className="sidebar__link-icon"><IconUsers /></span>
          {!collapsed && <span>Empleados</span>}
        </NavLink>

        <NavLink to="/puestos" className={({ isActive }) => `sidebar__link${isActive ? ' active' : ''}`} title="Puestos">
          <span className="sidebar__link-icon"><IconBriefcase /></span>
          {!collapsed && <span>Puestos</span>}
        </NavLink>

        {!collapsed && <span className="sidebar__section-label">Operaciones</span>}

        <NavLink to="/captura-nomina" className={({ isActive }) => `sidebar__link${isActive ? ' active' : ''}`} title="Captura de Nómina">
          <span className="sidebar__link-icon"><IconClipboard /></span>
          {!collapsed && <span>Captura de Nómina</span>}
        </NavLink>
      </nav>

      <div className="sidebar__bottom">
        {!collapsed && (
          <button
            className="sidebar__new-payroll"
            onClick={() => navigate('/captura-nomina')}
          >
            + Nueva Nómina
          </button>
        )}

        <NavLink to="/configuracion" className={({ isActive }) => `sidebar__bottom-link${isActive ? ' active' : ''}`} title="Configuración">
          <IconSettings />
          {!collapsed && <span>Configuración</span>}
        </NavLink>

        <a href="#logout" className="sidebar__bottom-link sidebar__bottom-link--logout" title="Cerrar sesión">
          <IconLogout />
          {!collapsed && <span>Cerrar sesión</span>}
        </a>
      </div>
    </aside>
  );
}
