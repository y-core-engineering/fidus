# Fidus CLI

Command-line interface for the Fidus AI Assistant.

## Features

- **Interactive Mode** - Chat with Fidus in your terminal
- **Task Management** - Create and manage tasks
- **Calendar** - View and manage appointments
- **Finance** - Track expenses and budgets
- **Quick Actions** - Execute common operations
- **Configuration** - Manage Fidus settings

## Installation

```bash
# Install globally
pnpm install -g @fidus/cli

# Or use via npx
npx @fidus/cli
```

## Usage

### Interactive Mode

Start an interactive chat session:

```bash
fidus chat
```

### Quick Commands

```bash
# Calendar
fidus calendar list                  # List today's appointments
fidus calendar add "Meeting at 2pm"  # Add appointment
fidus calendar free                  # Show free slots

# Tasks
fidus task create "Buy groceries"    # Create task
fidus task list                      # List tasks
fidus task complete <id>             # Complete task

# Finance
fidus finance summary                # Financial summary
fidus finance add -a 50 -c Food      # Add expense

# Travel
fidus travel search --from SFO --to JFK --date 2024-03-15
fidus travel book <flight-id>

# Status
fidus status                         # System status
fidus config                         # Show configuration
```

### Configuration

```bash
# Set API endpoint
fidus config set api.url http://localhost:8000

# Set authentication token
fidus config set auth.token <your-token>

# Show all config
fidus config list
```

## Project Structure

```
src/
├── cli.ts           # Main CLI entry point
├── commands/        # Command implementations
│   ├── chat.ts      # Interactive chat
│   ├── calendar.ts  # Calendar commands
│   ├── task.ts      # Task commands
│   ├── finance.ts   # Finance commands
│   └── ...          # Other commands
├── utils/           # Utility functions
│   ├── api.ts       # API client
│   ├── format.ts    # Output formatting
│   └── prompt.ts    # Interactive prompts
└── config/          # Configuration management
    └── store.ts     # Config storage
```

## Development

### Building

```bash
# Build CLI
pnpm build

# Watch mode
pnpm dev
```

### Testing

```bash
# Run CLI locally
pnpm start

# Test specific command
node dist/cli.js calendar list
```

## Configuration File

The CLI stores configuration in `~/.config/fidus/config.json`:

```json
{
  "api": {
    "url": "http://localhost:8000",
    "timeout": 30000
  },
  "auth": {
    "token": "your-jwt-token"
  },
  "preferences": {
    "dateFormat": "YYYY-MM-DD",
    "timeFormat": "24h",
    "colorOutput": true
  }
}
```

## Examples

### Morning Briefing

```bash
fidus briefing
```

Shows:
- Today's schedule
- Pending tasks
- Financial summary
- Important notifications

### Quick Add

```bash
# Natural language input
fidus add "Dentist appointment tomorrow at 3pm"
fidus add "Buy milk on the way home"
fidus add "Expense: $25 for lunch"
```

The CLI uses the Orchestration API to intelligently route commands.

### Batch Operations

```bash
# Import calendar from file
fidus calendar import ./events.ics

# Export tasks
fidus task export --format json > tasks.json

# Bulk expense import
fidus finance import ./expenses.csv
```

## Authentication

The CLI uses JWT tokens for authentication:

```bash
# Login
fidus login
# Enter email and password

# Logout
fidus logout

# Check auth status
fidus whoami
```

## Output Formats

Supports multiple output formats:

```bash
# Default table format
fidus calendar list

# JSON output
fidus calendar list --json

# Minimal output (for scripting)
fidus calendar list --quiet
```

## Scripting

The CLI is designed to be scriptable:

```bash
#!/bin/bash
# morning-routine.sh

# Get briefing
fidus briefing --quiet

# Check calendar
EVENTS=$(fidus calendar list --json)

# Process with jq
echo $EVENTS | jq '.[] | select(.priority == "high")'
```
