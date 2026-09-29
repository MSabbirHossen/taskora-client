const styles = {
  pending: "bg-amber-50 text-amber-700",
  approved: "bg-emerald-50 text-emerald-700",
  rejected: "bg-rose-50 text-rose-700",
  active: "bg-emerald-50 text-emerald-700",
  paused: "bg-slate-100 text-slate-700",
  paid: "bg-emerald-50 text-emerald-700",
  failed: "bg-rose-50 text-rose-700",
  open: "bg-amber-50 text-amber-700",
  resolved: "bg-sky-50 text-sky-700",
};

const StatusBadge = ({ status }) => (
  <span
    className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.22em] ${styles[status] || "bg-slate-100 text-slate-700"}`}
  >
    {status}
  </span>
);

export default StatusBadge;
