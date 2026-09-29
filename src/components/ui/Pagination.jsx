const Pagination = ({ page, totalPages, onPrev, onNext }) => (
  <div className="flex items-center justify-between gap-4">
    <button
      type="button"
      onClick={onPrev}
      disabled={page <= 1}
      className="btn btn-outline btn-sm rounded-full"
    >
      Previous
    </button>
    <p className="text-sm font-medium text-slate-500">
      Page {page} of {Math.max(totalPages, 1)}
    </p>
    <button
      type="button"
      onClick={onNext}
      disabled={page >= totalPages}
      className="btn btn-outline btn-sm rounded-full"
    >
      Next
    </button>
  </div>
);

export default Pagination;
