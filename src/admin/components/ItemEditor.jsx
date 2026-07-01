import React, { useState } from "react";
import { Upload } from "lucide-react";
import { resolveAssetUrl, uploadAdminImage } from "@/lib/api";
import { inputClass, secondaryButton } from "@/admin/styles";
import {
  Alert,
  FieldLabel,
  Modal,
  ModalActions,
} from "@/admin/components/AdminUi";
import { titleCase } from "@/admin/config/resources";

export default function ItemEditor({ item, config, resource, onClose, onSave }) {
  const [form, setForm] = useState({
    ...item,
    tags: Array.isArray(item.tags) ? item.tags.join(", ") : item.tags || "",
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      await onSave(form);
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setSaving(false);
    }
  };

  const upload = async (field, file) => {
    if (!file) return;
    setUploading(field);
    setError("");
    try {
      const result = await uploadAdminImage(file, resource);
      setForm((current) => ({ ...current, [field]: result.url }));
    } catch (uploadError) {
      setError(uploadError.message);
    } finally {
      setUploading("");
    }
  };

  return (
    <Modal title={`${item.uuid ? "Edit" : "Add"} ${config.singular}`} onClose={onClose}>
      <form onSubmit={submit} className="space-y-5">
        {error && <Alert tone="error">{error}</Alert>}
        <div className="grid gap-5 sm:grid-cols-2">
          {config.fields.map((field) => (
            <div
              key={field.name}
              className={
                field.type === "textarea" || field.type === "image" ? "sm:col-span-2" : ""
              }
            >
              <FieldLabel label={field.label} hint={field.hint}>
                <EditorField
                  field={field}
                  value={form[field.name]}
                  uploading={uploading}
                  onChange={(value) => setForm({ ...form, [field.name]: value })}
                  onUpload={(file) => upload(field.name, file)}
                />
              </FieldLabel>
            </div>
          ))}
        </div>
        <ModalActions onClose={onClose} saving={saving} />
      </form>
    </Modal>
  );
}

function EditorField({ field, value, uploading, onChange, onUpload }) {
  if (field.type === "textarea") {
    return (
      <textarea
        rows={field.name === "description" ? 5 : 3}
        value={value || ""}
        onChange={(event) => onChange(event.target.value)}
        className={inputClass}
        required={field.required}
      />
    );
  }

  if (field.type === "select") {
    return (
      <select
        value={value || field.options[0]}
        onChange={(event) => onChange(event.target.value)}
        className={inputClass}
      >
        {field.options.map((option) => (
          <option key={option} value={option}>
            {titleCase(option)}
          </option>
        ))}
      </select>
    );
  }

  if (field.type === "checkbox") {
    return (
      <label className="flex h-11 items-center gap-3 rounded-xl border border-slate-200 px-4">
        <input
          type="checkbox"
          checked={Boolean(value)}
          onChange={(event) => onChange(event.target.checked)}
          className="h-4 w-4 accent-cyan"
        />
        Show this item prominently
      </label>
    );
  }

  if (field.type === "image") {
    return (
      <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
        <input
          value={value || ""}
          onChange={(event) => onChange(event.target.value)}
          className={inputClass}
          placeholder="/images/... or upload a file"
          required={field.required}
        />
        <label className={`${secondaryButton} cursor-pointer justify-center`}>
          <Upload className="h-4 w-4" />
          {uploading === field.name ? "Uploading…" : "Upload"}
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
            className="hidden"
            onChange={(event) => onUpload(event.target.files?.[0])}
            disabled={Boolean(uploading)}
          />
        </label>
        {value && (
          <div className="flex h-32 items-center justify-center rounded-xl bg-slate-100 p-3 sm:col-span-2">
            <img
              src={resolveAssetUrl(value)}
              alt="Preview"
              className="max-h-full max-w-full object-contain"
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <input
      type={field.type === "number" ? "number" : "text"}
      value={value ?? ""}
      onChange={(event) =>
        onChange(field.type === "number" ? Number(event.target.value) : event.target.value)
      }
      className={inputClass}
      required={field.required}
    />
  );
}

