import { useEffect, useMemo, useState } from "react"
import useTraceStore from "../stores/traceStore"
import { mostSoldProducts, predictNextTwoDays } from "../utils/economic-util"
import { Bar, BarChart, Legend, Line, LineChart, ReferenceLine, Tooltip, XAxis, YAxis } from "recharts"
import ChipItem from "../components/ChipItem"
//import useProductStore from "../stores/productStore"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCalendar, faCashRegister, faDollarSign, faMoneyBillTransfer, faMoneyBillTrendUp, faSpinner } from "@fortawesome/free-solid-svg-icons"
import ImportPanel from "../components/ImportPanel"
import useStaffStore from "../stores/staffStore"
import EconomyForm from "../components/EconomyForm"
import useProviderStore from "../stores/providerStore"
import GridItemList from "../components/GridItemList"
import DayItem from "../components/DayItem"



function EconomyView() {
    const { traceData, currentTrace, loadData, addTrace, closeTrace, normalizeTrace, overwriteTrace } = useTraceStore()
    //const { productData, loadData: loadProductData } = useProductStore()
    const { providerData, paymentWaste, loadData: loadProviderData } = useProviderStore()
    const { staffData, salaryWaste, loadData: loadStaffData } = useStaffStore()

    /**
     * Days
     */
    const closesCount = useMemo(() => {
        let result = traceData.filter(trace => trace.date === currentTrace.date)
        result = result.filter(trace => trace.refunds !== 0 || trace.sells !== 0)
        return result.length
    }, [traceData, currentTrace])

    const groupedDays = useMemo(() => {
        let result = traceData
        let grouped = {}

        result.forEach(trace => {
            if (!grouped[trace.date]) {
                grouped[trace.date] = {
                    date: trace.date,
                    refunds: 0,
                    sells: 0,
                    total: {
                        CUP: 0,
                        USD: 0
                    }
                }
            }

            // Grouped trace
            grouped[trace.date].refunds += trace.refunds
            grouped[trace.date].sells += trace.sells
            grouped[trace.date].total.CUP += trace.total.CUP
            grouped[trace.date].total.USD += trace.total.USD
        })

        result = Object.values(grouped)
        return result
    }, [traceData])

    const [manualClosing, setManualClosing] = useState(false)
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
        let result = traceData.toReversed()
        let grouped = {}

        result.forEach(trace => {
            if (!grouped[trace.date]) {
                grouped[trace.date] = {
                    date: `Día ${trace.date.split('-')[2]}`,
                    CUP: 0,
                    USD: 0,
                }
            }

            grouped[trace.date].CUP += trace.total.CUP
            grouped[trace.date].USD += trace.total.USD
        })

        result = Object.values(grouped)
        return result.slice(-7)
    }, [traceData])

    /*
        const productTrace = useMemo(() => {
            let result = productData
            result = mostSoldProducts(result)
            return result
        }, [productData])
        */

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

    const providerTraceCUP = useMemo(() => {
        let result = providerData
        result = result.filter(provider => provider.active && provider.currency == 'CUP')
        result = result.map(provider => ({
            name: provider.name,
            waste: provider.waste,
        }))

        result = result.sort((a, b) => b.waste - a.waste)

        return result
    }, [providerData])

    const providerTraceUSD = useMemo(() => {
        let result = providerData
        result = result.filter(provider => provider.active && provider.currency == 'USD')
        result = result.map(provider => ({
            name: provider.name,
            waste: provider.waste,
        }))

        result = result.sort((a, b) => b.waste - a.waste)

        return result
    }, [providerData])

    /**
     * Net trace
     */


    const netSalesTrace = useMemo(() => {
        let totalWasteCUP = 0
        let totalWasteUSD = 0

        roleTrace.forEach(role => totalWasteCUP += role.waste)
        providerTraceCUP.forEach(provider => totalWasteCUP += provider.waste)
        providerTraceUSD.forEach(provider => totalWasteUSD += provider.waste)

        totalWasteCUP = Math.round(totalWasteCUP / 31)
        totalWasteUSD = Math.round(totalWasteUSD / 31)


        const result = salesTrace.map(trace => ({
            ...trace,
            CUP: trace.CUP - totalWasteCUP,
            USD: trace.USD - totalWasteUSD,
        }));

        return result

    }, [roleTrace, providerTraceCUP, providerTraceUSD, salesTrace])


    /**
     * Importation
     * @param {Array} importedData
     */
    const handleImportation = (importedData) => {
        let transformedData = []

        importedData.forEach(fragment =>
            transformedData.push({
                date: fragment.date,
                sells: parseInt(fragment.sells),
                refunds: parseInt(fragment.refunds),
                total: {
                    CUP: parseInt(fragment.CUP),
                    USD: parseInt(fragment.USD),
                }
            })
        )

        const result = [...traceData, ...transformedData]
        overwriteTrace(result)
    }

    /**
     * Autoload
     */
    useEffect(() => {
        loadData()
        normalizeTrace()
        //loadProductData()
        loadStaffData()
        loadProviderData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    /**
     * Section chips
     */
    const chips = [
        { name: "Ventas", route: "sells" },
        { name: "Ganancias", route: "earnings" },
        { name: "Empleados", route: "staff" },
        { name: "Proveedores", route: "providers" },
        { name: "Cajas", route: "days" },
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
                    <ImportPanel
                        model={{
                            "date": "Fecha",
                            "sells": "Ventas",
                            "refunds": "Reembolos",
                            "CUP": "Ganancia (CUP)",
                            "USD": "Ganancia (USD)",
                        }}
                        optionalFields={["refunds", "USD"]}
                        title={"Importar"}
                        previewComponent={({ data }) => <DayItem data={data} isOnPreview={true} />}
                        onImport={data => handleImportation(data)}
                    />
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
                                name="Ganancia bruta CUP"
                                dataKey="CUP" />
                            <Line
                                name="Ganancia bruta USD"
                                dataKey="USD"
                                stroke="var(--accent)" />

                            <XAxis dataKey="date" />

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
                            style={{ width: '100%', aspectRatio: 2.5, maxWidth: 600 }}
                            data={netSalesTrace}>

                            <Bar
                                name="Ganancia neta CUP"
                                dataKey="CUP"
                                fill="#0081A3" />

                            <Bar
                                name="Ganancia neta USD"
                                dataKey="USD"
                                fill="var(--accent)" />

                            <XAxis dataKey="date" />
                            <YAxis width="auto" />

                            <ReferenceLine y={0} stroke="#555" />

                            <Tooltip />
                            <Legend />
                        </BarChart>
                    </div>
                }

                {currentChip.route === 'staff' &&
                    <div className="
                    flex flex-col 
                    self-stretch items-center
                    w-full
                    gap-3
                    ">
                        <div className="
                        flex flex-row
                        p-2! gap-3
                        bg-(--bg-alt)
                        border border-(--border)
                        rounded-md
                        ">
                            <strong>
                                Gasto total: {salaryWaste} CUP
                            </strong>
                        </div>
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

                {currentChip.route === 'providers' &&
                    <div className="
                    flex flex-col 
                    self-stretch items-center
                    w-full
                    gap-3
                    ">
                        <div className="
                        flex flex-row
                        p-2! gap-3
                        bg-(--bg-alt)
                        border border-(--border)
                        rounded-md
                        ">
                            <strong>
                                Gasto total: {paymentWaste.CUP} CUP
                            </strong>

                            <strong>
                                Gasto total: {paymentWaste.USD} USD
                            </strong>
                        </div>

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
                            data={providerTraceCUP}>

                            <Bar
                                name="Gasto en CUP"
                                dataKey="waste"
                                fill="#0081A3" />

                            <XAxis dataKey="name" />
                            <YAxis dataKey="waste" />

                            <Tooltip />
                            <Legend />

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
                            data={providerTraceUSD}>

                            <Bar
                                name="Gasto en USD"
                                dataKey="waste"
                                fill="#0081A3" />

                            <XAxis dataKey="name" />
                            <YAxis dataKey="waste" />

                            <Tooltip />
                            <Legend />

                        </BarChart>

                    </div>
                }

                {currentChip.route === 'days' &&
                    <GridItemList>
                        {groupedDays.map((trace, index) =>
                            <DayItem key={index} data={trace} />
                        )}
                    </GridItemList>
                }
            </div>

            <div className="
            flex flex-col
            col-span-1
            p-4! gap-2
            bg-(--bg-soft)
            rounded-md
            ">
                <div className="
                flex flex-row
                item-center
                p-4! py-2! gap-1
                bg-(--bg-alt)
                border border-(--border)
                rounded-md
                ">
                    <input
                        id="auto-close"
                        type="checkbox"
                        checked={manualClosing}
                        onChange={event => setManualClosing(event.target.checked)} />

                    <label htmlFor="auto-close">
                        Cerrado manual
                    </label>
                </div>

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

                {!manualClosing &&
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
                }
                {manualClosing &&
                    <EconomyForm onSubmit={data => addTrace(data)} />
                }

            </div>

        </section>
    )
}
export default EconomyView