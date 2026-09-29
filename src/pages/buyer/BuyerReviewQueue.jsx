import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import apiClient from "../../api/axios";
import PageHeader from "../../components/ui/PageHeader";
import LoadingOverlay from "../../components/ui/LoadingOverlay";
import EmptyState from "../../components/ui/EmptyState";
import StatusBadge from "../../components/ui/StatusBadge";

const BuyerReviewQueue = () => {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["buyer-review-queue"],
    queryFn: async () => (await apiClient.get("/submissions/review")).data,
  });

  const approveMutation = useMutation({
    mutationFn: (id) => apiClient.patch(`/submissions/${id}/approve`),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["buyer-review-queue"] }),
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, reviewerNote }) =>
      apiClient.patch(`/submissions/${id}/reject`, { reviewerNote }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["buyer-review-queue"] }),
  });

  const submissions = data?.submissions || [];

  const handleReject = async (submission) => {
    const result = await Swal.fire({
      title: "Reject submission",
      input: "textarea",
      inputLabel: "Reviewer note",
      inputPlaceholder:
        "Explain why the submission does not meet the requirements.",
      showCancelButton: true,
      confirmButtonText: "Reject submission",
    });

    if (result.isConfirmed) {
      await rejectMutation.mutateAsync({
        id: submission._id,
        reviewerNote: result.value,
      });
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Review queue"
        title="Approve or reject worker submissions"
        description="Accepting work credits the worker, while rejecting a submission reopens the slot for another worker."
      />

      {isLoading ? (
        <LoadingOverlay label="Loading submissions awaiting review" />
      ) : null}

      <div className="card-soft overflow-hidden">
        {submissions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Task</th>
                  <th>Worker</th>
                  <th>Details</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((submission) => (
                  <tr key={submission._id} className="hover align-top">
                    <td>
                      <p className="font-semibold text-slate-900">
                        {submission.task?.title}
                      </p>
                      <p className="text-xs text-slate-500">
                        {submission.payableAmount} coins
                      </p>
                    </td>
                    <td>
                      <p className="font-medium text-slate-900">
                        {submission.worker?.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {submission.worker?.email}
                      </p>
                    </td>
                    <td className="max-w-lg whitespace-pre-line text-sm text-slate-600">
                      {submission.submissionDetails}
                    </td>
                    <td>
                      <StatusBadge status={submission.status} />
                    </td>
                    <td>
                      {submission.status === "pending" ? (
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              approveMutation.mutate(submission._id)
                            }
                            className="btn btn-sm rounded-full btn-success text-white"
                          >
                            Approve
                          </button>
                          <button
                            type="button"
                            onClick={() => handleReject(submission)}
                            className="btn btn-sm rounded-full btn-error text-white"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-sm text-slate-500">Reviewed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            title="No submissions waiting for review"
            description="Once workers submit completed tasks, they will appear here for approval or rejection."
          />
        )}
      </div>
    </div>
  );
};

export default BuyerReviewQueue;
