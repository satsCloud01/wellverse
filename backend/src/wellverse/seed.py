from sqlalchemy.orm import Session
from .models import Vertical, Guide, LibraryItem, Circle, BlogPost, User
from .auth import hash_password


VERTICALS_DATA = [
    {
        "id": "mind", "label": "Mental Wellness", "emoji": "\U0001f9e0",
        "color": "#4A7A9A", "accent": "#6AAAC8", "status": "live", "eta": None,
        "tagline": "Psychological coaches, therapists & mindfulness guides",
        "manifesto": "The most searched wellness category \u2014 and the invisible foundation beneath every other. You can optimise your body, food, and relationships all you want. If the mind is running on fear, old wounds, and untested beliefs, none of it sticks.",
        "why": "1 in 5 adults seek mental health support annually. Highest retention and lifetime value of any wellness category.",
        "stat": "Therapy & coaching cut anxiety symptoms by up to 60% within 12 weeks",
        "guide_types": ["Psychological Coaches", "Mindfulness & Meditation", "Therapists (non-clinical)", "NLP Practitioners", "Breathwork Guides", "Somatic Coaches"],
    },
    {
        "id": "body", "label": "Fitness & Movement", "emoji": "\U0001f4aa",
        "color": "#3A5A40", "accent": "#6A9E72", "status": "live", "eta": None,
        "tagline": "Personal trainers, yoga coaches & movement specialists",
        "manifesto": "Physical investment is the most visible form of self-respect. Not for aesthetics \u2014 but because what your body can do shapes what your life can be. Movement is medicine, discipline is love, and the right coach accelerates both.",
        "why": "Average client books 8+ sessions with a trainer they trust. Strong referral loop and predictable recurring revenue.",
        "stat": "$40B personal training market growing at 9% annually",
        "guide_types": ["Personal Trainers", "Yoga & Pilates Instructors", "Strength Coaches", "Mobility Specialists", "Sports Performance Coaches", "Online Programme Designers"],
    },
    {
        "id": "nutrition", "label": "Nutrition & Food", "emoji": "\U0001f33e",
        "color": "#5A7A2A", "accent": "#8AAA5A", "status": "early", "eta": "Q3 2025",
        "tagline": "Nutritionists, dietitians & food lifestyle coaches",
        "manifesto": "Food is not just fuel \u2014 it's information. Every meal sends a signal to your cells, your hormones, your mood, and your immune system. Most people eat on autopilot their entire lives. A nutrition guide helps you eat with intention.",
        "why": "The nutrition coaching market is $8B+. Most people want personalised guidance, not generic meal plans.",
        "stat": "Personalised nutrition improves energy & mood in 89% of clients within 6 weeks",
        "guide_types": ["Registered Nutritionists", "Dietitians", "Functional Medicine Coaches", "Anti-Inflammatory Specialists", "Gut Health Guides", "Food Lifestyle Coaches"],
    },
    {
        "id": "relationships", "label": "Relationships", "emoji": "\u2661",
        "color": "#6A2A40", "accent": "#B46278", "status": "early", "eta": "Q4 2025",
        "tagline": "Dating coaches, couples therapists & friendship guides",
        "manifesto": "The Harvard Study of Adult Development \u2014 85 years of research \u2014 found one overwhelming predictor of a long, fulfilling life: the quality of your relationships. Not your career. Not your wealth. How deeply you connect.",
        "why": "Relationship coaching is one of the fastest-growing categories, driven by post-pandemic loneliness and changing dating norms.",
        "stat": "Strong social bonds increase lifespan by up to 50% \u2014 more than exercise or diet alone",
        "guide_types": ["Friendship Coaches", "Dating & Relationship Coaches", "Couples Therapists", "Intimacy Coaches", "Social Confidence Guides", "Attachment Style Specialists"],
        "sub_pillars": [
            {"id": "friends", "icon": "\U0001f91d", "label": "Friendship", "color": "#7A3A2A", "accent": "#C87A5A", "why": "Most adults haven't made a meaningful new friend in years. We've confused followers for friends, and busyness for belonging."},
            {"id": "romantic", "icon": "\u2661", "label": "Romantic Love", "color": "#6A2A40", "accent": "#B46278", "why": "Romantic relationships don't fix unhealed wounds \u2014 they magnify them. A guide helps you become someone capable of sustaining love."},
        ],
    },
    {
        "id": "beauty", "label": "Beauty & Expression", "emoji": "\u2728",
        "color": "#5A3A6A", "accent": "#9A7AB8", "status": "early", "eta": "Q1 2026",
        "tagline": "Hairstylists, makeup artists, spa studios & skin therapists",
        "manifesto": "How you present yourself to the world is not vanity \u2014 it is self-expression. An outward signal of the respect you hold for your inner world. A great haircut, a thoughtful skincare ritual, or an hour in a spa isn't indulgence. It's saying: I am worth the care.",
        "why": "The global beauty services market is $265B. The opportunity is connecting people with specialists they can trust.",
        "stat": "Personal care routines correlate with 65% higher self-confidence scores",
        "guide_types": ["Hairstylists & Colourists", "Makeup Artists", "Spa & Wellness Studios", "Skin Therapists", "Brow & Lash Specialists", "Bridal Beauty Experts"],
    },
    {
        "id": "groups", "label": "Passion Circles", "emoji": "\u273A",
        "color": "#2A3A7A", "accent": "#6A7AC8", "status": "early", "eta": "Q2 2026",
        "tagline": "Art circles, music jams, outdoor adventures & writing clubs",
        "manifesto": "Between adolescence and adulthood, most people quietly stop doing the things that made them feel most alive. Passion Circles exist to give that back \u2014 combining Flow with belonging, the two strongest non-clinical predictors of wellbeing.",
        "why": "Group hobbies are a completely different product from 1-on-1 coaching, with its own powerful network effects.",
        "stat": "Active hobbyists are 34% less likely to experience depression",
        "guide_types": ["Art & Painting Circles", "Music & Jamming Groups", "Outdoor Adventure Clubs", "Writing & Storytelling Circles", "Dance & Movement Groups", "Cooking & Food Communities"],
    },
]

