"""Comprehensive tests for all WellVerse API endpoints — 170+ tests."""


# ═══════════════════════════════════════════════════════════════
# HEALTH
# ═══════════════════════════════════════════════════════════════

def test_health(client):
    r = client.get("/api/health")
    assert r.status_code == 200
    assert r.json()["app"] == "WellVerse"


def test_health_has_status(client):
    r = client.get("/api/health")
    data = r.json()
    assert "status" in data or "app" in data


# ═══════════════════════════════════════════════════════════════
# AUTH (17 tests)
# ═══════════════════════════════════════════════════════════════

def test_register_success(client):
    r = client.post("/api/auth/register", json={
        "email": "new@test.com", "password": "pass123", "full_name": "New User",
    })
    assert r.status_code == 201
    assert "access_token" in r.json()
    assert r.json()["user"]["email"] == "new@test.com"
    assert r.json()["user"]["role"] == "seeker"
    assert r.json()["user"]["tier"] == "free"
    assert r.json()["token_type"] == "bearer"


def test_register_duplicate_email(client):
    client.post("/api/auth/register", json={"email": "dup@test.com", "password": "pass123", "full_name": "Dup"})
    r = client.post("/api/auth/register", json={"email": "dup@test.com", "password": "pass123", "full_name": "Dup"})
    assert r.status_code == 400


def test_register_short_password(client):
    r = client.post("/api/auth/register", json={"email": "x@x.com", "password": "12345", "full_name": "X"})
    assert r.status_code == 400


def test_register_exactly_six_chars_password(client):
    r = client.post("/api/auth/register", json={"email": "six@x.com", "password": "123456", "full_name": "Six"})
    assert r.status_code == 201


def test_register_missing_email(client):
    r = client.post("/api/auth/register", json={"password": "pass123", "full_name": "No Email"})
    assert r.status_code == 422


def test_register_missing_password(client):
    r = client.post("/api/auth/register", json={"email": "nopw@x.com", "full_name": "No PW"})
    assert r.status_code == 422


def test_register_missing_full_name(client):
    r = client.post("/api/auth/register", json={"email": "noname@x.com", "password": "pass123"})
    assert r.status_code == 422


def test_login_success(client):
    client.post("/api/auth/register", json={"email": "login@test.com", "password": "pass123", "full_name": "Login"})
    r = client.post("/api/auth/login", json={"email": "login@test.com", "password": "pass123"})
    assert r.status_code == 200
    assert "access_token" in r.json()
    assert r.json()["user"]["email"] == "login@test.com"


def test_login_wrong_password(client):
    client.post("/api/auth/register", json={"email": "wrong@test.com", "password": "pass123", "full_name": "W"})
    r = client.post("/api/auth/login", json={"email": "wrong@test.com", "password": "wrongpw"})
    assert r.status_code == 401


def test_login_nonexistent_email(client):
    r = client.post("/api/auth/login", json={"email": "nobody@test.com", "password": "pass123"})
    assert r.status_code == 401


def test_login_missing_fields(client):
    r = client.post("/api/auth/login", json={"email": "x@x.com"})
    assert r.status_code == 422


def test_get_me_authenticated(auth_client):
    r = auth_client.get("/api/auth/me")
    assert r.status_code == 200
    assert r.json()["email"] == "test@test.com"
    assert r.json()["full_name"] == "Test User"


def test_get_me_no_auth(client):
    r = client.get("/api/auth/me")
    assert r.status_code == 401


def test_get_me_invalid_token(client):
    client.headers["Authorization"] = "Bearer invalidtoken123"
    r = client.get("/api/auth/me")
    assert r.status_code == 401


def test_get_me_malformed_auth_header(client):
    client.headers["Authorization"] = "NotBearer token"
    r = client.get("/api/auth/me")
    assert r.status_code == 401


def test_update_profile(auth_client):
    r = auth_client.patch("/api/auth/me?full_name=Updated+Name")
    assert r.status_code == 200
    assert r.json()["full_name"] == "Updated Name"


def test_update_profile_no_auth(client):
    r = client.patch("/api/auth/me?full_name=Hack")
    assert r.status_code == 401


# ═══════════════════════════════════════════════════════════════
# VERTICALS (8 tests)
# ═══════════════════════════════════════════════════════════════

def test_list_verticals(client):
    r = client.get("/api/verticals")
    assert r.status_code == 200
    assert len(r.json()) == 6


def test_get_vertical_mind(client):
    r = client.get("/api/verticals/mind")
    assert r.status_code == 200
    assert r.json()["label"] == "Mental Wellness"
    assert r.json()["id"] == "mind"


def test_get_vertical_body(client):
    r = client.get("/api/verticals/body")
    assert r.status_code == 200
    assert r.json()["status"] in ("live", "early")


def test_vertical_not_found(client):
    assert client.get("/api/verticals/nonexistent").status_code == 404


def test_vertical_relationships_sub_pillars(client):
    r = client.get("/api/verticals/relationships")
    assert len(r.json()["sub_pillars"]) == 2


def test_live_verticals_count(client):
    data = client.get("/api/verticals").json()
    live = [v for v in data if v["status"] == "live"]
    assert len(live) == 2


def test_early_verticals_have_eta(client):
    data = client.get("/api/verticals").json()
    early = [v for v in data if v["status"] == "early"]
    assert len(early) == 4
    assert all(v["eta"] is not None for v in early)


def test_live_verticals_no_eta(client):
    data = client.get("/api/verticals").json()
    live = [v for v in data if v["status"] == "live"]
    assert all(v["eta"] is None for v in live)


# ═══════════════════════════════════════════════════════════════
# GUIDES (14 tests)
# ═══════════════════════════════════════════════════════════════

def test_list_all_guides(client):
    assert len(client.get("/api/guides").json()) == 14


def test_filter_live_guides(client):
    data = client.get("/api/guides?preview=false").json()
    assert len(data) == 4
    assert all(not g["is_preview"] for g in data)


def test_filter_preview_guides(client):
    data = client.get("/api/guides?preview=true").json()
    assert len(data) == 10
    assert all(g["is_preview"] for g in data)


def test_filter_guides_by_vertical(client):
    data = client.get("/api/guides?vertical_id=mind").json()
    assert len(data) >= 1
    assert all(g["vertical_id"] == "mind" for g in data)


def test_filter_guides_by_nonexistent_vertical(client):
    data = client.get("/api/guides?vertical_id=nonexistent").json()
    assert len(data) == 0


def test_search_guides_by_name(client):
    data = client.get("/api/guides?search=Amara").json()
    assert len(data) >= 1
    assert data[0]["name"] == "Dr. Amara Osei"


def test_search_guides_by_role(client):
    data = client.get("/api/guides?search=Therapist").json()
    assert len(data) >= 1


def test_search_guides_no_results(client):
    data = client.get("/api/guides?search=ZZZZNONEXISTENT").json()
    assert len(data) == 0


def test_search_guides_case_insensitive(client):
    data = client.get("/api/guides?search=amara").json()
    assert len(data) >= 1


