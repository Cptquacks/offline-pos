import { faPlus } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import FormInput from "./FormInput"
import { useState } from "react"
import DatePicker from "./DatePicker"

function ProviderForm({ onSubmit }) {
    const oneMonthLater = new Date();
    oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);

    const [providerData, setProviderData] = useState({
        "name": '',
        "waste": 0,
        "startedAt": new Date().toISOString().split('T')[0],
        "endsAt": oneMonthLater.toISOString().split('T')[0],
        "active": true
    })

    return (
        <form className="
        flex flex-col
        gap-3
        " onSubmit={() => onSubmit(providerData)}>
            <div className="
            flex flex-row 
            justify-between items-start
            ">
                <p className="font-bold! text-xl">
                    Formulario de proveedor
                </p>

                <button className="
                transition cursor-pointer
                flex flex-row
                items-center
                px-3! py-1! gap-1
                bg-(--accent-alt) text-white font-bold!
                rounded-xs

                hover:bg-white hover:text-(--bg-alt)
                ">
                    Añadir
                    <FontAwesomeIcon icon={faPlus} />
                </button>
            </div>

            <FormInput label="Nombre" placeholder="Nombre del proveedor..."
                onChange={
                    data => setProviderData(prev => ({ ...prev, name: data }))
                } />

            <FormInput label="Gasto" placeholder="Gasto del proveedor..." type="number"
                onChange={
                    data => setProviderData(prev => ({ ...prev, waste: parseInt(data) }))
                } />

            <DatePicker label="Inicio de compra" value={providerData.startedAt}
                onChange={
                    data => setProviderData(prev => ({ ...prev, startedAt: data }))
                } />

            <DatePicker label="Fecha de recompra" value={providerData.endsAt}
                onChange={
                    data => setProviderData(prev => ({ ...prev, endsAt: data }))
                } />

            <div className="
            flex flex-row
            items-center justify-between
            px-4! py-2! gap-1
            bg-(--bg-alt)
            border border-(--border)
            font-bold!
            rounded-md
            ">
                <div className="
                flex flex-row
                items-center
                gap-1
                ">
                    <input id="active-relation" type="checkbox" checked={providerData.active}
                        onChange={event => setProviderData(prev => ({ ...prev, active: event.target.checked }))} />

                    <label htmlFor="active-relation">
                        Relación activa?
                    </label>
                </div>

                <p className={`
                flex flex-row
                px-4! py-0.5!
                text-white! font-bold!
                ${providerData.active ? 'bg-green-600' : 'bg-red-600'}
                border-2 border-white/40
                rounded-full
                `}>
                    {providerData.active ? 'Activo' : 'Inactivo'}
                </p>
            </div>
        </form>
    )
}

export default ProviderForm