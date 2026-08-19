// jest-dom's matchers only make sense against a DOM. API route tests run under
// `@jest-environment node`, where there is no `document`, so load them lazily.
if (typeof document !== 'undefined') {
  require('@testing-library/jest-dom');
}

// jsdom does not expose Node's TextEncoder/TextDecoder as globals.
const { TextEncoder, TextDecoder } = require('util');
if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = TextEncoder;
}
if (typeof global.TextDecoder === 'undefined') {
  global.TextDecoder = TextDecoder;
}

// NOTE: do not stub Request/Response/Headers here. Hand-rolled stubs such as
// `class Response {}` silently drop the statics that Next.js relies on --
// `NextResponse.json()` calls `Response.json()`, so a stub turns every route
// handler test into "TypeError: Response.json is not a function". Tests that
// exercise route handlers should declare `@jest-environment node` and use the
// real fetch primitives Node provides.