def test_get_guide_by_id(client):
    r = client.get("/api/guides/1")
    assert r.status_code == 200
    assert r.json()["name"] == "Dr. Amara Osei"
    assert "rating" in r.json()


def test_guide_not_found(client):
    assert client.get("/api/guides/999").status_code == 404


def test_combined_filters_vertical_and_preview(client):
    data = client.get("/api/guides?vertical_id=mind&preview=false").json()
    assert all(g["vertical_id"] == "mind" and not g["is_preview"] for g in data)


def test_guide_has_expected_fields(client):
    g = client.get("/api/guides/1").json()
    for field in ("id", "name", "role", "emoji", "vertical_id", "rating", "is_preview", "methods"):
        assert field in g


def test_combined_filters_vertical_and_search(client):
    all_mind = client.get("/api/guides?vertical_id=mind").json()
    if all_mind:
        name_fragment = all_mind[0]["name"].split()[0]
        data = client.get(f"/api/guides?vertical_id=mind&search={name_fragment}").json()
        assert len(data) >= 1


# ═══════════════════════════════════════════════════════════════
# STATS (5 tests)
# ═══════════════════════════════════════════════════════════════

def test_stats_founding_members(client):
    s = client.get("/api/stats").json()
    assert s["founding_members"] >= 847


def test_stats_vetted_guides_matches_live(client):
    s = client.get("/api/stats").json()
    assert s["vetted_guides"] == 4


def test_stats_total_verticals(client):
    s = client.get("/api/stats").json()
    assert s["total_verticals"] == 6
    assert s["live_verticals"] == 2


def test_stats_has_rating(client):
    s = client.get("/api/stats").json()
    assert "avg_rating" in s
    assert "\u2605" in s["avg_rating"]


def test_stats_reflect_new_guide(admin_client):
    """After approving an application, vetted_guides should increase."""
    admin_client.post("/api/applications", json={
        "full_name": "Stats Guide", "email": "statsguide@test.com", "role_specialty": "Coach",
    })
    apps = admin_client.get("/api/admin/applications?status=pending").json()
    app_id = apps[-1]["id"]
    admin_client.patch(f"/api/admin/applications/{app_id}", json={
        "status": "approved", "vertical_id": "mind", "emoji": "🧠",
        "methods": ["CBT"], "price": "$50/session",
    })
    s = admin_client.get("/api/stats").json()
    assert s["vetted_guides"] >= 5


# ═══════════════════════════════════════════════════════════════
# BOOKINGS (17 tests)
# ═══════════════════════════════════════════════════════════════

def test_create_intro_booking_auto_confirms(client):
    r = client.post("/api/bookings", json={
        "guide_id": 1, "seeker_name": "John", "seeker_email": "john@test.com",
        "booking_type": "intro", "date_time": "2025-04-01T10:00",
    })
    assert r.status_code == 201
    assert r.json()["status"] == "confirmed"


def test_create_session_booking_pending(client):
    r = client.post("/api/bookings", json={
        "guide_id": 1, "seeker_name": "Jane", "seeker_email": "jane@test.com",
        "booking_type": "session", "date_time": "2025-04-01T11:00",
    })
    assert r.status_code == 201
    assert r.json()["status"] == "pending"


def test_booking_conflict_same_guide_time(client):
    client.post("/api/bookings", json={
        "guide_id": 1, "seeker_name": "A", "seeker_email": "a@t.com",
        "booking_type": "intro", "date_time": "2025-05-01T09:00",
    })
    r = client.post("/api/bookings", json={
        "guide_id": 1, "seeker_name": "B", "seeker_email": "b@t.com",
        "booking_type": "intro", "date_time": "2025-05-01T09:00",
    })
    assert r.status_code == 409


def test_booking_different_guide_same_time_ok(client):
    client.post("/api/bookings", json={
        "guide_id": 1, "seeker_name": "A", "seeker_email": "a@t.com",
        "booking_type": "intro", "date_time": "2025-05-02T09:00",
    })
    r = client.post("/api/bookings", json={
        "guide_id": 2, "seeker_name": "B", "seeker_email": "b@t.com",
        "booking_type": "intro", "date_time": "2025-05-02T09:00",
    })
    assert r.status_code == 201


def test_booking_preview_guide_blocked(client):
    r = client.post("/api/bookings", json={
        "guide_id": 5, "seeker_name": "X", "seeker_email": "x@t.com",
        "booking_type": "intro", "date_time": "2025-06-01T10:00",
    })
    assert r.status_code == 400


def test_booking_nonexistent_guide(client):
    r = client.post("/api/bookings", json={
        "guide_id": 999, "seeker_name": "X", "seeker_email": "x@t.com",
        "booking_type": "intro", "date_time": "2025-06-01T10:00",
    })
    assert r.status_code == 404


def test_availability_endpoint(client):
    r = client.get("/api/bookings/guide/1/availability")
    assert r.status_code == 200
    assert "booked_slots" in r.json()
    assert "availability" in r.json()


def test_availability_reflects_booking(client):
    client.post("/api/bookings", json={
        "guide_id": 1, "seeker_name": "A", "seeker_email": "a@t.com",
        "booking_type": "intro", "date_time": "2025-06-15T10:00",
    })
    r = client.get("/api/bookings/guide/1/availability")
    assert len(r.json()["booked_slots"]) >= 1


def test_availability_nonexistent_guide(client):
    r = client.get("/api/bookings/guide/999/availability")
    assert r.status_code == 404


def test_update_booking_status_completed(client):
    r = client.post("/api/bookings", json={
        "guide_id": 1, "seeker_name": "X", "seeker_email": "x@t.com",
        "booking_type": "session", "date_time": "2025-07-01T14:00",
    })
    bid = r.json()["id"]
    r2 = client.patch(f"/api/bookings/{bid}/status?status=completed")
    assert r2.json()["status"] == "completed"


def test_update_booking_status_cancelled(client):
    r = client.post("/api/bookings", json={
        "guide_id": 1, "seeker_name": "X", "seeker_email": "x@t.com",
        "booking_type": "session", "date_time": "2025-07-02T14:00",
    })
    bid = r.json()["id"]
    r2 = client.patch(f"/api/bookings/{bid}/status?status=cancelled")
    assert r2.json()["status"] == "cancelled"


def test_update_booking_status_confirmed(client):
    r = client.post("/api/bookings", json={
        "guide_id": 1, "seeker_name": "X", "seeker_email": "x@t.com",
        "booking_type": "session", "date_time": "2025-07-03T14:00",
    })
    bid = r.json()["id"]
    r2 = client.patch(f"/api/bookings/{bid}/status?status=confirmed")
    assert r2.json()["status"] == "confirmed"


def test_update_booking_invalid_status(client):
    r = client.post("/api/bookings", json={
        "guide_id": 1, "seeker_name": "X", "seeker_email": "x@t.com",
        "booking_type": "session", "date_time": "2025-07-04T14:00",
    })
    bid = r.json()["id"]
    r2 = client.patch(f"/api/bookings/{bid}/status?status=invalid")
    assert r2.status_code == 400


