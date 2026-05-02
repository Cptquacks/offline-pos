import { useEffect, useMemo, useState } from "react"
import ProductForm from "../components/ProductForm"
import SearchBar from "../components/SearchBar"
import TagFilter from "../components/TagFilter"
import ImportPanel from "../components/ImportPanel"
import useProductStore from "../stores/productStore"
import ItemsList from "../components/ItemsList"
import ProductItem from "../components/ProductItem"
import { loadData as loadTagData } from "../utils/storage-util"
import { stringSimilarity } from "../utils/string-util"
import { daysFromToday } from "../utils/date-util"

function InventoryView() {
    const { productData, loadData, addProduct, overwriteFile } = useProductStore()
    const [tags, setTags] = useState([])

    const [query, setQuery] = useState('')
    const [filter, setFilter] = useState('All')

    const filteredList = useMemo(() => {
        let result = productData

        if (filter !== 'All') {
            result = result.filter(product => product.tag === filter)
        }

        if (query.trim().length > 0) {
            result = result.filter(product => stringSimilarity(product.name, query) >= 0.3)
            result = result.map(product => ({ ...product, similarity: stringSimilarity(product.name, query) }))
            result = result.sort((a, b) => b.similarity - a.similarity)

            console.log(query)
            result.forEach(product => console.log(`${product.name} : ${product.similarity}`))

        }

        return result
    }, [query, filter, productData])


    /**
     * 
     * @param {String} query 
     */
    const handleSearch = (query) => setQuery(query)

    /**
     * 
     * @param {String} filter 
     */
    const handleFilter = (filter) => setFilter(filter)

    /**
     * Be carefull
     * @param {Array} importedData 
     */
    const handleImportation = (importedData) => {
        importedData.forEach(fragment => {
            fragment.current ? fragment.current : fragment.current = fragment.amount
            fragment.current = parseInt(fragment.current)
            fragment.amount = parseInt(fragment.amount)
            fragment.price = parseInt(fragment.price)
            fragment.expiresAt ? fragment.span = daysFromToday(fragment.expiresAt) : fragment
        })

        let result = [...productData, ...importedData]
        console.log(result)
        overwriteFile(result)
    }

    useEffect(() => {
        loadData()
        async function loadTags() {
            const data = await loadTagData('tags')
            setTags(data)
        }
        loadTags()
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
            bg-(--bg-soft)!
            rounded-md
            overflow-y-scroll
            ">
                <div className="grid">

                    <div className="
                    flex flex-row
                    px-4! py-2! gap-3
                    justify-between
                    ">
                        <SearchBar onSearch={query => handleSearch(query)} />
                        <TagFilter filters={tags} onSelect={filter => handleFilter(filter)} />
                    </div>

                    <div className="
                    flex flex-row
                    px-4! py-2! gap-1
                    ">
                        <ImportPanel
                            model={{
                                "name": "",
                                "tag": "",
                                "description": "",
                                "amount": 0,
                                "price": 0,
                                "currency": "",
                                "expiresAt": null,
                                "current": 0
                            }}
                            previewModel={{
                                "Nombre": "",
                                "Categoría": "",
                                "Descripcion": "",
                                "Cantidad": 0,
                                "Precio": 0,
                                "Moneda": "",
                                "Fecha de caducidad": null,
                                "Disponible": 0
                            }}
                            optionalFields={['description', 'expiresAt', 'current']}
                            title="Importar"
                            onImport={data => handleImportation(data)} />
                    </div>

                </div>

                <ItemsList>
                    {filteredList.map((product, index) =>
                        <ProductItem
                            key={index}
                            data={{ index: index, ...product }} />

                    )}
                </ItemsList>
            </div>

            <div className="
            flex flex-col 
            bg-(--bg-soft)!
            rounded-md
            p-4! overflow-y-scroll
            ">
                <ProductForm onSubmit={data => addProduct(data)} />
            </div>

        </section>
    )
}

export default InventoryView