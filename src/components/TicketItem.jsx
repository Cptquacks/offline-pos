import { faTicketSimple } from "@fortawesome/free-solid-svg-icons/faTicketSimple"
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
                <FontAwesomeIcon icon={faTicketSimple} size="md" />
                <strong>
                    {data.type}
                </strong>
            </div>

            {data.product &&
                <p className="
                text-lg
                px-2! py-2!
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
                flex flex-row
                items-center 
                px-2! py-1! gap-4
                ">
                    {data.products && <ol className="
                    flex flex-col
                    gap-1
                    ">
                        {data.products.map((product, index) =>
                            <li className="
                                flex flex-row
                                items-center
                                w-fit
                                gap-2
                                " key={index}>

                                <strong className="
                                    bg-(--bg-alt)
                                    px-2.5! py-0.75!
                                    rounded-full
                                    border border-(--border)
                                    ">
                                    {index + 1}
                                </strong>

                                <div className="
                                    flex flex-row
                                    gap-4
                                    bg-(--bg-alt)
                                    px-4! py-0.75!
                                    rounded-full
                                    border border-(--border)
                                    ">

                                    <p>
                                        {product.name}
                                    </p>

                                    <strong className="
                                        flex flex-row
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
                    </ol>}
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

                    <p className="
                    text-sm
                    px-1.25!">
                        CUP: {data.total.CUP}
                        <br />
                        USD: {data.total.USD}
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

export default TicketItem