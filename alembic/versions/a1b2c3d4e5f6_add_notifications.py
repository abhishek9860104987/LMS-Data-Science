"""Add notifications and notification_reads tables

Revision ID: a1b2c3d4e5f6
Revises: b307fb4b62dc
Create Date: 2026-08-03 00:33:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'a1b2c3d4e5f6'
down_revision: Union[str, Sequence[str], None] = 'b307fb4b62dc'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Create notifications and notification_reads tables."""
    op.create_table(
        'notifications',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('title', sa.String(length=200), nullable=False),
        sa.Column('message', sa.Text(), nullable=False),
        sa.Column('notif_type', sa.String(length=30), nullable=False, server_default='GENERAL'),
        sa.Column('recipient_type', sa.String(length=10), nullable=False, server_default='ALL'),
        sa.Column('recipient_user_id', sa.Integer(), nullable=True),
        sa.Column('attachment_url', sa.String(length=500), nullable=True),
        sa.Column('external_link', sa.String(length=500), nullable=True),
        sa.Column('is_pinned', sa.Boolean(), nullable=False, server_default=sa.text('false')),
        sa.Column('expires_at', sa.DateTime(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['recipient_user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index(op.f('ix_notifications_id'), 'notifications', ['id'], unique=False)
    op.create_index('ix_notifications_recipient_type', 'notifications', ['recipient_type'], unique=False)
    op.create_index('ix_notifications_created_at', 'notifications', ['created_at'], unique=False)

    op.create_table(
        'notification_reads',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('notification_id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('read_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['notification_id'], ['notifications.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('notification_id', 'user_id', name='uq_notif_read'),
    )
    op.create_index(op.f('ix_notification_reads_id'), 'notification_reads', ['id'], unique=False)
    op.create_index('ix_notification_reads_notification_id', 'notification_reads', ['notification_id'], unique=False)
    op.create_index('ix_notification_reads_user_id', 'notification_reads', ['user_id'], unique=False)


def downgrade() -> None:
    """Drop notifications and notification_reads tables."""
    op.drop_index('ix_notification_reads_user_id', table_name='notification_reads')
    op.drop_index('ix_notification_reads_notification_id', table_name='notification_reads')
    op.drop_index(op.f('ix_notification_reads_id'), table_name='notification_reads')
    op.drop_table('notification_reads')

    op.drop_index('ix_notifications_created_at', table_name='notifications')
    op.drop_index('ix_notifications_recipient_type', table_name='notifications')
    op.drop_index(op.f('ix_notifications_id'), table_name='notifications')
    op.drop_table('notifications')
