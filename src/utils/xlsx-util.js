

export async function importFile() {
    if (!window.electronAPI) return { canceled: true, error: 'Electron API not ready' }

    const data = await window.electronAPI.importFile()
        .then(res => res)
        .catch(err => console.error(err))

    return data ?? { canceled: true, error: 'Error at importing file' }
}