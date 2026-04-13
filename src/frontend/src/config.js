// API configuration - works in both Vite and Jest environments
// Vite inlines environment variables at build time, so we just need a fallback for Jest
/* eslint-disable-next-line no-undef */
let cachedBaseUrl = null;

function getBaseUrl() {
  if (cachedBaseUrl) return cachedBaseUrl;

  // Check if global variable was set by Jest setupTests.js
  /* eslint-disable-next-line no-undef */
  if (typeof global !== 'undefined' && global.__VITE_API_BASE_URL__) {
    cachedBaseUrl = global.__VITE_API_BASE_URL__;
  } else {
    // Default fallback for development
    cachedBaseUrl = 'http://localhost:5000';
  }

  return cachedBaseUrl;
}

export function getAPIUrl(endpoint) {
  return `${getBaseUrl()}${endpoint}`;
}
