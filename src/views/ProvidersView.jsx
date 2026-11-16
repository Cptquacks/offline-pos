import { useEffect, useMemo, useState } from "react"
import ItemsList from "../components/ItemsList"
import useProviderStore from "../stores/providerStore"
import SearchBar from "../components/SearchBar"
import ImportPanel from "../components/ImportPanel"
import { stringSimilarity } from "../utils/string-util"
import { addDays, daysBetween, daysFromToday, getToday } from "../utils/date-util"
import { filterObjectKeysFromStructure } from "../utils/filter-util"
import TotalWasteDisplay from "../components/TotalWasteDisplay"
import useDialogStore from "../stores/dialogStore"
import LoadingDialog from "../components/LoadingDialog"
import DefaultButton from "../components/DefaultButton"
import ConfirmDialog from "../components/ConfirmDialog"
import StandardItemCardWrapper from "../components/StandardItemCardWrapper"
import StandardItemCard from "../components/StandardItemCard"
import ActiveDisplay from "../components/ActiveDisplay"
import NotesControlPanel from "../components/NotesControlPanel"
import StandarNewItemDialog from "../components/StandardNewItemDialog"
import AlertDialog from "../components/AlertDialog"
import ButtonBelt from "../components/ButtonBelt"
import SearchBarWrapper from "../components/SearchBarWrapper"
import DeleteButton from "../components/DeleteButton"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

function parseImportedActive(value, fallback) {
    if (value === undefined || value === null || value === "") return fallback;
    if (typeof value === "boolean") return value;
    if (typeof value === "number") return value !== 0;

    const normalized = String(value).trim().toLowerCase();
    if (["true", "1", "yes", "y", "si", "sí", "activo", "active"].includes(normalized)) return true;
    if (["false", "0", "no", "n", "inactivo", "inactive"].includes(normalized)) return false;
    throw new Error(`Valor de estado activo no válido: ${value}`);
}