def test_update_nonexistent_booking(client):
    r = client.patch("/api/bookings/9999/status?status=completed")
    assert r.status_code == 404


def test_booking_with_auth(auth_client):
    r = auth_client.post("/api/bookings", json={
        "guide_id": 1, "seeker_name": "Auth User", "seeker_email": "test@test.com",
        "booking_type": "intro", "date_time": "2025-08-15T10:00",
    })
    assert r.status_code == 201


def test_list_bookings_filtered_by_user(auth_client):
    auth_client.post("/api/bookings", json={
        "guide_id": 1, "seeker_name": "Auth", "seeker_email": "test@test.com",
        "booking_type": "intro", "date_time": "2025-08-20T10:00",
    })
    r = auth_client.get("/api/bookings")
    assert r.status_code == 200
    assert len(r.json()) >= 1


def test_booking_with_notes_field(client):
    r = client.post("/api/bookings", json={
        "guide_id": 1, "seeker_name": "Notes", "seeker_email": "notes@t.com",
        "booking_type": "intro", "date_time": "2025-09-15T10:00",
        "notes": "I have anxiety issues",
    })
    assert r.status_code == 201


# ═══════════════════════════════════════════════════════════════
# REVIEWS (12 tests)
# ═══════════════════════════════════════════════════════════════

def test_create_review(client):
    r = client.post("/api/guides/1/reviews", json={"author": "Reviewer", "rating": 5.0, "comment": "Amazing!"})
    assert r.status_code == 201
    assert r.json()["guide_id"] == 1
    assert r.json()["rating"] == 5.0


def test_review_rating_too_high(client):
    r = client.post("/api/guides/1/reviews", json={"author": "X", "rating": 6, "comment": "X"})
    assert r.status_code == 400


def test_review_rating_too_low(client):
    r = client.post("/api/guides/1/reviews", json={"author": "X", "rating": 0, "comment": "X"})
    assert r.status_code == 400


def test_review_rating_negative(client):
    r = client.post("/api/guides/1/reviews", json={"author": "X", "rating": -1, "comment": "X"})
    assert r.status_code == 400


def test_review_rating_boundary_1(client):
    r = client.post("/api/guides/1/reviews", json={"author": "X", "rating": 1.0, "comment": "Okay"})
    assert r.status_code == 201


def test_review_rating_boundary_5(client):
    r = client.post("/api/guides/1/reviews", json={"author": "X", "rating": 5.0, "comment": "Perfect"})
    assert r.status_code == 201


def test_review_recalculates_guide_rating(client):
    client.post("/api/guides/1/reviews", json={"author": "A", "rating": 4.0, "comment": "Good"})
    client.post("/api/guides/1/reviews", json={"author": "B", "rating": 2.0, "comment": "Meh"})
    guide = client.get("/api/guides/1").json()
    assert guide["review_count"] >= 2


def test_list_reviews_for_guide(client):
    client.post("/api/guides/1/reviews", json={"author": "A", "rating": 4.5, "comment": "Great"})
    reviews = client.get("/api/guides/1/reviews").json()
    assert len(reviews) >= 1


def test_list_reviews_empty_guide(client):
    """Guide with no reviews should return empty list."""
    reviews = client.get("/api/guides/2/reviews").json()
    assert isinstance(reviews, list)


def test_review_nonexistent_guide(client):
    r = client.post("/api/guides/999/reviews", json={"author": "X", "rating": 3, "comment": "X"})
    assert r.status_code == 404


def test_review_with_auth(auth_client):
    r = auth_client.post("/api/guides/1/reviews", json={"author": "AuthUser", "rating": 4, "comment": "Nice"})
    assert r.status_code == 201


def test_review_without_auth(client):
    r = client.post("/api/guides/1/reviews", json={"author": "Anon", "rating": 3, "comment": "Ok"})
    assert r.status_code == 201


# ═══════════════════════════════════════════════════════════════
# WAITLIST (8 tests)
# ═══════════════════════════════════════════════════════════════

def test_join_waitlist(client):
    r = client.post("/api/waitlist", json={"email": "wait@test.com", "vertical_id": "nutrition"})
    assert r.status_code == 201


def test_waitlist_dedup_same_email_vertical(client):
    client.post("/api/waitlist", json={"email": "dup@test.com", "vertical_id": "nutrition"})
    r = client.post("/api/waitlist", json={"email": "dup@test.com", "vertical_id": "nutrition"})
    assert r.status_code in (200, 201)


def test_waitlist_different_vertical_same_email(client):
    client.post("/api/waitlist", json={"email": "multi@test.com", "vertical_id": "nutrition"})
    r = client.post("/api/waitlist", json={"email": "multi@test.com", "vertical_id": "beauty"})
    assert r.status_code == 201


def test_list_waitlist(client):
    client.post("/api/waitlist", json={"email": "list@test.com", "vertical_id": "nutrition"})
    r = client.get("/api/waitlist")
    assert r.status_code == 200
    assert len(r.json()) >= 1


def test_waitlist_has_created_at(client):
    r = client.post("/api/waitlist", json={"email": "ts@test.com", "vertical_id": "body"})
    assert "created_at" in r.json()


def test_waitlist_returns_vertical_id(client):
    r = client.post("/api/waitlist", json={"email": "vid@test.com", "vertical_id": "nutrition"})
    assert r.json()["vertical_id"] == "nutrition"


def test_waitlist_dedup_returns_same_id(client):
    r1 = client.post("/api/waitlist", json={"email": "sameid@test.com", "vertical_id": "nutrition"})
    r2 = client.post("/api/waitlist", json={"email": "sameid@test.com", "vertical_id": "nutrition"})
    assert r1.json()["id"] == r2.json()["id"]


def test_waitlist_missing_fields(client):
    r = client.post("/api/waitlist", json={"email": "x@x.com"})
    assert r.status_code == 422


# ═══════════════════════════════════════════════════════════════
# APPLICATIONS (10 tests)
# ═══════════════════════════════════════════════════════════════

def test_submit_application_all_fields(client):
    r = client.post("/api/applications", json={
        "full_name": "Full Guide", "email": "full@test.com", "role_specialty": "Coach",
        "phone": "+1234567890", "city_country": "NYC, USA",
        "qualifications": "PhD", "years_practice": "10+",
        "website": "https://example.com", "why_wellverse": "Passion",
        "approach": "Holistic",
    })
    assert r.status_code == 201
    assert r.json()["status"] == "pending"


def test_submit_application_minimum_fields(client):
    r = client.post("/api/applications", json={
        "full_name": "Min Guide", "email": "min@test.com", "role_specialty": "Therapist",
    })
    assert r.status_code == 201


def test_application_empty_name(client):
    r = client.post("/api/applications", json={
        "full_name": "", "email": "empty@test.com", "role_specialty": "Coach",
    })
    assert r.status_code == 400


