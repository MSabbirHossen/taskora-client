const SectionTitle = ({ eyebrow, title, description, align = "left" }) => (
  <div
    className={`max-w-3xl ${align === "center" ? "mx-auto text-center" : ""}`}
  >
    {eyebrow ? (
      <p className="text-sm font-bold uppercase tracking-[0.32em] text-primary">
        {eyebrow}
      </p>
    ) : null}
    <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
      {title}
    </h2>
    {description ? (
      <p className="mt-4 text-base leading-7 text-slate-600 md:text-lg">
        {description}
      </p>
    ) : null}
  </div>
);

export default SectionTitle;
