const PageHeader = ({ eyebrow, title, description, action }) => (
  <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
    <div>
      {eyebrow ? (
        <p className="text-sm font-bold uppercase tracking-[0.28em] text-primary">
          {eyebrow}
        </p>
      ) : null}
      <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
        {title}
      </h1>
      {description ? (
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
          {description}
        </p>
      ) : null}
    </div>
    {action ? <div>{action}</div> : null}
  </div>
);

export default PageHeader;
