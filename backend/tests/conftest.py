import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine, event, StaticPool
from sqlalchemy.orm import sessionmaker

from wellverse.database import Base, get_db
from wellverse.main import app
from wellverse.seed import seed_database

engine = create_engine(
    "sqlite:///:memory:",
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)


@event.listens_for(engine, "connect")
def _set_sqlite_pragma(dbapi_conn, _):
    cursor = dbapi_conn.cursor()
    cursor.execute("PRAGMA foreign_keys=ON")
    cursor.close()


TestSession = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    db = TestSession()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db


@pytest.fixture(autouse=True)
def setup_db():
    Base.metadata.create_all(bind=engine)
    db = TestSession()
    seed_database(db)
    db.close()
    yield
    Base.metadata.drop_all(bind=engine)


@pytest.fixture
def client():
    return TestClient(app)


@pytest.fixture
def auth_client():
    """Client with a registered & authenticated user."""
    c = TestClient(app)
    res = c.post("/api/auth/register", json={
        "email": "test@test.com",
        "password": "test123",
        "full_name": "Test User",
    })
    token = res.json()["access_token"]
    c.headers["Authorization"] = f"Bearer {token}"
    return c


@pytest.fixture
def admin_client():
    """Client authenticated as admin."""
    c = TestClient(app)
    res = c.post("/api/auth/login", json={
        "email": "admin@wellverse.app",
        "password": "admin123",
    })
    token = res.json()["access_token"]
    c.headers["Authorization"] = f"Bearer {token}"
    return c
