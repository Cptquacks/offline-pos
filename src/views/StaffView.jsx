import { useEffect, useMemo, useState } from "react"
import SearchBar from "../components/SearchBar"
import ImportPanel from "../components/ImportPanel"
import ItemsList from "../components/ItemsList"
import useStaffStore from "../stores/staffStore"
import { stringSimilarity } from "../utils/string-util"
import useRoleStore from "../stores/roleStore"
import { filterObjectKeysFromStructure } from "../utils/filter-util"
import { randomLCH } from "../utils/tag-util"
import TotalWasteDisplay from "../components/TotalWasteDisplay"
import useDialogStore from "../stores/dialogStore"
import LoadingDialog from "../components/LoadingDialog"
import DropdownMenu from "../components/DropdownMenu"
import StandardItemCardWrapper from "../components/StandardItemCardWrapper"
import StandardItemCard from "../components/StandardItemCard"
import TagItem from "../components/TagItem"
import ExpirationDisplay from "../components/ExpirationDisplay"
import { addDays, daysBetween, daysFromToday, getToday } from "../utils/date-util"
import DefaultButton from "../components/DefaultButton"
import NotesControlPanel from "../components/NotesControlPanel"
import ButtonBelt from "../components/ButtonBelt"
import StandarNewItemDialog from "../components/StandardNewItemDialog"
import SearchBarWrapper from "../components/SearchBarWrapper"
import DeleteButton from "../components/DeleteButton"
import AlertDialog from "../components/AlertDialog"
import ConfirmDialog from "../components/ConfirmDialog"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import ContractDisplay from "../components/ContractDisplay"
import SalaryDisplay from "../components/SalaryDisplay"
import useAlertStore from "../stores/alertStore"
import ErrorToast from "../components/ErrorToast"

