import { Link, NavLink } from "react-router-dom";
import { FiMenu, FiMoon, FiSun, FiArrowRight } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import NotificationBell from "../ui/NotificationBell";

const Navbar = () => {
  const { user, clearSession } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const guestLinks = (
    <>
      <NavLink to="/" className="hover:text-primary">
        Home
      </NavLink>
      <NavLink to="/login" className="hover:text-primary">
        Login
      </NavLink>
      <NavLink to="/register" className="hover:text-primary">
        Register
      </NavLink>
    </>
  );

  const authLinks = (
    <>
      <NavLink to="/dashboard" className="hover:text-primary">
        Dashboard
      </NavLink>
      <div className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
        {user?.coins || 0} coins
      </div>
    </>
  );

  return (
    <header className="fixed left-0 top-0 z-40 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-8">
        <Link
          to={user ? "/dashboard" : "/"}
          className="flex items-center gap-3 font-black tracking-tight text-slate-900"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary text-white shadow-soft">
            <FiMenu />
          </div>
          <div>
            <p className="text-lg leading-none">Taskora</p>
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-slate-500">
              Micro task platform
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-semibold text-slate-600 lg:flex">
          {user ? authLinks : guestLinks}
          <a
            href={
              import.meta.env.VITE_CLIENT_GITHUB_URL || "https://github.com/"
            }
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-primary hover:text-emerald-700"
          >
            Join as Developer <FiArrowRight />
          </a>
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            className="btn btn-ghost btn-circle"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <FiSun className="text-lg" />
            ) : (
              <FiMoon className="text-lg" />
            )}
          </button>
          {user ? <NotificationBell /> : null}
          <a
            href={
              import.meta.env.VITE_CLIENT_GITHUB_URL || "https://github.com/"
            }
            target="_blank"
            rel="noreferrer"
            className="btn btn-ghost hidden rounded-full px-4 text-primary sm:inline-flex"
          >
            Join as Developer
          </a>
          {user ? (
            <div className="dropdown dropdown-end">
              <button
                type="button"
                tabIndex={0}
                className="btn btn-ghost flex items-center gap-3 rounded-full border border-slate-200 px-2"
              >
                <img
                  src={user.image}
                  alt={user.name}
                  className="h-9 w-9 rounded-full object-cover"
                />
                <span className="hidden text-sm font-semibold sm:inline">
                  {user.name}
                </span>
              </button>
              <ul
                tabIndex={0}
                className="menu dropdown-content mt-3 w-52 rounded-2xl bg-white p-2 shadow-soft"
              >
                <li>
                  <Link to="/dashboard">Dashboard</Link>
                </li>
                <li>
                  <Link to="/dashboard/profile">Profile</Link>
                </li>
                <li>
                  <a
                    href={
                      import.meta.env.VITE_CLIENT_GITHUB_URL ||
                      "https://github.com/"
                    }
                    target="_blank"
                    rel="noreferrer"
                  >
                    Join as Developer
                  </a>
                </li>
                <li>
                  <button type="button" onClick={clearSession}>
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <div className="flex gap-2">
              <Link to="/login" className="btn btn-ghost rounded-full">
                Login
              </Link>
              <Link
                to="/register"
                className="btn btn-primary rounded-full text-white"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
