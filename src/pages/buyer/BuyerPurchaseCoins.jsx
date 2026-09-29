import { useMutation } from "@tanstack/react-query";
import Swal from "sweetalert2";
import apiClient from "../../api/axios";
import PageHeader from "../../components/ui/PageHeader";

const packages = [
  { id: "basic", coins: 10, amount: 1, label: "Starter" },
  { id: "growth", coins: 150, amount: 10, label: "Growth" },
  { id: "scale", coins: 500, amount: 20, label: "Scale" },
  { id: "elite", coins: 1000, amount: 35, label: "Elite" },
];

const BuyerPurchaseCoins = () => {
  const checkoutMutation = useMutation({
    mutationFn: (packageId) =>
      apiClient.post("/payments/checkout-session", { packageId }),
    onSuccess: async ({ data }) => {
      if (data.demo && data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
        return;
      }
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        Swal.fire({
          icon: "success",
          title: "Checkout ready",
          text: "Redirecting to payment page.",
        });
      }
    },
  });

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Purchase coins"
        title="Top up your buyer wallet"
        description="Choose a package that matches the scale of the task campaign you want to run."
      />

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {packages.map((item) => (
          <div key={item.id} className="card-soft p-6">
            <p className="text-sm font-bold uppercase tracking-[0.28em] text-primary">
              {item.label}
            </p>
            <p className="mt-4 text-4xl font-black text-slate-900">
              {item.coins}
            </p>
            <p className="mt-2 text-sm text-slate-500">
              coins for ${item.amount}
            </p>
            <button
              type="button"
              onClick={() => checkoutMutation.mutate(item.id)}
              className="btn btn-primary mt-6 w-full rounded-2xl text-white"
            >
              Buy now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BuyerPurchaseCoins;
