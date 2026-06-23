import { useNavigate } from 'react-router-dom';
import { GearSix, ClipboardText, Plant, ArrowRight } from '@phosphor-icons/react';
import './ModuleSelector.css';

interface ModuleCardProps {
  icon: React.ReactNode;
  iconClass: string;
  name: string;
  description: string;
  onClick?: () => void;
  disabled?: boolean;
  badge?: string;
}

function ModuleCard({ icon, iconClass, name, description, onClick, disabled, badge }: ModuleCardProps) {
  return (
    <div
      className={`module-card${disabled ? ' module-card--disabled' : ''}`}
      onClick={disabled ? undefined : onClick}
      role={disabled ? undefined : 'button'}
      tabIndex={disabled ? undefined : 0}
      onKeyDown={disabled ? undefined : (e) => e.key === 'Enter' && onClick?.()}
    >
      <div className={`module-card__icon-wrapper ${iconClass}`}>
        {icon}
      </div>
      <div className="module-card__body">
        <div className="module-card__name-row">
          <h3 className="module-card__name">{name}</h3>
          {badge && <span className="module-card__badge">{badge}</span>}
        </div>
        <p className="module-card__description">{description}</p>
      </div>
      {!disabled && (
        <div className="module-card__arrow">
          <ArrowRight size={20} weight="bold" />
        </div>
      )}
    </div>
  );
}

export function ModuleSelector() {
  const navigate = useNavigate();

  return (
    <div className="module-selector">
      <div className="module-selector__header">
        <h1 className="module-selector__title">AgroPay Manager</h1>
        <p className="module-selector__subtitle">Selecciona un modulo para comenzar</p>
      </div>
      <div className="module-selector__grid">
        <ModuleCard
          icon={<GearSix size={32} />}
          iconClass="module-card__icon-wrapper--general"
          name="General"
          description="Empresas, sucursales y catalogos compartidos"
          onClick={() => navigate('/general/empresas')}
        />
        <ModuleCard
          icon={<ClipboardText size={32} />}
          iconClass="module-card__icon-wrapper--nomina"
          name="Nomina de Campo"
          description="Empleados, puestos, encargados y captura de nomina"
          onClick={() => navigate('/nomina')}
        />
        <ModuleCard
          icon={<Plant size={32} />}
          iconClass="module-card__icon-wrapper--preparaciones"
          name="Preparaciones Agricolas"
          description="Gestion de preparaciones y actividades agricolas"
          onClick={() => navigate('/preparaciones')}
          disabled
          badge="Proximamente"
        />
      </div>
    </div>
  );
}
