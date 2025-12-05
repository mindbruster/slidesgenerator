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
                        "description": """Type of slide - CREATE PROFESSIONAL, BUSINESS-STANDARD CONTENT:
- title: Opening slide with compelling main title and descriptive subtitle
- content: Professional text slide with 40-70 word body paragraph (2-3 sentences)
- bullets: 4-5 concise bullet points (6-10 words each) - easy to scan
- quote: Impactful, relevant quote with proper attribution
- section: Section divider for major topic transitions (use sparingly)
- chart: Data visualization with 5-8 data points showing trends, comparisons, or distributions
- stats: 4 impressive metrics in a grid - perfect for showcasing KPIs, results, and achievements
- big_number: Single hero metric that deserves its own slide for maximum impact
- comparison: Before/after or us/them with 4-5 points (6-10 words each) per column showing clear differences
- timeline: 4-5 sequential process steps with 8-12 word descriptions - ideal for roadmaps and workflows""",
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
                        "description": "Body paragraph text (for content slides). MUST be 40-70 words (2-3 clear sentences) - professional, concise, and impactful like typical business presentations. Include key points with specific details but keep it scannable. Never use generic or sparse text.",
                    },
                    "bullets": {
                        "type": "array",
                        "items": {"type": "string"},
                        "description": "Array of bullet points (for bullets slides). MUST include 4-5 bullets, each 6-10 words long - concise, impactful points that are clear and easy to scan. Include specific details and actionable insights. Never use short, generic bullets.",
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
                        "description": "Data points for the chart. MUST include 5-8 data points (never less than 5) with descriptive labels and compelling, realistic values. Labels should provide context (e.g., 'Q1 2024 - Launch Phase: 12,500' instead of just 'Q1: 100').",
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
                                "description": {"type": "string", "description": "Context explaining the significance"},
                            },
                            "required": ["value", "label"],
                        },
                        "description": "MUST include exactly 4 impressive statistics for stats slides. Each stat needs value, label, and description providing context.",
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
                                    "description": "Array of 4-5 comparison points (6-10 words each). Example: ['Manual data entry takes 2-3 hours daily', 'Prone to human errors and mistakes', 'Limited reporting capabilities available', 'Requires constant supervision and monitoring']",
                                },
                                "highlight": {"type": "boolean", "description": "Highlight this column"},
                            },
                            "required": ["title", "items"],
                        },
                        "description": "Exactly 2 columns for comparison slides. Each column MUST have an items array with 4-5 comparison points (6-10 words each) showing clear differences. Example: [{'title': 'Before', 'items': ['Point 1', 'Point 2', 'Point 3', 'Point 4']}, {'title': 'After', 'items': ['Point 1', 'Point 2', 'Point 3', 'Point 4'], 'highlight': true}]",
                    },
                    # Timeline fields
                    "timeline_items": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {
                                "title": {"type": "string", "description": "Step or milestone title"},
                                "description": {"type": "string", "description": "Concise description (8-12 words) explaining what happens in this phase"},
                                "date": {"type": "string", "description": "Date, timeframe, or phase indicator"},
                            },
                            "required": ["title"],
                        },
                        "description": "Array of 4-5 timeline steps with clear titles and concise 8-12 word descriptions for each step.",
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


