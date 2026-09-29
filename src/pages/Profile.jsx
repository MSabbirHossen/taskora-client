import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { user, updateLocalProfile } = useAuth();
  const { register, handleSubmit } = useForm({
    defaultValues: { name: user?.name || "", image: user?.image || "" },
  });
  const [saving, setSaving] = useState(false);

  const onSubmit = async (values) => {
    setSaving(true);
    try {
      await updateLocalProfile(values);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 lg:px-8">
      <div className="card-soft p-6 md:p-10">
        <div className="flex items-center gap-4">
          <img
            src={user?.image}
            alt={user?.name}
            className="h-20 w-20 rounded-3xl object-cover"
          />
          <div>
            <h1 className="text-3xl font-black text-slate-900">Your profile</h1>
            <p className="text-slate-500">
              Update your display name and image whenever you need to.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 grid gap-5">
          <label className="grid gap-2">
            <span className="font-semibold text-slate-700">Name</span>
            <input
              className="input input-bordered rounded-2xl bg-white"
              {...register("name", { required: true })}
            />
          </label>
          <label className="grid gap-2">
            <span className="font-semibold text-slate-700">
              Profile image URL
            </span>
            <input
              className="input input-bordered rounded-2xl bg-white"
              {...register("image", { required: true })}
            />
          </label>
          <button
            type="submit"
            className="btn btn-primary rounded-2xl text-white"
            disabled={saving}
          >
            {saving ? (
              <span className="loading loading-spinner loading-sm" />
            ) : (
              "Save changes"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
