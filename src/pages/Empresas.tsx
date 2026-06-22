import { useState } from 'react';
import { useEmpresaStore } from '../stores/useEmpresaStore';
import { Modal } from '../components/ui/Modal';
import type { Empresa } from '../stores/types';
import './Empresas.css';

interface EmpresaFormData {
  nombre: string;
  rfc: string;
  direccion: string;
}

const EMPTY_FORM: EmpresaFormData = { nombre: '', rfc: '', direccion: '' };

export function Empresas() {
  const { empresas, addEmpresa, updateEmpresa, deleteEmpresa } = useEmpresaStore();

  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState<Empresa | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Empresa | null>(null);
  const [form, setForm] = useState<EmpresaFormData>(EMPTY_FORM);

  function openAdd() {
    setEditTarget(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  }

  function openEdit(empresa: Empresa) {
    setEditTarget(empresa);
    setForm({ nombre: empresa.nombre, rfc: empresa.rfc, direccion: empresa.direccion });
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
      updateEmpresa(editTarget.id, form);
    } else {
      addEmpresa(form);
    }
    closeForm();
  }

  function handleDelete() {
    if (deleteTarget) {
      deleteEmpresa(deleteTarget.id);
      setDeleteTarget(null);
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  return (
    <div className="page">
      <div className="page__header">
        <h2 className="page__title">Empresas</h2>
        <button className="btn-primary" onClick={openAdd}>
          + Agregar Empresa
        </button>
      </div>

      <div className="table-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>RFC</th>
              <th>Dirección</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {empresas.length === 0 ? (
              <tr>
                <td colSpan={4} className="table-empty">No hay empresas registradas.</td>
              </tr>
            ) : (
              empresas.map((empresa) => (
                <tr key={empresa.id}>
                  <td>{empresa.nombre}</td>
                  <td>{empresa.rfc}</td>
                  <td>{empresa.direccion}</td>
                  <td>
                    <div className="data-table__actions">
                      <button className="btn-ghost" onClick={() => openEdit(empresa)}>Editar</button>
                      <button className="btn-danger" onClick={() => setDeleteTarget(empresa)}>Eliminar</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Form modal */}
      <Modal
        isOpen={showForm}
        onClose={closeForm}
        title={editTarget ? 'Editar Empresa' : 'Nueva Empresa'}
      >
        <form className="form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="empresa-nombre">Nombre</label>
            <input
              id="empresa-nombre"
              className="form-input"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              placeholder="Nombre de la empresa"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="empresa-rfc">RFC</label>
            <input
              id="empresa-rfc"
              className="form-input"
              name="rfc"
              value={form.rfc}
              onChange={handleChange}
              placeholder="RFC"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="empresa-direccion">Dirección</label>
            <input
              id="empresa-direccion"
              className="form-input"
              name="direccion"
              value={form.direccion}
              onChange={handleChange}
              placeholder="Dirección"
              required
            />
          </div>
          <div className="form-actions">
            <button type="button" className="btn-ghost" onClick={closeForm}>Cancelar</button>
            <button type="submit" className="btn-primary">
              {editTarget ? 'Guardar cambios' : 'Crear Empresa'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete confirm */}
      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Confirmar eliminación"
      >
        <div className="confirm-body">
          <p>
            ¿Estás seguro de que querés eliminar la empresa <strong>{deleteTarget?.nombre}</strong>?
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
