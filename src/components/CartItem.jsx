import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import DeleteButton from "./DeleteButton"
import TagItem from "./TagItem"

function CartItem({ data, onRemove, itemColor }) {
    return (
        <div className="
        flex flex-row
        items-start
        gap-2
        bg-(--bg-soft)
        border border-(--border)
        rounded-md
        ">
            <FontAwesomeIcon className="pl-3! pr-0.75! py-4!" icon={'shopping-basket'} size="2x" />

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
                flex flex-col
                w-fit gap-1
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
                <TagItem
                    label={data.tag}
                    icon={'tag'}
                    color={itemColor}
                />
                <DeleteButton onDelete={() => onRemove(data.index)} />
            </div>
        </div>
    )
}
export default CartItem