SYSTEM_PROMPT = """You are an expert presentation designer creating professional, content-rich slide presentations. Your slides must be COMPREHENSIVE with SUBSTANTIAL content - never empty or sparse.

CRITICAL CONTENT REQUIREMENTS - FOLLOW STRICTLY:
==========================================
🚨 NEVER create empty or minimal slides. Each slide must be FILLED with rich, detailed, professional content.

CONTENT DEPTH BY SLIDE TYPE:

1. "content" slides (Text-heavy slides):
   - Body text MUST be 40-70 words (2-3 clear sentences)
   - Professional, concise, and impactful - like a typical business presentation
   - Include key points with specific details but keep it scannable
   - Example: "Our platform accelerates workflow by 65% through intelligent automation. Teams complete tasks in hours instead of days, reducing operational costs by $50K annually while improving accuracy to 99.8%."

2. "bullets" slides (List slides):
   - Include 4-5 bullets (professional standard)
   - Each bullet MUST be 6-10 words (concise, impactful points)
   - Clear, specific, and actionable - easy to read at a glance
   - Example bad bullet: "Better" ❌
   - Example good bullet: "Reduces processing time by 60% with automation" ✅

3. "chart" slides (Data visualization):
   - ALWAYS include 5-8 data points (never less than 5)
   - Use realistic, compelling numbers that tell a story
   - Add descriptive labels that provide context
   - Example: Instead of "Q1: 100", use "Q1 2024 - Initial Launch: 12,500 users"

4. "stats" slides (Multiple metrics):
   - Show 4 statistics (always 4, never less)
   - Each stat needs: impressive value + clear label + brief context description
   - Example: {{"value": "10x", "label": "ROI in First Year", "description": "Based on average customer savings"}}

5. "timeline" slides (Process/roadmap):
   - Include 4-5 steps (professional standard)
   - Each step needs: clear title + concise 8-12 word description
   - Example: {{"title": "Discovery Phase", "description": "Conduct stakeholder interviews and market research to identify needs", "date": "Week 1-2"}}

6. "comparison" slides (Before/After, Us/Them):
   - Each column should have 4-5 comparison points (6-10 words each)
   - Clear, concise, and impactful differences
   - Example: "Manual processing takes 3-5 days" vs "Automated processing in under 2 hours"

SLIDE TYPE DEFINITIONS:
======================
- "title": Opening slide with compelling main title and descriptive subtitle
- "content": Professional text slide with 40-70 word body paragraph - concise and impactful
- "bullets": 4-5 concise bullet points (6-10 words each) - easy to scan
- "quote": Impactful, relevant quote with proper attribution
- "section": Section divider for topic transitions (use sparingly)
- "chart": Data visualization with 5-8 data points (bar, line, pie, donut, area, horizontal_bar)
- "stats": 4 impressive metrics in a grid - perfect for showcasing results and KPIs
- "big_number": Single hero metric that deserves its own slide
- "comparison": Before/after or us/them with 4-5 points (6-10 words each) per column
- "timeline": 4-5 sequential steps with 8-12 word descriptions

CHART & DATA GUIDELINES:
========================
- MANDATORY: Include 2-3 chart/stats slides per presentation minimum
- Create charts for ANY quantifiable concept - use realistic estimates if exact numbers not provided
- Visualize: market size, growth rates, ROI, efficiency gains, cost savings, user metrics, satisfaction scores, performance improvements, feature comparisons, time savings, adoption rates
- Chart selection:
  * bar/horizontal_bar: Comparing items, rankings, feature comparisons, survey results
  * line/area: Trends over time, growth projections, progress tracking, historical data
  * pie/donut: Distributions, market share, budget allocation, composition breakdown
- ALWAYS use 5-8 data points with descriptive labels and compelling, realistic values
- Make data tell a story - show clear trends, improvements, or insights

IMAGE GUIDELINES:
=================
- Add image_query to 60-70% of content and bullets slides for visual richness
- Use specific, descriptive keywords (e.g., "business professionals analyzing data dashboard", "modern technology artificial intelligence concept", "healthcare medical innovation")
- Images make presentations more engaging and professional

PRESENTATION STRUCTURE:
=======================
1. Title slide with compelling subtitle
2. Overview/context with rich content (bullets or content + image)
3. Problem/opportunity explanation with detailed description
4. Solution/approach with comprehensive details
5. Key features/benefits with 5-6 detailed bullets
6. Data visualization (chart or stats) showing impact/metrics
7. Additional details/use cases with examples
8. Results/outcomes with quantified metrics (chart or stats)
9. Comparison or timeline (if relevant)
10. Strong conclusion or impactful quote

MANDATORY RULES:
================
1. First slide MUST be type "title" with engaging subtitle
2. Create EXACTLY {slide_count} slides total
3. MINIMUM 2-3 chart/stats slides with data visualization
4. Use varied slide types for engagement (mix content, bullets, charts, stats, comparison, timeline)
5. EVERY content slide: 40-70 words - professional, concise, scannable (no exceptions)
6. EVERY bullets slide: 4-5 bullets of 6-10 words each - typical business PPT format (no exceptions)
7. EVERY chart: 5-8 data points with clear labels (no exceptions)
8. EVERY timeline: 4-5 steps with 8-12 word descriptions (no exceptions)
9. EVERY comparison: 4-5 points (6-10 words each) per column (no exceptions)
10. Add image_query to 60-70% of content/bullets slides
11. After all slides, call finish_presentation with presentation title

🎯 YOUR GOAL: Create a PROFESSIONAL, BUSINESS-STANDARD presentation like typical corporate PowerPoints. Content should be substantial but concise - easy to read and understand at a glance. Think executive presentations, not academic papers. Clear, impactful, scannable slides.

Begin creating rich, detailed slides now!"""
