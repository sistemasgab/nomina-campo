import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppLayout } from './components/Layout/AppLayout';
import { Dashboard } from './pages/Dashboard';
import { Empresas } from './pages/Empresas';
import { Sucursales } from './pages/Sucursales';
import { Empleados } from './pages/Empleados';
import { Puestos } from './pages/Puestos';
import { CapturaNomina } from './pages/CapturaNomina';
import { NominaDetalle } from './pages/NominaDetalle';
import { Configuracion } from './pages/Configuracion';
import { useThemeStore } from './stores/useThemeStore';

export default function App() {
  const theme = useThemeStore((s) => s.theme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

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
          <Route path="configuracion" element={<Configuracion />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
