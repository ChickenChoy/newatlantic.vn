
const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'app/admin/page.tsx');
const content = fs.readFileSync(filePath, 'utf8');

const lines = content.split('\n');
const stack = [];
const selfClosing = ['img', 'input', 'br', 'hr', 'AdminSidebar', 'AdminHeader', 'Icon', 'PasswordInput', 'ImageUpload'];

// Regex to find tags
const tagRegex = /<\/?([a-zA-Z0-9\-\.]+)(\s+[^>]*)?\/?>/g;

let match;
let lineNum = 1;
// This is a very naive parser, just to catch obvious mismatches
// We need to strip strings and comments first to be accurate, but let's try raw first
// Actually, simple brace counting is better for "syntax error"

let braceBalance = 0;
let parenBalance = 0;

for (let i = 0; i < content.length; i++) {
    if (content[i] === '{') braceBalance++;
    if (content[i] === '}') braceBalance--;
    if (content[i] === '(') parenBalance++;
    if (content[i] === ')') parenBalance--;
}

console.log('Brace Balance:', braceBalance);
console.log('Paren Balance:', parenBalance);

// Tag matching
const tags = [];
while ((match = tagRegex.exec(content)) !== null) {
    const fullTag = match[0];
    const tagName = match[1];
    const isClosing = fullTag.startsWith('</');
    const isSelfClosing = fullTag.endsWith('/>') || selfClosing.includes(tagName);

    if (isClosing) {
        const lastTag = tags.pop();
        if (lastTag !== tagName && lastTag !== undefined && tagName !== '') { // tagName is empty for </>
            if (tagName !== '>') { // ignore > ? capture group 1
                // console.log(`Mismatch: Expected closing ${lastTag}, found ${tagName} at index ${match.index}`);
            }
        }
    } else if (!isSelfClosing) {
        if (tagName !== '>') tags.push(tagName);
    }
}

// console.log('Open tags:', tags);
