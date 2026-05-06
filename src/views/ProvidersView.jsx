import { useEffect, useMemo, useState } from "react"
import ItemsList from "../components/ItemsList"
import useProviderStore from "../stores/providerStore"
import ProviderItem from "../components/ProviderItem"
import ProviderForm from "../components/ProviderForm"
import SearchBar from "../components/SearchBar"
import ImportPanel from "../components/ImportPanel"
import { stringSimilarity } from "../utils/string-util"
import { addDays, daysFromToday } from "../utils/date-util"

function ProvidersView() {
    const { providerData, paymentWaste, loadData, addProvider, overwriteData } = useProviderStore()

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

    const exportedData = useMemo(() => {

        const excludedKeys = ['index', 'notes', 'contactData'];

        let result = providerData.map(provider =>
            Object.fromEntries(
                Object.entries(provider).filter(([key]) => !excludedKeys.includes(key))
            )
        );

        result = result.map((provider, index) => ({
            ...provider,
            active: providerData[index].active ? 'Sí' : '',
            contactData: providerData[index].contactData[0]?.value ?? null
        }
        ))

        return result
    }, [providerData]);

    /**
     * 
     * @param {Array} importedData 
     */
    const handleImportation = (importedData) => {
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
        });

        const result = [...providerData, ...importedData]
        overwriteData(result)
    }

    useEffect(() => {
        loadData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <section className="
        grid grid-cols-3 grid-rows-1
        h-full
        p-4! gap-3
        ">

            <div className="
            flex flex-col
            col-span-2
            gap-3
            bg-(--bg-soft)
            rounded-md
            overflow-y-scroll
            ">
                <div className="
                flex flex-col
                px-4! py-2! gap-4
                ">
                    <SearchBar onSearch={query => setQuery(query)} />
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
                </div>

                <div className="
                grid grid-cols-2
                w-fit
                px-4! gap-3
                ">
                    <strong className="
                    px-2! py-1!
                    bg-(--bg-alt)
                    border border-(--border)
                    rounded-md
                    ">
                        Gasto CUP: {paymentWaste.CUP} CUP
                    </strong><strong className="
                    px-2! py-1!
                    bg-(--bg-alt)
                    border border-(--border)
                    rounded-md
                    ">
                        Gasto USD: {paymentWaste.USD} USD
                    </strong>
                </div>

                <ItemsList>
                    {filteredList.map((provider, index) =>
                        <ProviderItem key={index}
                            data={{ index: index, ...provider }} />
                    )}
                </ItemsList>
            </div>

            <div className="
            flex flex-col
            p-4! gap-3
            bg-(--bg-soft)
            rounded-md
            overflow-y-scroll
            ">
                <ProviderForm onSubmit={data => addProvider(data)} />
            </div>

        </section>
    )
}
export default ProvidersView