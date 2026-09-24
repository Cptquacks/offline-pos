import { useEffect, useState } from "react"
import PreferenceSwitch from "./PreferenceSwitch"

function ActiveSwitch({ defaultValue, label, onChange }) {
    const [isActive, setActive] = useState(defaultValue ?? false)

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => onChange(isActive), [isActive])
    return (
        <div className="flex flex-row items-center gap-3">
            <PreferenceSwitch
                value={isActive}
                name={label}
                onChange={() => setActive(!isActive)}
            />

            <span
                className={`
                    transition
                    border
                    px-3.75! py-0.75!
                    rounded-full

                    ${isActive ? 'bg-green-950/30' : 'bg-red-950/30'}
                    ${isActive ? 'border-green-600' : 'border-red-600'}
                    ${isActive ? 'text-green-600' : 'text-red-600'}
                `}
            >
                <strong>
                    {isActive ? 'Activa' : 'Inactiva'}
                </strong>
            </span>
        </div>
    )
}
export default ActiveSwitch