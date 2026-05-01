import { faBox, faCalendar } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import ExpirationDisplay from "./ExpirationDisplay"
import { useMemo } from "react"
import { daysFromToday } from "../utils/date-util"

function ProductItemSM({ data }) {
    const daysUntilED = useMemo(() => {
        return daysFromToday(data.expiresAt)
    }, [data.expiresAt])

    return (
        <div className="
        flex flex-row
        p-2! gap-2
        h-fit
        bg-(--bg-soft)
        border border-(--border)
        rounded-md
        ">
            <FontAwesomeIcon icon={faBox} size="3x" />
            <div className="
            flex-1
            flex flex-col
            gap-1
            ">
                <strong>
                    {data.name}
                </strong>
                <strong>
                    D: {data.current}
                </strong>
            </div>
            {daysUntilED <= 31 && <ExpirationDisplay days={daysUntilED} />}
            {daysUntilED >= 31 &&
                <div className="
                flex flex-row
                items-center
                h-fit
                px-4! pl-3! py-1! gap-1
                bg-(--bg-alt)
                border border-(--border)
                rounded-full
                ">
                    <FontAwesomeIcon icon={faCalendar} />
                    <strong>Expira en {data.expiresAt}</strong>
                </div>
            }
        </div>
    )
}

export default ProductItemSM