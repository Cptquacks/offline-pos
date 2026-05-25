import { useState } from "react"

function SwitchItem({ value, onChange }) {
    const [currentValue, setCurrentValue] = useState(value)

    return (

        <div className={`
        group
        relative
        flex flex-row
        w-12 h-6.5
        items-center
        border border-white/20
        ${currentValue ? 'bg-(--accent-alt)' : ''}
        rounded-full
        `} onClick={() => {
                setCurrentValue(!currentValue)
                onChange(!currentValue)
            }}>

            <span className={`
            absolute
            transition
            w-5 h-5
            p-4
            bg-(--bg-alt)
            border border-white/20
            group-hover:bg-black/50
            ${!currentValue ? 'left-0.5' : 'right-0.5'}
            rounded-full
            `}></span>
        </div>
    )
}
export default SwitchItem