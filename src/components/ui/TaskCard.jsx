import { Link } from "react-router-dom";

const TaskCard = ({ task, linkTo }) => (
  <div className="card-soft flex h-full flex-col overflow-hidden">
    <img
      src={task.image}
      alt={task.title}
      className="h-56 w-full object-cover"
    />
    <div className="flex flex-1 flex-col p-5">
      <div className="flex items-center justify-between gap-3 text-sm text-slate-500">
        <span>{task.buyerName}</span>
        <span>{new Date(task.completionDate).toLocaleDateString()}</span>
      </div>
      <h3 className="mt-3 text-xl font-bold text-slate-900">{task.title}</h3>
      <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
        {task.detail}
      </p>
      <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold">
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">
          {task.requiredWorkers} workers left
        </span>
        <span className="rounded-full bg-amber-50 px-3 py-1 text-amber-700">
          {task.payableAmount} coins each
        </span>
      </div>
      <div className="mt-6 flex items-center justify-between">
        <p className="text-sm text-slate-500">Review criteria included</p>
        <Link
          to={linkTo || `/dashboard/worker/tasks/${task._id}`}
          className="btn btn-primary btn-sm rounded-full text-white"
        >
          View details
        </Link>
      </div>
    </div>
  </div>
);

export default TaskCard;
