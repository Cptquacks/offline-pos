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
import useDialogStore from "../stores/dialogStore"
import DropdownMenu from "../components/DropdownMenu"
import LoadingDialog from "../components/LoadingDialog"
import useAlertStore from "../stores/alertStore"
import SuccessToast from "../components/SuccessToast"
import ErrorToast from "../components/ErrorToast"
import StandardItemCard from "../components/StandardItemCard"
import TagItem from "../components/TagItem"
import StockDisplay from "../components/StockDisplay"
import ExpirationDisplay from "../components/ExpirationDisplay"

function InventoryView() {
    const { productData, loadData, addProduct, overwriteFile, deleteProduct } = useProductStore()
    const { tagList, loadTags, addTag } = useTagStore()
    const { openDialog, closeDialog } = useDialogStore()
    const { addAlert } = useAlertStore()


    const [query, setQuery] = useState('')
    const [filter, setFilter] = useState('All')

    const tags = useMemo(() => {
        let result = [{ label: 'Todos', icon: 'filter', value: 'All' }]
        const mappedArray = tagList.map(tag => ({ label: tag.name, icon: 'tag' }))
        result = result.concat(mappedArray)
        return result
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

    const [isLoading, setLoading] = useState(false)
    const [loadValue, setLoadValue] = useState({ current: 0, total: 0 })


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
        setLoading(true)
        setLoadValue({ current: 0, total: importedData.length })

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

            setLoadValue(prev => ({ ...prev, current: prev.current + 1 }))
        })

        for (let index = 0; index < newTags.length; index++) {
            await addTag({ name: newTags[index], color: randomLCH() })
        }

        let result = [...productData, ...importedData]
        overwriteFile(result)
        loadTags()

        setLoading(false)
    }

    useEffect(() => {
        (
            async () => {
                setLoading(true)
                await loadData()
                await loadTags()
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

    return (
        <section className="
        grid grid-cols-3 grid-rows-1 
        h-full w-full
        p-4! gap-3
        ">


            <div className="
            flex flex-col 
            col-span-2
            bg-(--bg-soft)!
            rounded-md
            ">

                <div className="
                flex flex-row
                px-4! py-2! gap-3
                justify-between
                ">
                    <SearchBar onSearch={query => handleSearch(query)} />
                    <DropdownMenu
                        elements={tags}
                        onSelected={filter => handleFilter(filter)}
                    />
                </div>

                <div className="
                flex flex-col
                overflow-y-auto
                ">
                    <div className="grid">

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
                        {/*
                            NOTE Inventory items
                        */}
                        {filteredList.map((product, index) =>
                            <StandardItemCard
                                key={index}
                                icon="box"
                                title={product.name}
                                tagItem={
                                    <TagItem
                                        icon={'tag'}
                                        label={product.tag}
                                        color={tagList.find(tag => tag.name === product.tag).color}
                                    />
                                }
                                stockDisplay={
                                    <StockDisplay
                                        total={product.amount}
                                        amount={product.current}
                                    />
                                }
                                expirationDisplay={
                                    product.expiresAt ?
                                        <ExpirationDisplay
                                            days={daysFromToday(product.expiresAt)}
                                        /> : <p></p>
                                }
                                endDate={product.expiresAt}
                                onDelete={() => deleteProduct(index)}
                            />
                        )}
                    </ItemsList>
                </div>
            </div>

            <div className="
            flex flex-col 
            h-full
            bg-(--bg-soft)!
            rounded-md
            p-4! overflow-y-auto
            ">
                <ProductForm onSubmit={async (data) => {
                    setLoading(true)
                    addProduct(data)
                        .then(() => {
                            setLoading(false)
                            addAlert(
                                <SuccessToast
                                    label='Nuevo producto añadido'
                                />
                            )
                        })
                        .catch(
                            err => {
                                setLoading(false)
                                addAlert(
                                    <ErrorToast
                                        label={`Producto no añadido: ${err}`}
                                    />
                                )
                            }
                        )
                }} />
            </div>

        </section>
    )
}

export default InventoryView