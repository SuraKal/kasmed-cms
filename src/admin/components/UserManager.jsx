import React, { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { apiRequest } from "@/lib/api";
import { titleCase } from "@/admin/config/resources";
import { inputClass, primaryButton } from "@/admin/styles";
import {
  Alert,
  FieldLabel,
  Modal,
  ModalActions,
  PageHeader,
  StatusBadge,
} from "@/admin/components/AdminUi";

export default function UserManager() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [editing, setEditing] = useState(null);
  const [notice, setNotice] = useState(null);

  const load = async () => {
    try {
      const [userData, roleData] = await Promise.all([
        apiRequest("/api/admin/users"),
        apiRequest("/api/admin/roles"),
      ]);
      setUsers(userData);
      setRoles(roleData);
    } catch (error) {
      setNotice({ tone: "error", text: error.message });
    }
  };

  useEffect(() => {
    load();
  }, []);

  const save = async (user) => {
    await apiRequest(user.id ? `/api/admin/users/${user.id}` : "/api/admin/users", {
      method: user.id ? "PUT" : "POST",
      body: JSON.stringify(user),
    });
    setEditing(null);
    setNotice({ tone: "success", text: "Admin user saved." });
    await load();
  };

  return (
    <>
      <PageHeader
        title="Admin Users"
        subtitle="Create staff accounts and assign each account an access role."
        action={
          <button
            className={primaryButton}
            onClick={() =>
              setEditing({
                username: "",
                full_name: "",
                password: "",
                role_id: roles[0]?.id || "",
                is_active: true,
              })
            }
          >
            <Plus className="h-4 w-4" /> Add User
          </button>
        }
      />
      {notice && <Alert tone={notice.tone}>{notice.text}</Alert>}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {users.map((user) => (
          <button
            key={user.id}
            onClick={() => setEditing({ ...user, password: "" })}
            className="flex w-full items-center gap-4 border-b border-slate-100 p-5 text-left last:border-0 hover:bg-slate-50"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-navy text-white">
              {(user.full_name || user.username).slice(0, 1).toUpperCase()}
            </div>
            <div className="flex-1">
              <p className="font-semibold">{user.full_name || user.username}</p>
              <p className="text-sm text-slate-500">
                @{user.username} · {titleCase(user.role?.name || "")}
              </p>
            </div>
            <StatusBadge status={user.is_active ? "active" : "inactive"} />
          </button>
        ))}
      </div>
      {editing && (
        <UserEditor
          user={editing}
          roles={roles}
          onClose={() => setEditing(null)}
          onSave={save}
        />
      )}
    </>
  );
}

function UserEditor({ user, roles, onClose, onSave }) {
  const [form, setForm] = useState(user);
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
    <Modal title={`${user.id ? "Edit" : "Add"} Admin User`} onClose={onClose}>
      <div className="grid gap-5 sm:grid-cols-2">
        <FieldLabel label="Full Name">
          <input
            className={inputClass}
            value={form.full_name}
            onChange={(event) => setForm({ ...form, full_name: event.target.value })}
          />
        </FieldLabel>
        <FieldLabel label="Username">
          <input
            className={inputClass}
            value={form.username}
            onChange={(event) => setForm({ ...form, username: event.target.value })}
          />
        </FieldLabel>
        <FieldLabel label={user.id ? "New Password (optional)" : "Password"}>
          <input
            type="password"
            className={inputClass}
            value={form.password}
            required={!user.id}
            onChange={(event) => setForm({ ...form, password: event.target.value })}
          />
        </FieldLabel>
        <FieldLabel label="Role">
          <select
            className={inputClass}
            value={form.role_id}
            onChange={(event) => setForm({ ...form, role_id: Number(event.target.value) })}
          >
            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                {titleCase(role.name)}
              </option>
            ))}
          </select>
        </FieldLabel>
        <label className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 text-sm">
          <input
            type="checkbox"
            className="accent-cyan"
            checked={Boolean(form.is_active)}
            onChange={(event) => setForm({ ...form, is_active: event.target.checked })}
          />
          Active account
        </label>
      </div>
      <div className="mt-6">
        <ModalActions onClose={onClose} saving={saving} onSave={save} />
      </div>
    </Modal>
  );
}
