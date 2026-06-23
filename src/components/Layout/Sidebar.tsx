import { NavLink, useNavigate } from 'react-router-dom';
import {
  CaretLeft,
  CaretRight,
  House,
  Buildings,
  MapPin,
  Users,
  Briefcase,
  UserCheck,
  ClipboardText,
  GearSix,
  SignOut,
} from '@phosphor-icons/react';
import './Sidebar.css';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const navigate = useNavigate();

  return (
    <aside className={`sidebar${collapsed ? ' sidebar--collapsed' : ''}`}>
      <div className="sidebar__logo">
        {!collapsed && (
          <div className="sidebar__logo-title">Nómina de Campo</div>
        )}
        <button
          className="sidebar__toggle"
          onClick={onToggle}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <CaretRight size={18} /> : <CaretLeft size={18} />}
        </button>
      </div>

      <nav className="sidebar__nav" aria-label="Navegación principal">
        <NavLink to="/" end className={({ isActive }) => `sidebar__link${isActive ? ' active' : ''}`} title="Dashboard">
          <span className="sidebar__link-icon"><House size={18} /></span>
          {!collapsed && <span>Dashboard</span>}
        </NavLink>

        {!collapsed && <span className="sidebar__section-label">Catálogos</span>}

        <NavLink to="/empresas" className={({ isActive }) => `sidebar__link${isActive ? ' active' : ''}`} title="Empresas">
          <span className="sidebar__link-icon"><Buildings size={18} /></span>
          {!collapsed && <span>Empresas</span>}
        </NavLink>

        <NavLink to="/sucursales" className={({ isActive }) => `sidebar__link${isActive ? ' active' : ''}`} title="Sucursales">
          <span className="sidebar__link-icon"><MapPin size={18} /></span>
          {!collapsed && <span>Sucursales</span>}
        </NavLink>

        <NavLink to="/empleados" className={({ isActive }) => `sidebar__link${isActive ? ' active' : ''}`} title="Empleados">
          <span className="sidebar__link-icon"><Users size={18} /></span>
          {!collapsed && <span>Empleados</span>}
        </NavLink>

        <NavLink to="/puestos" className={({ isActive }) => `sidebar__link${isActive ? ' active' : ''}`} title="Puestos">
          <span className="sidebar__link-icon"><Briefcase size={18} /></span>
          {!collapsed && <span>Puestos</span>}
        </NavLink>

        <NavLink to="/encargados" className={({ isActive }) => `sidebar__link${isActive ? ' active' : ''}`} title="Encargados">
          <span className="sidebar__link-icon"><UserCheck size={18} /></span>
          {!collapsed && <span>Encargados</span>}
        </NavLink>

        {!collapsed && <span className="sidebar__section-label">Operaciones</span>}

        <NavLink to="/captura-nomina" className={({ isActive }) => `sidebar__link${isActive ? ' active' : ''}`} title="Captura de Nómina">
          <span className="sidebar__link-icon"><ClipboardText size={18} /></span>
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
          <GearSix size={18} />
          {!collapsed && <span>Configuración</span>}
        </NavLink>

        <a href="#logout" className="sidebar__bottom-link sidebar__bottom-link--logout" title="Cerrar sesión">
          <SignOut size={18} />
          {!collapsed && <span>Cerrar sesión</span>}
        </a>
      </div>
    </aside>
  );
}
