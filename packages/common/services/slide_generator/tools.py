"""
Slide Generation Tools
OpenAI-compatible tool definitions for slide generation
"""

# Tool definitions in OpenAI format
SLIDE_TOOLS = [
    {
        "type": "function",
        "function": {
            "name": "add_slide",
            "description": "Add a slide to the presentation. Call this for each slide you want to create.",
            "parameters": {
                "type": "object",
                "properties": {
                    "slide_type": {
                        "type": "string",
                        "enum": ["title", "content", "bullets", "quote", "section"],
                        "description": "Type of slide: title (opening), content (paragraph), bullets (list), quote, section (divider)",
                    },
                    "title": {
                        "type": "string",
                        "description": "Slide title (required for all slides)",
                    },
                    "subtitle": {
                        "type": "string",
                        "description": "Subtitle (for title slides only)",
                    },
                    "body": {
                        "type": "string",
                        "description": "Body paragraph text (for content slides)",
                    },
                    "bullets": {
                        "type": "array",
                        "items": {"type": "string"},
                        "description": "List of bullet points (for bullets slides, max 6 items)",
                    },
                    "quote": {
                        "type": "string",
                        "description": "Quote text (for quote slides)",
                    },
                    "attribution": {
                        "type": "string",
                        "description": "Quote attribution/author (for quote slides)",
                    },
                    "layout": {
                        "type": "string",
                        "enum": ["left", "center", "right"],
                        "description": "Text alignment (default: center)",
                    },
                },
                "required": ["slide_type", "title"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "finish_presentation",
            "description": "Call this when all slides have been added to complete the presentation.",
            "parameters": {
                "type": "object",
                "properties": {
                    "title": {
                        "type": "string",
                        "description": "The presentation title",
                    },
                },
                "required": ["title"],
            },
        },
    },
]


SYSTEM_PROMPT = """You are an expert presentation designer. Create a slide presentation by calling the add_slide tool for each slide.

SLIDE TYPES:
- "title": Opening slide with main title and subtitle
- "content": Text-heavy slide with title and body paragraph
- "bullets": List of key points (3-6 bullets, each under 12 words)
- "quote": Impactful quote with attribution
- "section": Section divider for topic transitions

RULES:
1. First slide MUST be type "title"
2. Create exactly {slide_count} slides total
3. Use varied slide types for visual interest (don't repeat the same type)
4. Keep content concise and impactful
5. After creating all slides, call finish_presentation with the presentation title

Create slides now based on the user's text."""
