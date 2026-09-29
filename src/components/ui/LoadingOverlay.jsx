const LoadingOverlay = ({ label = "Loading content" }) => (
  <div className="flex items-center justify-center py-16">
    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-soft">
      <span className="loading loading-spinner loading-sm text-primary" />
      <span className="text-sm font-medium text-slate-600">{label}</span>
    </div>
  </div>
);

export default LoadingOverlay;
