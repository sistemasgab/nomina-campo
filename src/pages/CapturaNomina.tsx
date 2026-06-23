import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNominaStore } from '../stores/useNominaStore';
import { useSucursalStore } from '../stores/useSucursalStore';
import { usePageFilters } from '../context/FilterContext';
import { Modal } from '../components/ui/Modal';
import type { Nomina } from '../stores/types';
import './Empresas.css';
import './CapturaNomina.css';

interface NominaFormData {
  sucursalId: string;
  fechaInicio: string;
  fechaFin: string;
}

const EMPTY_FORM: NominaFormData = {
  sucursalId: '',
  fechaInicio: new Date().toISOString().split('T')[0],
  fechaFin: new Date().toISOString().split('T')[0],
};

export function CapturaNomina() {
  const navigate = useNavigate();
  const { nominas, addNomina, deleteNomina } = useNominaStore();
  const { sucursales } = useSucursalStore();
  const { search, filters } = usePageFilters();

  const filteredNominas = nominas.filter((nomina) => {
    if (filters.sucursalId && nomina.sucursalId !== filters.sucursalId) return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    const sucursalNombre = sucursales.find((s) => s.id === nomina.sucursalId)?.nombre ?? '';
    return nomina.folio.toLowerCase().includes(q) || sucursalNombre.toLowerCase().includes(q);
  });

  const [showForm, setShowForm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Nomina | null>(null);
  const [form, setForm] = useState<NominaFormData>(EMPTY_FORM);

  const sucursalMap = new Map(sucursales.map((s) => [s.id, s.nombre]));

  function openAdd() {
    setForm({
      ...EMPTY_FORM,
      sucursalId: sucursales[0]?.id ?? '',
    });
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setForm(EMPTY_FORM);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.sucursalId) return;
    const id = addNomina({
      sucursalId: form.sucursalId,
      fechaInicio: form.fechaInicio,
      fechaFin: form.fechaFin,
    });
    closeForm();
    navigate(`/nomina/captura/${id}`);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleDelete() {
    if (deleteTarget) {
      deleteNomina(deleteTarget.id);
      setDeleteTarget(null);
    }
  }

  return (
    <div className="page">
      <div className="page__header">
        <h2 className="page__title">Captura de Nomina</h2>
        <button className="btn-primary" onClick={openAdd}>
          + Nueva Nomina
        </button>
      </div>

      <div className="table-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Folio</th>
              <th>Sucursal</th>
              <th>Fecha Inicio</th>
              <th>Fecha Fin</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredNominas.length === 0 ? (
              <tr>
                <td colSpan={5} className="table-empty">
                  {search.trim() || filters.sucursalId ? 'No se encontraron nominas.' : 'No hay nominas registradas.'}
                </td>
              </tr>
            ) : (
              filteredNominas.map((nomina) => (
                <tr
                  key={nomina.id}
                  className="clickable-row"
                  onClick={() => navigate(`/nomina/captura/${nomina.id}`)}
                >
                  <td><strong>{nomina.folio}</strong></td>
                  <td>{sucursalMap.get(nomina.sucursalId) ?? nomina.sucursalId}</td>
                  <td>{new Date(nomina.fechaInicio).toLocaleDateString('es-MX')}</td>
                  <td>{new Date(nomina.fechaFin).toLocaleDateString('es-MX')}</td>
                  <td>
                    <div className="data-table__actions">
                      <button
                        className="btn-ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/nomina/captura/${nomina.id}`);
                        }}
                      >
                        Ver detalle
                      </button>
                      <button
                        className="btn-danger"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteTarget(nomina);
                        }}
                      >
                        Eliminar
                      </button>
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
        title="Nueva Nomina"
      >
        <form className="form" onSubmit={handleSubmit}>
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
            <label className="form-label" htmlFor="nom-fecha-inicio">Fecha Inicio</label>
            <input
              id="nom-fecha-inicio"
              className="form-input"
              name="fechaInicio"
              type="date"
              value={form.fechaInicio}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="nom-fecha-fin">Fecha Fin</label>
            <input
              id="nom-fecha-fin"
              className="form-input"
              name="fechaFin"
              type="date"
              value={form.fechaFin}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-actions">
            <button type="button" className="btn-ghost" onClick={closeForm}>Cancelar</button>
            <button type="submit" className="btn-primary">Crear Nomina</button>
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
            Se eliminara la nomina <strong>{deleteTarget?.folio}</strong> y todas sus entradas.
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
