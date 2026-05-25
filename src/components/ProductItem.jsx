import { faBox, faCalendar, faRotateLeft } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useMemo } from "react"
import { daysFromToday } from "../utils/date-util"
import ExpirationDisplay from "./ExpirationDisplay"
import useProductStore from "../stores/productStore"
import DeleteButton from "./DeleteButton"
import TagItem from "./TagItem"
import useTagStore from "../stores/tagStore"
import { colorParser } from "../utils/tag-util"

function ProductItem({ data, isOnPreview = false }) {
    const { tagList } = useTagStore()
    const { modifyProduct, deleteProduct } = useProductStore()

    const currentTag = useMemo(() => {
        let tag = { name: data.tag, color: '0%,0,0' }
        const filteredTag = tagList.find(tag => tag.name === data.tag) ?? {}

        if (filteredTag.color) {
            filteredTag.color = `${colorParser(filteredTag.color)}`
        }

        return { ...tag, ...filteredTag }
    }, [tagList, data.tag])

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

                    <TagItem label={currentTag.name} color={currentTag.color} icon={"tag"} />

                    {!isOnPreview && <DeleteButton onDelete={handleDeletion} />}

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
                                    Expira en: {data.expiresAt ?? 'ERR'}
                                </strong>
                            </div>}

                        {(expirationStatus !== null && !isOnPreview) && <ExpirationDisplay days={expirationStatus} />}
                    </div>

                    {!isOnPreview && <button className="
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
                    </button>}
                </div>
            </div>
        </div>
    )
}
export default ProductItem