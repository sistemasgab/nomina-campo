import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  CaretLeft,
  CaretRight,
  ArrowLeft,
  Buildings,
  MapPin,
  Users,
  Briefcase,
  UserCheck,
  ClipboardText,
  Plant,
  GearSix,
  SignOut,
  House,
} from '@phosphor-icons/react';
import './Sidebar.css';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

type ModuleKey = 'general' | 'nomina' | 'preparaciones' | null;

const MODULE_LABELS: Record<string, string> = {
  general: 'General',
  nomina: 'Nomina de Campo',
  preparaciones: 'Preparaciones',
};

function getActiveModule(pathname: string): ModuleKey {
  if (pathname.startsWith('/general')) return 'general';
  if (pathname.startsWith('/nomina')) return 'nomina';
  if (pathname.startsWith('/preparaciones')) return 'preparaciones';
  return null;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const activeModule = getActiveModule(location.pathname);

  return (
    <aside className={`sidebar${collapsed ? ' sidebar--collapsed' : ''}`}>
      <div className="sidebar__logo">
        {!collapsed && (
          <div className="sidebar__logo-title">
            {activeModule ? MODULE_LABELS[activeModule] : 'AgroPay Manager'}
          </div>
        )}
        <button
          className="sidebar__toggle"
          onClick={onToggle}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <CaretRight size={18} /> : <CaretLeft size={18} />}
        </button>
      </div>

      <nav className="sidebar__nav" aria-label="Navegacion principal">
        <button
          className="sidebar__link sidebar__back-link"
          onClick={() => navigate('/')}
          title="Volver a modulos"
        >
          <span className="sidebar__link-icon"><ArrowLeft size={18} /></span>
          {!collapsed && <span>Modulos</span>}
        </button>

        {activeModule === 'general' && (
          <>
            <NavLink to="/general/empresas" className={({ isActive }) => `sidebar__link${isActive ? ' active' : ''}`} title="Empresas">
              <span className="sidebar__link-icon"><Buildings size={18} /></span>
              {!collapsed && <span>Empresas</span>}
            </NavLink>

            <NavLink to="/general/sucursales" className={({ isActive }) => `sidebar__link${isActive ? ' active' : ''}`} title="Sucursales">
              <span className="sidebar__link-icon"><MapPin size={18} /></span>
              {!collapsed && <span>Sucursales</span>}
            </NavLink>
          </>
        )}

        {activeModule === 'nomina' && (
          <>
            <NavLink to="/nomina" end className={({ isActive }) => `sidebar__link${isActive ? ' active' : ''}`} title="Dashboard">
              <span className="sidebar__link-icon"><House size={18} /></span>
              {!collapsed && <span>Dashboard</span>}
            </NavLink>

            {!collapsed && <span className="sidebar__section-label">Catalogos</span>}

            <NavLink to="/nomina/empleados" className={({ isActive }) => `sidebar__link${isActive ? ' active' : ''}`} title="Empleados">
              <span className="sidebar__link-icon"><Users size={18} /></span>
              {!collapsed && <span>Empleados</span>}
            </NavLink>

            <NavLink to="/nomina/puestos" className={({ isActive }) => `sidebar__link${isActive ? ' active' : ''}`} title="Puestos">
              <span className="sidebar__link-icon"><Briefcase size={18} /></span>
              {!collapsed && <span>Puestos</span>}
            </NavLink>

            <NavLink to="/nomina/encargados" className={({ isActive }) => `sidebar__link${isActive ? ' active' : ''}`} title="Encargados">
              <span className="sidebar__link-icon"><UserCheck size={18} /></span>
              {!collapsed && <span>Encargados</span>}
            </NavLink>

            {!collapsed && <span className="sidebar__section-label">Operaciones</span>}

            <NavLink to="/nomina/captura" className={({ isActive }) => `sidebar__link${isActive ? ' active' : ''}`} title="Captura de Nomina">
              <span className="sidebar__link-icon"><ClipboardText size={18} /></span>
              {!collapsed && <span>Captura de Nomina</span>}
            </NavLink>
          </>
        )}

        {activeModule === 'preparaciones' && (
          <>
            <NavLink to="/preparaciones" end className={({ isActive }) => `sidebar__link${isActive ? ' active' : ''}`} title="Inicio">
              <span className="sidebar__link-icon"><Plant size={18} /></span>
              {!collapsed && <span>Inicio</span>}
            </NavLink>
          </>
        )}
      </nav>

      <div className="sidebar__bottom">
        {!collapsed && activeModule === 'nomina' && (
          <button
            className="sidebar__new-payroll"
            onClick={() => navigate('/nomina/captura')}
          >
            + Nueva Nomina
          </button>
        )}

        <NavLink to="/configuracion" className={({ isActive }) => `sidebar__bottom-link${isActive ? ' active' : ''}`} title="Configuracion">
          <GearSix size={18} />
          {!collapsed && <span>Configuracion</span>}
        </NavLink>

        <a href="#logout" className="sidebar__bottom-link sidebar__bottom-link--logout" title="Cerrar sesion">
          <SignOut size={18} />
          {!collapsed && <span>Cerrar sesion</span>}
        </a>
      </div>
    </aside>
  );
}
