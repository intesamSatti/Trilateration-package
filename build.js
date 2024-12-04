const fs = require('fs');
const path = require('path');
const JavaScriptObfuscator = require('javascript-obfuscator');

const srcDir = path.join(__dirname, 'src');
const distDir = path.join(__dirname, 'dist');
// Copy all files from src to dist

function copyRecursiveSync(src, dest) {
    const exists = fs.existsSync(src);
    const stats = exists && fs.statSync(src);
    const isDirectory = exists && stats.isDirectory();
    if (isDirectory) {
    fs.mkdirSync(dest, { recursive: true });
    fs.readdirSync(src).forEach(childItemName => {
    copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
    });
    } else {
    fs.copyFileSync(src, dest);
    }
    }
    
    // Obfuscate all JavaScript files in dist
    function obfuscateFiles(dir) {
    fs.readdirSync(dir).forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
    obfuscateFiles(filePath);
    } else if (file.endsWith('.js')) {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const obfuscationResult = JavaScriptObfuscator.obfuscate(fileContent, {
    compact: true,
    controlFlowFlattening: true
    });
    fs.writeFileSync(filePath, obfuscationResult.getObfuscatedCode(), 'utf8');
    }
    });
    }
    
    // Perform build steps
    function build() {
    // Clear the dist directory
    if (fs.existsSync(distDir)) {
    fs.rmSync(distDir, { recursive: true, force: true });
    }
}

// Obfuscate all JavaScript files in dist
function obfuscateFiles(dir) {
    fs.readdirSync(dir).forEach(file => {
      const filePath = path.join(dir, file);
      if (fs.statSync(filePath).isDirectory()) {
        obfuscateFiles(filePath);
      } else if (file.endsWith('.js')) {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const obfuscationResult = JavaScriptObfuscator.obfuscate(fileContent, {
          compact: true,
          controlFlowFlattening: true
        });
        fs.writeFileSync(filePath, obfuscationResult.getObfuscatedCode(), 'utf8');
      }
    });
  }
  
  // Perform build steps
  function build() {
    // Clear the dist directory
    if (fs.existsSync(distDir)) {
      fs.rmSync(distDir, { recursive: true, force: true });
    }
  
    // Copy src to dist
    copyRecursiveSync(srcDir, distDir);
  
    // Obfuscate JavaScript files
    obfuscateFiles(distDir);
  }
  
  build();