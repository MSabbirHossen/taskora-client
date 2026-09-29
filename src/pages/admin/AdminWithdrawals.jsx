import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import apiClient from "../../api/axios";
import PageHeader from "../../components/ui/PageHeader";
import LoadingOverlay from "../../components/ui/LoadingOverlay";
import EmptyState from "../../components/ui/EmptyState";
import StatusBadge from "../../components/ui/StatusBadge";

const AdminWithdrawals = () => {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["admin-withdrawals"],
    queryFn: async () => (await apiClient.get("/admin/withdrawals")).data,
  });

  const approveMutation = useMutation({
    mutationFn: (id) => apiClient.patch(`/admin/withdrawals/${id}/approve`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-withdrawals"] });
      Swal.fire({
        icon: "success",
        title: "Withdrawal approved",
        text: "The worker balance has been updated.",
      });
    },
  });

  const withdrawals = data?.withdrawals || [];

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Withdraw requests"
        title="Approve worker withdrawals"
        description="Review each pending request and confirm the payout when the account details are correct."
      />

      {isLoading ? (
        <LoadingOverlay label="Loading withdrawal requests" />
      ) : null}

      <div className="card-soft overflow-hidden">
        {withdrawals.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Worker</th>
                  <th>Coins</th>
                  <th>Amount</th>
                  <th>Payment method</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {withdrawals.map((withdrawal) => (
                  <tr key={withdrawal._id} className="hover">
                    <td>
                      <p className="font-semibold text-slate-900">
                        {withdrawal.user?.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {withdrawal.accountNumber}
                      </p>
                    </td>
                    <td>{withdrawal.coinsToWithdraw}</td>
                    <td>${withdrawal.withdrawAmount}</td>
                    <td>{withdrawal.paymentMethod}</td>
                    <td>
                      <StatusBadge status={withdrawal.status} />
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={() => approveMutation.mutate(withdrawal._id)}
                        className="btn btn-sm rounded-full btn-success text-white"
                      >
                        Approve
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            title="No pending withdrawal requests"
            description="When workers request cash-outs, they will be listed here for approval."
          />
        )}
      </div>
    </div>
  );
};

export default AdminWithdrawals;
