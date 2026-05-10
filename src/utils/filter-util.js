/**
 * 
 * @param {Object} object 
 * @param {Array} excluded 
 * @returns {Object}
 */
export function filterObjectKeys(object, excluded) {
    return Object.fromEntries(
        Object.entries(object).filter(([key]) => !excluded.includes(key))
    )
}

/**
 * 
 * @param {Array} structure 
 * @param {Array} excluded 
 * @returns {Object}
 */
export function filterObjectKeysFromStructure(structure, excluded) {
    return structure.map(item =>
        Object.fromEntries(
            Object.entries(item).filter(([key]) => !excluded.includes(key))
        )
    )
}