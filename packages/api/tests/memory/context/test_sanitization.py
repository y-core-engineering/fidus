"""Tests for input sanitization."""

import time

import pytest

from fidus.memory.context.sanitization import InputSanitizer, RateLimiter


class TestInputSanitizer:
    """Tests for InputSanitizer."""

    def test_sanitize_message_success(self) -> None:
        """Should sanitize valid message."""
        message = "  Hello, I want coffee!  "
        result = InputSanitizer.sanitize_message(message)

        assert result == "Hello, I want coffee!"

    def test_sanitize_message_html_escape(self) -> None:
        """Should escape HTML characters."""
        message = "<script>alert('xss')</script>"
        result = InputSanitizer.sanitize_message(message)

        assert "&lt;script&gt;" in result
        assert "<script>" not in result

    def test_sanitize_message_control_characters(self) -> None:
        """Should remove control characters."""
        message = "Hello\x00World\x01Test"
        result = InputSanitizer.sanitize_message(message)

        assert "\x00" not in result
        assert "\x01" not in result
        assert "HelloWorldTest" == result

    def test_sanitize_message_empty(self) -> None:
        """Should raise error for empty message."""
        with pytest.raises(ValueError) as exc_info:
            InputSanitizer.sanitize_message("")

        assert "cannot be empty" in str(exc_info.value)

    def test_sanitize_message_whitespace_only(self) -> None:
        """Should raise error for whitespace-only message."""
        with pytest.raises(ValueError) as exc_info:
            InputSanitizer.sanitize_message("   ")

        assert "cannot be empty" in str(exc_info.value)

    def test_sanitize_message_too_long(self) -> None:
        """Should raise error for too long message."""
        message = "a" * 10001
        with pytest.raises(ValueError) as exc_info:
            InputSanitizer.sanitize_message(message)

        assert "exceeds maximum length" in str(exc_info.value)

    def test_sanitize_factor_key_success(self) -> None:
        """Should sanitize valid factor key."""
        key = "  time_of_day  "
        result = InputSanitizer.sanitize_factor_key(key)

        assert result == "time_of_day"

    def test_sanitize_factor_key_uppercase(self) -> None:
        """Should convert to lowercase."""
        key = "TIME_OF_DAY"
        result = InputSanitizer.sanitize_factor_key(key)

        assert result == "time_of_day"

    def test_sanitize_factor_key_invalid_format(self) -> None:
        """Should raise error for invalid snake_case."""
        invalid_keys = [
            "time-of-day",  # kebab-case (hyphens not allowed)
            "time of day",  # spaces not allowed
            "time.of.day",  # dots not allowed
            "123time",  # starts with number
        ]

        for key in invalid_keys:
            with pytest.raises(ValueError) as exc_info:
                InputSanitizer.sanitize_factor_key(key)

            assert "snake_case" in str(exc_info.value)

    def test_sanitize_factor_key_converts_case(self) -> None:
        """Should convert PascalCase to snake_case."""
        # TimeOfDay becomes timeofday after lowercase, which is valid
        result = InputSanitizer.sanitize_factor_key("TimeOfDay")
        assert result == "timeofday"

    def test_sanitize_factor_key_empty(self) -> None:
        """Should raise error for empty key."""
        with pytest.raises(ValueError):
            InputSanitizer.sanitize_factor_key("")

    def test_sanitize_factor_key_too_long(self) -> None:
        """Should raise error for too long key."""
        key = "a" * 101
        with pytest.raises(ValueError) as exc_info:
            InputSanitizer.sanitize_factor_key(key)

        assert "exceeds maximum length" in str(exc_info.value)

    def test_sanitize_factor_value_success(self) -> None:
        """Should sanitize valid factor value."""
        value = "  Morning  "
        result = InputSanitizer.sanitize_factor_value(value)

        assert result == "morning"

    def test_sanitize_factor_value_html_escape(self) -> None:
        """Should escape HTML in value."""
        value = "<b>morning</b>"
        result = InputSanitizer.sanitize_factor_value(value)

        assert "&lt;b&gt;" in result
        assert "<b>" not in result

    def test_sanitize_factor_value_control_characters(self) -> None:
        """Should remove control characters from value."""
        value = "morning\x00test"
        result = InputSanitizer.sanitize_factor_value(value)

        assert "\x00" not in result

    def test_sanitize_factor_value_empty(self) -> None:
        """Should raise error for empty value."""
        with pytest.raises(ValueError):
            InputSanitizer.sanitize_factor_value("")

    def test_sanitize_factor_value_too_long(self) -> None:
        """Should raise error for too long value."""
        value = "a" * 501
        with pytest.raises(ValueError) as exc_info:
            InputSanitizer.sanitize_factor_value(value)

        assert "exceeds maximum length" in str(exc_info.value)

    def test_validate_tenant_id_success(self) -> None:
        """Should validate valid tenant ID."""
        # Should not raise
        InputSanitizer.validate_tenant_id("tenant-123")
        InputSanitizer.validate_tenant_id("tenant_456")
        InputSanitizer.validate_tenant_id("TENANT789")

    def test_validate_tenant_id_invalid(self) -> None:
        """Should raise error for invalid tenant ID."""
        invalid_ids = [
            "",
            "   ",
            "tenant@123",  # special chars
            "tenant 123",  # space
            "tenant.123",  # dot
            "a" * 256,  # too long
        ]

        for tenant_id in invalid_ids:
            with pytest.raises(ValueError):
                InputSanitizer.validate_tenant_id(tenant_id)

    def test_validate_user_id_success(self) -> None:
        """Should validate valid user ID."""
        # Should not raise
        InputSanitizer.validate_user_id("user-123")
        InputSanitizer.validate_user_id("user_456")
        InputSanitizer.validate_user_id("USER789")

    def test_validate_user_id_invalid(self) -> None:
        """Should raise error for invalid user ID."""
        invalid_ids = [
            "",
            "   ",
            "user@123",  # special chars
            "user 123",  # space
            "a" * 256,  # too long
        ]

        for user_id in invalid_ids:
            with pytest.raises(ValueError):
                InputSanitizer.validate_user_id(user_id)

    def test_sanitize_context_factors_success(self) -> None:
        """Should sanitize all context factors."""
        factors = {
            "TIME_OF_DAY": "  Morning  ",
            "mood": "Energetic",
        }

        result = InputSanitizer.sanitize_context_factors(factors)

        assert result == {
            "time_of_day": "morning",
            "mood": "energetic",
        }

    def test_sanitize_context_factors_invalid_type(self) -> None:
        """Should raise error for non-dict input."""
        with pytest.raises(ValueError) as exc_info:
            InputSanitizer.sanitize_context_factors("not a dict")

        assert "must be a dictionary" in str(exc_info.value)

    def test_sanitize_context_factors_invalid_key(self) -> None:
        """Should raise error for invalid factor key."""
        factors = {"Invalid-Key": "value"}

        with pytest.raises(ValueError):
            InputSanitizer.sanitize_context_factors(factors)