LIVE_GUIDES = [
    {"name": "Dr. Amara Osei", "role": "Psychological Coach", "emoji": "\U0001f9e0", "vertical_id": "mind", "color": "#4A7A9A", "quote": "I left private practice to reach people before crisis, not after.", "bio": "Former NHS psychologist. Helps high-achieving adults understand why they keep self-sabotaging.", "methods": ["Cognitive Reframing", "Shadow Work", "Somatic Therapy", "Identity Coaching"], "price": "$120/session", "rating": 4.9, "review_count": 31, "location": "New York \u00b7 Virtual", "is_preview": False},
    {"name": "Marcus Eze", "role": "Strength & Performance Coach", "emoji": "\U0001f4aa", "vertical_id": "body", "color": "#3A5A40", "quote": "Discipline is the highest form of self-respect I know.", "bio": "Former D1 athlete. Specialises in adults who want to train seriously without a sports background.", "methods": ["Functional Training", "Body Recomposition", "Athletic Conditioning", "Injury Prevention"], "price": "$85/hour", "rating": 4.8, "review_count": 44, "location": "Atlanta, GA \u00b7 Virtual", "is_preview": False},
    {"name": "Priya Menon", "role": "Mindfulness & Breathwork", "emoji": "\U0001f9d8", "vertical_id": "mind", "color": "#5A8A9A", "quote": "The breath is always available. It's the fastest route back to yourself.", "bio": "15 years of practice. Works with burnout, anxiety, and nervous system dysregulation.", "methods": ["Pranayama", "Yoga Nidra", "Trauma-Informed Movement", "Nervous System Regulation"], "price": "$80/session", "rating": 5.0, "review_count": 28, "location": "London \u00b7 Virtual", "is_preview": False},
    {"name": "Coach Sofia Lane", "role": "Personal Trainer", "emoji": "\U0001f3c3", "vertical_id": "body", "color": "#5A7A5A", "quote": "I'm not interested in aesthetics. I'm interested in what your body lets you do.", "bio": "Specialises in women returning to movement after injury, pregnancy, or long inactivity.", "methods": ["Functional Fitness", "Postpartum Recovery", "Mobility & Flexibility", "Habit Coaching"], "price": "$75/hour", "rating": 4.9, "review_count": 37, "location": "London \u00b7 In-person & Virtual", "is_preview": False},
]

