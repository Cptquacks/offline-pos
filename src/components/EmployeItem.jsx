import { faUser, faCalendar, faPhone } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import NotesControlPanel from "./NotesControlPanel"
import { useEffect, useMemo, useState } from "react"
import useStaffStore from "../stores/staffStore"
import EmployeContractIndicator from "./EmployeContractIndicator"
import NoteItem from "./NoteItem"
import { addDays, daysBetween, daysFromToday } from "../utils/date-util"
import TagItem from "./TagItem"
import DeleteButton from "./DeleteButton"
import MissingData from "./MissingData"
import EditButton from "./EditButton"
import DefaultButton from "./DefaultButton"
import FormInput from "./FormInput"
import TagSelectorSM from "./TagSelectorSM"
import useRoleStore from "../stores/roleStore"
import ContactDisplay from "./ContactDisplay"

function EmployeItem({ data, isOnPreview = false }) {
    const missingData = useMemo(() => {
        return !data.ID || !data.charge || !data.contact || !data.startDate
    }, [data])

    const { modifyStaff, deleteStaff } = useStaffStore()
    const { roleList, loadRoles } = useRoleStore()

    const [notesOpen, setNotesOpen] = useState(false)

    const [currentData, setCurrentData] = useState(data)
    const [editMode, setEditMode] = useState(false)

    const daysUntilEOC = useMemo(() => {
        if (!data.endDate) return null
        const result = daysFromToday(data.endDate)
        return result

    }, [data.endDate])


    const canSaveChanges = useMemo(() => {
        if (!data || !currentData) return false;
        const ignoredKeys = ['index', 'notes'];

        return Object.keys(data)
            .filter(key => !ignoredKeys.includes(key))
            .some(key => data[key] !== currentData[key]);
    }, [data, currentData]);

    const handleDeletion = () => {
        deleteStaff(data.index)
    }

    const handleRenew = () => {
        const days = daysBetween(data.startDate, data.endDate)
        const today = new Date().toLocaleDateString('sv-SE')
        let result = {
            ...data,
            startDate: today,
            endDate: addDays(today, days)
        }

        modifyStaff(result, data.index)
    }

    const handleNoteAddition = (note) => {
        let result = { ...data, notes: [...data.notes, { ...note }] }
        modifyStaff(result, data.index)
    }

    const handleNoteDeletion = (target) => {
        let result = { ...data, notes: [...data.notes.filter((_, index) => index !== target)] }
        modifyStaff(result, data.index)
    }

    useEffect(() => {
        if (roleList.length > 0) return
        loadRoles()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div className="
        flex flex-col
        bg-(--bg-soft)
        p-2! gap-3
        border border-(--border)
        rounded-md
        ">
            <div className="
            flex flex-row
            w-full self-stretch
            items-start
            gap-1
            ">
                <FontAwesomeIcon className="
                mt-2!
                " icon={faUser} size="3x" />

                <div className="
                flex-1
                ">
                    <div className="
                    flex flex-col gap-3
                    ">
                        <div className="
                        flex flex-col
                        gap-2
                        ">
                            {!editMode && <div>
                                <p className="
                                text-2xl font-bold!
                                ">
                                    {data.name}
                                </p>

                                {data.ID && <p className="opacity-50 text-sm font-bold!">
                                    CI: {data.ID}
                                </p>}
                            </div>}

                            {editMode &&
                                <div className="*:bg-(--bg-alt) w-fit *:border-white/20">
                                    <FormInput
                                        label="Nombre"
                                        placeholder="Nombre de empleado..."
                                        defaultValue={currentData.name}
                                        onChange={data => setCurrentData(prev => ({ ...prev, name: data }))} />
                                </div>
                            }

                            {!editMode &&
                                <p className="font-bold! text-sm">
                                    Salarío: {data.salary}
                                </p>
                            }

                            {editMode &&
                                <div className="
                                flex-1
                                flex flex-col
                                w-fit
                                gap-3

                                *:bg-(--bg-alt)
                                *:border-white/20
                                ">
                                    <FormInput
                                        label="Salario"
                                        placeholder="Salario de empleado..."
                                        type="number"
                                        onChange={data => setCurrentData(prev => ({ ...prev, salary: parseInt(data) }))}
                                        defaultValue={currentData.salary}
                                    />
                                </div>
                            }
                        </div>
                        {(!editMode && data.contact) &&
                            <strong className="
                            flex flex-row
                            items-center
                            w-fit
                            px-4! py-0.75! gap-1
                            bg-(--bg-alt)
                            border border-(--border)
                            rounded-md
                            ">
                                <FontAwesomeIcon icon={faPhone} />
                                {currentData.contact}
                            </strong>
                        }

                        {editMode &&
                            <div className="
                            flex flex-row
                            items-end
                            w-fit
                            p-2! gap-1
                            bg-(--bg)
                            rounded-md
                            border border-white/20
                            ">
                                <input
                                    className="
                                    border-b border-b-(--accent-alt)
                                    "
                                    placeholder="Numero de telefono..."
                                    value={currentData.contact}
                                    onChange={event => setCurrentData(prev => ({ ...prev, contact: event.target.value }))}
                                />
                            </div>
                        }
                    </div>

                </div>

                <div className="
                flex flex-col 
                self-stretch justify-between items-end
                gap-3
                ">
                    {(data.charge && !editMode) && <TagItem icon={'user-tag'} label={data.charge} />}
                    {editMode &&
                        <TagSelectorSM
                            currentTag={data.charge}
                            onSelected={data => setCurrentData(prev => ({ ...prev, charge: data }))}
                            tags={roleList}
                            icon="user-tag"
                        />
                    }

                    {!isOnPreview && <DeleteButton onDelete={handleDeletion} />}
                </div>
            </div>

            <hr className="border-(--border)" />

            <div className="
            flex flex-col
            gap-3
            ">
                <div className="
                flex flex-row
                items-start justify-between
                ">
                    {!isOnPreview && <NotesControlPanel
                        data={data}
                        notesOpen={notesOpen}
                        handleOpen={value => setNotesOpen(value)}
                        addNote={note => handleNoteAddition(note)}
                    />}

                    <div className="flex flex-row items-start gap-1.5">
                        <div className="
                        flex flex-col
                        gap-1.5 items-end
                        ">
                            {(missingData && !isOnPreview) && <MissingData />}

                            {(daysUntilEOC !== null && !isOnPreview) &&
                                <EmployeContractIndicator
                                    days={daysUntilEOC}
                                    onRenew={handleRenew} />}

                            {((daysUntilEOC === null || isOnPreview) && data.startDate) &&
                                <div className="
                                flex flex-row
                                items-center
                                px-4! py-1! gap-1
                                bg-(--bg-alt)
                                border border-(--border)
                                rounded-full
                                ">
                                    <FontAwesomeIcon icon={faCalendar} />
                                    <strong>
                                        Contratado desde {data.startDate}
                                    </strong>
                                </div>
                            }
                        </div>
                        <div className="
                        flex flex-col
                        gap-1 items-stretch
                        ">
                            <EditButton
                                canSave={canSaveChanges}
                                onEditMode={editMode}
                                onSave={() => {
                                    modifyStaff(currentData, data.index)
                                    setEditMode(false)
                                }}
                                onClick={() => setEditMode(true)} />
                            {editMode &&
                                <DefaultButton
                                    label="Cancelar"
                                    icon="times"
                                    onClick={() => setEditMode(false)} />
                            }
                        </div>
                    </div>
                </div>

                {notesOpen &&
                    <div className="
                    grid grid-cols-3 gap-3
                    ">
                        {data.notes.map((note, index) =>
                            <NoteItem
                                data={note}
                                onDelete={() => handleNoteDeletion(index)} />
                        )}
                    </div>
                }
            </div>
        </div>
    )
}
export default EmployeItem