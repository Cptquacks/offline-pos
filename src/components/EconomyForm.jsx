import { useState } from "react"
import DefaultButton from "./DefaultButton"
import FormInput from "./FormInput"
import DatePicker from "./DatePicker"

function EconomyForm({ onSubmit }) {
    const [formData, setFormData] = useState({
        "date": new Date().toLocaleDateString('sv-SE'),
        "refunds": 0,
        "sells": 0,
        "total": {
            "CUP": 0,
            "USD": 0
        }
    })
    return (
        <form
            className="
            flex flex-col
            gap-3
            "
            onSubmit={() => onSubmit(formData)}>

            <div className="
            flex flex-row
            items-start justify-between
            ">
                <strong className="
                text-xl
                ">
                    Formulario de día
                </strong>
                <DefaultButton
                    icon="plus"
                    label="Añadir"
                    onClick={() => { }}
                    type="submit" />
            </div>

            <DatePicker
                label="Fecha de cierre"
                value={formData.date}
                onChange={data => setFormData(prev => ({ ...prev, date: data }))} />

            <FormInput
                label="Ventas"
                placeholder="Ventas del día..."
                type="number"
                onChange={data => setFormData(prev => ({ ...prev, sells: parseInt(data) }))} />

            <FormInput
                label="Reembolsos"
                placeholder="Reembolsos del día..."
                type="number"
                onChange={data => setFormData(prev => ({ ...prev, refunds: parseInt(data) }))} />

            <FormInput
                label="Ganancias (CUP)"
                placeholder="Ganancias del día..."
                type="number"
                onChange={data => setFormData(prev => ({ ...prev, total: { ...prev.total, CUP: parseInt(data) } }))} />

            <FormInput
                label="Ganancias (USD)"
                placeholder="Ganancias del día..."
                type="number"
                onChange={data => setFormData(prev => ({ ...prev, total: { ...prev.total, USD: parseInt(data) } }))} />

        </form>
    )
}

export default EconomyForm