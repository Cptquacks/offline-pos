export async function checkLicense(code) {
    if (!window.electronAPI) {
        console.log('Electron API not loaded')
        return null
    }

    const data = await window.electronAPI.checkLicense(code)
        .then(res => res)
        .catch(err => console.error(err))

    if (!data || !data?.valid) return { valid: false }

    return data
}

export function checkValidity(license) {
    const today = new Date().toLocaleDateString('sv-SE')
    console.log(`${license.date} ${today}`)
    return today < license.date
}