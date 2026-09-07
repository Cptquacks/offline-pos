import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function DateDisplay({ startsAt, endsAt }) {
    return (
        <div
            className="
            flex flex-row
            gap-3
            "
        >
            {startsAt && <div
                className="
                flex flex-row
                items-center
                gap-2 p-2! px-4!
                bg-(--bg-alt)
                border border-white/15
                rounded-full
                "
            >
                <FontAwesomeIcon icon={'calendar-check'} size="lg" />
                <strong>{startsAt}</strong>
            </div>}

            {endsAt && <div
                className="
                flex flex-row
                items-center
                gap-2 p-2! px-4!
                bg-(--bg-alt)
                border border-white/15
                rounded-full
                "
            >
                <FontAwesomeIcon icon={'calendar-xmark'} size="lg" />
                <strong>{endsAt}</strong>
            </div>}

        </div>
    )
}

export default DateDisplay