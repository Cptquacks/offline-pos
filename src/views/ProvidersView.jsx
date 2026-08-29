import { useEffect, useMemo, useState } from "react"
import ItemsList from "../components/ItemsList"
import useProviderStore from "../stores/providerStore"
import ProviderItem from "../components/ProviderItem"
import ProviderForm from "../components/ProviderForm"
import SearchBar from "../components/SearchBar"
import ImportPanel from "../components/ImportPanel"
import { stringSimilarity } from "../utils/string-util"
import { addDays, daysBetween, daysFromToday } from "../utils/date-util"
import { filterObjectKeysFromStructure } from "../utils/filter-util"
import TotalWasteDisplay from "../components/TotalWasteDisplay"
import useDialogStore from "../stores/dialogStore"
import LoadingDialog from "../components/LoadingDialog"
import DefaultButton from "../components/DefaultButton"
import ConfirmDialog from "../components/ConfirmDialog"

function ProvidersView() {
    const { providerData, loadData, addProvider, modifyProvider, overwriteData } = useProviderStore()
    const { openDialog, closeDialog } = useDialogStore()

    const today = new Date().toLocaleDateString('sv-SE')

    const [query, setQuery] = useState('')
    const filteredList = useMemo(() => {
        let result = providerData

        if (query.trim().length > 0) {

            result = result.filter(product => stringSimilarity(product.name, query) >= 0.3)
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

    /**
     * 
     * @param {Array} importedData 
     */
    const handleImportation = (importedData) => {
        setLoading(true)
        setLoadValue({ current: 0, total: importedData.length })

        const today = new Date().toLocaleDateString('sv-SE')

        importedData.forEach(fragment => {
            fragment.waste = parseInt(fragment.waste)
            fragment.currency ? fragment.currency : fragment.currency = "CUP"

            fragment.startedAt ? fragment.startedAt : fragment.startedAt = today
            fragment.span ? fragment.span = parseInt(fragment.span) : fragment.span = 31

            const isExpired = daysFromToday(addDays(fragment.startedAt, fragment.span))
            fragment.active ? fragment.active : fragment.active = !isExpired

            fragment.contactData ? fragment.contactData = [{ value: `${fragment.contactData}` }] : fragment.contactData = []
            fragment.notes ? fragment.notes : fragment.notes = []

            setLoadValue(prev => ({ ...prev, current: prev.current + 1 }))
        });

        const result = [...providerData, ...importedData]
        overwriteData(result)

        setLoading(false)
    }

    const handleRebuyAll = () => {
        openDialog(<ConfirmDialog callback={rebuyAll} />)
    }

    const rebuyAll = () => {
        providerData.forEach((provider, index) => {
            if (provider.active) return

            const restockDate = addDays(provider.startedAt, provider.span)
            const newSpan = daysBetween(today, restockDate)

            const finalDate = addDays(provider.startedAt, provider.span - newSpan)
            modifyProvider({ ...provider, startedAt: finalDate }, index)
        })
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

    return (
        <section className="
        grid grid-cols-3 grid-rows-1
        h-full
        p-4! gap-3
        ">

            <div className="
            flex flex-col
            col-span-2
            bg-(--bg-soft)
            rounded-md
            ">
                <div className="py-2! px-4!">
                    <SearchBar onSearch={query => setQuery(query)} />
                </div>

                <div className="
                flex flex-col
                gap-3
                overflow-y-auto
                ">
                    <div className="
                    flex flex-row
                    justify-between
                    px-4! py-2! gap-4
                    ">
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
                            previewComponent={({ data }) => <ProviderItem data={data} isOnPreview={true} />}
                            exportData={exportedData}
                        />

                        <div
                            className="
                            flex flex-row
                            items-center justify-center
                            px-4! py-2!
                            bg-(--bg-alt)
                            border border-white/10
                            rounded-md
                            "
                        >

                            <DefaultButton
                                label={`Recomprar todo (${totalRebuys})`}
                                icon={'hand-holding-usd'}
                                disabled={!totalRebuys}

                                onClick={handleRebuyAll}
                            />
                        </div>
                    </div>

                    <div className="
                    grid grid-cols-2
                    w-fit
                    px-4! gap-3
                    ">
                        <TotalWasteDisplay
                            elements={providerData}
                        />
                    </div>

                    <ItemsList>
                        {filteredList.map((provider, index) =>
                            <ProviderItem key={index}
                                data={{ index: index, ...provider }} />
                        )}
                    </ItemsList>
                </div>
            </div>

            <div className="
            flex flex-col
            p-4! gap-3
            bg-(--bg-soft)
            rounded-md
            overflow-y-auto
            ">
                <ProviderForm onSubmit={data => addProvider(data)} />
            </div>

        </section>
    )
}
export default ProvidersView