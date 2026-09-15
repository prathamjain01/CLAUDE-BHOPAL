import React from "react";

interface SkillChipProps {
  label: string;
  selected?: boolean;
  onClick?: () => void;
  icon?: string;
  className?: string;
}

export function SkillChip({
  label,
  selected = false,
  onClick,
  icon,
  className = "",
}: SkillChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3.5 py-2 rounded-xl border text-xs font-label-code transition-all inline-flex items-center gap-1.5 cursor-pointer ${
        selected
          ? "bg-primary-container text-surface-deep border-primary-container font-semibold shadow-[0_0_12px_rgba(255,107,53,0.3)]"
          : "bg-surface-raised border-border-subtle text-text-secondary hover:border-border-bold hover:text-text-primary"
      } ${className}`}
    >
      {icon ? (
        <span className="material-symbols-outlined text-[16px]">{icon}</span>
      ) : (
        <span className="material-symbols-outlined text-[14px]">
          {selected ? "check" : "add"}
        </span>
      )}
      <span>{label}</span>
    </button>
  );
}

export default SkillChip;
