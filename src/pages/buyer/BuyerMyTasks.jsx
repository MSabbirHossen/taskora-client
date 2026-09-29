import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import apiClient from "../../api/axios";
import PageHeader from "../../components/ui/PageHeader";
import LoadingOverlay from "../../components/ui/LoadingOverlay";
import EmptyState from "../../components/ui/EmptyState";
import StatusBadge from "../../components/ui/StatusBadge";

const BuyerMyTasks = () => {
  const queryClient = useQueryClient();
  const [editingTask, setEditingTask] = useState(null);
  const { register, handleSubmit, reset } = useForm();

  const { data, isLoading } = useQuery({
    queryKey: ["buyer-task-list"],
    queryFn: async () => (await apiClient.get("/tasks/buyer/me")).data,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => apiClient.patch(`/tasks/${id}`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["buyer-task-list"] });
      Swal.fire({
        icon: "success",
        title: "Task updated",
        text: "Your changes have been saved.",
      });
      setEditingTask(null);
      reset();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => apiClient.delete(`/tasks/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["buyer-task-list"] });
      Swal.fire({
        icon: "success",
        title: "Task removed",
        text: "Unused coins were refunded automatically.",
      });
    },
  });

  const tasks = data?.tasks || [];

  const onSubmit = async (values) => {
    await updateMutation.mutateAsync({ id: editingTask._id, payload: values });
  };

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="My tasks"
        title="Manage the tasks you created"
        description="Update instructions, remove tasks that are no longer needed, and review the impact on your coin balance."
      />

      {isLoading ? <LoadingOverlay label="Loading your tasks" /> : null}

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="card-soft overflow-hidden">
          {tasks.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Task</th>
                    <th>Slots</th>
                    <th>Budget</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((task) => (
                    <tr key={task._id} className="hover">
                      <td>
                        <div>
                          <p className="font-semibold text-slate-900">
                            {task.title}
                          </p>
                          <p className="text-xs text-slate-500">
                            {new Date(task.completionDate).toLocaleDateString()}
                          </p>
                        </div>
                      </td>
                      <td>{task.requiredWorkers}</td>
                      <td>
                        {task.spentCoins ||
                          task.requiredWorkers * task.payableAmount}
                      </td>
                      <td>
                        <StatusBadge status={task.status} />
                      </td>
                      <td>
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => setEditingTask(task)}
                            className="btn btn-sm rounded-full btn-outline"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteMutation.mutate(task._id)}
                            className="btn btn-sm rounded-full btn-error text-white"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState
              title="No tasks created yet"
              description="Publish a task to start receiving work from the worker community."
            />
          )}
        </div>

        <div className="card-soft p-6 md:p-8">
          {editingTask ? (
            <>
              <h2 className="text-2xl font-black text-slate-900">Edit task</h2>
              <p className="mt-2 text-sm text-slate-500">
                You can update the task title, details, submission note,
                deadline, and image.
              </p>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="mt-6 grid gap-4"
              >
                <label className="grid gap-2">
                  <span className="text-sm font-semibold text-slate-700">
                    Title
                  </span>
                  <input
                    defaultValue={editingTask.title}
                    className="input input-bordered rounded-2xl bg-white"
                    {...register("title")}
                  />
                </label>
                <label className="grid gap-2">
                  <span className="text-sm font-semibold text-slate-700">
                    Detail
                  </span>
                  <textarea
                    defaultValue={editingTask.detail}
                    rows="5"
                    className="textarea textarea-bordered rounded-2xl bg-white"
                    {...register("detail")}
                  />
                </label>
                <label className="grid gap-2">
                  <span className="text-sm font-semibold text-slate-700">
                    Submission instructions
                  </span>
                  <textarea
                    defaultValue={editingTask.submissionInfo}
                    rows="4"
                    className="textarea textarea-bordered rounded-2xl bg-white"
                    {...register("submissionInfo")}
                  />
                </label>
                <label className="grid gap-2">
                  <span className="text-sm font-semibold text-slate-700">
                    Completion date
                  </span>
                  <input
                    type="date"
                    defaultValue={editingTask.completionDate?.slice?.(0, 10)}
                    className="input input-bordered rounded-2xl bg-white"
                    {...register("completionDate")}
                  />
                </label>
                <label className="grid gap-2">
                  <span className="text-sm font-semibold text-slate-700">
                    Image URL
                  </span>
                  <input
                    defaultValue={editingTask.image}
                    className="input input-bordered rounded-2xl bg-white"
                    {...register("image")}
                  />
                </label>
                <div className="flex flex-wrap gap-3">
                  <button
                    type="submit"
                    className="btn btn-primary rounded-2xl text-white"
                    disabled={updateMutation.isPending}
                  >
                    Save changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingTask(null)}
                    className="btn btn-outline rounded-2xl"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </>
          ) : (
            <EmptyState
              title="Select a task to edit"
              description="Choose any row from the table to update its content without losing the work already submitted."
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default BuyerMyTasks;
