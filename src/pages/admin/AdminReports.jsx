import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import apiClient from "../../api/axios";
import PageHeader from "../../components/ui/PageHeader";
import LoadingOverlay from "../../components/ui/LoadingOverlay";
import EmptyState from "../../components/ui/EmptyState";
import StatusBadge from "../../components/ui/StatusBadge";

const AdminReports = () => {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["admin-reports"],
    queryFn: async () => (await apiClient.get("/admin/reports")).data,
  });

  const resolveMutation = useMutation({
    mutationFn: ({ id, adminNote }) =>
      apiClient.patch(`/admin/reports/${id}/resolve`, { adminNote }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["admin-reports"] }),
  });

  const reports = data?.reports || [];

  const handleResolve = async (report) => {
    const result = await Swal.fire({
      title: "Resolve report",
      input: "textarea",
      inputLabel: "Admin note",
      inputPlaceholder:
        "Summarize the action taken or why no action was necessary.",
      showCancelButton: true,
      confirmButtonText: "Resolve report",
    });

    if (result.isConfirmed) {
      await resolveMutation.mutateAsync({
        id: report._id,
        adminNote: result.value,
      });
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Reports"
        title="Review invalid submissions and task issues"
        description="Handle worker and buyer reports in a structured queue so the platform stays trustworthy."
      />

      {isLoading ? <LoadingOverlay label="Loading reports" /> : null}

      <div className="card-soft overflow-hidden">
        {reports.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Task</th>
                  <th>Reporter</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report) => (
                  <tr key={report._id} className="hover align-top">
                    <td>{report.task?.title}</td>
                    <td>{report.reporter?.name}</td>
                    <td className="max-w-lg whitespace-pre-line text-sm text-slate-600">
                      {report.reason}
                    </td>
                    <td>
                      <StatusBadge status={report.status} />
                    </td>
                    <td>
                      {report.status !== "resolved" ? (
                        <button
                          type="button"
                          onClick={() => handleResolve(report)}
                          className="btn btn-sm rounded-full btn-primary text-white"
                        >
                          Resolve
                        </button>
                      ) : (
                        <span className="text-sm text-slate-500">Done</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            title="No open reports"
            description="Reports submitted by users will appear here when moderation is required."
          />
        )}
      </div>
    </div>
  );
};

export default AdminReports;
