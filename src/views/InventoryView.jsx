import { useEffect, useMemo, useState } from "react"
import ProductForm from "../components/ProductForm"
import SearchBar from "../components/SearchBar"
import TagFilter from "../components/TagFilter"
import ImportPanel from "../components/ImportPanel"
import useProductStore from "../stores/productStore"
import ItemsList from "../components/ItemsList"
import ProductItem from "../components/ProductItem"
import { stringSimilarity } from "../utils/string-util"
import { daysFromToday } from "../utils/date-util"
import useTagStore from "../stores/tagStore"
import { filterObjectKeysFromStructure } from "../utils/filter-util"
import { randomLCH } from "../utils/tag-util"

function InventoryView() {
    const { productData, loadData, addProduct, overwriteFile } = useProductStore()
    const { tagList, loadTags, addTag } = useTagStore()

    const [query, setQuery] = useState('')
    const [filter, setFilter] = useState('All')

    const tagNames = useMemo(() => {
        return tagList.map(tag => `${tag.name}`)
    }, [tagList])

    const filteredList = useMemo(() => {
        let result = productData

        if (filter !== 'All') {
            result = result.filter(product => product.tag === filter)
        }

        if (query.trim().length > 0) {
            result = result.filter(product => stringSimilarity(product.name, query) >= 0.3)
            result = result.map(product => ({ ...product, similarity: stringSimilarity(product.name, query) }))
            result = result.sort((a, b) => b.similarity - a.similarity)

        }

        return result
    }, [query, filter, productData])


    const exportedData = useMemo(() => {
        return filterObjectKeysFromStructure(productData, ['index', 'span'])
    }, [productData]);


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
    const handleImportation = async (importedData) => {
        const newTags = []
        importedData.forEach(fragment => {

            if (
                fragment.tag &&
                fragment.tag.trim().length > 0 &&
                !tagList.includes(fragment.tag) &&
                !newTags.includes(fragment.tag)
            ) {
                newTags.push(fragment.tag)
            }
            fragment.current ? fragment.current : fragment.current = fragment.amount
            fragment.current = parseInt(fragment.current)
            fragment.amount = parseInt(fragment.amount)
            fragment.price = parseInt(fragment.price)
            fragment.expiresAt ? fragment.span = daysFromToday(fragment.expiresAt) : fragment
        })

        for (let index = 0; index < newTags.length; index++) {
            await addTag({ name: newTags[index], color: randomLCH() })
        }

        let result = [...productData, ...importedData]
        overwriteFile(result)
        loadTags()
    }

    useEffect(() => {
        loadData()
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
            overflow-y-auto
            ">
                <div className="grid">

                    <div className="
                    flex flex-row
                    px-4! py-2! gap-3
                    justify-between
                    ">
                        <SearchBar onSearch={query => handleSearch(query)} />
                        <TagFilter filters={tagNames} onSelect={filter => handleFilter(filter)} />
                    </div>

                    <div className="
                    flex flex-row
                    px-4! py-2! gap-1
                    ">
                        <ImportPanel
                            model={{
                                "name": "Nombre",
                                "tag": "Categoría",
                                "description": "Descripción",
                                "amount": "Cantidad",
                                "price": "Precio",
                                "currency": "Moneda",
                                "expiresAt": "Caducidad",
                                "current": "Disponibilidad"
                            }}
                            optionalFields={['description', 'expiresAt', 'current']}
                            title="Importar"
                            onImport={data => handleImportation(data)}
                            previewComponent={({ data }) => <ProductItem data={data} isOnPreview={true} />}
                            exportData={exportedData}
                        />
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
            p-4! overflow-y-auto
            ">
                <ProductForm onSubmit={data => addProduct(data)} />
            </div>

        </section>
    )
}

export default InventoryView