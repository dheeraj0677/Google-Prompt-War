# Contributing to ElectBot

Thank you for your interest in contributing to ElectBot! This guide will help you get started.

## Development Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/dheeraj0677/Google-Prompt-War.git
   cd Google-Prompt-War
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure API keys:**
   - Copy `.env.example` to `.env`
   - Add your Google API keys
   - Run `npm run build` to generate `public/js/config.js`

4. **Start the dev server:**
   ```bash
   npm start
   ```

## Code Standards

### JavaScript
- Use `'use strict'` at the top of every JS file
- Add JSDoc documentation for all public functions and classes
- Use `const` by default, `let` when reassignment is needed, never `var`
- Extract magic numbers into named constants
- Follow the ESLint configuration in `.eslintrc.json`

### HTML
- Every page must include `lang="en"` on `<html>`
- Add `<meta name="description">` to all pages
- Use semantic HTML5 elements (`<main>`, `<nav>`, `<footer>`, `<article>`)
- Add `aria-label` on all interactive elements (buttons, inputs, links)
- Mark decorative elements with `aria-hidden="true"`
- All `target="_blank"` links must have `rel="noopener"`

### CSS
- Use CSS custom properties defined in `main.css`
- Follow the design token system (spacing, colors, typography)

## Testing

Run the full test suite before submitting:

```bash
npm test
```

Tests cover:
- **Unit tests** — Markdown conversion, XSS prevention, quiz logic
- **Integration tests** — Config structure, file integrity
- **Accessibility tests** — ARIA labels, semantic HTML, footer roles
- **Security tests** — External link safety, security headers, input sanitization
- **Code quality tests** — Strict mode, JSDoc coverage, SEO compliance

## Security

- **Never commit API keys** — `config.js` is gitignored
- Use `inject-config.js` for build-time key injection
- Sanitize all user input before rendering
- Add `rel="noopener"` to all external links

## Pull Request Guidelines

1. Create a feature branch from `main`
2. Ensure all 274+ tests pass
3. Add tests for new features
4. Update documentation as needed
5. Submit a PR with a clear description
