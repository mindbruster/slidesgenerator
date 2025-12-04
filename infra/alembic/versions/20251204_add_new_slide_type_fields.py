"""add_new_slide_type_fields

Revision ID: add_new_slide_type_fields
Revises: add_image_fields
Create Date: 2025-12-04 18:30:00.000000
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "add_new_slide_type_fields"
down_revision: Union[str, None] = "add_image_fields"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Stats slide fields
    op.add_column("slides", sa.Column("stats", sa.JSON(), nullable=True))

    # Big number slide fields
    op.add_column("slides", sa.Column("big_number_value", sa.String(50), nullable=True))
    op.add_column("slides", sa.Column("big_number_label", sa.String(255), nullable=True))
    op.add_column("slides", sa.Column("big_number_context", sa.Text(), nullable=True))

    # Comparison slide fields
    op.add_column("slides", sa.Column("comparison_columns", sa.JSON(), nullable=True))

    # Timeline slide fields
    op.add_column("slides", sa.Column("timeline_items", sa.JSON(), nullable=True))


def downgrade() -> None:
    op.drop_column("slides", "timeline_items")
    op.drop_column("slides", "comparison_columns")
    op.drop_column("slides", "big_number_context")
    op.drop_column("slides", "big_number_label")
    op.drop_column("slides", "big_number_value")
    op.drop_column("slides", "stats")
