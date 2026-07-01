import React from "react";
import { Check, ChevronLeft, ChevronRight, Save, Trash2, X } from "lucide-react";
import { primaryButton, secondaryButton } from "@/admin/styles";
import { titleCase } from "@/admin/config/resources";

export function PageHeader({ title, subtitle, action }) {
  return (
    <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">{title}</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-500">{subtitle}</p>
      </div>
      {action}
    </div>
  );
}

export function SettingsPanel({ title, children }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
      <h2 className="mb-5 text-lg font-bold">{title}</h2>
      <div className="grid gap-5 sm:grid-cols-2">{children}</div>
    </section>
  );
}

export function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/60 p-4 backdrop-blur-sm">
      <div className="max-h-[94vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-6 py-5">
          <h2 className="text-xl font-bold">{title}</h2>
          <button onClick={onClose} className="rounded-full p-2 hover:bg-slate-100">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

export function ConfirmDialog({
  title,
  description,
  confirmLabel = "Delete",
  busy = false,
  onCancel,
  onConfirm,
}) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-navy/60 p-4 backdrop-blur-sm">
      <div
        role="alertdialog"
        aria-modal="true"
        className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl"
      >
        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
          <Trash2 className="h-5 w-5" />
        </div>
        <h2 className="text-xl font-bold text-navy">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
        <div className="mt-7 flex justify-end gap-3">
          <button onClick={onCancel} disabled={busy} className={secondaryButton}>
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={busy}
            className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
          >
            <Trash2 className="h-4 w-4" />
            {busy ? "Deleting…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export function Pagination({ pagination, onPageChange }) {
  if (!pagination || pagination.pages <= 1) return null;
  return (
    <div className="mt-6 flex flex-col items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 sm:flex-row">
      <p className="text-sm text-slate-500">
        Page {pagination.page} of {pagination.pages} · {pagination.total} records
      </p>
      <div className="flex gap-2">
        <button
          onClick={() => onPageChange(pagination.page - 1)}
          disabled={!pagination.has_prev}
          className={secondaryButton}
        >
          <ChevronLeft className="h-4 w-4" /> Previous
        </button>
        <button
          onClick={() => onPageChange(pagination.page + 1)}
          disabled={!pagination.has_next}
          className={secondaryButton}
        >
          Next <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export function ModalActions({ onClose, saving, onSave }) {
  return (
    <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
      <button type="button" onClick={onClose} className={secondaryButton}>
        Cancel
      </button>
      <button type={onSave ? "button" : "submit"} onClick={onSave} className={primaryButton}>
        <Save className="h-4 w-4" />
        {saving ? "Saving…" : "Save"}
      </button>
    </div>
  );
}

export function FieldLabel({ label, hint, children }) {
  return (
    <label className="block">
      <span className="mb-2 flex items-center justify-between text-sm font-semibold text-slate-700">
        {label}
        {hint && <small className="font-normal text-slate-400">{hint}</small>}
      </span>
      {children}
    </label>
  );
}

export function StatusBadge({ status }) {
  const active = status === "active" || status === "replied";
  const isNew = status === "new";
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
        active
          ? "bg-emerald-100 text-emerald-700"
          : isNew
            ? "bg-cyan/10 text-cyan"
            : "bg-slate-100 text-slate-500"
      }`}
    >
      {titleCase(status)}
    </span>
  );
}

export function Alert({ tone, children }) {
  return (
    <div
      className={`mb-5 flex items-center gap-2 rounded-xl border px-4 py-3 text-sm ${
        tone === "error"
          ? "border-red-200 bg-red-50 text-red-700"
          : "border-emerald-200 bg-emerald-50 text-emerald-700"
      }`}
    >
      {tone === "error" ? <X className="h-4 w-4" /> : <Check className="h-4 w-4" />}
      {children}
    </div>
  );
}

export function PanelMessage({ text }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center text-sm text-slate-500">
      {text}
    </div>
  );
}

export function FullPageMessage({ text }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-navy text-sm text-white/70">
      {text}
    </div>
  );
}
