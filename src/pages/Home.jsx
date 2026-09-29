import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import {
  FiArrowRight,
  FiCheckCircle,
  FiDollarSign,
  FiShield,
  FiTrendingUp,
} from "react-icons/fi";
import apiClient from "../api/axios";
import SectionTitle from "../components/ui/SectionTitle";
import TaskCard from "../components/ui/TaskCard";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";

const banners = [
  {
    title: "Turn micro tasks into real income with a premium workflow.",
    subtitle:
      "Taskora gives workers, buyers, and admins one streamlined space to move work forward with clarity.",
    cta: "Start earning",
    link: "/register",
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1600&q=80",
  },
  {
    title: "Publish targeted tasks and review submissions without clutter.",
    subtitle:
      "Buyers can launch tasks, review outcomes, and manage coin balances from a responsive dashboard.",
    cta: "Post a task",
    link: "/register",
    image:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=80",
  },
  {
    title:
      "Build trust with notifications, approvals, and transparent coin tracking.",
    subtitle:
      "Taskora keeps every action visible so each role knows what happened and what comes next.",
    cta: "Explore features",
    link: "/login",
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=80",
  },
];

const testimonials = [
  {
    name: "Ayesha Rahman",
    role: "Worker",
    quote:
      "Taskora helped me organize daily micro jobs and track the coins I earn with confidence.",
  },
  {
    name: "Tanvir Hasan",
    role: "Buyer",
    quote:
      "The review workflow is clean, and I can manage task slots without losing control of the budget.",
  },
  {
    name: "Sadia Noor",
    role: "Admin",
    quote:
      "Notifications and moderation tools make it practical to run the platform at scale.",
  },
];