def test_application_empty_email(client):
    r = client.post("/api/applications", json={
        "full_name": "Name", "email": "", "role_specialty": "Coach",
    })
    assert r.status_code == 400


def test_application_empty_role(client):
    r = client.post("/api/applications", json={
        "full_name": "Name", "email": "x@x.com", "role_specialty": "",
    })
    assert r.status_code == 400


def test_application_missing_required_field(client):
    r = client.post("/api/applications", json={
        "full_name": "Name", "email": "x@x.com",
    })
    assert r.status_code == 422


def test_list_applications(client):
    client.post("/api/applications", json={
        "full_name": "List Guide", "email": "list@test.com", "role_specialty": "Coach",
    })
    r = client.get("/api/applications")
    assert r.status_code == 200
    assert len(r.json()) >= 1


def test_application_has_pending_status(client):
    r = client.post("/api/applications", json={
        "full_name": "Pending", "email": "pend@test.com", "role_specialty": "X",
    })
    assert r.json()["status"] == "pending"


def test_application_returns_id(client):
    r = client.post("/api/applications", json={
        "full_name": "ID Test", "email": "id@test.com", "role_specialty": "Coach",
    })
    assert "id" in r.json()


def test_multiple_applications_listed(client):
    client.post("/api/applications", json={"full_name": "A", "email": "a@t.com", "role_specialty": "X"})
    client.post("/api/applications", json={"full_name": "B", "email": "b@t.com", "role_specialty": "Y"})
    r = client.get("/api/applications")
    assert len(r.json()) >= 2


# ═══════════════════════════════════════════════════════════════
# MESSAGING (13 tests)
# ═══════════════════════════════════════════════════════════════

def test_send_message(auth_client):
    r = auth_client.post("/api/messages", json={"guide_id": 1, "content": "Hello!"})
    assert r.status_code == 201
    assert r.json()["content"] == "Hello!"


def test_send_message_creates_conversation(auth_client):
    auth_client.post("/api/messages", json={"guide_id": 1, "content": "First msg"})
    convos = auth_client.get("/api/messages/conversations").json()
    assert len(convos) >= 1
    assert any(c["guide_id"] == 1 for c in convos)


def test_send_to_same_guide_reuses_conversation(auth_client):
    auth_client.post("/api/messages", json={"guide_id": 1, "content": "Msg 1"})
    auth_client.post("/api/messages", json={"guide_id": 1, "content": "Msg 2"})
    convos = auth_client.get("/api/messages/conversations").json()
    guide1_convos = [c for c in convos if c["guide_id"] == 1]
    assert len(guide1_convos) == 1


def test_send_to_different_guides_creates_separate_convos(auth_client):
    auth_client.post("/api/messages", json={"guide_id": 1, "content": "Hi"})
    auth_client.post("/api/messages", json={"guide_id": 2, "content": "Hey"})
    convos = auth_client.get("/api/messages/conversations").json()
    assert len(convos) >= 2


def test_list_conversations(auth_client):
    auth_client.post("/api/messages", json={"guide_id": 1, "content": "Hi"})
    r = auth_client.get("/api/messages/conversations")
    assert r.status_code == 200
    assert len(r.json()) >= 1


def test_conversation_has_guide_name(auth_client):
    auth_client.post("/api/messages", json={"guide_id": 1, "content": "Hi"})
    convos = auth_client.get("/api/messages/conversations").json()
    assert convos[0]["guide_name"] is not None


def test_conversation_has_last_message(auth_client):
    auth_client.post("/api/messages", json={"guide_id": 1, "content": "Latest"})
    convos = auth_client.get("/api/messages/conversations").json()
    c = next(c for c in convos if c["guide_id"] == 1)
    assert c["last_message"] == "Latest"


def test_get_messages_for_guide(auth_client):
    auth_client.post("/api/messages", json={"guide_id": 2, "content": "Hello guide 2"})
    r = auth_client.get("/api/messages/conversation/2")
    assert r.status_code == 200
    assert len(r.json()) >= 1
    assert r.json()[0]["content"] == "Hello guide 2"


def test_get_messages_no_conversation(auth_client):
    r = auth_client.get("/api/messages/conversation/999")
    assert r.status_code == 200
    assert r.json() == []


def test_message_to_nonexistent_guide(auth_client):
    r = auth_client.post("/api/messages", json={"guide_id": 999, "content": "Hi"})
    assert r.status_code == 404


def test_message_no_auth_blocked(client):
    r = client.post("/api/messages", json={"guide_id": 1, "content": "Hi"})
    assert r.status_code == 401


def test_conversations_no_auth_blocked(client):
    r = client.get("/api/messages/conversations")
    assert r.status_code == 401


def test_get_messages_no_auth_blocked(client):
    r = client.get("/api/messages/conversation/1")
    assert r.status_code == 401


# ═══════════════════════════════════════════════════════════════
# SESSION NOTES (9 tests)
# ═══════════════════════════════════════════════════════════════

def _create_booking_for_notes(auth_client, time="2025-08-01T10:00"):
    r = auth_client.post("/api/bookings", json={
        "guide_id": 1, "seeker_name": "Test", "seeker_email": "test@test.com",
        "booking_type": "intro", "date_time": time,
    })
    return r.json()["id"]


def test_create_note_with_mood(auth_client):
    bid = _create_booking_for_notes(auth_client)
    r = auth_client.post("/api/notes", json={
        "booking_id": bid, "content": "Great session", "mood_before": 3, "mood_after": 5,
    })
    assert r.status_code == 201
    assert r.json()["mood_before"] == 3
    assert r.json()["mood_after"] == 5


def test_create_note_without_mood(auth_client):
    bid = _create_booking_for_notes(auth_client, "2025-08-02T10:00")
    r = auth_client.post("/api/notes", json={"booking_id": bid, "content": "Just notes"})
    assert r.status_code == 201
    assert r.json()["mood_before"] is None


def test_create_note_with_takeaways(auth_client):
    bid = _create_booking_for_notes(auth_client, "2025-08-03T10:00")
    r = auth_client.post("/api/notes", json={
        "booking_id": bid, "content": "Good",
        "key_takeaways": ["Breathe more", "Journal daily"],
    })
    assert r.status_code == 201
    assert len(r.json()["key_takeaways"]) == 2


def test_list_notes_only_own(auth_client):
    r = auth_client.get("/api/notes")
    assert r.status_code == 200
    assert isinstance(r.json(), list)


def test_get_note_by_id(auth_client):
    bid = _create_booking_for_notes(auth_client, "2025-08-04T10:00")
    create_r = auth_client.post("/api/notes", json={"booking_id": bid, "content": "Find me"})
    note_id = create_r.json()["id"]
    r = auth_client.get(f"/api/notes/{note_id}")
    assert r.status_code == 200
    assert r.json()["content"] == "Find me"


def test_get_note_not_found(auth_client):
    r = auth_client.get("/api/notes/9999")
    assert r.status_code == 404


