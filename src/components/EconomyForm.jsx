import { useMemo, useState } from "react"
import DefaultButton from "./DefaultButton"
import FormInput from "./FormInput"
import DatePicker from "./DatePicker"
import useCurrencyStore from "../stores/currencyStore"

function EconomyForm({ onSubmit }) {
    const { currencyList } = useCurrencyStore()

    const currencies = useMemo(() => {
        let currencies = {}
        currencyList.forEach(item => {
            if (currencies[item]) return
            currencies[item] = 0
        })
        return currencies
    }, [currencyList])

    const [formData, setFormData] = useState({
        "date": new Date().toLocaleDateString('sv-SE'),
        "refunds": 0,
        "sells": 0,
        "total": { ...currencies }
    })

    const handleCurrencyValue = (currency, value) => {
        const result = { ...formData.total }
        result[currency] = parseInt(value)

        setFormData(prev => ({ ...prev, total: result }))
    }

    console.table(formData)
    return (
        <form
            className="
            flex flex-col
            gap-3
            overflow-y-auto
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
                min={0}
                onChange={data => setFormData(prev => ({ ...prev, sells: parseInt(data) }))} />

            <FormInput
                label="Reembolsos"
                placeholder="Reembolsos del día..."
                type="number"
                min={0}
                onChange={data => setFormData(prev => ({ ...prev, refunds: parseInt(data) }))} />

            {Object.keys(formData.total ?? {}).map((entry, index) =>
                <FormInput
                    key={index}
                    label={`Ganancias (${entry})`}
                    placeholder="Ganancias del día"
                    type="number"
                    defaultValue={formData.total[entry]}
                    min={-999999999}
                    required={false}
                    onChange={data => handleCurrencyValue(entry, data)}
                />
            )}

        </form>
    )
}

export default EconomyForm