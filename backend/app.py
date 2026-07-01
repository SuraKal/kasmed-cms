from __future__ import annotations

import os
import re
from datetime import datetime, timedelta, timezone
from functools import wraps
from pathlib import Path
from urllib.parse import quote_plus
from uuid import uuid4

import click
from dotenv import load_dotenv
from flask import Flask, g, jsonify, request, send_from_directory, session
from flask_cors import CORS
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import UniqueConstraint, func, or_
from werkzeug.security import check_password_hash, generate_password_hash
from werkzeug.utils import secure_filename

BASE_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = BASE_DIR.parent
UPLOAD_DIR = BASE_DIR / "uploads"
load_dotenv(PROJECT_ROOT / ".env")

db = SQLAlchemy()
migrate = Migrate()

RESOURCE_NAMES = [
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
]
PUBLIC_PARTNER_TYPES = {"suppliers", "clients", "customers"}
ALLOWED_UPLOAD_EXTENSIONS = {"png", "jpg", "jpeg", "webp", "gif", "svg"}


def utc_now():
    return datetime.now(timezone.utc)


def new_uuid():
    return str(uuid4())


def slugify(value):
    value = re.sub(r"[^a-z0-9]+", "-", (value or "").strip().lower()).strip("-")
    return value or new_uuid()


def ensure_unique_slug(model, value, current_id=None, extra_filters=None):
    base = slugify(value)
    candidate = base
    counter = 2
    while True:
        query = model.query.filter_by(slug=candidate)
        if extra_filters:
            query = query.filter_by(**extra_filters)
        existing = query.first()
        if existing is None or existing.id == current_id:
            return candidate
        candidate = f"{base}-{counter}"
        counter += 1


class TimestampMixin:
    created_at = db.Column(db.DateTime(timezone=True), nullable=False, default=utc_now)
    updated_at = db.Column(
        db.DateTime(timezone=True), nullable=False, default=utc_now, onupdate=utc_now
    )

    def timestamp_dict(self):
        return {
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }


class Engagement(TimestampMixin, db.Model):
    __tablename__ = "engagements"

    id = db.Column(db.Integer, primary_key=True)
    uuid = db.Column(db.String(36), unique=True, nullable=False, default=new_uuid)
    slug = db.Column(db.String(160), unique=True, nullable=False, index=True)
    name = db.Column(db.String(180), nullable=False)
    description = db.Column(db.Text, nullable=False)
    thumbnail = db.Column(db.String(500), nullable=False, default="")
    status = db.Column(db.String(20), nullable=False, default="active", index=True)
    sort_order = db.Column(db.Integer, nullable=False, default=0)

    def to_dict(self):
        return {
            "uuid": self.uuid,
            "slug": self.slug,
            "name": self.name,
            "description": self.description,
            "thumbnail": self.thumbnail,
            "status": self.status,
            "sort_order": self.sort_order,
            **self.timestamp_dict(),
        }


class Solution(TimestampMixin, db.Model):
    __tablename__ = "solutions"

    id = db.Column(db.Integer, primary_key=True)
    uuid = db.Column(db.String(36), unique=True, nullable=False, default=new_uuid)
    slug = db.Column(db.String(160), unique=True, nullable=False, index=True)
    name = db.Column(db.String(180), nullable=False)
    tags = db.Column(db.JSON, nullable=False, default=list)
    short_description = db.Column(db.Text, nullable=False)
    description = db.Column(db.Text, nullable=False, default="")
    thumbnail = db.Column(db.String(500), nullable=False, default="")
    status = db.Column(db.String(20), nullable=False, default="active", index=True)
    featured = db.Column(db.Boolean, nullable=False, default=False)
    sort_order = db.Column(db.Integer, nullable=False, default=0)

    def to_dict(self):
        return {
            "uuid": self.uuid,
            "slug": self.slug,
            "name": self.name,
            "tags": self.tags or [],
            "short_description": self.short_description,
            "description": self.description,
            "thumbnail": self.thumbnail,
            "status": self.status,
            "featured": self.featured,
            "sort_order": self.sort_order,
            **self.timestamp_dict(),
        }


class CoreValue(TimestampMixin, db.Model):
    __tablename__ = "core_values"

    id = db.Column(db.Integer, primary_key=True)
    uuid = db.Column(db.String(36), unique=True, nullable=False, default=new_uuid)
    slug = db.Column(db.String(160), unique=True, nullable=False, index=True)
    name = db.Column(db.String(180), nullable=False)
    description = db.Column(db.Text, nullable=False)
    icon = db.Column(db.String(80), nullable=False, default="Heart")
    status = db.Column(db.String(20), nullable=False, default="active", index=True)
    sort_order = db.Column(db.Integer, nullable=False, default=0)

    def to_dict(self):
        return {
            "uuid": self.uuid,
            "slug": self.slug,
            "name": self.name,
            "description": self.description,
            "icon": self.icon,
            "status": self.status,
            "sort_order": self.sort_order,
            **self.timestamp_dict(),
        }


class Partner(TimestampMixin, db.Model):
    __tablename__ = "partners"
    __table_args__ = (
        UniqueConstraint("partner_type", "slug", name="uq_partner_type_slug"),
    )

    id = db.Column(db.Integer, primary_key=True)
    uuid = db.Column(db.String(36), unique=True, nullable=False, default=new_uuid)
    partner_type = db.Column(db.String(20), nullable=False, index=True)
    slug = db.Column(db.String(160), nullable=False)
    name = db.Column(db.String(180), nullable=False)
    logo = db.Column(db.String(500), nullable=False)
    website = db.Column(db.String(500), nullable=False, default="")
    status = db.Column(db.String(20), nullable=False, default="active", index=True)
    sort_order = db.Column(db.Integer, nullable=False, default=0)

    def to_dict(self):
        return {
            "uuid": self.uuid,
            "slug": self.slug,
            "name": self.name,
            "logo": self.logo,
            "website": self.website,
            "status": self.status,
            "sort_order": self.sort_order,
            "partner_type": self.partner_type,
            **self.timestamp_dict(),
        }


