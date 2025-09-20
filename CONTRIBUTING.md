# Contributing to ReWise AI

Thank you for your interest in contributing to ReWise AI! This document provides guidelines and information for contributors.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Process](#development-process)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Pull Request Process](#pull-request-process)
- [Issue Reporting](#issue-reporting)
- [Beta Testing](#beta-testing)

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inspiring community for all. Please read and follow our [Code of Conduct](CODE_OF_CONDUCT.md).

### Expected Behavior

- Use welcoming and inclusive language
- Be respectful of differing viewpoints and experiences
- Gracefully accept constructive criticism
- Focus on what is best for the community
- Show empathy towards other community members

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Git
- Firebase account
- Google Gemini API key

### Development Setup

1. **Fork the repository**
   ```bash
   # Fork on GitHub, then clone your fork
   git clone https://github.com/yourusername/beta-testing.git
   cd beta-testing
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your API keys
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   ```
   http://localhost:5173
   ```

## Development Process

### Branch Naming

Use descriptive branch names:
- `feature/add-new-filter-option`
- `fix/pdf-upload-bug`
- `docs/update-api-documentation`
- `refactor/optimize-rag-pipeline`

### Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
type(scope): description

[optional body]

[optional footer(s)]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(rag): add semantic chunking for better context retrieval
fix(auth): resolve Google sign-in timeout issue
docs(api): update Gemini API documentation
refactor(ui): optimize component rendering performance
```

### Workflow

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write clean, readable code
   - Add tests for new functionality
   - Update documentation as needed

3. **Test your changes**
   ```bash
   npm run test
   npm run lint
   npm run type-check
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat(component): add new feature"
   ```

5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request**
   - Use the PR template
   - Provide clear description
   - Link related issues
   - Request reviews from maintainers

## Coding Standards

### TypeScript

- Use strict TypeScript configuration
- Define proper interfaces and types
- Avoid `any` type unless absolutely necessary
- Use meaningful variable and function names

### React

- Use functional components with hooks
- Prefer `useCallback` and `useMemo` for performance
- Keep components small and focused
- Use proper prop types and interfaces

### Styling

- Use Tailwind CSS utility classes
- Follow the existing design system
- Ensure responsive design
- Maintain accessibility standards

### File Organization

```
components/
├── ui/           # Reusable UI components
├── blocks/       # Complex UI blocks
├── icons/        # Icon components
└── [feature]/    # Feature-specific components

services/
├── api/          # API service functions
├── utils/        # Utility functions
└── types/        # Type definitions
```

## Testing

### Unit Tests

Write unit tests for:
- Utility functions
- Service functions
- Component logic
- Custom hooks

```typescript
// Example test
describe('RAGPipeline', () => {
  it('should process PDF text correctly', async () => {
    const pipeline = new RAGPipeline();
    const result = await pipeline.processPDF('test content');
    expect(result).toBeDefined();
  });
});
```

### Integration Tests

Test complete user flows:
- PDF upload and processing
- Flashcard generation
- User authentication
- Data persistence

### E2E Tests

Test critical user journeys:
- Complete study session
- User registration and login
- Subscription upgrade flow

### Running Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests with UI
npm run test:ui
```

## Pull Request Process

### Before Submitting

- [ ] Code follows project standards
- [ ] Tests pass and coverage is adequate
- [ ] Documentation is updated
- [ ] No console errors or warnings
- [ ] Performance impact is considered

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes (or documented)

## Screenshots (if applicable)
Add screenshots to help explain your changes

## Related Issues
Closes #123
```

### Review Process

1. **Automated Checks**
   - CI/CD pipeline runs tests
   - Code quality checks
   - Security scans

2. **Manual Review**
   - Code review by maintainers
   - Design review if UI changes
   - Performance review if applicable

3. **Approval**
   - At least one approval required
   - All checks must pass
   - No conflicts with main branch

## Issue Reporting

### Bug Reports

Use the bug report template:

```markdown
**Describe the bug**
A clear description of what the bug is

**To Reproduce**
Steps to reproduce the behavior

**Expected behavior**
What you expected to happen

**Screenshots**
If applicable, add screenshots

**Environment**
- OS: [e.g. iOS, Windows, Linux]
- Browser: [e.g. Chrome, Safari]
- Version: [e.g. 1.0.0-beta]

**Additional context**
Add any other context about the problem
```

### Feature Requests

Use the feature request template:

```markdown
**Is your feature request related to a problem?**
A clear description of what the problem is

**Describe the solution you'd like**
A clear description of what you want to happen

**Describe alternatives you've considered**
A clear description of any alternative solutions

**Additional context**
Add any other context or screenshots
```

## Beta Testing

### Testing Focus Areas

1. **Core Functionality**
   - PDF upload and processing
   - Flashcard generation
   - Study interface
   - Progress tracking

2. **Performance**
   - Large PDF handling
   - Memory usage
   - Response times
   - Mobile performance

3. **User Experience**
   - Navigation flow
   - Error handling
   - Loading states
   - Accessibility

4. **Edge Cases**
   - Invalid PDFs
   - Network issues
   - Browser compatibility
   - Different screen sizes

### Testing Guidelines

1. **Test on Multiple Devices**
   - Desktop (Chrome, Firefox, Safari)
   - Mobile (iOS, Android)
   - Tablet (iPad, Android tablets)

2. **Test Different PDF Types**
   - Text-heavy documents
   - Image-heavy documents
   - Mixed content
   - Large files (>100 pages)

3. **Test User Flows**
   - Complete study session
   - User registration
   - Subscription upgrade
   - Data persistence

### Reporting Issues

1. **Use GitHub Issues**
   - Provide detailed reproduction steps
   - Include screenshots/videos
   - Specify environment details

2. **Priority Levels**
   - **Critical**: App crashes, data loss
   - **High**: Major functionality broken
   - **Medium**: Minor functionality issues
   - **Low**: UI/UX improvements

## Community

### Getting Help

- **GitHub Discussions**: For questions and general discussion
- **Discord**: For real-time chat and support
- **Email**: support@rewiseai.com for direct support

### Recognition

Contributors will be recognized in:
- README contributors section
- Release notes
- Project documentation
- Community highlights

## License

By contributing to ReWise AI, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to ReWise AI! 🚀
