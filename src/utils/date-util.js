/**
 * Diferencia en días entre dos fechas (formato YYYY-MM-DD)
 * @param {string} a - Fecha 1
 * @param {string} b - Fecha 2
 * @returns {number} b - a en días completos
 */
export function daysBetween(a, b) {
    const [y1, m1, d1] = a.split('-').map(Number);
    const [y2, m2, d2] = b.split('-').map(Number);

    const date1 = new Date(y1, m1 - 1, d1);
    const date2 = new Date(y2, m2 - 1, d2);

    return Math.round((date2 - date1) / 86400000);
}

/**
 * Días desde hoy hasta una fecha dada
 * @param {string} target - Fecha en formato YYYY-MM-DD
 * @returns {number}
 */
export function daysFromToday(target) {
    const today = new Date().toLocaleDateString('sv-SE');
    return daysBetween(today, target);
}

/**
 * Suma (o resta) días a una fecha en formato YYYY-MM-DD.
 * @param {string} dateStr - Fecha base (ej. "2026-06-01")
 * @param {number} days - Días a añadir (negativo para restar)
 * @returns {string} Nueva fecha en formato YYYY-MM-DD
 */
export function addDays(dateStr, days) {
    console.log(days)
    const [y, m, d] = dateStr.split('-').map(Number);
    const baseDate = new Date(y, m - 1, d);
    baseDate.setDate(baseDate.getDate() + days);
    const year = baseDate.getFullYear();
    const month = String(baseDate.getMonth() + 1).padStart(2, '0');
    const day = String(baseDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/**
 * Convierte una cadena de fecha en formato Excel (M/D/YY o M/D/YYYY) a YYYY-MM-DD.
 * Ejemplo: "8/21/27" → "2027-08-21", "12/5/2027" → "2027-12-05"
 * @param {string} excelDateStr - Fecha en formato de hoja de cálculo
 * @returns {string|null} Fecha normalizada o null si el formato es inválido
 */
export function normalizeExcelDate(excelDateStr) {
    if (!excelDateStr || typeof excelDateStr !== 'string') return null;
    const parts = excelDateStr.split('/');
    if (parts.length !== 3) return null;

    let [month, day, year] = parts.map(p => parseInt(p, 10));
    if (isNaN(month) || isNaN(day) || isNaN(year)) return null;

    // Manejar año de dos dígitos (ej. 27 → 2027)
    if (year < 100) {
        year += 2000; // asume todos los años >= 2000
    }

    // Asegurar mes y día con dos dígitos
    const mm = String(month).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    const yyyy = String(year);

    return `${yyyy}-${mm}-${dd}`;
}