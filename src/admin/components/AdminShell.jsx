import React, { useState } from "react";
import { ExternalLink, LogOut, Menu, X } from "lucide-react";

export default function AdminShell({
  user,
  tabs,
  activeTab,
  onTabChange,
  onLogout,
  children,
}) {
  const [mobileMenu, setMobileMenu] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100 text-navy">
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 lg:hidden">
        <img src="/images/logo/logo_dark.png" alt="KASMED" className="h-9 w-auto" />
        <button
          onClick={() => setMobileMenu(!mobileMenu)}
          className="rounded-xl border border-slate-200 p-2"
          aria-label="Toggle navigation"
        >
          {mobileMenu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </header>

      <aside
        className={`fixed inset-y-0 left-0 z-30 w-72 border-r border-white/10 bg-navy text-white transition-transform lg:translate-x-0 ${
          mobileMenu ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-20 items-center border-b border-white/10 px-6">
          <img src="/images/logo/logo_light.png" alt="KASMED" className="h-11 w-auto" />
        </div>
        <div className="flex h-[calc(100vh-5rem)] flex-col">
          <nav className="flex-1 space-y-1 overflow-y-auto p-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  onTabChange(tab.id);
                  setMobileMenu(false);
                }}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition ${
                  activeTab === tab.id
                    ? "bg-cyan text-white"
                    : "text-white/65 hover:bg-white/10 hover:text-white"
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </nav>
          <div className="border-t border-white/10 p-4">
            <div className="mb-3 px-3">
              <p className="text-sm font-semibold">{user.full_name || user.username}</p>
              <p className="text-xs capitalize text-white/45">
                {user.role?.name?.replaceAll("_", " ")}
              </p>
            </div>
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="mb-1 flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-white/65 hover:bg-white/10 hover:text-white"
            >
              <ExternalLink className="h-4 w-4" />
              View public site
            </a>
            <button
              onClick={onLogout}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-white/65 hover:bg-white/10 hover:text-white"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        </div>
      </aside>

      <main className="min-h-screen lg:ml-72">
        <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-10">{children}</div>
      </main>
    </div>
  );
}
