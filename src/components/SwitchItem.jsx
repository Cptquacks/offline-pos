import { useState } from "react"

function SwitchItem({ value, onChange }) {
    const [currentValue, setCurrentValue] = useState(value)

    return (

        <div className={`
        transition
        cursor-pointer
        group
        relative
        flex flex-row
        w-12 h-6.5
        items-center
        border border-white/20
        ${currentValue ? 'bg-(--accent-alt)' : 'bg-(--bg)'}
        rounded-full
        `} onClick={() => {
                setCurrentValue(!currentValue)
                onChange(!currentValue)
            }}>

            <span className={`
            absolute transition
            w-5 h-5
            p-4
            bg-(--bg-alt)
            border 
            ${!currentValue ? 'border-white/20' : 'border-(--accent)/70'}
            group-hover:bg-black/50
            ${!currentValue ? 'left-0.5' : 'right-0.5'}
            rounded-full
            `}></span>
        </div>
    )
}
export default SwitchItem