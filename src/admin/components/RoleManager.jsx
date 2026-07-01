import React, { useEffect, useState } from "react";
import { Pencil, Plus } from "lucide-react";
import { apiRequest } from "@/lib/api";
import { RESOURCE_ORDER, titleCase } from "@/admin/config/resources";
import { inputClass, primaryButton } from "@/admin/styles";
import {
  Alert,
  FieldLabel,
  Modal,
  ModalActions,
  PageHeader,
} from "@/admin/components/AdminUi";

export default function RoleManager() {
  const [roles, setRoles] = useState([]);
  const [editing, setEditing] = useState(null);
  const [notice, setNotice] = useState(null);

  const load = () =>
    apiRequest("/api/admin/roles")
      .then(setRoles)
      .catch((error) => setNotice({ tone: "error", text: error.message }));

  useEffect(() => {
    load();
  }, []);

  const save = async (role) => {
    await apiRequest(role.id ? `/api/admin/roles/${role.id}` : "/api/admin/roles", {
      method: role.id ? "PUT" : "POST",
      body: JSON.stringify(role),
    });
    setEditing(null);
    setNotice({ tone: "success", text: "Role saved." });
    await load();
  };

  return (
    <>
      <PageHeader
        title="Roles & Access"
        subtitle="Choose exactly which management areas each role can access."
        action={
          <button
            className={primaryButton}
            onClick={() =>
              setEditing({
                name: "",
                description: "",
                allowed_resources: [],
                can_manage_users: false,
                can_manage_roles: false,
              })
            }
          >
            <Plus className="h-4 w-4" /> Add Role
          </button>
        }
      />
      {notice && <Alert tone={notice.tone}>{notice.text}</Alert>}
      <div className="grid gap-4 md:grid-cols-2">
        {roles.map((role) => (
          <button
            key={role.id}
            onClick={() => setEditing(role)}
            className="rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm hover:border-cyan/40"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-bold">{titleCase(role.name)}</h3>
              <Pencil className="h-4 w-4 text-slate-400" />
            </div>
            <p className="mt-2 text-sm text-slate-500">{role.description}</p>
            <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-cyan">
              {role.is_super_admin
                ? "All resources"
                : `${role.allowed_resources.length} resources`}
            </p>
          </button>
        ))}
      </div>
      {editing && (
        <RoleEditor role={editing} onClose={() => setEditing(null)} onSave={save} />
      )}
    </>
  );
}

function RoleEditor({ role, onClose, onSave }) {
  const [form, setForm] = useState({ ...role });
  const [saving, setSaving] = useState(false);

  const toggleResource = (resource) => {
    const current = form.allowed_resources || [];
    setForm({
      ...form,
      allowed_resources: current.includes(resource)
        ? current.filter((item) => item !== resource)
        : [...current, resource],
    });
  };

  const save = async () => {
    setSaving(true);
    try {
      await onSave(form);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal title={`${role.id ? "Edit" : "Add"} Role`} onClose={onClose}>
      <div className="space-y-5">
        <FieldLabel label="Role Name">
          <input
            className={inputClass}
            value={form.name}
            disabled={Boolean(role.id)}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
          />
        </FieldLabel>
        <FieldLabel label="Description">
          <textarea
            className={inputClass}
            rows={3}
            value={form.description}
            onChange={(event) => setForm({ ...form, description: event.target.value })}
          />
        </FieldLabel>
        {!form.is_super_admin && (
          <FieldLabel label="Allowed Resources">
            <div className="grid gap-2 sm:grid-cols-2">
              {RESOURCE_ORDER.map((resource) => (
                <Checkbox
                  key={resource}
                  label={titleCase(resource)}
                  checked={(form.allowed_resources || []).includes(resource)}
                  onChange={() => toggleResource(resource)}
                />
              ))}
            </div>
          </FieldLabel>
        )}
        <div className="grid gap-2 sm:grid-cols-2">
          <Checkbox
            label="Manage Admin Users"
            checked={Boolean(form.can_manage_users)}
            onChange={(checked) => setForm({ ...form, can_manage_users: checked })}
          />
          <Checkbox
            label="Manage Roles"
            checked={Boolean(form.can_manage_roles)}
            onChange={(checked) => setForm({ ...form, can_manage_roles: checked })}
          />
        </div>
        <ModalActions onClose={onClose} saving={saving} onSave={save} />
      </div>
    </Modal>
  );
}

function Checkbox({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 text-sm">
      <input
        type="checkbox"
        className="accent-cyan"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      {label}
    </label>
  );
}

