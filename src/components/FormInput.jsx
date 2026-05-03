import { useState } from "react"

function FormInput({ label, placeholder, onChange, defaultValue = null, type = 'text', required = true }) {
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
            </p>

            <input className="
            bg-(--bg)
            border border-white/20
            rounded-sm
            px-2! py-0.5!
            " type={type} value={value} min={1} onChange={handleChange} placeholder={placeholder} required={required} />
        </div>
    )
}
export default FormInput