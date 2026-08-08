import React from 'react';
import { AlertCircle, AlertTriangle, Info, Zap } from 'lucide-react';

const PriorityBadge = ({ priority }) => {
  const getPriorityConfig = (pri) => {
    switch (pri) {
      case 'Low':
        return { label: 'Low Priority', icon: Info, className: 'priority-low' };
      case 'Medium':
        return { label: 'Medium Priority', icon: AlertTriangle, className: 'priority-medium' };
      case 'High':
        return { label: 'High Priority', icon: AlertCircle, className: 'priority-high' };
      case 'Urgent':
        return { label: 'Urgent', icon: Zap, className: 'priority-urgent' };
      default:
        return { label: pri || 'Medium', icon: AlertTriangle, className: 'priority-medium' };
    }
  };

  const config = getPriorityConfig(priority);
  const Icon = config.icon;

  return (
    <span className={`badge ${config.className}`}>
      <Icon size={13} />
      <span>{config.label}</span>
    </span>
  );
};

export default PriorityBadge;
