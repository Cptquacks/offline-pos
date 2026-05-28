import { useMemo, useState } from "react"
import DefaultButtonSM from "./DefaultButtonSM"

function TotalWasteDisplay({ elements, wasteKey = 'waste' }) {
    const grouped = useMemo(() => {
        let grouped = {}

        elements.forEach(element => {
            if (!grouped[element.currency ?? 'CUP']) {
                grouped[element.currency ?? 'CUP'] = {
                    currency: element.currency ?? 'CUP',
                    waste: 0
                }
            }

            grouped[element.currency ?? 'CUP'].waste += element[wasteKey]
        });
        const result = Object.values(grouped)
        console.log(result)

        return result
    }, [elements, wasteKey])

    const [expanded, setExpanded] = useState(false)
    return (
        <div className="
        flex flex-col
        w-fit
        p-2! gap-3
        bg-(--bg-alt)
        border border-(--border)
        rounded-md
        ">
            <div className="
            flex flex-row
            items-center justify-between
            gap-3
            ">
                <strong>
                    Gastos totales
                </strong>

                <DefaultButtonSM
                    iconOne="caret-down"
                    iconTwo="ellipsis-h"
                    onChange={data => setExpanded(data)}
                />
            </div>

            {!expanded && grouped.map((entry, index) =>
                <strong key={index}>{entry.waste} {entry.currency}</strong>
            )}
        </div>
    )
}
export default TotalWasteDisplay