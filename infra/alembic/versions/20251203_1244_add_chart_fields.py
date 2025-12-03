"""add_chart_fields

Revision ID: add_chart_fields
Revises: e500e84d765f
Create Date: 2025-12-03 12:44:00.000000
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "add_chart_fields"
down_revision: Union[str, None] = "e500e84d765f"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Add chart-related columns to slides table
    op.add_column("slides", sa.Column("chart_type", sa.String(length=50), nullable=True))
    op.add_column("slides", sa.Column("chart_data", sa.JSON(), nullable=True))
    op.add_column("slides", sa.Column("chart_config", sa.JSON(), nullable=True))


def downgrade() -> None:
    # Remove chart-related columns from slides table
    op.drop_column("slides", "chart_config")
    op.drop_column("slides", "chart_data")
    op.drop_column("slides", "chart_type")
