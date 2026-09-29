import StatCard from "./StatCard";

const DashboardStatGrid = ({ items }) => (
  <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
    {items.map((item) => (
      <StatCard key={item.title} {...item} />
    ))}
  </div>
);

export default DashboardStatGrid;