class GalleryImage(TimestampMixin, db.Model):
    __tablename__ = "gallery_images"

    id = db.Column(db.Integer, primary_key=True)
    uuid = db.Column(db.String(36), unique=True, nullable=False, default=new_uuid)
    title = db.Column(db.String(180), nullable=False)
    alt_text = db.Column(db.String(255), nullable=False)
    image = db.Column(db.String(500), nullable=False)
    caption = db.Column(db.Text, nullable=False, default="")
    status = db.Column(db.String(20), nullable=False, default="active", index=True)
    sort_order = db.Column(db.Integer, nullable=False, default=0)

    def to_dict(self):
        return {
            "uuid": self.uuid,
            "title": self.title,
            "alt_text": self.alt_text,
            "image": self.image,
            "caption": self.caption,
            "status": self.status,
            "sort_order": self.sort_order,
            **self.timestamp_dict(),
        }


class ContactMessage(db.Model):
    __tablename__ = "contact_messages"

    id = db.Column(db.Integer, primary_key=True)
    uuid = db.Column(db.String(36), unique=True, nullable=False, default=new_uuid)
    name = db.Column(db.String(180), nullable=False)
    email = db.Column(db.String(255), nullable=False, index=True)
    phone = db.Column(db.String(80), nullable=False, default="")
    subject = db.Column(db.String(255), nullable=False)
    message = db.Column(db.Text, nullable=False)
    status = db.Column(db.String(20), nullable=False, default="new", index=True)
    admin_reply = db.Column(db.Text, nullable=False, default="")
    admin_notes = db.Column(db.Text, nullable=False, default="")
    replied_at = db.Column(db.DateTime(timezone=True), nullable=True)
    created_at = db.Column(db.DateTime(timezone=True), nullable=False, default=utc_now)
    updated_at = db.Column(
        db.DateTime(timezone=True), nullable=False, default=utc_now, onupdate=utc_now
    )

    def to_dict(self):
        return {
            "uuid": self.uuid,
            "name": self.name,
            "email": self.email,
            "phone": self.phone,
            "subject": self.subject,
            "message": self.message,
            "status": self.status,
            "admin_reply": self.admin_reply,
            "admin_notes": self.admin_notes,
            "replied_at": self.replied_at.isoformat() if self.replied_at else None,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }


class AnalyticsEvent(db.Model):
    __tablename__ = "analytics_events"

    id = db.Column(db.Integer, primary_key=True)
    uuid = db.Column(db.String(36), unique=True, nullable=False, default=new_uuid)
    event_type = db.Column(db.String(40), nullable=False, index=True)
    resource = db.Column(db.String(80), nullable=False, default="", index=True)
    label = db.Column(db.String(255), nullable=False, default="")
    path = db.Column(db.String(500), nullable=False, default="")
    session_id = db.Column(db.String(80), nullable=False, default="", index=True)
    event_data = db.Column(db.JSON, nullable=False, default=dict)
    created_at = db.Column(
        db.DateTime(timezone=True), nullable=False, default=utc_now, index=True
    )

    def to_dict(self):
        return {
            "uuid": self.uuid,
            "event_type": self.event_type,
            "resource": self.resource,
            "label": self.label,
            "path": self.path,
            "session_id": self.session_id,
            "event_data": self.event_data or {},
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }


class AdminAuditLog(db.Model):
    __tablename__ = "admin_audit_logs"

    id = db.Column(db.Integer, primary_key=True)
    uuid = db.Column(db.String(36), unique=True, nullable=False, default=new_uuid)
    admin_user_id = db.Column(
        db.Integer, db.ForeignKey("admin_users.id"), nullable=True, index=True
    )
    username = db.Column(db.String(80), nullable=False, default="", index=True)
    action = db.Column(db.String(40), nullable=False, index=True)
    resource = db.Column(db.String(80), nullable=False, index=True)
    resource_uuid = db.Column(db.String(80), nullable=False, default="", index=True)
    description = db.Column(db.String(500), nullable=False, default="")
    details = db.Column(db.JSON, nullable=False, default=dict)
    ip_address = db.Column(db.String(80), nullable=False, default="")
    user_agent = db.Column(db.String(500), nullable=False, default="")
    created_at = db.Column(
        db.DateTime(timezone=True), nullable=False, default=utc_now, index=True
    )

    def to_dict(self):
        return {
            "uuid": self.uuid,
            "username": self.username,
            "action": self.action,
            "resource": self.resource,
            "resource_uuid": self.resource_uuid,
            "description": self.description,
            "details": self.details or {},
            "ip_address": self.ip_address,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }


