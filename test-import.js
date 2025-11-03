// Test file to verify web-vitals-mock import
async function testImport() {
  try {
    const module = await import('./lib/web-vitals-mock.js');
    console.log('Import successful:', Object.keys(module));
    console.log('getCLS function:', typeof module.getCLS);
    return true;
  } catch (error) {
    console.error('Import failed:', error.message);
    return false;
  }
}

testImport().then(success => {
  console.log('Test result:', success ? 'PASS' : 'FAIL');
  process.exit(success ? 0 : 1);
});