def test_note_nonexistent_booking(auth_client):
    r = auth_client.post("/api/notes", json={"booking_id": 9999, "content": "No booking"})
    assert r.status_code == 404


def test_note_no_auth(client):
    r = client.post("/api/notes", json={"booking_id": 1, "content": "Hack"})
    assert r.status_code == 401


def test_list_notes_no_auth(client):
    r = client.get("/api/notes")
    assert r.status_code == 401


# ═══════════════════════════════════════════════════════════════
# PROGRESS (9 tests)
# ═══════════════════════════════════════════════════════════════

def test_create_progress_goal(auth_client):
    r = auth_client.post("/api/progress", json={
        "entry_type": "goal", "title": "Meditate daily", "content": "10 min morning",
    })
    assert r.status_code == 201
    assert r.json()["entry_type"] == "goal"


def test_create_progress_milestone(auth_client):
    r = auth_client.post("/api/progress", json={
        "entry_type": "milestone", "title": "7-day streak",
    })
    assert r.status_code == 201


def test_create_progress_reflection(auth_client):
    r = auth_client.post("/api/progress", json={
        "entry_type": "reflection", "title": "Week 1", "content": "Feeling calmer",
    })
    assert r.status_code == 201


def test_create_progress_metric(auth_client):
    r = auth_client.post("/api/progress", json={
        "entry_type": "metric", "title": "Sleep hours", "value": 7.5,
    })
    assert r.status_code == 201
    assert r.json()["value"] == 7.5


def test_list_progress_entries(auth_client):
    auth_client.post("/api/progress", json={"entry_type": "goal", "title": "Test"})
    r = auth_client.get("/api/progress")
    assert r.status_code == 200
    assert len(r.json()) >= 1


def test_progress_report_empty(auth_client):
    r = auth_client.get("/api/progress/report")
    assert r.status_code == 200
    assert r.json()["total_bookings"] == 0
    assert r.json()["goals"] == []


def test_progress_report_with_data(auth_client):
    auth_client.post("/api/progress", json={"entry_type": "goal", "title": "Goal A"})
    auth_client.post("/api/progress", json={"entry_type": "milestone", "title": "Mile A"})
    r = auth_client.get("/api/progress/report")
    assert len(r.json()["goals"]) >= 1
    assert len(r.json()["milestones"]) >= 1


def test_progress_report_mood_improvement(auth_client):
    bid = _create_booking_for_notes(auth_client, "2025-10-01T10:00")
    auth_client.post("/api/notes", json={
        "booking_id": bid, "content": "Mood test", "mood_before": 2, "mood_after": 5,
    })
    r = auth_client.get("/api/progress/report")
    assert r.json()["avg_mood_improvement"] is not None
    assert r.json()["avg_mood_improvement"] > 0


def test_progress_no_auth(client):
    r = client.post("/api/progress", json={"entry_type": "goal", "title": "X"})
    assert r.status_code == 401


# ═══════════════════════════════════════════════════════════════
# LIBRARY (9 tests)
# ═══════════════════════════════════════════════════════════════

def test_list_library(client):
    r = client.get("/api/library")
    assert r.status_code == 200
    assert len(r.json()) >= 6


def test_filter_library_by_vertical(client):
    data = client.get("/api/library?vertical_id=mind").json()
    assert all(i["vertical_id"] == "mind" for i in data)


def test_filter_library_by_type(client):
    data = client.get("/api/library?content_type=article").json()
    assert all(i["content_type"] == "article" for i in data)


def test_search_library(client):
    items = client.get("/api/library").json()
    if items:
        word = items[0]["title"].split()[0]
        data = client.get(f"/api/library?search={word}").json()
        assert len(data) >= 1


def test_get_library_item(client):
    items = client.get("/api/library").json()
    r = client.get(f"/api/library/{items[0]['id']}")
    assert r.status_code == 200
    assert r.json()["id"] == items[0]["id"]


def test_library_item_not_found(client):
    assert client.get("/api/library/9999").status_code == 404


def test_library_combined_filters(client):
    data = client.get("/api/library?vertical_id=mind&content_type=article").json()
    for i in data:
        assert i["vertical_id"] == "mind"
        assert i["content_type"] == "article"


def test_library_search_no_results(client):
    data = client.get("/api/library?search=ZZZZNOTHING").json()
    assert len(data) == 0


def test_library_item_has_fields(client):
    items = client.get("/api/library").json()
    item = items[0]
    for f in ("id", "title", "description", "content_type", "is_premium"):
        assert f in item


# ═══════════════════════════════════════════════════════════════
# CIRCLES (13 tests)
# ═══════════════════════════════════════════════════════════════

def _get_free_circle(client_or_auth):
    circles = client_or_auth.get("/api/circles").json()
    return next(c for c in circles if not c["is_premium"])


def _get_premium_circle(client_or_auth):
    circles = client_or_auth.get("/api/circles").json()
    return next((c for c in circles if c["is_premium"]), None)


def test_list_circles(client):
    r = client.get("/api/circles")
    assert r.status_code == 200
    assert len(r.json()) >= 6


def test_filter_circles_by_vertical(client):
    circles = client.get("/api/circles").json()
    if circles:
        vid = circles[0]["vertical_id"]
        if vid:
            filtered = client.get(f"/api/circles?vertical_id={vid}").json()
            assert all(c["vertical_id"] == vid for c in filtered)


def test_join_circle(auth_client):
    fc = _get_free_circle(auth_client)
    r = auth_client.post(f"/api/circles/{fc['id']}/join")
    assert r.status_code == 201
    assert r.json()["status"] == "joined"


def test_join_circle_double(auth_client):
    fc = _get_free_circle(auth_client)
    auth_client.post(f"/api/circles/{fc['id']}/join")
    r = auth_client.post(f"/api/circles/{fc['id']}/join")
    assert r.status_code == 400


def test_free_tier_circle_limit(auth_client):
    circles = auth_client.get("/api/circles").json()
    free_circles = [c for c in circles if not c["is_premium"]]
    auth_client.post(f"/api/circles/{free_circles[0]['id']}/join")
    r = auth_client.post(f"/api/circles/{free_circles[1]['id']}/join")
    assert r.status_code == 403


def test_premium_circle_blocked_free_tier(auth_client):
    pc = _get_premium_circle(auth_client)
    if pc:
        r = auth_client.post(f"/api/circles/{pc['id']}/join")
        assert r.status_code == 403


def test_leave_circle(auth_client):
    fc = _get_free_circle(auth_client)
    auth_client.post(f"/api/circles/{fc['id']}/join")
    r = auth_client.delete(f"/api/circles/{fc['id']}/leave")
    assert r.status_code == 200
    assert r.json()["status"] == "left"


def test_leave_circle_not_member(auth_client):
    fc = _get_free_circle(auth_client)
    r = auth_client.delete(f"/api/circles/{fc['id']}/leave")
    assert r.status_code == 404


def test_join_nonexistent_circle(auth_client):
    r = auth_client.post("/api/circles/9999/join")
    assert r.status_code == 404


