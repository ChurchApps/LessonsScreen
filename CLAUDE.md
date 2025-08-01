# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React Native TV application for church lessons, built with Expo and supporting both phone and TV targets (iOS, Android, Apple TV, Android TV). The app provides access to church programs, studies, and lessons with offline download capabilities.

## Development Commands

```bash
# Start development server
npm start

# Run on Android TV/phone
npm run android

# Run on web
npm run web

# Prebuild native code (required for first-time setup)
export EXPO_TV=1  # Enable TV support
npm run prebuild

# Build production Android APK
npm run build:android
```

## Environment Setup

The app requires TV-specific environment variables:
- Set `EXPO_TV=1` environment variable before prebuild to enable TV support
- This can also be set via `isTV: true` in app.json
- The app uses react-native-tvos fork for TV compatibility

## Architecture

### Navigation System
- Custom navigation using screen state management (not React Navigation router)
- Navigator.tsx:15 controls all screen transitions via `handleNavigate` function
- Screens are rendered conditionally based on `currentScreen` state
- Full-screen screens: splash, player, download, lessonDetails
- Regular screens use NavWrapper component for consistent header/navigation

### Screen Structure
- **SplashScreen**: Initial loading and church selection
- **SelectChurchScreen/SelectRoomScreen**: Church and room selection flow
- **ProgramsScreen → StudiesScreen → LessonsScreen**: Content hierarchy navigation
- **LessonDetailsScreen**: Lesson information and download management
- **PlayerScreen**: Video/audio lesson playback
- **DownloadScreen**: Offline content management
- **SettingsScreen**: App configuration

### Data Management
- CachedData helper for offline data storage
- EnvironmentHelper.ts:8 manages API endpoints (production: api.lessons.church, membershipapi.churchapps.org)
- Uses @churchapps/mobilehelper for common church app functionality
- AsyncStorage for persistent data

### Key Dependencies
- `react-native-tvos`: TV-compatible React Native fork
- `@react-native-tvos/config-tv`: Expo plugin for TV builds
- `react-native-video`: Media playback
- `styled-components`: Component styling
- `axios`: API requests

## TV-Specific Features
- TV-optimized navigation with focus management
- TV banner assets in assets/images/
- Metro config supports TV-specific file extensions (*.tv.tsx, *.ios.tv.tsx, *.android.tv.tsx)
- Keep-awake functionality during video playback
- Swipe gestures and remote control support

## Build Configuration
- EAS Build configured for Android APK distribution
- Uses Expo SDK ~52.0
- TypeScript support with minimal tsconfig extending expo/tsconfig.base
- Babel configured with react-native-dotenv for environment variables