PREVIEW_GUIDES = [
    {"name": "Kenji Watanabe", "role": "Holistic Nutritionist", "emoji": "\U0001f33e", "vertical_id": "nutrition", "color": "#5A7A2A", "quote": "Your plate is a prescription. Let's write one that works for your body.", "bio": "Integrative nutritionist specialising in metabolic health and anti-inflammatory protocols.", "methods": ["Metabolic Assessment", "Anti-Inflammatory Nutrition", "Gut Health", "Hormone Balance"], "price": "$95/session", "rating": 4.9, "review_count": 47, "location": "Los Angeles \u00b7 Virtual", "is_preview": True},
    {"name": "Dr. Sana Mirza", "role": "Functional Medicine Coach", "emoji": "\U0001f52c", "vertical_id": "nutrition", "color": "#6A8A3A", "quote": "Food is medicine. Most people just haven't been given the right prescription.", "bio": "Functional medicine practitioner focused on root-cause nutrition and personalised protocols.", "methods": ["Functional Labs", "Root-Cause Nutrition", "Elimination Protocols", "Supplement Strategy"], "price": "$130/session", "rating": 5.0, "review_count": 23, "location": "Dubai \u00b7 Virtual", "is_preview": True},
    {"name": "Nadia Laurent", "role": "Friendship & Social Coach", "emoji": "\U0001f91d", "vertical_id": "relationships", "color": "#7A3A2A", "quote": "Loneliness isn't a personal failure. It's a skill gap \u2014 and every skill can be learned.", "bio": "Social connection specialist helping adults build meaningful friendships and community.", "methods": ["Social Confidence Building", "Vulnerability Mapping", "Authentic Connection", "Overcoming Social Anxiety"], "price": "$90/session", "rating": 4.9, "review_count": 34, "location": "Paris \u00b7 Virtual", "is_preview": True},
    {"name": "James & Co.", "role": "Dating & Relationship Coach", "emoji": "\U0001f48c", "vertical_id": "relationships", "color": "#6A2A40", "quote": "Stop looking for the right person. Become capable of sustaining the right relationship.", "bio": "Dating strategist helping clients break patterns and build lasting romantic partnerships.", "methods": ["Attachment Style Work", "Dating Strategy", "Relationship Patterns", "Modern Dating Navigation"], "price": "$115/session", "rating": 4.8, "review_count": 52, "location": "London \u00b7 Virtual", "is_preview": True},
    {"name": "Dr. Sofia & Marcus Reeves", "role": "Couples Therapist", "emoji": "\u2661", "vertical_id": "relationships", "color": "#8A3A54", "quote": "Every conflict in a relationship is a bid for connection that hasn't found its language yet.", "bio": "Couples therapy using Gottman Method and EFT to restore communication and intimacy.", "methods": ["Gottman Method", "Emotionally Focused Therapy", "Intimacy Restoration", "Communication Architecture"], "price": "$150/session", "rating": 5.0, "review_count": 41, "location": "New York \u00b7 In-Person", "is_preview": True},
    {"name": "Zara + Co. Studio", "role": "Hair & Colour Artist", "emoji": "\u2702\ufe0f", "vertical_id": "beauty", "color": "#5A3A6A", "quote": "A great cut is confidence. An intentional ritual is self-respect made visible.", "bio": "Award-winning hair studio specialising in colour artistry and scalp health.", "methods": ["Colour Artistry", "Keratin & Bond Repair", "Scalp Health", "Bridal Styling"], "price": "From $85", "rating": 4.9, "review_count": 89, "location": "Chicago, IL", "is_preview": True},
    {"name": "Elena Vasquez", "role": "Makeup Artist", "emoji": "\U0001f3a8", "vertical_id": "beauty", "color": "#7A4A6A", "quote": "I don't do 'looks'. I amplify what's already there.", "bio": "Celebrity makeup artist bringing high-fashion technique to everyday clients.", "methods": ["Bridal & Editorial", "Natural Glam", "Skin-First Makeup", "Colour Theory"], "price": "$150/look", "rating": 5.0, "review_count": 63, "location": "Miami, FL", "is_preview": True},
    {"name": "The Maker's Circle", "role": "Art & Creative Workshops", "emoji": "\U0001f3a8", "vertical_id": "groups", "color": "#2A3A7A", "quote": "Creating something with your hands reconnects you to who you were before productivity.", "bio": "Community art workshops combining creativity with mindfulness and social connection.", "methods": ["Watercolour & Acrylic", "Pottery & Ceramics", "Mixed Media Art", "Sketchbook Journaling"], "price": "$35/session", "rating": 4.9, "review_count": 112, "location": "Multiple Cities \u00b7 Online", "is_preview": True},
    {"name": "Summit Seekers", "role": "Outdoor Adventure Group", "emoji": "\u26fa", "vertical_id": "groups", "color": "#3A6A7A", "quote": "The mountains don't care about your title. They just ask: are you present?", "bio": "Guided outdoor experiences designed for reconnection with nature and community.", "methods": ["Guided Day Hikes", "Wilderness Camping", "Wild Swimming", "Rock Climbing Intro"], "price": "$45/event", "rating": 5.0, "review_count": 78, "location": "UK \u00b7 EU \u00b7 US Chapters", "is_preview": True},
    {"name": "The Story Lab", "role": "Writing & Storytelling Circle", "emoji": "\u270d\ufe0f", "vertical_id": "groups", "color": "#4A6A3A", "quote": "Everyone has a story worth telling. Most just need a room safe enough to tell it in.", "bio": "Writing circles and spoken word evenings for personal narrative and creative expression.", "methods": ["Personal Narrative Writing", "Fiction Workshops", "Spoken Word Evenings", "Memoir Writing"], "price": "$30/session", "rating": 4.8, "review_count": 67, "location": "Global \u00b7 Virtual", "is_preview": True},
]