class SiteSettings(TimestampMixin, db.Model):
    __tablename__ = "site_settings"

    id = db.Column(db.Integer, primary_key=True, default=1)
    company_name = db.Column(db.String(180), nullable=False, default="KASMED Trading PLC")
    address_text = db.Column(db.Text, nullable=False, default="")
    map_embed_url = db.Column(db.Text, nullable=False, default="")
    phone_primary = db.Column(db.String(80), nullable=False, default="")
    phone_secondary = db.Column(db.String(80), nullable=False, default="")
    email_primary = db.Column(db.String(255), nullable=False, default="")
    email_secondary = db.Column(db.String(255), nullable=False, default="")
    business_hours = db.Column(db.JSON, nullable=False, default=list)
    social_links = db.Column(db.JSON, nullable=False, default=dict)
    footer_description = db.Column(db.Text, nullable=False, default="")

    def to_dict(self):
        return {
            "company_name": self.company_name,
            "address_text": self.address_text,
            "map_embed_url": self.map_embed_url,
            "phone_primary": self.phone_primary,
            "phone_secondary": self.phone_secondary,
            "email_primary": self.email_primary,
            "email_secondary": self.email_secondary,
            "business_hours": self.business_hours or [],
            "social_links": self.social_links or {},
            "footer_description": self.footer_description,
            **self.timestamp_dict(),
        }


class AdminRole(db.Model):
    __tablename__ = "admin_roles"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=True, nullable=False, index=True)
    description = db.Column(db.String(255), nullable=False, default="")
    allowed_resources = db.Column(db.JSON, nullable=False, default=list)
    is_super_admin = db.Column(db.Boolean, nullable=False, default=False)
    can_manage_users = db.Column(db.Boolean, nullable=False, default=False)
    can_manage_roles = db.Column(db.Boolean, nullable=False, default=False)
    created_at = db.Column(db.DateTime(timezone=True), nullable=False, default=utc_now)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "allowed_resources": self.allowed_resources or [],
            "is_super_admin": self.is_super_admin,
            "can_manage_users": self.can_manage_users,
            "can_manage_roles": self.can_manage_roles,
        }


class AdminUser(db.Model):
    __tablename__ = "admin_users"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False, index=True)
    full_name = db.Column(db.String(180), nullable=False, default="")
    password_hash = db.Column(db.String(255), nullable=False)
    role_id = db.Column(db.Integer, db.ForeignKey("admin_roles.id"), nullable=False)
    is_active = db.Column(db.Boolean, nullable=False, default=True)
    last_login_at = db.Column(db.DateTime(timezone=True), nullable=True)
    created_at = db.Column(db.DateTime(timezone=True), nullable=False, default=utc_now)

    role = db.relationship("AdminRole", backref=db.backref("users", lazy=True))

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "full_name": self.full_name,
            "role_id": self.role_id,
            "role": self.role.to_dict() if self.role else None,
            "is_active": self.is_active,
            "last_login_at": self.last_login_at.isoformat()
            if self.last_login_at
            else None,
        }


CONTENT_CONFIG = {
    "engagements": {
        "model": Engagement,
        "required": ["name", "description"],
        "fields": [
            "name",
            "description",
            "thumbnail",
            "status",
            "sort_order",
        ],
    },
    "solutions": {
        "model": Solution,
        "required": ["name", "short_description"],
        "fields": [
            "name",
            "tags",
            "short_description",
            "description",
            "thumbnail",
            "status",
            "featured",
            "sort_order",
        ],
    },
    "values": {
        "model": CoreValue,
        "required": ["name", "description"],
        "fields": ["name", "description", "icon", "status", "sort_order"],
    },
    "gallery": {
        "model": GalleryImage,
        "required": ["title", "image"],
        "fields": ["title", "image", "caption", "status", "sort_order"],
    },
}


