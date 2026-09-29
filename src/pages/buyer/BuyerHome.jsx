import { useQuery } from "@tanstack/react-query";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { FiBox, FiUsers, FiCreditCard, FiDollarSign } from "react-icons/fi";
import apiClient from "../../api/axios";
import PageHeader from "../../components/ui/PageHeader";
import DashboardStatGrid from "../../components/ui/DashboardStatGrid";
import LoadingOverlay from "../../components/ui/LoadingOverlay";
import EmptyState from "../../components/ui/EmptyState";

const BuyerHome = () => {
  const statsQuery = useQuery({
    queryKey: ["buyer-stats"],
    queryFn: async () => (await apiClient.get("/users/stats")).data,
  });

  const myTasksQuery = useQuery({
    queryKey: ["buyer-tasks-preview"],
    queryFn: async () => (await apiClient.get("/tasks/buyer/me")).data,
  });

  const stats = statsQuery.data?.stats;
  const tasks = myTasksQuery.data?.tasks || [];
  const pieData = [
    { name: "Tasks", value: stats?.totalTasks || 0 },
    { name: "Workers", value: stats?.pendingWorkers || 0 },
    { name: "Paid", value: stats?.amountPaid || 0 },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Buyer overview"
        title="Manage campaigns, task slots, and coin spend"
        description="Create work, approve submissions, and keep every payment visible from a single workspace."
      />

      {statsQuery.isLoading ? (
        <LoadingOverlay label="Loading buyer statistics" />
      ) : null}

      {stats ? (
        <DashboardStatGrid
          items={[
            {
              title: "Total tasks",
              value: stats.totalTasks,
              description: "Tasks created by your team",
              icon: <FiBox />,
              tone: "primary",
            },
            {
              title: "Pending workers",
              value: stats.pendingWorkers,
              description: "Open task slots remaining",
              icon: <FiUsers />,
              tone: "secondary",
            },
            {
              title: "Amount paid",
              value: stats.amountPaid,
              description: "Money spent on coin packages",
              icon: <FiCreditCard />,
              tone: "emerald",
            },
            {
              title: "Coins purchased",
              value: stats.amountPaid,
              description: "Tracked through your purchases",
              icon: <FiDollarSign />,
              tone: "amber",
            },
          ]}
        />
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="card-soft p-6">
          <h2 className="text-xl font-bold text-slate-900">
            Performance chart
          </h2>
          <p className="text-sm text-slate-500">
            A quick summary of your campaign footprint.
          </p>
          <div className="mt-6 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={72}
                  outerRadius={100}
                  paddingAngle={4}
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={entry.name}
                      fill={["#17a899", "#f97116", "#38bdf8"][index % 3]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="card-soft p-6">
          <h2 className="text-xl font-bold text-slate-900">
            Your latest tasks
          </h2>
          <div className="mt-5 space-y-4">
            {tasks.length > 0 ? (
              tasks.slice(0, 4).map((task) => (
                <div key={task._id} className="rounded-2xl bg-slate-50 p-4">
                  <p className="font-semibold text-slate-900">{task.title}</p>
                  <p className="mt-1 text-sm text-slate-500">
                    {task.requiredWorkers} slots available |{" "}
                    {task.payableAmount} coins each
                  </p>
                </div>
              ))
            ) : (
              <EmptyState
                title="No tasks yet"
                description="Create your first task to start receiving submissions from workers."
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyerHome;
