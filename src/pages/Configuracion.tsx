import { useThemeStore } from '../stores/useThemeStore';
import './Empresas.css';
import './Configuracion.css';

export function Configuracion() {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <div className="page">
      <div className="page__header">
        <h2 className="page__title">Configuracion</h2>
      </div>

      <div className="settings-section">
        <div className="settings-card">
          <div className="settings-card__info">
            <h3 className="settings-card__title">Modo Oscuro</h3>
            <p className="settings-card__desc">
              Cambia la apariencia de la aplicacion entre modo claro y oscuro.
            </p>
          </div>
          <button
            className={`theme-toggle ${theme === 'dark' ? 'theme-toggle--active' : ''}`}
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Activar modo claro' : 'Activar modo oscuro'}
          >
            <span className="theme-toggle__thumb" />
          </button>
        </div>
      </div>
    </div>
  );
}
