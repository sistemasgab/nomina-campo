import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppLayout } from './components/Layout/AppLayout';
import { Dashboard } from './pages/Dashboard';
import { Empresas } from './pages/Empresas';
import { Sucursales } from './pages/Sucursales';
import { Empleados } from './pages/Empleados';
import { Puestos } from './pages/Puestos';
import { CapturaNomina } from './pages/CapturaNomina';
import { NominaDetalle } from './pages/NominaDetalle';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="empresas" element={<Empresas />} />
          <Route path="sucursales" element={<Sucursales />} />
          <Route path="empleados" element={<Empleados />} />
          <Route path="puestos" element={<Puestos />} />
          <Route path="captura-nomina" element={<CapturaNomina />} />
          <Route path="captura-nomina/:nominaId" element={<NominaDetalle />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
