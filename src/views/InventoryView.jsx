import { useEffect, useMemo, useState } from "react"
import SearchBar from "../components/SearchBar"
import ImportPanel from "../components/ImportPanel"
import useProductStore from "../stores/productStore"
import ItemsList from "../components/ItemsList"
import { stringSimilarity } from "../utils/string-util"
import { daysFromToday } from "../utils/date-util"
import useTagStore from "../stores/tagStore"
import { filterObjectKeysFromStructure } from "../utils/filter-util"
import { randomLCH } from "../utils/tag-util"
import useDialogStore from "../stores/dialogStore"
import DropdownMenu from "../components/DropdownMenu"
import LoadingDialog from "../components/LoadingDialog"
import useAlertStore from "../stores/alertStore"
import ErrorToast from "../components/ErrorToast"
import StandardItemCard from "../components/StandardItemCard"
import TagItem from "../components/TagItem"
import StockDisplay from "../components/StockDisplay"
import ExpirationDisplay from "../components/ExpirationDisplay"
import StandardItemCardWrapper from "../components/StandardItemCardWrapper"
import DefaultButton from "../components/DefaultButton"
import DeleteButton from "../components/DeleteButton"
import StandarNewItemDialog from "../components/StandardNewItemDialog"
import ButtonBelt from "../components/ButtonBelt"
import SearchBarWrapper from "../components/SearchBarWrapper"

