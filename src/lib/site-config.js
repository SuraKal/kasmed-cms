const env = import.meta.env;

export const SITE_CONFIG = {
  name: env.VITE_SITE_NAME || "KASMED Trading PLC",
  shortName: env.VITE_SITE_SHORT_NAME || "KASMED",
  phone: env.VITE_CONTACT_PHONE || "+251954085010",
  email: env.VITE_CONTACT_EMAIL || "kasmed@gmail.com",
  addressLines: [
    env.VITE_OFFICE_ADDRESS_LINE1 || "Yobek Commercial Center",
    env.VITE_OFFICE_ADDRESS_LINE2 || "Office A808/A809",
    env.VITE_OFFICE_ADDRESS_LINE3 || "Lideta Sub City, Wereda 07",
    env.VITE_OFFICE_ADDRESS_LINE4 || "Addis Ababa, Ethiopia",
  ],
};
