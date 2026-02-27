// src/setupTests.js
/* eslint-disable no-undef */
import "@testing-library/jest-dom";

// Polyfill for TextEncoder/TextDecoder
import { TextEncoder, TextDecoder } from "util";

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
/* eslint-enable no-undef */