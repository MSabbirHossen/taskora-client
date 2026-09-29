import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import apiClient from "../../api/axios";
import PageHeader from "../../components/ui/PageHeader";
import LoadingOverlay from "../../components/ui/LoadingOverlay";
import Pagination from "../../components/ui/Pagination";
import StatusBadge from "../../components/ui/StatusBadge";
import EmptyState from "../../components/ui/EmptyState";

const WorkerSubmissions = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useQuery({
    queryKey: ["worker-submissions", page],
    queryFn: async () =>
      (await apiClient.get("/submissions/me", { params: { page, limit: 8 } }))
        .data,
  });

  const submissions = data?.submissions || [];
  const pagination = data?.pagination || { page: 1, totalPages: 1 };

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Submission history"
        title="Track your submissions"
        description="Review the status of every submission you have sent to buyers."
      />

      {isLoading ? <LoadingOverlay label="Loading your submissions" /> : null}

      <div className="card-soft overflow-hidden">
        {submissions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Task</th>
                  <th>Buyer</th>
                  <th>Status</th>
                  <th>Coins</th>
                  <th>Submitted</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((submission) => (
                  <tr key={submission._id} className="hover">
                    <td>
                      <div>
                        <p className="font-semibold text-slate-900">
                          {submission.task?.title || submission.taskTitle}
                        </p>
                        <p className="text-xs text-slate-500 line-clamp-2">
                          {submission.submissionDetails}
                        </p>
                      </div>
                    </td>
                    <td>{submission.buyerName}</td>
                    <td>
                      <StatusBadge status={submission.status} />
                    </td>
                    <td>{submission.payableAmount}</td>
                    <td>
                      {new Date(submission.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            title="You have not submitted any work yet"
            description="Choose a task from the task list and submit the completed instructions to begin earning."
          />
        )}
      </div>

      <Pagination
        page={pagination.page}
        totalPages={pagination.totalPages}
        onPrev={() => setPage((current) => Math.max(current - 1, 1))}
        onNext={() =>
          setPage((current) => Math.min(current + 1, pagination.totalPages))
        }
      />
    </div>
  );
};

export default WorkerSubmissions;
