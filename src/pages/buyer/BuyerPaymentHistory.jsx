import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import apiClient from "../../api/axios";
import PageHeader from "../../components/ui/PageHeader";
import LoadingOverlay from "../../components/ui/LoadingOverlay";
import EmptyState from "../../components/ui/EmptyState";
import StatusBadge from "../../components/ui/StatusBadge";

const BuyerPaymentHistory = () => {
  const [params] = useSearchParams();
  const queryClient = useQueryClient();

  const historyQuery = useQuery({
    queryKey: ["buyer-payment-history"],
    queryFn: async () => (await apiClient.get("/payments/me")).data,
  });

  const confirmMutation = useMutation({
    mutationFn: (payload) => apiClient.post("/payments/confirm", payload),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["buyer-payment-history"] }),
  });

  useEffect(() => {
    const sessionId = params.get("session_id");
    const paymentId = params.get("paymentId");
    if (sessionId || paymentId) {
      confirmMutation.mutate({ sessionId, paymentId });
    }
  }, [params]);

  const payments = historyQuery.data?.payments || [];

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Payment history"
        title="Track every coin purchase"
        description="Confirm purchases, review package sizes, and keep a reliable record of your wallet top-ups."
      />

      {historyQuery.isLoading ? (
        <LoadingOverlay label="Loading payment history" />
      ) : null}

      <div className="card-soft overflow-hidden">
        {payments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Package</th>
                  <th>Coins</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment._id} className="hover">
                    <td>{payment.packageId}</td>
                    <td>{payment.coins}</td>
                    <td>${payment.amount}</td>
                    <td>
                      <StatusBadge status={payment.status} />
                    </td>
                    <td>{new Date(payment.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            title="No payments yet"
            description="Buy a coin package when your balance needs a boost for the next campaign."
          />
        )}
      </div>
    </div>
  );
};

export default BuyerPaymentHistory;
