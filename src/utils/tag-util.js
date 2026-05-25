/**
 * 
 * @param {string} color 
 * @property {string} parsedColor
 * @returns {string}
 */
export function colorParser(color) {
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