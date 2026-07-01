import React, { useEffect, useState } from "react";
import {
  CircleUserRound,
  ClipboardList,
  Gauge,
  Mail,
  Settings,
  ShieldCheck,
} from "lucide-react";
import { apiRequest } from "@/lib/api";
import {
  RESOURCE_CONFIG,
  RESOURCE_ORDER,
} from "@/admin/config/resources";
import { FullPageMessage } from "@/admin/components/AdminUi";
import AdminShell from "@/admin/components/AdminShell";
import DashboardManager from "@/admin/components/DashboardManager";
import LoginPanel from "@/admin/components/LoginPanel";
import LogManager from "@/admin/components/LogManager";
import MessageManager from "@/admin/components/MessageManager";
import ResourceManager from "@/admin/components/ResourceManager";
import RoleManager from "@/admin/components/RoleManager";
import SettingsManager from "@/admin/components/SettingsManager";
import UserManager from "@/admin/components/UserManager";

export default function Admin() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");

  useEffect(() => {
    const handleAuthenticationRequired = () => setUser(null);
    window.addEventListener(
      "kasmed:authentication-required",
      handleAuthenticationRequired,
    );
    apiRequest("/api/auth/me")
      .then(({ user: authenticatedUser }) => setUser(authenticatedUser))
      .catch(() => setUser(null))
      .finally(() => setChecking(false));
    return () =>
      window.removeEventListener(
        "kasmed:authentication-required",
        handleAuthenticationRequired,
      );
  }, []);

  if (checking) {
    return <FullPageMessage text="Opening KASMED administration…" />;
  }

  if (!user) {
    return <LoginPanel onLogin={setUser} />;
  }

  const tabs = buildTabs(user.role);
  const selectedTab = tabs.some((tab) => tab.id === activeTab)
    ? activeTab
    : tabs[0]?.id;

  const logout = async () => {
    await apiRequest("/api/auth/logout", { method: "POST" });
    setUser(null);
  };

  return (
    <AdminShell
      user={user}
      tabs={tabs}
      activeTab={selectedTab}
      onTabChange={setActiveTab}
      onLogout={logout}
    >
      {selectedTab === "dashboard" && (
        <DashboardManager
          availableResources={
            user.role?.is_super_admin
              ? RESOURCE_ORDER
              : user.role?.allowed_resources || []
          }
          onNavigate={setActiveTab}
        />
      )}
      {RESOURCE_CONFIG[selectedTab] && (
        <ResourceManager resource={selectedTab} config={RESOURCE_CONFIG[selectedTab]} />
      )}
      {selectedTab === "messages" && <MessageManager />}
      {selectedTab === "settings" && <SettingsManager />}
      {selectedTab === "logs" && <LogManager />}
      {selectedTab === "users" && <UserManager />}
      {selectedTab === "roles" && <RoleManager />}
    </AdminShell>
  );
}

function buildTabs(role = {}) {
  const allowed = role.is_super_admin ? RESOURCE_ORDER : role.allowed_resources || [];
  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: Gauge },
    ...RESOURCE_ORDER.filter((resource) => allowed.includes(resource)).map(
      (resource) => ({
        id: resource,
        label:
          resource === "messages"
            ? "Contact Messages"
            : resource === "settings"
              ? "Site Settings"
              : resource === "logs"
                ? "Activity Logs"
                : RESOURCE_CONFIG[resource].label,
        icon:
          resource === "messages"
            ? Mail
            : resource === "settings"
              ? Settings
              : resource === "logs"
                ? ClipboardList
                : RESOURCE_CONFIG[resource].icon,
      }),
    ),
  ];

  if (role.is_super_admin || role.can_manage_users) {
    tabs.push({ id: "users", label: "Admin Users", icon: CircleUserRound });
  }
  if (role.is_super_admin || role.can_manage_roles) {
    tabs.push({ id: "roles", label: "Roles & Access", icon: ShieldCheck });
  }
  return tabs;
}
