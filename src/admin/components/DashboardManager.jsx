import React, { useEffect, useState } from "react";
import {
  Activity,
  ArrowRight,
  ExternalLink,
  Eye,
  Mail,
  MousePointerClick,
  Users,
} from "lucide-react";
import { apiRequest } from "@/lib/api";
import { RESOURCE_CONFIG, titleCase } from "@/admin/config/resources";
import { PageHeader, PanelMessage } from "@/admin/components/AdminUi";

export default function DashboardManager({ availableResources, onNavigate }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    apiRequest("/api/admin/dashboard").then(setData);
  }, []);

  if (!data) return <PanelMessage text="Loading dashboard…" />;

  const stats = [
    { label: "Page Views", value: data.summary.page_views, icon: Eye },
    { label: "Clicks", value: data.summary.clicks, icon: MousePointerClick },
    { label: "Section Views", value: data.summary.section_views, icon: Activity },
    { label: "Unique Visitors", value: data.summary.unique_visitors, icon: Users },
    {
      label: "Messages",
      value: data.summary.messages,
      icon: Mail,
      resource: "messages",
    },
  ];
  const maxDaily = Math.max(...data.daily_activity.map((item) => item.count), 1);
  const quickResources = availableResources.filter(
    (resource) => RESOURCE_CONFIG[resource] || ["messages", "settings"].includes(resource),
  );

  return (
    <>
      <PageHeader
        title="Dashboard"
        subtitle="Public engagement and management activity from the last 30 days."
        action={
          <div className="flex flex-wrap gap-3">
            <a
              href="/"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 transition hover:border-cyan/30 hover:text-cyan"
            >
              View Website
            </a>
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-navy px-5 py-3 text-sm font-semibold text-white transition hover:bg-navy/90"
            >
              Open in New Tab <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        }
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {stats.map((stat) => (
          <button
            key={stat.label}
            type="button"
            disabled={
              !stat.resource || !availableResources.includes(stat.resource)
            }
            onClick={() => stat.resource && onNavigate(stat.resource)}
            className={`rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition ${
              stat.resource && availableResources.includes(stat.resource)
                ? "cursor-pointer hover:-translate-y-1 hover:border-cyan/40 hover:shadow-md"
                : "cursor-default"
            }`}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan/10 text-cyan">
              <stat.icon className="h-5 w-5" />
            </div>
            <p className="mt-5 text-3xl font-extrabold text-navy">
              {stat.value.toLocaleString()}
            </p>
            <p className="mt-1 text-sm text-slate-500">{stat.label}</p>
            {stat.resource && availableResources.includes(stat.resource) && (
              <p className="mt-3 text-xs font-semibold text-cyan">Open messages →</p>
            )}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2">
          <h2 className="font-bold text-navy">Daily Engagement</h2>
          <p className="mt-1 text-sm text-slate-500">All tracked public interactions.</p>
          {data.daily_activity.length === 0 ? (
            <p className="mt-10 text-center text-sm text-slate-400">
              Analytics will appear as visitors use the public site.
            </p>
          ) : (
            <div className="mt-8 flex h-48 items-end gap-2">
              {data.daily_activity.map((item) => (
                <div
                  key={item.date}
                  className="group relative flex min-w-0 flex-1 flex-col items-center justify-end"
                >
                  <div
                    className="w-full min-w-2 rounded-t-md bg-cyan/70 transition hover:bg-cyan"
                    style={{ height: `${Math.max((item.count / maxDaily) * 100, 5)}%` }}
                  />
                  <span className="absolute -top-7 hidden rounded bg-navy px-2 py-1 text-xs text-white group-hover:block">
                    {item.count}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-bold text-navy">Quick Management</h2>
          <div className="mt-4 space-y-2">
            {quickResources.slice(0, 7).map((resource) => (
              <button
                key={resource}
                onClick={() => onNavigate(resource)}
                className="flex w-full items-center justify-between rounded-xl border border-slate-100 px-4 py-3 text-left text-sm font-medium hover:border-cyan/30 hover:bg-cyan/5"
              >
                {RESOURCE_CONFIG[resource]?.label ||
                  (resource === "messages" ? "Contact Messages" : "Site Settings")}
                <ArrowRight className="h-4 w-4 text-slate-400" />
              </button>
            ))}
          </div>
        </section>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <RankingPanel title="Most Clicked" items={data.top_clicks} labelKey="label" />
        <RankingPanel
          title="Most Viewed Sections"
          items={data.top_sections}
          labelKey="resource"
        />
      </div>

      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-bold text-navy">Recent Admin Activity</h2>
        <div className="mt-4 divide-y divide-slate-100">
          {data.recent_logs.length === 0 ? (
            <p className="py-5 text-sm text-slate-400">No admin activity yet.</p>
          ) : (
            data.recent_logs.map((log) => (
              <div key={log.uuid} className="flex items-center gap-4 py-3">
                <div className="h-2 w-2 rounded-full bg-cyan" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{log.description}</p>
                  <p className="text-xs text-slate-400">
                    {log.username} · {formatDate(log.created_at)}
                  </p>
                </div>
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-500">
                  {titleCase(log.action)}
                </span>
              </div>
            ))
          )}
        </div>
      </section>
    </>
  );
}

function RankingPanel({ title, items, labelKey }) {
  const max = Math.max(...items.map((item) => item.count), 1);
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="font-bold text-navy">{title}</h2>
      <div className="mt-5 space-y-4">
        {items.length === 0 ? (
          <p className="text-sm text-slate-400">No activity recorded yet.</p>
        ) : (
          items.map((item) => (
            <div key={item[labelKey]}>
              <div className="mb-1.5 flex justify-between text-sm">
                <span className="font-medium">{titleCase(item[labelKey])}</span>
                <span className="text-slate-400">{item.count}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-cyan"
                  style={{ width: `${(item.count / max) * 100}%` }}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

function formatDate(value) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}
