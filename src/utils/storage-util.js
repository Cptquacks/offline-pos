/**
 * 
 * @param {String} path 
 * @returns {Array}
 */
export async function loadData(path) {
    if (!window.electronAPI) return

    const result = await window.electronAPI.readJSON(`${path}.json`)
        .then(res => res)
        .catch(err => console.error(`ERROR Ocurred: ${err}`))

    return result ?? []
}

/**
 * 
 * @param {String} path 
 * @param {Object} data
 * @returns {Array}
 */
export async function updateData(path, data) {
    if (!window.electronAPI) return

    await window.electronAPI.modifyJSON(`${path}.json`, data)
        .catch(err => console.error(`ERROR Ocurred: ${err}`))

    const result = await window.electronAPI.readJSON(`${path}.json`)
        .then(res => res)
        .catch(err => console.error(`ERROR Ocurred: ${err}`))

    return result ?? []
}

/**
 * 
 * @param {String} path 
 * @param {Array} data
 * @returns {Array}
 */
export async function writeData(path, data) {
    if (!window.electronAPI) return

    await window.electronAPI.writeJSON(`${path}.json`, data)
        .catch(err => console.error(`ERROR Ocurred: ${err}`))

    const result = await window.electronAPI.readJSON(`${path}.json`)
        .then(res => res)
        .catch(err => console.error(`ERROR Ocurred: ${err}`))

    return result ?? []
}