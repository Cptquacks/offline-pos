import FormInput from "./FormInput"
import { useState } from "react"
import TagSelector from "./TagSelector"
import CurrencySelector from "./CurrencySelector"
import DatePicker from "./DatePicker"
import DefaultButton from "./DefaultButton"
import PreferenceSwitch from "./PreferenceSwitch"

function ProductForm({ onSubmit }) {
    let oneMonthSpan = new Date()
    oneMonthSpan.setMonth(oneMonthSpan.getMonth() + 1)
    oneMonthSpan = oneMonthSpan.toLocaleDateString('sv-SE')

    const [formData, setFormData] = useState({
        "name": "",
        "category": null,
        "unit": "",
        "stock": 0,
        "cost": 0,
        "currency": "CUP",
        "expiresAt": null
    })

    const [automaticPrice, setAutomaticPrice] = useState(false)
    const [productExpires, setProductExpires] = useState(false)

    const [productionCost, setProductionCost] = useState(0)
    const [profitMargin, setProfitMargin] = useState(0)

    const calculatePrice = (cost, profit) => {

        const price = cost + (cost * (profit / 100))
        setFormData(prev => ({ ...prev, cost: Math.round(price) }))
    }

    const handleSubmition = () => {
        onSubmit(formData)
    }

    return (
        <form action={handleSubmition} className="
        flex flex-col
        gap-3
        ">
            <div className="
            flex flex-row
            justify-between items-start
            ">
                <p className="
                font-bold! text-xl
                ">
                    Formulario de producto
                </p>

                <DefaultButton label="Añadir" icon="plus" type="submit" iconLeft />
            </div>

            <FormInput label="Nombre" type="text" placeholder="Nombre del producto..."
                onChange={data => setFormData(prev => ({ ...prev, name: data }))} />

            <TagSelector onChange={data => setFormData(prev => ({ ...prev, category: data === 'N/A' ? null : data }))} />

            <FormInput label="Unidad" type="text" placeholder="Unidad..."
                onChange={data => setFormData(prev => ({ ...prev, unit: data }))} />

            <FormInput label="Stock" type="number" placeholder="Stock disponible..."
                min={0}
                onChange={data => setFormData(prev => ({ ...prev, stock: parseInt(data, 10) }))} />


            <PreferenceSwitch
                name="Precio automatico"
                value={automaticPrice}
                onChange={data => setAutomaticPrice(data)}
            />

            {!automaticPrice &&
                <FormInput label="Precio de producto" type="number" placeholder="Precio de producto..."
                    onChange={data => setFormData(prev => ({ ...prev, cost: Number(data) }))} />}

            {automaticPrice &&
                <FormInput label="Costo de compra/produccion" type="number" placeholder="Costo..."
                    onChange={data => {
                        const newCost = parseInt(data) || 0
                        setProductionCost(newCost)
                        calculatePrice(newCost, profitMargin)
                    }} />}

            {automaticPrice &&
                <FormInput label="Margen de ganancia (porcentaje)" type="number" placeholder="Margen de ganancia (en porcentaje)..."
                    onChange={data => {
                        const newMargin = parseInt(data) || 0
                        setProfitMargin(newMargin)
                        calculatePrice(productionCost, newMargin)
                    }} />}



            <CurrencySelector onChange={data => setFormData(prev => ({ ...prev, currency: data }))} />

            <PreferenceSwitch name="Fecha de caducidad?" value={productExpires} onChange={data => setProductExpires(data)} />

            {productExpires &&
                <DatePicker label="Fecha de caducidad"
                    value={oneMonthSpan}
                    required={productExpires}
                    onChange={data => setFormData(prev => ({ ...prev, expiresAt: data }))} />}
        </form>
    )
}
export default ProductForm