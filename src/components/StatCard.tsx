import type { ReactNode } from 'react';

interface StatCardProps {
  label: ReactNode;
  value: ReactNode;
  unit?: string;
  foot?: ReactNode;
  aside?: ReactNode;
  dark?: boolean;
  children?: ReactNode;
}

export default function StatCard({ label, value, unit, foot, aside, dark, children }: StatCardProps) {
  return (
    <section className={`stat${dark ? ' stat-dark' : ''}`}>
      {aside ? (
        <div className="stat-top">
          <div className="stat-label">{label}</div>
          <div className="stat-aside">{aside}</div>
        </div>
      ) : (
        <div className="stat-label">{label}</div>
      )}
      <div className="stat-value">
        {value}
        {unit && <span className="stat-unit">{unit}</span>}
      </div>
      {children}
      {foot && <div className="stat-foot">{foot}</div>}
    </section>
  );
}
