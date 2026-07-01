import React, { useEffect, useState } from "react";
import { ImagePlus, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { apiRequest, resolveAssetUrl } from "@/lib/api";
import { createEmptyItem, titleCase } from "@/admin/config/resources";
import { dangerButton, inputClass, primaryButton, secondaryButton } from "@/admin/styles";
import {
  Alert,
  ConfirmDialog,
  PageHeader,
  Pagination,
  PanelMessage,
  StatusBadge,
} from "@/admin/components/AdminUi";
import ItemEditor from "@/admin/components/ItemEditor";

const EMPTY_PAGINATION = {
  page: 1,
  pages: 0,
  total: 0,
  has_next: false,
  has_prev: false,
};

export default function ResourceManager({ resource, config }) {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(EMPTY_PAGINATION);
  const [searchInput, setSearchInput] = useState("");
  const [filters, setFilters] = useState({ search: "", status: "" });

  const load = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        per_page: "8",
      });
      if (filters.search) params.set("search", filters.search);
      if (filters.status) params.set("status", filters.status);
      const result = await apiRequest(`/api/admin/${resource}?${params}`);
      setItems(result.items);
      setPagination(result.pagination);
    } catch (error) {
      setNotice({ tone: "error", text: error.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [resource, page, filters.search, filters.status]);

  useEffect(() => {
    setPage(1);
    setSearchInput("");
    setFilters({ search: "", status: "" });
  }, [resource]);

  const save = async (item) => {
    const isExisting = Boolean(item.uuid);
    const payload = { ...item };
    delete payload.slug;
    delete payload.alt_text;
    if (typeof payload.tags === "string") {
      payload.tags = payload.tags.split(",").map((tag) => tag.trim()).filter(Boolean);
    }
    await apiRequest(
      isExisting ? `/api/admin/${resource}/${item.uuid}` : `/api/admin/${resource}`,
      { method: isExisting ? "PUT" : "POST", body: JSON.stringify(payload) },
    );
    setEditing(null);
    setNotice({ tone: "success", text: `${config.singular} saved.` });
    if (!isExisting && page !== 1) {
      setPage(1);
    } else {
      await load();
    }
  };

  const remove = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await apiRequest(`/api/admin/${resource}/${deleteTarget.uuid}`, {
        method: "DELETE",
      });
      setDeleteTarget(null);
      setNotice({ tone: "success", text: `${config.singular} deleted.` });
      if (items.length === 1 && page > 1) {
        setPage(page - 1);
      } else {
        await load();
      }
    } catch (error) {
      setNotice({ tone: "error", text: error.message });
    } finally {
      setDeleting(false);
    }
  };

  const applySearch = (event) => {
    event.preventDefault();
    setPage(1);
    setFilters((current) => ({ ...current, search: searchInput.trim() }));
  };

  return (
    <>
      <PageHeader
        title={config.label}
        subtitle={`Add, update, order, and publish ${config.label.toLowerCase()}.`}
        action={
          <button onClick={() => setEditing(createEmptyItem(config))} className={primaryButton}>
            <Plus className="h-4 w-4" /> Add {config.singular}
          </button>
        }
      />
      {notice && <Alert tone={notice.tone}>{notice.text}</Alert>}
      <form
        onSubmit={applySearch}
        className="mb-5 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
          <input
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            className={`${inputClass} pl-10`}
            placeholder={`Search ${config.label.toLowerCase()}…`}
          />
        </div>
        <select
          value={filters.status}
          onChange={(event) => {
            setPage(1);
            setFilters((current) => ({ ...current, status: event.target.value }));
          }}
          className={`${inputClass} sm:w-44`}
        >
          <option value="">All statuses</option>
          {["active", "inactive", "draft"].map((status) => (
            <option key={status} value={status}>
              {titleCase(status)}
            </option>
          ))}
        </select>
        <button className={secondaryButton}>
          <Search className="h-4 w-4" /> Search
        </button>
      </form>

      {loading ? (
        <PanelMessage text="Loading content…" />
      ) : items.length === 0 ? (
        <PanelMessage text={`No ${config.label.toLowerCase()} match these filters.`} />
      ) : (
        <div className="grid gap-4">
          {items.map((item) => (
            <ResourceCard
              key={item.uuid}
              item={item}
              imageField={config.imageField}
              onEdit={() => setEditing(item)}
              onDelete={() => setDeleteTarget(item)}
            />
          ))}
        </div>
      )}

      <Pagination pagination={pagination} onPageChange={setPage} />

      {editing && (
        <ItemEditor
          item={editing}
          config={config}
          resource={resource}
          onClose={() => setEditing(null)}
          onSave={save}
        />
      )}
      {deleteTarget && (
        <ConfirmDialog
          title={`Delete ${config.singular}?`}
          description={`This permanently removes “${deleteTarget.name || deleteTarget.title}”. This action will be recorded in the audit log.`}
          busy={deleting}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={remove}
        />
      )}
    </>
  );
}

function ResourceCard({ item, imageField, onEdit, onDelete }) {
  return (
    <article className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center">
      {imageField && (
        <div className="flex h-20 w-28 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-100 p-2">
          {item[imageField] ? (
            <img
              src={resolveAssetUrl(item[imageField])}
              alt=""
              className="max-h-full max-w-full object-contain"
            />
          ) : (
            <ImagePlus className="h-6 w-6 text-slate-300" />
          )}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-bold text-navy">{item.name || item.title}</h3>
          <StatusBadge status={item.status} />
          {item.featured && (
            <span className="rounded-full bg-cyan/10 px-2.5 py-1 text-xs text-cyan">
              Featured
            </span>
          )}
        </div>
        <p className="mt-1 line-clamp-2 text-sm text-slate-500">
          {item.short_description || item.description || item.caption || "No description"}
        </p>
        <p className="mt-2 text-xs text-slate-400">Order {item.sort_order ?? 0}</p>
      </div>
      <div className="flex gap-2">
        <button onClick={onEdit} className={secondaryButton}>
          <Pencil className="h-4 w-4" /> Edit
        </button>
        <button onClick={onDelete} className={dangerButton} aria-label="Delete">
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </article>
  );
}
