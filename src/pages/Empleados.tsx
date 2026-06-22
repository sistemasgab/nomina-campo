import { useState } from 'react';
import { useEmpleadoStore } from '../stores/useEmpleadoStore';
import { usePuestoStore } from '../stores/usePuestoStore';
import { useSucursalStore } from '../stores/useSucursalStore';
import { Modal } from '../components/ui/Modal';
import type { Empleado } from '../stores/types';
import './Empresas.css';
import './Empleados.css';

interface EmpleadoFormData {
  nombre: string;
  apellido: string;
  puestoId: string;
  sucursalId: string;
  fechaIngreso: string;
  activo: boolean;
}

const EMPTY_FORM: EmpleadoFormData = {
  nombre: '',
  apellido: '',
  puestoId: '',
  sucursalId: '',
  fechaIngreso: '',
  activo: true,
};

export function Empleados() {
  const { empleados, addEmpleado, updateEmpleado, deleteEmpleado } = useEmpleadoStore();
  const { puestos } = usePuestoStore();
  const { sucursales } = useSucursalStore();

  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState<Empleado | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Empleado | null>(null);
  const [form, setForm] = useState<EmpleadoFormData>(EMPTY_FORM);

  const puestoMap = new Map(puestos.map((p) => [p.id, p.nombre]));
  const sucursalMap = new Map(sucursales.map((s) => [s.id, s.nombre]));

  function openAdd() {
    setEditTarget(null);
    setForm({
      ...EMPTY_FORM,
      puestoId: puestos[0]?.id ?? '',
      sucursalId: sucursales[0]?.id ?? '',
    });
    setShowForm(true);
  }

  function openEdit(emp: Empleado) {
    setEditTarget(emp);
    setForm({
      nombre: emp.nombre,
      apellido: emp.apellido,
      puestoId: emp.puestoId,
      sucursalId: emp.sucursalId,
      fechaIngreso: emp.fechaIngreso,
      activo: emp.activo,
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
    if (!form.nombre.trim() || !form.apellido.trim()) return;
    if (editTarget) {
      updateEmpleado(editTarget.id, form);
    } else {
      addEmpleado(form);
    }
    closeForm();
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  }

  function handleDelete() {
    if (deleteTarget) {
      deleteEmpleado(deleteTarget.id);
      setDeleteTarget(null);
    }
  }

  return (
    <div className="page">
      <div className="page__header">
        <h2 className="page__title">Empleados</h2>
        <button className="btn-primary" onClick={openAdd}>
          + Agregar Empleado
        </button>
      </div>

      <div className="table-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Puesto</th>
              <th>Sucursal</th>
              <th>Fecha Ingreso</th>
              <th>Activo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {empleados.length === 0 ? (
              <tr>
                <td colSpan={7} className="table-empty">No hay empleados registrados.</td>
              </tr>
            ) : (
              empleados.map((emp) => (
                <tr key={emp.id}>
                  <td>{emp.nombre}</td>
                  <td>{emp.apellido}</td>
                  <td>{puestoMap.get(emp.puestoId) ?? emp.puestoId}</td>
                  <td>{sucursalMap.get(emp.sucursalId) ?? emp.sucursalId}</td>
                  <td>{new Date(emp.fechaIngreso).toLocaleDateString('es-MX')}</td>
                  <td>
                    <span className={`activo-badge activo-badge--${emp.activo}`}>
                      {emp.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td>
                    <div className="data-table__actions">
                      <button className="btn-ghost" onClick={() => openEdit(emp)}>Editar</button>
                      <button className="btn-danger" onClick={() => setDeleteTarget(emp)}>Eliminar</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={showForm}
        onClose={closeForm}
        title={editTarget ? 'Editar Empleado' : 'Nuevo Empleado'}
      >
        <form className="form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="emp-nombre">Nombre</label>
            <input
              id="emp-nombre"
              className="form-input"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              placeholder="Nombre"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="emp-apellido">Apellido</label>
            <input
              id="emp-apellido"
              className="form-input"
              name="apellido"
              value={form.apellido}
              onChange={handleChange}
              placeholder="Apellido"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="emp-puesto">Puesto</label>
            <select
              id="emp-puesto"
              className="form-select"
              name="puestoId"
              value={form.puestoId}
              onChange={handleChange}
              required
            >
              <option value="">Seleccionar puesto...</option>
              {puestos.map((p) => (
                <option key={p.id} value={p.id}>{p.nombre}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="emp-sucursal">Sucursal</label>
            <select
              id="emp-sucursal"
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
            <label className="form-label" htmlFor="emp-fecha">Fecha de Ingreso</label>
            <input
              id="emp-fecha"
              className="form-input"
              name="fechaIngreso"
              type="date"
              value={form.fechaIngreso}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <div className="form-checkbox-row">
              <input
                id="emp-activo"
                className="form-checkbox"
                name="activo"
                type="checkbox"
                checked={form.activo}
                onChange={handleChange}
              />
              <label className="form-label" htmlFor="emp-activo">Activo</label>
            </div>
          </div>
          <div className="form-actions">
            <button type="button" className="btn-ghost" onClick={closeForm}>Cancelar</button>
            <button type="submit" className="btn-primary">
              {editTarget ? 'Guardar cambios' : 'Crear Empleado'}
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
            ¿Estás seguro de que querés eliminar a <strong>{deleteTarget?.nombre} {deleteTarget?.apellido}</strong>?
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
