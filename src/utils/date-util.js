/**
 * Obtiene la fecha actual en formato YYYY-MM-DD.
 * @returns {string}
 */
export function getToday() {
    return new Date().toLocaleDateString('sv-SE')
}

/**
 * Diferencia en días entre dos fechas (formato YYYY-MM-DD).
 * @param {string} a - Fecha inicial
 * @param {string} b - Fecha final
 * @returns {number}
 */
export function daysBetween(a, b) {
    const [y1, m1, d1] = a.split('-').map(Number)
    const [y2, m2, d2] = b.split('-').map(Number)

    const date1 = new Date(y1, m1 - 1, d1)
    const date2 = new Date(y2, m2 - 1, d2)

    return Math.round((date2 - date1) / 86400000)
}

/**
 * Días desde hoy hasta una fecha dada.
 * @param {string} target - Fecha en formato YYYY-MM-DD
 * @returns {number}
 */
export function daysFromToday(target) {
    return daysBetween(getToday(), target)
}

/**
 * Suma (o resta) días a una fecha en formato YYYY-MM-DD.
 * @param {string} dateStr - Fecha base
 * @param {number} days - Días a añadir
 * @returns {string}
 */
export function addDays(dateStr, days) {
    const [year, month, day] = dateStr.split('-').map(Number)
    const date = new Date(year, month - 1, day)
    date.setDate(date.getDate() + days)

    const resultYear = date.getFullYear()
    const resultMonth = String(date.getMonth() + 1).padStart(2, '0')
    const resultDay = String(date.getDate()).padStart(2, '0')
    return `${resultYear}-${resultMonth}-${resultDay}`
}

/**
 * Convierte una fecha Excel (M/D/YY o M/D/YYYY) a YYYY-MM-DD.
 * @param {string} excelDateStr
 * @returns {string|null}
 */
export function normalizeExcelDate(excelDateStr) {
    if (!excelDateStr || typeof excelDateStr !== 'string') return null
    const parts = excelDateStr.split('/')
    if (parts.length !== 3) return null

    let [month, day, year] = parts.map(part => parseInt(part, 10))
    if (isNaN(month) || isNaN(day) || isNaN(year)) return null

    if (year < 100) year += 2000

    const mm = String(month).padStart(2, '0')
    const dd = String(day).padStart(2, '0')
    return `${year}-${mm}-${dd}`
}
