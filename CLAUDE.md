# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AI Assistant Studio is an Electron-based desktop application that enables users to create, customize, and chat with AI assistants powered by local language models via Ollama. The app features contextual search over local documents using Retrieval-Augmented Generation (RAG) and supports image upload for vision models.

## Development Commands

```bash
# Install dependencies
yarn

# Start development server
yarn dev

# Run linting
yarn lint

# Format code
yarn format

# Type checking
yarn typecheck          # Run both node and web type checks
yarn typecheck:node     # Type check main/preload processes
yarn typecheck:web      # Type check renderer process

# Build for production
yarn build              # Full build with type checking

# Platform-specific builds
yarn build:win          # Windows build
yarn build:mac          # macOS build
yarn build:linux        # Linux build

# Testing
yarn test               # Run Vitest tests
```

## Architecture

### Multi-Process Electron Structure

The application follows Electron's multi-process architecture:

- **Main Process** (`src/main/`): Node.js backend handling system integration, database, file operations, and Ollama communication
- **Renderer Process** (`src/renderer/`): React frontend with modern UI components
- **Preload Scripts** (`src/preload/`): Secure bridge between main and renderer processes via IPC

### Key Path Aliases

Configured in `electron.vite.config.ts`:

- `@global`: `src/global/` - Shared types, constants, and utilities
- `@main`: `src/main/` - Main process code
- `@preload`: `src/preload/` - Preload scripts
- `@renderer`: `src/renderer/src/` - Renderer process code
- `@`: `src/renderer/src/` - Renderer alias for components
- `@resources`: `resources/` - Static assets

### Core Features Architecture

**Database Layer**: Uses lowdb for JSON file-based storage in user data directory with automatic initialization of default assistants and configuration.

**RAG System**:

- Document processing via LangChain loaders (supports .txt, .md, .docx)
- Text chunking with RecursiveCharacterTextSplitter
- Vector embeddings using OllamaEmbeddings with local models
- FAISS vector store for similarity search and context retrieval

**Assistant System**:

- Two modes: "Task" (ephemeral, single response) and "Chat" (persistent conversation)
- Support for vision models with image uploads (Base64 encoding)
- Context injection from local documents via RAG
- Streaming responses with cancellation support

**State Management**: React Context providers for global state:

- `GlobalProvider`: App-wide state and theme
- `PageProvider`: Navigation and routing
- `AssistantProvider`: Assistant data and operations
- `RequirementsProvider`: Setup and model requirements

### UI Framework

Built with modern React stack:

- **Shadcn UI**: Component library with Radix UI primitives
- **Tailwind CSS**: Utility-first styling with custom theme
- **React Hook Form + Zod**: Form validation and management
- **Framer Motion**: Animations and transitions

### IPC Communication

Main-renderer communication via type-safe IPC:

- Ollama operations (streaming, model management)
- Assistant CRUD operations with history persistence
- File system operations (directory selection, image upload)
- System integration (shortcuts, startup, tray)

## Testing

- **Framework**: Vitest with jsdom environment
- **Configuration**: 30-second timeout for long-running tests
- **Location**: Tests alongside source files with `.test.ts` or `.spec.ts` extensions
- **UI**: Rich test UI available via `npm run test`

## Prerequisites

- Node.js (v16+)
- NPM package manager
- Ollama (for local AI model execution)

## Build System

Uses electron-vite for development and electron-builder for distribution with support for Windows, macOS, and Linux platforms.
