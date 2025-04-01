import pytest
from common.security import some_security_function  # Changed to absolute import

def test_security_function():
    result = some_security_function("input_data")  # Adjust the input as necessary
    assert result == "expected_output"  # Adjust the expected output as necessary

# Add more tests for other common functions as needed
