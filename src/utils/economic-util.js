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
 * Calcula regresión lineal y predice valores para días futuros
 * @param {Array} data - Array de objetos { name: string, value: number } (días con datos)
 * @param {number} totalDays - Total de días en la semana (ej. 5)
 * @returns {Array} - Array completo de 5 días con valores reales y predichos
 */
export function linearRegresion(knownData, totalDays = 7) {
    const dayMap = { 'Lunes': 0, 'Martes': 1, 'Miércoles': 2, 'Jueves': 3, 'Viernes': 4, 'Sabado': 5, 'Domingo': 6 };
    const knownPoints = knownData.map(d => ({ x: dayMap[d.name], y: d.value }));

    const n = knownPoints.length;
    if (n < 3) return knownData.map(d => ({ ...d, real: d.value, predicted: null }));

    // Cálculo de regresión
    let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
    knownPoints.forEach(p => {
        sumX += p.x;
        sumY += p.y;
        sumXY += p.x * p.y;
        sumX2 += p.x * p.x;
    });
    const m = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const b = (sumY - m * sumX) / n;

    // Encontrar el último día con datos reales
    const lastKnownDay = knownData[knownData.length - 1];

    const fullWeek = [];
    for (let i = 0; i < totalDays; i++) {
        const dayName = Object.keys(dayMap).find(key => dayMap[key] === i);
        const known = knownData.find(d => d.name === dayName);
        const predictedValue = Math.round(m * i + b);

        if (known) {
            fullWeek.push({
                name: dayName,
                real: known.value,
                // Si es el último día con datos reales, también lo ponemos como predicted para que la línea punteada comience aquí
                predicted: known === lastKnownDay ? known.value : null,
            });
        } else {
            fullWeek.push({
                name: dayName,
                real: null,
                predicted: Math.max(0, predictedValue),
            });
        }
    }
    return fullWeek;
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