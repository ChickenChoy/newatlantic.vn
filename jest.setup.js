import '@testing-library/jest-dom'

// Polyfill Next.js global objects for testing
import { TextEncoder, TextDecoder } from 'util';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock Next.js Request and Response if not available
if (typeof Request === 'undefined') {
  global.Request = class Request {};
}
if (typeof Response === 'undefined') {
  global.Response = class Response {};
}
if (typeof Headers === 'undefined') {
  global.Headers = class Headers {
    constructor() {
      this.headers = new Map();
    }
    get(name) {
      return this.headers.get(name);
    }
    set(name, value) {
      this.headers.set(name, value);
    }
    has(name) {
      return this.headers.has(name);
    }
  };
}
