import { useState } from 'react';
import { useEncargadoStore } from '../stores/useEncargadoStore';
import { usePageFilters } from '../context/FilterContext';
import { Modal } from '../components/ui/Modal';
import type { Encargado } from '../stores/types';
import './Empresas.css';

interface EncargadoFormData {
  nombre: string;
  activo: boolean;
}

const EMPTY_FORM: EncargadoFormData = {
  nombre: '',
  activo: true,
};

export function Encargados() {
  const { encargados, addEncargado, updateEncargado, deleteEncargado } = useEncargadoStore();
  const { search, filters } = usePageFilters();

  const filteredEncargados = encargados.filter((enc) => {
    if (filters.estado === 'activo' && !enc.activo) return false;
    if (filters.estado === 'inactivo' && enc.activo) return false;
    if (!search.trim()) return true;
    return enc.nombre.toLowerCase().includes(search.toLowerCase());
  });

  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState<Encargado | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Encargado | null>(null);
  const [form, setForm] = useState<EncargadoFormData>(EMPTY_FORM);

  function openAdd() {
    setEditTarget(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  }

  function openEdit(enc: Encargado) {
    setEditTarget(enc);
    setForm({ nombre: enc.nombre, activo: enc.activo });
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditTarget(null);
    setForm(EMPTY_FORM);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.nombre.trim()) return;
    if (editTarget) {
      updateEncargado(editTarget.id, form);
    } else {
      addEncargado(form);
    }
    closeForm();
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  }

  function handleDelete() {
    if (deleteTarget) {
      deleteEncargado(deleteTarget.id);
      setDeleteTarget(null);
    }
  }

  return (
    <div className="page">
      <div className="page__header">
        <h2 className="page__title">Encargados</h2>
        <button className="btn-primary" onClick={openAdd}>
          + Agregar Encargado
        </button>
      </div>

      <div className="table-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Estatus</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredEncargados.length === 0 ? (
              <tr>
                <td colSpan={3} className="table-empty">
                  {search.trim() || filters.estado
                    ? 'No se encontraron encargados.'
                    : 'No hay encargados registrados.'}
                </td>
              </tr>
            ) : (
              filteredEncargados.map((enc) => (
                <tr key={enc.id}>
                  <td>{enc.nombre}</td>
                  <td>
                    <span className={`activo-badge activo-badge--${enc.activo}`}>
                      {enc.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td>
                    <div className="data-table__actions">
                      <button className="btn-ghost" onClick={() => openEdit(enc)}>Editar</button>
                      <button className="btn-danger" onClick={() => setDeleteTarget(enc)}>Eliminar</button>
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
        title={editTarget ? 'Editar Encargado' : 'Nuevo Encargado'}
      >
        <form className="form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="enc-nombre">Nombre</label>
            <input
              id="enc-nombre"
              className="form-input"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              placeholder="Nombre del encargado"
              required
            />
          </div>
          <div className="form-group">
            <div className="form-checkbox-row">
              <input
                id="enc-activo"
                className="form-checkbox"
                name="activo"
                type="checkbox"
                checked={form.activo}
                onChange={handleChange}
              />
              <label className="form-label" htmlFor="enc-activo">Activo</label>
            </div>
          </div>
          <div className="form-actions">
            <button type="button" className="btn-ghost" onClick={closeForm}>Cancelar</button>
            <button type="submit" className="btn-primary">
              {editTarget ? 'Guardar cambios' : 'Crear Encargado'}
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
            Se eliminara a <strong>{deleteTarget?.nombre}</strong>.
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
