import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import apiClient from "../../api/axios";
import PageHeader from "../../components/ui/PageHeader";
import LoadingOverlay from "../../components/ui/LoadingOverlay";
import EmptyState from "../../components/ui/EmptyState";
import StatusBadge from "../../components/ui/StatusBadge";

const AdminTasks = () => {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["admin-task-list"],
    queryFn: async () => (await apiClient.get("/admin/tasks")).data,
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => apiClient.delete(`/admin/tasks/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-task-list"] });
      Swal.fire({
        icon: "success",
        title: "Task removed",
        text: "The task has been deleted from the platform.",
      });
    },
  });

  const tasks = data?.tasks || [];

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Manage tasks"
        title="Moderate all published tasks"
        description="Use this panel to remove harmful or invalid tasks while preserving platform integrity."
      />

      {isLoading ? <LoadingOverlay label="Loading tasks" /> : null}

      <div className="card-soft overflow-hidden">
        {tasks.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Task</th>
                  <th>Buyer</th>
                  <th>Budget</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr key={task._id} className="hover">
                    <td>
                      <p className="font-semibold text-slate-900">
                        {task.title}
                      </p>
                      <p className="text-xs text-slate-500">
                        {new Date(task.completionDate).toLocaleDateString()}
                      </p>
                    </td>
                    <td>{task.buyerName}</td>
                    <td>
                      {task.spentCoins ||
                        task.requiredWorkers * task.payableAmount}
                    </td>
                    <td>
                      <StatusBadge status={task.status} />
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={() => deleteMutation.mutate(task._id)}
                        className="btn btn-sm rounded-full btn-error text-white"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            title="No tasks available"
            description="Tasks will appear here once buyers publish campaigns to the platform."
          />
        )}
      </div>
    </div>
  );
};

export default AdminTasks;
