import { Link } from "react-router-dom";

const NotFound = () => (
  <div className="mx-auto flex min-h-[70vh] max-w-4xl flex-col items-center justify-center px-4 text-center">
    <p className="text-sm font-bold uppercase tracking-[0.28em] text-primary">
      Page not found
    </p>
    <h1 className="mt-4 text-5xl font-black text-slate-900 md:text-7xl">404</h1>
    <p className="mt-4 max-w-xl text-lg leading-8 text-slate-600">
      The page you are looking for does not exist or has moved. Return to the
      dashboard or the public homepage.
    </p>
    <div className="mt-8 flex flex-wrap justify-center gap-4">
      <Link to="/" className="btn btn-primary rounded-full text-white">
        Go home
      </Link>
      <Link to="/dashboard" className="btn btn-outline rounded-full">
        Dashboard
      </Link>
    </div>
  </div>
);

export default NotFound;
