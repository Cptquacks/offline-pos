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