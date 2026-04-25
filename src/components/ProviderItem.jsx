import { faHandshakeAlt, faTrashAlt } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useState } from "react"

function ProviderItem({ data, onDelete, onChange }) {
    const [currentWaste, setCurrentWaste] = useState(data.waste ?? 0)

    const handleChange = (event) => {
        setCurrentWaste(event.target.value)
        onChange(event.target.value, data.index)
    }

    return (
        <div className="
        flex flex-row
        items-start
        p-2! gap-2
        bg-(--bg-soft)
        border border-(--border)
        rounded-md
        ">
            <FontAwesomeIcon className="my-1!" icon={faHandshakeAlt} size="3x" />

            <div className="
            flex-1 flex flex-col
            gap-3
            ">
                <div className="
                flex flex-col
                gap-2
                ">
                    <p className="font-bold! text-2xl">
                        {data.name}
                    </p>

                    <div className="
                    flex flex-row
                    items-center
                    gap-1
                    ">
                        <p>Gasto:</p>
                        <input className="
                        w-fit
                        px-1! py-0.5!
                        bg-(--bg)
                        border border-white/20
                        rounded-sm
                        "
                            type="number" value={currentWaste}
                            onChange={handleChange} />
                        <p>CUP</p>
                    </div>
                </div>

                <div className="
                flex flex-row 
                w-fit
                px-4! py-1! gap-6
                bg-(--bg-alt)
                rounded-md
                border border-(--border)
                ">
                    <p>
                        Fecha de compra:
                        <br />
                        <strong>{data.startedAt ?? 'Err'}</strong>
                    </p>

                    <p>
                        Fecha de recompra:
                        <br />
                        <strong>{data.endsAt ?? 'Err'}</strong>
                    </p>
                </div>
            </div>

            <div className="
            flex flex-col 
            h-full
            justify-between items-end gap-3
            ">
                <p className={`
                flex flex-row
                item-center
                px-4! py-0.5! gap-3
                ${data.active ? 'bg-green-600' : 'bg-red-600'}
                border-2 border-white/40
                rounded-full

                font-bold! text-white!
                `}>
                    {data.active ? 'Activo' : 'Inactivo'}
                </p>

                <button className="
                transition-normal cursor-pointer
                bg-red-500/50
                text-white!
                p-1!

                border-2 border-(--border)
                rounded-lg

                hover:shadow-(--shadow)
                " onClick={() => onDelete(data.index)}>
                    <FontAwesomeIcon icon={faTrashAlt} size="lg" />
                </button>
            </div>
        </div>
    )
}
export default ProviderItem