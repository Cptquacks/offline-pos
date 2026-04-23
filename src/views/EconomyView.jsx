/* TODO
 * MUST HAVE [MODULE]
 * 1. Graphics for
 * 
 * DONE
 * - Revenue on CUP and USD, for each week day
 * - Chart to predict Revenue for empty week days
 * 
 * 
 * - Top 5 sold products
 * 
 * - Sells and refunds graphic
 * 
 * - Pie chart to dissasemble employe salaries waste
 * 
 * - Pie chart to dissasemble provider payment waste
 */

import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts"
import { useEffect, useMemo, useState } from "react";
import { linearRegresion, mostSoldProducts } from "../utils/economic-util";


function EconomyView() {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const DAY_NAMES = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

    // Sales
    const [weekData, setWeekData] = useState([])
    const [weekIndex, setWeekIndex] = useState(0)

    const sales = useMemo(() => {
        if (!weekData) return [];

        const weekDataTransformed = weekData.map((day, index) => ({
            name: DAY_NAMES[index],
            value: day.sells
        }));

        if (weekDataTransformed.length < 3) {
            // Devuelve estructura compatible: real = value, predicted = null
            return weekDataTransformed.map(d => ({
                name: d.name,
                real: d.value,
                predicted: null
            }));
        }

        return linearRegresion(weekDataTransformed);
    }, [weekData, DAY_NAMES])

    const balance = useMemo(() => {
        let result = weekData.map((day, index) => ({
            name: DAY_NAMES[index],
            sells: day.sells,
            refunds: day.refunds,
            CUP: day.total.CUP,
            USD: day.total.USD,
        }))

        while (result.length < 7) {
            result.push({
                name: DAY_NAMES[result.length],
                sells: 0,
                refunds: 0,
                CUP: 0,
                USD: 0,
            })
        }

        return result
    }, [weekData, DAY_NAMES])

    // Products
    const [productData, setProductData] = useState([])
    const topProducts = useMemo(() => {
        if (productData.length === 0) return
        return mostSoldProducts(productData)
    }, [productData])

    // Data loader
    const loadData = async () => {
        if (!window.electronAPI) return

        await window.electronAPI.readJSON('weeks.json')
            .then(res => setWeekData(res[weekIndex]))
            .catch(err => console.error(err))

        await window.electronAPI.readJSON('products.json')
            .then(res => setProductData(res))
            .catch(err => console.error(err))
    }

    useEffect(() => { loadData() }, [])


    return (
        <section className="
        grid grid-cols-3 grid-rows-1 
        p-4! gap-3
        h-full
        ">

            <div className="
            grid grid-cols-2 grid-rows-2
            justify-between
            col-span-2
            p-4! gap-3
            bg-(--bg-soft)
            rounded-md
            ">
                <LineChart
                    style={{ width: '100%', height: '100%', aspectRatio: 2.5, maxWidth: 600 }}
                    data={sales}>

                    <Line name="Venta"
                        dataKey="real"
                        connectNulls />

                    <Line name="Prediccion"
                        dataKey="predicted"
                        strokeDasharray="8 8"
                        stroke="var(--accent)"
                        connectNulls />

                    <XAxis dataKey="name" />
                    <YAxis dataKey="real" />

                    <Legend />
                    <Tooltip />
                </LineChart>

                <BarChart
                    style={{ width: '100%', height: '100%', aspectRatio: 2.5, maxWidth: 600 }}
                    data={balance}>


                    <Bar name="Ventas"
                        dataKey="sells"
                        fill="var(--accent)"
                    />
                    <Bar name="Devoluciones"
                        dataKey="refunds"
                        fill="lightgreen"
                    />

                    <XAxis dataKey="name" />
                    <YAxis dataKey="sells" />

                    <Legend />
                    <Tooltip />
                </BarChart>

                <BarChart
                    style={{ width: '100%', height: '100%', aspectRatio: 2.5, maxWidth: 600 }}
                    data={topProducts}>


                    <Bar name="Ventas"
                        dataKey="sold"
                        fill="var(--accent)"
                    />

                    <XAxis dataKey="name" />
                    <YAxis dataKey="sold" />

                    <Legend />
                    <Tooltip />
                </BarChart>
            </div>

            <div className="
            grid col-span-1
            bg-(--bg-soft)
            rounded-md
            ">

            </div>

        </section>
    )
}
export default EconomyView