function StaffView() {
    const { staffData, loadData, addStaff, addMany, modifyStaff, deleteStaff, deleteMany, addNote, deleteNote } = useStaffStore()
    const { roleList, addRole, loadRoles } = useRoleStore()
    const { openDialog, closeDialog } = useDialogStore()
    const { addAlert } = useAlertStore()

    const [scroll, setScroll] = useState(0)
    const roles = useMemo(() => {
        let result = [{ label: 'Todos', icon: 'filter', value: 'All' }]
        const mappedRoles = roleList.map(role => ({ label: role.name, icon: 'user-tag' }))
        result = result.concat(mappedRoles)
        return result
    }, [roleList])

    const [filter, setFilter] = useState('All')
    const [query, setQuery] = useState('')

    const filteredList = useMemo(() => {
        let result = staffData.map(entry => entry)

        if (filter !== 'All') {
            result = result.filter(product => product.charge === filter)
        }

        if (query.trim().length > 0) {
            result = result.filter(product => stringSimilarity(product.name, query) >= 0.3)
            result = result.map(product => ({ ...product, similarity: stringSimilarity(product.name, query) }))
            result = result.sort((a, b) => b.similarity - a.similarity)

        }

        return result
    }, [query, filter, staffData])

    const expiredList = useMemo(() => {
        return (staffData ?? [])
            .map((staff, index) => {
                if (!staff.endDate) return
                if (daysFromToday(staff.endDate) > 0) return
                return index
            })
            .filter(item => item || item === 0)
    }, [staffData])

    const exportedData = useMemo(() => {
        let result = filterObjectKeysFromStructure(staffData, ['index', 'notes', 'span'])
        return result.sort((a, b) => a.name - b.name)
    }, [staffData]);

    const [isLoading, setLoading] = useState(false)
    const [loadValue, setLoadValue] = useState({ current: 0, total: 0 })

    const [indexes, selectedIndexes] = useState([])
    const [isSelecting, setSelecting] = useState(false)
    const [notesIndex, setIndex] = useState([])
    /**
     * 
     * @param {Array} importedData 
     */
    const handleImportation = async (importedData) => {
        setLoading(true)
        setLoadValue({ current: 0, total: importedData.length })

        const newRoles = []
        importedData.forEach(fragment => {
            if (fragment.charge && !newRoles.includes(fragment.charge))
                newRoles.push(fragment.charge)

            if (!fragment['currency'])
                fragment['currency'] = "CUP"

            if (!fragment.startDate)
                fragment.startDate = getToday()

            fragment.salary = parseFloat(fragment.salary)
            fragment['notes'] = []

            setLoadValue(prev => ({ ...prev, current: prev.current + 1 }))
        })

        for (let index = 0; index < newRoles.length; index++) {
            if (roleList.some(item => item.name === newRoles[index])) continue
            await addRole({ name: newRoles[index], color: randomLCH() })
        }

        try {
            await addMany(importedData)
        } finally {
            setLoading(false)
        }
    }

    const handleRehire = (member) => {
        if (typeof member.startDate !== 'string' || typeof member.endDate !== 'string') {
            addAlert(<ErrorToast label={`No se pudo calcular la duración del contrato de ${member.name}.`} />)
            return
        }

        const contractDays = daysBetween(member.startDate, member.endDate)
        if (!Number.isFinite(contractDays) || contractDays < 0) {
            addAlert(<ErrorToast label={`No se pudo calcular la duración del contrato de ${member.name}.`} />)
            return
        }

        const newEndDate = addDays(getToday(), contractDays)
        openDialog(
            <ConfirmDialog
                label={`¿Deseas recontratar a ${member.name} por ${contractDays} días?`}
                callback={async () => {
                    try {
                        await modifyStaff(member.id, { ...member, endDate: newEndDate })
                    } catch (error) {
                        addAlert(<ErrorToast label={error instanceof Error ? error.message : `No se pudo recontratar a ${member.name}.`} />)
                    }
                }}
            />
        )
    }

    useEffect(() => {
        (
            async () => {
                setLoading(true)
                await loadData()
                await loadRoles()
            }
        )()
            .then(() => setLoading(false))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (!isLoading) {
            closeDialog()
            return
        }

        openDialog(
            <LoadingDialog
                current={loadValue.current}
                total={loadValue.total}
            />
        )
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoading, loadValue])

    useEffect(() => {
        if (isSelecting) return
        selectedIndexes([])
    }, [isSelecting])

    return (
        <section className="
        grid grid-cols-1 grid-rows-1 
        h-full
        p-4! gap-3
        overflow-hidden
        ">
            <div className="
            flex flex-col 
            col-span-2
            bg-(--bg-soft)!
            rounded-md
            ">

                <SearchBarWrapper scroll={scroll}>
                    <SearchBar onSearch={query => setQuery(query)} />
                    <DropdownMenu
                        elements={roles}
                        onSelected={filter => setFilter(filter)}
                    />
                </SearchBarWrapper>

                <div
                    className="
                    flex flex-col
                    overflow-y-auto
                    "
                    onScroll={event => setScroll(event.currentTarget.scrollTop)}
                >
                    <div className="
                    flex flex-row flex-wrap
                    w-full
                    px-4! py-2! gap-4
                    ">
                        <ButtonBelt>
                            <DefaultButton
                                icon={'plus'}
                                label={'Nuevo empleado'}
                                onClick={() => openDialog(
                                    <StandarNewItemDialog
                                        additionCallback={data => addStaff(data)}
                                        fileFields={[
                                            { 'name': 'name' },
                                            { 'ID': 'text' },
                                            { 'salary': 'number' },
                                            { 'currency': 'currency' },
                                            { 'charge': 'tag-roles' },
                                            { 'contact': 'phone' },
                                            { 'startDate': 'date' },
                                            { 'endDate': 'expiration' }
                                        ]}
                                        uiFields={[
                                            { 'name': 'Nombre' },
                                            { 'ID': 'Carnet de Identidad' },
                                            { 'salary': 'Salario' },
                                            { 'currency': 'Moneda de pago' },
                                            { 'charge': 'Cargo' },
                                            { 'contact': 'Numero telefonico' },
                                            { 'startDate': 'Fecha de contratacion' },
                                            { 'endDate': 'Fecha de despido' }
                                        ]}
                                        icon={'user-edit'}
                                        label={'empleado'}
                                        optionalFields={['endDate', 'contact']}

                                    />
                                )}
                            />
                        </ButtonBelt>

                        <ButtonBelt>
                            <DefaultButton
                                icon={'sync'}
                                iconLeft
                                label={`Recontratar todos (${expiredList.length})`}
                                disabled={expiredList.length === 0}
                            />
                        </ButtonBelt>

                        <ButtonBelt>
                            <DefaultButton
                                icon={isSelecting ? 'times' : 'clipboard-list'}
                                label={isSelecting ? 'Cancelar' : 'Seleccionar'}
                                onClick={() => setSelecting(!isSelecting)}
                            />
                            {!isSelecting && <DefaultButton
                                icon={'clipboard-check'}
                                label={'Seleccionar todos'}
                                onClick={() => {
                                    setSelecting(true)
                                    selectedIndexes(staffData.map((member) => member.id))
                                }}
                            />}
                            {isSelecting && <DeleteButton
                                label={`Eliminar todos (${indexes.length})`}
                                onDelete={async () => {
                                    setLoading(true);
                                    (async () => {
                                        await deleteMany(indexes)
                                        setLoading(false)
                                        selectedIndexes([])
                                    })()
                                }}
                            />}

                        </ButtonBelt>

                        <ImportPanel
                            model={{
                                "name": "Nombre",
                                "ID": "Carnet de identidad",
                                "salary": "Salario",
                                "currency": "Moneda de pago",
                                "charge": "Cargo",
                                "contact": "Numero telefoníco",
                                "startDate": "Inicio decontrato",
                                "endDate": "Fin de contrato"
                            }}
                            optionalFields={["currency", "charge", "contact", "startDate", "endDate"]}
                            title="Importar"
                            onImport={data => handleImportation(data)}
                            previewComponent={({ data }) =>
                                <StandardItemCard
                                    icon="user-edit"
                                    title={data.name}
                                    codeBar={data.ID}
                                    startDate={data.startDate}
                                    endDate={data.endDate}
                                    tagItem={
                                        <TagItem
                                            icon={'user'}
                                            color={roleList.find(item => item.name === data.charge)?.color ?? '#000'}
                                            label={data.charge}
                                        />
                                    }
                                    salaryDisplay={data.salary}

                                    isOnPreview
                                />
                            }
                            exportData={exportedData}
                        />

                        <div className="flex flex-row gap-1">
                            <TotalWasteDisplay
                                elements={staffData}
                                wasteKey="salary"
                            />
                        </div>
                    </div>

                    <ItemsList>
                        {filteredList.map((member, index) =>
                            <StandardItemCardWrapper
                                key={index}
                                canSelect={isSelecting}
                                onSelect={() => {
                                    if (indexes.includes(member.id)) {
                                        selectedIndexes(prev => prev.filter(item => item !== member.id))
                                        return
                                    }
                                    selectedIndexes(prev => [...prev, member.id])
                                }}
                                isSelected={indexes.includes(member.id)}
                            >
                                <StandardItemCard
                                    icon="user"
                                    title={member.name}
                                    tagItem={
                                        <TagItem
                                            label={member.charge}
                                            icon="user"
                                            color={roleList.find(tag => tag.name === member.charge)?.color ?? '#000'}
                                            sm
                                        />
                                    }
                                    codeBar={`CI:${member.ID}`}
                                    contractDisplay={
                                        <ContractDisplay startDate={member.startDate} endDate={member.endDate ?? null} />
                                    }
                                    salaryDisplay={
                                        <SalaryDisplay value={member.salary} currency={member.currency} />
                                    }
                                    restockButton={
                                        (member.endDate && daysFromToday(member.endDate) <= 0) &&
                                        <DefaultButton
                                            icon={'sync'}
                                            onClick={() => handleRehire(member)}
                                        />
                                    }
                                    notesDisplay={
                                        <NotesControlPanel
                                            addNote={
                                                data => addNote(member.id, data)
                                            }
                                            data={member}
                                            handleOpen={(isOpen) => {
                                                let result = [...notesIndex]

                                                if (result.includes(index))
                                                    result = result.filter(i => i !== index)

                                                else if (!result.includes(index) && isOpen)
                                                    result.push(index)

                                                setIndex(result)
                                            }}
                                        />
                                    }
                                    notesOpen={notesIndex.includes(index)}
                                    noteData={member.notes}
                                    onNoteDelete={note => deleteNote(note.id)}
                                    onDelete={() => deleteStaff(member.id)}
                                    onEdit={() => openDialog(
                                        <StandarNewItemDialog
                                            fileFields={[
                                                { 'name': 'name' },
                                                { 'ID': 'text' },
                                                { 'salary': 'number' },
                                                { 'currency': 'currency' },
                                                { 'charge': 'tag-roles' },
                                                { 'contact': 'phone' },
                                                { 'startDate': 'date' },
                                                { 'endDate': 'expiration' }
                                            ]}
                                            uiFields={[
                                                { 'name': 'Nombre' },
                                                { 'ID': 'Carnet de Identidad' },
                                                { 'salary': 'Salario' },
                                                { 'currency': 'Moneda de pago' },
                                                { 'charge': 'Cargo' },
                                                { 'contact': 'Numero telefonico' },
                                                { 'startDate': 'Fecha de contratacion' },
                                                { 'endDate': 'Fecha de despido' }
                                            ]}
                                            icon={'user-edit'}
                                            label={'empleado'}
                                            optionalFields={['endDate', 'contact']}
                                            currentFieldData={member}
                                            additionCallback={data => modifyStaff(member.id, { ...member, ...data })}
                                        />
                                    )}
                                    missingData={(
                                        () => {
                                            const required = [
                                                'name',
                                                'ID',
                                                'salary',
                                                'currency',
                                                'charge',
                                                'startDate'
                                            ]

                                            const current = Object.keys(member)
                                                .filter(item => required.includes(item))

                                            return !current.every(item => required.includes(item) && member[item])
                                        })()
                                    }
                                    contactButton={member.contact &&
                                        <DefaultButton
                                            icon={'phone'}
                                            onClick={() =>
                                                openDialog(
                                                    <AlertDialog
                                                        color={'text-green-400'}
                                                        title={'Contactos'}
                                                        icon={'info-circle'}
                                                        label={
                                                            <section
                                                                className="
                                                                flex flex-row
                                                                items-center
                                                                px-2! py-1! gap-1
                                                                rounded-md
                                                                bg-(--bg-soft)
                                                                border border-white/15
                                                                "
                                                            >
                                                                <FontAwesomeIcon icon={'phone'} />
                                                                <strong>{member.contact}</strong>
                                                            </section>
                                                        }
                                                    />
                                                )
                                            }
                                        />
                                    }
                                />
                            </StandardItemCardWrapper>
                        )}
                    </ItemsList>
                </div>
            </div>

        </section>
    )
}

export default StaffView