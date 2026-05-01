import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect, useMemo } from "react"
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts"
import useTraceStore from "../stores/traceStore"
import useStaffStore from "../stores/staffStore"
import { daysFromToday } from "../utils/date-util"
import StaffItemSM from "../components/StaffItemSM"

function ResumeView() {
    const { traceData, loadData } = useTraceStore()
    const { staffData, loadData: loadStaffData } = useStaffStore()

    const currencyTrace = useMemo(() => {
        let result = traceData
        const grouped = {}

        result.forEach(item => {
            if (!grouped[item.date]) {
                grouped[item.date] = {
                    date: `Día ${item.date.split('-')[2]}`,
                    CUP: 0,
                    USD: 0,
                }
            }

            grouped[item.date].CUP += parseInt(item.total.CUP)
            grouped[item.date].USD += parseInt(item.total.USD)
        })

        result = Object.values(grouped)

        return result.slice(-5)
    }, [traceData])

    const salesTrace = useMemo(() => {
        let result = traceData
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

        return result.slice(-5)
    }, [traceData])

    const employeList = useMemo(() => {
        let result = staffData.filter(member => member.endDate !== null)

        result.forEach(member => {
            member['span'] = daysFromToday(member.endDate)
        })

        result = result.sort((a, b) => b.span - a.span)

        return result
    }, [staffData])

    useEffect(() => {
        loadData()
        loadStaffData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <section className="
        grid grid-cols-3 grid-rows-4
        h-full 
        gap-3 p-4!
        ">
            <div className="
            flex flex-col 
            items-center
            col-span-2 row-span-3
            p-4! gap-3
            bg-(--bg-soft)!
            rounded-md
            ">

                <BarChart
                    className="
                    p-4!
                    bg-(--bg-soft)
                    border border-(--border)
                    rounded-md
                    "
                    style={{ width: '100%', aspectRatio: 2.5, maxWidth: 600 }}
                    data={currencyTrace}>

                    <Bar
                        dataKey="CUP"
                        fill="#0081A3" />
                    <Bar
                        dataKey="USD"
                        fill="var(--accent)" />

                    <XAxis dataKey="date" />

                    <Tooltip />
                    <Legend />

                </BarChart>

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

            </div>

            <div className="
            flex flex-col 
            row-span-4
            p-4!
            bg-(--bg-soft)!
            rounded-md
            ">
                {employeList.map((member, index) =>
                    <StaffItemSM
                        key={index}
                        data={member} />
                )}
            </div>

            <div className="
            flex flex-col 
            col-span-2
            bg-(--bg-soft)!
            rounded-md
            ">
                PRODUCTS
            </div>
        </section>
    )
}
export default ResumeView