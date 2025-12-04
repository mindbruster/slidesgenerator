"""
Sales Content Generator
Generates sales-focused content from structured input
"""

from .generator import SalesContentGenerator
from .prompts import SALES_SYSTEM_PROMPT

__all__ = ["SalesContentGenerator", "SALES_SYSTEM_PROMPT"]
