# Frontend Architecture

## Overview

The frontend is built with the React library and uses Vite for development and production builds. The application is a Single Page Application (SPA) focused on optimizing user experience with a custom built-component-based architecture.

## Technology Stack

### Core Technologies

- **React** - User interface library
- **Vite** - Development tool and bundler
- **JavaScript** - Programming language

### Styling and UI

- **TailwindCSS** - Utility-first CSS framework
- **FontAwesome** - Icon library
- **Framer Motion** - Animation library

### HTTP and API

- **Axios** - HTTP client library

### Testing

- **Vitest** - Unit testing tool
- **React Testing Library** - React component testing
- **Jest DOM** - DOM testing utilities
- **MSW (Mock Service Worker)** - API call mocking

### Development Tools

- **ESLint** - Code quality checking
- **JSDOM** - DOM simulation in tests

## Directory Structure

```text
frontend/
├── src/
│   ├── App.jsx                 # Main component
│   ├── main.jsx               # Application entry point
│   ├── index.css              # Global styles
│   ├── assets/                # Static files
│   │   ├── background/        # Background images
│   │   ├── fonts/            # Fonts
│   │   └── icons/            # SVG icons
│   ├── components/           # React components
│   ├── contexts/             # React Context API
│   ├── i18n/                 # Internationalization
│   ├── services/             # API services
│   ├── test/                 # Testing utilities
│   └── utils/                # Utility functions
```

## Architecture Patterns

### 1. Component Architecture

The application follows a hierarchical component structure:

```text
App
├── LanguageProvider (Context)
├── AuthProvider (Context)
└── Layout
    ├── Header
    ├── Hero
    ├── About
    ├── Explanation
    ├── UserReviewSection
    ├── PricingCalendar
    └── Footer
```

### 2. State Management

The application uses **React Context API** for global state management:

#### AuthContext

- User authentication data management
- Login and logout logic
- User state tracking

#### LanguageContext

- Multilingual support management
- Providing translations to components
- Dynamic language switching

### 3. API Integration

**API Layer** (`services/` directory):

- Centralized HTTP client configuration
- Error handling
- Session-based authentication
- Timeout management (10s)

### 4. Internationalization (i18n)

- **Translations object**: Translations in structured format
- **Context-based**: Translations available in all components
- **Dynamic translations**: Language switches without page reload
- **Supported languages**: Finnish (fi), English (en)

### 5. Styling Strategy

**TailwindCSS-based**:

- Utility-first approach
- Responsive design
- Consistent design system
- Optimized bundle size

## Testing Strategy

### Unit Tests

- **Vitest**: Fast and modern unit tests
- **React Testing Library**: User-centric testing
- **Mock Service Worker**: API call mocking

## Security

### Frontend Security

- **Session-based auth**: Secure authentication
- **XSS protection**: React's automatic XSS protection
- **CSRF protection**: SameSite cookies
- **Input validation**: User input validation

### API Security

- **withCredentials**: Automatic cookie sending
- **Timeout handling**: DoS attack prevention
- **Error handling**: Secure error handling

## Summary

The frontend architecture is built according to web development best practices. It offers:

- **Fast development experience** with Vite
- **Modular structure** with component-based architecture
- **Good user experience** with smooth animations and performance
- **Easy maintainability** with clear code structure (apart from PricingCalendar-component)
- **Security** following good security practicess

The architecture supports both current needs and future scaling, providing a solid foundation for continued application development.
