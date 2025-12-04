"""add_image_fields_to_slides

Revision ID: add_image_fields
Revises: 5bfcdac263f5
Create Date: 2025-12-04 12:00:00.000000
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "add_image_fields"
down_revision: Union[str, None] = "5bfcdac263f5"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Add image fields to slides table
    op.add_column("slides", sa.Column("image_url", sa.String(500), nullable=True))
    op.add_column("slides", sa.Column("image_alt", sa.String(255), nullable=True))
    op.add_column("slides", sa.Column("image_credit", sa.String(255), nullable=True))


def downgrade() -> None:
    # Remove image fields from slides table
    op.drop_column("slides", "image_credit")
    op.drop_column("slides", "image_alt")
    op.drop_column("slides", "image_url")
