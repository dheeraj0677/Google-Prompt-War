# Changelog

All notable changes to ElectBot are documented in this file.

## [2.0.0] - 2025-05-03

### Added
- **Testing Suite**: 274+ automated tests covering unit, integration, accessibility, security, and code quality
- **Security Headers**: X-Content-Type-Options, X-Frame-Options, X-XSS-Protection, Referrer-Policy, Permissions-Policy
- **Accessibility**: ARIA labels on all interactive elements, role attributes on semantic elements, aria-live regions
- **Code Quality**: ESLint config, EditorConfig, strict mode in all JS files, comprehensive JSDoc documentation
- **Gemini Integration**: Retry logic with exponential backoff, AbortController timeouts, safety filters
- **Contributing Guide**: Development setup, code standards, testing, and PR guidelines

### Changed
- Upgraded Gemini model from `gemini-pro` to `gemini-2.0-flash`
- Enhanced `markdownToHtml` with `rel="noopener noreferrer"` on generated links
- Improved `sanitizeInput` with 2000 character limit
- Extracted magic numbers into named constants across all modules
- Added meta descriptions to all 8 HTML pages

### Security
- Added Content Security Policy headers via Firebase hosting
- Added XSS prevention with DOM-based input sanitization
- Added Firestore security rules with authentication checks
- All external links secured with `rel="noopener"`

## [1.0.0] - 2025-04-30

### Added
- Initial release with AI chat, polling station map, election timeline, quiz, voter guide, news, and voting plan features
- Google Gemini API integration for conversational AI
- Leaflet-based interactive map with 200,000+ polling station markers
- Google Charts integration for voter turnout visualization
- Firebase hosting configuration
- Google Analytics 4 integration
- Premium dark theme with particle system and custom cursor
