import { useQuery } from "@tanstack/react-query";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { FiUsers, FiDollarSign, FiCreditCard } from "react-icons/fi";
import apiClient from "../../api/axios";
import PageHeader from "../../components/ui/PageHeader";
import DashboardStatGrid from "../../components/ui/DashboardStatGrid";
import LoadingOverlay from "../../components/ui/LoadingOverlay";
import EmptyState from "../../components/ui/EmptyState";

const AdminHome = () => {
  const statsQuery = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => (await apiClient.get("/admin/stats")).data,
  });

  const withdrawalsQuery = useQuery({
    queryKey: ["admin-withdrawals-preview"],
    queryFn: async () => (await apiClient.get("/admin/withdrawals")).data,
  });

  const stats = statsQuery.data?.stats;
  const withdrawals = withdrawalsQuery.data?.withdrawals || [];
  const chartData = [
    { name: "Workers", value: stats?.totalWorkers || 0 },
    { name: "Buyers", value: stats?.totalBuyers || 0 },
    { name: "Coins", value: stats?.totalCoins || 0 },
    { name: "Payments", value: stats?.totalPayments || 0 },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Admin overview"
        title="Monitor platform health and moderation tasks"
        description="Track platform growth, pending withdrawals, and open reports from a single control panel."
      />

      {statsQuery.isLoading ? (
        <LoadingOverlay label="Loading admin statistics" />
      ) : null}

      {stats ? (
        <DashboardStatGrid
          items={[
            {
              title: "Total workers",
              value: stats.totalWorkers,
              description: "Active worker accounts",
              icon: <FiUsers />,
              tone: "primary",
            },
            {
              title: "Total buyers",
              value: stats.totalBuyers,
              description: "Active buyer accounts",
              icon: <FiUsers />,
              tone: "secondary",
            },
            {
              title: "Total coins",
              value: stats.totalCoins,
              description: "Coins across all users",
              icon: <FiDollarSign />,
              tone: "emerald",
            },
            {
              title: "Total payments",
              value: stats.totalPayments,
              description: "Completed coin purchases",
              icon: <FiCreditCard />,
              tone: "amber",
            },
          ]}
        />
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <div className="card-soft p-6">
          <h2 className="text-xl font-bold text-slate-900">
            Platform snapshot
          </h2>
          <p className="text-sm text-slate-500">
            System-wide distribution across users, coins, and payments.
          </p>
          <div className="mt-6 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <XAxis dataKey="name" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#17a899"
                  fill="#d6f5ee"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="card-soft p-6">
          <h2 className="text-xl font-bold text-slate-900">
            Pending withdrawals
          </h2>
          <div className="mt-5 space-y-4">
            {withdrawals.length > 0 ? (
              withdrawals.slice(0, 4).map((withdrawal) => (
                <div
                  key={withdrawal._id}
                  className="rounded-2xl bg-slate-50 p-4"
                >
                  <p className="font-semibold text-slate-900">
                    {withdrawal.user?.name}
                  </p>
                  <p className="text-sm text-slate-500">
                    {withdrawal.coinsToWithdraw} coins via{" "}
                    {withdrawal.paymentMethod}
                  </p>
                </div>
              ))
            ) : (
              <EmptyState
                title="No withdrawals waiting"
                description="Admin approval requests will appear here when workers request payouts."
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
