import { Navigate, Route, Routes } from "react-router-dom";
import RootLayout from "./components/layout/RootLayout";
import DashboardLayout from "./components/layout/DashboardLayout";
import ProtectedRoute from "./components/ui/ProtectedRoute";
import RoleRoute from "./components/ui/RoleRoute";
import LoadingScreen from "./components/ui/LoadingScreen";
import { useAuth } from "./context/AuthContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import WorkerHome from "./pages/worker/WorkerHome";
import WorkerTaskList from "./pages/worker/WorkerTaskList";
import WorkerTaskDetails from "./pages/worker/WorkerTaskDetails";
import WorkerSubmissions from "./pages/worker/WorkerSubmissions";
import WorkerApprovedSubmissions from "./pages/worker/WorkerApprovedSubmissions";
import WorkerWithdrawals from "./pages/worker/WorkerWithdrawals";
import BuyerHome from "./pages/buyer/BuyerHome";
import BuyerAddTask from "./pages/buyer/BuyerAddTask";
import BuyerMyTasks from "./pages/buyer/BuyerMyTasks";
import BuyerReviewQueue from "./pages/buyer/BuyerReviewQueue";
import BuyerPurchaseCoins from "./pages/buyer/BuyerPurchaseCoins";
import BuyerPaymentHistory from "./pages/buyer/BuyerPaymentHistory";
import AdminHome from "./pages/admin/AdminHome";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminTasks from "./pages/admin/AdminTasks";
import AdminWithdrawals from "./pages/admin/AdminWithdrawals";
import AdminReports from "./pages/admin/AdminReports";

const DashboardRedirect = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const targetByRole = {
    Worker: "/dashboard/worker",
    Buyer: "/dashboard/buyer",
    Admin: "/dashboard/admin",
  };

  return <Navigate to={targetByRole[user.role] || "/"} replace />;
};

const App = () => {
  const { loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardRedirect />} />
        <Route
          path="worker"
          element={
            <RoleRoute roles={["Worker"]}>
              <WorkerHome />
            </RoleRoute>
          }
        />
        <Route
          path="worker/tasks"
          element={
            <RoleRoute roles={["Worker"]}>
              <WorkerTaskList />
            </RoleRoute>
          }
        />
        <Route
          path="worker/tasks/:id"
          element={
            <RoleRoute roles={["Worker"]}>
              <WorkerTaskDetails />
            </RoleRoute>
          }
        />
        <Route
          path="worker/submissions"
          element={
            <RoleRoute roles={["Worker"]}>
              <WorkerSubmissions />
            </RoleRoute>
          }
        />
        <Route
          path="worker/approved"
          element={
            <RoleRoute roles={["Worker"]}>
              <WorkerApprovedSubmissions />
            </RoleRoute>
          }
        />
        <Route
          path="worker/withdrawals"
          element={
            <RoleRoute roles={["Worker"]}>
              <WorkerWithdrawals />
            </RoleRoute>
          }
        />

        <Route
          path="buyer"
          element={
            <RoleRoute roles={["Buyer"]}>
              <BuyerHome />
            </RoleRoute>
          }
        />
        <Route
          path="buyer/add-task"
          element={
            <RoleRoute roles={["Buyer"]}>
              <BuyerAddTask />
            </RoleRoute>
          }
        />
        <Route
          path="buyer/tasks"
          element={
            <RoleRoute roles={["Buyer"]}>
              <BuyerMyTasks />
            </RoleRoute>
          }
        />
        <Route
          path="buyer/task-to-review"
          element={
            <RoleRoute roles={["Buyer"]}>
              <BuyerReviewQueue />
            </RoleRoute>
          }
        />
        <Route
          path="buyer/purchase-coins"
          element={
            <RoleRoute roles={["Buyer"]}>
              <BuyerPurchaseCoins />
            </RoleRoute>
          }
        />
        <Route
          path="buyer/payment-history"
          element={
            <RoleRoute roles={["Buyer"]}>
              <BuyerPaymentHistory />
            </RoleRoute>
          }
        />

        <Route
          path="admin"
          element={
            <RoleRoute roles={["Admin"]}>
              <AdminHome />
            </RoleRoute>
          }
        />
        <Route
          path="admin/users"
          element={
            <RoleRoute roles={["Admin"]}>
              <AdminUsers />
            </RoleRoute>
          }
        />
        <Route
          path="admin/tasks"
          element={
            <RoleRoute roles={["Admin"]}>
              <AdminTasks />
            </RoleRoute>
          }
        />
        <Route
          path="admin/withdrawals"
          element={
            <RoleRoute roles={["Admin"]}>
              <AdminWithdrawals />
            </RoleRoute>
          }
        />
        <Route
          path="admin/reports"
          element={
            <RoleRoute roles={["Admin"]}>
              <AdminReports />
            </RoleRoute>
          }
        />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
