import { useEffect, useMemo, useState } from "react"
import useTraceStore from "../stores/traceStore"
import { predictNextTwoDays } from "../utils/economic-util"
import { Bar, BarChart, Legend, Line, LineChart, ReferenceLine, Tooltip, XAxis, YAxis } from "recharts"
import ChipItem from "../components/ChipItem"
import ImportPanel from "../components/ImportPanel"
import useStaffStore from "../stores/staffStore"
import EconomyForm from "../components/EconomyForm"
import useProviderStore from "../stores/providerStore"
import GridItemList from "../components/GridItemList"
import DayItem from "../components/DayItem"
import useCurrencyStore from "../stores/currencyStore"
import { colorParser, lchToHex, randomLCH } from "../utils/tag-util"
import AutomaticEconomyForm from "../components/AutomaticEconomyForm"
import TotalWasteDisplay from "../components/TotalWasteDisplay"
import useDialogStore from "../stores/dialogStore"



function EconomyView() {
    const { traceData, currentTrace, loadData, addTrace, closeTrace, normalizeTrace, overwriteTrace } = useTraceStore()
    const { providerData, loadData: loadProviderData } = useProviderStore()
    const { staffData, loadData: loadStaffData } = useStaffStore()
    const { currencyList, loadData: loadCurrency } = useCurrencyStore()
    const { openDialog, closeDialog } = useDialogStore()

    // loading dialog data
    const [isLoading, setLoading] = useState(false)
    const [loadValue, setLoadValue] = useState({ current: 0, total: 0 })


    /**
     * Misc
     */
    const currencies = useMemo(() => {
        const grouped = {}
        currencyList.forEach(item => {
            if (grouped[item]) return
            grouped[item] = `Ganancia en (${item})`
        })
        return grouped
    }, [currencyList])

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
        let currencies = {}
        let grouped = {}

        result.forEach(trace =>
            Object.keys(trace.total).forEach(entry => {
                currencies[entry] = 0
            })
        )

        result.forEach(trace => {
            if (!grouped[trace.date]) {
                grouped[trace.date] = {
                    date: `Día ${trace.date.split('-')[2]}`,
                    ...currencies
                }
            }

            Object.keys(grouped[trace.date]).forEach(key => {
                if (key === 'date') return
                grouped[trace.date][key] += trace.total[key] || 0
            })
        })

        result = Object.values(grouped)

        return result.slice(-7)
    }, [traceData])

    const traceCurrencies = useMemo(() => {
        let grouped = []
        salesTrace.forEach(trace =>
            Object.keys(trace).forEach(fragment => {
                if (grouped.includes(fragment) || fragment === 'date') return
                grouped.push(fragment)
            })
        )
        return grouped
    }, [salesTrace])

    /**
     * Waste
     */
    const staffTrace = useMemo(() => {
        let grouped = {}

        staffData.forEach(staff => {
            if (!grouped[staff.salary])
                grouped[staff.salary] = {
                    salary: staff.salary,
                    staff: []
                }

            grouped[staff.salary].staff.push(staff.name)
        })

        let result = Object.values(grouped)

        result = result.map(fragment => ({
            name: fragment.staff.join('\n'),
            waste: parseInt(fragment.salary),
        }))

        console.log(result)
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
                    currency: staff.currency ?? 'CUP'
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

    const providerTrace = useMemo(() => {
        let result = providerData

        result = result.filter(provider => provider.active)
        result = result.map(provider => ({
            name: provider.name,
            waste: provider.waste ?? 0,
            currency: provider.currency,
        }))

        result = result.sort((a, b) => b.waste - a.waste)

        return result
    }, [providerData])

    /**
     * Net trace
     */
    const netSalesTrace = useMemo(() => {
        let totalWaste = currencyList.map(waste => ({ currency: waste, waste: 0 })) ?? []

        roleTrace.forEach(role =>
            totalWaste.find(waste => waste.currency === role.currency).waste += role.waste
        )
        providerTrace.map(provider =>
            totalWaste.find(waste => waste.currency === provider.currency).waste += provider.waste
        )



        totalWaste = totalWaste.map(
            waste => ({ ...waste, waste: Math.round(parseInt(waste.waste / 31)) })
        )

        let result = salesTrace.map(trace => ({ ...trace }))

        result.forEach(trace =>

            totalWaste.forEach(waste => {

                if (!trace[waste.currency]) trace[waste.currency] = 0
                trace[waste.currency] -= waste.waste

            })
        )

        return result

    }, [currencyList, salesTrace, roleTrace, providerTrace])




    const exportedData = useMemo(() => {

        const excludedKeys = ['index', 'notes', 'total'];

        let result = traceData.map(staff =>
            Object.fromEntries(
                Object.entries(staff).filter(([key]) => !excludedKeys.includes(key))
            )
        );

        result = result.map((trace, index) => ({
            ...trace,
            CUP: traceData[index].total.CUP,
            USD: traceData[index].total.USD,
        }))

        return result
    }, [traceData]);

    /**
     * Importation
     * @param {Array} importedData
     */
    const handleImportation = (importedData) => {
        setLoading(true)
        setLoadValue({ current: 0, total: importedData.length })

        let transformedData = []

        importedData.forEach(fragment => {
            transformedData.push({
                date: fragment.date,
                sells: parseInt(fragment.sells),
                refunds: parseInt(fragment.refunds),
                total: {
                    CUP: parseInt(fragment.CUP),
                    USD: parseInt(fragment.USD),
                }
            })

            setLoadValue(prev => ({ ...prev, current: prev.current + 1 }))
        })


        const result = [...traceData, ...transformedData]
        overwriteTrace(result)

        setLoading(false)
    }

    /**
     * Autoload
     */
    useEffect(() => {
        loadData()
        normalizeTrace()
        loadCurrency()
        loadStaffData()
        loadProviderData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (!isLoading) {
            closeDialog()
            return
        }

        openDialog(
            <LoadingDialog
                current={loadValue.current}
                total={loadValue.total}
            />
        )
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoading, loadValue])


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

                <div className="
                flex flex-col 
                w-full 
                gap-3
                ">
                    <ImportPanel
                        model={{
                            "date": "Fecha",
                            "sells": "Ventas",
                            "refunds": "Reembolos",
                            ...currencies
                        }}
                        optionalFields={["refunds", ...currencyList.slice(1)]}
                        title={"Importar"}
                        previewComponent={({ data }) => <DayItem data={data} isOnPreview={true} />}
                        onImport={data => handleImportation(data)}
                        exportData={exportedData}
                    />

                    {currentChip.route === 'staff' &&
                        <TotalWasteDisplay
                            elements={staffData}
                            wasteKey="salary"
                        />
                    }

                    {currentChip.route === 'providers' &&
                        <TotalWasteDisplay
                            elements={providerData}
                        />
                    }
                </div>

                {currentChip.route === 'sells' &&
                    <div className="
                    flex flex-col 
                    self-stretch items-center
                    w-full
                    gap-3 
                    overflow-y-auto
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
                    overflow-y-auto
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

                            {traceCurrencies.map((currency, index) =>
                                <Line
                                    key={index}
                                    name={`Ganancia bruta en ${currency}`}
                                    dataKey={currency}
                                    stroke={lchToHex(colorParser(randomLCH()))}
                                />
                            )}

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


                            {traceCurrencies.map((currency, index) =>
                                <Bar
                                    key={index}
                                    name={`Ganancia neta en ${currency}`}
                                    dataKey={currency}
                                    fill={lchToHex(colorParser(randomLCH()))}
                                />
                            )}

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
                    overflow-y-auto
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

                {currentChip.route === 'providers' &&
                    <div className="
                    flex flex-col 
                    self-stretch items-center
                    w-full
                    gap-3 
                    overflow-y-auto
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
                    <AutomaticEconomyForm
                        closingDay={isClosgingDay}
                        currentTrace={currentTrace}
                        onClose={handleDayClosing}
                    />
                }
                {manualClosing &&
                    <EconomyForm onSubmit={data => addTrace(data)} />
                }

            </div>

        </section>
    )
}
export default EconomyView