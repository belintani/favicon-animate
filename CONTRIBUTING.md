# Contributing to favicon-animate

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing.

## Code of Conduct

Be respectful and constructive in all interactions with other contributors.

## Getting Started

### Prerequisites

- Node.js 16+
- pnpm 8+

### Setup

```bash
# Clone the repository
git clone https://github.com/belintani/favicon-animate.git
cd favicon-animate

# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run tests
pnpm test
```

## Development Workflow

### Creating a Feature

1. Create a new branch from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes in the appropriate package:
   - `packages/core/` for core functionality
   - `packages/utils/` for advanced features

3. Write tests for your changes:
   ```bash
   pnpm test
   ```

4. Build and verify:
   ```bash
   pnpm build
   ```

5. Commit with a descriptive message:
   ```bash
   git commit -m "feat: add your feature description"
   ```

### Commit Message Format

Use conventional commits:
- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation
- `test:` for tests
- `refactor:` for code refactoring
- `perf:` for performance improvements

Example: `feat: add GIF animation support`

## Project Structure

```
favicon-animate/
├── packages/
│   ├── core/          # Lightweight core library
│   └── utils/         # Advanced utilities
├── examples/          # Framework examples
├── docs/              # Documentation
└── website/           # Interactive documentation site
```

## Code Style

- Use TypeScript for type safety
- Follow ESLint rules
- Format code with Prettier

```bash
# Format code
pnpm format

# Lint code
pnpm lint
```

## Testing

All new features should include tests:

```bash
# Run tests
pnpm test

# Run tests in watch mode
pnpm test --watch
```

## Documentation

- Update `docs/api.md` for API changes
- Update `docs/examples.md` for new examples
- Update `README.md` for significant changes

## Pull Request Process

1. Ensure all tests pass: `pnpm test`
2. Ensure code is formatted: `pnpm format`
3. Ensure no linting errors: `pnpm lint`
4. Create a descriptive PR title
5. Reference any related issues
6. Wait for review and feedback

## Reporting Issues

When reporting bugs, please include:
- Browser and version
- Steps to reproduce
- Expected behavior
- Actual behavior
- Code example if possible

## Questions?

- Open an issue on GitHub
- Check existing documentation
- Review examples in the `examples/` directory

Thank you for contributing! 🎉
