import io
import os
from pathlib import Path
from uuid import uuid4

from sqlalchemy import func

from backend.app import (
    AdminAuditLog,
    AnalyticsEvent,
    ContactMessage,
    Engagement,
    GalleryImage,
    UPLOAD_DIR,
    app,
    db,
)


def require(response, expected, label):
    if response.status_code != expected:
        raise AssertionError(
            f"{label}: expected {expected}, got {response.status_code}: "
            f"{response.get_data(as_text=True)}"
        )
    return response


def run():
    unique = uuid4().hex[:10]
    created_engagement_uuid = None
    created_gallery_uuid = None
    created_message_uuid = None
    uploaded_filename = None

    with app.app_context():
        initial_log_id = db.session.query(func.max(AdminAuditLog.id)).scalar() or 0
        initial_event_id = db.session.query(func.max(AnalyticsEvent.id)).scalar() or 0

    client = app.test_client()
    try:
        health = require(client.get("/api/health"), 200, "health")
        assert health.headers.get("X-Content-Type-Options") == "nosniff"

        for route in ["/", "/about", "/admin", "/solutions/renal-care-systems"]:
            require(client.get(route), 200, f"SPA route {route}")

        require(
            client.get("/api/content/engagements/import-distribution"),
            200,
            "engagement detail",
        )
        require(
            client.get("/api/content/solutions/renal-care-systems"),
            200,
            "solution detail",
        )
        require(
            client.post(
                "/api/analytics/events",
                json={
                    "event_type": "click",
                    "resource": "smoke-test",
                    "label": f"Production Smoke {unique}",
                    "session_id": f"smoke-{unique}",
                },
            ),
            201,
            "analytics",
        )

        require(
            client.post(
                "/api/auth/login",
                json={
                    "username": os.getenv("ADMIN_DEFAULT_USERNAME", "admin"),
                    "password": os.getenv("ADMIN_DEFAULT_PASSWORD", "admin123"),
                },
            ),
            200,
            "admin login",
        )
        require(client.get("/api/admin/dashboard"), 200, "dashboard")
        pagination = require(
            client.get("/api/admin/solutions?page=1&per_page=5"),
            200,
            "pagination",
        ).get_json()
        assert len(pagination["items"]) <= 5
        assert pagination["pagination"]["total"] >= 10

        engagement = require(
            client.post(
                "/api/admin/engagements",
                json={
                    "name": f"Production Smoke {unique}",
                    "description": "Temporary deployment verification record.",
                    "status": "draft",
                },
            ),
            201,
            "create engagement",
        ).get_json()
        created_engagement_uuid = engagement["uuid"]
        assert engagement["slug"] == f"production-smoke-{unique}"

        gallery = require(
            client.post(
                "/api/admin/gallery",
                json={
                    "title": f"Production Smoke Gallery {unique}",
                    "image": "/images/logo/logo_dark.png",
                    "status": "draft",
                },
            ),
            201,
            "create gallery",
        ).get_json()
        created_gallery_uuid = gallery["uuid"]
        assert gallery["alt_text"] == gallery["title"]

        message = require(
            client.post(
                "/api/contact",
                json={
                    "name": "Production Smoke Test",
                    "email": "smoke@example.invalid",
                    "subject": f"Production Smoke {unique}",
                    "message": "Temporary deployment verification message.",
                },
            ),
            201,
            "contact submission",
        ).get_json()
        created_message_uuid = message["uuid"]

        upload = require(
            client.post(
                "/api/admin/upload",
                data={
                    "resource": "gallery",
                    "file": (io.BytesIO(b"smoke-test"), f"smoke-{unique}.png"),
                },
                content_type="multipart/form-data",
            ),
            201,
            "image upload",
        ).get_json()
        uploaded_filename = upload["filename"]
        assert (UPLOAD_DIR / uploaded_filename).exists()

        require(
            client.delete(f"/api/admin/engagements/{created_engagement_uuid}"),
            200,
            "delete engagement",
        )
        created_engagement_uuid = None
        require(
            client.delete(f"/api/admin/gallery/{created_gallery_uuid}"),
            200,
            "delete gallery",
        )
        created_gallery_uuid = None
        require(
            client.delete(f"/api/admin/messages/{created_message_uuid}"),
            200,
            "delete message",
        )
        created_message_uuid = None
        require(client.get("/api/admin/logs?page=1&per_page=5"), 200, "audit logs")
    finally:
        with app.app_context():
            if created_engagement_uuid:
                Engagement.query.filter_by(uuid=created_engagement_uuid).delete()
            if created_gallery_uuid:
                GalleryImage.query.filter_by(uuid=created_gallery_uuid).delete()
            if created_message_uuid:
                ContactMessage.query.filter_by(uuid=created_message_uuid).delete()
            AnalyticsEvent.query.filter(AnalyticsEvent.id > initial_event_id).delete()
            AdminAuditLog.query.filter(AdminAuditLog.id > initial_log_id).delete()
            db.session.commit()
        if uploaded_filename:
            Path(UPLOAD_DIR / uploaded_filename).unlink(missing_ok=True)

    print("Production smoke test passed")


if __name__ == "__main__":
    run()