def create_app():
    app = Flask(__name__)
    app.config.update(
        SQLALCHEMY_DATABASE_URI=build_database_uri(),
        SQLALCHEMY_TRACK_MODIFICATIONS=False,
        SQLALCHEMY_ENGINE_OPTIONS={"pool_pre_ping": True, "pool_recycle": 280},
        SECRET_KEY=os.getenv("FLASK_SECRET_KEY", "dev-secret-key"),
        JSON_SORT_KEYS=False,
        MAX_CONTENT_LENGTH=int(os.getenv("MAX_UPLOAD_MB", "8")) * 1024 * 1024,
        SESSION_COOKIE_HTTPONLY=True,
        SESSION_COOKIE_SAMESITE=os.getenv("SESSION_COOKIE_SAMESITE", "Lax"),
        SESSION_COOKIE_SECURE=os.getenv("SESSION_COOKIE_SECURE", "false").lower()
        == "true",
    )

    origins = [
        origin.strip()
        for origin in os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")
        if origin.strip()
    ]
    CORS(
        app,
        resources={r"/api/*": {"origins": origins}},
        supports_credentials=True,
    )
    db.init_app(app)
    migrate.init_app(app, db)
    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

    @app.get("/api/health")
    def health_check():
        return jsonify({"status": "ok", "database": "mysql"})

    @app.get("/api/uploads/<path:filename>")
    def uploaded_file(filename):
        return send_from_directory(UPLOAD_DIR, filename)

    @app.get("/api/content")
    def public_content():
        return jsonify(
            {
                "engagements": active_items(Engagement),
                "solutions": active_items(Solution),
                "values": active_items(CoreValue),
                "suppliers": active_partners("suppliers"),
                "clients": active_partners("clients"),
                "customers": active_partners("customers"),
                "gallery": active_items(GalleryImage),
                "settings": get_or_create_settings().to_dict(),
            }
        )

    @app.get("/api/<resource>")
    def public_resource(resource):
        if resource in CONTENT_CONFIG:
            return jsonify(active_items(CONTENT_CONFIG[resource]["model"]))
        if resource in PUBLIC_PARTNER_TYPES:
            return jsonify(active_partners(resource))
        if resource == "settings":
            return jsonify(get_or_create_settings().to_dict())
        return jsonify({"error": "Resource not found"}), 404

    @app.post("/api/analytics/events")
    def create_analytics_event():
        data = request.get_json(silent=True) or {}
        event_type = str(data.get("event_type", "")).strip()
        if event_type not in {"page_view", "section_view", "click"}:
            return jsonify({"error": "Invalid analytics event type"}), 400

        event = AnalyticsEvent(
            event_type=event_type,
            resource=str(data.get("resource", ""))[:80],
            label=str(data.get("label", ""))[:255],
            path=str(data.get("path", ""))[:500],
            session_id=str(data.get("session_id", ""))[:80],
            event_data=data.get("event_data")
            if isinstance(data.get("event_data"), dict)
            else {},
        )
        db.session.add(event)
        db.session.commit()
        return jsonify({"recorded": True}), 201

    @app.post("/api/contact")
    def create_contact_message():
        data = request.get_json(silent=True) or {}
        missing = [
            field
            for field in ["name", "email", "subject", "message"]
            if not str(data.get(field, "")).strip()
        ]
        if missing:
            return jsonify({"error": f"Missing required fields: {', '.join(missing)}"}), 400

        message = ContactMessage(
            name=str(data["name"]).strip(),
            email=str(data["email"]).strip(),
            phone=str(data.get("phone", "")).strip(),
            subject=str(data["subject"]).strip(),
            message=str(data["message"]).strip(),
        )
        db.session.add(message)
        db.session.commit()
        return jsonify({"message": "Message received", "uuid": message.uuid}), 201

    @app.post("/api/auth/login")
    def login():
        data = request.get_json(silent=True) or {}
        username = str(data.get("username", "")).strip()
        password = str(data.get("password", ""))
        user = AdminUser.query.filter_by(username=username).first()
        if user is None or not user.is_active or not user.check_password(password):
            return jsonify({"error": "Invalid username or password"}), 401

        session.clear()
        session["admin_user_id"] = user.id
        user.last_login_at = utc_now()
        add_audit_log(
            user,
            action="login",
            resource="authentication",
            description=f"{user.username} signed in",
        )
        db.session.commit()
        return jsonify({"user": user.to_dict()})

    @app.post("/api/auth/logout")
    def logout():
        user_id = session.get("admin_user_id")
        user = db.session.get(AdminUser, user_id) if user_id else None
        if user:
            add_audit_log(
                user,
                action="logout",
                resource="authentication",
                description=f"{user.username} signed out",
            )
            db.session.commit()
        session.clear()
        return jsonify({"message": "Logged out"})

    @app.get("/api/auth/me")
    @admin_required
    def current_user():
        return jsonify({"user": g.admin_user.to_dict()})

    @app.get("/api/admin/dashboard")
    @admin_required
    def admin_dashboard():
        since = utc_now() - timedelta(days=30)
        event_query = AnalyticsEvent.query.filter(AnalyticsEvent.created_at >= since)
        daily_rows = (
            db.session.query(
                func.date(AnalyticsEvent.created_at).label("day"),
                func.count(AnalyticsEvent.id).label("count"),
            )
            .filter(AnalyticsEvent.created_at >= since)
            .group_by(func.date(AnalyticsEvent.created_at))
            .order_by(func.date(AnalyticsEvent.created_at))
            .all()
        )
        top_click_rows = (
            db.session.query(AnalyticsEvent.label, func.count(AnalyticsEvent.id))
            .filter(
                AnalyticsEvent.created_at >= since,
                AnalyticsEvent.event_type == "click",
                AnalyticsEvent.label != "",
            )
            .group_by(AnalyticsEvent.label)
            .order_by(func.count(AnalyticsEvent.id).desc())
            .limit(6)
            .all()
        )
        top_section_rows = (
            db.session.query(AnalyticsEvent.resource, func.count(AnalyticsEvent.id))
            .filter(
                AnalyticsEvent.created_at >= since,
                AnalyticsEvent.event_type == "section_view",
                AnalyticsEvent.resource != "",
            )
            .group_by(AnalyticsEvent.resource)
            .order_by(func.count(AnalyticsEvent.id).desc())
            .limit(6)
            .all()
        )
        content_counts = {
            "engagements": Engagement.query.count(),
            "solutions": Solution.query.count(),
            "values": CoreValue.query.count(),
            "suppliers": Partner.query.filter_by(partner_type="suppliers").count(),
            "clients": Partner.query.filter_by(partner_type="clients").count(),
            "customers": Partner.query.filter_by(partner_type="customers").count(),
            "gallery": GalleryImage.query.count(),
        }
        return jsonify(
            {
                "summary": {
                    "page_views": event_query.filter_by(event_type="page_view").count(),
                    "clicks": event_query.filter_by(event_type="click").count(),
                    "section_views": event_query.filter_by(
                        event_type="section_view"
                    ).count(),
                    "unique_visitors": event_query.with_entities(
                        func.count(func.distinct(AnalyticsEvent.session_id))
                    ).scalar()
                    or 0,
                    "messages": ContactMessage.query.count(),
                },
                "content_counts": content_counts,
                "daily_activity": [
                    {"date": str(day), "count": count} for day, count in daily_rows
                ],
                "top_clicks": [
                    {"label": label, "count": count}
                    for label, count in top_click_rows
                ],
                "top_sections": [
                    {"resource": resource, "count": count}
                    for resource, count in top_section_rows
                ],
                "recent_logs": [
                    log.to_dict()
                    for log in AdminAuditLog.query.order_by(
                        AdminAuditLog.created_at.desc()
                    )
                    .limit(8)
                    .all()
                ],
            }
        )

    @app.get("/api/admin/logs")
    @admin_required
    @resource_required("logs")
    def admin_logs():
        query = AdminAuditLog.query
        resource = request.args.get("resource", "").strip()
        action = request.args.get("action", "").strip()
        date_from = parse_date(request.args.get("date_from"), start=True)
        date_to = parse_date(request.args.get("date_to"), start=False)
        if resource:
            query = query.filter(AdminAuditLog.resource == resource)
        if action:
            query = query.filter(AdminAuditLog.action == action)
        if date_from:
            query = query.filter(AdminAuditLog.created_at >= date_from)
        if date_to:
            query = query.filter(AdminAuditLog.created_at <= date_to)
        page, per_page = pagination_args()
        pagination = query.order_by(AdminAuditLog.created_at.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )
        return jsonify(paginated_response(pagination))

    @app.get("/api/admin/<resource>")
    @admin_required
    def admin_list_resource(resource):
        page, per_page = pagination_args()
        search = request.args.get("search", "").strip()
        status = request.args.get("status", "").strip()

        if resource == "messages":
            if not has_resource_access(g.admin_user, resource):
                return forbidden()
            query = ContactMessage.query
            if search:
                term = f"%{search}%"
                query = query.filter(
                    or_(
                        ContactMessage.name.ilike(term),
                        ContactMessage.email.ilike(term),
                        ContactMessage.subject.ilike(term),
                    )
                )
            if status:
                query = query.filter(ContactMessage.status == status)
            pagination = query.order_by(ContactMessage.created_at.desc()).paginate(
                page=page, per_page=per_page, error_out=False
            )
            return jsonify(paginated_response(pagination))

        if resource in PUBLIC_PARTNER_TYPES:
            if not has_resource_access(g.admin_user, resource):
                return forbidden()
            query = Partner.query.filter_by(partner_type=resource)
            if search:
                query = query.filter(Partner.name.ilike(f"%{search}%"))
            if status:
                query = query.filter(Partner.status == status)
            pagination = query.order_by(
                Partner.sort_order.asc(), Partner.name.asc()
            ).paginate(
                page=page,
                per_page=per_page,
                error_out=False,
            )
            return jsonify(paginated_response(pagination))

        if resource in CONTENT_CONFIG:
            if not has_resource_access(g.admin_user, resource):
                return forbidden()
            model = CONTENT_CONFIG[resource]["model"]
            query = model.query
            display_column = getattr(model, "name", getattr(model, "title", None))
            if search:
                query = query.filter(display_column.ilike(f"%{search}%"))
            if status:
                query = query.filter(model.status == status)
            pagination = query.order_by(
                model.sort_order.asc(), model.id.asc()
            ).paginate(page=page, per_page=per_page, error_out=False)
            return jsonify(paginated_response(pagination))

        return jsonify({"error": "Resource not found"}), 404

    @app.post("/api/admin/<resource>")
    @admin_required
    def admin_create_resource(resource):
        if not has_resource_access(g.admin_user, resource):
            return forbidden()
        data = request.get_json(silent=True) or {}

        if resource in PUBLIC_PARTNER_TYPES:
            missing = validate_required(data, ["name", "logo"])
            if missing:
                return validation_error(missing)
            item = Partner(partner_type=resource)
            apply_partner_data(item, data)
        elif resource in CONTENT_CONFIG:
            config = CONTENT_CONFIG[resource]
            missing = validate_required(data, config["required"])
            if missing:
                return validation_error(missing)
            item = config["model"]()
            apply_content_data(resource, item, data)
        else:
            return jsonify({"error": "Resource not found"}), 404

        db.session.add(item)
        db.session.flush()
        add_audit_log(
            g.admin_user,
            action="create",
            resource=resource,
            target=item,
            description=f"Created {item_display_name(item)}",
        )
        db.session.commit()
        return jsonify(item.to_dict()), 201

    @app.put("/api/admin/<resource>/<uuid>")
    @admin_required
    def admin_update_resource(resource, uuid):
        if not has_resource_access(g.admin_user, resource):
            return forbidden()
        data = request.get_json(silent=True) or {}

        if resource == "messages":
            item = ContactMessage.query.filter_by(uuid=uuid).first_or_404()
            for field in ["status", "admin_reply", "admin_notes"]:
                if field in data:
                    setattr(item, field, data[field])
            if data.get("status") == "replied" or data.get("admin_reply"):
                item.replied_at = utc_now()
        elif resource in PUBLIC_PARTNER_TYPES:
            item = Partner.query.filter_by(uuid=uuid, partner_type=resource).first_or_404()
            apply_partner_data(item, data)
        elif resource in CONTENT_CONFIG:
            model = CONTENT_CONFIG[resource]["model"]
            item = model.query.filter_by(uuid=uuid).first_or_404()
            apply_content_data(resource, item, data)
        else:
            return jsonify({"error": "Resource not found"}), 404

        add_audit_log(
            g.admin_user,
            action="update",
            resource=resource,
            target=item,
            description=f"Updated {item_display_name(item)}",
        )
        db.session.commit()
        return jsonify(item.to_dict())

    @app.delete("/api/admin/<resource>/<uuid>")
    @admin_required
    def admin_delete_resource(resource, uuid):
        if not has_resource_access(g.admin_user, resource):
            return forbidden()

        if resource == "messages":
            item = ContactMessage.query.filter_by(uuid=uuid).first_or_404()
        elif resource in PUBLIC_PARTNER_TYPES:
            item = Partner.query.filter_by(uuid=uuid, partner_type=resource).first_or_404()
        elif resource in CONTENT_CONFIG:
            model = CONTENT_CONFIG[resource]["model"]
            item = model.query.filter_by(uuid=uuid).first_or_404()
        else:
            return jsonify({"error": "Resource not found"}), 404

        item_name = item_display_name(item)
        item_uuid = item.uuid
        db.session.delete(item)
        add_audit_log(
            g.admin_user,
            action="delete",
            resource=resource,
            resource_uuid=item_uuid,
            description=f"Deleted {item_name}",
        )
        db.session.commit()
        return jsonify({"deleted": uuid})

    @app.get("/api/admin/settings")
    @admin_required
    @resource_required("settings")
    def admin_get_settings():
        return jsonify(get_or_create_settings().to_dict())

    @app.put("/api/admin/settings")
    @admin_required
    @resource_required("settings")
    def admin_update_settings():
        settings = get_or_create_settings()
        data = request.get_json(silent=True) or {}
        fields = [
            "company_name",
            "address_text",
            "map_embed_url",
            "phone_primary",
            "phone_secondary",
            "email_primary",
            "email_secondary",
            "business_hours",
            "social_links",
            "footer_description",
        ]
        for field in fields:
            if field in data:
                setattr(settings, field, data[field])
        settings.map_embed_url = extract_map_url(settings.map_embed_url)
        add_audit_log(
            g.admin_user,
            action="update",
            resource="settings",
            resource_uuid="site-settings",
            description="Updated site settings",
        )
        db.session.commit()
        return jsonify(settings.to_dict())

    @app.post("/api/admin/upload")
    @admin_required
    def upload_file():
        resource = request.form.get("resource", "")
        if resource not in RESOURCE_NAMES or not has_resource_access(g.admin_user, resource):
            return forbidden()
        uploaded = request.files.get("file")
        if uploaded is None or not uploaded.filename:
            return jsonify({"error": "Choose an image to upload"}), 400

        extension = uploaded.filename.rsplit(".", 1)[-1].lower()
        if "." not in uploaded.filename or extension not in ALLOWED_UPLOAD_EXTENSIONS:
            return jsonify({"error": "Unsupported image type"}), 400

        original_name = secure_filename(uploaded.filename)
        filename = f"{resource}-{new_uuid()}-{original_name}"
        uploaded.save(UPLOAD_DIR / filename)
        add_audit_log(
            g.admin_user,
            action="upload",
            resource=resource,
            resource_uuid=filename,
            description=f"Uploaded {original_name}",
        )
        db.session.commit()
        return jsonify({"url": f"/api/uploads/{filename}", "filename": filename}), 201

    @app.get("/api/admin/roles")
    @admin_required
    def list_roles():
        role = g.admin_user.role
        if not role or not (
            role.is_super_admin or role.can_manage_roles or role.can_manage_users
        ):
            return forbidden()
        return jsonify([role.to_dict() for role in AdminRole.query.order_by(AdminRole.name).all()])

    @app.post("/api/admin/roles")
    @admin_required
    @roles_required
    def create_role():
        data = request.get_json(silent=True) or {}
        name = slugify(data.get("name", "")).replace("-", "_")
        if not name:
            return jsonify({"error": "Role name is required"}), 400
        if AdminRole.query.filter_by(name=name).first():
            return jsonify({"error": "Role name already exists"}), 409
        role = AdminRole(name=name)
        apply_role_data(role, data)
        db.session.add(role)
        db.session.flush()
        add_audit_log(
            g.admin_user,
            action="create",
            resource="roles",
            resource_uuid=str(role.id),
            description=f"Created role {role.name}",
        )
        db.session.commit()
        return jsonify(role.to_dict()), 201

    @app.put("/api/admin/roles/<int:role_id>")
    @admin_required
    @roles_required
    def update_role(role_id):
        role = AdminRole.query.get_or_404(role_id)
        data = request.get_json(silent=True) or {}
        apply_role_data(role, data)
        add_audit_log(
            g.admin_user,
            action="update",
            resource="roles",
            resource_uuid=str(role.id),
            description=f"Updated role {role.name}",
        )
        db.session.commit()
        return jsonify(role.to_dict())

    @app.get("/api/admin/users")
    @admin_required
    @users_required
    def list_users():
        return jsonify([user.to_dict() for user in AdminUser.query.order_by(AdminUser.username).all()])

    @app.post("/api/admin/users")
    @admin_required
    @users_required
    def create_user():
        data = request.get_json(silent=True) or {}
        missing = validate_required(data, ["username", "password", "role_id"])
        if missing:
            return validation_error(missing)
        if AdminUser.query.filter_by(username=str(data["username"]).strip()).first():
            return jsonify({"error": "Username already exists"}), 409
        role = db.session.get(AdminRole, int(data["role_id"]))
        if role is None:
            return jsonify({"error": "Role not found"}), 404
        user = AdminUser(
            username=str(data["username"]).strip(),
            full_name=str(data.get("full_name", "")).strip(),
            role=role,
            is_active=bool(data.get("is_active", True)),
        )
        user.set_password(str(data["password"]))
        db.session.add(user)
        db.session.flush()
        add_audit_log(
            g.admin_user,
            action="create",
            resource="users",
            resource_uuid=str(user.id),
            description=f"Created admin user {user.username}",
        )
        db.session.commit()
        return jsonify(user.to_dict()), 201

    @app.put("/api/admin/users/<int:user_id>")
    @admin_required
    @users_required
    def update_user(user_id):
        user = AdminUser.query.get_or_404(user_id)
        data = request.get_json(silent=True) or {}
        if "username" in data:
            username = str(data["username"]).strip()
            duplicate = AdminUser.query.filter(
                AdminUser.username == username, AdminUser.id != user.id
            ).first()
            if duplicate:
                return jsonify({"error": "Username already exists"}), 409
            user.username = username
        if "full_name" in data:
            user.full_name = str(data["full_name"]).strip()
        if "is_active" in data and user.id != g.admin_user.id:
            user.is_active = bool(data["is_active"])
        if "role_id" in data:
            role = db.session.get(AdminRole, int(data["role_id"]))
            if role is None:
                return jsonify({"error": "Role not found"}), 404
            user.role = role
        if data.get("password"):
            user.set_password(str(data["password"]))
        add_audit_log(
            g.admin_user,
            action="update",
            resource="users",
            resource_uuid=str(user.id),
            description=f"Updated admin user {user.username}",
        )
        db.session.commit()
        return jsonify(user.to_dict())

    @app.cli.command("init-db")
    def init_db_command():
        db.create_all()
        seed_defaults()
        print("KASMED MySQL database initialized")

    @app.cli.command("seed-defaults")
    def seed_defaults_command():
        seed_defaults()
        print("Default roles, admin, and settings seeded")

    @app.cli.command("seed-public-content")
    @click.option(
        "--update",
        "update_existing",
        is_flag=True,
        help="Overwrite matching records with the current static site content.",
    )
    def seed_public_content_command(update_existing):
        from backend.seeders.public_content import seed_public_content

        counts = seed_public_content(
            db=db,
            engagement_model=Engagement,
            solution_model=Solution,
            value_model=CoreValue,
            partner_model=Partner,
            gallery_model=GalleryImage,
            update_existing=update_existing,
        )
        print(
            "Public content seeded: "
            f"{counts['created']} created, "
            f"{counts['updated']} updated, "
            f"{counts['unchanged']} unchanged"
        )

    if os.getenv("AUTO_INIT_DB", "false").lower() == "true":
        with app.app_context():
            db.create_all()
            seed_defaults()

    return app


