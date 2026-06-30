import { faReceipt } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

function TicketItem({ data }) {

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
                <FontAwesomeIcon icon={faReceipt} size="lg" />
                <strong className="text-lg">
                    {data.type}
                </strong>
            </div>

            {data.product &&
                <p className="
                text-md
                bg-(--bg-alt)
                px-2! py-2! m-2!
                border border-white/20
                rounded-md
                ">
                    Producto: <strong>{data.product}</strong>
                </p>
            }

            <div className="
            flex flex-col
            p-2! gap-3
            overflow-hidden!
            ">

                <div className="
                flex flex-col
                px-2! py-1! gap-1
                ">
                    <strong>
                        Productos:
                    </strong>
                    {data.products &&
                        <ol
                            className="
                            flex flex-col
                            w-full
                            gap-1
                            "
                        >
                            {data.products.map((product, index) =>
                                <li
                                    key={index}
                                    className="
                                    flex flex-row
                                    items-center
                                    px-4! py-1 gap-4
                                    bg-(--bg-alt)
                                    rounded-md
                                    border border-white/20
                                    "
                                >

                                    <strong>
                                        {index + 1}
                                    </strong>

                                    <div className="
                                        flex flex-row
                                        gap-4
                                        bg-(--bg-alt)
                                        py-0.75!
                                        "
                                    >

                                        <p>
                                            {product.name}
                                        </p>

                                        <strong className="
                                            flex flex-row
                                            items-center
                                            gap-1
                                            ">
                                            <p>
                                                {product.price}
                                            </p>
                                            x
                                            <p>
                                                {product.amount}
                                            </p>
                                        </strong>

                                    </div>

                                </li>
                            )}
                        </ol>
                    }
                </div>

                <div className="
                flex flex-col
                px-4! py-1! 
                bg-(--bg-alt)
                border border-(--border)
                rounded-md
                ">
                    <strong>
                        Importe:
                    </strong>

                    <div className="
                    text-sm
                    px-1.25!">
                        {Object.keys(data.total).map((entry, index) =>
                            <p key={index}>{data.total[entry]} {entry}</p>
                        )}
                    </div>
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

export default TicketItem