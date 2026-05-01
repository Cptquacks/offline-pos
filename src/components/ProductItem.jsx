import { faBox, faCalendar, faRotateLeft, faTag, faTrashAlt } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useMemo } from "react"
import { daysFromToday } from "../utils/date-util"
import ExpirationDisplay from "./ExpirationDisplay"
import useProductStore from "../stores/productStore"

function ProductItem({ data }) {
    const { modifyProduct, deleteProduct } = useProductStore()

    const expirationStatus = useMemo(() => {
        if (!data.expiresAt) return null
        const result = daysFromToday(data.expiresAt)

        return result
    }, [data.expiresAt])

    const handleDeletion = () => {
        deleteProduct(data.index)
    }

    const handleRestock = () => {
        modifyProduct({ ...data, current: data.amount }, data.index)
    }

    return (
        <div className="
        flex flex-col
        p-2! gap-3
        bg-(--bg-soft)
        border border-(--border)
        rounded-md
        ">
            <div className="
            flex flex-row
            items-center
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
                    bg-(--accent-alt)/40
                    border-2 border-(--accent)/30
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

            <hr className="
            border-(--border)
            " />

            <div>
                <div className="
                flex flex-row
                items-center justify-between
                ">

                    <div className="
                    flex flex-row
                    items-center
                    gap-1
                    ">
                        {data.expiresAt &&
                            <div className="
                            flex flex-row
                            items-center
                            px-4! py-0.75! gap-0.5
                            bg-(--bg-alt)
                            rounded-full
                            border border-(--border)
                            ">
                                <FontAwesomeIcon icon={faCalendar} />
                                <strong>
                                    Expira en: {data.expiresAt}
                                </strong>
                            </div>}

                        {expirationStatus !== null && <ExpirationDisplay days={expirationStatus} />}
                    </div>

                    <button className="
                    transition 
                    not-disabled:cursor-pointer disabled:cursor-not-allowed
                    flex flex-row
                    items-center
                    px-3! py-1! gap-1
                    bg-(--accent-alt)
                    text-white! font-bold
                    rounded-xs
                    hover:not-disabled:text-(--bg-alt)! hover:not-disabled:bg-white
                    disabled:opacity-50
                    "
                        onClick={handleRestock}
                        disabled={data.amount === data.current}>
                        Rellenar
                        <FontAwesomeIcon icon={faRotateLeft} />
                    </button>
                </div>
            </div>
        </div>
    )
}
export default ProductItem