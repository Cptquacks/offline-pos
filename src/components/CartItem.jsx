import { faShoppingBasket, faTag } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import DeleteButton from "./DeleteButton"

function CartItem({ data, onRemove }) {
    return (
        <div className="
        flex flex-row
        items-start
        gap-2
        bg-(--bg-soft)
        border border-(--border)
        rounded-md
        ">
            <FontAwesomeIcon className="pl-3! pr-0.75! py-4!" icon={faShoppingBasket} size="2x" />

            <div className="
            flex-1
            flex flex-col
            py-4! gap-3
            ">
                <p className="
                font-bold!
                ">
                    {data.name}
                </p>

                <div className="
                grid grid-rows-2 
                gap-1
                w-fit
                ">
                    <p className="
                    px-3! py-0.5!
                    bg-(--bg-alt) 
                    border border-(--border)
                    rounded-full
                    ">
                        Cantidad: {data.cart}
                    </p>

                    <p className="
                    px-3! py-0.5!
                    bg-(--bg-alt) 
                    border border-(--border)
                    rounded-full
                    ">
                        Total: {data.price * data.cart} {data.currency}
                    </p>
                </div>
            </div>

            <div className="
            flex flex-col
            justify-between items-end
            h-full
            p-1!
            ">
                <p className="
                flex flex-row
                items-center
                px-2! pr-2.5! py-1 gap-px
                bg-(--bg-muted)
                text-white! font-bold!
                border-2 border-(--accent)/30
                rounded-full
                ">
                    <FontAwesomeIcon icon={faTag} />
                    {data.tag}
                </p>

                <DeleteButton onDelete={() => onRemove(data.index)} />
            </div>
        </div>
    )
}
export default CartItem