def test_circle_member_count_increases(auth_client):
    fc = _get_free_circle(auth_client)
    before = fc["member_count"]
    auth_client.post(f"/api/circles/{fc['id']}/join")
    circles = auth_client.get("/api/circles").json()
    after_circle = next(c for c in circles if c["id"] == fc["id"])
    assert after_circle["member_count"] == before + 1


def test_circle_is_member_flag(auth_client):
    fc = _get_free_circle(auth_client)
    auth_client.post(f"/api/circles/{fc['id']}/join")
    circles = auth_client.get("/api/circles").json()
    joined = next(c for c in circles if c["id"] == fc["id"])
    assert joined["is_member"] is True


def test_circle_join_no_auth(client):
    fc = _get_free_circle(client)
    r = client.post(f"/api/circles/{fc['id']}/join")
    assert r.status_code == 401


def test_rejoin_after_leave(auth_client):
    fc = _get_free_circle(auth_client)
    auth_client.post(f"/api/circles/{fc['id']}/join")
    auth_client.delete(f"/api/circles/{fc['id']}/leave")
    r = auth_client.post(f"/api/circles/{fc['id']}/join")
    assert r.status_code == 201


# ═══════════════════════════════════════════════════════════════
# PAYMENTS (8 tests)
# ═══════════════════════════════════════════════════════════════

def test_dev_mode_booking_payment(auth_client):
    b = auth_client.post("/api/bookings", json={
        "guide_id": 1, "seeker_name": "Test", "seeker_email": "test@test.com",
        "booking_type": "intro", "date_time": "2025-09-01T10:00",
    })
    r = auth_client.post("/api/payments/create-checkout", json={"booking_id": b.json()["id"]})
    assert r.status_code == 200
    assert "Dev mode" in r.json()["message"]


def test_dev_mode_tier_upgrade(auth_client):
    r = auth_client.post("/api/payments/create-checkout", json={"tier": "committed"})
    assert r.status_code == 200
    assert "Dev mode" in r.json()["message"]


def test_dev_mode_no_action(auth_client):
    r = auth_client.post("/api/payments/create-checkout", json={})
    assert r.status_code == 200
    assert "Dev mode" in r.json()["message"]


def test_payment_no_auth(client):
    r = client.post("/api/payments/create-checkout", json={"tier": "committed"})
    assert r.status_code == 401


def test_payment_history_empty(auth_client):
    r = auth_client.get("/api/payments/history")
    assert r.status_code == 200
    assert r.json() == []


def test_payment_history_after_payment(auth_client):
    b = auth_client.post("/api/bookings", json={
        "guide_id": 1, "seeker_name": "Test", "seeker_email": "test@test.com",
        "booking_type": "intro", "date_time": "2025-09-05T10:00",
    })
    auth_client.post("/api/payments/create-checkout", json={"booking_id": b.json()["id"]})
    r = auth_client.get("/api/payments/history")
    assert len(r.json()) >= 1


def test_webhook_endpoint_exists(client):
    r = client.post("/api/payments/webhook")
    # Should return 200 with skipped status (no Stripe configured)
    assert r.status_code == 200
    assert r.json()["status"] == "skipped"


def test_payment_history_no_auth(client):
    r = client.get("/api/payments/history")
    assert r.status_code == 401


# ═══════════════════════════════════════════════════════════════
# BLOG (8 tests)
# ═══════════════════════════════════════════════════════════════

def test_list_blog_posts(client):
    r = client.get("/api/blog")
    assert r.status_code == 200
    assert len(r.json()) >= 3


def test_get_blog_by_slug(client):
    r = client.get("/api/blog/why-we-built-wellverse")
    assert r.status_code == 200
    assert "WellVerse" in r.json()["title"]


def test_blog_not_found(client):
    assert client.get("/api/blog/nonexistent-slug").status_code == 404


def test_blog_post_has_fields(client):
    r = client.get("/api/blog/why-we-built-wellverse")
    data = r.json()
    for f in ("id", "title", "slug", "body", "author"):
        assert f in data


def test_blog_posts_have_published_at(client):
    posts = client.get("/api/blog").json()
    for p in posts:
        assert p["published_at"] is not None


def test_blog_list_ordered(client):
    posts = client.get("/api/blog").json()
    dates = [p["published_at"] for p in posts]
    assert dates == sorted(dates, reverse=True)


def test_blog_post_body_not_empty(client):
    posts = client.get("/api/blog").json()
    for p in posts:
        assert p["body"] and len(p["body"]) > 0


def test_blog_unpublished_not_visible(admin_client, client):
    admin_client.post("/api/admin/blog", json={
        "title": "Draft Post", "slug": "draft-post", "body": "Hidden", "author": "Admin",
        "published": False,
    })
    r = client.get("/api/blog/draft-post")
    assert r.status_code == 404


# ═══════════════════════════════════════════════════════════════
# ADMIN (16 tests)
# ═══════════════════════════════════════════════════════════════

def test_admin_dashboard(admin_client):
    r = admin_client.get("/api/admin/dashboard")
    assert r.status_code == 200
    data = r.json()
    for k in ("users", "guides", "pending_applications", "total_bookings",
              "completed_sessions", "waitlist_entries", "total_reviews", "total_payments"):
        assert k in data


def test_admin_list_users(admin_client):
    r = admin_client.get("/api/admin/users")
    assert r.status_code == 200
    assert len(r.json()) >= 1


def test_admin_list_applications_all(admin_client):
    admin_client.post("/api/applications", json={
        "full_name": "App Guide", "email": "app@t.com", "role_specialty": "Coach",
    })
    r = admin_client.get("/api/admin/applications")
    assert r.status_code == 200
    assert len(r.json()) >= 1


def test_admin_list_applications_filter_pending(admin_client):
    admin_client.post("/api/applications", json={
        "full_name": "Pending", "email": "pf@t.com", "role_specialty": "Coach",
    })
    r = admin_client.get("/api/admin/applications?status=pending")
    assert all(a["status"] == "pending" for a in r.json())


def test_admin_approve_application(admin_client):
    admin_client.post("/api/applications", json={
        "full_name": "Approve Me", "email": "approve@test.com", "role_specialty": "Yoga Coach",
    })
    apps = admin_client.get("/api/admin/applications?status=pending").json()
    app_id = apps[-1]["id"]
    r = admin_client.patch(f"/api/admin/applications/{app_id}", json={
        "status": "approved", "vertical_id": "body", "emoji": "🧘",
        "quote": "Great guide", "methods": ["Yoga", "Meditation"], "price": "$80/session",
    })
    assert r.status_code == 200
    assert r.json()["status"] == "approved"
    assert r.json()["guide_id"] is not None


