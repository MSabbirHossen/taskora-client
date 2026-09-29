import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { FiUser, FiMail, FiLock, FiImage } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const { registerWithEmail } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { role: "Worker" } });

  const onSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      const result = await registerWithEmail(values);
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
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-secondary">
          Join Taskora
        </p>
        <h1 className="text-4xl font-black tracking-tight text-slate-900 md:text-5xl">
          Create a worker or buyer account in minutes
        </h1>
        <p className="max-w-xl text-lg leading-8 text-slate-600">
          The platform automatically credits starter coins after registration
          and keeps your session alive across reloads.
        </p>
      </div>

      <div className="card-soft p-6 md:p-10">
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5">
          <div>
            <label className="label">
              <span className="label-text font-semibold">Name</span>
            </label>
            <div className="input input-bordered flex items-center gap-3 rounded-2xl bg-white">
              <FiUser className="text-slate-400" />
              <input
                type="text"
                className="grow bg-transparent outline-none"
                placeholder="Your full name"
                {...register("name", {
                  required: "Name is required",
                  minLength: { value: 2, message: "Use at least 2 characters" },
                })}
              />
            </div>
            {errors.name ? (
              <p className="mt-2 text-sm text-error">{errors.name.message}</p>
            ) : null}
          </div>

          <div>
            <label className="label">
              <span className="label-text font-semibold">Email</span>
            </label>
            <div className="input input-bordered flex items-center gap-3 rounded-2xl bg-white">
              <FiMail className="text-slate-400" />
              <input
                type="email"
                className="grow bg-transparent outline-none"
                placeholder="name@example.com"
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
                placeholder="Create a strong password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
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
              <span className="label-text font-semibold">
                Profile image URL
              </span>
            </label>
            <div className="input input-bordered flex items-center gap-3 rounded-2xl bg-white">
              <FiImage className="text-slate-400" />
              <input
                type="url"
                className="grow bg-transparent outline-none"
                placeholder="https://example.com/photo.jpg"
                {...register("image", {
                  required: "Profile image URL is required",
                })}
              />
            </div>
            {errors.image ? (
              <p className="mt-2 text-sm text-error">{errors.image.message}</p>
            ) : null}
          </div>

          <div>
            <label className="label">
              <span className="label-text font-semibold">Role</span>
            </label>
            <select
              className="select select-bordered w-full rounded-2xl bg-white"
              {...register("role")}
            >
              <option value="Worker">Worker</option>
              <option value="Buyer">Buyer</option>
            </select>
          </div>

          <button
            type="submit"
            className="btn btn-primary rounded-2xl text-white"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="loading loading-spinner loading-sm" />
            ) : (
              "Create account"
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Already have an account?{" "}
          <Link to="/login" className="font-bold text-primary">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
