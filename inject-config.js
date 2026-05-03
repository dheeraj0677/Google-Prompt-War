/**
 * ElectBot — Configuration Injector
 *
 * Build-time script that generates public/js/config.js from environment
 * variables. Used during deployment on platforms like Render, Vercel,
 * or Firebase to securely inject API keys without committing them.
 *
 * @module inject-config
 * @version 2.0.0
 *
 * @example
 * // Run during build:
 * // GEMINI_API_KEY=xxx node inject-config.js
 */

'use strict';

const fs = require('fs');
const path = require('path');

/** @type {string} Output path for the generated config file */
const configPath = path.join(__dirname, 'public', 'js', 'config.js');

/**
 * Generate the config file content from environment variables.
 * Falls back to placeholder values when env vars are not set.
 * @type {string}
 */
const configContent = `/**
 * ElectBot — Configuration
 * Auto-generated during build. Do NOT commit this file.
 * @see inject-config.js
 */

'use strict';

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

// Ensure the output directory exists
const dir = path.dirname(configPath);
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

fs.writeFileSync(configPath, configContent);
console.log('✅ public/js/config.js has been generated from environment variables.');
