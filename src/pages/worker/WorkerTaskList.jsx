import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import apiClient from "../../api/axios";
import PageHeader from "../../components/ui/PageHeader";
import TaskCard from "../../components/ui/TaskCard";
import LoadingOverlay from "../../components/ui/LoadingOverlay";
import Pagination from "../../components/ui/Pagination";
import EmptyState from "../../components/ui/EmptyState";

const WorkerTaskList = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  const { data, isLoading } = useQuery({
    queryKey: ["worker-task-list", page, search, sortOrder],
    queryFn: async () =>
      (
        await apiClient.get("/tasks", {
          params: {
            page,
            limit: 9,
            search,
            sortBy: "completionDate",
            sortOrder,
          },
        })
      ).data,
  });

  const tasks = data?.tasks || [];
  const pagination = data?.pagination || { page: 1, totalPages: 1 };

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Available work"
        title="Browse active tasks"
        description="Search by keyword, sort by deadline, and open a task when you are ready to submit."
        action={
          <Link
            to="/dashboard/worker/submissions"
            className="btn btn-primary rounded-full text-white"
          >
            View my submissions
          </Link>
        }
      />

      <div className="card-soft flex flex-col gap-4 p-5 md:flex-row md:items-center">
        <label className="input input-bordered flex items-center gap-3 rounded-full bg-white md:flex-1">
          <FiSearch className="text-slate-400" />
          <input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Search task title, details, or instructions"
            className="grow bg-transparent outline-none"
          />
        </label>
        <select
          value={sortOrder}
          onChange={(event) => setSortOrder(event.target.value)}
          className="select select-bordered rounded-full bg-white md:w-48"
        >
          <option value="asc">Earliest deadline</option>
          <option value="desc">Latest deadline</option>
        </select>
      </div>

      {isLoading ? <LoadingOverlay label="Loading task board" /> : null}

      {tasks.length > 0 ? (
        <>
          <div className="grid gap-6 xl:grid-cols-2">
            {tasks.map((task) => (
              <TaskCard key={task._id} task={task} />
            ))}
          </div>
          <Pagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            onPrev={() => setPage((current) => Math.max(current - 1, 1))}
            onNext={() =>
              setPage((current) => Math.min(current + 1, pagination.totalPages))
            }
          />
        </>
      ) : (
        <EmptyState
          title="No active tasks matched your search"
          description="Try a different keyword or revisit after buyers publish more work."
        />
      )}
    </div>
  );
};

export default WorkerTaskList;
