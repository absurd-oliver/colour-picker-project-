let cachedStandalone = '';

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('generateBtn').addEventListener('click', generateStandalone);
  document.getElementById('copyBtn').addEventListener('click', copyToClipboard);
  document.getElementById('downloadBtn').addEventListener('click', downloadStandalone);
});

async function generateStandalone() {
  try {
    let [html, css, js] = await Promise.all([
      fetch('index.html').then(r => r.text()),
      fetch('styles.css').then(r => r.text()),
      fetch('code.js').then(r => r.text()),
    ]);

    // Strip external references
    html = html
      .replace(/<link\s+rel=["']stylesheet["']\s+href=["']styles\.css["']\s*\/?>/i, '')
      .replace(/<script\s+src=["']code\.js["']\s*>\s*<\/script>/i, '');

    // Inject inline <style> and <script>
    cachedStandalone = html
      .replace('</head>', `<style>\n${css}\n</style>\n<script>\n${js.replace(/<\/script>/gi, '<\\/script>')}\n</script>\n</head>`);

    document.getElementById('output').value = cachedStandalone;
  } catch (e) {
    alert("Error generating standalone HTML: " + e.message);
  }
}

function copyToClipboard() {
  const output = document.getElementById('output');
  output.select();
  document.execCommand('copy');
  alert('Copied to clipboard!');
}

function downloadStandalone() {
  if (!cachedStandalone) {
    alert('Please generate the file first.');
    return;
  }
  const blob = new Blob([cachedStandalone], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'standalone.html';
  a.click();
  URL.revokeObjectURL(url);
}