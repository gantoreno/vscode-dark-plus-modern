const theme = require("../themes/dark-plus-modern.json");
const originalTheme = require("../themes/dark-modern.json");

function isGrayscale(hsl) {
  return hsl.s === 0;
}

function hexToHsl(hex) {
  hex = hex.replace(/^#/, "");

  let r = parseInt(hex.substring(0, 2), 16) / 255;
  let g = parseInt(hex.substring(2, 4), 16) / 255;
  let b = parseInt(hex.substring(4, 6), 16) / 255;

  let max = Math.max(r, g, b);
  let min = Math.min(r, g, b);

  let l = (max + min) / 2;

  let h, s;

  if (max === min) {
    h = s = 0;
  } else {
    let d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }

    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

function hslToHex(color) {
  let { h, s, l } = color;

  l /= 100;

  const a = (s * Math.min(l, 1 - l)) / 100;

  const f = (n) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);

    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0");
  };

  return `#${f(0)}${f(8)}${f(4)}`;
}

const THEME_COLOR = "#16191D";

for (let [property, color] of Object.entries(originalTheme.colors)) {
  if (property in theme.colors) {
    theme.colors[property] = color;
  }
}

for (let [property, color] of Object.entries(theme.colors)) {
  if (color.length > 7) continue;

  const originalHsl = hexToHsl(color);
  const alteredHsl = hexToHsl(THEME_COLOR);

  if (isGrayscale(originalHsl)) {
    alteredHsl.l = originalHsl.l;
    theme.colors[property] = hslToHex(alteredHsl);
  }
}

console.log(JSON.stringify(theme.colors));

console.log("✅ Theme saved");
