import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect, useState } from "react"

function DefaultButtonSM({ iconOne = 'check', iconTwo = 'times', defaultValue, onClick, onChange, canChange = true, disabled }) {
    const [currentStatus, setCurrentStatus] = useState(defaultValue ?? false)

    useEffect(() => {
        if (!canChange) return
        onChange(currentStatus)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentStatus])

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
            onClick={() => canChange ? setCurrentStatus(!currentStatus) : onClick()}>
            {canChange && <FontAwesomeIcon icon={currentStatus ? `${iconTwo}` : `${iconOne}`} />}
            {!canChange && <FontAwesomeIcon icon={iconOne} />}
        </button>
    )
}
export default DefaultButtonSM