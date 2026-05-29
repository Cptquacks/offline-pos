import { faBox, faCalendar } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useMemo, useState } from "react"
import { daysFromToday } from "../utils/date-util"
import ExpirationDisplay from "./ExpirationDisplay"
import useProductStore from "../stores/productStore"
import DeleteButton from "./DeleteButton"
import TagItem from "./TagItem"
import useTagStore from "../stores/tagStore"
import DefaultButton from "./DefaultButton"
import EditButton from "./EditButton"
import PreferenceSwitch from "./PreferenceSwitch"
import DatePicker from "./DatePicker"
import FormInput from "./FormInput"
import CurrencySelector from "./CurrencySelector"
import TagSelectorSM from "./TagSelectorSM"

function ProductItem({ data, isOnPreview = false }) {
    let oneMonthSpan = new Date()
    oneMonthSpan.setMonth(oneMonthSpan.getMonth() + 1)
    oneMonthSpan = oneMonthSpan.toLocaleDateString('sv-SE')

    const { tagList } = useTagStore()

    const { modifyProduct, deleteProduct } = useProductStore()

    const tagNames = useMemo(() => {
        let result = tagList
        return result.map(tag => tag.name)
    }, [tagList])

    const [currentData, setCurrentData] = useState(data)
    const [editMode, setEditMode] = useState(false)

    const canSaveChanges = useMemo(() => {
        if (!data || !currentData) return false;
        const ignoredKeys = ['index'];

        return Object.keys(data)
            .filter(key => !ignoredKeys.includes(key))
            .some(key => data[key] !== currentData[key]);
    }, [data, currentData]);

    const currentTag = useMemo(() => {
        let tag = { name: data.tag, color: '0%,0,0' }
        const filteredTag = tagList.find(tag => tag.name === data.tag) ?? {}

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

    const handleExpiration = (data) => {
        if (!data) {
            setCurrentData(prev => ({ ...prev, expiresAt: null }))
            return
        }
        setCurrentData(prev => ({ ...prev, expiresAt: oneMonthSpan }))
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
            items-start
            gap-1
            ">
                <FontAwesomeIcon className="my-1!" icon={faBox} size="3x" />

                <div className="
                flex-1 flex flex-col
                gap-2
                ">
                    <div className="px-2!">
                        {!editMode &&
                            <p className="font-bold! text-2xl">
                                {data.name}
                            </p>
                        }

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

                    <div className="
                    flex-1
                    flex flex-row
                    flex-wrap
                    
                    gap-3
                    *:bg-(--bg-alt)!
                    ">
                        {editMode &&
                            <FormInput
                                label="Nombre"
                                placeholder="Nombre de producto"
                                defaultValue={currentData.name}
                                onChange={data => setCurrentData(prev => ({ ...prev, name: data }))} />
                        }

                        {editMode &&
                            <FormInput
                                label="Descripción"
                                placeholder="Descripción de producto"
                                defaultValue={currentData.info}
                                onChange={data => setCurrentData(prev => ({ ...prev, info: data }))} />
                        }

                        {editMode &&
                            <FormInput
                                label="Cantidad"
                                placeholder="Cantidad de poducto"
                                defaultValue={currentData.amount}
                                type="number"
                                onChange={data => setCurrentData(prev => ({ ...prev, amount: parseInt(data) }))} />
                        }

                        {editMode &&
                            <FormInput
                                label="Disponibilidad"
                                placeholder="Cantidad de producto en almacén"
                                defaultValue={currentData.current}
                                type="number"
                                onChange={data => setCurrentData(prev => ({ ...prev, current: parseInt(data) }))} />
                        }

                        {editMode &&
                            <FormInput
                                label="Precio"
                                placeholder="Precio de producto"
                                defaultValue={currentData.price}
                                type="number"
                                onChange={data => setCurrentData(prev => ({ ...prev, price: parseInt(data) }))} />
                        }

                        {editMode &&
                            <CurrencySelector
                                current={currentData.currency}
                                onChange={data => setCurrentData(prev => ({ ...prev, currency: data }))} />
                        }

                        <div className="
                        flex flex-col
                        w-fit
                        gap-3 
                        last:bg-transparent!
                        *:bg-(--bg-alt)
                        ">
                            {editMode &&
                                <div className="bg-transparent!">
                                    <PreferenceSwitch
                                        name="Fecha de caducidad?"
                                        value={currentData.expiresAt ? true : false}
                                        onChange={(data) => handleExpiration(data)} />
                                </div>
                            }

                            {(currentData.expiresAt && editMode) &&
                                <DatePicker
                                    label="Fecha de expiracíon"
                                    onChange={data => setCurrentData(prev => ({ ...prev, expiresAt: data }))}
                                    value={currentData.expiresAt} />
                            }
                        </div>
                    </div>
                </div>

                <div className="
                flex flex-col
                gap-2
                items-end self-stretch justify-between
                ">

                    {!editMode && <TagItem label={currentTag.name} color={currentTag.color} icon={"tag"} />}

                    {editMode &&
                        <TagSelectorSM
                            icon="tag"
                            currentTag={currentData.tag}
                            tags={tagNames}
                            onSelected={data => setCurrentData(prev => ({ ...prev, tag: data }))}
                        />
                    }

                    {!isOnPreview && <DeleteButton onDelete={handleDeletion} />}

                </div>
            </div>

            <hr className="
            border-(--border)
            " />

            <div>
                <div className="
                flex flex-row
                items-start justify-between
                ">

                    <div className="
                    flex flex-row
                    items-center
                    gap-1
                    ">
                        {currentData.expiresAt &&
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
                                    Expira en: {currentData.expiresAt ?? 'ERR'}
                                </strong>
                            </div>}

                        {(expirationStatus !== null && !isOnPreview) && <ExpirationDisplay days={expirationStatus} />}
                    </div>

                    <div className="
                    flex flex-row
                    items-start
                    gap-3
                    ">
                        {(!isOnPreview && !editMode) &&
                            <DefaultButton
                                label="Rellenar"
                                icon="rotate-left"
                                onClick={handleRestock}
                                disabled={currentData.amount === data.current}
                                iconLeft />
                        }
                        {!isOnPreview &&
                            <div className="
                            flex flex-col
                            gap-0.5
                            ">
                                <EditButton
                                    onEditMode={editMode}
                                    canSave={canSaveChanges}
                                    onClick={() => setEditMode(true)}
                                    onSave={() => {
                                        modifyProduct(currentData, data.index)
                                        setEditMode(false)
                                    }} />

                                {editMode &&
                                    <DefaultButton
                                        label="Cancelar"
                                        icon="times"
                                        onClick={() => setEditMode(false)} />
                                }
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}
export default ProductItem