def seed_database(db: Session):
    if db.query(Vertical).count() > 0:
        return

    for v_data in VERTICALS_DATA:
        db.add(Vertical(**v_data))
    db.flush()

    for g_data in LIVE_GUIDES + PREVIEW_GUIDES:
        db.add(Guide(**g_data))
    db.flush()

    # Admin user
    db.add(User(
        email="admin@wellverse.app",
        password_hash=hash_password("admin123"),
        full_name="WellVerse Admin",
        role="admin",
        tier="committed",
    ))

    # Library items
    library_items = [
        {"title": "Understanding Your Stress Response", "description": "Learn how your nervous system reacts to stress and practical techniques to regulate it.", "content_type": "article", "vertical_id": "mind", "body": "# Understanding Your Stress Response\n\nStress isn't the enemy — it's information. Your body's stress response (the fight-or-flight system) evolved to protect you. But in modern life, it often fires when there's no real danger.\n\n## The Three Zones\n\n**Green Zone (Ventral Vagal):** You feel safe, connected, curious. This is where healing and growth happen.\n\n**Yellow Zone (Sympathetic):** Activated, alert, anxious. Your body is preparing for action.\n\n**Red Zone (Dorsal Vagal):** Shutdown, numb, disconnected. Your body has decided the threat is too great.\n\n## Practical Regulation Techniques\n\n1. **Box Breathing:** Inhale 4 counts, hold 4, exhale 4, hold 4. Repeat 4 times.\n2. **Cold Water on Wrists:** Activates the dive reflex, slowing heart rate.\n3. **Orienting:** Name 5 things you can see, 4 you can hear, 3 you can touch.\n4. **Humming:** Stimulates the vagus nerve through vibration.\n\nThe goal isn't to never feel stress — it's to return to your green zone faster.", "author": "Dr. Amara Osei", "tags": ["stress", "nervous-system", "regulation"], "duration_minutes": 8},
        {"title": "5-Minute Morning Breathwork", "description": "A guided breathing exercise to start your day with clarity and calm.", "content_type": "meditation", "vertical_id": "mind", "body": "# 5-Minute Morning Breathwork\n\nThis practice uses a 4-7-8 pattern to activate your parasympathetic nervous system.\n\n## Instructions\n\n1. Sit comfortably with a straight spine\n2. Close your eyes\n3. Exhale completely through your mouth\n4. Inhale through your nose for 4 counts\n5. Hold for 7 counts\n6. Exhale through your mouth for 8 counts\n7. Repeat 4 cycles\n\n## Why It Works\n\nThe extended exhale tells your nervous system: \"You are safe.\" Within 3-4 cycles, most people notice their heart rate dropping and their mind clearing.", "author": "Priya Menon", "tags": ["breathwork", "morning-routine", "calm"], "duration_minutes": 5},
        {"title": "Functional Movement for Desk Workers", "description": "7 exercises to reverse the damage of sitting all day.", "content_type": "exercise", "vertical_id": "body", "body": "# Functional Movement for Desk Workers\n\n## The Problem\nSitting 8+ hours creates: tight hip flexors, weak glutes, forward head posture, and thoracic spine stiffness.\n\n## The Fix (15 minutes)\n\n1. **Cat-Cow** (1 min): Mobilise the entire spine\n2. **90/90 Hip Switch** (2 min each side): Open hips in both rotation directions\n3. **Wall Angels** (1 min): Reverse rounded shoulders\n4. **Dead Bug** (1 min each side): Activate deep core without crunches\n5. **Glute Bridge Hold** (1 min): Wake up your glutes\n6. **Thoracic Rotation** (1 min each side): Undo desk slouch\n7. **Deep Squat Hold** (2 min): The single best position for hip health\n\nDo this daily. Results in 2 weeks.", "author": "Coach Sofia Lane", "tags": ["movement", "desk-worker", "mobility"], "duration_minutes": 15},
        {"title": "The Anti-Inflammatory Plate", "description": "How to build meals that reduce inflammation and boost energy.", "content_type": "article", "vertical_id": "nutrition", "body": "# The Anti-Inflammatory Plate\n\n## The Formula\n\nEvery meal should contain:\n- **50% colourful vegetables** (the deeper the colour, the more phytonutrients)\n- **25% quality protein** (wild fish, pastured eggs, organic poultry, legumes)\n- **25% healthy fats** (olive oil, avocado, nuts, seeds)\n- **A fermented element** (sauerkraut, kimchi, kefir, miso)\n\n## Foods to Emphasise\n- Turmeric, ginger, garlic, green tea\n- Berries, leafy greens, cruciferous vegetables\n- Wild salmon, sardines, mackerel\n- Extra virgin olive oil\n\n## Foods to Minimise\n- Refined sugar, seed oils, processed meats\n- White flour, artificial sweeteners\n- Excessive alcohol\n\nThis isn't a diet — it's a framework. Use it 80% of the time.", "author": "Kenji Watanabe", "tags": ["nutrition", "anti-inflammatory", "energy"], "duration_minutes": 6},
        {"title": "The 5 Love Languages — A Practical Guide", "description": "Understanding how you and your partner give and receive love.", "content_type": "article", "vertical_id": "relationships", "body": "# The 5 Love Languages\n\nDr. Gary Chapman's framework remains one of the most useful tools in relationship coaching. The premise: we each have a primary way we feel loved.\n\n## The Five Languages\n\n1. **Words of Affirmation:** Verbal compliments, encouragement, appreciation\n2. **Acts of Service:** Actions that ease your partner's burden\n3. **Receiving Gifts:** Thoughtful symbols of love (not about money)\n4. **Quality Time:** Undivided attention and presence\n5. **Physical Touch:** Hugs, holding hands, proximity\n\n## The Common Mistake\n\nWe tend to express love in *our* language, not our partner's. A person whose language is Quality Time won't feel loved by expensive gifts.\n\n## The Exercise\n\nAsk your partner: \"When do you feel most loved by me?\" Listen without defending. Then share your own answer.", "author": "Dr. Sofia & Marcus Reeves", "tags": ["relationships", "love-languages", "communication"], "duration_minutes": 7},
        {"title": "Building a Skincare Ritual", "description": "A dermatologist-approved approach to skincare as self-care.", "content_type": "article", "vertical_id": "beauty", "body": "# Building a Skincare Ritual\n\n## The Minimum Effective Routine\n\n**Morning:** Gentle cleanser → Vitamin C serum → SPF 30+\n**Evening:** Oil cleanser → Water cleanser → Retinol (2-3x/week) → Moisturiser\n\n## Why \"Ritual\" Matters\n\nSkincare isn't just dermatology — it's 5 minutes of deliberate self-care. The act of touching your face gently, of being present with your own body, has psychological benefits beyond clear skin.\n\n## Common Mistakes\n\n- Over-exfoliating (your skin barrier is precious)\n- Skipping SPF (UV damage is cumulative and largely invisible)\n- Changing products too fast (give anything 6-8 weeks)\n- Ignoring your neck and hands", "author": "Elena Vasquez", "tags": ["skincare", "self-care", "beauty"], "duration_minutes": 5},
    ]
    for item in library_items:
        db.add(LibraryItem(**item))

    # Community Circles
    circles = [
        {"name": "Morning Mindfulness", "description": "Start your day with 20 minutes of guided meditation followed by a brief sharing circle. All experience levels welcome.", "vertical_id": "mind", "max_members": 12, "schedule": "Every weekday 7:00 AM GMT", "is_premium": False},
        {"name": "Strength Training Accountability", "description": "Weekly check-ins on your training goals. Share wins, troubleshoot plateaus, and stay consistent with a supportive group.", "vertical_id": "body", "max_members": 8, "schedule": "Every Monday 6:00 PM GMT", "is_premium": False},
        {"name": "Nutrition Reset Circle", "description": "A 6-week guided circle to rebuild your relationship with food. Weekly meal planning, Q&A with a nutritionist, and peer support.", "vertical_id": "nutrition", "max_members": 10, "schedule": "Every Wednesday 7:00 PM GMT", "is_premium": True},
        {"name": "Couples Communication Lab", "description": "Practice Gottman-method communication exercises with your partner in a safe, facilitated group setting.", "vertical_id": "relationships", "max_members": 6, "schedule": "Every Thursday 8:00 PM GMT", "is_premium": True},
        {"name": "Creative Expression Circle", "description": "A weekly art and journaling session combining creativity with mindfulness. No artistic skill required — just willingness to explore.", "vertical_id": "groups", "max_members": 15, "schedule": "Every Saturday 10:00 AM GMT", "is_premium": False},
        {"name": "Sunday Run Club", "description": "A social running group for all paces. We run 5-10k together, then grab coffee. Building fitness and friendships simultaneously.", "vertical_id": "body", "max_members": 20, "schedule": "Every Sunday 9:00 AM GMT", "is_premium": False},
    ]
    for c in circles:
        db.add(Circle(**c))

    # Blog posts
    blog_posts = [
        {"title": "Why We Built WellVerse", "slug": "why-we-built-wellverse", "excerpt": "The wellness industry is broken. Here's how we're fixing it — one vetted guide at a time.", "body": "# Why We Built WellVerse\n\nThe wellness industry has a trust problem.\n\nAnyone can call themselves a coach. Anyone can buy followers. Anyone can build a polished website that says nothing about their actual competence.\n\nMeanwhile, the people who genuinely need help — with their mental health, their fitness, their nutrition, their relationships — are left to navigate an ocean of unvetted practitioners with no way to distinguish signal from noise.\n\n## The Problem We Saw\n\n1. **No quality filter.** Marketplaces list everyone. The best practitioners sit next to the worst.\n2. **Tool fragmentation.** A good coach needs Calendly + Stripe + a notes app + a website + social media. That's 5+ platforms.\n3. **Discovery is broken.** Instagram rewards aesthetics, not outcomes. The best coaches often have the smallest followings.\n\n## What We're Building\n\nWellVerse is a marketplace where every guide is personally vetted. We reject 30% of applicants. We verify credentials with issuing bodies. We run practice interviews.\n\nWe're building this one vertical at a time. Mental Wellness and Fitness first — because they're the highest-demand, highest-retention categories. Then Nutrition, Relationships, Beauty, and Passion Circles.\n\nNo fake breadth. Only depth.\n\n## The Bet\n\nWe believe the future of wellness is personal, vetted, and integrated. Not a meditation app. Not a fitness tracker. A real human who knows what they're doing, who you can trust, and who has all the tools they need to help you — in one place.\n\nThat's WellVerse.", "author": "The WellVerse Team", "tags": ["manifesto", "company", "vision"], "published": True, "published_at": "2025-01-15T10:00:00"},
        {"title": "How We Vet Every Guide", "slug": "how-we-vet-guides", "excerpt": "Our 4-step verification process and why 30% of applicants don't make it through.", "body": "# How We Vet Every Guide\n\nQuality is the single most important thing about WellVerse. If we can't guarantee that every guide on the platform is competent, ethical, and effective, we have no right to exist.\n\nHere's exactly how our vetting process works.\n\n## Step 1: Application & Credentials\n\nEvery guide submits their qualifications, certifications, and professional history. We don't take their word for it — we verify with the issuing bodies directly.\n\nNo certification? No problem — if you have 5+ years of documented client work and strong references, we'll consider experience-based applications.\n\n## Step 2: Practice Interview\n\nA 30-minute video call with our Guide Quality team. We assess:\n- Professional approach and methodology\n- Ethical awareness and boundaries\n- Values alignment with the WellVerse community\n- Communication clarity\n\nThis is where most rejections happen. Technical skill matters, but how you relate to people matters more.\n\n## Step 3: Supervised Sessions\n\nNew guides complete 3 sessions with vetted volunteer clients. After each session, clients provide structured feedback on:\n- Did the guide listen actively?\n- Was the session well-structured?\n- Did they feel safe and respected?\n- Would they book again?\n\n## Step 4: Ongoing Review\n\nGuides rated below 4.5 stars trigger an automatic review. Consistent complaints about boundaries, no-shows, or unprofessional conduct result in removal.\n\nNo exceptions. No appeals based on popularity.\n\n## The Result\n\n30% of applicants are declined. That's not a bug — it's the entire point. When you book a guide on WellVerse, you can trust they've earned their place.", "author": "The WellVerse Team", "tags": ["vetting", "quality", "trust"], "published": True, "published_at": "2025-02-01T10:00:00"},
        {"title": "The Science of Self-Investment", "slug": "science-of-self-investment", "excerpt": "Research shows that investing in your wellbeing across multiple dimensions produces compounding returns.", "body": "# The Science of Self-Investment\n\nSelf-investment isn't a luxury. The research is unambiguous: people who actively invest in their mental health, physical fitness, nutrition, and relationships live longer, earn more, and report dramatically higher life satisfaction.\n\n## The Compounding Effect\n\nThe most interesting finding across wellbeing research is that **dimensions interact**. Exercise improves mood. Better mood improves relationships. Better relationships reduce stress. Reduced stress improves sleep. Better sleep improves exercise performance.\n\nThis is why WellVerse is built around six interconnected dimensions — not one app for meditation, another for fitness, another for nutrition.\n\n## Key Research\n\n- **Mental Health:** Therapy and coaching reduce anxiety symptoms by up to 60% within 12 weeks (APA, 2023)\n- **Fitness:** Regular exercise is as effective as medication for mild-to-moderate depression (BMJ, 2023)\n- **Nutrition:** Personalised nutrition plans improve energy and mood in 89% of clients within 6 weeks (Precision Nutrition, 2022)\n- **Relationships:** Strong social bonds increase lifespan by up to 50% — more than exercise or diet alone (Harvard Study of Adult Development)\n- **Beauty/Self-Care:** Personal care routines correlate with 65% higher self-confidence scores (Journal of Cosmetic Dermatology, 2021)\n- **Hobbies:** Active hobbyists are 34% less likely to experience depression (Oxford Economics, 2022)\n\n## The Takeaway\n\nYou don't need to optimise everything at once. Start with one dimension. Get a guide. Build momentum. The rest follows.", "author": "The WellVerse Team", "tags": ["research", "science", "wellbeing"], "published": True, "published_at": "2025-02-15T10:00:00"},
    ]
    for bp in blog_posts:
        pub_at = bp.pop("published_at", None)
        post = BlogPost(**bp)
        if pub_at:
            from datetime import datetime
            post.published_at = datetime.fromisoformat(pub_at)
        db.add(post)

    db.commit()
