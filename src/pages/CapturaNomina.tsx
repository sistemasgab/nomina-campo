import { useState } from 'react';
import { useNominaStore } from '../stores/useNominaStore';
import { useEmpleadoStore } from '../stores/useEmpleadoStore';
import { useSucursalStore } from '../stores/useSucursalStore';
import { Modal } from '../components/ui/Modal';
import { StatusBadge } from '../components/ui/StatusBadge';
import type { NominaEntry, NominaStatus } from '../stores/types';
import './Empresas.css';
import './CapturaNomina.css';

interface NominaFormData {
  empleadoId: string;
  sucursalId: string;
  monto: string;
  status: NominaStatus;
  fecha: string;
}

const EMPTY_FORM: NominaFormData = {
  empleadoId: '',
  sucursalId: '',
  monto: '',
  status: 'pending',
  fecha: new Date().toISOString().split('T')[0],
};

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

export function CapturaNomina() {
  const { entries, addEntry, updateEntry, deleteEntry } = useNominaStore();
  const { empleados } = useEmpleadoStore();
  const { sucursales } = useSucursalStore();

  const [filterDate, setFilterDate] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState<NominaEntry | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<NominaEntry | null>(null);
  const [form, setForm] = useState<NominaFormData>(EMPTY_FORM);

  const empleadoMap = new Map(empleados.map((e) => [e.id, e]));
  const sucursalMap = new Map(sucursales.map((s) => [s.id, s.nombre]));

  const filteredEntries = filterDate
    ? entries.filter((e) => e.fecha.startsWith(filterDate))
    : entries;

  function openAdd() {
    setEditTarget(null);
    setForm({
      ...EMPTY_FORM,
      empleadoId: empleados[0]?.id ?? '',
      sucursalId: sucursales[0]?.id ?? '',
    });
    setShowForm(true);
  }

  function openEdit(entry: NominaEntry) {
    setEditTarget(entry);
    setForm({
      empleadoId: entry.empleadoId,
      sucursalId: entry.sucursalId,
      monto: String(entry.monto),
      status: entry.status,
      fecha: entry.fecha,
    });
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditTarget(null);
    setForm(EMPTY_FORM);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.empleadoId || !form.sucursalId) return;
    const payload = {
      empleadoId: form.empleadoId,
      sucursalId: form.sucursalId,
      monto: parseFloat(form.monto) || 0,
      status: form.status,
      fecha: form.fecha,
    };
    if (editTarget) {
      updateEntry(editTarget.id, payload);
    } else {
      addEntry(payload);
    }
    closeForm();
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleDelete() {
    if (deleteTarget) {
      deleteEntry(deleteTarget.id);
      setDeleteTarget(null);
    }
  }

  return (
    <div className="page">
      <div className="page__header">
        <h2 className="page__title">Captura de Nómina</h2>
        <button className="btn-primary" onClick={openAdd}>
          + Agregar Entrada
        </button>
      </div>

      {/* Date filter */}
      <div className="nomina-filter-bar">
        <span className="nomina-filter-bar__label">Filtrar por fecha:</span>
        <input
          className="form-input"
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          style={{ width: 'auto' }}
        />
        {filterDate && (
          <button className="btn-ghost" onClick={() => setFilterDate('')}>Limpiar filtro</button>
        )}
      </div>

      <div className="table-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Empleado</th>
              <th>Sucursal</th>
              <th>Monto</th>
              <th>Estatus</th>
              <th>Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredEntries.length === 0 ? (
              <tr>
                <td colSpan={6} className="table-empty">No hay entradas de nómina{filterDate ? ' para esta fecha' : ''}.</td>
              </tr>
            ) : (
              filteredEntries.map((entry) => {
                const emp = empleadoMap.get(entry.empleadoId);
                const fullName = emp ? `${emp.nombre} ${emp.apellido}` : entry.empleadoId;
                const initials = emp ? getInitials(emp.nombre, emp.apellido) : '??';
                const avatarIdx = getAvatarIndex(entry.empleadoId);

                return (
                  <tr key={entry.id}>
                    <td>
                      <div className="employee-cell">
                        <div className={`avatar avatar--${avatarIdx}`}>{initials}</div>
                        {fullName}
                      </div>
                    </td>
                    <td>{sucursalMap.get(entry.sucursalId) ?? entry.sucursalId}</td>
                    <td>{formatCurrency(entry.monto)}</td>
                    <td><StatusBadge status={entry.status} /></td>
                    <td>{new Date(entry.fecha).toLocaleDateString('es-MX')}</td>
                    <td>
                      <div className="data-table__actions">
                        <button className="btn-ghost" onClick={() => openEdit(entry)}>Editar</button>
                        <button className="btn-danger" onClick={() => setDeleteTarget(entry)}>Eliminar</button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={showForm}
        onClose={closeForm}
        title={editTarget ? 'Editar Entrada' : 'Nueva Entrada de Nómina'}
      >
        <form className="form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="nom-empleado">Empleado</label>
            <select
              id="nom-empleado"
              className="form-select"
              name="empleadoId"
              value={form.empleadoId}
              onChange={handleChange}
              required
            >
              <option value="">Seleccionar empleado...</option>
              {empleados.map((e) => (
                <option key={e.id} value={e.id}>{e.nombre} {e.apellido}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="nom-sucursal">Sucursal</label>
            <select
              id="nom-sucursal"
              className="form-select"
              name="sucursalId"
              value={form.sucursalId}
              onChange={handleChange}
              required
            >
              <option value="">Seleccionar sucursal...</option>
              {sucursales.map((s) => (
                <option key={s.id} value={s.id}>{s.nombre}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="nom-monto">Monto (MXN)</label>
            <input
              id="nom-monto"
              className="form-input"
              name="monto"
              type="number"
              min="0"
              step="0.01"
              value={form.monto}
              onChange={handleChange}
              placeholder="0.00"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="nom-status">Estatus</label>
            <select
              id="nom-status"
              className="form-select"
              name="status"
              value={form.status}
              onChange={handleChange}
            >
              <option value="pending">Pendiente</option>
              <option value="paid">Pagado</option>
              <option value="overdue">Vencido</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="nom-fecha">Fecha</label>
            <input
              id="nom-fecha"
              className="form-input"
              name="fecha"
              type="date"
              value={form.fecha}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-actions">
            <button type="button" className="btn-ghost" onClick={closeForm}>Cancelar</button>
            <button type="submit" className="btn-primary">
              {editTarget ? 'Guardar cambios' : 'Crear Entrada'}
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Confirmar eliminación"
      >
        <div className="confirm-body">
          <p>
            ¿Estás seguro de que querés eliminar esta entrada de nómina?
            Esta acción no se puede deshacer.
          </p>
          <div className="confirm-actions">
            <button className="btn-ghost" onClick={() => setDeleteTarget(null)}>Cancelar</button>
            <button className="btn-danger" onClick={handleDelete}>Eliminar</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
