import { faBox } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useMemo, useState } from "react"
import TagItem from "./TagItem"
import useTagStore from "../stores/tagStore"
import DefaultButton from "./DefaultButton"

function KioskProductItem({ data, onAdd, onRefund }) {


    const { tagList } = useTagStore()
    const currentTag = useMemo(() => {
        let tag = { name: data.tag, color: '0%,0,0' }
        const filteredTag = tagList.find(tag => tag.name === data.tag) ?? {}

        return { ...tag, ...filteredTag }
    }, [tagList, data.tag])

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
                    <TagItem
                        label={currentTag.name}
                        color={currentTag.color}
                        icon="tag"
                    />
                </div>

            </div>

            <div className="
            flex flex-col
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
                " type="number" min={1} max={data.amount} value={currentAmount}
                    onChange={event => setAmount(event.target.value)} required />

                <div className="
                flex flex-row
                justify-between
                w-full
                gap-3
                ">
                    <DefaultButton
                        label="Añadir al carrito"
                        icon="shopping-cart"
                        onClick={handleAdd}
                        disabled={(currentAmount > data.amount) || outOfStock}
                        customColor="bg-green-600"
                    />
                    <DefaultButton
                        label="Devolución"
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