function ProvidersView() {
    const { providerData, loadData, addProvider, addMany, modifyProvider, deleteProvider, deleteMany, addNote, deleteNote } = useProviderStore()
    const { openDialog, closeDialog } = useDialogStore()

    const today = new Date().toLocaleDateString('sv-SE')

    const [scroll, setScroll] = useState(0)
    const [query, setQuery] = useState('')
    const filteredList = useMemo(() => {
        let result = providerData

        if (query.trim().length > 0) {

            result = result.filter(product => stringSimilarity(product.name, query) >= 0.4)
            result = result.map(product => ({ ...product, similarity: stringSimilarity(product.name, query) }))
            result = result.sort((a, b) => b.similarity - a.similarity)


        }
        return result
    }, [query, providerData])

    const totalRebuys = useMemo(() => {
        return providerData.filter(provider => !provider.active).length
    }, [providerData])

    const exportedData = useMemo(() => {

        let result = filterObjectKeysFromStructure(providerData, ['index', 'notes'])

        result = result.map(provider => ({
            ...provider,
            contactData: provider?.contactData[0]?.value ?? ''
        }))

        return result
    }, [providerData]);

    const [isLoading, setLoading] = useState(false)
    const [loadValue, setLoadValue] = useState({ current: 0, total: 0 })

    // use indexes
    const [indexes, selectedIndexes] = useState([])
    const [isSelecting, setSelecting] = useState(false)
    const [notesOpened, setOpened] = useState([])

    /**
     * 
     * @param {Array} importedData 
     */
    const handleImportation = async (importedData) => {
        setLoading(true)
        setLoadValue({ current: 0, total: importedData.length })

        try {
            importedData.forEach(fragment => {
                fragment.waste = parseFloat(fragment.waste)
                fragment.currency ? fragment.currency : fragment.currency = "CUP"

                fragment.startedAt ? fragment.startedAt : fragment.startedAt = getToday()
                fragment.span ? fragment.span = parseInt(fragment.span) : fragment.span = 31

                const isActive = daysFromToday(addDays(fragment.startedAt, fragment.span)) > 0
                fragment.active = parseImportedActive(fragment.active, isActive) && isActive

                fragment.contactData ? fragment.contactData = [{ value: `${fragment.contactData}` }] : fragment.contactData = []
                fragment.notes ? fragment.notes : fragment.notes = []

                setLoadValue(prev => ({ ...prev, current: prev.current + 1 }))
            });

            await addMany(importedData)
        } finally {
            setLoading(false)
        }
    }

    const handleRebuyAll = () => {
        openDialog(<ConfirmDialog callback={() => rebuyAll()} />)
    }

    const rebuyAll = async () => {
        const today = getToday()
        const updatedData = providerData.map(provider => provider.active ?
            provider :
            ({
                ...provider,
                active: true,
                startedAt: (() => {
                    const restockDate = addDays(provider.startedAt, provider.span)
                    const newSpan = daysBetween(today, restockDate)

                    const finalDate = addDays(provider.startedAt, provider.span - newSpan)
                    return finalDate
                })()
            })
        )
        setLoading(true)
        for (const provider of updatedData.filter((item) => !item.active)) {
            const current = providerData.find((item) => item.id === provider.id)
            if (current && provider.startedAt !== current.startedAt) {
                await modifyProvider(provider.id, provider)
            }
        }
        await loadData()
        setLoading(false)
    }

    useEffect(() => {
        setLoading(true)
        loadData().then(() => setLoading(false))
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
        ">

            <div className="
            flex flex-col
            col-span-2
            bg-(--bg-soft)
            rounded-md
            ">
                <SearchBarWrapper scroll={scroll}>
                    <SearchBar onSearch={query => setQuery(query)} />
                </SearchBarWrapper>

                <div
                    className="
                    flex flex-col
                    gap-3
                    overflow-y-auto
                    "
                    onScroll={event => setScroll(event.currentTarget.scrollTop)}
                >
                    <div className="
                    flex flex-wrap flex-row
                    items-center
                    px-4! py-2! gap-3
                    ">
                        <ButtonBelt>
                            <DefaultButton
                                icon={'plus'}
                                label={'Nuevo proveedor'}
                                onClick={
                                    () => openDialog(
                                        <StandarNewItemDialog
                                            additionCallback={data => addProvider(data)}
                                            fileFields={[
                                                { 'name': 'text' },
                                                { 'waste': 'number' },
                                                { 'currency': 'currency' },
                                                { 'startedAt': 'date' },
                                                { 'span': 'number' },
                                                { 'contactData': 'phone-list' },
                                            ]}
                                            uiFields={[
                                                { 'name': 'Nombre' },
                                                { 'waste': 'Gasto' },
                                                { 'currency': 'Moneda de compra' },
                                                { 'startedAt': 'Fecha de inicio de contrato' },
                                                { 'span': 'Dias hasta la recompra' },
                                                { 'contactData': 'Numeros de telefono' },
                                            ]}
                                            icon={'handshake-alt'}
                                            label={'proveedor'}
                                            optionalFields={[]}

                                        />
                                    )
                                }
                            />
                        </ButtonBelt>

                        <ButtonBelt
                        >

                            <DefaultButton
                                label={`Recomprar todo (${totalRebuys})`}
                                icon={'sync'}
                                disabled={!totalRebuys}
                                iconLeft
                                onClick={() => handleRebuyAll()}
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
                                    selectedIndexes(providerData.map((provider) => provider.id))
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
                                "waste": "Gasto",
                                "currency": "Moneda de compra",
                                "startedAt": "Fecha de contrato",
                                "span": "Tiempo hasta la recompra (dias)",
                                "active": "Relacion activa?",
                                "contactData": "Datos de contacto"
                            }}
                            optionalFields={["startedAt", "span", "active", "contactData", "currency"]}
                            title={"Importar"}
                            onImport={data => handleImportation(data)}
                            previewComponent={({ data }) => {
                                const startDate = data.startedAt || today
                                const parsedSpan = Number.parseInt(data.span, 10)
                                const span = Number.isNaN(parsedSpan) ? 31 : parsedSpan

                                return (
                                    <StandardItemCard
                                        icon="handshake-alt"
                                        title={data.name}
                                        salaryDisplay={data.waste}
                                        startDate={startDate}
                                        endDate={addDays(startDate, span)}
                                        tagItem={
                                            <ActiveDisplay
                                                isActive={data.active}
                                            />
                                        }
                                        isOnPreview
                                    />
                                )
                            }}
                            exportData={exportedData}
                        />
                    </div>

                    <div className="
                    grid grid-cols-2
                    w-fit
                    px-4! gap-3
                    ">
                        <TotalWasteDisplay
                            elements={providerData.filter(provider => provider.active)}
                        />
                    </div>

                    <ItemsList>
                        {filteredList.map((provider, index) =>
                            <StandardItemCardWrapper
                                key={index}
                                canSelect={isSelecting}
                                onSelect={() => {
                                    if (indexes.includes(provider.id)) {
                                        selectedIndexes(prev => prev.filter(item => item !== provider.id))
                                        return
                                    }
                                    selectedIndexes(prev => [...prev, provider.id])
                                }}
                                isSelected={indexes.includes(provider.id)}
                            >
                                <StandardItemCard
                                    icon="handshake-alt"
                                    title={provider.name}
                                    tagItem={
                                        <ActiveDisplay
                                            isActive={provider.active}
                                        />
                                    }
                                    startDate={provider.startedAt}
                                    endDate={addDays(provider.startedAt, provider.span)}
                                    notesDisplay={
                                        <NotesControlPanel
                                            data={provider}
                                            handleOpen={() => {
                                                let result = [...notesOpened]

                                                if (result.includes(index))
                                                    result = result.filter(i => i !== index)

                                                else if (!result.includes(index))
                                                    result.push(index)

                                                setOpened(result)
                                            }}
                                            addNote={value => addNote(provider.id, value)}
                                        />
                                    }
                                    noteData={provider.notes ?? []}
                                    notesOpen={notesOpened.includes(index)}
                                    onNoteDelete={async (note) => {
                                        setLoading(true)
                                        await deleteNote(note.id)
                                            .then(() => setLoading(false))
                                    }}

                                    restockButton={
                                        !provider.active &&
                                        <DefaultButton
                                            label={'Renovar'}
                                            icon={'sync'}
                                            onClick={() =>
                                                modifyProvider(provider.id,
                                                    {
                                                        ...provider,
                                                        active: true,
                                                        startedAt: (() => {
                                                            const restockDate = addDays(provider.startedAt, provider.span)
                                                            const newSpan = daysBetween(today, restockDate)

                                                            const finalDate = addDays(provider.startedAt, provider.span - newSpan)
                                                            return finalDate
                                                        })()
                                                    }
                                                )
                                            }
                                        />
                                    }

                                    salaryDisplay={`${provider.waste} ${provider.currency}`}
                                    onDelete={() => deleteProvider(provider.id)}

                                    onEdit={() => openDialog(
                                        <StandarNewItemDialog
                                            additionCallback={data => modifyProvider(provider.id, { ...provider, ...data })}
                                            fileFields={[
                                                { 'name': 'text' },
                                                { 'waste': 'number' },
                                                { 'currency': 'currency' },
                                                { 'startedAt': 'date' },
                                                { 'span': 'number' },
                                                { 'active': 'active' },
                                                { 'contactData': 'phone-list' },
                                            ]}
                                            uiFields={[
                                                { 'name': 'Nombre' },
                                                { 'waste': 'Gasto' },
                                                { 'currency': 'Moneda de compra' },
                                                { 'startedAt': 'Fecha de inicio de contrato' },
                                                { 'span': 'Dias hasta la recompra' },
                                                { 'active': 'Relacion activa' },
                                                { 'contactData': 'Numeros de telefono' },
                                            ]}
                                            currentFieldData={provider}
                                            icon={'handshake-alt'}
                                            label={'proveedor'}
                                            optionalFields={[]}

                                        />
                                    )}
                                    missingData={(() => {
                                        const required = [
                                            'name',
                                            'waste',
                                            'currency',
                                            'startedAt',
                                        ]

                                        const current = Object.keys(provider)
                                            .filter(item => required.includes(item))

                                        return !current.every((element, index) =>
                                            element === required[index] &&
                                            provider[element]
                                        )
                                    })()}
                                    contactButton={
                                        provider.contactData.length !== 0 && <DefaultButton
                                            icon={'phone'}
                                            label={'Contacto'}
                                            onClick={() =>
                                                openDialog(
                                                    <AlertDialog
                                                        color={'text-green-400'}
                                                        title={'Contactos'}
                                                        icon={'info-circle'}
                                                        label={
                                                            provider.contactData.map((item, index) =>
                                                                <section
                                                                    className="
                                                                    flex flex-row
                                                                    items-center
                                                                    px-2! py-1! gap-1
                                                                    rounded-md
                                                                    bg-(--bg-soft)
                                                                    border border-white/15
                                                                    "
                                                                    key={index}
                                                                >
                                                                    <FontAwesomeIcon icon={'phone'} />
                                                                    <strong>{item.value}</strong>
                                                                </section>
                                                            )
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
export default ProvidersView