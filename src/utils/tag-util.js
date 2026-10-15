/**
 * 
 * @param {string} color 
 * @property {string} parsedColor
 * @returns {string}
 */
export function colorParser(color) {
    if (!color) return null
    if (color.includes('%')) return color

    const parsedColor = color.split('|')
    parsedColor[0] = `${parsedColor[0]}%`
    parsedColor[2] = `${parsedColor[2]}deg`

    return parsedColor.join(' ')
}

/**
 * Genera un color LCH aleatorio en formato "L|C|H"
 * L: 60-85 (luminosidad alta para buen contraste sobre fondo oscuro)
 * C: 50-80 (croma intenso para colores vivos)
 * H: 0-359 (tono aleatorio)
 */
export function randomLCH() {
    const L = Math.floor(Math.random() * 26) + 60;  // 60–85
    const C = Math.floor(Math.random() * 31) + 50;  // 50–80
    const H = Math.floor(Math.random() * 360);       // 0–359
    return `${L}|${C}|${H}`;
}

/**
 * Convierte una cadena LCH en formato "L|C|H" a un color hexadecimal.
 * Ejemplo: "70|60|60" -> "#53a3cb"
 * @param {string} lchString - Formato "L|C|H" (L: 0-100, C: 0-150, H: 0-360)
 * @returns {string} Color en formato "#RRGGBB"
 */
export function lchToHex(lchString) {
    //1. parseo
    const cssColor = `lch(${lchString})`;

    // 2. Usar un canvas para obtener el valor RGB computado
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = cssColor;
    ctx.fillRect(0, 0, 1, 1);

    // 3. Leer el píxel y extraer R, G, B
    const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;

    // 4. Convertir a hexadecimal
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

/**
 * Convierte un color hexadecimal (#RRGGBB) al formato LCH "L|C|H".
 * Basado en conversiones sRGB → XYZ → Lab → LCH.
 * @param {string} hex - Color en formato "#RRGGBB"
 * @returns {string} Color en formato "L|C|H" (L: 0–100, C: 0–150 aprox, H: 0–360)
 */
export function hexToLCH(hex) {
    // 1. Hex a RGB (0-255)
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    // 2. sRGB companding (linearización)
    const toLinear = c => (c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
    const rL = toLinear(r);
    const gL = toLinear(g);
    const bL = toLinear(b);

    // 3. sRGB lineal a XYZ (matriz D65)
    const x = 0.4124564 * rL + 0.3575761 * gL + 0.1804375 * bL;
    const y = 0.2126729 * rL + 0.7151522 * gL + 0.0721750 * bL;
    const z = 0.0193339 * rL + 0.1191920 * gL + 0.9503041 * bL;

    // 4. XYZ a Lab (referencia D65)
    const refX = 0.95047, refY = 1.0, refZ = 1.08883;
    const f = t => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116);
    const L = 116 * f(y / refY) - 16;
    const a = 500 * (f(x / refX) - f(y / refY));
    const bVal = 200 * (f(y / refY) - f(z / refZ));

    // 5. Lab a LCH
    const C = Math.sqrt(a * a + bVal * bVal);
    let H = Math.atan2(bVal, a) * (180 / Math.PI);
    if (H < 0) H += 360;

    return `${Math.round(L)}|${Math.round(C)}|${Math.round(H)}`;
}

/**
 * @param {String} lchCode
 * @returns {String}
 */
export function OriginalLCHParser(lchCode) {
    if (!lchCode.includes('%')) return lchCode

    let result = lchCode
    result = result
        .replace(/%{1}\sdeg{1}/gm, '')
        .split(' ')
        .join('|')
    return result
}