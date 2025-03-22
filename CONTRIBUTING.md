# Contributing to IRONWOOD

Thank you for your interest in contributing to the IRONWOOD project. This document outlines our development workflow and expectations.

## Development Workflow

1. **Issue Management**
   - All work should be tied to a GitHub issue
   - New features and bugs should use the corresponding issue templates
   - Issues should be properly labeled for easy triage and categorization

2. **Branching Strategy**
   - Always create a new branch for each issue you work on
   - Use the following naming convention:
     - `feature/issue-number-short-description` for new features
     - `bug/issue-number-short-description` for bug fixes
     - `refactor/issue-number-short-description` for code refactoring
   - Example: `feature/42-physician-analytics`

3. **Development Process**
   - Pull the latest changes from `main` before creating a new branch
   - Make small, focused commits with clear messages
   - Commit frequently to avoid large bottlenecking of commits
   - Keep the code clean, clear, and focused

4. **Code Quality**
   - Follow the project's style guidelines
   - Write maintainable, modular code
   - Consider performance implications, especially for real-time data
   - Document complex logic with clear comments

5. **Testing Requirements**
   - Test your changes thoroughly in all relevant dashboard views
   - Ensure responsive design works on various screen sizes
   - Verify that animations and transitions function correctly

6. **Pull Requests**
   - Create a PR when your feature or bugfix is complete
   - Fill out the PR template completely
   - Reference the issue number in the PR description
   - Wait for required reviews and address any feedback

7. **Code Reviews**
   - Reviews should focus on functionality, code quality, and adherence to requirements
   - Be respectful and constructive in feedback
   - Approval is required before merging

## Design Principles

The IRONWOOD dashboard follows these key design principles:

- **Futuristic Glassmorphic UI**: Use glass-like effects, blur, and transparency
- **Responsive Design**: All components must work well on any screen size
- **Performance First**: Optimize for smooth animations and real-time data
- **Consistent Theming**: Follow the established color scheme and design patterns
- **Intuitive User Experience**: Focus on clarity and ease of use

## Technical Standards

- TypeScript for type safety
- React and Next.js for frontend
- TailwindCSS for styling
- Framer Motion for animations
- Recharts for data visualization

## Project Roadmap

Refer to the README.md for the current project roadmap, milestones, and sprint planning.

## Questions?

If you have any questions about the contribution process, please reach out to the project maintainers. 