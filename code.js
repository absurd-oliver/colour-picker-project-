let textToCopy = '';
let copied = false;

const colourText = document.getElementById('colourText');
const redSlider = document.getElementById('redSlider');
const greenSlider = document.getElementById('greenSlider');
const blueSlider = document.getElementById('blueSlider');
const redValue = document.getElementById('redValue');
const greenValue = document.getElementById('greenValue');
const blueValue = document.getElementById('blueValue');
const colorPreview = document.getElementById('colorPreview');
const formatRadios = document.getElementsByName('format');
const downloadCSS = document.getElementById('downloadCSS');
const toggleTheme = document.getElementById('toggleTheme');

function updateValuesFromLocalStorage() {
  const saved = JSON.parse(localStorage.getItem('colorState'));
  if (saved) {
    redSlider.value = saved.r;
    greenSlider.value = saved.g;
    blueSlider.value = saved.b;
  }
}

function saveValuesToLocalStorage(r, g, b) {
  localStorage.setItem('colorState', JSON.stringify({ r, g, b }));
}

function rgbToHex(r, g, b) {
  return `#${[r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')}`;
}

function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;
  let max = Math.max(r, g, b),
      min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) h = s = 0;
  else {
    let d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
}

function getCurrentFormat(r, g, b) {
  let selected = [...formatRadios].find(r => r.checked).value;
  if (selected === 'rgb') return `rgb(${r}, ${g}, ${b})`;
  if (selected === 'hex') return rgbToHex(r, g, b);
  if (selected === 'hsl') return rgbToHsl(r, g, b);
}

function updateDisplay() {
  const r = parseInt(redSlider.value);
  const g = parseInt(greenSlider.value);
  const b = parseInt(blueSlider.value);

  redValue.textContent = r;
  greenValue.textContent = g;
  blueValue.textContent = b;

  const colorString = getCurrentFormat(r, g, b);
  textToCopy = colorString;
  colorPreview.style.backgroundColor = colorString;

  saveValuesToLocalStorage(r, g, b);
}

[redSlider, greenSlider, blueSlider, ...formatRadios].forEach(el => {
  el.addEventListener('input', updateDisplay);
});

colourText.addEventListener('click', () => {
  if (!copied) {
    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        colourText.textContent = 'copied';
        copied = true;
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
        colourText.textContent = 'failed to copy';
      });
  } else {
    colourText.textContent = 'Copy Colour';
    copied = false;
  }
});

downloadCSS.addEventListener('click', () => {
  const css = `:root {\n  --main-color: ${textToCopy};\n}`;
  const blob = new Blob([css], { type: 'text/css' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'color.css';
  link.click();
});

toggleTheme.addEventListener('click', () => {
  document.body.classList.toggle('light');
  localStorage.setItem('theme', document.body.classList.contains('light') ? 'light' : 'dark');
});

// Theme persistence
if (localStorage.getItem('theme') === 'light') {
  document.body.classList.add('light');
}

updateValuesFromLocalStorage();
updateDisplay();