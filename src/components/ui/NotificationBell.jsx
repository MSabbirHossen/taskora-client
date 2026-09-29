import { useEffect, useRef, useState } from "react";
import { FiBell } from "react-icons/fi";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import apiClient from "../../api/axios";

const NotificationBell = () => {
  const [open, setOpen] = useState(false);
  const panelRef = useRef(null);
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => (await apiClient.get("/notifications/me")).data,
    refetchInterval: 45000,
  });

  const markAllMutation = useMutation({
    mutationFn: () => apiClient.patch("/notifications/read-all"),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });

  const unreadCount = data?.unreadCount || 0;
  const notifications = data?.notifications || [];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={panelRef}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="relative btn btn-ghost btn-circle"
      >
        <FiBell className="text-xl" />
        {unreadCount > 0 ? (
          <span className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full bg-error" />
        ) : null}
      </button>
      {open ? (
        <div className="absolute right-0 z-30 mt-3 w-96 max-w-[calc(100vw-1.5rem)] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-soft">
          <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
            <div>
              <p className="text-sm font-bold text-slate-900">Notifications</p>
              <p className="text-xs text-slate-500">
                Newest items appear first
              </p>
            </div>
            <button
              type="button"
              onClick={() => markAllMutation.mutate()}
              className="text-xs font-semibold text-primary hover:text-emerald-700"
            >
              Mark all read
            </button>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <button
                  key={notification._id}
                  type="button"
                  onClick={async () => {
                    await apiClient.patch(
                      `/notifications/${notification._id}/read`,
                    );
                    queryClient.invalidateQueries({
                      queryKey: ["notifications"],
                    });
                    if (notification.link) {
                      window.location.href = notification.link;
                    }
                  }}
                  className={`block w-full border-b border-slate-100 px-4 py-4 text-left transition hover:bg-slate-50 ${notification.read ? "bg-white" : "bg-emerald-50/50"}`}
                >
                  <p className="text-sm font-semibold text-slate-900">
                    {notification.title}
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    {notification.message}
                  </p>
                  <p className="mt-2 text-xs text-slate-400">
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                </button>
              ))
            ) : (
              <div className="px-4 py-10 text-center text-sm text-slate-500">
                You are all caught up.
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default NotificationBell;