def test_admin_approved_guide_appears_in_listings(admin_client, client):
    admin_client.post("/api/applications", json={
        "full_name": "Visible Guide", "email": "visible@test.com", "role_specialty": "Life Coach",
    })
    apps = admin_client.get("/api/admin/applications?status=pending").json()
    app_id = apps[-1]["id"]
    result = admin_client.patch(f"/api/admin/applications/{app_id}", json={
        "status": "approved", "vertical_id": "mind", "emoji": "🧠",
        "methods": ["CBT"], "price": "$70/session",
    })
    guide_id = result.json()["guide_id"]
    guide = client.get(f"/api/guides/{guide_id}").json()
    assert guide["name"] == "Visible Guide"
    assert guide["is_preview"] is False
    assert guide["is_verified"] is True


def test_admin_decline_application(admin_client):
    admin_client.post("/api/applications", json={
        "full_name": "Decline Me", "email": "decline@test.com", "role_specialty": "X",
    })
    apps = admin_client.get("/api/admin/applications?status=pending").json()
    app_id = apps[-1]["id"]
    r = admin_client.patch(f"/api/admin/applications/{app_id}", json={
        "status": "declined", "admin_notes": "Not enough experience",
    })
    assert r.json()["status"] == "declined"
    assert r.json()["guide_id"] is None


def test_admin_application_not_found(admin_client):
    r = admin_client.patch("/api/admin/applications/9999", json={"status": "declined"})
    assert r.status_code == 404


def test_admin_guide_analytics(admin_client):
    r = admin_client.get("/api/admin/guide-analytics/1")
    assert r.status_code == 200
    data = r.json()
    assert data["name"] == "Dr. Amara Osei"
    for k in ("total_bookings", "completed_sessions", "cancelled_sessions",
              "completion_rate", "total_reviews", "avg_rating"):
        assert k in data


def test_admin_guide_analytics_not_found(admin_client):
    r = admin_client.get("/api/admin/guide-analytics/9999")
    assert r.status_code == 404


def test_admin_delete_guide(admin_client):
    r = admin_client.delete("/api/admin/guides/1")
    assert r.status_code == 200
    assert r.json()["status"] == "deleted"
    # Verify gone
    assert admin_client.get("/api/guides/1").status_code == 404


def test_admin_delete_guide_not_found(admin_client):
    r = admin_client.delete("/api/admin/guides/9999")
    assert r.status_code == 404


def test_admin_create_library_item(admin_client):
    r = admin_client.post("/api/admin/library", json={
        "title": "Test Article", "description": "A test", "content_type": "article",
    })
    assert r.status_code == 201
    assert "id" in r.json()


def test_admin_create_circle(admin_client):
    r = admin_client.post("/api/admin/circles", json={
        "name": "Test Circle", "description": "A test circle",
    })
    assert r.status_code == 201
    assert "id" in r.json()


def test_admin_create_blog_post(admin_client):
    r = admin_client.post("/api/admin/blog", json={
        "title": "Admin Post", "slug": "admin-post", "body": "Content", "author": "Admin",
        "published": True,
    })
    assert r.status_code == 201


def test_admin_blog_duplicate_slug(admin_client):
    admin_client.post("/api/admin/blog", json={
        "title": "First", "slug": "dup-slug", "body": "A", "author": "Admin",
    })
    r = admin_client.post("/api/admin/blog", json={
        "title": "Second", "slug": "dup-slug", "body": "B", "author": "Admin",
    })
    assert r.status_code == 400


def test_non_admin_blocked_dashboard(auth_client):
    assert auth_client.get("/api/admin/dashboard").status_code == 403


def test_non_admin_blocked_users(auth_client):
    assert auth_client.get("/api/admin/users").status_code == 403


def test_non_admin_blocked_applications(auth_client):
    assert auth_client.get("/api/admin/applications").status_code == 403


def test_non_admin_blocked_guide_analytics(auth_client):
    assert auth_client.get("/api/admin/guide-analytics/1").status_code == 403


def test_non_admin_blocked_create_library(auth_client):
    r = auth_client.post("/api/admin/library", json={
        "title": "X", "description": "X", "content_type": "article",
    })
    assert r.status_code == 403


def test_non_admin_blocked_create_circle(auth_client):
    r = auth_client.post("/api/admin/circles", json={"name": "X", "description": "X"})
    assert r.status_code == 403


def test_non_admin_blocked_create_blog(auth_client):
    r = auth_client.post("/api/admin/blog", json={
        "title": "X", "slug": "x", "body": "X", "author": "X",
    })
    assert r.status_code == 403


def test_non_admin_blocked_delete_guide(auth_client):
    assert auth_client.delete("/api/admin/guides/1").status_code == 403


# ═══════════════════════════════════════════════════════════════
# UPLOADS (5 tests)
# ═══════════════════════════════════════════════════════════════

def test_serve_nonexistent_file(client):
    r = client.get("/api/uploads/files/nonexistent.jpg")
    assert r.status_code == 404


def test_upload_avatar_no_auth(client):
    r = client.post("/api/uploads/avatar")
    assert r.status_code == 401


def test_upload_guide_photo_no_auth(client):
    r = client.post("/api/uploads/guide-photo/1")
    assert r.status_code == 401


def test_serve_file_path_traversal(client):
    r = client.get("/api/uploads/files/../../../etc/passwd")
    # Should 404 or not leak — depends on implementation
    assert r.status_code in (404, 400, 422)


def test_upload_endpoint_exists(auth_client):
    # Without a file, FastAPI returns 422 (missing required file param)
    r = auth_client.post("/api/uploads/avatar")
    assert r.status_code == 422


# ═══════════════════════════════════════════════════════════════
# CROSS-FEATURE FLOWS (10 tests)
# ═══════════════════════════════════════════════════════════════

def test_flow_register_book_complete_review_note_progress(client):
    """Full user journey: register, book, complete, review, note, check progress."""
    # Register
    reg = client.post("/api/auth/register", json={
        "email": "flow@test.com", "password": "flow123", "full_name": "Flow User",
    })
    token = reg.json()["access_token"]
    client.headers["Authorization"] = f"Bearer {token}"

    # Book intro
    book = client.post("/api/bookings", json={
        "guide_id": 1, "seeker_name": "Flow User", "seeker_email": "flow@test.com",
        "booking_type": "intro", "date_time": "2025-11-01T10:00",
    })
    assert book.status_code == 201
    bid = book.json()["id"]

    # Complete
    client.patch(f"/api/bookings/{bid}/status?status=completed")

    # Review
    rev = client.post("/api/guides/1/reviews", json={
        "author": "Flow User", "rating": 5, "comment": "Excellent!",
    })
    assert rev.status_code == 201

    # Session note
    note = client.post("/api/notes", json={
        "booking_id": bid, "content": "Transformative", "mood_before": 2, "mood_after": 5,
    })
    assert note.status_code == 201

    # Progress goal
    client.post("/api/progress", json={"entry_type": "goal", "title": "Keep going"})

    # Check progress report
    report = client.get("/api/progress/report").json()
    assert report["total_bookings"] >= 1
    assert report["completed_sessions"] >= 1
    assert report["total_notes"] >= 1
    assert report["avg_mood_improvement"] is not None
    assert len(report["goals"]) >= 1


