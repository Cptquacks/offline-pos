import { faBox, faShoppingCart, faTag, faTimes } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useMemo, useState } from "react"

function KioskProductItem({ data, onSell, onRefund }) {
    const [currentAmount, setAmount] = useState(1)
    const outOfStock = useMemo(() => data.current <= 0, [data.current])

    const handleSell = () => onSell(data.index, currentAmount)
    const handleRefund = () => onRefund(data.index, currentAmount)
    console.log(outOfStock)

    return (
        <div className="
        flex flex-col
        items-center
        p-2! gap-2
        bg-(--bg-soft)
        border border-(--border)
        rounded-md
        ">
            <div className="
            flex flex-row
            w-full items-center
            gap-1
            ">

                <FontAwesomeIcon icon={faBox} size="3x" />

                <div className="
            flex-1 flex flex-col
            gap-2
            ">
                    <div className="px-2!">
                        <p className="font-bold! text-2xl">
                            {data.name}
                        </p>

                        <p>
                            {data.description}
                        </p>
                    </div>

                    <div className="
                flex flex-row 
                w-fit
                px-3! py-0.5! gap-3
                bg-(--bg-alt)
                border border-(--border)
                rounded-full
                ">
                        <p className="font-bold!">
                            U: {data.current}
                        </p>

                        <p>
                            {data.price} {data.currency}
                        </p>
                    </div>
                </div>

                <div className="
            flex flex-col
            gap-2
            items-end self-stretch justify-between
            ">
                    <p className="
                flex flex-row gap-1
                font-bold! text-lg! text-white!
                items-center
                px-3! py-px! pl-2.5!
                bg-(--accent-alt)/50
                border-2 border-(--border)
                rounded-full
                ">
                        <FontAwesomeIcon icon={faTag} />
                        {data.tag}
                    </p>
                </div>

            </div>

            <div className="
            flex flex-col
            self-start items-start
            p-3! py-1.5! gap-2
            rounded-md
            ">
                <div className="
                flex flex-row
                items-center
                gap-1
                ">
                    <p className="font-bold!">
                        Cantidad:
                    </p>
                    <input className="
                        bg-(--bg)
                        border border-white/20
                        px-2! py-0.5!
                        rounded-sm
                    " type="number" min={1} placeholder="Cantidad a vender" value={currentAmount}
                        onChange={event => setAmount(event.target.value)} required />
                </div>

                <div className="
                flex flex-row 
                w-full justify-end
                gap-4 
                ">
                    <button className="
                    transition cursor-pointer
                    flex flex-row
                    items-center
                    px-2! py-1.5! gap-1
                    font-bold
                    bg-green-600 hover:not-disabled:bg-white
                    disabled:bg-green-600/50
                    text-white! hover:not-disabled:text-(--bg-alt)!

                    disabled:text-white/50!
                    border border-white/40 disabled:border-(--border)
                    rounded-lg
                    " onClick={handleSell} disabled={currentAmount > data.amount || outOfStock}>
                        Vender
                        <FontAwesomeIcon icon={faShoppingCart} />
                    </button>

                    <button className="
                    transition-normal cursor-pointer
                    flex flex-row
                    items-center
                    px-2! py-1.5! gap-1
                    font-bold
                    bg-red-600 hover:bg-white
                    text-white! hover:text-(--bg-alt)!
                    border border-white/40
                    rounded-lg
                    " onClick={handleRefund}>
                        Devolución
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                </div>
            </div>
        </div>
    )
}
export default KioskProductItem