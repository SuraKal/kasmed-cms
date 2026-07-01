import React, { useEffect, useState } from "react";
import { ClipboardList, Filter } from "lucide-react";
import { apiRequest } from "@/lib/api";
import { RESOURCE_ORDER, titleCase } from "@/admin/config/resources";
import { inputClass, secondaryButton } from "@/admin/styles";
import {
  Alert,
  PageHeader,
  Pagination,
  PanelMessage,
} from "@/admin/components/AdminUi";

const ACTIONS = ["login", "logout", "create", "update", "delete", "upload"];
const EXTRA_RESOURCES = ["authentication", "roles", "users"];

export default function LogManager() {
  const [logs, setLogs] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [notice, setNotice] = useState(null);
  const [filters, setFilters] = useState({
    resource: "",
    action: "",
    date_from: "",
    date_to: "",
  });

  const load = async () => {
    try {
      const params = new URLSearchParams({ page: String(page), per_page: "15" });
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.set(key, value);
      });
      const result = await apiRequest(`/api/admin/logs?${params}`);
      setLogs(result.items);
      setPagination(result.pagination);
    } catch (error) {
      setNotice({ tone: "error", text: error.message });
    }
  };

  useEffect(() => {
    load();
  }, [page, filters.resource, filters.action, filters.date_from, filters.date_to]);

  const updateFilter = (field, value) => {
    setPage(1);
    setFilters((current) => ({ ...current, [field]: value }));
  };

  return (
    <>
      <PageHeader
        title="Admin Activity Logs"
        subtitle="Inspect who changed what, when it happened, and which resource was affected."
      />
      {notice && <Alert tone={notice.tone}>{notice.text}</Alert>}
      <div className="mb-5 grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 md:grid-cols-4">
        <select
          className={inputClass}
          value={filters.resource}
          onChange={(event) => updateFilter("resource", event.target.value)}
        >
          <option value="">All resources</option>
          {[...RESOURCE_ORDER.filter((item) => item !== "logs"), ...EXTRA_RESOURCES].map(
            (resource) => (
              <option key={resource} value={resource}>
                {titleCase(resource)}
              </option>
            ),
          )}
        </select>
        <select
          className={inputClass}
          value={filters.action}
          onChange={(event) => updateFilter("action", event.target.value)}
        >
          <option value="">All actions</option>
          {ACTIONS.map((action) => (
            <option key={action} value={action}>
              {titleCase(action)}
            </option>
          ))}
        </select>
        <input
          type="date"
          className={inputClass}
          value={filters.date_from}
          onChange={(event) => updateFilter("date_from", event.target.value)}
        />
        <input
          type="date"
          className={inputClass}
          value={filters.date_to}
          onChange={(event) => updateFilter("date_to", event.target.value)}
        />
        <button
          onClick={() =>
            setFilters({ resource: "", action: "", date_from: "", date_to: "" })
          }
          className={`${secondaryButton} md:col-start-4`}
        >
          <Filter className="h-4 w-4" /> Clear Filters
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {logs.length === 0 ? (
          <PanelMessage text="No audit records match these filters." />
        ) : (
          logs.map((log) => (
            <article
              key={log.uuid}
              className="flex gap-4 border-b border-slate-100 p-5 last:border-0"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
                <ClipboardList className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold">{log.description}</p>
                  <span className="rounded-full bg-cyan/10 px-2.5 py-1 text-xs font-semibold text-cyan">
                    {titleCase(log.action)}
                  </span>
                </div>
                <p className="mt-1 text-sm text-slate-500">
                  {log.username} · {titleCase(log.resource)} · {formatDate(log.created_at)}
                </p>
                {log.ip_address && (
                  <p className="mt-1 text-xs text-slate-400">IP: {log.ip_address}</p>
                )}
              </div>
            </article>
          ))
        )}
      </div>
      <Pagination pagination={pagination} onPageChange={setPage} />
    </>
  );
}

function formatDate(value) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}
