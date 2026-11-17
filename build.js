const fs = require('fs');
const path = require('path');
const vm = require('vm');

console.log('=== Lampa Skip Intro Plugin Build ===');

const srcPath = path.join(__dirname, 'src', 'plugin.js');
const distDir = path.join(__dirname, 'dist');
const distPath = path.join(distDir, 'plugin.js');
const distMinPath = path.join(distDir, 'plugin.min.js');

if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
}

console.log('[1/3] Reading source file:', srcPath);
const code = fs.readFileSync(srcPath, 'utf8');

console.log('[2/3] Validating JavaScript syntax...');
try {
    new vm.Script(code);
    console.log('      Syntax validation SUCCESSFUL!');
} catch (err) {
    console.error('      Syntax validation FAILED:', err.message);
    process.exit(1);
}

console.log('[3/3] Generating distribution files...');
fs.writeFileSync(distPath, code, 'utf8');
console.log('      Created:', distPath, '(' + code.length + ' bytes)');

// Simple minifier (removing single-line comments and whitespace compression for lightweight embed)
const minified = code
    .replace(/\/\*[\s\S]*?\*\/|([^:]|^)\/\/.*$/gm, '$1')
    .replace(/^\s+/gm, '')
    .trim();

fs.writeFileSync(distMinPath, minified, 'utf8');
console.log('      Created:', distMinPath, '(' + minified.length + ' bytes)');

console.log('=== Build completed successfully! ===\n');
