import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import apiClient from "../../api/axios";
import PageHeader from "../../components/ui/PageHeader";
import LoadingOverlay from "../../components/ui/LoadingOverlay";
import StatusBadge from "../../components/ui/StatusBadge";

const WorkerTaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, reset } = useForm();

  const { data, isLoading } = useQuery({
    queryKey: ["worker-task-details", id],
    queryFn: async () => (await apiClient.get(`/tasks/${id}`)).data,
  });

  const task = data?.task;

  const submitMutation = useMutation({
    mutationFn: (payload) => apiClient.post(`/submissions/task/${id}`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["worker-task-list"] });
      queryClient.invalidateQueries({ queryKey: ["worker-submissions"] });
      Swal.fire({
        icon: "success",
        title: "Submission sent",
        text: "The buyer will review your work soon.",
      });
      reset();
      navigate("/dashboard/worker/submissions");
    },
  });

  const onSubmit = async (values) => {
    setSubmitting(true);
    try {
      await submitMutation.mutateAsync(values);
    } finally {
      setSubmitting(false);
    }
  };

  const completionDate = task
    ? new Date(task.completionDate).toLocaleDateString()
    : "";

  if (isLoading) {
    return <LoadingOverlay label="Loading task details" />;
  }

  if (!task) {
    return (
      <div className="card-soft p-10 text-center text-slate-600">
        Task not found.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Task details"
        title={task.title}
        description="Read the task instructions carefully before submitting your work."
        action={
          <StatusBadge
            status={task.requiredWorkers > 0 ? "active" : "paused"}
          />
        }
      />

      <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <article className="card-soft overflow-hidden">
          <img
            src={task.image}
            alt={task.title}
            className="h-72 w-full object-cover"
          />
          <div className="p-6 md:p-8">
            <div className="flex flex-wrap gap-3 text-sm font-semibold text-slate-500">
              <span>{task.buyerName}</span>
              <span>{completionDate}</span>
              <span>{task.requiredWorkers} workers still needed</span>
            </div>
            <p className="mt-6 whitespace-pre-line text-base leading-8 text-slate-600">
              {task.detail}
            </p>
            <div className="mt-6 rounded-3xl bg-slate-50 p-5">
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-slate-500">
                Submission requirements
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                {task.submissionInfo}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
                  {task.payableAmount} coins
                </span>
                <span className="rounded-full bg-amber-50 px-3 py-1 text-sm font-semibold text-amber-700">
                  Remaining slots: {task.requiredWorkers}
                </span>
              </div>
            </div>
          </div>
        </article>

        <aside className="card-soft p-6 md:p-8">
          <h2 className="text-2xl font-black text-slate-900">
            Submit your work
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Provide a concise explanation of how you completed the task.
          </p>
          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
            <label className="grid gap-2">
              <span className="text-sm font-semibold text-slate-700">
                Submission details
              </span>
              <textarea
                rows="10"
                className="textarea textarea-bordered rounded-2xl bg-white"
                placeholder="Explain what you completed, share proof links, and mention any relevant context."
                {...register("submissionDetails", {
                  required: true,
                  minLength: 5,
                })}
              />
            </label>
            <button
              type="submit"
              className="btn btn-primary w-full rounded-2xl text-white"
              disabled={submitting || submitMutation.isPending}
            >
              {submitting || submitMutation.isPending ? (
                <span className="loading loading-spinner loading-sm" />
              ) : (
                "Submit work"
              )}
            </button>
          </form>
        </aside>
      </div>
    </div>
  );
};

export default WorkerTaskDetails;