def admin_required(view):
    @wraps(view)
    def wrapped(*args, **kwargs):
        user_id = session.get("admin_user_id")
        user = db.session.get(AdminUser, user_id) if user_id else None
        if user is None or not user.is_active:
            session.clear()
            return jsonify({"error": "Authentication required"}), 401
        g.admin_user = user
        return view(*args, **kwargs)

    return wrapped


def resource_required(resource):
    def decorator(view):
        @wraps(view)
        def wrapped(*args, **kwargs):
            if not has_resource_access(g.admin_user, resource):
                return forbidden()
            return view(*args, **kwargs)

        return wrapped

    return decorator


def users_required(view):
    @wraps(view)
    def wrapped(*args, **kwargs):
        role = g.admin_user.role
        if not role or not (role.is_super_admin or role.can_manage_users):
            return forbidden()
        return view(*args, **kwargs)

    return wrapped


def roles_required(view):
    @wraps(view)
    def wrapped(*args, **kwargs):
        role = g.admin_user.role
        if not role or not (role.is_super_admin or role.can_manage_roles):
            return forbidden()
        return view(*args, **kwargs)

    return wrapped


def has_resource_access(user, resource):
    role = user.role if user else None
    return bool(role and (role.is_super_admin or resource in (role.allowed_resources or [])))


