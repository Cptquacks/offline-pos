import { useState } from "react";

function DatePicker({ label, onChange, value = null, required = true }) {
    const [date, setDate] = useState(value ?? new Date().toISOString().split('T')[0])

    const handleChange = (event) => {
        setDate(event.target.value)
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
            "
                type='date' value={date}
                onChange={handleChange} required={required} />
        </div>
    )
}
export default DatePicker