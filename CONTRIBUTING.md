# Contributing to IRONWOOD

Thank you for your interest in contributing to IRONWOOD! This document provides guidelines and instructions for contributing to this project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Branching Strategy](#branching-strategy)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing](#testing)
- [Documentation](#documentation)
- [Issue Reporting](#issue-reporting)
- [Feature Requests](#feature-requests)

## Code of Conduct

Please be respectful and considerate of others when contributing to IRONWOOD. We aim to foster an inclusive and welcoming community.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR-USERNAME/IRONWOOD.git`
3. Add the upstream repository: `git remote add upstream https://github.com/zahidpasha/IRONWOOD.git`
4. Follow the installation instructions in the [README.md](./README.md)

## Development Workflow

Our development workflow follows a feature branch model:

1. Create a new branch from `master` for your feature or bug fix
2. Make your changes in that branch
3. Test your changes thoroughly
4. Submit a pull request to the `master` branch

For more detailed Git workflow information, see our [Git Workflow Guide](./docs/07-Git-Workflow.md).

## Branching Strategy

- `master`: Main development branch, should always be in a deployable state
- `feature/xxx`: For new features
- `bugfix/xxx`: For bug fixes
- `release/x.x.x`: For preparing a new release

## Commit Guidelines

Good commit messages are essential for maintaining a clear project history. Please follow these guidelines:

- Use the format: `[Component] Brief description of change`
- Begin with a capital letter
- Use the imperative mood ("Add feature" not "Added feature")
- Keep the first line under 72 characters
- Reference issues and pull requests when relevant

Example:
```
[Dashboard] Add property comparison chart

This adds a new chart component to compare multiple property metrics
side by side. Closes #123.
```

## Pull Request Process

1. Update the README.md or relevant documentation with details of your changes if appropriate
2. Ensure your code follows the project's coding standards
3. Make sure all tests pass
4. Ensure your PR description clearly describes the problem and solution
5. Request a review from at least one maintainer
6. Address any feedback provided during code review

## Testing

All new features and bug fixes should include appropriate tests:

- Unit tests for individual components and functions
- Integration tests for interactions between components
- End-to-end tests for user flows when appropriate

Run tests before submitting a PR:
```bash
npm run test
```

## Documentation

Good documentation is crucial for maintaining the project:

- Update relevant documentation when making changes
- Add JSDoc comments to functions and components
- Document complex algorithms or business logic
- Update the README.md with any necessary changes

## Issue Reporting

When reporting issues, please include:

1. A clear and descriptive title
2. Steps to reproduce the issue
3. Expected behavior
4. Actual behavior
5. Screenshots if applicable
6. Your environment (OS, browser, Node.js version, etc.)

## Feature Requests

We welcome feature requests! When submitting a feature request:

1. Clearly describe the problem the feature would solve
2. Suggest a solution if possible
3. Explain how this feature would benefit the project
4. Provide examples of similar features in other projects if relevant

Thank you for contributing to IRONWOOD! 