import { Plant } from '@phosphor-icons/react';
import './PreparacionesHome.css';

export function PreparacionesHome() {
  return (
    <div className="preparaciones-home">
      <div className="preparaciones-home__content">
        <div className="preparaciones-home__icon">
          <Plant size={48} />
        </div>
        <h2 className="preparaciones-home__title">Preparaciones Agricolas</h2>
        <p className="preparaciones-home__text">
          Este modulo esta en desarrollo. Proximamente podras gestionar
          preparaciones y actividades agricolas desde aqui.
        </p>
      </div>
    </div>
  );
}
