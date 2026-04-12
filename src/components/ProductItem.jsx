import { faBox, faTag } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

function ProductItem({ data }) {
    return (
        <div className="
        flex flex-row
        items-center
        p-4! gap-3
        bg-(--bg-soft)
        border border-(--border)
        rounded-md
        ">
            <FontAwesomeIcon icon={faBox} size="3x" />

            <div className="
            flex-1 flex flex-col
            gap-2
            ">
                <div className="px-4!">
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
                        U: {data.amount}
                    </p>

                    <p>
                        {data.price} {data.currency}
                    </p>
                </div>
            </div>

            <div className="
            flex flex-col
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
                    <p className="font-bold! opacity-50">
                        Total: {data.price * data.amount} {data.currency}
                    </p>
                </div>
            </div>
        </div>
    )
}
export default ProductItem