import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiMail, FiLock } from "react-icons/fi";
import { FaGoogle } from "react-icons/fa6";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { loginWithEmail, loginWithGoogle } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      const result = await loginWithEmail(values);
      const target = result?.user?.role
        ? `/dashboard/${result.user.role.toLowerCase()}`
        : from;
      navigate(target, { replace: true });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogle = async () => {
    setIsSubmitting(true);
    try {
      const result = await loginWithGoogle("Worker");
      navigate(`/dashboard/${result.user.role.toLowerCase()}`, {
        replace: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-7xl items-center gap-8 px-4 py-10 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
      <div className="space-y-6">
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-primary">
          Welcome back
        </p>
        <h1 className="text-4xl font-black tracking-tight text-slate-900 md:text-5xl">
          Sign in to manage your Taskora workspace
        </h1>
        <p className="max-w-xl text-lg leading-8 text-slate-600">
          Continue your work, review tasks, and keep your balance and
          notifications in sync across devices.
        </p>
      </div>

      <div className="card-soft p-6 md:p-10">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="label">
              <span className="label-text font-semibold">Email</span>
            </label>
            <div className="input input-bordered flex items-center gap-3 rounded-2xl bg-white">
              <FiMail className="text-slate-400" />
              <input
                type="email"
                className="grow bg-transparent outline-none"
                placeholder="Enter your email"
                {...register("email", { required: "Email is required" })}
              />
            </div>
            {errors.email ? (
              <p className="mt-2 text-sm text-error">{errors.email.message}</p>
            ) : null}
          </div>

          <div>
            <label className="label">
              <span className="label-text font-semibold">Password</span>
            </label>
            <div className="input input-bordered flex items-center gap-3 rounded-2xl bg-white">
              <FiLock className="text-slate-400" />
              <input
                type="password"
                className="grow bg-transparent outline-none"
                placeholder="Enter your password"
                {...register("password", { required: "Password is required" })}
              />
            </div>
            {errors.password ? (
              <p className="mt-2 text-sm text-error">
                {errors.password.message}
              </p>
            ) : null}
          </div>

          <div>
            <label className="label">
              <span className="label-text font-semibold">Role</span>
            </label>
            <select
              className="select select-bordered w-full rounded-2xl bg-white"
              {...register("role")}
              defaultValue="Worker"
            >
              <option value="Worker">Worker</option>
              <option value="Buyer">Buyer</option>
            </select>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full rounded-2xl text-white"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="loading loading-spinner loading-sm" />
            ) : (
              "Sign in with email"
            )}
          </button>
        </form>

        <div className="divider my-6">or</div>

        <button
          type="button"
          onClick={handleGoogle}
          className="btn btn-outline w-full rounded-2xl"
        >
          <FaGoogle /> Continue with Google
        </button>

        <p className="mt-6 text-center text-sm text-slate-600">
          No account yet?{" "}
          <Link to="/register" className="font-bold text-primary">
            Create one here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
