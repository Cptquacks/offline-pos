import { faPlus } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import FormInput from "./FormInput"
import { useState } from "react"
import DatePicker from "./DatePicker"
import ListInput from "./ListInput"

function ProviderForm({ onSubmit }) {
    const oneMonthLater = new Date();
    oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);

    const [providerData, setProviderData] = useState({
        "name": '',
        "waste": 0,
        "startedAt": new Date().toLocaleDateString('sv-SE'),
        "span": 0,
        "active": true,
        "contactData": [],
        "notes": []
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

            <ListInput
                label="Telefonos de contacto"
                placeHolder="Telefono..."
                type="phone"
                onChange={data => setProviderData(prev => ({ ...prev, contactData: data }))} />

            <DatePicker label="Inicio de compra" value={providerData.startedAt}
                onChange={
                    data => setProviderData(prev => ({ ...prev, startedAt: data }))
                } />

            <FormInput label="Tiempo hasta la siguiente recompra" placeholder="Dias hasta recompra..."
                type="number"
                onChange={data => setProviderData(prev => ({ ...prev, span: parseInt(data) }))} />

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
                transition
                flex flex-row
                px-4! py-0.5!
                font-bold!
                ${providerData.active ?
                        'bg-green-950/30 text-green-600! border-green-600' :
                        'bg-red-950/30 text-red-600! border-red-600'
                    }
                border
                rounded-full
                `}>
                    {providerData.active ? 'Activo' : 'Inactivo'}
                </p>
            </div>
        </form>
    )
}

export default ProviderForm