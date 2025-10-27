# Contributing to Fidus

Thank you for your interest in contributing to Fidus! We welcome contributions from the community.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Documentation](#documentation)
- [Pull Request Process](#pull-request-process)
- [Community](#community)

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inclusive experience for everyone. We expect all participants to:

- **Be respectful** - Value differing opinions and experiences
- **Be collaborative** - Work together towards common goals
- **Be professional** - Focus on what's best for the community
- **Be inclusive** - Welcome newcomers and help them learn

### Unacceptable Behavior

- Harassment, discrimination, or exclusionary behavior
- Trolling, insulting comments, or personal attacks
- Publishing others' private information
- Any conduct inappropriate in a professional setting

### Reporting

Report unacceptable behavior to: conduct@fidus.ai

All reports will be handled confidentially.

## How Can I Contribute?

### 🐛 Reporting Bugs

**Before submitting:**
1. Check [existing issues](https://github.com/yourusername/fidus/issues)
2. Update to the latest version
3. Check the [FAQ](docs/licensing/FAQ.md)

**When submitting:**
- Use the bug report template
- Include detailed steps to reproduce
- Provide system information (OS, Python version, etc.)
- Include relevant logs and error messages
- Add screenshots if applicable

### 💡 Suggesting Features

**Before suggesting:**
1. Check [existing feature requests](https://github.com/yourusername/fidus/issues?q=is%3Aissue+label%3Aenhancement)
2. Review the [roadmap](README.md#-roadmap)
3. Consider if it fits Fidus's scope

**When suggesting:**
- Use the feature request template
- Explain the use case clearly
- Describe expected behavior
- Consider implementation complexity
- Discuss alternatives you've considered

### 📖 Improving Documentation

Documentation improvements are always welcome:
- Fix typos and grammar
- Clarify confusing sections
- Add examples and tutorials
- Translate to other languages
- Improve API documentation

### 💻 Contributing Code

We welcome code contributions! See [Development Workflow](#development-workflow) below.

### 🎨 Design and UX

Help improve Fidus's user experience:
- UI/UX design improvements
- Accessibility enhancements
- Icon and illustration design
- User research and feedback

## Development Setup

### Prerequisites

- **Node.js** 20+ and **pnpm** 8+
- **Python** 3.11+
- **PostgreSQL** 15+
- **Redis** 7+
- **Git**

### Clone and Setup

```bash
# Fork the repository on GitHub first, then:

# Clone your fork
git clone https://github.com/YOUR_USERNAME/fidus.git
cd fidus

# Add upstream remote
git remote add upstream https://github.com/yourusername/fidus.git

# Install dependencies
pnpm install

# Setup API package
cd packages/api
poetry install
cd ../..

# Copy environment variables
cp .env.example .env
# Edit .env with your configuration

# Start databases (Docker)
docker-compose up -d postgres redis neo4j

# Run migrations
cd packages/api
poetry run alembic upgrade head
cd ../..

# Start development servers
pnpm dev
```

This starts:
- **API:** http://localhost:8000
- **Web:** http://localhost:3000
- **API Docs:** http://localhost:8000/docs

### Verify Setup

```bash
# Run tests
pnpm test

# Run linters
pnpm lint

# Type check
pnpm typecheck
```

## Project Structure

```
fidus/
├── packages/
│   ├── api/              # FastAPI backend (Python)
│   │   ├── fidus/
│   │   │   ├── api/      # REST API routes
│   │   │   ├── domain/   # Domain logic (DDD)
│   │   │   └── infrastructure/  # External services
│   │   └── tests/
│   ├── web/              # Next.js frontend
│   │   └── src/
│   │       ├── app/      # Next.js pages
│   │       ├── components/  # React components
│   │       └── lib/      # Utilities
│   ├── cli/              # Command-line interface
│   │   └── src/
│   │       ├── commands/ # CLI commands
│   │       └── utils/    # CLI utilities
│   └── shared/           # Shared types and utilities
│       └── src/
│           ├── types/    # TypeScript types
│           ├── schemas/  # Zod schemas
│           └── utils/    # Shared utilities
├── docs/                 # Documentation
│   ├── architecture/     # Architecture docs
│   ├── domain-model/     # DDD domain models
│   └── licensing/        # Licensing docs
├── .github/              # GitHub configuration
│   └── workflows/        # CI/CD workflows
└── docker-compose.yml    # Development services
```

## Development Workflow

### 1. Choose an Issue

- Browse [open issues](https://github.com/yourusername/fidus/issues)
- Look for issues labeled `good first issue` or `help wanted`
- Comment on the issue to claim it
- Wait for maintainer approval before starting

### 2. Create a Branch

```bash
# Update your fork
git checkout main
git pull upstream main

# Create a feature branch
git checkout -b feature/your-feature-name

# Or for bug fixes
git checkout -b fix/bug-description
```

Branch naming convention:
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation changes
- `refactor/` - Code refactoring
- `test/` - Test improvements
- `chore/` - Maintenance tasks

### 3. Make Changes

**Follow coding standards:**
- Write clean, readable code
- Add comments for complex logic
- Follow existing code style
- Keep changes focused and atomic

**Write tests:**
- Add tests for new features
- Update tests for modified code
- Ensure all tests pass

**Update documentation:**
- Update relevant documentation
- Add docstrings to functions
- Update API documentation

### 4. Commit Changes

Use [Conventional Commits](https://www.conventionalcommits.org/):

```bash
# Format: <type>(<scope>): <description>

git commit -m "feat(calendar): add recurring event support"
git commit -m "fix(auth): resolve token expiration issue"
git commit -m "docs(api): update authentication examples"
git commit -m "test(finance): add budget calculation tests"
```

**Commit types:**
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `style:` - Code style (formatting, no logic change)
- `refactor:` - Code refactoring
- `test:` - Tests
- `chore:` - Maintenance

### 5. Push and Create PR

```bash
# Push to your fork
git push origin feature/your-feature-name

# Create Pull Request on GitHub
```

## Coding Standards

### Python (API Package)

**Style:**
- Follow [PEP 8](https://pep8.org/)
- Use Black for formatting (100 char line length)
- Use Ruff for linting
- Use type hints (mypy strict mode)

**Example:**
```python
from typing import List, Optional
from pydantic import BaseModel


class Appointment(BaseModel):
    """Represents a calendar appointment."""

    id: str
    title: str
    start_time: datetime
    end_time: datetime
    attendees: List[str] = []

    def duration_minutes(self) -> int:
        """Calculate duration in minutes."""
        return int((self.end_time - self.start_time).total_seconds() / 60)
```

**Run formatters:**
```bash
cd packages/api
poetry run black .
poetry run ruff check . --fix
poetry run mypy .
```

### TypeScript (Web, CLI, Shared)

**Style:**
- Use TypeScript strict mode
- Use ESLint for linting
- Use Prettier for formatting
- Prefer functional components (React)

**Example:**
```typescript
interface AppointmentProps {
  appointment: Appointment;
  onUpdate: (appointment: Appointment) => void;
}

export function AppointmentCard({ appointment, onUpdate }: AppointmentProps) {
  const duration = useMemo(() => {
    return formatDuration(appointment.startTime, appointment.endTime);
  }, [appointment.startTime, appointment.endTime]);

  return (
    <Card>
      <CardTitle>{appointment.title}</CardTitle>
      <CardContent>{duration}</CardContent>
    </Card>
  );
}
```

**Run formatters:**
```bash
pnpm lint
pnpm format
pnpm typecheck
```

### General Guidelines

**Naming conventions:**
- `PascalCase` - Classes, types, components
- `camelCase` - Functions, variables
- `SCREAMING_SNAKE_CASE` - Constants
- `kebab-case` - File names

**File organization:**
- One component per file
- Co-locate related files
- Use index files for barrel exports
- Group by feature, not by type

**Comments:**
- Explain **why**, not **what**
- Use docstrings for public APIs
- Keep comments up-to-date
- Remove commented-out code

## Testing

### Python Tests (pytest)

```bash
cd packages/api

# Run all tests
poetry run pytest

# Run with coverage
poetry run pytest --cov=fidus --cov-report=html

# Run specific test file
poetry run pytest tests/domain/test_calendar.py

# Run with verbose output
poetry run pytest -v

# Run only failed tests
poetry run pytest --lf
```

**Test structure:**
```python
import pytest
from fidus.domain.calendar import Appointment


class TestAppointment:
    """Tests for Appointment aggregate."""

    def test_create_appointment(self):
        """Should create a valid appointment."""
        appointment = Appointment(
            id="123",
            title="Meeting",
            start_time=datetime(2024, 1, 1, 10, 0),
            end_time=datetime(2024, 1, 1, 11, 0),
        )

        assert appointment.title == "Meeting"
        assert appointment.duration_minutes() == 60

    def test_overlapping_appointments(self):
        """Should detect overlapping appointments."""
        # Test implementation
        pass
```

### TypeScript Tests (Jest/Vitest)

```bash
# Run all tests
pnpm test

# Run specific package tests
pnpm --filter @fidus/web test

# Run with coverage
pnpm test -- --coverage

# Watch mode
pnpm test -- --watch
```

### Test Coverage

- Aim for **> 80% coverage** for new code
- **100% coverage** for critical paths
- Test edge cases and error conditions
- Use fixtures and factories for test data

## Documentation

### Code Documentation

**Python (docstrings):**
```python
def calculate_budget_utilization(
    budget: Budget,
    transactions: List[Transaction]
) -> float:
    """Calculate percentage of budget utilized.

    Args:
        budget: The budget to check
        transactions: List of transactions in the budget period

    Returns:
        Percentage of budget utilized (0.0 to 100.0+)

    Raises:
        ValueError: If budget amount is zero or negative

    Example:
        >>> budget = Budget(amount=1000, category="Food")
        >>> transactions = [Transaction(amount=250), Transaction(amount=150)]
        >>> calculate_budget_utilization(budget, transactions)
        40.0
    """
    if budget.amount <= 0:
        raise ValueError("Budget amount must be positive")

    spent = sum(t.amount for t in transactions)
    return (spent / budget.amount) * 100
```

**TypeScript (JSDoc):**
```typescript
/**
 * Calculate the duration between two dates in minutes.
 *
 * @param start - Start date/time
 * @param end - End date/time
 * @returns Duration in minutes
 * @throws {Error} If end is before start
 *
 * @example
 * ```typescript
 * const duration = calculateDuration(
 *   new Date('2024-01-01T10:00'),
 *   new Date('2024-01-01T11:30')
 * );
 * // Returns: 90
 * ```
 */
export function calculateDuration(start: Date, end: Date): number {
  if (end < start) {
    throw new Error('End time must be after start time');
  }
  return (end.getTime() - start.getTime()) / (1000 * 60);
}
```

### User Documentation

Located in `docs/`:
- Use clear, simple language
- Include code examples
- Add screenshots where helpful
- Keep up-to-date with code changes

## Pull Request Process

### Before Submitting

**Checklist:**
- [ ] Code follows style guidelines
- [ ] All tests pass locally
- [ ] Added tests for new features
- [ ] Updated documentation
- [ ] Commits follow conventional commits
- [ ] Branch is up-to-date with main
- [ ] No merge conflicts

### PR Template

Use the provided PR template:

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Related Issues
Fixes #123

## Testing
How has this been tested?

## Screenshots
If applicable

## Checklist
- [ ] Tests pass
- [ ] Documentation updated
- [ ] No breaking changes (or documented)
```

### Review Process

1. **Automated checks** run (CI/CD)
2. **Maintainer review** (1-2 business days)
3. **Address feedback** if requested
4. **Approval and merge** by maintainer

### After Merge

- Delete your feature branch
- Update your fork's main branch
- Celebrate! 🎉

## Community

### Communication Channels

- **GitHub Discussions:** Questions and ideas
- **Discord:** Real-time chat
- **Twitter:** [@FidusAI](https://twitter.com/FidusAI)
- **Email:** hello@fidus.ai

### Regular Events

- **Office Hours:** First Friday of each month
- **Community Call:** Monthly (announced on Discord)
- **Contributor Meetup:** Quarterly

### Recognition

Contributors are recognized:
- In release notes
- On our website
- In [CONTRIBUTORS.md](CONTRIBUTORS.md)
- With swag for significant contributions!

## Questions?

- **General:** hello@fidus.ai
- **Technical:** dev@fidus.ai
- **Security:** security@fidus.ai

Or ask in [GitHub Discussions](https://github.com/yourusername/fidus/discussions)

---

Thank you for contributing to Fidus! 💙

**Built with ❤️ by the community**