function InventoryView() {
    const { productData, loadData, addProduct, addProducts, modifyProduct, deleteProduct, deleteProducts } = useProductStore()
    const { tagList, loadTags, addTag } = useTagStore()
    const { openDialog, closeDialog } = useDialogStore()
    const { addAlert } = useAlertStore()

    const [scroll, setScroll] = useState(0)
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
            result = result.filter(product => product.category === filter)
        }

        if (query.trim().length > 0) {
            result = result.filter(product => stringSimilarity(product.name, query) >= 0.3)
            result = result.map(product => ({ ...product, similarity: stringSimilarity(product.name, query) }))
            result = result.sort((a, b) => b.similarity - a.similarity)

        }

        return result
    }, [query, filter, productData])


    const exportedData = useMemo(() => {
        return filterObjectKeysFromStructure(productData, ['id', 'createdAt'])
    }, [productData]);

    const [isLoading, setLoading] = useState(false)

    const [isSelecting, setSelecting] = useState(false)
    const [selectedIds, setSelectedIds] = useState([])


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

        try {
            const newTags = [...new Set(
                importedData
                    .map((product) => product.category)
                    .filter((category) => category && category !== 'N/A')
            )]

            for (const category of newTags) {
                if (tagList.some(item => item.name === category)) continue
                await addTag({ name: category, color: randomLCH() })
            }

            const products = importedData.map((product) => ({
                name: product.name,
                cost: Number(product.cost),
                stock: Number.parseInt(product.stock, 10),
                unit: product.unit,
                category: product.category && product.category !== 'N/A' ? product.category : null,
                currency: product.currency,
                expiresAt: product.expiresAt || null,
            }))

            await addProducts(products)
            await loadTags()
        } catch {
            addAlert(<ErrorToast label={'No se pudieron importar los productos'} />)
        } finally {
            setLoading(false)
        }
    }

    const deleteItems = async () => {
        await deleteProducts(selectedIds)
        setSelectedIds([])
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

    /**
     * Loading dialog functionallity
     */
    useEffect(() => {
        if (!isLoading) {
            closeDialog()
            return
        }

        openDialog(
            <LoadingDialog />
        )
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoading])

    useEffect(() => {
        if (isSelecting) return
        setSelectedIds([])
    }, [isSelecting])

    return (
        <section className="
        grid grid-cols-1 grid-rows-1 
        h-full w-full
        p-4! gap-3
        ">


            <div className="
            flex flex-col 
            col-span-2
            bg-(--bg-soft)!
            rounded-md
            ">

                <SearchBarWrapper scroll={scroll}>
                    <SearchBar onSearch={query => handleSearch(query)} />
                    <DropdownMenu
                        elements={tags}
                        onSelected={filter => handleFilter(filter)}
                    />
                </SearchBarWrapper>

                <div
                    className="
                    flex flex-col
                    overflow-y-auto
                    "

                    onScroll={event => setScroll(event.currentTarget.scrollTop)}
                >
                    <div className="flex flex-row flex-wrap w-full gap-3 px-4! py-2!">

                        <ButtonBelt>
                            <DefaultButton
                                label={"Nuevo producto"}
                                icon={"plus"}
                                onClick={() => openDialog(
                                    <StandarNewItemDialog
                                        icon={'box'}
                                        label={'producto'}
                                        fileFields={[
                                            { 'name': 'text' },
                                            { 'category': 'tag' },
                                            { 'unit': 'text' },
                                            { 'stock': 'number' },
                                            { 'cost': 'price' },
                                            { 'currency': 'currency' },
                                            { 'expiresAt': 'expiration' }
                                        ]}
                                        uiFields={[
                                            { 'name': 'Nombre' },
                                            { 'category': 'Categoría' },
                                            { 'unit': 'Unidad' },
                                            { 'stock': 'Stock' },
                                            { 'cost': 'Precio' },
                                            { 'currency': 'Moneda de pago' },
                                            { 'expiresAt': 'Fecha de caducidad' }
                                        ]}
                                        optionalFields={['category', 'expiresAt', 'unit']}
                                        additionCallback={value => addProduct(value)}
                                        alertCallback={() => addAlert(<ErrorToast label={'No se ha podido crear el nuevo item'} />)}
                                    />
                                )}
                            />
                        </ButtonBelt>

                        <ButtonBelt>
                            <DefaultButton
                                label={isSelecting ? "Cancelar" : "Seleccionar"}
                                icon={isSelecting ? "times" : "clipboard-list"}
                                onClick={() => setSelecting(!isSelecting)}
                            />

                            {!isSelecting && <DefaultButton
                                label={"Seleccionar todos"}
                                icon={"clipboard-check"}
                                onClick={() => {
                                    setSelectedIds(productData.map((product) => product.id))
                                    setSelecting(true)
                                }}
                            />}

                            {selectedIds.length > 0 && <DeleteButton
                                label={`Eliminar todos (${selectedIds.length})`}
                                onDelete={async () => {
                                    setLoading(true)
                                    try {
                                        await deleteItems()
                                    } catch {
                                        addAlert(<ErrorToast label={'No se pudieron eliminar los productos seleccionados'} />)
                                    } finally {
                                        setLoading(false)
                                    }
                                }}
                            />}
                        </ButtonBelt>

                        <ImportPanel
                            model={{
                                "name": "Nombre",
                                "category": "Categoría",
                                "unit": "Unidad",
                                "stock": "Stock disponible",
                                "cost": "Precio",
                                "currency": "Moneda",
                                "expiresAt": "Caducidad"
                            }}
                            optionalFields={['category', 'expiresAt']}
                            onImport={data => handleImportation(data)}
                            previewComponent={({ data }) =>
                                <StandardItemCard
                                    icon="box"
                                    title={data.name}
                                    endDate={data.expiresAt}
                                    stockDisplay={
                                        <StockDisplay
                                            stock={data.stock}
                                        />
                                    }
                                    salaryDisplay={`${data.cost ?? ''} ${data.currency ?? ''}`}
                                    isOnPreview
                                />
                            }
                            exportData={exportedData}
                        />

                    </div>

                    <ItemsList>
                        {/*
                            NOTE Inventory items
                        */}
                        {filteredList.map((product) =>
                            <StandardItemCardWrapper
                                canSelect={isSelecting}
                                isSelected={selectedIds.includes(product.id)}
                                onSelect={() => {
                                    if (selectedIds.includes(product.id)) {
                                        setSelectedIds(prev => prev.filter((id) => id !== product.id))
                                        return
                                    }
                                    setSelectedIds(prev => [...prev, product.id])
                                }}
                                key={product.id}
                            >
                                <StandardItemCard
                                    icon="box"
                                    title={product.name}
                                    tagItem={
                                        <TagItem
                                            icon={'tag'}
                                            label={product.category ?? 'N/A'}
                                            color={tagList.find(tag => tag.name === product.category)?.color ?? '#000'}
                                        />
                                    }
                                    stockDisplay={
                                        <StockDisplay
                                            stock={product.stock}
                                        />
                                    }
                                    expirationDisplay={
                                        product.expiresAt ?
                                            <ExpirationDisplay
                                                days={daysFromToday(product.expiresAt)}
                                            /> : null
                                    }
                                    onEdit={() => openDialog(
                                        <StandarNewItemDialog
                                            icon={'box'}
                                            label={'producto'}
                                            fileFields={[
                                                { 'name': 'text' },
                                                { 'category': 'tag' },
                                                { 'unit': 'text' },
                                                { 'stock': 'number' },
                                                { 'cost': 'price' },
                                                { 'currency': 'currency' },
                                                { 'expiresAt': 'expiration' }
                                            ]}
                                            uiFields={[
                                                { 'name': 'Nombre' },
                                                { 'category': 'Categoría' },
                                                { 'unit': 'Unidad' },
                                                { 'stock': 'Stock' },
                                                { 'cost': 'Precio' },
                                                { 'currency': 'Moneda de pago' },
                                                { 'expiresAt': 'Fecha de caducidad' }
                                            ]}
                                            currentFieldData={product}
                                            optionalFields={['category', 'expiresAt', 'unit']}
                                            additionCallback={value => modifyProduct(product.id, value)}
                                            alertCallback={() => addAlert(<ErrorToast label={'No se ha podido crear el nuevo item'} />)}
                                        />
                                    )}
                                    endDate={product.expiresAt}
                                    onDelete={async () => {
                                        try {
                                            await deleteProduct(product.id)
                                        } catch {
                                            addAlert(<ErrorToast label={'No se pudo eliminar el producto. Puede estar asociado a ventas registradas.'} />)
                                        }
                                    }}
                                    isOnPreview={isSelecting}
                                    missingData={!product.name || product.cost == null || product.stock == null || !product.unit || !product.currency}
                                />
                            </StandardItemCardWrapper>
                        )}
                    </ItemsList>
                </div>
            </div>
        </section >
    )
}

export default InventoryView