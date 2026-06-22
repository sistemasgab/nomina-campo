import { useState } from 'react';
import { usePuestoStore } from '../stores/usePuestoStore';
import { usePageFilters } from '../context/FilterContext';
import { Modal } from '../components/ui/Modal';
import type { Puesto } from '../stores/types';
import './Empresas.css';
import './Puestos.css';

interface PuestoFormData {
  nombre: string;
  descripcion: string;
  salarioBase: string;
}

const EMPTY_FORM: PuestoFormData = { nombre: '', descripcion: '', salarioBase: '' };

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(amount);
}

export function Puestos() {
  const { puestos, addPuesto, updatePuesto, deletePuesto } = usePuestoStore();
  const { search } = usePageFilters();

  const filteredPuestos = puestos.filter((puesto) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      puesto.nombre.toLowerCase().includes(q) ||
      puesto.descripcion.toLowerCase().includes(q)
    );
  });

  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState<Puesto | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Puesto | null>(null);
  const [form, setForm] = useState<PuestoFormData>(EMPTY_FORM);

  function openAdd() {
    setEditTarget(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  }

  function openEdit(puesto: Puesto) {
    setEditTarget(puesto);
    setForm({ nombre: puesto.nombre, descripcion: puesto.descripcion, salarioBase: String(puesto.salarioBase) });
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
    const payload = {
      nombre: form.nombre,
      descripcion: form.descripcion,
      salarioBase: parseFloat(form.salarioBase) || 0,
    };
    if (editTarget) {
      updatePuesto(editTarget.id, payload);
    } else {
      addPuesto(payload);
    }
    closeForm();
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleDelete() {
    if (deleteTarget) {
      deletePuesto(deleteTarget.id);
      setDeleteTarget(null);
    }
  }

  return (
    <div className="page">
      <div className="page__header">
        <h2 className="page__title">Puestos</h2>
        <button className="btn-primary" onClick={openAdd}>
          + Agregar Puesto
        </button>
      </div>

      <div className="table-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Salario Base</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredPuestos.length === 0 ? (
              <tr>
                <td colSpan={4} className="table-empty">
                  {search.trim() ? 'No se encontraron puestos.' : 'No hay puestos registrados.'}
                </td>
              </tr>
            ) : (
              filteredPuestos.map((puesto) => (
                <tr key={puesto.id}>
                  <td>{puesto.nombre}</td>
                  <td>{puesto.descripcion}</td>
                  <td>{formatCurrency(puesto.salarioBase)}</td>
                  <td>
                    <div className="data-table__actions">
                      <button className="btn-ghost" onClick={() => openEdit(puesto)}>Editar</button>
                      <button className="btn-danger" onClick={() => setDeleteTarget(puesto)}>Eliminar</button>
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
        title={editTarget ? 'Editar Puesto' : 'Nuevo Puesto'}
      >
        <form className="form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="puesto-nombre">Nombre</label>
            <input
              id="puesto-nombre"
              className="form-input"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              placeholder="Nombre del puesto"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="puesto-desc">Descripción</label>
            <textarea
              id="puesto-desc"
              className="form-textarea"
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              placeholder="Descripción del puesto"
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="puesto-salario">Salario Base (MXN)</label>
            <input
              id="puesto-salario"
              className="form-input"
              name="salarioBase"
              type="number"
              min="0"
              step="0.01"
              value={form.salarioBase}
              onChange={handleChange}
              placeholder="0.00"
              required
            />
          </div>
          <div className="form-actions">
            <button type="button" className="btn-ghost" onClick={closeForm}>Cancelar</button>
            <button type="submit" className="btn-primary">
              {editTarget ? 'Guardar cambios' : 'Crear Puesto'}
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
            ¿Estás seguro de que querés eliminar el puesto <strong>{deleteTarget?.nombre}</strong>?
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
