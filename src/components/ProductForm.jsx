import FormInput from "./FormInput"
import { useState } from "react"
import TagSelector from "./TagSelector"
import CurrencySelector from "./CurrencySelector"
import PriceSelector from "./PriceSelector"
import DatePicker from "./DatePicker"
import DefaultButton from "./DefaultButton"
import PreferenceSwitch from "./PreferenceSwitch"

function ProductForm({ onSubmit }) {
    let oneMonthSpan = new Date()
    oneMonthSpan.setMonth(oneMonthSpan.getMonth() + 1)
    oneMonthSpan = oneMonthSpan.toLocaleDateString('sv-SE')

    const [formData, setFormData] = useState({
        "name": "",
        "tag": "",
        "description": "",
        "amount": 0,
        "price": 0,
        "currency": "CUP",
        "expiresAt": null
    })

    const [automaticPrice, setAutomaticPrice] = useState(false)
    const [productExpires, setProductExpires] = useState(false)

    const [productionCost, setProductionCost] = useState(0)
    const [profitMargin, setProfitMargin] = useState(0)

    const calculatePrice = (cost, profit) => {

        const price = cost + (cost * (profit / 100))
        setFormData(prev => ({ ...prev, price: Math.round(price) }))
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

            <FormInput label="Descripcion" type="text" placeholder="Decripcion opcional..." required={false}
                onChange={data => setFormData(prev => ({ ...prev, description: data }))} />

            <TagSelector onChange={data => setFormData(prev => ({ ...prev, tag: data }))} />


            <FormInput label="Cantidad de producto" type="number" placeholder="Cantidad de producto..."
                onChange={data => setFormData(prev => ({ ...prev, amount: parseInt(data), current: parseInt(data) }))} />



            <PriceSelector onChange={data => setAutomaticPrice(data === 'automatic')} />

            {!automaticPrice &&
                <FormInput label="Precio de producto" type="number" placeholder="Precio de producto..."
                    onChange={data => setFormData(prev => ({ ...prev, price: data }))} />}

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