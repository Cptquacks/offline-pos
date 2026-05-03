import { faBox, faShoppingCart, faTag, faTimes } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useMemo, useState } from "react"
import TagItem from "./TagItem"

function KioskProductItem({ data, onAdd, onRefund }) {
    const [currentAmount, setAmount] = useState(1)
    const outOfStock = useMemo(() => data.current <= 0, [data])

    const handleAdd = () => onAdd(data, currentAmount)
    const handleRefund = () => onRefund(data, currentAmount)

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
                            D: {data.current}
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
                    <TagItem icon="tag" label={data.tag} />
                </div>

            </div>

            <div className="
            grid grid-rows-2
            self-start items-start
            p-3! py-1.5! gap-2
            rounded-md
            ">
                <input className="
                w-full
                bg-(--bg)
                border border-white/20
                px-2! py-0.5!
                rounded-sm
                " type="number" min={1} value={currentAmount}
                    onChange={event => setAmount(event.target.value)} required />

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
                    rounded-sm
                    " onClick={handleAdd} disabled={currentAmount > data.amount || outOfStock}>
                        <FontAwesomeIcon icon={faShoppingCart} />
                        Añadir al carrito
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
                    rounded-sm
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