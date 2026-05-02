const fs = require('fs');
const path = require('path');

/**
 * This script generates public/js/config.js from environment variables
 * during the build process on platforms like Render or Vercel.
 */

const configPath = path.join(__dirname, 'public', 'js', 'config.js');

const configContent = `/**
 * ElectBot — Configuration
 * Generated automatically during build.
 */

const CONFIG = {
  GEMINI_API_KEY: '${process.env.GEMINI_API_KEY || 'YOUR_GEMINI_API_KEY'}',
  GOOGLE_MAPS_API_KEY: '${process.env.GOOGLE_MAPS_API_KEY || 'YOUR_GOOGLE_MAPS_API_KEY'}',
  GA4_MEASUREMENT_ID: '${process.env.GA4_MEASUREMENT_ID || 'G-XXXXXXXXXX'}',
  FIREBASE: {
    apiKey: "${process.env.FIREBASE_API_KEY || 'YOUR_FIREBASE_API_KEY'}",
    authDomain: "${process.env.FIREBASE_AUTH_DOMAIN || 'your-project.firebaseapp.com'}",
    projectId: "${process.env.FIREBASE_PROJECT_ID || 'your-project-id'}",
    storageBucket: "${process.env.FIREBASE_STORAGE_BUCKET || 'your-project.appspot.com'}",
    messagingSenderId: "${process.env.FIREBASE_MESSAGING_SENDER_ID || 'your-sender-id'}",
    appId: "${process.env.FIREBASE_APP_ID || 'your-app-id'}"
  }
};

if (typeof module !== 'undefined') {
  module.exports = CONFIG;
}
`;

// Ensure the directory exists
const dir = path.dirname(configPath);
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

fs.writeFileSync(configPath, configContent);
console.log('✅ public/js/config.js has been generated from environment variables.');
