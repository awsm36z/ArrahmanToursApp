# Arrahman Tours App

## Overview
The **Arrahman Tours App** is a React Native-based mobile application designed to assist Muslims during their Hajj and Umrah journeys. With a focus on accessibility and simplicity, the app provides both real-time and offline features, enabling pilgrims to follow guided steps, listen to Du'aa recitations, and access necessary resources with ease.

## Purpose
This app aims to bridge the gap between technology and spiritual fulfillment by delivering:
- Real-time **Du'aa streaming** from Imams during rituals.
- Offline support for pre-recorded Du'aa.
- Step-by-step guidance for completing Hajj and Umrah rituals.
- Easy access to resources like maps, schedules, and prayer reminders.

## Features
### MVP (Minimum Viable Product)
1. **Synchronous Du'aa Audio**:
   - Real-time streaming of Du'aa using WebRTC.
   - Text overlay for reading along with the recitation.

2. **Asynchronous Du'aa Audio**:
   - Downloadable audio files for offline playback.
   - Text-based Du'aa available alongside audio.

3. **Step-by-Step Ritual Guide**:
   - Simplified instructions for Hajj and Umrah rituals.
   - Integration of prayer times and locations.

4. **Multi-Language Support**:
   - Initial support for English and Arabic.

5. **Firebase Integration**:
   - Firestore for storing metadata (Du'aa titles, timestamps, etc.).
   - Cloud Storage for audio files.
   - Authentication for user-specific settings (optional).

## Technology Stack
### Frontend
- **React Native**: Cross-platform mobile development.
- **React Navigation**: For handling app navigation.

### Backend
- **Firebase**:
  - Firestore: NoSQL database for real-time data.
  - Cloud Storage: For hosting pre-recorded Du'aa audio.
  - Authentication: Optional for personalized user experiences.

### Real-Time Features
- **WebRTC**: For live streaming of Du'aa recitations.
- **Firebase Realtime Database**: Optional as a signaling server for WebRTC.

### Additional Tools
- **Expo**: For quick prototyping and testing.
- **react-native-sound** or **expo-av**: For audio playback.
- **react-native-fs**: For offline file management.

## Development Workflow
### Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/awsm36z/ArrahmanToursApp.git
   ```
2. Navigate to the project directory:
   ```bash
   cd ArrahmanToursApp
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Install CocoaPods dependencies for iOS:
   ```bash
   cd ios && pod install && cd ..
   ```
5. Start the development server:
   ```bash
   npm run start
   ```

### Running the App
- **iOS**:
  ```bash
  npm run ios
  ```
- **Android**:
  ```bash
  npm run android
  ```

## File Structure
```
ArrahmanToursApp/
├── android/              # Android project files
├── ios/                  # iOS project files
├── src/                  # Source code for the app
│   ├── components/       # Reusable UI components
│   ├── screens/          # App screens (Home, Du'aa, Settings, etc.)
│   ├── services/         # Firebase and WebRTC integrations
│   └── utils/            # Utility functions
├── assets/               # Images, audio, and other static files
├── App.js                # Main app entry point
├── package.json          # Dependency definitions
└── README.md             # Project documentation
```

## Firebase Configuration
1. Download the `google-services.json` file for Android and place it in:
   ```
   android/app/
   ```
2. Download the `GoogleService-Info.plist` file for iOS and place it in:
   ```
   ios/<YourProjectName>/
   ```
3. Ensure Firebase modules are installed:
   ```bash
   npm install @react-native-firebase/app @react-native-firebase/firestore @react-native-firebase/storage
   ```

## Contributing
1. Fork the repository and create your feature branch:
   ```bash
   git checkout -b feature/your-feature
   ```
2. Commit your changes:
   ```bash
   git commit -m "Add some feature"
   ```
3. Push to the branch:
   ```bash
   git push origin feature/your-feature
   ```
4. Open a pull request.

## License
This project is licensed under the MIT License. See the `LICENSE` file for details.

## Contact
For questions or feedback, reach out to the development team at: 
- **Project Manager**: Mubasheer
- **GitHub Issues**: [https://github.com/awsm36z/ArrahmanToursApp/issues](https://github.com/awsm36z/ArrahmanToursApp/issues)
