import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect, useState } from "react"

function DefaultButtonSM({ iconOne = 'check', iconTwo = 'times', onChange, disabled }) {
    const [currentStatus, setCurrentStatus] = useState(true)

    useEffect(() => {
        onChange(currentStatus)
    }, [currentStatus, onChange])

    return (
        <button className="
            transition 
            not-disabled:cursor-pointer disabled:cursor-not-allowed
            flex flex-col
            items-center
            w-fit
            p-0.5! py-1!
            rounded-full
            bg-(--accent-alt) text-white!
            hover:not-disabled:bg-white hover:not-disabled:text-(--bg-alt)!
            disabled:opacity-50
            "
            disabled={disabled}
            onClick={() => setCurrentStatus(!currentStatus)}>
            <FontAwesomeIcon icon={currentStatus ? `${iconOne}` : `${iconTwo}`} />
        </button>
    )
}
export default DefaultButtonSM