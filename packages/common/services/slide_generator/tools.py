"""
Slide Generation Tools
OpenAI-compatible tool definitions for slide generation
"""

# Tool definitions in OpenAI format
SLIDE_TOOLS = [
    {
        "type": "function",
        "function": {
            "name": "get_current_theme",
            "description": "Get the current presentation theme name and colors. Use this to understand the visual style of the presentation.",
            "parameters": {
                "type": "object",
                "properties": {},
                "required": [],
            },
        },
    },
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
                        "enum": ["title", "content", "bullets", "quote", "section", "chart"],
                        "description": "Type of slide: title (opening), content (paragraph), bullets (list), quote, section (divider), chart (data visualization)",
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
                    "chart_type": {
                        "type": "string",
                        "enum": ["bar", "line", "pie", "donut", "area", "horizontal_bar"],
                        "description": "Type of chart (required for chart slides)",
                    },
                    "chart_data": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {
                                "label": {"type": "string"},
                                "value": {"type": "number"},
                                "color": {"type": "string"},
                            },
                            "required": ["label", "value"],
                        },
                        "description": "Data points for the chart (3-8 items recommended, required for chart slides)",
                    },
                    "chart_config": {
                        "type": "object",
                        "properties": {
                            "show_legend": {"type": "boolean"},
                            "show_values": {"type": "boolean"},
                            "y_axis_label": {"type": "string"},
                            "x_axis_label": {"type": "string"},
                        },
                        "description": "Optional chart configuration",
                    },
                    "image_query": {
                        "type": "string",
                        "description": "Search keywords to find a relevant stock image for this slide. Use descriptive terms like 'business meeting', 'technology', 'teamwork'. Recommended for content and bullets slides.",
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
- "chart": Data visualization (bar, line, pie, donut, area, horizontal_bar)

CHART GUIDELINES:
- Use charts PROACTIVELY to visualize data, statistics, comparisons, and trends
- Even when exact numbers aren't provided, create illustrative charts with reasonable estimates
- For comparisons: use bar or horizontal_bar charts
- For trends over time: use line or area charts
- For proportions/distributions: use pie or donut charts
- Provide 3-8 data points with clear labels and realistic values
- Always include a descriptive title for chart slides

IMAGE GUIDELINES:
- Add image_query to content, bullets, and section slides to include relevant stock photos
- Use descriptive, specific keywords (e.g., "business team collaboration", "modern office workspace", "data analytics dashboard")
- Images make presentations more engaging and professional
- Don't add images to title, quote, or chart slides

RULES:
1. First slide MUST be type "title"
2. Create exactly {slide_count} slides total
3. Use varied slide types for visual interest
4. ACTIVELY LOOK FOR opportunities to use chart slides - statistics, comparisons, growth, distributions, percentages
5. ADD image_query to most content and bullets slides for visual appeal
6. Keep text content concise and impactful
7. After creating all slides, call finish_presentation with the presentation title

Create slides now based on the user's text."""
