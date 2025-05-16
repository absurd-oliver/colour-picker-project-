let cachedStandalone = '';

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('generateBtn').addEventListener('click', generateStandalone);
  document.getElementById('copyBtn').addEventListener('click', copyToClipboard);
  document.getElementById('downloadBtn').addEventListener('click', downloadStandalone);
});

function generateStandalone() {
  try {
    const htmlFrame = document.getElementById('htmlFrame');
    const cssLink = document.getElementById('cssLink');
    const jsScript = document.getElementById('jsScript');

    // Wait for iframe (index.html) to load
    htmlFrame.onload = () => {
      const doc = htmlFrame.contentDocument || htmlFrame.contentWindow.document;
      let html = doc.documentElement.outerHTML;

      // Fetch CSS
      fetch(cssLink.href)
        .then(res => res.text())
        .then(css => {
          // Fetch JS
          fetch(jsScript.src)
            .then(res => res.text())
            .then(js => {
              // Clean up external links
              html = html.replace(/<link\s+[^>]*href=["']styles\.css["'][^>]*>/i, '');
              html = html.replace(/<script\s+[^>]*src=["']code\.js["'][^>]*>\s*<\/script>/i, '');

              // Escape closing </script> tag
              js = js.replace(/<\/script>/gi, '<\\/script>');

              // Inline CSS and JS
              html = html.replace(
                /<\/head>/i,
                `<style>\n${css}\n</style>\n<script>\n${js}\n</script>\n</head>`
              );

              cachedStandalone = html;
              document.getElementById('output').value = cachedStandalone;
            })
            .catch(err => {
              alert("Failed to load JS file: " + err.message);
            });
        })
        .catch(err => {
          alert("Failed to load CSS file: " + err.message);
        });
    };

    // Force reload of iframe (to trigger onload)
    htmlFrame.src = htmlFrame.src;

  } catch (e) {
    alert("Error generating standalone HTML: " + e.message);
    console.error(e);
  }
}

function copyToClipboard() {
  const output = document.getElementById('output');
  if (!output) return;
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