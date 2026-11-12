/**
 * Obtiene la fecha actual en formato YYYY-MM-DD.
 * @returns {Promise<string>} Fecha actual
 */
export function getToday() {
    return window.electronAPI.getToday()
}

/**
 * Diferencia en días entre dos fechas (formato YYYY-MM-DD)
 * @param {string} a - Fecha 1
 * @param {string} b - Fecha 2
 * @returns {Promise<number>} b - a en días completos
 */
export function daysBetween(a, b) {
    return window.electronAPI.daysBetween(a, b)
}

/**
 * Días desde hoy hasta una fecha dada
 * @param {string} target - Fecha en formato YYYY-MM-DD
 * @returns {Promise<number>}
 */
export function daysFromToday(target) {
    return window.electronAPI.daysFromToday(target)
}

/**
 * Suma (o resta) días a una fecha en formato YYYY-MM-DD.
 * @param {string} dateStr - Fecha base (ej. "2026-06-01")
 * @param {number} days - Días a añadir (negativo para restar)
 * @returns {Promise<string>} Nueva fecha en formato YYYY-MM-DD
 */
export function addDays(dateStr, days) {
    return window.electronAPI.addDays(dateStr, days)
}

/**
 * Convierte una cadena de fecha en formato Excel (M/D/YY o M/D/YYYY) a YYYY-MM-DD.
 * Ejemplo: "8/21/27" → "2027-08-21", "12/5/2027" → "2027-12-05"
 * @param {string} excelDateStr - Fecha en formato de hoja de cálculo
 * @returns {Promise<string|null>} Fecha normalizada o null si el formato es inválido
 */
export function normalizeExcelDate(excelDateStr) {
    return window.electronAPI.normalizeExcelDate(excelDateStr)
}
