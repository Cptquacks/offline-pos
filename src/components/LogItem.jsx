import { faTicketSimple } from "@fortawesome/free-solid-svg-icons/faTicketSimple"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

function LogItem({ data }) {

    return (
        <div className="
        relative overflow-hidden
        flex flex-col
        items-left
        bg-(--bg-soft)
        border border-(--border)
        rounded-lg
        ">
            <div className="
            flex flex-row
            w-full
            items-center
            p-2! py-2.5! gap-1
            bg-(--bg-alt)
            border-b border-dashed border-white/30
            rounded-t-sm
            ">
                <FontAwesomeIcon icon={faTicketSimple} size="md" />
                <strong>
                    {data.type.toUpperCase()}
                </strong>
            </div>

            <p className="
            text-lg
            px-2! py-2!
            ">
                Producto: <strong>{data.product}</strong>
            </p>

            <div className="
            flex flex-col
            p-2! gap-1
            overflow-hidden!
            ">

                <div className="
                flex flex-row
                items-center 
                px-4! py-1! gap-4
                bg-(--bg-alt)
                border border-(--border)
                rounded-full
                ">
                    <p>
                        Costo: <strong>{data.cost}</strong>
                    </p>

                    <p>
                        Cantidad: <strong>{data.amount}</strong>
                    </p>
                </div>

                <div className="
                flex flex-row
                items-center 
                px-4! py-1! gap-4
                bg-(--bg-alt)
                border border-(--border)
                rounded-full
                ">
                    <p>
                        Total: <strong>{data.total}</strong>
                    </p>

                    <p>
                        Moneda: <strong>{data.currency}</strong>
                    </p>
                </div>
            </div>

            <p className="
            bg-(--bg-alt)
            px-2! pt-2! pb-0.75!
            ">
                Fecha: <strong>{data.date ?? 'ERR'}</strong>
            </p>
        </div>
    )
}

export default LogItem