import { faHandshakeAlt } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useMemo, useState } from "react"
import { addDays, daysBetween } from "../utils/date-util"
import NotesControlPanel from "./NotesControlPanel"
import ProviderBuyIndicator from "./ProviderBuyIndicator"
import useProviderStore from "../stores/providerStore"
import NoteItem from "./NoteItem"
import ActiveDisplay from "./ActiveDisplay"
import DeleteButton from "./DeleteButton"
import EditButton from "./EditButton"
import FormInput from "./FormInput"
import DefaultButton from "./DefaultButton"
import ContactDisplay from "./ContactDisplay"
import CurrencySelector from "./CurrencySelector"

function ProviderItem({ data, isOnPreview = false }) {

    const { providerData, modifyProvider, deleteProvider } = useProviderStore()

    const [currentData, setCurrentData] = useState(data)
    const [editMode, setEditMode] = useState(false)

    const daysUntilRestock = useMemo(() => {
        const result = addDays(data.startedAt, data.span)
        const today = new Date().toLocaleDateString('sv-SE')

        return daysBetween(today, result)
    }, [data.startedAt, data.span])

    const restockDate = useMemo(() => {
        let result = addDays(data.startedAt, data.span - daysUntilRestock)

        return result
    }, [data.startedAt, data.span, daysUntilRestock])

    const canSaveChanges = useMemo(() => {
        if (!data || !currentData) return false;
        const ignoredKeys = ['index', 'notes', 'contactData'];

        return Object.keys(data)
            .filter(key => !ignoredKeys.includes(key))
            .some(key => data[key] !== currentData[key]);
    }, [data, currentData]);


    const [notesOpen, setNotesOpen] = useState(false)

    const handleRebuy = () => {
        let result = providerData[data.index]
        result = { ...result, startedAt: restockDate }
        modifyProvider(result, data.index)
    }

    const handleNoteAddition = (note) => {
        let result = { ...data, notes: [...data.notes, { ...note }] }
        modifyProvider(result, data.index)
    }

    const handleNoteDeletion = (target) => {
        let result = { ...data, notes: [...data.notes.filter((_, index) => index !== target)] }
        if (result.notes.length === 0)
            setNotesOpen(false)

        modifyProvider(result, data.index)
    }

    const handlePhoneEdition = (phone) => {
        const result = { ...currentData, contactData: [...phone] }
        modifyProvider(result, data.index)
        setCurrentData(result)
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
            w-full
            items-start
            gap-2
            ">
                <FontAwesomeIcon className="my-1!" icon={faHandshakeAlt} size="3x" />

                <div className="
                flex-1 flex flex-col
                gap-3
                ">
                    <div className="
                    flex flex-col
                    gap-2
                    ">
                        <p className="font-bold! text-2xl">
                            {data.name}
                        </p>

                        <div className="
                        flex flex-row
                        items-center
                        gap-1
                        ">
                            {!editMode &&
                                <strong className="opacity-75">
                                    Gasto: {data.waste} {data.currency}
                                </strong>
                            }

                            {editMode &&
                                <div className="
                                flex-1
                                flex flex-row
                                flex-wrap
                                items-center
                                gap-3
                                *:bg-(--bg-alt)!
                                *:border-white/20
                                ">
                                    <FormInput
                                        label="Gasto actual"
                                        defaultValue={currentData.waste}
                                        onChange={data => setCurrentData(prev => ({ ...prev, waste: parseInt(data) }))}
                                        placeholder="Gasto actual"
                                        type="number"
                                    />

                                    <CurrencySelector
                                        onChange={data => setCurrentData(prev => ({ ...prev, currency: data }))} />

                                    <FormInput
                                        label="Días hasta recompra"
                                        defaultValue={currentData.span}
                                        type="number"
                                        onChange={data => setCurrentData(prev => ({ ...prev, span: parseInt(data) }))} />
                                </div>
                            }
                        </div>
                    </div>
                    {!isOnPreview &&
                        <ContactDisplay
                            data={currentData.contactData}
                            inEditMode={editMode}
                            onEdit={data => handlePhoneEdition(data)} />
                    }
                </div>

                <div className="
                flex flex-col 
                h-full
                justify-between items-end gap-3
                ">
                    {(editMode && daysUntilRestock > 0) &&
                        <div className="
                        flex flex-row
                        items-center
                        gap-1
                        ">
                            <input
                                type="checkbox"
                                checked={currentData.active}
                                onChange={event => setCurrentData(prev => ({ ...prev, active: event.target.checked }))}
                            />
                            <ActiveDisplay isActive={currentData.active} />
                        </div>
                    }
                    {(!editMode || daysUntilRestock <= 0) && <ActiveDisplay isActive={data.active} />}

                    {!isOnPreview && <DeleteButton onDelete={() => deleteProvider(data.index)} />}
                </div>
            </div>

            <hr className="border-(--border)" />

            <div className="flex flex-col gap-3">
                {!isOnPreview &&
                    <div className="
                    flex flex-row
                    items-start justify-between
                    ">
                        <NotesControlPanel
                            data={data}
                            notesOpen={notesOpen}
                            handleOpen={value => setNotesOpen(value)}
                            addNote={note => handleNoteAddition(note)} />

                        <div className="
                        flex flex-row
                        h-full
                        items-start
                        gap-3
                        ">

                            <ProviderBuyIndicator
                                days={daysUntilRestock}
                                onRebuy={handleRebuy} />

                            <div className="
                            flex flex-col
                            gap-0.5
                            ">
                                <EditButton
                                    onClick={() => setEditMode(true)}
                                    onSave={() => {
                                        setEditMode(false)
                                        modifyProvider(currentData, data.index)
                                    }}
                                    onEditMode={editMode}
                                    canSave={canSaveChanges} />

                                {editMode &&
                                    <DefaultButton
                                        label="Cancelar"
                                        icon="times"
                                        onClick={() => setEditMode(false)} />
                                }
                            </div>
                        </div>
                    </div>
                }

                {notesOpen &&
                    <div className="
                    flex-1
                    grid grid-cols-3 gap-3
                    h-fit
                    ">
                        {data.notes?.map((note, index) =>
                            <NoteItem
                                key={index}
                                data={note}
                                onDelete={() => handleNoteDeletion(index)}
                            />
                        )}
                    </div>
                }
            </div>
        </div >
    )
}
export default ProviderItem