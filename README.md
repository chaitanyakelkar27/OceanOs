# OceanOS Marine Intelligence Platform

A comprehensive marine data management system developed for sustainable ocean research and monitoring across Indian waters. This platform serves as the official repository for marine observations, species identification, and environmental data collection.

## Overview

OceanOS provides researchers, government officials, and marine biologists with tools for collecting, analyzing, and managing marine data. The system includes real-time monitoring capabilities, AI-powered species identification, and collaborative research features.

### Key Features

- **Marine Data Repository**: Centralized storage for research observations and environmental measurements
- **Species Identification**: AI-assisted identification system for marine life documentation
- **Real-time Monitoring**: Environmental parameter tracking with alert systems
- **Interactive Maps**: Geospatial visualization of marine data and research locations
- **Research Collaboration**: Multi-user platform supporting different research roles
- **Data Upload & Management**: Streamlined workflows for field data collection

## Technical Architecture

### Frontend
- **React 18** with TypeScript for type-safe development
- **Vite** for fast development and optimized builds
- **Tailwind CSS** for responsive, government-standard styling
- **React Router 6** for client-side navigation
- **React Query** for efficient data fetching and caching
- **Leaflet** for interactive mapping components
- **Recharts** for data visualization and analytics

### Backend
- **Express.js** server with TypeScript
- **JWT Authentication** for secure user sessions
- **RESTful API** design for data operations
- **Ollama Integration** for AI species identification
- **File Upload** handling for research images and documents

### Development Tools
- **TypeScript** throughout the stack
- **ESLint & Prettier** for code quality
- **Vitest** for testing
- **pnpm** for dependency management

## Getting Started

### Prerequisites
- Node.js 18 or later
- pnpm (recommended) or npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Chirag8405/OceanOS.git
cd OceanOS
```

2. Install dependencies:
```bash
pnpm install
```

3. Start development server:
```bash
pnpm dev
```

The application will be available at `http://localhost:8080`

### Building for Production

```bash
pnpm build
pnpm start
```

## User Roles & Access

### Government Officials
- Review and approve research submissions
- Access comprehensive analytics and reporting
- Manage platform policies and data standards

### Researchers
- Upload field observations and research data
- Access AI-powered analysis tools
- Track submission status and collaborate with teams

### Public Access
- View public marine data and maps
- Access educational resources about marine conservation

## Project Structure

```
├── client/                 # React frontend application
│   ├── components/        # Reusable UI components
│   ├── pages/            # Route-based page components
│   ├── hooks/            # Custom React hooks
│   └── api/              # API client configuration
├── server/               # Express backend
│   ├── routes/          # API endpoint definitions
│   └── services/        # Business logic and external integrations
├── shared/              # Type definitions used by both client and server
└── public/             # Static assets
```

## Development

### Running Tests
```bash
pnpm test
```

### Code Formatting
```bash
pnpm format.fix
```

### Type Checking
```bash
pnpm typecheck
```

## API Documentation

The platform provides RESTful endpoints for:
- Authentication and user management
- Marine observation data
- Species identification requests
- File uploads and media handling
- Geospatial queries and mapping data

## Contributing

This project follows government development standards for marine research platforms. All contributions should maintain data accuracy, security best practices, and accessibility standards.

### Development Guidelines
- Follow TypeScript strict mode requirements
- Maintain comprehensive error handling
- Include appropriate logging for audit trails
- Ensure responsive design across devices
- Follow established naming conventions

## Data Standards

Marine data submitted through the platform must adhere to established scientific standards for:
- GPS coordinate precision
- Species identification confidence levels
- Environmental measurement accuracy
- Image quality and metadata requirements

## License

This project is developed for official marine research purposes. Contact the development team for licensing information.

## Support

For technical support or questions about marine data standards, contact the platform development team or refer to the official documentation.

---

**Platform Version**: 1.0.0  
**Last Updated**: September 2025  
**Developed for**: Marine research and conservation initiatives