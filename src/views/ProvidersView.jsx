import { useEffect, useMemo, useState } from "react"
import ItemsList from "../components/ItemsList"
import useProviderStore from "../stores/providerStore"
import ProviderItem from "../components/ProviderItem"
import ProviderForm from "../components/ProviderForm"
import SearchBar from "../components/SearchBar"
import ImportPanel from "../components/ImportPanel"
import { stringSimilarity } from "../utils/string-util"

function ProvidersView() {
    const { providerData, paymentWaste, loadData, addProvider, modifyProvider, deleteProvider } = useProviderStore()

    const [query, setQuery] = useState('')
    const filteredList = useMemo(() => {
        let result = providerData

        if (query.trim().length > 0) {

            result = result.filter(product => stringSimilarity(product.name, query) >= 0.3)
            result = result.map(product => ({ ...product, similarity: stringSimilarity(product.name, query) }))
            result = result.sort((a, b) => b.similarity - a.similarity)

            console.log(query)
            result.forEach(product => console.log(`${product.name} : ${product.similarity}`))


        }
        return result
    }, [query, providerData])

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
                    <ImportPanel />
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
                        Gasto total: {paymentWaste} CUP
                    </strong>
                </div>

                <ItemsList>
                    {filteredList.map((provider, index) =>
                        <ProviderItem key={index}
                            data={{ index: index, ...provider }}
                            onDelete={index => deleteProvider(index)}
                            onChange={(data, index) => modifyProvider({ ...provider, waste: data }, index)} />
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