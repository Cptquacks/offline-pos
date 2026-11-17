import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

function ContractDisplay({ startDate, endDate }) {
    return (
        <section
            className="
            flex flex-row
            items-center
            gap-2
            "
        >
            <div
                className="
                w-fit
                flex flex-row
                p-1! px-3! gap-2
                text-sm
                bg-(--bg-alt)
                border border-white/15
                rounded-full
                "
            >
                <FontAwesomeIcon icon={'calendar-alt'} />
                <strong>{startDate}</strong>
            </div>
            <div
                className="
                w-fit
                flex flex-row
                p-1! px-3! gap-2
                text-sm
                bg-(--bg-alt)
                border border-white/15
                rounded-full
                "
            >
                <FontAwesomeIcon icon={'calendar-alt'} />
                <strong>{endDate}</strong>
            </div>
        </section>
    )
}
export default ContractDisplay