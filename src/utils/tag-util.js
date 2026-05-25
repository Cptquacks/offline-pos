/**
 * 
 * @param {string} color 
 * @property {string} parsedColor
 * @returns {string}
 */
export function colorParser(color) {
    const parsedColor = color.split('|')
    parsedColor[0] = `${parsedColor[0]}%`

    return parsedColor.join(',')
}