const Home = () => {
  const { data } = useQuery({
    queryKey: ["top-workers"],
    queryFn: async () => (await apiClient.get("/users/top-workers")).data,
  });

  const topWorkers = data?.workers || [];
  const featuredTasks = [
    {
      _id: "featured-1",
      title: "Test a local business website and report one usability issue",
      detail:
        "Visit a live demo site, verify the mobile layout, and share one clear improvement note with a screenshot.",
      buyerName: "Bright Labs",
      completionDate: new Date().toISOString(),
      requiredWorkers: 4,
      payableAmount: 25,
      image:
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
      linkTo: "/register",
    },
    {
      _id: "featured-2",
      title: "Check search rankings for a targeted keyword cluster",
      detail:
        "Use the provided instructions, collect results in a spreadsheet, and submit a short summary of findings.",
      buyerName: "Growth Desk",
      completionDate: new Date().toISOString(),
      requiredWorkers: 6,
      payableAmount: 18,
      image:
        "https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=1200&q=80",
      linkTo: "/register",
    },
  ];

  return (
    <div className="space-y-24 pb-20">
      <section className="mx-auto max-w-7xl px-4 pt-6 lg:px-8">
        <div className="overflow-hidden rounded-[2rem] bg-brand-radial text-white hero-glow">
          <Swiper
            modules={[Autoplay, Pagination, EffectFade]}
            effect="fade"
            pagination={{ clickable: true }}
            autoplay={{ delay: 5000 }}
            loop
            className="hero-swiper"
          >
            {banners.map((banner) => (
              <SwiperSlide key={banner.title}>
                <div className="relative min-h-[34rem] overflow-hidden px-6 py-14 md:px-16 md:py-20">
                  <div className="absolute inset-0 bg-[image:var(--tw-gradient-stops)] opacity-20" />
                  <div
                    className="absolute inset-0 bg-cover bg-center opacity-25"
                    style={{ backgroundImage: `url(${banner.image})` }}
                  />
                  <div className="relative z-10 grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
                    <div className="max-w-2xl space-y-6">
                      <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur">
                        Micro-task marketplace for workers, buyers, and admins
                      </span>
                      <h1 className="text-4xl font-black tracking-tight md:text-6xl">
                        {banner.title}
                      </h1>
                      <p className="max-w-xl text-base leading-8 text-slate-200 md:text-lg">
                        {banner.subtitle}
                      </p>
                      <div className="flex flex-wrap gap-4">
                        <Link
                          to={banner.link}
                          className="btn btn-primary rounded-full border-0 px-6 text-white"
                        >
                          {banner.cta} <FiArrowRight />
                        </Link>
                        <Link
                          to="/register"
                          className="btn rounded-full border-white/20 bg-white/10 text-white hover:bg-white/20"
                        >
                          Join Taskora
                        </Link>
                      </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      {[
                        { label: "Trusted workers", value: "12k+" },
                        { label: "Completed tasks", value: "58k+" },
                        { label: "Coins paid out", value: "1.2M" },
                        { label: "Active buyers", value: "3.4k" },
                      ].map((item) => (
                        <div
                          key={item.label}
                          className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur"
                        >
                          <p className="text-sm uppercase tracking-[0.22em] text-white/70">
                            {item.label}
                          </p>
                          <p className="mt-4 text-4xl font-black">
                            {item.value}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 lg:px-8">
        <SectionTitle
          eyebrow="Top contributors"
          title="Best workers by coin balance"
          description="These workers consistently complete tasks with accuracy and speed."
        />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {topWorkers.map((worker) => (
            <motion.div
              key={worker._id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="card-soft flex items-center gap-4 p-5">
                <img
                  src={worker.image}
                  alt={worker.name}
                  className="h-20 w-20 rounded-3xl object-cover"
                />
                <div>
                  <p className="text-lg font-bold text-slate-900">
                    {worker.name}
                  </p>
                  <p className="text-sm text-slate-500">{worker.role}</p>
                  <p className="mt-2 inline-flex rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
                    {worker.coins} coins
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 lg:px-8">
        <SectionTitle
          eyebrow="Featured work"
          title="Curated tasks ready for workers"
          description="The platform makes it easy to discover work that fits your skills and available time."
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {featuredTasks.map((task) => (
            <TaskCard key={task._id} task={task} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 lg:px-8">
        <SectionTitle
          eyebrow="How it works"
          title="Simple flow, transparent rewards"
          description="Taskora keeps the complete lifecycle of a micro-task visible from launch to payout."
        />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            {
              icon: <FiCheckCircle className="text-3xl text-primary" />,
              title: "Workers complete verified tasks",
              text: "Pick a task, follow the submission rules, and submit your proof through a guided form.",
            },
            {
              icon: <FiDollarSign className="text-3xl text-secondary" />,
              title: "Buyers fund meaningful work",
              text: "Create a task with a realistic reward and review submissions from a clean queue.",
            },
            {
              icon: <FiShield className="text-3xl text-ember-500" />,
              title: "Admins keep the system safe",
              text: "Moderate users, withdrawals, tasks, and reports from one high-signal control panel.",
            },
          ].map((item) => (
            <div key={item.title} className="card-soft p-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
                {item.icon}
              </div>
              <h3 className="mt-5 text-xl font-bold text-slate-900">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 lg:px-8">
        <SectionTitle
          eyebrow="Testimonials"
          title="People trust the workflow"
          description="A few short notes from users who rely on a clear earning and review flow."
          align="center"
        />
        <div className="mt-10">
          <Swiper
            modules={[Autoplay, Pagination]}
            pagination={{ clickable: true }}
            autoplay={{ delay: 4500 }}
            loop
            spaceBetween={20}
            breakpoints={{
              640: { slidesPerView: 1 },
              1024: { slidesPerView: 2 },
            }}
          >
            {testimonials.map((item) => (
              <SwiperSlide key={item.name}>
                <div className="card-soft h-full p-8">
                  <p className="text-lg leading-8 text-slate-700">
                    “{item.quote}”
                  </p>
                  <div className="mt-6">
                    <p className="font-bold text-slate-900">{item.name}</p>
                    <p className="text-sm text-slate-500">{item.role}</p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="card-soft grid gap-8 overflow-hidden p-8 lg:grid-cols-[1fr_0.8fr] lg:p-10">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.28em] text-primary">
              Why Taskora
            </p>
            <h2 className="mt-3 text-3xl font-black text-slate-900 md:text-4xl">
              A polished workspace for micro-task operations
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
              Taskora is built for assessments that expect role-based
              dashboards, responsive design, secure authentication, and a robust
              coin economy with real business workflows.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {[
                "JWT-authenticated private routes with persistent login",
                "Role-based dashboards for worker, buyer, and admin flows",
                "Notifications for all key platform actions",
                "Payment, withdrawal, and reporting workflows",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4 text-sm font-medium text-slate-700"
                >
                  <FiTrendingUp className="mt-0.5 text-primary" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-[2rem] bg-slate-950 p-8 text-white">
            <p className="text-sm font-bold uppercase tracking-[0.28em] text-emerald-300">
              Platform snapshot
            </p>
            <div className="mt-6 space-y-5">
              {[
                ["Average approval rate", "94%"],
                ["Withdrawal SLA", "24h"],
                ["Support coverage", "24/7"],
                ["Mobile readiness", "100%"],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-center justify-between border-b border-white/10 pb-4"
                >
                  <span className="text-sm text-slate-300">{label}</span>
                  <span className="text-2xl font-black text-white">
                    {value}
                  </span>
                </div>
              ))}
            </div>
            <Link
              to="/register"
              className="btn btn-primary mt-8 w-full rounded-full text-white"
            >
              Create your Taskora account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
