import { useQuery } from "@tanstack/react-query";
import apiClient from "../../api/axios";
import PageHeader from "../../components/ui/PageHeader";
import LoadingOverlay from "../../components/ui/LoadingOverlay";
import EmptyState from "../../components/ui/EmptyState";
import StatusBadge from "../../components/ui/StatusBadge";

const WorkerApprovedSubmissions = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["worker-approved-list"],
    queryFn: async () => (await apiClient.get("/submissions/approved/me")).data,
  });

  const submissions = data?.submissions || [];

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Approved work"
        title="Submissions that paid out successfully"
        description="These are the tasks that the buyer accepted and converted into coin rewards."
      />

      {isLoading ? (
        <LoadingOverlay label="Loading approved submissions" />
      ) : null}

      <div className="card-soft overflow-hidden">
        {submissions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Task</th>
                  <th>Buyer</th>
                  <th>Coins</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((submission) => (
                  <tr key={submission._id} className="hover">
                    <td className="font-semibold text-slate-900">
                      {submission.task?.title || submission.taskTitle}
                    </td>
                    <td>{submission.buyerName}</td>
                    <td>{submission.payableAmount}</td>
                    <td>
                      <StatusBadge status={submission.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            title="No approved work yet"
            description="When a buyer approves your submission, the coins will appear here."
          />
        )}
      </div>
    </div>
  );
};

export default WorkerApprovedSubmissions;
