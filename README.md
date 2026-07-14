# KASMED Trading PLC

Local React + Vite marketing site for KASMED Trading PLC.

## Setup

1. Install dependencies: `npm install`
2. Start the app: `npm run dev`
3. Build for production: `npm run build`

## Flask Backend

1. Create a Python virtual environment: `python -m venv backend/.venv`
2. Activate it for your terminal:
   - Git Bash: `source backend/.venv/Scripts/activate`
   - PowerShell: `backend\.venv\Scripts\Activate.ps1`
   - Command Prompt: `backend\.venv\Scripts\activate.bat`
3. Install packages: `pip install -r backend/requirements.txt`
4. Start Flask: `python backend/app.py`

If environment creation is interrupted, rebuild it with
`python -m venv --clear backend/.venv`.

`AUTO_INIT_DB=true` creates the tables and seeds the default roles, administrator,
and site settings when Flask starts. You can also run
`flask --app backend.app init-db` manually.

## Admin Panel

1. Start Flask with `python backend/app.py`
2. Start React with `npm run dev`
3. Open `http://localhost:5173/admin`
4. Sign in with the values in `ADMIN_DEFAULT_USERNAME` and
   `ADMIN_DEFAULT_PASSWORD`

The current local defaults are `admin` / `KasmedAdmin@2026`. Change the password
and `FLASK_SECRET_KEY` before publishing.

The admin includes:

- A dashboard with 30-day page views, clicks, section engagement, visitors,
  messages, top interactions, and management shortcuts.
- Paginated and searchable content and contact-message lists.
- Backend-generated slugs and gallery alternative text.
- In-app confirmation dialogs for destructive actions.
- Filterable admin audit logs by resource, action, and date.

## Seed Public Content

Seed the current real public-site content into MySQL:

`python -m flask --app backend.app seed-public-content`

The command only creates missing records, so it is safe to run again. To replace
matching database records with the current seed definitions, run:

`python -m flask --app backend.app seed-public-content --update`

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
- `FLASK_SECRET_KEY`
- `FLASK_DEBUG`
- `FLASK_HOST`
- `FLASK_PORT`
- `DATABASE_URL`
- `CORS_ORIGINS`
- `VITE_API_BASE_URL`
- `AUTO_INIT_DB`
- `MAX_UPLOAD_MB`
- `ADMIN_DEFAULT_USERNAME`
- `ADMIN_DEFAULT_PASSWORD`
- `ADMIN_DEFAULT_FULL_NAME`
- `MYSQL_HOST`
- `MYSQL_PORT`
- `MYSQL_DATABASE`
- `MYSQL_USER`
- `MYSQL_PASSWORD`

## Notes

- No Base44 CLI or backend is required.
- The React public site reads active content from Flask and uses its existing
  content if the API is unavailable or a managed table is empty.
- The landing page remains available at `/`, with additional public routes at
  `/about`, `/contact`, `/gallery`, `/engagements`, and `/solutions`.
- Engagement and solution detail pages use their generated slugs, for example
  `/engagements/import-distribution` and `/solutions/renal-care-systems`.
- Uploaded images are stored in `backend/uploads`.
- Partner logos can be dropped into `public/images/clients`, `public/images/suppliers`, and `public/images/customers`.
- Keep `VITE_API_BASE_URL` empty for the recommended same-origin Flask
  deployment. Set it only when the frontend and API intentionally use different
  domains.

## Deployment

Flask serves the compiled `dist` application and `/api` from the same origin in
production. See `DEPLOYMENT.md` for the cPanel Passenger, environment, MySQL,
seed, uploads, and verification steps.

GitHub Actions deployment is configured in `.github/workflows/deploy-ftp.yml`.
It builds the React app, validates the Flask entry points, and uploads the
project to cPanel over FTP/FTPS. Configure the required FTP secrets in GitHub
before running it.

Production verification commands:

- `python -m flask --app backend.app check-production`
- `python -m backend.tests.production_smoke`


Seed the data by 
python -m flask --app backend.app seed-public-content


Activate using 
source backend/.venv/Scripts/activate


Fill production credentials, then run:
python -m flask --app backend.app check-production
