import { NavLink, Outlet } from "react-router-dom";
import {
  FiHome,
  FiList,
  FiDollarSign,
  FiUsers,
  FiUserCheck,
  FiBox,
  FiShield,
  FiPieChart,
  FiInbox,
  FiFileText,
} from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import NotificationBell from "../ui/NotificationBell";

const navigationByRole = {
  Worker: [
    { to: "/dashboard/worker", label: "Home", icon: <FiHome /> },
    { to: "/dashboard/worker/tasks", label: "Task List", icon: <FiList /> },
    {
      to: "/dashboard/worker/submissions",
      label: "My Submissions",
      icon: <FiInbox />,
    },
    {
      to: "/dashboard/worker/approved",
      label: "Approved",
      icon: <FiUserCheck />,
    },
    {
      to: "/dashboard/worker/withdrawals",
      label: "Withdrawals",
      icon: <FiDollarSign />,
    },
  ],
  Buyer: [
    { to: "/dashboard/buyer", label: "Home", icon: <FiHome /> },
    { to: "/dashboard/buyer/add-task", label: "Add Task", icon: <FiBox /> },
    { to: "/dashboard/buyer/tasks", label: "My Tasks", icon: <FiList /> },
    {
      to: "/dashboard/buyer/task-to-review",
      label: "Review",
      icon: <FiFileText />,
    },
    {
      to: "/dashboard/buyer/purchase-coins",
      label: "Purchase Coins",
      icon: <FiDollarSign />,
    },
    {
      to: "/dashboard/buyer/payment-history",
      label: "Payments",
      icon: <FiPieChart />,
    },
  ],
  Admin: [
    { to: "/dashboard/admin", label: "Home", icon: <FiHome /> },
    { to: "/dashboard/admin/users", label: "Manage Users", icon: <FiUsers /> },
    { to: "/dashboard/admin/tasks", label: "Manage Tasks", icon: <FiList /> },
    {
      to: "/dashboard/admin/withdrawals",
      label: "Withdrawals",
      icon: <FiDollarSign />,
    },
    { to: "/dashboard/admin/reports", label: "Reports", icon: <FiShield /> },
  ],
};

const DashboardLayout = () => {
  const { user, clearSession } = useAuth();
  const navItems = navigationByRole[user?.role] || [];

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <aside className="border-b border-slate-200 bg-slate-950 text-slate-100 lg:min-h-screen lg:w-80 lg:border-b-0 lg:border-r lg:border-slate-800">
          <div className="flex items-center gap-4 border-b border-slate-800 px-6 py-6">
            <img
              src={user?.image}
              alt={user?.name}
              className="h-14 w-14 rounded-2xl object-cover"
            />
            <div>
              <p className="text-lg font-bold">{user?.name}</p>
              <p className="text-sm text-slate-400">{user?.role}</p>
              <p className="text-sm font-semibold text-emerald-300">
                {user?.coins || 0} coins
              </p>
            </div>
          </div>
          <nav className="space-y-2 px-4 py-5">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={
                  item.to === "/dashboard/worker" ||
                  item.to === "/dashboard/buyer" ||
                  item.to === "/dashboard/admin"
                }
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${isActive ? "bg-white text-slate-950" : "text-slate-300 hover:bg-slate-900 hover:text-white"}`
                }
              >
                <span className="text-lg">{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="mt-auto hidden border-t border-slate-800 p-4 lg:block">
            <button
              type="button"
              onClick={clearSession}
              className="btn btn-block rounded-2xl border-0 bg-ember-500 text-white hover:bg-ember-600"
            >
              Logout
            </button>
          </div>
        </aside>

        <section className="flex flex-1 flex-col">
          <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
            <div className="flex items-center justify-between px-4 py-4 lg:px-8">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
                  Taskora Dashboard
                </p>
                <h1 className="text-xl font-bold text-slate-900 lg:text-2xl">
                  {user?.role} workspace
                </h1>
              </div>
              <div className="flex items-center gap-3">
                <NotificationBell />
                <button
                  type="button"
                  onClick={clearSession}
                  className="btn btn-sm rounded-full btn-outline hidden sm:inline-flex"
                >
                  Logout
                </button>
              </div>
            </div>
          </header>
          <main className="flex-1 px-4 py-6 lg:px-8 lg:py-8">
            <Outlet />
          </main>
        </section>
      </div>
    </div>
  );
};

export default DashboardLayout;
