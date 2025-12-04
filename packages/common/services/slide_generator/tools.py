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
                        "enum": [
                            "title", "content", "bullets", "quote", "section", "chart",
                            "stats", "big_number", "comparison", "timeline"
                        ],
                        "description": """Type of slide:
- title: Opening slide with main title and subtitle
- content: Text-heavy slide with title and body paragraph
- bullets: List of key points (3-6 bullets)
- quote: Impactful quote with attribution
- section: Section divider for topic transitions
- chart: Data visualization (bar, line, pie, etc.)
- stats: Multiple key metrics displayed in a grid (2-4 stats) - GREAT for showcasing KPIs
- big_number: Single hero metric for maximum impact - use for your most impressive stat
- comparison: Side-by-side comparison (before/after, us/them) - perfect for showing transformation
- timeline: Process steps or milestones in sequence - great for roadmaps""",
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
                    # Chart fields
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
                        "description": "Data points for the chart (3-8 items, required for chart slides)",
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
                        "description": "Search keywords to find a relevant stock image. Use for content/bullets slides.",
                    },
                    # Stats fields
                    "stats": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {
                                "value": {"type": "string", "description": "The metric (e.g., '50%', '10x', '$1M')"},
                                "label": {"type": "string", "description": "What the metric measures"},
                                "description": {"type": "string", "description": "Optional context"},
                            },
                            "required": ["value", "label"],
                        },
                        "description": "2-4 key statistics for stats slides",
                    },
                    # Big number fields
                    "big_number_value": {
                        "type": "string",
                        "description": "The hero metric value (e.g., '10x', '99.9%', '$5M')",
                    },
                    "big_number_label": {
                        "type": "string",
                        "description": "Label explaining the metric",
                    },
                    "big_number_context": {
                        "type": "string",
                        "description": "Additional context or explanation",
                    },
                    # Comparison fields
                    "comparison_columns": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {
                                "title": {"type": "string", "description": "Column header (e.g., 'Before', 'After')"},
                                "items": {
                                    "type": "array",
                                    "items": {"type": "string"},
                                    "description": "List of comparison points",
                                },
                                "highlight": {"type": "boolean", "description": "Highlight this column"},
                            },
                            "required": ["title", "items"],
                        },
                        "description": "Exactly 2 columns for comparison slides",
                    },
                    # Timeline fields
                    "timeline_items": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {
                                "title": {"type": "string", "description": "Step or milestone title"},
                                "description": {"type": "string", "description": "Brief description"},
                                "date": {"type": "string", "description": "Optional date or phase"},
                            },
                            "required": ["title"],
                        },
                        "description": "3-6 timeline steps for timeline slides",
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
- "stats": Multiple metrics in a grid - PERFECT for KPIs and results (2-4 stats)
- "big_number": Single hero stat that fills the slide - use for your MOST impressive metric
- "comparison": Before/after or us/them side-by-side - great for showing transformation
- "timeline": Sequential steps or milestones - ideal for processes and roadmaps

METRICS & CHART GUIDELINES (VERY IMPORTANT):
- ALWAYS include at least 2-3 chart slides per presentation to visualize key metrics
- Create charts for ANY quantifiable concept, even if exact numbers aren't provided - use realistic estimates
- Metrics to visualize include: market size, growth rates, ROI, efficiency gains, cost savings, user adoption, satisfaction scores, performance improvements, feature comparisons, time savings, etc.
- Chart type selection:
  * bar/horizontal_bar: Compare items, show rankings, feature comparisons
  * line/area: Show trends over time, growth projections, progress tracking
  * pie/donut: Show distributions, market share, budget allocation, composition
- Always use 4-6 data points with clear labels and realistic values
- Make charts relevant to the content - if discussing benefits, show quantified impact
- Example metrics to create: "Expected ROI by Quarter", "Feature Comparison", "Market Growth Trend", "Customer Satisfaction", "Time Savings Analysis", "Cost Reduction Impact"
CHART GUIDELINES:
- Use charts PROACTIVELY to visualize data, statistics, comparisons, and trends
- Even when exact numbers aren't provided, create illustrative charts with reasonable estimates
- For comparisons: use bar or horizontal_bar charts
- For trends over time: use line or area charts
- For proportions/distributions: use pie or donut charts
- Provide 3-8 data points with clear labels and realistic values

NEW SLIDE TYPE GUIDELINES:
- stats: Use when you have 2-4 impressive metrics to show (e.g., "50% cost reduction, 10x speed, 99.9% uptime")
- big_number: Use for ONE standout metric that deserves its own slide (e.g., "10x ROI")
- comparison: Use to show transformation or differentiation (Before vs After, Us vs Competitors)
- timeline: Use for processes, roadmaps, or step-by-step guides (3-6 steps)

IMAGE GUIDELINES:
- Add image_query to content, bullets, and section slides for visual appeal
- Use descriptive keywords (e.g., "business team collaboration", "data analytics dashboard")

PRESENTATION STRUCTURE:
1. Title slide (type: title)
2. Overview/Introduction (content or bullets with image)
3. Key Features/Benefits with supporting chart
4. Section divider if needed
5. More content with metrics visualization
6. Comparison or trend chart
7. Additional details with images
8. Summary/Conclusion or impactful quote

RULES:
1. First slide MUST be type "title"
2. Create exactly {slide_count} slides total
3. MUST include at least 2-3 chart slides with relevant metrics
4. Use varied slide types for visual interest (mix of content, bullets, charts, quotes)
5. ADD image_query to most content and bullets slides for visual appeal
6. Keep text content concise and impactful
7. After creating all slides, call finish_presentation with the presentation title
3. Use varied slide types for visual interest - MIX traditional and new types
4. PROACTIVELY use stats, big_number, comparison, and timeline slides when content fits
5. Keep text content concise and impactful
6. After creating all slides, call finish_presentation with the presentation title

Create slides now based on the user's text. Remember: Data-driven presentations with charts are more persuasive!"""
