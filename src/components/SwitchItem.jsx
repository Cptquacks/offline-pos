import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useState } from "react"

function SwitchItem({ value, onChange }) {
    const [currentValue, setCurrentValue] = useState(value)

    return (

        <div className={`
            group
            transition cursor-pointer
            relative
            flex flex-row
            min-w-12 min-h-6.5
            items-center
            border border-white/20
            rounded-full

            ${currentValue ? 'bg-(--accent-alt)' : 'bg-(--bg)'}
        `}
            onClick={() => {
                setCurrentValue(!currentValue)
                onChange(!currentValue)
            }}
        >

            <span className={`
                absolute transition
                flex flex-col
                items-center justify-center
                w-5 h-5
                p-4
                bg-(--bg-alt)
                group-hover:bg-black/50
                border border-(--accent)/70
                rounded-full
                ${!currentValue ? 'border-white/20' : 'border-(--bg-alt)'}
                ${!currentValue ? 'left-0.5' : 'right-0.5'}
                overflow-hidden
            `}>
                <FontAwesomeIcon className={currentValue ? 'text-(--accent-alt)' : 'text-white/20'} icon={currentValue ? 'check' : 'times'} size="sm" />
            </span>
        </div>
    )
}
export default SwitchItem