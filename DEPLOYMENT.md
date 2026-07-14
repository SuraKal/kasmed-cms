# KASMED Production Deployment

This project is prepared to run as one Flask application that serves both the
React production build and the `/api` routes. This keeps authentication cookies,
uploads, and public requests on the same domain.

The current deployment path is FTP from GitHub Actions into a cPanel Python app
folder for `https://kasmedmedicalsolution.com/`.

## 1. cPanel Setup Required Once

In cPanel, create or confirm these items before running the GitHub deployment:

- The domain `kasmedmedicalsolution.com` points to the cPanel account.
- SSL is active for `https://kasmedmedicalsolution.com/`.
- FTP access exists for the deployment user.
- A MySQL database, database user, and password exist.
- **Setup Python App** or **Application Manager** is available.
- Python 3.11 or newer is available.

## 2. Create the cPanel Python Application

In **Setup Python App**:

- Choose Python 3.11 or newer.
- Set the application root to a dedicated app folder, for example
  `kasmed_app`. Many cPanel hosts do not allow `public_html` as the Python app
  root.
- Set the application URL to `https://kasmedmedicalsolution.com/`.
- Set the startup file to `passenger_wsgi.py`.
- Set the application entry point to `application`.

Open the cPanel-provided virtual environment and install:

`pip install -r backend/requirements.txt`

## 3. Configure Production Environment

Copy `.env.production.example` to `.env` on the server and replace every
placeholder.

Required production changes:

- Generate a long random `FLASK_SECRET_KEY`.
- Set `FLASK_DEBUG=false`.
- Set `SESSION_COOKIE_SECURE=true`.
- Set `CORS_ORIGINS=https://kasmedmedicalsolution.com`.
- Use the cPanel MySQL database name, user, and password.
- Set a unique administrator password.
- Keep `VITE_API_BASE_URL` empty when Flask serves the frontend and API together.

Do not use the local root MySQL account or the local administrator password in
production.

Suggested production values:

```env
FLASK_DEBUG=false
SESSION_COOKIE_SECURE=true
CORS_ORIGINS=https://kasmedmedicalsolution.com
VITE_API_BASE_URL=
AUTO_INIT_DB=false
MYSQL_HOST=localhost
MYSQL_PORT=3306
```

## 4. GitHub FTP Deployment Setup

The repository now includes `.github/workflows/deploy-ftp.yml`. Add these
secrets in GitHub under **Settings > Secrets and variables > Actions**:

- `FTP_SERVER`: your FTP host, often `ftp.kasmedmedicalsolution.com` or the
  cPanel server hostname.
- `FTP_USERNAME`: the FTP username.
- `FTP_PASSWORD`: the FTP password.
- `FTP_PROTOCOL`: use `ftps` when available. Use `ftp` only if the host does not
  support FTPS.
- `FTP_PORT`: usually `21`.
- `FTP_SERVER_DIR`: the FTP path for the Python app root, for example
  `/kasmed_app/`. Use `/public_html/` only if your host explicitly allows the
  Python app root to be `public_html`.

The workflow runs on every push to `main` and can also be started manually from
the GitHub **Actions** tab.

The workflow builds `dist/`, validates the Python entry points, uploads the app,
and refreshes `tmp/restart.txt` so Passenger restarts after deployment. It does
not upload `.env`, `backend/uploads`, `node_modules`, `.git`, or virtual
environment files.

## 5. Initialize MySQL

From the activated cPanel Python environment:

1. Create tables and default access roles:
   `python -m flask --app backend.app init-db`
2. Seed the public content:
   `python -m flask --app backend.app seed-public-content`

Use `seed-public-content --update` only when intentionally restoring seeded
records to the definitions in `backend/seeders/public_content.py`.

After the first successful initialization, set `AUTO_INIT_DB=false`.

## 6. Files and Permissions

- Ensure `backend/uploads` exists.
- Give the Python application write permission to `backend/uploads`.
- Keep `.env` outside public downloads and never commit it.
- Back up both MySQL and `backend/uploads`.

## 7. Launch and Verify

Restart the Python application in cPanel, then verify:

- `/` loads the landing page.
- `/about` loads directly without a 404.
- `/admin` accepts the production administrator account.
- An image upload succeeds.
- A contact form submission appears under Contact Messages.
- Dashboard analytics increase after public navigation.
- `/api/health` returns `{"status":"ok","database":"mysql"}`.

Run the automated production configuration check:

`python -m flask --app backend.app check-production`

Run the full non-destructive platform smoke test:

`python -m backend.tests.production_smoke`

## Updating the Site

1. Push to the `main` branch or run the GitHub workflow manually.
2. If Python dependencies changed, open the cPanel virtual environment and run
   `pip install -r backend/requirements.txt`.
3. If database models changed, run the required Flask database command.
4. Confirm `/api/health` and `/admin` after deployment.
