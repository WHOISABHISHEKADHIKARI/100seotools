/**
 * Validation script for 100 SEO Tools
 * 
 * This script performs various checks to ensure the site meets accessibility,
 * SEO, and performance standards.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const config = {
  rootDir: path.resolve(__dirname, '..'),
  publicDir: path.resolve(__dirname, '../public'),
  appDir: path.resolve(__dirname, '../app'),
  componentsDir: path.resolve(__dirname, '../components'),
};

// ANSI color codes for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

// Helper functions
function log(message, type = 'info') {
  const timestamp = new Date().toLocaleTimeString();
  let prefix = '';
  
  switch (type) {
    case 'success':
      prefix = `${colors.green}✓${colors.reset} `;
      break;
    case 'error':
      prefix = `${colors.red}✗${colors.reset} `;
      break;
    case 'warning':
      prefix = `${colors.yellow}!${colors.reset} `;
      break;
    case 'info':
      prefix = `${colors.blue}ℹ${colors.reset} `;
      break;
    case 'header':
      console.log(`\n${colors.bright}${colors.cyan}=== ${message} ===${colors.reset}\n`);
      return;
  }
  
  console.log(`${prefix}[${timestamp}] ${message}`);
}

function fileExists(filePath) {
  return fs.existsSync(filePath);
}

function checkFileContains(filePath, searchString) {
  if (!fileExists(filePath)) {
    return false;
  }
  
  const content = fs.readFileSync(filePath, 'utf8');
  return content.includes(searchString);
}

// Validation functions
function validateMetaTags() {
  log('Validating meta tags', 'header');
  
  const layoutPath = path.join(config.appDir, 'layout.js');
  
  if (!fileExists(layoutPath)) {
    log(`Layout file not found at ${layoutPath}`, 'error');
    return false;
  }
  
  const layoutContent = fs.readFileSync(layoutPath, 'utf8');
  
  // Check for required meta tags
  const requiredMetaTags = [
    'charSet="UTF-8"',
    'name="viewport"',
    'name="theme-color"'
  ];
  
  let allFound = true;
  
  for (const tag of requiredMetaTags) {
    if (layoutContent.includes(tag)) {
      log(`Found meta tag: ${tag}`, 'success');
    } else {
      log(`Missing meta tag: ${tag}`, 'error');
      allFound = false;
    }
  }
  // Canonical can be declared via Next.js metadata API
  const hasCanonicalLink = layoutContent.includes('rel="canonical"');
  const hasMetadataCanonical = /alternates\s*:\s*\{[\s\S]*canonical\s*:/m.test(layoutContent);
  if (hasCanonicalLink || hasMetadataCanonical) {
    log('Found canonical declaration', 'success');
  } else {
    log('Missing canonical declaration (link or metadata alternates)', 'error');
    allFound = false;
  }
  
  // Check for Open Graph and Twitter tags
  if (layoutContent.includes('openGraph')) {
    log('Found Open Graph meta tags', 'success');
  } else {
    log('Missing Open Graph meta tags', 'error');
    allFound = false;
  }
  
  if (layoutContent.includes('twitter')) {
    log('Found Twitter Card meta tags', 'success');
  } else {
    log('Missing Twitter Card meta tags', 'error');
    allFound = false;
  }
  
  return allFound;
}

function validateAccessibility() {
  log('Validating accessibility features', 'header');
  
  const layoutPath = path.join(config.appDir, 'layout.js');
  const layoutContent = fs.readFileSync(layoutPath, 'utf8');
  
  // Check for lang attribute
  if (layoutContent.includes('lang="en"')) {
    log('Found lang="en" attribute on html tag', 'success');
  } else {
    log('Missing lang="en" attribute on html tag', 'error');
    return false;
  }
  
  // Check for skip link
  if (layoutContent.includes('Skip to')) {
    log('Found skip navigation link', 'success');
  } else {
    log('Missing skip navigation link', 'error');
    return false;
  }
  
  // Check for ARIA attributes in components
  const componentsToCheck = [
    'Navbar.js',
    'Card.js',
    'BackToTop.js',
    'SearchFilter.js',
  ];
  
  let allComponentsValid = true;
  
  for (const component of componentsToCheck) {
    const componentPath = path.join(config.componentsDir, component);
    
    if (!fileExists(componentPath)) {
      log(`Component file not found: ${component}`, 'error');
      allComponentsValid = false;
      continue;
    }
    
    const componentContent = fs.readFileSync(componentPath, 'utf8');
    
    // Check for ARIA attributes
    if (componentContent.includes('aria-')) {
      log(`Found ARIA attributes in ${component}`, 'success');
    } else {
      log(`Missing ARIA attributes in ${component}`, 'error');
      allComponentsValid = false;
    }
    
    // Check for proper focus management
    if (componentContent.includes('focus')) {
      log(`Found focus management in ${component}`, 'success');
    } else {
      log(`Missing focus management in ${component}`, 'warning');
    }
  }
  
  return allComponentsValid;
}

function validatePerformance() {
  log('Validating performance optimizations', 'header');
  
  // Check for lazy loading implementation
  const toolGridPath = path.join(config.componentsDir, 'ToolGrid.js');
  
  if (!fileExists(toolGridPath)) {
    log('ToolGrid.js not found', 'error');
    return false;
  }
  
  const toolGridContent = fs.readFileSync(toolGridPath, 'utf8');
  
  if (toolGridContent.includes('IntersectionObserver') || 
      toolGridContent.includes('lazy') || 
      toolGridContent.includes('loadMore')) {
    log('Found lazy loading implementation in ToolGrid', 'success');
  } else {
    log('Missing lazy loading implementation in ToolGrid', 'error');
    return false;
  }
  
  // Check for service worker
  const swPath = path.join(config.publicDir, 'sw.js');
  
  if (fileExists(swPath)) {
    log('Found service worker implementation', 'success');
  } else {
    log('Missing service worker implementation', 'error');
    return false;
  }
  
  // Check for service worker registration
  if (checkFileContains(path.join(config.appDir, 'layout.js'), 'serviceWorker')) {
    log('Found service worker registration', 'success');
  } else {
    log('Missing service worker registration', 'error');
    return false;
  }
  
  return true;
}

function validateUserExperience() {
  log('Validating user experience improvements', 'header');
  
  // Check for error boundary
  const errorBoundaryPath = path.join(config.componentsDir, 'ErrorBoundary.js');
  
  if (fileExists(errorBoundaryPath)) {
    log('Found ErrorBoundary component', 'success');
  } else {
    log('Missing ErrorBoundary component', 'error');
    return false;
  }
  
  // Check for improved CSS
  const cssPath = path.join(config.appDir, 'globals.css');
  
  if (!fileExists(cssPath)) {
    log('globals.css not found', 'error');
    return false;
  }
  
  const cssContent = fs.readFileSync(cssPath, 'utf8');
  
  // Check for mobile responsiveness
  if (cssContent.includes('@media') && cssContent.includes('max-width')) {
    log('Found mobile responsive styles', 'success');
  } else {
    log('Missing mobile responsive styles', 'warning');
  }
  
  // Check for focus styles
  if (cssContent.includes('focus') || cssContent.includes(':focus')) {
    log('Found focus styles', 'success');
  } else {
    log('Missing focus styles', 'warning');
  }
  
  // Check for animation/transition
  if (cssContent.includes('@keyframes') || cssContent.includes('transition')) {
    log('Found animations/transitions', 'success');
  } else {
    log('Missing animations/transitions', 'warning');
  }
  
  return true;
}

function validatePWASupport() {
  log('Validating PWA support', 'header');
  
  // Check for manifest.json
  const manifestPath = path.join(config.publicDir, 'manifest.json');
  
  if (fileExists(manifestPath)) {
    log('Found manifest.json', 'success');
    
    // Validate manifest content
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    
    if (manifest.name && manifest.short_name && manifest.icons) {
      log('manifest.json contains required fields', 'success');
    } else {
      log('manifest.json is missing required fields', 'error');
      return false;
    }
  } else {
    log('Missing manifest.json', 'error');
    return false;
  }
  
  // Check for offline page
  const offlinePath = path.join(config.appDir, 'offline', 'page.js');
  
  if (fileExists(offlinePath)) {
    log('Found offline page', 'success');
  } else {
    log('Missing offline page', 'error');
    return false;
  }
  
  return true;
}

// Run all validations
function runAllValidations() {
  log('Starting validation for 100 SEO Tools', 'header');
  
  const results = {
    metaTags: validateMetaTags(),
    accessibility: validateAccessibility(),
    performance: validatePerformance(),
    userExperience: validateUserExperience(),
    pwaSupport: validatePWASupport(),
  };
  
  log('Validation Results Summary', 'header');
  
  let allPassed = true;
  
  for (const [test, passed] of Object.entries(results)) {
    if (passed) {
      log(`${test}: ${colors.green}PASSED${colors.reset}`, 'success');
    } else {
      log(`${test}: ${colors.red}FAILED${colors.reset}`, 'error');
      allPassed = false;
    }
  }
  
  if (allPassed) {
    log('All validations passed! The site meets the required standards.', 'success');
  } else {
    log('Some validations failed. Please address the issues above.', 'error');
  }
  
  return allPassed;
}

// Execute the validation
runAllValidations();