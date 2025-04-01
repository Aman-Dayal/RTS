import pytest
from database.db import get_session  # Changed to absolute import

def test_get_session_yields_session():
    """Test that get_session yields a session object."""
    session_gen = get_session()
    session = next(session_gen)  # Get the session from the generator
    assert session is not None  # Ensure a session is returned

def test_get_session_logs_error_on_exception():
    """Test that an error is logged when an exception occurs."""
    with patch('common.logger.logger.error') as mock_logger:
        with patch('database.db.SessionLocal') as mock_session_local:
            mock_session_local.side_effect = Exception("Test Exception")
            with pytest.raises(Exception):
                next(get_session())  # This should raise an exception
            mock_logger.assert_called_once()  # Ensure the error was logged
