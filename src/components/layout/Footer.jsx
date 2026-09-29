import { FaFacebook, FaGithub, FaLinkedin, FaXTwitter } from "react-icons/fa6";
import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="border-t border-slate-200 bg-white">
    <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-3 lg:px-8">
      <div>
        <p className="text-2xl font-black text-slate-900">Taskora</p>
        <p className="mt-4 max-w-md text-sm leading-6 text-slate-600">
          Taskora helps buyers publish useful micro tasks, workers earn fairly,
          and administrators keep the system trusted.
        </p>
      </div>
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.24em] text-slate-500">
          Quick links
        </p>
        <div className="mt-4 grid gap-3 text-sm font-medium text-slate-600">
          <Link to="/">Home</Link>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </div>
      </div>
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.24em] text-slate-500">
          Connect
        </p>
        <div className="mt-4 flex gap-4 text-2xl text-slate-600">
          <a href="https://www.linkedin.com" target="_blank" rel="noreferrer">
            <FaLinkedin />
          </a>
          <a href="https://www.facebook.com" target="_blank" rel="noreferrer">
            <FaFacebook />
          </a>
          <a href="https://github.com" target="_blank" rel="noreferrer">
            <FaGithub />
          </a>
          <a href="https://x.com" target="_blank" rel="noreferrer">
            <FaXTwitter />
          </a>
        </div>
      </div>
    </div>
    <div className="border-t border-slate-200 py-4 text-center text-sm text-slate-500">
      © {new Date().getFullYear()} Taskora. Built for a modern micro-task
      marketplace.
    </div>
  </footer>
);

export default Footer;
