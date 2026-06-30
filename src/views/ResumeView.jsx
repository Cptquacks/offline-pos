import { useEffect, useMemo, useState } from "react"
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts"
import useTraceStore from "../stores/traceStore"
import useStaffStore from "../stores/staffStore"
import { daysFromToday } from "../utils/date-util"
import StaffItemSM from "../components/StaffItemSM"
import useProductStore from "../stores/productStore"
import ProductItemSM from "../components/ProductItemSM"
import useCurrencyStore from "../stores/currencyStore"
import { colorParser, lchToHex, randomLCH } from "../utils/tag-util"
import useDialogStore from "../stores/dialogStore"
import LoadingDialog from "../components/LoadingDialog"
import LoadingWidget from "../components/LoadingWidget"

function ResumeView() {
    const { traceData, loadData } = useTraceStore()
    const { currencyList, loadData: loadCurrencies } = useCurrencyStore()
    const { staffData, loadData: loadStaffData } = useStaffStore()
    const { productData, loadData: loadProductsData } = useProductStore()
    const { openDialog, closeDialog } = useDialogStore()

    const [isLoading, setLoading] = useState(false)

    const currencyTrace = useMemo(() => {
        let result = traceData.toReversed()
        const grouped = {}

        result.forEach(item => {
            if (!grouped[item.date]) {
                grouped[item.date] = {
                    date: `Día ${item.date.split('-')[2]}`
                }
            }

            Object.keys(item.total).forEach(element => {
                if (!grouped[item.date][element]) grouped[item.date][element] = 0
                grouped[item.date][element] += parseInt(item.total[element]) || 0
            });
        })

        result = Object.values(grouped)

        return result.slice(-7)
    }, [traceData])

    const salesTrace = useMemo(() => {
        let result = traceData.toReversed()
        const grouped = {}

        result.forEach(item => {
            if (!grouped[item.date]) {
                grouped[item.date] = {
                    date: `Día ${item.date.split('-')[2]}`,
                    refunds: 0,
                    sales: 0,
                }
            }

            grouped[item.date].refunds += parseInt(item.refunds)
            grouped[item.date].sales += parseInt(item.sells)
        })

        result = Object.values(grouped)

        return result.slice(-7)
    }, [traceData])

    const employeList = useMemo(() => {
        let result = staffData.filter(member => member.endDate !== null)

        result.forEach(member => {
            member['span'] = daysFromToday(member.endDate)
        })

        result = result.sort((a, b) => a.span - b.span)

        return result
    }, [staffData])

    const productList = useMemo(() => {
        let result = productData.filter(product => product.expiresAt !== null)
        result.forEach(product => {
            product['span'] = daysFromToday(product.expiresAt)
        })

        result = result.sort((a, b) => a.span - b.span)
        return result
    }, [productData])

    useEffect(() => {
        if (!isLoading) {
            closeDialog()
            return
        }

        openDialog(
            <LoadingDialog />
        )
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoading])

    useEffect(() => {
        (
            async () => {
                setLoading(true)
                await loadData()
                await loadCurrencies()
                await loadStaffData()
                await loadProductsData()
            }
        )()
            .then(() => setLoading(false))


        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <section className="
        grid grid-cols-3 grid-rows-4
        h-full 
        gap-3 p-4!
        ">
            <div
                className="
                flex flex-col 
                items-center justify-center
                col-span-2 row-span-3
                p-4! py-2! gap-2
                bg-(--bg-soft)!
                rounded-md
                overflow-y-auto
                "
            >
                {isLoading && <LoadingWidget />}
                {!isLoading &&
                    <BarChart
                        className="
                        p-4!
                        bg-(--bg-soft)
                        border border-(--border)
                        rounded-md
                        "
                        style={{ width: '100%', aspectRatio: 2.5, maxWidth: 600 }}
                        data={currencyTrace}>

                        {currencyList.map((entry, index) =>
                            <Bar
                                key={index}
                                name={`Ganancias en ${entry}`}
                                dataKey={entry}
                                fill={lchToHex(colorParser(randomLCH()))}
                            />
                        )}

                        <XAxis dataKey="date" />

                        <Tooltip />
                        <Legend />

                    </BarChart>
                }
                {!isLoading &&
                    <BarChart
                        className="
                            p-4!
                            bg-(--bg-soft)
                            border border-(--border)
                            rounded-md
                            "
                        style={{ width: '100%', aspectRatio: 2.5, maxWidth: 600 }}
                        data={salesTrace}>

                        <Bar
                            name="Ventas"
                            dataKey="sales"
                            fill="#0081A3" />

                        <Bar
                            name="Devoluciones"
                            dataKey="refunds"
                            fill="var(--accent)" />

                        <XAxis dataKey="date" />

                        <Tooltip />
                        <Legend />

                    </BarChart>
                }
            </div>

            <div className="
            flex flex-col 
            row-span-4
            p-4! gap-2
            bg-(--bg-soft)!
            rounded-md
            overflow-y-auto
            ">
                <strong className="text-xl -mt-2!">
                    Empleados temporales
                </strong>
                {employeList.map((member, index) =>
                    <StaffItemSM
                        key={index}
                        data={member} />
                )}
            </div>

            <div className="
            flex flex-col 
            col-span-2
            p-4! gap-2
            bg-(--bg-soft)!
            rounded-md
            overflow-y-auto
            ">
                <strong className="text-xl -mt-2!">
                    Productos perecederos
                </strong>
                {productList.map((product, index) =>
                    <ProductItemSM
                        key={index}
                        data={product} />
                )}
            </div>
        </section>
    )
}
export default ResumeView