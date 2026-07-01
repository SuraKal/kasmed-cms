import React, { useEffect, useState } from "react";
import { ChevronRight, Mail, Search } from "lucide-react";
import { apiRequest } from "@/lib/api";
import { inputClass, secondaryButton } from "@/admin/styles";
import { titleCase } from "@/admin/config/resources";
import {
  Alert,
  FieldLabel,
  Modal,
  ModalActions,
  PageHeader,
  Pagination,
  PanelMessage,
  StatusBadge,
} from "@/admin/components/AdminUi";

export default function MessageManager() {
  const [messages, setMessages] = useState([]);
  const [selected, setSelected] = useState(null);
  const [notice, setNotice] = useState(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [filters, setFilters] = useState({ search: "", status: "" });

  const load = async () => {
    try {
      const params = new URLSearchParams({
        page: String(page),
        per_page: "10",
      });
      if (filters.search) params.set("search", filters.search);
      if (filters.status) params.set("status", filters.status);
      const result = await apiRequest(`/api/admin/messages?${params}`);
      setMessages(result.items);
      setPagination(result.pagination);
    } catch (error) {
      setNotice({ tone: "error", text: error.message });
    }
  };

  useEffect(() => {
    load();
  }, [page, filters.search, filters.status]);

  const save = async (message) => {
    await apiRequest(`/api/admin/messages/${message.uuid}`, {
      method: "PUT",
      body: JSON.stringify(message),
    });
    setSelected(null);
    setNotice({ tone: "success", text: "Message workflow updated." });
    await load();
  };

  return (
    <>
      <PageHeader
        title="Contact Messages"
        subtitle="Review enquiries, prepare replies, and keep private follow-up notes."
      />
      {notice && <Alert tone={notice.tone}>{notice.text}</Alert>}
      <form
        onSubmit={(event) => {
          event.preventDefault();
          setPage(1);
          setFilters((current) => ({ ...current, search: searchInput.trim() }));
        }}
        className="mb-5 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
          <input
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            className={`${inputClass} pl-10`}
            placeholder="Search sender, email, or subject…"
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
          {["new", "read", "replied", "archived"].map((status) => (
            <option key={status} value={status}>
              {titleCase(status)}
            </option>
          ))}
        </select>
        <button className={secondaryButton}>
          <Search className="h-4 w-4" /> Search
        </button>
      </form>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {messages.length === 0 ? (
          <PanelMessage text="No contact messages match these filters." />
        ) : (
          messages.map((message) => (
            <button
              key={message.uuid}
              onClick={() => setSelected(message)}
              className="flex w-full items-center gap-4 border-b border-slate-100 p-5 text-left last:border-0 hover:bg-slate-50"
            >
              <div className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-full bg-cyan/10 text-cyan sm:flex">
                <Mail className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <strong>{message.subject}</strong>
                  <StatusBadge status={message.status} />
                </div>
                <p className="mt-1 truncate text-sm text-slate-500">
                  {message.name} · {message.email} · {message.message}
                </p>
              </div>
              <ChevronRight className="h-5 w-5 text-slate-300" />
            </button>
          ))
        )}
      </div>
      <Pagination pagination={pagination} onPageChange={setPage} />
      {selected && (
        <MessageEditor
          message={selected}
          onClose={() => setSelected(null)}
          onSave={save}
        />
      )}
    </>
  );
}

function MessageEditor({ message, onClose, onSave }) {
  const [form, setForm] = useState(message);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      await onSave(form);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal title={message.subject} onClose={onClose}>
      <div className="mb-6 rounded-2xl bg-slate-50 p-5">
        <p className="font-semibold">{message.name}</p>
        <p className="text-sm text-slate-500">
          {message.email} {message.phone ? `· ${message.phone}` : ""}
        </p>
        <p className="mt-4 whitespace-pre-wrap text-sm leading-6">{message.message}</p>
      </div>
      <div className="space-y-5">
        <FieldLabel label="Status">
          <select
            className={inputClass}
            value={form.status}
            onChange={(event) => setForm({ ...form, status: event.target.value })}
          >
            {["new", "read", "replied", "archived"].map((status) => (
              <option key={status} value={status}>
                {titleCase(status)}
              </option>
            ))}
          </select>
        </FieldLabel>
        <FieldLabel label="Reply">
          <textarea
            rows={5}
            className={inputClass}
            value={form.admin_reply || ""}
            onChange={(event) => setForm({ ...form, admin_reply: event.target.value })}
            placeholder="Prepare or record the response sent to this contact."
          />
        </FieldLabel>
        <FieldLabel label="Internal Notes">
          <textarea
            rows={3}
            className={inputClass}
            value={form.admin_notes || ""}
            onChange={(event) => setForm({ ...form, admin_notes: event.target.value })}
          />
        </FieldLabel>
        <ModalActions onClose={onClose} saving={saving} onSave={save} />
      </div>
    </Modal>
  );
}
