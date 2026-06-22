import type { NominaStatus } from '../../stores/types';
import './StatusBadge.css';

interface StatusBadgeProps {
  status: NominaStatus;
}

const STATUS_LABELS: Record<NominaStatus, string> = {
  paid: 'Pagado',
  pending: 'Pendiente',
  overdue: 'Vencido',
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={`status-badge status-badge--${status}`}>
      {STATUS_LABELS[status]}
    </span>
  );
}
