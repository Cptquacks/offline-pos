/* TODO
 * MUST HAVE [MODULE]
 * 1. Graphics for
 * 
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

import { useEffect, useMemo, useState } from "react"
import useTraceStore from "../stores/traceStore"
import { mostSoldProducts, predictNextTwoDays } from "../utils/economic-util"
import { Bar, BarChart, Legend, Line, LineChart, Pie, PieChart, Sector, Tooltip, XAxis, YAxis } from "recharts"
import ChipItem from "../components/ChipItem"
import useProductStore from "../stores/productStore"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCalendar, faCashRegister, faDizzy, faDollarSign, faMoneyBillTransfer, faMoneyBillTrendUp, faSpinner } from "@fortawesome/free-solid-svg-icons"
import ImportPanel from "../components/ImportPanel"
import useStaffStore from "../stores/staffStore"



function EconomyView() {
    const { traceData, currentTrace, loadData, closeTrace } = useTraceStore()
    const { productData, loadData: loadProductData } = useProductStore()
    const { staffData, loadData: loadStaffData } = useStaffStore()

    /**
     * Days
     */
    const closesCount = useMemo(() => {
        let result = traceData.filter(trace => trace.date === currentTrace.date)
        result = result.filter(trace => trace.refunds !== 0 && trace.sells !== 0)
        return result.length
    }, [traceData, currentTrace])

    const [isClosgingDay, setClosingDay] = useState(false)

    const handleDayClosing = async () => {
        setClosingDay(true)
        await closeTrace()
            .then(() => {
                setClosingDay(false)
                loadData()
            })
            .catch(err => console.error(err))

    }

    /**
     * Sells
     */
    const predictedTrace = useMemo(() => {
        let result = traceData
        result = predictNextTwoDays(result)
        return result
    }, [traceData])

    const barTrace = useMemo(() => {
        let result = traceData.toReversed()
        let grouped = {}

        result.forEach(trace => {
            if (!grouped[trace.date]) {
                grouped[trace.date] = {
                    date: `Día ${trace.date.split('-')[2]}`,
                    sells: 0,
                    refunds: 0
                }
            }

            grouped[trace.date].sells += parseInt(trace.sells)
            grouped[trace.date].refunds += parseInt(trace.refunds)
        })

        result = Object.values(grouped)
        result = result.slice(-5)
        return result
    }, [traceData])

    /**
     * Earnings
     */
    const salesTrace = useMemo(() => {
        let result = traceData
        result = result.map((trace) => ({
            date: trace.date.split('-')[2],
            CUP: trace.total.CUP,
            USD: trace.total.USD,
        }))
        return result
    }, [traceData])

    const productTrace = useMemo(() => {
        let result = productData
        result = mostSoldProducts(result)
        return result
    }, [productData])

    /**
     * Waste
     */
    const staffTrace = useMemo(() => {
        let result = staffData

        result = result.map(staff => ({
            name: staff.name,
            waste: parseInt(staff.salary),
        }))

        result = result.sort((a, b) => b.waste - a.waste)

        return result
    }, [staffData])

    const roleTrace = useMemo(() => {
        const grouped = {}

        staffData.forEach(staff => {
            if (!grouped[staff.charge]) {

                grouped[staff.charge] = {
                    role: staff.charge,
                    waste: 0,
                    //fill: `hsla(${Math.floor(Math.random() * 360)}, 70%, 60%, 1)`,
                }
            }

            grouped[staff.charge].waste += parseInt(staff.salary) || 0
        })

        let result = Object.values(grouped)

        result = result.sort((a, b) => b.waste - a.waste)

        return result
    }, [staffData])

    /**
     * Autoload
     */
    useEffect(() => {
        loadData()
        loadProductData()
        loadStaffData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const chips = [
        { name: "Ventas", route: "sells" },
        { name: "Ganancias", route: "earnings" },
        { name: "Gastos", route: "waste" },
    ]

    const [currentChip, setCurrentChip] = useState(chips[0])

    return (
        <section className="
        grid grid-cols-3 grid-rows-1 
        p-4! gap-3
        h-full
        ">

            <div className="
            flex flex-col
            items-center
            col-span-2
            p-4! gap-3
            bg-(--bg-soft)
            rounded-md
            ">
                <div className="
                flex flex-row
                bg-(--bg-alt)
                items-center
                w-full
                p-2! gap-1
                border border-(--border)
                rounded-md
                ">
                    {chips.map((item, index) =>
                        <ChipItem key={index} label={item.name} route={item.route}
                            selected={currentChip.route === item.route}
                            onSelected={() => setCurrentChip(item)} />)}
                </div>

                <div className="flex flex-col w-full">
                    <ImportPanel />
                </div>

                {currentChip.route === 'sells' &&
                    <div className="
                    flex flex-col 
                    self-stretch items-center
                    w-full
                    gap-3
                    ">
                        <LineChart
                            className="
                            p-4!
                            bg-(--bg-alt) 
                            border border-(--border)
                            rounded-md
                            "
                            style={{ width: "100%", aspectRatio: 2.5, maxWidth: 600 }}
                            data={predictedTrace}>
                            <Line
                                name="Ventas"
                                dataKey="real" />
                            <Line
                                name="Predicción"
                                dataKey="predicted"
                                stroke="var(--accent)"
                                strokeDasharray="8 8" />

                            <XAxis
                                dataKey="date" />

                            <Legend />
                            <Tooltip />
                        </LineChart>

                        <BarChart
                            className="
                    p-4!
                    bg-(--bg-alt) 
                    border border-(--border)
                    rounded-md
                    "
                            style={{ width: "100%", aspectRatio: 2.5, maxWidth: 600 }}
                            data={barTrace}>
                            <Bar
                                name="Ventas"
                                dataKey="sells"
                                fill="#0081A3" />
                            <Bar
                                name="Devoluciones"
                                dataKey="refunds"
                                fill="var(--accent)" />

                            <XAxis dataKey="date" />

                            <Legend />
                            <Tooltip />
                        </BarChart>
                    </div>
                }

                {currentChip.route === 'earnings' &&
                    <div className="
                    flex flex-col 
                    self-stretch items-center
                    w-full
                    gap-3
                    ">
                        {productTrace.length <= 1 &&
                            <div className="
                            flex flex-row
                            items-center
                            p-4! gap-1
                            bg-(--bg-alt)
                            border-2 border-dashed border-white/30
                            ">
                                <strong className="text-xl">
                                    No se pueden mostrar los productos mas vendidos
                                </strong>
                                <FontAwesomeIcon icon={faDizzy} size="xl" />
                            </div>
                        }

                        {productTrace.length > 1 &&
                            <BarChart
                                className="
                                p-4!
                                bg-(--bg-alt) 
                                border border-(--border)
                                rounded-md
                                "
                                style={{ width: "100%", aspectRatio: 2.5, maxWidth: 600 }}
                                data={productTrace}>
                                <Bar
                                    name="Ventas"
                                    dataKey="sold"
                                    fill="#0081A3" />

                                <XAxis dataKey="name" />
                                <YAxis dataKey="sold" />

                                <Legend />
                                <Tooltip />
                            </BarChart>
                        }

                        <LineChart

                            className="
                            p-4!
                            bg-(--bg-alt) 
                            border border-(--border)
                            rounded-md
                            "
                            style={{ width: '100%', aspectRatio: 2.5, maxWidth: 600 }}
                            data={salesTrace}>

                            <Line
                                dataKey="CUP" />
                            <Line
                                dataKey="USD"
                                stroke="var(--accent)" />

                            <XAxis dataKey="date" />

                            <Legend />
                            <Tooltip />
                        </LineChart>
                    </div>
                }

                {currentChip.route === 'waste' &&
                    <div className="
                    flex flex-col 
                    self-stretch items-center
                    w-full
                    gap-3
                    ">
                        <BarChart className="
                            flex flex-col
                            gap-3
                            w-full
                            bg-(--bg-alt)
                            p-4!
                            border border-(--border)
                            rounded-md
                            "
                            style={{ width: '100%', aspectRatio: 2.5, maxWidth: 600 }}
                            data={staffTrace}>

                            <Bar
                                name="Gasto"
                                dataKey="waste"

                                fill="#0081A3" />

                            <XAxis dataKey="name" />
                            <YAxis dataKey="waste" />

                            <Legend />
                            <Tooltip />
                        </BarChart>

                        <BarChart className="
                            flex flex-col
                            gap-3
                            w-full
                            bg-(--bg-alt)
                            p-4!
                            border border-(--border)
                            rounded-md
                            "
                            style={{ width: '100%', aspectRatio: 2.5, maxWidth: 600 }}
                            data={roleTrace}
                        >
                            <Bar
                                name="Gasto"
                                dataKey="waste"

                                fill="#0081A3" />

                            <XAxis dataKey="role" />
                            <YAxis dataKey="waste" />

                            <Legend />
                            <Tooltip />
                        </BarChart>
                    </div>
                }
            </div>

            <div className="
            flex flex-col
            col-span-1
            p-4! gap-2
            bg-(--bg-soft)
            rounded-md
            ">
                {closesCount > 1 &&
                    <div className="
                    flex flex-row
                    p-2!
                    bg-(--bg-soft)
                    border border-(--border)
                    rounded-md
                    ">
                        <p>
                            Veces cerradas hoy: <strong>{closesCount}</strong>
                        </p>
                    </div>
                }
                <form>
                    <div className="
                    flex flex-col
                    bg-(--bg-soft)
                    p-2! gap-2
                    border border-(--border)
                    rounded-md
                    ">
                        <div className="
                        flex flex-row
                        px-2! py-0.5! gap-2
                        bg-(--bg-alt)
                        border border-(--border)
                        rounded-sm
                        ">
                            <strong className="
                            flex flex-row
                            items-center
                            gap-0.5
                            ">
                                <FontAwesomeIcon icon={faCalendar} />
                                Fecha:
                            </strong>

                            <p className="self-end">
                                {currentTrace.date ?? 'ERR'}
                            </p>
                        </div>

                        <div className="
                        flex flex-col
                        bg-(--bg-alt)
                        p-2!
                        border border-(--border)
                        rounded-sm
                        ">
                            <div className="
                            flex flex-row 
                            items-center 
                            gap-1
                            ">
                                <FontAwesomeIcon icon={faDollarSign} />
                                <p>Ventas:</p>
                                <strong>{currentTrace.sells}</strong>
                            </div>

                            <div className="
                            flex flex-row 
                            items-center
                            gap-1
                            ">
                                <FontAwesomeIcon icon={faMoneyBillTransfer} />
                                <p>Reembolsos:</p>
                                <strong>{currentTrace.refunds}</strong>
                            </div>
                        </div>

                        <div className="
                        flex flex-col
                        bg-(--bg-alt)
                        p-2!
                        border border-(--border)
                        rounded-sm
                        ">
                            <div className="
                            flex flex-row
                            items-center
                            gap-1
                            ">
                                <FontAwesomeIcon icon={faMoneyBillTrendUp} />
                                <strong>Ganancias</strong>
                            </div>

                            <div className="
                            flex flex-row
                            gap-3
                            ">
                                <div className="
                                flex flex-row
                                items-center
                                gap-1
                                ">
                                    <p>CUP:</p>
                                    <strong>{currentTrace.total?.CUP ?? 'ERR'}</strong>
                                </div>

                                <div className="
                                flex flex-row
                                items-center
                                gap-1
                                ">
                                    <p>USD:</p>
                                    <strong>{currentTrace.total?.USD ?? 'ERR'}</strong>
                                </div>
                            </div>
                        </div>

                        <button className={`
                        transition
                        self-center
                        px-3! py-1!
                        font-bold! text-white!
                        bg-(--accent-alt)
                        rounded-xs

                        ${isClosgingDay ?
                                'opacity-50 cursor-wait' :
                                'hover:bg-white! hover:text-(--bg-alt)! cursor-pointer'
                            }
                        `} onClick={handleDayClosing}>
                            {!isClosgingDay &&
                                <div className="
                                flex flex-row
                                items-center 
                                gap-1
                                ">
                                    Cerrar día
                                    <FontAwesomeIcon icon={faCashRegister} />
                                </div>
                            }
                            {isClosgingDay &&
                                <FontAwesomeIcon icon={faSpinner} spinPulse={true} />
                            }
                        </button>
                    </div>
                </form>

            </div>

        </section>
    )
}
export default EconomyView