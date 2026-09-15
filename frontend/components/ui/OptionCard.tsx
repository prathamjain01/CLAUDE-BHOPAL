import React from "react";

interface OptionCardProps {
  title: string;
  description?: string;
  icon?: string;
  selected?: boolean;
  onClick?: () => void;
  badge?: string;
  className?: string;
}

export function OptionCard({
  title,
  description,
  icon,
  selected = false,
  onClick,
  badge,
  className = "",
}: OptionCardProps) {
  return (
    <div
      onClick={onClick}
      className={`p-5 rounded-xl bg-surface-raised border cursor-pointer transition-all flex flex-col justify-between ${
        selected
          ? "border-primary-container bg-surface-container shadow-[0_0_20px_rgba(255,107,53,0.15)] ring-1 ring-primary-container/40"
          : "border-border-subtle hover:border-border-bold"
      } ${className}`}
    >
      <div>
        <div className="flex items-center justify-between mb-3">
          {icon && (
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                selected ? "bg-primary-container text-surface-deep" : "bg-surface-container text-primary"
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">{icon}</span>
            </div>
          )}
          {badge && (
            <span className="px-2.5 py-0.5 rounded-full bg-orange-subtle-bg text-primary font-label-code text-xs border border-primary-container/20">
              {badge}
            </span>
          )}
        </div>
        <h3 className="font-title-sm text-text-primary mb-1">{title}</h3>
        {description && <p className="font-body-sm text-text-secondary text-xs">{description}</p>}
      </div>
      {selected && (
        <div className="pt-3 mt-3 border-t border-border-subtle flex items-center justify-end text-primary text-xs font-label-code">
          Selected ✓
        </div>
      )}
    </div>
  );
}

export default OptionCard;
