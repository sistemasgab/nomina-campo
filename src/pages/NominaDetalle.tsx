import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useNominaStore } from '../stores/useNominaStore';
import { useEmpleadoStore } from '../stores/useEmpleadoStore';
import { useSucursalStore } from '../stores/useSucursalStore';
import { usePageFilters } from '../context/FilterContext';
import { Modal } from '../components/ui/Modal';
import { StatusBadge } from '../components/ui/StatusBadge';
import type { NominaEntry, NominaStatus } from '../stores/types';
import './Empresas.css';
import './CapturaNomina.css';

interface EntryFormData {
  empleadoId: string;
  monto: string;
  status: NominaStatus;
}

const EMPTY_FORM: EntryFormData = {
  empleadoId: '',
  monto: '',
  status: 'pending',
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

export function NominaDetalle() {
  const { nominaId } = useParams<{ nominaId: string }>();
  const navigate = useNavigate();
  const { nominas, entries, addEntry, updateEntry, deleteEntry } = useNominaStore();
  const { empleados } = useEmpleadoStore();
  const { sucursales } = useSucursalStore();

  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState<NominaEntry | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<NominaEntry | null>(null);
  const [form, setForm] = useState<EntryFormData>(EMPTY_FORM);

  const { search, filters } = usePageFilters();

  const nomina = nominas.find((n) => n.id === nominaId);
  const empleadoMap = new Map(empleados.map((e) => [e.id, e]));
  const sucursalMap = new Map(sucursales.map((s) => [s.id, s.nombre]));

  const nominaEntries = entries.filter((e) => {
    if (e.nominaId !== nominaId) return false;
    if (filters.status && e.status !== filters.status) return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    const emp = empleadoMap.get(e.empleadoId);
    const fullName = emp ? `${emp.nombre} ${emp.apellido}` : '';
    return fullName.toLowerCase().includes(q);
  });

  if (!nomina) {
    return (
      <div className="page">
        <div className="page__header">
          <h2 className="page__title">Nomina no encontrada</h2>
          <button className="btn-ghost" onClick={() => navigate('/nomina/captura')}>
            Volver
          </button>
        </div>
      </div>
    );
  }

  const allEntries = entries.filter((e) => e.nominaId === nominaId);
  const totalMonto = allEntries.reduce((sum, e) => sum + e.monto, 0);
  const hasActiveFilter = !!search.trim() || !!filters.status;

  function openAdd() {
    setEditTarget(null);
    setForm({
      ...EMPTY_FORM,
      empleadoId: empleados[0]?.id ?? '',
    });
    setShowForm(true);
  }

  function openEdit(entry: NominaEntry) {
    setEditTarget(entry);
    setForm({
      empleadoId: entry.empleadoId,
      monto: String(entry.monto),
      status: entry.status,
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
    if (!form.empleadoId) return;
    const payload = {
      empleadoId: form.empleadoId,
      monto: parseFloat(form.monto) || 0,
      status: form.status,
    };
    if (editTarget) {
      updateEntry(editTarget.id, payload);
    } else {
      addEntry({ ...payload, nominaId: nomina!.id });
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
        <div>
          <button className="btn-ghost" onClick={() => navigate('/nomina/captura')} style={{ marginBottom: '0.5rem' }}>
            &larr; Volver a nominas
          </button>
          <h2 className="page__title">
            {nomina.folio} — {sucursalMap.get(nomina.sucursalId) ?? nomina.sucursalId}
          </h2>
          <p style={{ color: 'var(--color-neutral-500)', fontSize: 'var(--font-size-sm)', margin: 0 }}>
            {new Date(nomina.fechaInicio).toLocaleDateString('es-MX')} — {new Date(nomina.fechaFin).toLocaleDateString('es-MX')} &middot; Total: {formatCurrency(totalMonto)} &middot; {nominaEntries.length} entrada{nominaEntries.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button className="btn-primary" onClick={openAdd}>
          + Agregar Entrada
        </button>
      </div>

      <div className="table-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Empleado</th>
              <th>Monto</th>
              <th>Estatus</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {nominaEntries.length === 0 ? (
              <tr>
                <td colSpan={4} className="table-empty">
                  {hasActiveFilter ? 'No se encontraron entradas.' : 'No hay entradas en esta nomina.'}
                </td>
              </tr>
            ) : (
              nominaEntries.map((entry) => {
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
                    <td>{formatCurrency(entry.monto)}</td>
                    <td><StatusBadge status={entry.status} /></td>
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
        title={editTarget ? 'Editar Entrada' : 'Nueva Entrada'}
      >
        <form className="form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="entry-empleado">Empleado</label>
            <select
              id="entry-empleado"
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
            <label className="form-label" htmlFor="entry-monto">Monto (MXN)</label>
            <input
              id="entry-monto"
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
            <label className="form-label" htmlFor="entry-status">Estatus</label>
            <select
              id="entry-status"
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
        title="Confirmar eliminacion"
      >
        <div className="confirm-body">
          <p>
            Se eliminara esta entrada de nomina.
            Esta accion no se puede deshacer.
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
