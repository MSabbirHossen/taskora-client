const LoadingScreen = () => (
  <div className="flex min-h-screen items-center justify-center bg-slate-50">
    <div className="card-soft flex items-center gap-4 px-6 py-5">
      <span className="loading loading-spinner loading-lg text-primary" />
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
          Taskora
        </p>
        <p className="text-sm text-slate-500">Loading your workspace</p>
      </div>
    </div>
  </div>
);

export default LoadingScreen;
