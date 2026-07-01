import {
  Building2,
  GalleryHorizontalEnd,
  Handshake,
  Heart,
  LayoutDashboard,
  PackageSearch,
  Users,
} from "lucide-react";

export const STATUS_OPTIONS = ["active", "inactive", "draft"];

function partnerConfig(label, singular, icon, logoRequired) {
  return {
    label,
    singular,
    icon,
    imageField: "logo",
    fields: [
      { name: "name", label: "Name", required: true },
      { name: "logo", label: "Logo", type: "image", required: logoRequired },
      { name: "website", label: "Website" },
      { name: "status", label: "Status", type: "select", options: STATUS_OPTIONS },
      { name: "sort_order", label: "Sort Order", type: "number" },
    ],
  };
}

export const RESOURCE_CONFIG = {
  engagements: {
    label: "Areas of Engagement",
    singular: "Engagement",
    icon: LayoutDashboard,
    imageField: "thumbnail",
    fields: [
      { name: "name", label: "Name", required: true },
      { name: "thumbnail", label: "Thumbnail", type: "image" },
      { name: "description", label: "Description", type: "textarea", required: true },
      { name: "status", label: "Status", type: "select", options: STATUS_OPTIONS },
      { name: "sort_order", label: "Sort Order", type: "number" },
    ],
  },
  solutions: {
    label: "Solutions & Products",
    singular: "Solution",
    icon: PackageSearch,
    imageField: "thumbnail",
    fields: [
      { name: "name", label: "Name", required: true },
      { name: "tags", label: "Tags", hint: "Comma-separated", type: "tags" },
      {
        name: "short_description",
        label: "Small Description",
        type: "textarea",
        required: true,
      },
      { name: "description", label: "Full Description", type: "textarea" },
      { name: "thumbnail", label: "Thumbnail", type: "image" },
      { name: "featured", label: "Featured", type: "checkbox" },
      { name: "status", label: "Status", type: "select", options: STATUS_OPTIONS },
      { name: "sort_order", label: "Sort Order", type: "number" },
    ],
  },
  values: {
    label: "Core Values",
    singular: "Core Value",
    icon: Heart,
    fields: [
      { name: "name", label: "Name", required: true },
      { name: "icon", label: "Icon", hint: "Heart, Handshake, Award, ShieldCheck" },
      { name: "description", label: "Description", type: "textarea", required: true },
      { name: "status", label: "Status", type: "select", options: STATUS_OPTIONS },
      { name: "sort_order", label: "Sort Order", type: "number" },
    ],
  },
  suppliers: partnerConfig("Global Suppliers", "Supplier", Handshake, true),
  clients: partnerConfig("Valued Clients", "Client", Building2, true),
  customers: partnerConfig("Satisfied Customers", "Customer", Users, true),
  gallery: {
    label: "Gallery",
    singular: "Gallery Image",
    icon: GalleryHorizontalEnd,
    imageField: "image",
    fields: [
      { name: "title", label: "Title", required: true },
      { name: "image", label: "Image", type: "image", required: true },
      { name: "caption", label: "Caption", type: "textarea" },
      { name: "status", label: "Status", type: "select", options: STATUS_OPTIONS },
      { name: "sort_order", label: "Sort Order", type: "number" },
    ],
  },
};

export const RESOURCE_ORDER = [
  "engagements",
  "solutions",
  "values",
  "suppliers",
  "clients",
  "customers",
  "gallery",
  "messages",
  "settings",
  "logs",
];

export function createEmptyItem(config) {
  return config.fields.reduce(
    (item, field) => ({
      ...item,
      [field.name]:
        field.type === "checkbox"
          ? false
          : field.type === "number"
            ? 0
            : field.type === "select"
              ? field.options[0]
              : "",
    }),
    {},
  );
}

export function titleCase(value) {
  return String(value || "")
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}
