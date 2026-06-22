import { Link, useNavigate } from 'react-router-dom';
import { useEmpleadoStore } from '../stores/useEmpleadoStore';
import { useSucursalStore } from '../stores/useSucursalStore';
import { useNominaStore } from '../stores/useNominaStore';
import { StatusBadge } from '../components/ui/StatusBadge';
import './Dashboard.css';

function getInitials(nombre: string, apellido: string) {
  return `${nombre[0] ?? ''}${apellido[0] ?? ''}`.toUpperCase();
}

function getAvatarIndex(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash + id.charCodeAt(i)) % 8;
  return hash;
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(amount);
}

function IconPeople() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function IconLocation() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

export function Dashboard() {
  const navigate = useNavigate();
  const { empleados } = useEmpleadoStore();
  const { sucursales } = useSucursalStore();
  const { nominas, entries } = useNominaStore();

  const recentEntries = entries.slice(0, 8);
  const empleadoMap = new Map(empleados.map((e) => [e.id, e]));
  const sucursalMap = new Map(sucursales.map((s) => [s.id, s]));
  const nominaMap = new Map(nominas.map((n) => [n.id, n]));

  return (
    <div className="dashboard">
      <div className="dashboard__header">
        <div className="dashboard__header-left">
          <h2 className="dashboard__title">Dashboard Overview</h2>
          <p className="dashboard__subtitle">Estado de las operaciones agrícolas — Mayo 2024</p>
        </div>
        <div className="dashboard__header-right">
          <div className="dashboard__date-range">
            📅 01 May — 31 May 2024
          </div>
          <button className="dashboard__export-btn">
            ↓ Exportar PDF
          </button>
        </div>
      </div>

      <div className="dashboard__stats">
        <div className="stat-card">
          <div className="stat-card__header">
            <span className="stat-card__label">Total Empleados</span>
            <div className="stat-card__icon"><IconPeople /></div>
          </div>
          <div className="stat-card__value">{empleados.length}</div>
          <div className="stat-card__sub">+12 desde el mes pasado</div>
        </div>

        <div className="stat-card">
          <div className="stat-card__header">
            <span className="stat-card__label">Sucursales Activas</span>
            <div className="stat-card__icon"><IconLocation /></div>
          </div>
          <div className="stat-card__value">{sucursales.length}</div>
          <div className="stat-card__sub">En 3 regiones</div>
        </div>

        <div className="stat-card stat-card--period">
          <div className="stat-card__header">
            <span className="stat-card__label">Período de Nómina</span>
          </div>
          <div className="stat-card__period-header">
            <span className="stat-card__period-label">Quincenal</span>
            <span className="stat-card__period-badge">● Activo</span>
          </div>
          <div className="stat-card__progress-bar">
            <div className="stat-card__progress-fill" style={{ width: '82%' }} />
          </div>
          <div className="stat-card__progress-meta">
            <span>Inicio: 01 May</span>
            <span>82% completado</span>
            <span>Fin: 15 May</span>
          </div>
        </div>
      </div>

      <div className="dashboard__section">
        <div className="dashboard__section-header">
          <h3 className="dashboard__section-title">Capturas Recientes de Nómina</h3>
          <Link to="/captura-nomina" className="dashboard__view-all">Ver todas →</Link>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>Sucursal</th>
              <th>Empleado</th>
              <th>Monto</th>
              <th>Estatus</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {recentEntries.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', color: 'var(--color-neutral-500)', padding: 'var(--spacing-xl)' }}>
                  Sin capturas recientes
                </td>
              </tr>
            ) : (
              recentEntries.map((entry) => {
                const emp = empleadoMap.get(entry.empleadoId);
                const nomina = nominaMap.get(entry.nominaId);
                const suc = nomina ? sucursalMap.get(nomina.sucursalId) : undefined;
                const fullName = emp ? `${emp.nombre} ${emp.apellido}` : entry.empleadoId;
                const initials = emp ? getInitials(emp.nombre, emp.apellido) : '??';
                const avatarIdx = getAvatarIndex(entry.empleadoId);

                return (
                  <tr key={entry.id}>
                    <td>{suc?.nombre ?? '—'}</td>
                    <td>
                      <div className="employee-cell">
                        <div className={`avatar avatar--${avatarIdx}`}>{initials}</div>
                        {fullName}
                      </div>
                    </td>
                    <td>{formatCurrency(entry.monto)}</td>
                    <td><StatusBadge status={entry.status} /></td>
                    <td>{nomina ? `${new Date(nomina.fechaInicio).toLocaleDateString('es-MX')} — ${new Date(nomina.fechaFin).toLocaleDateString('es-MX')}` : '—'}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <button
        className="dashboard__fab"
        aria-label="Nueva captura de nómina"
        onClick={() => navigate('/captura-nomina')}
      >
        +
      </button>
    </div>
  );
}
