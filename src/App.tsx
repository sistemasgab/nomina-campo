import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppLayout } from './components/Layout/AppLayout';
import { ModuleSelector } from './pages/ModuleSelector';
import { Dashboard } from './pages/Dashboard';
import { Empresas } from './pages/Empresas';
import { Sucursales } from './pages/Sucursales';
import { Empleados } from './pages/Empleados';
import { Puestos } from './pages/Puestos';
import { CapturaNomina } from './pages/CapturaNomina';
import { NominaDetalle } from './pages/NominaDetalle';
import { Encargados } from './pages/Encargados';
import { Configuracion } from './pages/Configuracion';
import { PreparacionesHome } from './pages/PreparacionesHome';
import { useThemeStore } from './stores/useThemeStore';

export default function App() {
  const theme = useThemeStore((s) => s.theme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<ModuleSelector />} />
        <Route element={<AppLayout />}>
          {/* General */}
          <Route path="general/empresas" element={<Empresas />} />
          <Route path="general/sucursales" element={<Sucursales />} />
          {/* Nomina */}
          <Route path="nomina" element={<Dashboard />} />
          <Route path="nomina/empleados" element={<Empleados />} />
          <Route path="nomina/puestos" element={<Puestos />} />
          <Route path="nomina/encargados" element={<Encargados />} />
          <Route path="nomina/captura" element={<CapturaNomina />} />
          <Route path="nomina/captura/:nominaId" element={<NominaDetalle />} />
          {/* Preparaciones */}
          <Route path="preparaciones" element={<PreparacionesHome />} />
          {/* Global */}
          <Route path="configuracion" element={<Configuracion />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
