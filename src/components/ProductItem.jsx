import { faBox, faTag, faTrashAlt } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

function ProductItem({ data, onDelete }) {

    const handleDeletion = () => {
        onDelete(data.index)
    }

    return (
        <div className="
        flex flex-row
        items-center
        p-2! gap-1
        bg-(--bg-soft)
        border border-(--border)
        rounded-md
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
                        U: {data.amount} D: {data.current}
                    </p>

                    <p>
                        Precio: {data.price} {data.currency}
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
                <div>
                    <button className="
                    transition-normal cursor-pointer
                    bg-red-500/50
                    text-white/90
                    p-1!
                    rounded-lg
                    border-2 border-(--border)
                    hover:shadow-(--shadow)
                    " onClick={handleDeletion}>
                        <FontAwesomeIcon icon={faTrashAlt} size="lg" />
                    </button>
                </div>
            </div>
        </div>
    )
}
export default ProductItem