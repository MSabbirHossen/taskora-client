const EmptyState = ({ title, description, action }) => (
  <div className="card-soft flex flex-col items-center justify-center px-6 py-14 text-center">
    <div className="mb-4 rounded-full bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-500">
      No records yet
    </div>
    <h3 className="text-xl font-bold text-slate-900">{title}</h3>
    <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600">
      {description}
    </p>
    {action ? <div className="mt-6">{action}</div> : null}
  </div>
);

export default EmptyState;
