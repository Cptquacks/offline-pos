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

            grouped[element.currency ?? 'CUP'].waste += parseInt(element[wasteKey])
        });

        const result = Object.values(grouped)
        return result
    }, [elements, wasteKey])

    const [expanded, setExpanded] = useState(false)
    return (
        <div className="
        relative
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

            <div
                data-open={expanded ? '' : null}
                className="
                absolute transition
                top-9 -left-px -right-px origin-top
                z-100 
                flex flex-col
                p-2! gap-3
                scale-y-0 opacity-0
                bg-(--bg-alt)
                border border-(--border) border-t-0
                rounded-b-md
                
                data-open:scale-y-100
                data-open:opacity-100
                "
            >
                {grouped.map((entry, index) =>
                    <strong key={index}>{entry.waste} {entry.currency}</strong>
                )}
            </div>
        </div>
    )
}
export default TotalWasteDisplay