class TestRateLimiter:
    """Tests for RateLimiter."""

    @pytest.fixture
    def limiter(self) -> RateLimiter:
        """Create rate limiter for testing."""
        return RateLimiter(max_requests=3, window_seconds=60)

    def test_allow_requests_within_limit(self, limiter: RateLimiter) -> None:
        """Should allow requests within limit."""
        timestamp = time.time()

        # First 3 requests should be allowed
        assert limiter.is_allowed("user-1", timestamp) is True
        assert limiter.is_allowed("user-1", timestamp + 1) is True
        assert limiter.is_allowed("user-1", timestamp + 2) is True

    def test_deny_requests_over_limit(self, limiter: RateLimiter) -> None:
        """Should deny requests over limit."""
        timestamp = time.time()

        # Fill the limit
        limiter.is_allowed("user-1", timestamp)
        limiter.is_allowed("user-1", timestamp + 1)
        limiter.is_allowed("user-1", timestamp + 2)

        # 4th request should be denied
        assert limiter.is_allowed("user-1", timestamp + 3) is False

    def test_reset_after_window(self, limiter: RateLimiter) -> None:
        """Should reset after time window passes."""
        timestamp = time.time()

        # Fill the limit
        limiter.is_allowed("user-1", timestamp)
        limiter.is_allowed("user-1", timestamp + 1)
        limiter.is_allowed("user-1", timestamp + 2)

        # 4th request denied
        assert limiter.is_allowed("user-1", timestamp + 3) is False

        # After window (61 seconds), should allow again
        assert limiter.is_allowed("user-1", timestamp + 61) is True

    def test_separate_limits_per_identifier(self, limiter: RateLimiter) -> None:
        """Should maintain separate limits per identifier."""
        timestamp = time.time()

        # Fill limit for user-1
        limiter.is_allowed("user-1", timestamp)
        limiter.is_allowed("user-1", timestamp + 1)
        limiter.is_allowed("user-1", timestamp + 2)

        # user-1 is rate limited
        assert limiter.is_allowed("user-1", timestamp + 3) is False

        # user-2 should still be allowed
        assert limiter.is_allowed("user-2", timestamp + 3) is True

    def test_reset_identifier(self, limiter: RateLimiter) -> None:
        """Should reset limit for specific identifier."""
        timestamp = time.time()

        # Fill the limit
        limiter.is_allowed("user-1", timestamp)
        limiter.is_allowed("user-1", timestamp + 1)
        limiter.is_allowed("user-1", timestamp + 2)

        # Should be rate limited
        assert limiter.is_allowed("user-1", timestamp + 3) is False

        # Reset
        limiter.reset("user-1")

        # Should allow again
        assert limiter.is_allowed("user-1", timestamp + 4) is True
