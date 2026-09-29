import { useQuery } from "@tanstack/react-query";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { FiCheckCircle, FiClock, FiDollarSign, FiInbox } from "react-icons/fi";
import apiClient from "../../api/axios";
import PageHeader from "../../components/ui/PageHeader";
import DashboardStatGrid from "../../components/ui/DashboardStatGrid";
import LoadingOverlay from "../../components/ui/LoadingOverlay";
import EmptyState from "../../components/ui/EmptyState";

const WorkerHome = () => {
  const statsQuery = useQuery({
    queryKey: ["worker-stats"],
    queryFn: async () => (await apiClient.get("/users/stats")).data,
  });

  const approvedQuery = useQuery({
    queryKey: ["worker-approved-submissions"],
    queryFn: async () => (await apiClient.get("/submissions/approved/me")).data,
  });

  const stats = statsQuery.data?.stats;
  const approved = approvedQuery.data?.submissions || [];

  const chartData = [
    { name: "Submissions", value: stats?.totalSubmissions || 0 },
    { name: "Pending", value: stats?.pendingSubmissions || 0 },
    { name: "Approved", value: stats?.approvedSubmissions || 0 },
    { name: "Earnings", value: stats?.totalEarnings || 0 },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Worker overview"
        title="Track your earnings and submission performance"
        description="Keep an eye on your pending submissions, completed work, and coin balance from one dashboard."
      />

      {statsQuery.isLoading ? (
        <LoadingOverlay label="Loading worker statistics" />
      ) : null}

      {stats ? (
        <DashboardStatGrid
          items={[
            {
              title: "Total submissions",
              value: stats.totalSubmissions,
              description: "All work you have submitted",
              icon: <FiInbox />,
              tone: "primary",
            },
            {
              title: "Pending submissions",
              value: stats.pendingSubmissions,
              description: "Waiting for buyer review",
              icon: <FiClock />,
              tone: "secondary",
            },
            {
              title: "Approved submissions",
              value: stats.approvedSubmissions,
              description: "Paid work confirmed by buyers",
              icon: <FiCheckCircle />,
              tone: "emerald",
            },
            {
              title: "Total earnings",
              value: stats.totalEarnings,
              description: "Coins earned from approved tasks",
              icon: <FiDollarSign />,
              tone: "amber",
            },
          ]}
        />
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="card-soft p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Activity summary
              </h2>
              <p className="text-sm text-slate-500">
                A quick snapshot of your current performance
              </p>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#17a899" radius={[12, 12, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card-soft p-6">
          <h2 className="text-xl font-bold text-slate-900">
            Recent approved work
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Your newest wins are listed here.
          </p>
          <div className="mt-5 space-y-4">
            {approved.length > 0 ? (
              approved.slice(0, 4).map((item) => (
                <div key={item._id} className="rounded-2xl bg-slate-50 p-4">
                  <p className="font-semibold text-slate-900">
                    {item.task?.title || item.taskTitle}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    {item.payableAmount} coins earned from {item.buyerName}
                  </p>
                </div>
              ))
            ) : (
              <EmptyState
                title="No approved submissions yet"
                description="Complete your first task to see approved work here."
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkerHome;
