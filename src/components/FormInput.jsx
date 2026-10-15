import { useState } from "react"
import WarningDisplay from "./WarningDisplay"

function FormInput({
    label, placeholder,
    onChange, defaultValue = null,
    type = 'text',
    required = true, min = 1,
    isValid = true
}) {
    const [value, setValue] = useState(defaultValue ?? '')

    const handleChange = (event) => {
        setValue(event.target.value)
        onChange(event.target.value)
    }
    return (
        <div className="
        flex flex-col
        gap-1 p-4!
        bg-(--bg-soft)
        border border-(--border)
        rounded-md
        ">
            <p className="
            font-bold!
            ">
                {label}
                {!required && <span className="text-red-400"> *</span>}
            </p>

            <input
                className="
                transition
                bg-(--bg)
                border border-white/20
                rounded-sm
                px-2! py-0.5!

                focus:text-white
                focus:bg-(--accent-alt)/30
                focus:border-(--accent)/50
                "
                type={type}
                value={value}
                min={min}
                onChange={handleChange}
                placeholder={placeholder}
                required={required}
            />
            {(!isValid && value.length > 0) &&
                <WarningDisplay
                    label={'El valor ingresado no es valido'}
                    important
                />
            }
        </div>
    )
}
export default FormInput