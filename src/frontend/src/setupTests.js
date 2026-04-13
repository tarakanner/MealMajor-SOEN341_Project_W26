// src/setupTests.js
/* eslint-disable no-undef */
import "@testing-library/jest-dom";

// Polyfill for TextEncoder/TextDecoder
import { TextEncoder, TextDecoder } from "util";

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Set API base URL for Jest environment
global.__VITE_API_BASE_URL__ = process.env.VITE_API_BASE_URL || 'http://localhost:5000';
/* eslint-enable no-undef */