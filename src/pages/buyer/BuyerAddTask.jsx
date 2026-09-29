import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import apiClient from "../../api/axios";
import PageHeader from "../../components/ui/PageHeader";

const BuyerAddTask = () => {
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { register, handleSubmit, watch } = useForm({
    defaultValues: { requiredWorkers: 1, payableAmount: 10 },
  });
  const requiredWorkers = Number(watch("requiredWorkers") || 0);
  const payableAmount = Number(watch("payableAmount") || 0);
  const totalCost = requiredWorkers * payableAmount;

  const createTaskMutation = useMutation({
    mutationFn: (payload) => apiClient.post("/tasks", payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["buyer-tasks-preview"] });
      queryClient.invalidateQueries({ queryKey: ["buyer-task-list"] });
      Swal.fire({
        icon: "success",
        title: "Task published",
        text: "Your task is now available for workers.",
      });
      navigate("/dashboard/buyer/tasks");
    },
    onError: (error) => {
      const redirectTo = error?.response?.data?.details?.redirectTo;
      if (redirectTo) {
        Swal.fire({
          icon: "warning",
          title: "Coins required",
          text: "You need to purchase more coins before publishing this task.",
        }).then(() => navigate(redirectTo));
      }
    },
  });

  const onSubmit = async (values) => {
    setSaving(true);
    try {
      await createTaskMutation.mutateAsync(values);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="New task"
        title="Publish a micro-task"
        description="Set a deadline, define the submission instructions, and reserve coins for the workers who will complete the job."
      />

      <div className="card-soft p-6 md:p-8">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid gap-5 lg:grid-cols-2"
        >
          <label className="grid gap-2 lg:col-span-2">
            <span className="font-semibold text-slate-700">Task title</span>
            <input
              className="input input-bordered rounded-2xl bg-white"
              placeholder="Write a clear task title"
              {...register("title", { required: true, minLength: 3 })}
            />
          </label>
          <label className="grid gap-2 lg:col-span-2">
            <span className="font-semibold text-slate-700">Task details</span>
            <textarea
              rows="6"
              className="textarea textarea-bordered rounded-2xl bg-white"
              placeholder="Explain the task in detail so workers can complete it accurately"
              {...register("detail", { required: true, minLength: 10 })}
            />
          </label>
          <label className="grid gap-2">
            <span className="font-semibold text-slate-700">
              Required workers
            </span>
            <input
              type="number"
              className="input input-bordered rounded-2xl bg-white"
              min="1"
              {...register("requiredWorkers", {
                valueAsNumber: true,
                required: true,
                min: 1,
              })}
            />
          </label>
          <label className="grid gap-2">
            <span className="font-semibold text-slate-700">
              Payable amount per worker
            </span>
            <input
              type="number"
              className="input input-bordered rounded-2xl bg-white"
              min="1"
              {...register("payableAmount", {
                valueAsNumber: true,
                required: true,
                min: 1,
              })}
            />
          </label>
          <label className="grid gap-2">
            <span className="font-semibold text-slate-700">
              Completion date
            </span>
            <input
              type="date"
              className="input input-bordered rounded-2xl bg-white"
              {...register("completionDate", { required: true })}
            />
          </label>
          <label className="grid gap-2">
            <span className="font-semibold text-slate-700">Task image URL</span>
            <input
              type="url"
              className="input input-bordered rounded-2xl bg-white"
              placeholder="https://i.ibb.co/..."
              {...register("image", { required: true })}
            />
          </label>
          <label className="grid gap-2 lg:col-span-2">
            <span className="font-semibold text-slate-700">
              Submission instructions
            </span>
            <textarea
              rows="4"
              className="textarea textarea-bordered rounded-2xl bg-white"
              placeholder="Tell workers exactly what evidence to include"
              {...register("submissionInfo", { required: true, minLength: 5 })}
            />
          </label>
          <div className="lg:col-span-2 rounded-3xl bg-slate-50 p-5">
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-slate-500">
              Task budget
            </p>
            <p className="mt-2 text-3xl font-black text-slate-900">
              {totalCost} coins
            </p>
            <p className="mt-2 text-sm text-slate-500">
              This amount will be reserved from your balance after the task is
              published.
            </p>
          </div>
          <button
            type="submit"
            className="btn btn-primary rounded-2xl text-white lg:col-span-2"
            disabled={saving || createTaskMutation.isPending}
          >
            {saving || createTaskMutation.isPending ? (
              <span className="loading loading-spinner loading-sm" />
            ) : (
              "Publish task"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BuyerAddTask;
