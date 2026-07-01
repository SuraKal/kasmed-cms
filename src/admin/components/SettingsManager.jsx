import React, { useEffect, useState } from "react";
import { Save } from "lucide-react";
import { apiRequest } from "@/lib/api";
import { inputClass, primaryButton } from "@/admin/styles";
import { titleCase } from "@/admin/config/resources";
import {
  Alert,
  FieldLabel,
  PageHeader,
  PanelMessage,
  SettingsPanel,
} from "@/admin/components/AdminUi";

export default function SettingsManager() {
  const [form, setForm] = useState(null);
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    apiRequest("/api/admin/settings")
      .then((settings) =>
        setForm({
          ...settings,
          business_hours: (settings.business_hours || []).join("\n"),
          social_links: settings.social_links || {},
        }),
      )
      .catch((error) => setNotice({ tone: "error", text: error.message }));
  }, []);

  if (!form) return <PanelMessage text="Loading site settings…" />;

  const save = async (event) => {
    event.preventDefault();
    try {
      const result = await apiRequest("/api/admin/settings", {
        method: "PUT",
        body: JSON.stringify({
          ...form,
          business_hours: form.business_hours
            .split("\n")
            .map((line) => line.trim())
            .filter(Boolean),
        }),
      });
      setForm({
        ...result,
        business_hours: (result.business_hours || []).join("\n"),
        social_links: result.social_links || {},
      });
      setNotice({ tone: "success", text: "Site settings saved." });
    } catch (error) {
      setNotice({ tone: "error", text: error.message });
    }
  };

  const setSocial = (network, value) =>
    setForm({ ...form, social_links: { ...form.social_links, [network]: value } });

  return (
    <>
      <PageHeader
        title="Site Settings"
        subtitle="Manage the essential company information shown across the public site."
      />
      {notice && <Alert tone={notice.tone}>{notice.text}</Alert>}
      <form onSubmit={save} className="space-y-6">
        <SettingsPanel title="Company & Address">
          <FieldLabel label="Company Name">
            <input
              className={inputClass}
              value={form.company_name}
              onChange={(event) => setForm({ ...form, company_name: event.target.value })}
            />
          </FieldLabel>
          <FieldLabel label="Address Text">
            <textarea
              rows={5}
              className={inputClass}
              value={form.address_text}
              onChange={(event) => setForm({ ...form, address_text: event.target.value })}
            />
          </FieldLabel>
          <div className="sm:col-span-2">
            <FieldLabel label="Map Embed URL or Iframe">
              <textarea
                rows={3}
                className={inputClass}
                value={form.map_embed_url}
                onChange={(event) => setForm({ ...form, map_embed_url: event.target.value })}
              />
            </FieldLabel>
          </div>
        </SettingsPanel>

        <SettingsPanel title="Contact Information">
          {[
            ["phone_primary", "Primary Phone"],
            ["phone_secondary", "Secondary Phone"],
            ["email_primary", "Primary Email"],
            ["email_secondary", "Secondary Email"],
          ].map(([name, label]) => (
            <FieldLabel key={name} label={label}>
              <input
                className={inputClass}
                value={form[name] || ""}
                onChange={(event) => setForm({ ...form, [name]: event.target.value })}
              />
            </FieldLabel>
          ))}
        </SettingsPanel>

        <SettingsPanel title="Business Hours & Footer">
          <FieldLabel label="Business Hours" hint="One line per schedule">
            <textarea
              rows={4}
              className={inputClass}
              value={form.business_hours}
              onChange={(event) => setForm({ ...form, business_hours: event.target.value })}
            />
          </FieldLabel>
          <FieldLabel label="Footer Description">
            <textarea
              rows={4}
              className={inputClass}
              value={form.footer_description}
              onChange={(event) =>
                setForm({ ...form, footer_description: event.target.value })
              }
            />
          </FieldLabel>
        </SettingsPanel>

        <SettingsPanel title="Social Media">
          {["facebook", "linkedin", "instagram", "x"].map((network) => (
            <FieldLabel key={network} label={titleCase(network)}>
              <input
                className={inputClass}
                value={form.social_links[network] || ""}
                onChange={(event) => setSocial(network, event.target.value)}
                placeholder="https://"
              />
            </FieldLabel>
          ))}
        </SettingsPanel>

        <button className={primaryButton}>
          <Save className="h-4 w-4" /> Save Settings
        </button>
      </form>
    </>
  );
}
