import React from 'react';
import { Clock, UserCheck, RefreshCw, CheckCircle, XCircle } from 'lucide-react';

const StatusBadge = ({ status }) => {
  const getBadgeConfig = (st) => {
    switch (st) {
      case 'PENDING':
        return { label: 'Pending', icon: Clock, className: 'badge-pending' };
      case 'ASSIGNED':
        return { label: 'Assigned', icon: UserCheck, className: 'badge-assigned' };
      case 'IN_PROGRESS':
        return { label: 'In Progress', icon: RefreshCw, className: 'badge-in_progress' };
      case 'RESOLVED':
        return { label: 'Resolved', icon: CheckCircle, className: 'badge-resolved' };
      case 'REJECTED':
        return { label: 'Rejected', icon: XCircle, className: 'badge-rejected' };
      default:
        return { label: st || 'Unknown', icon: Clock, className: 'badge-pending' };
    }
  };

  const config = getBadgeConfig(status);
  const Icon = config.icon;

  return (
    <span className={`badge ${config.className}`}>
      <Icon size={13} />
      <span>{config.label}</span>
    </span>
  );
};

export default StatusBadge;
