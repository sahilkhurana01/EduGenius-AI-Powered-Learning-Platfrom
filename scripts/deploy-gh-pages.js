/**
 * This script copies and modifies necessary files for proper GitHub Pages deployment
 * Run after 'npm run build': node scripts/deploy-gh-pages.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const publicDir = path.join(rootDir, 'public');
const distDir = path.join(rootDir, 'dist');

// Ensure dist directory exists
if (!fs.existsSync(distDir)) {
  console.error('Error: dist directory does not exist. Run "npm run build" first.');
  process.exit(1);
}

// Repository name - used for all paths on GitHub Pages
const REPO_NAME = 'EduGenius-AI-Powered-Learning-Platfrom';

// Files to copy from public to dist
const filesToCopy = [
  { name: 'pwalogo.png', modify: false },
  { name: 'sw.js', modify: true },
  { name: 'manifest.json', modify: true },
  { name: 'kid.jpg', modify: false },
  { name: 'edugenius logo.png', modify: false }
];

// Copy files
filesToCopy.forEach(file => {
  const sourcePath = path.join(publicDir, file.name);
  const destPath = path.join(distDir, file.name);
  
  try {
    if (fs.existsSync(sourcePath)) {
      // Copy the file
      fs.copyFileSync(sourcePath, destPath);
      console.log(`✅ Copied ${file.name} to dist directory`);
      
      // For files that need path modification
      if (file.modify) {
        let content = fs.readFileSync(destPath, 'utf8');
        
        // Make sure all paths use the repository name
        if (file.name === 'sw.js') {
          // No need to modify, already correct
        }
        else if (file.name === 'manifest.json') {
          // No need to modify, already correct
        }
        
        fs.writeFileSync(destPath, content);
        console.log(`✅ Modified paths in ${file.name}`);
      }
    } else {
      console.warn(`⚠️ Warning: ${file.name} not found in public directory`);
    }
  } catch (err) {
    console.error(`❌ Error processing ${file.name}:`, err);
  }
});

// Create a deployment note to track what was deployed
const deploymentNote = `
# Deployment Info
Deployed on: ${new Date().toISOString()}
Repository: ${REPO_NAME}
`;

fs.writeFileSync(path.join(distDir, 'deployment-info.txt'), deploymentNote);

// Create a 404.html that redirects to index.html for SPA routing
const notFoundPage = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>EduGenius - Redirecting</title>
    <script>
      // Redirect to the main page while preserving the path
      const path = window.location.pathname.replace('/${REPO_NAME}', '');
      window.location.href = '/${REPO_NAME}/#' + path;
    </script>
  </head>
  <body>
    <p>Redirecting...</p>
  </body>
</html>
`;

fs.writeFileSync(path.join(distDir, '404.html'), notFoundPage);

console.log('✨ Deployment preparation complete!');
console.log('Next steps:');
console.log('1. Commit and push your changes');
console.log('2. Run: npm run deploy');
console.log('3. Visit https://sahilkhurana01.github.io/EduGenius-AI-Powered-Learning-Platfrom to see your app'); 