def forbidden():
    return jsonify({"error": "You do not have permission for this resource"}), 403


def pagination_args():
    page = max(request.args.get("page", 1, type=int) or 1, 1)
    per_page = request.args.get("per_page", 10, type=int) or 10
    return page, min(max(per_page, 5), 50)


def paginated_response(pagination):
    return {
        "items": [item.to_dict() for item in pagination.items],
        "pagination": {
            "page": pagination.page,
            "per_page": pagination.per_page,
            "pages": pagination.pages,
            "total": pagination.total,
            "has_next": pagination.has_next,
            "has_prev": pagination.has_prev,
        },
    }


def parse_date(value, start=True):
    if not value:
        return None
    try:
        parsed = datetime.strptime(value, "%Y-%m-%d").replace(tzinfo=timezone.utc)
        return parsed if start else parsed + timedelta(days=1) - timedelta(microseconds=1)
    except ValueError:
        return None


def item_display_name(item):
    return str(
        getattr(item, "name", None)
        or getattr(item, "title", None)
        or getattr(item, "subject", None)
        or getattr(item, "uuid", "record")
    )


def add_audit_log(
    user,
    action,
    resource,
    target=None,
    resource_uuid="",
    description="",
    details=None,
):
    target_uuid = resource_uuid or (
        str(getattr(target, "uuid", "") or getattr(target, "id", ""))
        if target is not None
        else ""
    )
    db.session.add(
        AdminAuditLog(
            admin_user_id=user.id if user else None,
            username=user.username if user else "",
            action=action,
            resource=resource,
            resource_uuid=target_uuid,
            description=description,
            details=details or {},
            ip_address=request.headers.get("X-Forwarded-For", request.remote_addr or "")[
                :80
            ],
            user_agent=request.headers.get("User-Agent", "")[:500],
        )
    )


