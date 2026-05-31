/**
 * Rellena una semana (7 días) con valores predichos basados en el promedio acumulativo
 * de los días ya conocidos. Requiere al menos 2 días con datos reales.
 * @param {Array} valueArray - Array de objetos { name: string, value: number } (días con datos reales)
 * @returns {Array} - Array completo de 7 días con campos real y predicted
 */
export function findPromedium(valueArray) {
    const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
    const knownValues = days.map(day => {
        const entry = valueArray.find(item => item.name === day);
        return entry ? entry.value : null;
    });
    const predictions = knownValues.filter(v => v !== null);

    if (predictions.length < 2) {
        return days.map((day, i) => ({
            name: day,
            real: knownValues[i],
            predicted: null
        }));
    }

    while (predictions.length < 7) {
        const sum = predictions.reduce((acc, val) => acc + val, 0);
        const avg = Math.round(sum / predictions.length);
        predictions.push(avg);
    }
    const lastKnownIndex = knownValues.findLastIndex(v => v !== null);

    return days.map((day, i) => {
        const realValue = knownValues[i];
        let predictedValue = null;

        if (realValue === null) {
            predictedValue = predictions[i];
        } else if (i === lastKnownIndex) {
            // El último día real también sirve de ancla para la predicción
            predictedValue = realValue;
        }

        return {
            name: day,
            real: realValue,
            predicted: predictedValue !== null ? Math.max(0, predictedValue) : null
        };
    });
}

/**
 * Predice los siguientes 2 días de ventas (sells) usando regresión lineal
 * sobre los últimos 5 días hábiles (o menos, mínimo 3).
 * @param {Array} dataArray - Array de objetos diarios con date, sells, etc.
 * @returns {Array} Array de objetos { date, real, predicted } (7 elementos si hay >=5 días, o 5 si hay 3-4)
 */
export function predictNextTwoDays(dataArray, predicted = 2, taken = 5) {
    if (!dataArray || dataArray.length === 0) return [];

    // 1. Ordenar por fecha
    const sorted = [...dataArray].sort((a, b) => a.date.localeCompare(b.date));

    // 2. Agrupar por fecha (sumar sells por día)
    const grouped = {};
    sorted.forEach(entry => {
        if (!grouped[entry.date]) {
            grouped[entry.date] = { date: entry.date, sells: 0 };
        }
        grouped[entry.date].sells += entry.sells - entry.refunds || 0;
    });
    const uniqueDays = Object.values(grouped).sort((a, b) => a.date.localeCompare(b.date));

    // 3. Tomar los últimos 5 días únicos
    const lastDays = uniqueDays.slice(-taken);
    const n = lastDays.length;

    // 4. Si no hay al menos 3 días, devolver datos sin predicción
    if (n < 3) {
        return lastDays.map(d => ({ date: d.date, real: d.sells, predicted: null }));
    }

    // 5. Puntos para regresión: x = índice, y = sells
    const points = lastDays.map((day, i) => ({ x: i, y: day.sells }));

    // 6. Cálculo de regresión lineal
    let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
    points.forEach(p => {
        sumX += p.x;
        sumY += p.y;
        sumXY += p.x * p.y;
        sumX2 += p.x * p.x;
    });

    const m = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const b = (sumY - m * sumX) / n;

    // 7. Último índice histórico
    const lastIndex = n - 1;

    // 8. Construir resultado: días históricos + 2 predicciones
    const result = lastDays.map((day, i) => ({
        date: `Día ${day.date.split('-')[2]}`,
        real: day.sells,
        predicted: i === lastIndex ? day.sells : null   // conecta la línea punteada
    }));

    // 9. Generar los dos días siguientes
    // Se puede ajustar para generar mas
    const lastDate = new Date(lastDays[lastIndex].date);
    for (let i = 1; i <= predicted; i++) {
        const nextDate = new Date(lastDate);
        nextDate.setDate(nextDate.getDate() + i);
        const nextDateStr = nextDate.toISOString().split('T')[0];
        const predictedValue = Math.round(m * (n + i - 1) + b);  // x = n, n+1
        result.push({
            date: `Día ${nextDateStr.split('-')[2]}`,
            real: null,
            predicted: Math.max(0, predictedValue)
        });
    }

    return result;
}

/**
 * Obtiene los productos más vendidos basado en la diferencia entre amount (inicial) y current (actual)
 * @param {Array} productsArray - Array de productos con propiedades amount y current
 * @param {number} top - Número de productos a devolver (por defecto 5)
 * @returns {Array} - Array con los top productos más vendidos, incluyendo la cantidad vendida
 */
export function mostSoldProducts(productsArray, top = 5) {
    if (!Array.isArray(productsArray) || productsArray.length === 0) return [];

    // Calcular ventas totales por producto
    const productsWithSales = productsArray.map(product => ({
        ...product,
        sold: product.amount - product.current
    }));

    // Ordenar descendente por cantidad vendida
    const sorted = productsWithSales.sort((a, b) => b.sold - a.sold);

    // Tomar los primeros 'top' productos con ventas > 0
    return sorted.filter(p => p.sold > 0).slice(0, top);
}