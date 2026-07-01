# KASMED Trading PLC

Local React + Vite marketing site for KASMED Trading PLC.

## Setup

1. Install dependencies: `npm install`
2. Start the app: `npm run dev`
3. Build for production: `npm run build`

## Environment

The app reads branding and contact details from `.env`:

- `VITE_SITE_NAME`
- `VITE_SITE_SHORT_NAME`
- `VITE_CONTACT_PHONE`
- `VITE_CONTACT_EMAIL`
- `VITE_OFFICE_ADDRESS_LINE1`
- `VITE_OFFICE_ADDRESS_LINE2`
- `VITE_OFFICE_ADDRESS_LINE3`
- `VITE_OFFICE_ADDRESS_LINE4`

## Notes

- No Base44 CLI or backend is required.
- The landing page, contact section, gallery, and 404 page run entirely in the browser.
- Partner logos can be dropped into `public/images/clients`, `public/images/suppliers`, and `public/images/customers`.
