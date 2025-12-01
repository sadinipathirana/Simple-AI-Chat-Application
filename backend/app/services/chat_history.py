"""Chat history persistence service"""

import sqlite3
from datetime import datetime
from pathlib import Path
from typing import List, Dict, Optional
import uuid


class ChatHistoryService:
    """Service for managing chat history with SQLite"""

    DB_PATH = Path(__file__).parent.parent.parent / "chat_history.db"

    @staticmethod
    def _get_connection():
        """Get database connection"""
        conn = sqlite3.connect(ChatHistoryService.DB_PATH)
        conn.row_factory = sqlite3.Row
        return conn

    @staticmethod
    def _init_db():
        """Initialize database tables"""
        conn = ChatHistoryService._get_connection()
        cursor = conn.cursor()

        cursor.execute("""
            CREATE TABLE IF NOT EXISTS chat_sessions (
                session_id TEXT PRIMARY KEY,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)

        cursor.execute("""
            CREATE TABLE IF NOT EXISTS chat_messages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                session_id TEXT NOT NULL,
                role TEXT NOT NULL,
                content TEXT NOT NULL,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (session_id) REFERENCES chat_sessions(session_id)
            )
        """)

        cursor.execute("""
            CREATE INDEX IF NOT EXISTS idx_session_id
            ON chat_messages(session_id)
        """)

        conn.commit()
        conn.close()

    @staticmethod
    def save_message(session_id: str, role: str, content: str):
        """Save a chat message to the database"""

        ChatHistoryService._init_db()
        conn = ChatHistoryService._get_connection()
        cursor = conn.cursor()

        # Create or update session
        cursor.execute("""
            INSERT OR REPLACE INTO chat_sessions(session_id, updated_at)
            VALUES (?, CURRENT_TIMESTAMP)
        """, (session_id,))

        # Insert message
        cursor.execute("""
            INSERT INTO chat_messages(session_id, role, content)
            VALUES (?, ?, ?)
        """, (session_id, role, content))

        conn.commit()
        conn.close()

    @staticmethod
    def get_history(session_id: str) -> List[Dict]:
        """Get chat history for a session"""

        ChatHistoryService._init_db()
        conn = ChatHistoryService._get_connection()
        cursor = conn.cursor()

        cursor.execute("""
            SELECT role, content, timestamp
            FROM chat_messages
            WHERE session_id = ?
            ORDER BY timestamp ASC
        """, (session_id,))

        rows = cursor.fetchall()
        conn.close()

        return [
            {
                "role": row["role"],
                "content": row["content"],
                "timestamp": row["timestamp"]
            }
            for row in rows
        ]

    @staticmethod
    def create_session() -> str:
        """Create a new chat session and return the ID"""

        session_id = str(uuid.uuid4())

        ChatHistoryService._init_db()
        conn = ChatHistoryService._get_connection()
        cursor = conn.cursor()

        cursor.execute("""
            INSERT INTO chat_sessions(session_id)
            VALUES (?)
        """, (session_id,))

        conn.commit()
        conn.close()
        return session_id

    @staticmethod
    def get_all_sessions() -> List[Dict]:
        """Get all chat sessions ordered by most recent"""

        ChatHistoryService._init_db()
        conn = ChatHistoryService._get_connection()
        cursor = conn.cursor()

        cursor.execute("""
            SELECT session_id, created_at, updated_at
            FROM chat_sessions
            ORDER BY updated_at DESC
        """)

        rows = cursor.fetchall()
        conn.close()

        return [
            {
                "session_id": row["session_id"],
                "created_at": row["created_at"],
                "updated_at": row["updated_at"]
            }
            for row in rows
        ]

    @staticmethod
    def delete_session(session_id: str) -> bool:
        """Delete a chat session and all its messages"""

        ChatHistoryService._init_db()
        conn = ChatHistoryService._get_connection()
        cursor = conn.cursor()

        try:
            # Delete messages first (foreign key constraint)
            cursor.execute("""
                DELETE FROM chat_messages
                WHERE session_id = ?
            """, (session_id,))

            # Delete session
            cursor.execute("""
                DELETE FROM chat_sessions
                WHERE session_id = ?
            """, (session_id,))

            conn.commit()
            return True
        except Exception as e:
            print(f"Error deleting session: {e}")
            return False
        finally:
            conn.close()












