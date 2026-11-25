import { faBox } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useMemo, useRef, useState } from "react"
import TagItem from "./TagItem"
import useTagStore from "../stores/tagStore"
import DefaultButton from "./DefaultButton"

function KioskProductItem({ data, onAdd, onRefund }) {


    const { tagList } = useTagStore()
    const amountInput = useRef(null)
    const currentTag = useMemo(() => {
        let tag = { name: data.category, color: '0%,0,0' }
        const filteredTag = tagList.find(tag => tag.name === data.category) ?? {}

        return { ...tag, ...filteredTag }
    }, [tagList, data.category])

    const [currentAmount, setAmount] = useState(1)
    const outOfStock = useMemo(() => data.stock <= 0, [data.stock])

    const handleAdd = () => onAdd(data, currentAmount)
    const handleRefund = () => onRefund(data, currentAmount)

    return (
        <div className="
        flex flex-col
        items-center
        p-2! pt-2! gap-2
        bg-(--bg-soft)
        border border-(--border)
        rounded-md
        ">
            <div className="
            flex-1
            flex flex-row
            w-full
            items-start justify-between 
            gap-1
            ">

                <FontAwesomeIcon icon={faBox} size="3x" />
                <strong className="text-lg text-right">
                    {data.name.length > 16
                        ? data.name.slice(0, 16).padEnd(19, '.')
                        : data.name
                    }
                </strong>

            </div>

            <div className="
            flex-1
            flex flex-row flex-wrap
            items-start justify-between gap-1
            rounded-md
            ">
                <TagItem
                    label={currentTag.name}
                    color={currentTag.color}
                    icon="tag"
                    sm
                />

                <strong
                    className="
                    flex flex-row
                    items-center
                    px-4! py-1! gap-1
                    text-sm
                    bg-(--bg-alt)
                    rounded-full 
                    border border-white/15
                    "
                >
                    <FontAwesomeIcon
                        icon={'store'}
                    />
                    {data.stock}
                </strong>

                <span
                    className="
                    flex flex-row
                    bg-(--bg) w-full
                    items-center
                    border border-white/20
                    px-2! py-0.5! gap-1
                    rounded-sm
                    "
                >
                    <strong className="text-sm">
                        Cantidad:
                    </strong>
                    <input
                        className="flex-1"
                        ref={amountInput}
                        type="number"
                        min={1}
                        max={data.stock} value={currentAmount}
                        onChange={event => setAmount(event.target.value)}
                        required
                    />
                </span>

                <div className="
                flex-1
                flex flex-row
                justify-between
                w-full
                gap-1
                ">
                    <DefaultButton
                        label="Vender"
                        icon="shopping-cart"
                        onClick={handleAdd}
                        disabled={(currentAmount > data.stock) || outOfStock}
                        customColor="bg-green-600"
                    />
                    <DefaultButton
                        label="Reembolsar"
                        icon="times"
                        onClick={handleRefund}
                        customColor="bg-red-600"
                    />
                </div>
            </div>
        </div>
    )
}
export default KioskProductItem