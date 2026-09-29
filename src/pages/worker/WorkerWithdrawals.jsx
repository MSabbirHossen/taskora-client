import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import apiClient from "../../api/axios";
import PageHeader from "../../components/ui/PageHeader";
import LoadingOverlay from "../../components/ui/LoadingOverlay";
import EmptyState from "../../components/ui/EmptyState";
import StatusBadge from "../../components/ui/StatusBadge";
import Pagination from "../../components/ui/Pagination";
import { useAuth } from "../../context/AuthContext";

const WorkerWithdrawals = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const { register, watch, handleSubmit, reset } = useForm({
    defaultValues: { coinsToWithdraw: 200, paymentMethod: "Stripe" },
  });
  const coinsToWithdraw = Number(watch("coinsToWithdraw") || 0);
  const withdrawAmount = (coinsToWithdraw / 20).toFixed(2);

  const withdrawalsQuery = useQuery({
    queryKey: ["worker-withdrawals", page],
    queryFn: async () =>
      (await apiClient.get("/withdrawals/me", { params: { page, limit: 8 } }))
        .data,
  });

  const createWithdrawalMutation = useMutation({
    mutationFn: (payload) => apiClient.post("/withdrawals", payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["worker-withdrawals"] });
      Swal.fire({
        icon: "success",
        title: "Withdrawal requested",
        text: "Your request is now waiting for admin approval.",
      });
      reset({ coinsToWithdraw: 200, paymentMethod: "Stripe" });
    },
  });

  const onSubmit = async (values) => {
    await createWithdrawalMutation.mutateAsync(values);
  };

  const withdrawals = withdrawalsQuery.data?.withdrawals || [];
  const pagination = withdrawalsQuery.data?.pagination || {
    page: 1,
    totalPages: 1,
  };
  const canWithdraw =
    user?.coins >= 200 &&
    coinsToWithdraw >= 200 &&
    coinsToWithdraw <= user?.coins;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Withdraw coins"
        title="Convert earned coins to cash"
        description="The platform uses a 20 coins = 1 dollar conversion rate with a minimum withdrawal threshold of 200 coins."
      />

      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="card-soft p-6 md:p-8">
          <h2 className="text-2xl font-black text-slate-900">
            Withdrawal form
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Your balance: {user?.coins || 0} coins
          </p>
          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
            <label className="grid gap-2">
              <span className="text-sm font-semibold text-slate-700">
                Coins to withdraw
              </span>
              <input
                type="number"
                className="input input-bordered rounded-2xl bg-white"
                min="200"
                max={user?.coins || 0}
                {...register("coinsToWithdraw", {
                  valueAsNumber: true,
                  required: true,
                  min: 200,
                })}
              />
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-semibold text-slate-700">
                Withdraw amount
              </span>
              <input
                type="text"
                readOnly
                className="input input-bordered rounded-2xl bg-slate-50"
                value={`$${withdrawAmount}`}
              />
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-semibold text-slate-700">
                Payment method
              </span>
              <select
                className="select select-bordered rounded-2xl bg-white"
                {...register("paymentMethod")}
              >
                <option value="Stripe">Stripe</option>
                <option value="BKash">BKash</option>
                <option value="Nagad">Nagad</option>
                <option value="Bank Transfer">Bank Transfer</option>
              </select>
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-semibold text-slate-700">
                Account number
              </span>
              <input
                className="input input-bordered rounded-2xl bg-white"
                placeholder="Enter your account or wallet number"
                {...register("accountNumber", { required: true, minLength: 3 })}
              />
            </label>
            {canWithdraw ? (
              <button
                type="submit"
                className="btn btn-primary w-full rounded-2xl text-white"
                disabled={createWithdrawalMutation.isPending}
              >
                {createWithdrawalMutation.isPending ? (
                  <span className="loading loading-spinner loading-sm" />
                ) : (
                  "Request withdrawal"
                )}
              </button>
            ) : (
              <div className="rounded-2xl bg-amber-50 px-4 py-3 text-sm font-medium text-amber-700">
                You need at least 200 coins and enough balance for the requested
                amount before you can submit a withdrawal.
              </div>
            )}
          </form>
        </div>

        <div className="card-soft p-6 md:p-8">
          <h2 className="text-2xl font-black text-slate-900">
            Withdrawal history
          </h2>
          {withdrawalsQuery.isLoading ? (
            <LoadingOverlay label="Loading withdrawals" />
          ) : null}
          <div className="mt-6 space-y-4">
            {withdrawals.length > 0 ? (
              withdrawals.map((withdrawal) => (
                <div
                  key={withdrawal._id}
                  className="rounded-2xl bg-slate-50 p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-900">
                        {withdrawal.coinsToWithdraw} coins
                      </p>
                      <p className="text-sm text-slate-500">
                        $
                        {withdrawal.withdrawAmount.toFixed?.(2) ||
                          withdrawal.withdrawAmount}{" "}
                        via {withdrawal.paymentMethod}
                      </p>
                    </div>
                    <StatusBadge status={withdrawal.status} />
                  </div>
                </div>
              ))
            ) : (
              <EmptyState
                title="No withdrawal requests yet"
                description="Submit a request after you cross the minimum balance and want to cash out."
              />
            )}
          </div>
        </div>
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

export default WorkerWithdrawals;