def validate_required(data, fields):
    return [field for field in fields if not str(data.get(field, "")).strip()]


def validation_error(fields):
    return jsonify({"error": f"Missing required fields: {', '.join(fields)}"}), 400


def normalize_common_value(field, value):
    if field == "sort_order":
        return int(value or 0)
    if field == "featured":
        return bool(value)
    if field == "tags":
        if isinstance(value, list):
            return [str(tag).strip() for tag in value if str(tag).strip()]
        return [tag.strip() for tag in str(value).split(",") if tag.strip()]
    return value


def apply_content_data(resource, item, data):
    config = CONTENT_CONFIG[resource]
    for field in config["fields"]:
        if field in data:
            setattr(item, field, normalize_common_value(field, data[field]))
    if resource == "gallery" and item.title:
        item.alt_text = item.title
    if hasattr(item, "slug"):
        if item.id is None or "name" in data:
            item.slug = ensure_unique_slug(config["model"], item.name, item.id)


def apply_partner_data(item, data):
    for field in ["name", "logo", "website", "status", "sort_order"]:
        if field in data:
            setattr(item, field, normalize_common_value(field, data[field]))
    if item.id is None or "name" in data:
        item.slug = ensure_unique_slug(
            Partner,
            item.name,
            item.id,
            {"partner_type": item.partner_type},
        )