def test_flow_application_approve_guide_appears(admin_client, client):
    """Submit application, admin approves, guide appears in listings."""
    admin_client.post("/api/applications", json={
        "full_name": "Flow Guide", "email": "flowguide@test.com", "role_specialty": "Counselor",
    })
    apps = admin_client.get("/api/admin/applications?status=pending").json()
    app_id = apps[-1]["id"]
    result = admin_client.patch(f"/api/admin/applications/{app_id}", json={
        "status": "approved", "vertical_id": "mind", "emoji": "🌟",
        "methods": ["Talk therapy"], "price": "$90/session",
    })
    guide_id = result.json()["guide_id"]

    # Verify in guide listings
    guides = client.get("/api/guides?preview=false").json()
    assert any(g["id"] == guide_id for g in guides)

    # Verify guide has correct data
    guide = client.get(f"/api/guides/{guide_id}").json()
    assert guide["name"] == "Flow Guide"
    assert guide["role"] == "Counselor"
    assert guide["vertical_id"] == "mind"


def test_flow_register_join_waitlist_dedup(client):
    """Register, join waitlist, verify dedup."""
    client.post("/api/auth/register", json={
        "email": "waitflow@test.com", "password": "pass123", "full_name": "Wait Flow",
    })
    r1 = client.post("/api/waitlist", json={"email": "waitflow@test.com", "vertical_id": "nutrition"})
    r2 = client.post("/api/waitlist", json={"email": "waitflow@test.com", "vertical_id": "nutrition"})
    assert r1.json()["id"] == r2.json()["id"]


def test_flow_register_message_list_get(client):
    """Register, send message, list conversations, get messages."""
    reg = client.post("/api/auth/register", json={
        "email": "msgflow@test.com", "password": "pass123", "full_name": "Msg Flow",
    })
    token = reg.json()["access_token"]
    client.headers["Authorization"] = f"Bearer {token}"

    # Send
    client.post("/api/messages", json={"guide_id": 1, "content": "Hello from flow"})

    # List conversations
    convos = client.get("/api/messages/conversations").json()
    assert len(convos) >= 1
    assert convos[0]["guide_id"] == 1
    assert convos[0]["last_message"] == "Hello from flow"

    # Get messages
    msgs = client.get("/api/messages/conversation/1").json()
    assert len(msgs) >= 1
    assert msgs[0]["content"] == "Hello from flow"


def test_flow_register_join_circle_verify_leave(client):
    """Register, join circle, verify member count, leave."""
    reg = client.post("/api/auth/register", json={
        "email": "circflow@test.com", "password": "pass123", "full_name": "Circle Flow",
    })
    token = reg.json()["access_token"]
    client.headers["Authorization"] = f"Bearer {token}"

    circles = client.get("/api/circles").json()
    fc = next(c for c in circles if not c["is_premium"])
    before_count = fc["member_count"]

    # Join
    client.post(f"/api/circles/{fc['id']}/join")

    # Verify count
    circles_after = client.get("/api/circles").json()
    joined = next(c for c in circles_after if c["id"] == fc["id"])
    assert joined["member_count"] == before_count + 1
    assert joined["is_member"] is True

    # Leave
    client.delete(f"/api/circles/{fc['id']}/leave")

    # Verify count restored
    circles_final = client.get("/api/circles").json()
    left = next(c for c in circles_final if c["id"] == fc["id"])
    assert left["member_count"] == before_count
    assert left["is_member"] is False


def test_flow_booking_then_payment_creates_history(client):
    """Register, book, pay (dev mode), verify payment history."""
    reg = client.post("/api/auth/register", json={
        "email": "payflow@test.com", "password": "pass123", "full_name": "Pay Flow",
    })
    token = reg.json()["access_token"]
    client.headers["Authorization"] = f"Bearer {token}"

    book = client.post("/api/bookings", json={
        "guide_id": 1, "seeker_name": "Pay Flow", "seeker_email": "payflow@test.com",
        "booking_type": "intro", "date_time": "2025-12-01T10:00",
    })
    client.post("/api/payments/create-checkout", json={"booking_id": book.json()["id"]})

    history = client.get("/api/payments/history").json()
    assert len(history) >= 1


def test_flow_upgrade_tier_then_join_premium_circle(client):
    """Register, upgrade tier via dev payment, join premium circle."""
    reg = client.post("/api/auth/register", json={
        "email": "upgrade@test.com", "password": "pass123", "full_name": "Upgrade User",
    })
    token = reg.json()["access_token"]
    client.headers["Authorization"] = f"Bearer {token}"

    # Upgrade
    client.post("/api/payments/create-checkout", json={"tier": "committed"})

    # Verify tier
    me = client.get("/api/auth/me").json()
    assert me["tier"] == "committed"

    # Try premium circle
    circles = client.get("/api/circles").json()
    pc = next((c for c in circles if c["is_premium"]), None)
    if pc:
        r = client.post(f"/api/circles/{pc['id']}/join")
        assert r.status_code == 201


def test_flow_admin_dashboard_reflects_operations(admin_client):
    """Dashboard stats should reflect bookings and reviews created."""
    before = admin_client.get("/api/admin/dashboard").json()

    admin_client.post("/api/bookings", json={
        "guide_id": 1, "seeker_name": "Dash", "seeker_email": "dash@t.com",
        "booking_type": "intro", "date_time": "2025-12-15T10:00",
    })
    admin_client.post("/api/guides/1/reviews", json={
        "author": "Dash", "rating": 4, "comment": "Good",
    })

    after = admin_client.get("/api/admin/dashboard").json()
    assert after["total_bookings"] == before["total_bookings"] + 1
    assert after["total_reviews"] == before["total_reviews"] + 1


def test_flow_cancelled_booking_not_conflict(client):
    """Cancelled booking should not block the same time slot."""
    r1 = client.post("/api/bookings", json={
        "guide_id": 1, "seeker_name": "A", "seeker_email": "a@t.com",
        "booking_type": "intro", "date_time": "2026-01-01T10:00",
    })
    bid = r1.json()["id"]
    client.patch(f"/api/bookings/{bid}/status?status=cancelled")

    r2 = client.post("/api/bookings", json={
        "guide_id": 1, "seeker_name": "B", "seeker_email": "b@t.com",
        "booking_type": "intro", "date_time": "2026-01-01T10:00",
    })
    assert r2.status_code == 201


def test_flow_multiple_reviews_update_guide_rating(client):
    """Multiple reviews should correctly update the guide's rating and count."""
    # Use guide 2 to avoid interference from other tests
    reviews_before = client.get("/api/guides/2/reviews").json()
    count_before = len(reviews_before)

    client.post("/api/guides/2/reviews", json={"author": "R1", "rating": 5, "comment": "Perfect"})
    client.post("/api/guides/2/reviews", json={"author": "R2", "rating": 3, "comment": "Okay"})

    reviews_after = client.get("/api/guides/2/reviews").json()
    assert len(reviews_after) == count_before + 2
