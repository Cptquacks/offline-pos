import { faUser } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import EmployeContractIndicator from "./EmployeContractIndicator"
import { useMemo } from "react"
import { daysFromToday } from "../utils/date-util"

function StaffItemSM({ data }) {

    const daysUntilEOC = useMemo(() => {
        let result = daysFromToday(data.endDate)
        return result
    }, [data.endDate])

    return (
        <div className="
        flex flex-col
        items-start
        p-2! gap-3
        bg-(--bg-soft)
        border border-(--border)
        rounded-md
        ">
            <div className="
            flex flex-row gap-2
            ">
                <FontAwesomeIcon icon={faUser} size="3x" />
                <div className="
                flex flex-col
                gap-3
                ">
                    <div className="
                    flex flex-col
                    ">

                        <strong className="text-xl">
                            {data.name}
                        </strong>
                        <strong className="opacity-50">
                            CI: {data.ID}
                        </strong>
                    </div>
                </div>
            </div>

            <EmployeContractIndicator days={daysUntilEOC} showButton={false} />
        </div>
    )
}

export default StaffItemSM