def apply_role_data(role, data):
    for field in [
        "description",
        "is_super_admin",
        "can_manage_users",
        "can_manage_roles",
    ]:
        if field in data:
            setattr(role, field, data[field])
    if "allowed_resources" in data:
        role.allowed_resources = [
            resource
            for resource in data["allowed_resources"]
            if resource in RESOURCE_NAMES
        ]


def active_items(model):
    items = (
        model.query.filter_by(status="active")
        .order_by(model.sort_order.asc(), model.id.asc())
        .all()
    )
    return [item.to_dict() for item in items]


def active_partners(partner_type):
    items = (
        Partner.query.filter_by(partner_type=partner_type, status="active")
        .order_by(Partner.sort_order.asc(), Partner.id.asc())
        .all()
    )
    return [item.to_dict() for item in items]


def get_or_create_settings():
    settings = db.session.get(SiteSettings, 1)
    if settings is None:
        settings = default_settings()
        db.session.add(settings)
        db.session.commit()
    return settings


def default_settings():
    address_lines = [
        os.getenv("VITE_OFFICE_ADDRESS_LINE1", "Yobek Commercial Center"),
        os.getenv("VITE_OFFICE_ADDRESS_LINE2", "Office A808/A809"),
        os.getenv("VITE_OFFICE_ADDRESS_LINE3", "Lideta Sub City, Wereda 07"),
        os.getenv("VITE_OFFICE_ADDRESS_LINE4", "Addis Ababa, Ethiopia"),
    ]
    return SiteSettings(
        id=1,
        company_name=os.getenv("VITE_SITE_NAME", "KASMED Trading PLC"),
        address_text="\n".join(line for line in address_lines if line),
        map_embed_url="https://www.openstreetmap.org/export/embed.html?bbox=38.72%2C9.00%2C38.76%2C9.03&layer=mapnik&marker=9.015%2C38.74",
        phone_primary=os.getenv("VITE_CONTACT_PHONE", "+251 954 085 010"),
        email_primary=os.getenv("VITE_CONTACT_EMAIL", "kasmed@gmail.com"),
        business_hours=[
            "Mon – Fri: 8:30 AM – 5:30 PM",
            "Sat: 9:00 AM – 1:00 PM",
        ],
        social_links={
            "facebook": "",
            "linkedin": "",
            "instagram": "",
            "x": "",
        },
        footer_description="Advancing healthcare across East Africa through world-class medical devices, innovative solutions, and dedicated service.",
    )


def extract_map_url(value):
    value = str(value or "").strip()
    match = re.search(r'src=["\']([^"\']+)["\']', value, re.IGNORECASE)
    return match.group(1) if match else value


def seed_defaults():
    roles = {
        "super_admin": {
            "description": "Full access to all content, users, and roles.",
            "allowed_resources": RESOURCE_NAMES,
            "is_super_admin": True,
            "can_manage_users": True,
            "can_manage_roles": True,
        },
        "content_manager": {
            "description": "Manages public content, gallery, and site settings.",
            "allowed_resources": [
                "engagements",
                "solutions",
                "values",
                "suppliers",
                "clients",
                "customers",
                "gallery",
                "settings",
            ],
        },
        "contact_manager": {
            "description": "Reads and responds to contact messages.",
            "allowed_resources": ["messages"],
        },
    }
    for name, values in roles.items():
        role = AdminRole.query.filter_by(name=name).first()
        if role is None:
            role = AdminRole(name=name, **values)
            db.session.add(role)

    db.session.flush()
    admin_username = os.getenv("ADMIN_DEFAULT_USERNAME", "admin")
    admin = AdminUser.query.filter_by(username=admin_username).first()
    if admin is None:
        admin = AdminUser(
            username=admin_username,
            full_name=os.getenv("ADMIN_DEFAULT_FULL_NAME", "KASMED Administrator"),
            role=AdminRole.query.filter_by(name="super_admin").first(),
            is_active=True,
        )
        admin.set_password(os.getenv("ADMIN_DEFAULT_PASSWORD", "admin123"))
        db.session.add(admin)

    if db.session.get(SiteSettings, 1) is None:
        db.session.add(default_settings())
    db.session.commit()


def build_database_uri():
    database_url = os.getenv("DATABASE_URL")
    if database_url:
        return database_url

    mysql_host = os.getenv("MYSQL_HOST", "localhost")
    mysql_port = os.getenv("MYSQL_PORT", "3306")
    mysql_database = os.getenv("MYSQL_DATABASE", "kasmed")
    mysql_user = quote_plus(os.getenv("MYSQL_USER", "root"))
    mysql_password = quote_plus(os.getenv("MYSQL_PASSWORD", ""))
    return (
        f"mysql+pymysql://{mysql_user}:{mysql_password}@"
        f"{mysql_host}:{mysql_port}/{mysql_database}?charset=utf8mb4"
    )


app = create_app()


if __name__ == "__main__":
    app.run(
        host=os.getenv("FLASK_HOST", "127.0.0.1"),
        port=int(os.getenv("FLASK_PORT", "5001")),
        debug=os.getenv("FLASK_DEBUG", "true").lower() == "true",
    )
