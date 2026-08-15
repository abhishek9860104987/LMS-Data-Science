"""Add last_active_at to users table

Revision ID: d3e4f5a6b7c8
Revises: c2d3e4f5a6b7
Create Date: 2026-08-15 16:08:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'd3e4f5a6b7c8'
down_revision = 'c2d3e4f5a6b7'
branch_labels = None
depends_on = None


def upgrade():
    op.add_column('users', sa.Column('last_active_at', sa.DateTime(), nullable=True))


def downgrade():
    op.drop_column('users', 'last_active_at')
