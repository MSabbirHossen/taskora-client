const toneClasses = {
  primary: "bg-primary/10 text-primary",
  secondary: "bg-secondary/10 text-secondary",
  emerald: "bg-emerald-50 text-emerald-600",
  amber: "bg-amber-50 text-amber-600",
  rose: "bg-rose-50 text-rose-600",
};

const StatCard = ({ title, value, description, icon, tone = "primary" }) => (
  <div className="card-soft overflow-hidden p-6">
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
          {title}
        </p>
        <p className="mt-3 text-3xl font-black text-slate-900">{value}</p>
        <p className="mt-2 text-sm text-slate-500">{description}</p>
      </div>
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-2xl ${toneClasses[tone] || toneClasses.primary}`}
      >
        {icon}
      </div>
    </div>
  </div>
);

export default StatCard;
