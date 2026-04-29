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