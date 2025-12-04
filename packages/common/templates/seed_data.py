"""
System template definitions for seeding the database
"""

SYSTEM_TEMPLATES = [
    {
        "name": "Startup Pitch Deck",
        "description": "Classic 10-slide pitch deck for investors",
        "category": "business",
        "theme": "neobrutalism",
        "tags": ["startup", "investor", "funding", "pitch"],
        "slides": [
            {
                "order": 1,
                "slide_type": "title",
                "ai_instructions": "Company name and compelling tagline",
            },
            {
                "order": 2,
                "slide_type": "content",
                "placeholder_title": "The Problem",
                "ai_instructions": "Describe the pain point being solved",
            },
            {
                "order": 3,
                "slide_type": "content",
                "placeholder_title": "Our Solution",
                "ai_instructions": "Explain the product/service",
            },
            {
                "order": 4,
                "slide_type": "big_number",
                "placeholder_title": "Market Opportunity",
                "ai_instructions": "TAM/SAM/SOM with impressive numbers",
            },
            {
                "order": 5,
                "slide_type": "bullets",
                "placeholder_title": "Business Model",
                "ai_instructions": "Revenue streams and pricing",
            },
            {
                "order": 6,
                "slide_type": "chart",
                "placeholder_title": "Traction",
                "ai_instructions": "Growth metrics chart",
            },
            {
                "order": 7,
                "slide_type": "comparison",
                "placeholder_title": "Competitive Advantage",
                "ai_instructions": "Us vs competitors",
            },
            {
                "order": 8,
                "slide_type": "timeline",
                "placeholder_title": "Roadmap",
                "ai_instructions": "Key milestones",
            },
            {
                "order": 9,
                "slide_type": "stats",
                "placeholder_title": "The Team",
                "ai_instructions": "Key team members",
            },
            {
                "order": 10,
                "slide_type": "section",
                "placeholder_title": "The Ask",
                "ai_instructions": "Funding amount and use",
            },
        ],
    },
    {
        "name": "Quarterly Business Review",
        "description": "Comprehensive quarterly performance report",
        "category": "business",
        "theme": "corporate",
        "tags": ["quarterly", "report", "performance", "metrics"],
        "slides": [
            {
                "order": 1,
                "slide_type": "title",
                "ai_instructions": "Quarter and year with company name",
            },
            {
                "order": 2,
                "slide_type": "stats",
                "placeholder_title": "Key Metrics",
                "ai_instructions": "Top 4 KPIs for the quarter",
            },
            {
                "order": 3,
                "slide_type": "chart",
                "placeholder_title": "Revenue Performance",
                "ai_instructions": "Revenue chart with trend",
            },
            {
                "order": 4,
                "slide_type": "bullets",
                "placeholder_title": "Achievements",
                "ai_instructions": "Major wins this quarter",
            },
            {
                "order": 5,
                "slide_type": "bullets",
                "placeholder_title": "Challenges",
                "ai_instructions": "Obstacles faced",
            },
            {
                "order": 6,
                "slide_type": "timeline",
                "placeholder_title": "Next Quarter Goals",
                "ai_instructions": "Upcoming milestones",
            },
        ],
    },
    {
        "name": "Sales Proposal",
        "description": "Persuasive sales pitch for potential clients",
        "category": "business",
        "theme": "neobrutalism",
        "tags": ["sales", "proposal", "client", "deal"],
        "slides": [
            {
                "order": 1,
                "slide_type": "title",
                "ai_instructions": "Client-focused title with value proposition",
            },
            {
                "order": 2,
                "slide_type": "content",
                "placeholder_title": "Understanding Your Needs",
                "ai_instructions": "Show you understand their challenges",
            },
            {
                "order": 3,
                "slide_type": "bullets",
                "placeholder_title": "Our Solution",
                "ai_instructions": "How we solve their specific problems",
            },
            {
                "order": 4,
                "slide_type": "stats",
                "placeholder_title": "Proven Results",
                "ai_instructions": "Key metrics and success stats",
            },
            {
                "order": 5,
                "slide_type": "comparison",
                "placeholder_title": "Why Choose Us",
                "ai_instructions": "Before/after or us vs alternatives",
            },
            {
                "order": 6,
                "slide_type": "quote",
                "ai_instructions": "Client testimonial",
            },
            {
                "order": 7,
                "slide_type": "bullets",
                "placeholder_title": "Investment & ROI",
                "ai_instructions": "Pricing and expected returns",
            },
            {
                "order": 8,
                "slide_type": "section",
                "placeholder_title": "Next Steps",
                "ai_instructions": "Clear call to action",
            },
        ],
    },
    {
        "name": "Product Launch",
        "description": "Announce and showcase a new product",
        "category": "marketing",
        "theme": "neobrutalism",
        "tags": ["product", "launch", "marketing", "announcement"],
        "slides": [
            {
                "order": 1,
                "slide_type": "title",
                "ai_instructions": "Product name with exciting tagline",
            },
            {
                "order": 2,
                "slide_type": "content",
                "placeholder_title": "The Challenge",
                "ai_instructions": "Problem this product solves",
            },
            {
                "order": 3,
                "slide_type": "content",
                "placeholder_title": "Introducing...",
                "ai_instructions": "Product reveal with key value prop",
            },
            {
                "order": 4,
                "slide_type": "bullets",
                "placeholder_title": "Key Features",
                "ai_instructions": "Top 5 features",
            },
            {
                "order": 5,
                "slide_type": "comparison",
                "placeholder_title": "Before & After",
                "ai_instructions": "Life without vs with product",
            },
            {
                "order": 6,
                "slide_type": "stats",
                "placeholder_title": "Early Results",
                "ai_instructions": "Beta metrics or projections",
            },
            {
                "order": 7,
                "slide_type": "quote",
                "ai_instructions": "Customer testimonial or endorsement",
            },
            {
                "order": 8,
                "slide_type": "section",
                "placeholder_title": "Get Started",
                "ai_instructions": "CTA with availability info",
            },
        ],
    },
    {
        "name": "Course Introduction",
        "description": "Introduction to an educational course or workshop",
        "category": "education",
        "theme": "minimal",
        "tags": ["course", "education", "training", "workshop"],
        "slides": [
            {
                "order": 1,
                "slide_type": "title",
                "ai_instructions": "Course title and instructor",
            },
            {
                "order": 2,
                "slide_type": "bullets",
                "placeholder_title": "What You'll Learn",
                "ai_instructions": "Learning objectives",
            },
            {
                "order": 3,
                "slide_type": "timeline",
                "placeholder_title": "Course Outline",
                "ai_instructions": "Module breakdown",
            },
            {
                "order": 4,
                "slide_type": "content",
                "placeholder_title": "Prerequisites",
                "ai_instructions": "What students should know",
            },
            {
                "order": 5,
                "slide_type": "bullets",
                "placeholder_title": "Materials Needed",
                "ai_instructions": "Required tools/resources",
            },
            {
                "order": 6,
                "slide_type": "section",
                "placeholder_title": "Let's Begin!",
                "ai_instructions": "Motivational closing",
            },
        ],
    },
    {
        "name": "Research Presentation",
        "description": "Academic research findings presentation",
        "category": "education",
        "theme": "minimal",
        "tags": ["research", "academic", "thesis", "findings"],
        "slides": [
            {
                "order": 1,
                "slide_type": "title",
                "ai_instructions": "Research title and author/institution",
            },
            {
                "order": 2,
                "slide_type": "content",
                "placeholder_title": "Background",
                "ai_instructions": "Context and prior research",
            },
            {
                "order": 3,
                "slide_type": "bullets",
                "placeholder_title": "Research Questions",
                "ai_instructions": "Key questions being addressed",
            },
            {
                "order": 4,
                "slide_type": "content",
                "placeholder_title": "Methodology",
                "ai_instructions": "Research approach and methods",
            },
            {
                "order": 5,
                "slide_type": "chart",
                "placeholder_title": "Key Findings",
                "ai_instructions": "Data visualization of results",
            },
            {
                "order": 6,
                "slide_type": "stats",
                "placeholder_title": "Results Summary",
                "ai_instructions": "Key metrics and statistics",
            },
            {
                "order": 7,
                "slide_type": "bullets",
                "placeholder_title": "Conclusions",
                "ai_instructions": "Main takeaways",
            },
            {
                "order": 8,
                "slide_type": "section",
                "placeholder_title": "Questions?",
                "ai_instructions": "Contact info and references",
            },
        ],
    },
    {
        "name": "Technical Architecture",
        "description": "System design and architecture overview",
        "category": "technology",
        "theme": "terminal",
        "tags": ["architecture", "technical", "system", "engineering"],
        "slides": [
            {
                "order": 1,
                "slide_type": "title",
                "ai_instructions": "System name and version",
            },
            {
                "order": 2,
                "slide_type": "content",
                "placeholder_title": "Overview",
                "ai_instructions": "High-level system description",
            },
            {
                "order": 3,
                "slide_type": "bullets",
                "placeholder_title": "Components",
                "ai_instructions": "Key system components",
            },
            {
                "order": 4,
                "slide_type": "content",
                "placeholder_title": "Data Flow",
                "ai_instructions": "How data moves through system",
            },
            {
                "order": 5,
                "slide_type": "comparison",
                "placeholder_title": "Tech Stack",
                "ai_instructions": "Frontend vs Backend technologies",
            },
            {
                "order": 6,
                "slide_type": "bullets",
                "placeholder_title": "Security",
                "ai_instructions": "Security measures",
            },
            {
                "order": 7,
                "slide_type": "stats",
                "placeholder_title": "Performance",
                "ai_instructions": "Key performance metrics",
            },
            {
                "order": 8,
                "slide_type": "timeline",
                "placeholder_title": "Roadmap",
                "ai_instructions": "Planned improvements",
            },
        ],
    },
    {
        "name": "Sprint Review",
        "description": "Agile sprint review and demo",
        "category": "technology",
        "theme": "dark",
        "tags": ["agile", "sprint", "scrum", "demo"],
        "slides": [
            {
                "order": 1,
                "slide_type": "title",
                "ai_instructions": "Sprint number and date range",
            },
            {
                "order": 2,
                "slide_type": "stats",
                "placeholder_title": "Sprint Metrics",
                "ai_instructions": "Story points, velocity, completion rate",
            },
            {
                "order": 3,
                "slide_type": "bullets",
                "placeholder_title": "Completed Stories",
                "ai_instructions": "User stories delivered",
            },
            {
                "order": 4,
                "slide_type": "content",
                "placeholder_title": "Demo Highlights",
                "ai_instructions": "Key features to demonstrate",
            },
            {
                "order": 5,
                "slide_type": "bullets",
                "placeholder_title": "Blockers & Challenges",
                "ai_instructions": "Issues encountered",
            },
            {
                "order": 6,
                "slide_type": "timeline",
                "placeholder_title": "Next Sprint",
                "ai_instructions": "Upcoming priorities",
            },
        ],
    },
    {
        "name": "Portfolio Showcase",
        "description": "Creative portfolio presentation",
        "category": "creative",
        "theme": "magazine",
        "tags": ["portfolio", "creative", "showcase", "design"],
        "slides": [
            {
                "order": 1,
                "slide_type": "title",
                "ai_instructions": "Name and creative title",
            },
            {
                "order": 2,
                "slide_type": "content",
                "placeholder_title": "About Me",
                "ai_instructions": "Brief bio and philosophy",
            },
            {
                "order": 3,
                "slide_type": "bullets",
                "placeholder_title": "Skills",
                "ai_instructions": "Key competencies",
            },
            {
                "order": 4,
                "slide_type": "content",
                "placeholder_title": "Featured Project 1",
                "ai_instructions": "First project highlight",
            },
            {
                "order": 5,
                "slide_type": "content",
                "placeholder_title": "Featured Project 2",
                "ai_instructions": "Second project highlight",
            },
            {
                "order": 6,
                "slide_type": "content",
                "placeholder_title": "Featured Project 3",
                "ai_instructions": "Third project highlight",
                "is_required": False,
            },
            {
                "order": 7,
                "slide_type": "quote",
                "ai_instructions": "Client testimonial",
            },
            {
                "order": 8,
                "slide_type": "section",
                "placeholder_title": "Let's Connect",
                "ai_instructions": "Contact information",
            },
        ],
    },
    {
        "name": "Event Announcement",
        "description": "Promote an upcoming event",
        "category": "creative",
        "theme": "playful",
        "tags": ["event", "announcement", "conference", "meetup"],
        "slides": [
            {
                "order": 1,
                "slide_type": "title",
                "ai_instructions": "Event name with exciting tagline",
            },
            {
                "order": 2,
                "slide_type": "big_number",
                "placeholder_title": "Save the Date",
                "ai_instructions": "Date and location prominently displayed",
            },
            {
                "order": 3,
                "slide_type": "bullets",
                "placeholder_title": "What to Expect",
                "ai_instructions": "Event highlights and activities",
            },
            {
                "order": 4,
                "slide_type": "stats",
                "placeholder_title": "Speakers & Guests",
                "ai_instructions": "Notable attendees/speakers",
            },
            {
                "order": 5,
                "slide_type": "timeline",
                "placeholder_title": "Schedule",
                "ai_instructions": "Event agenda overview",
            },
            {
                "order": 6,
                "slide_type": "section",
                "placeholder_title": "Register Now",
                "ai_instructions": "CTA and registration info",
            },
        ],
    },
    {
        "name": "Personal Introduction",
        "description": "Introduce yourself professionally",
        "category": "personal",
        "theme": "neobrutalism",
        "tags": ["introduction", "personal", "about", "bio"],
        "slides": [
            {
                "order": 1,
                "slide_type": "title",
                "ai_instructions": "Name and professional title",
            },
            {
                "order": 2,
                "slide_type": "content",
                "placeholder_title": "My Story",
                "ai_instructions": "Brief personal/professional journey",
            },
            {
                "order": 3,
                "slide_type": "bullets",
                "placeholder_title": "What I Do",
                "ai_instructions": "Key skills and expertise",
            },
            {
                "order": 4,
                "slide_type": "stats",
                "placeholder_title": "By the Numbers",
                "ai_instructions": "Key achievements in numbers",
            },
            {
                "order": 5,
                "slide_type": "bullets",
                "placeholder_title": "Fun Facts",
                "ai_instructions": "Personal interests/hobbies",
                "is_required": False,
            },
            {
                "order": 6,
                "slide_type": "section",
                "placeholder_title": "Let's Connect",
                "ai_instructions": "Contact and social links",
            },
        ],
    },
    {
        "name": "Project Kickoff",
        "description": "Launch a new project with your team",
        "category": "business",
        "theme": "corporate",
        "tags": ["project", "kickoff", "team", "planning"],
        "slides": [
            {
                "order": 1,
                "slide_type": "title",
                "ai_instructions": "Project name and tagline",
            },
            {
                "order": 2,
                "slide_type": "content",
                "placeholder_title": "Project Vision",
                "ai_instructions": "What we're building and why",
            },
            {
                "order": 3,
                "slide_type": "bullets",
                "placeholder_title": "Goals & Objectives",
                "ai_instructions": "Key success criteria",
            },
            {
                "order": 4,
                "slide_type": "stats",
                "placeholder_title": "The Team",
                "ai_instructions": "Team members and roles",
            },
            {
                "order": 5,
                "slide_type": "timeline",
                "placeholder_title": "Project Timeline",
                "ai_instructions": "Key milestones and deadlines",
            },
            {
                "order": 6,
                "slide_type": "bullets",
                "placeholder_title": "Success Metrics",
                "ai_instructions": "How we'll measure success",
            },
            {
                "order": 7,
                "slide_type": "section",
                "placeholder_title": "Let's Go!",
                "ai_instructions": "Next steps and call to action",
            },
        ],
    },
]


async def seed_templates(db) -> int:
    """
    Seed system templates into database.
    Returns count of templates created.
    """
    from sqlalchemy import select

    from packages.common.models.template import Template, TemplateSlide

    created = 0

    for template_data in SYSTEM_TEMPLATES:
        # Check if already exists
        query = select(Template).where(
            Template.name == template_data["name"],
            Template.is_system == True,  # noqa: E712
        )
        result = await db.execute(query)
        if result.scalar_one_or_none():
            continue

        # Create template
        slides_data = template_data.pop("slides")
        template = Template(**template_data, is_system=True)

        for slide_data in slides_data:
            slide = TemplateSlide(**slide_data)
            template.slides.append(slide)

        db.add(template)
        created += 1

    await db.commit()
    return created
