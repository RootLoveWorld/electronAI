# English Learning App

A comprehensive English learning application built with Electron, React 19, and TypeScript.

## Features

- 📚 **Vocabulary Learning**: Interactive flashcards with pronunciation
- 📝 **Grammar Lessons**: Comprehensive grammar rules with exercises  
- 🎯 **Practice Quizzes**: Various exercise types to test knowledge
- 📊 **Progress Tracking**: Detailed statistics and achievement system
- 🗣️ **Pronunciation Practice**: Audio playback and speaking exercises
- 🌙 **Dark/Light Mode**: Customizable themes
- 💾 **Local Storage**: Offline progress tracking

## Technology Stack

- **Frontend**: React 19 with TypeScript
- **Desktop App**: Electron
- **Build Tool**: Vite
- **Styling**: Modern CSS with CSS Variables
- **State Management**: React Context API

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

#### Quick Setup (Recommended)

**For Windows:**
```bash
# Run the setup script
.\setup.bat
```

**For macOS/Linux:**
```bash
# Make script executable and run
chmod +x setup.sh
./setup.sh
```

#### Manual Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd english-learning-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

**Note:** The first time you run `npm install`, it will download all necessary dependencies including React 19, TypeScript, Electron, and build tools.

This will start both the Vite development server and Electron application.

## Available Scripts

- `npm run dev` - Start development environment (Vite + Electron)
- `npm run build` - Build for production
- `npm run dist` - Create distributable packages
- `npm run preview` - Preview production build
- `npm run test` - Run tests
- `npm run lint` - Check code quality
- `npm run type-check` - TypeScript type checking

## Project Structure

```
english-learning-app/
├── electron/              # Electron main process
│   ├── main.ts            # Main process entry point
│   ├── preload.ts         # Preload script for IPC
│   └── utils.ts           # Electron utilities
├── src/                   # React application
│   ├── components/        # React components
│   ├── context/          # React Context providers
│   ├── types/            # TypeScript type definitions
│   ├── hooks/            # Custom React hooks
│   └── assets/           # Static assets
├── dist/                 # Built Electron files
├── dist-react/           # Built React files
└── release/              # Distribution packages
```

## Features Overview

### Vocabulary Module
- Interactive flashcards with flip animations
- Difficulty levels (Beginner, Intermediate, Advanced)
- Category filtering
- Audio pronunciation
- Progress tracking for mastered/weak words

### Grammar Module
- Structured grammar lessons
- Interactive exercises (multiple choice, fill-in-the-blank)
- Immediate feedback and explanations
- Progressive difficulty

### Practice Module
- Mixed practice quizzes
- Multiple exercise types
- Score tracking and performance feedback
- Customizable practice sessions

### Progress Tracking
- Daily/weekly statistics
- Achievement system
- Learning streaks
- Performance analytics
- Goal setting and tracking

## Development

### Adding New Components

1. Create component in `src/components/`
2. Add corresponding CSS file
3. Export from component index
4. Update type definitions if needed

### Electron Integration

The app uses Electron's context isolation for security:
- Main process: `electron/main.ts`
- Preload script: `electron/preload.ts`
- IPC communication through exposed APIs

### Styling Guidelines

- Use CSS variables for theming
- Follow mobile-first responsive design
- Maintain consistent spacing using design tokens
- Support both light and dark themes

## Building for Production

1. Build the application:
```bash
npm run build
```

2. Create distribution packages:
```bash
npm run dist
```

This will create platform-specific installers in the `release` directory.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions, please use the GitHub issues tracker.