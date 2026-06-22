import { useState } from 'react';
import { useSucursalStore } from '../stores/useSucursalStore';
import { useEmpresaStore } from '../stores/useEmpresaStore';
import { Modal } from '../components/ui/Modal';
import type { Sucursal } from '../stores/types';
import './Empresas.css';
import './Sucursales.css';

interface SucursalFormData {
  nombre: string;
  empresaId: string;
  ubicacion: string;
}

const EMPTY_FORM: SucursalFormData = { nombre: '', empresaId: '', ubicacion: '' };

export function Sucursales() {
  const { sucursales, addSucursal, updateSucursal, deleteSucursal } = useSucursalStore();
  const { empresas } = useEmpresaStore();

  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState<Sucursal | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Sucursal | null>(null);
  const [form, setForm] = useState<SucursalFormData>(EMPTY_FORM);

  const empresaMap = new Map(empresas.map((e) => [e.id, e.nombre]));

  function openAdd() {
    setEditTarget(null);
    setForm({ ...EMPTY_FORM, empresaId: empresas[0]?.id ?? '' });
    setShowForm(true);
  }

  function openEdit(sucursal: Sucursal) {
    setEditTarget(sucursal);
    setForm({ nombre: sucursal.nombre, empresaId: sucursal.empresaId, ubicacion: sucursal.ubicacion });
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditTarget(null);
    setForm(EMPTY_FORM);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.nombre.trim() || !form.empresaId) return;
    if (editTarget) {
      updateSucursal(editTarget.id, form);
    } else {
      addSucursal(form);
    }
    closeForm();
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleDelete() {
    if (deleteTarget) {
      deleteSucursal(deleteTarget.id);
      setDeleteTarget(null);
    }
  }

  return (
    <div className="page">
      <div className="page__header">
        <h2 className="page__title">Sucursales</h2>
        <button className="btn-primary" onClick={openAdd}>
          + Agregar Sucursal
        </button>
      </div>

      <div className="table-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Empresa</th>
              <th>Ubicación</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {sucursales.length === 0 ? (
              <tr>
                <td colSpan={4} className="table-empty">No hay sucursales registradas.</td>
              </tr>
            ) : (
              sucursales.map((sucursal) => (
                <tr key={sucursal.id}>
                  <td>{sucursal.nombre}</td>
                  <td>{empresaMap.get(sucursal.empresaId) ?? sucursal.empresaId}</td>
                  <td>{sucursal.ubicacion}</td>
                  <td>
                    <div className="data-table__actions">
                      <button className="btn-ghost" onClick={() => openEdit(sucursal)}>Editar</button>
                      <button className="btn-danger" onClick={() => setDeleteTarget(sucursal)}>Eliminar</button>
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
        title={editTarget ? 'Editar Sucursal' : 'Nueva Sucursal'}
      >
        <form className="form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="suc-nombre">Nombre</label>
            <input
              id="suc-nombre"
              className="form-input"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              placeholder="Nombre de la sucursal"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="suc-empresa">Empresa</label>
            <select
              id="suc-empresa"
              className="form-select"
              name="empresaId"
              value={form.empresaId}
              onChange={handleChange}
              required
            >
              <option value="">Seleccionar empresa...</option>
              {empresas.map((e) => (
                <option key={e.id} value={e.id}>{e.nombre}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="suc-ubicacion">Ubicación</label>
            <input
              id="suc-ubicacion"
              className="form-input"
              name="ubicacion"
              value={form.ubicacion}
              onChange={handleChange}
              placeholder="Ubicación"
              required
            />
          </div>
          <div className="form-actions">
            <button type="button" className="btn-ghost" onClick={closeForm}>Cancelar</button>
            <button type="submit" className="btn-primary">
              {editTarget ? 'Guardar cambios' : 'Crear Sucursal'}
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
            ¿Estás seguro de que querés eliminar la sucursal <strong>{deleteTarget?.nombre}</strong>?
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
