import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import apiClient from "../../api/axios";
import PageHeader from "../../components/ui/PageHeader";
import LoadingOverlay from "../../components/ui/LoadingOverlay";
import StatusBadge from "../../components/ui/StatusBadge";
import EmptyState from "../../components/ui/EmptyState";

const AdminUsers = () => {
  const queryClient = useQueryClient();
  const [role, setRole] = useState("");
  const [search, setSearch] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["admin-users", search, role],
    queryFn: async () =>
      (await apiClient.get("/users/admin", { params: { search, role } })).data,
  });

  const updateRoleMutation = useMutation({
    mutationFn: ({ id, role }) =>
      apiClient.patch(`/users/admin/${id}/role`, { role }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["admin-users"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => apiClient.delete(`/users/admin/${id}`),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["admin-users"] }),
  });

  const users = data?.users || [];

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Manage users"
        title="Update roles and remove accounts"
        description="Keep the role structure clean by promoting, demoting, or removing users that no longer belong on the platform."
      />

      <div className="card-soft flex flex-col gap-4 p-5 md:flex-row">
        <input
          className="input input-bordered rounded-full bg-white md:flex-1"
          placeholder="Search users by name or email"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <select
          className="select select-bordered rounded-full bg-white md:w-56"
          value={role}
          onChange={(event) => setRole(event.target.value)}
        >
          <option value="">All roles</option>
          <option value="Worker">Worker</option>
          <option value="Buyer">Buyer</option>
          <option value="Admin">Admin</option>
        </select>
      </div>

      {isLoading ? <LoadingOverlay label="Loading users" /> : null}

      <div className="card-soft overflow-hidden">
        {users.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Coins</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className="hover">
                    <td>
                      <div className="flex items-center gap-3">
                        <img
                          src={user.image}
                          alt={user.name}
                          className="h-12 w-12 rounded-2xl object-cover"
                        />
                        <div>
                          <p className="font-semibold text-slate-900">
                            {user.name}
                          </p>
                          <p className="text-xs text-slate-500">
                            Created{" "}
                            {new Date(user.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td>{user.email}</td>
                    <td>
                      <StatusBadge status={user.role.toLowerCase()} />
                    </td>
                    <td>{user.coins}</td>
                    <td>
                      <div className="flex flex-wrap gap-2">
                        <select
                          defaultValue={user.role}
                          onChange={(event) =>
                            updateRoleMutation.mutate({
                              id: user._id,
                              role: event.target.value,
                            })
                          }
                          className="select select-bordered select-sm rounded-full bg-white"
                        >
                          <option value="Worker">Worker</option>
                          <option value="Buyer">Buyer</option>
                          <option value="Admin">Admin</option>
                        </select>
                        <button
                          type="button"
                          onClick={() => deleteMutation.mutate(user._id)}
                          className="btn btn-sm rounded-full btn-error text-white"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            title="No users found"
            description="Try another search term or clear the selected role filter."
          />
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
