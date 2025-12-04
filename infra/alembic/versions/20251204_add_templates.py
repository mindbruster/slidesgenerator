"""add_templates

Revision ID: add_templates
Revises: add_new_slide_type_fields
Create Date: 2025-12-04 20:00:00.000000
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "add_templates"
down_revision: Union[str, None] = "add_new_slide_type_fields"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Create templates table
    op.create_table(
        "templates",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("category", sa.String(50), nullable=False),
        sa.Column("theme", sa.String(50), nullable=False, server_default="neobrutalism"),
        sa.Column("thumbnail_url", sa.String(500), nullable=True),
        sa.Column("is_system", sa.Boolean(), nullable=False, server_default="false"),
        sa.Column("is_public", sa.Boolean(), nullable=False, server_default="true"),
        sa.Column("usage_count", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("tags", sa.JSON(), nullable=True),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_templates_category", "templates", ["category"])

    # Create template_slides table
    op.create_table(
        "template_slides",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("template_id", sa.Integer(), nullable=False),
        sa.Column("order", sa.Integer(), nullable=False),
        sa.Column("slide_type", sa.String(50), nullable=False),
        sa.Column("layout", sa.String(20), nullable=False, server_default="center"),
        sa.Column("placeholder_title", sa.String(255), nullable=True),
        sa.Column("placeholder_body", sa.Text(), nullable=True),
        sa.Column("placeholder_bullets", sa.JSON(), nullable=True),
        sa.Column("ai_instructions", sa.Text(), nullable=True),
        sa.Column("is_required", sa.Boolean(), nullable=False, server_default="true"),
        sa.ForeignKeyConstraint(
            ["template_id"], ["templates.id"], ondelete="CASCADE"
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(
        "ix_template_slides_template_id", "template_slides", ["template_id"]
    )


def downgrade() -> None:
    op.drop_index("ix_template_slides_template_id", table_name="template_slides")
    op.drop_table("template_slides")
    op.drop_index("ix_templates_category", table_name="templates")
    op.drop_table("templates")
