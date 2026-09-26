import { useEffect, useMemo, useState } from "react"
import SearchBar from "../components/SearchBar"
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

function InventoryView() {
    const { productData, loadData, addProduct, modifyProduct, overwriteFile, deleteProduct } = useProductStore()
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

    const [isSelecting, setSelecting] = useState(false)
    const [selectedIndexes, setIndexes] = useState([])


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

            if (fragment.tag && !newTags.includes(fragment.tag))

                newTags.push(fragment.tag)
            fragment.current ? fragment.current : fragment.current = fragment.amount
            fragment.current = parseInt(fragment.current)
            fragment.amount = parseInt(fragment.amount)
            fragment.price = parseInt(fragment.price)
            fragment.expiresAt ? fragment.span = daysFromToday(fragment.expiresAt) : fragment

            setLoadValue(prev => ({ ...prev, current: prev.current + 1 }))
        })

        for (let index = 0; index < newTags.length; index++) {
            if (tagList.some(item => item.name === newTags[index])) continue
            await addTag({ name: newTags[index], color: randomLCH() })
        }

        let result = [...productData, ...importedData]
        overwriteFile(result)
        loadTags()

        setLoading(false)
    }

    const deleteItems = async () => {
        await overwriteFile(productData.filter((_, index) => !selectedIndexes.includes(index)))
        setIndexes([])
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
            <LoadingDialog
                current={loadValue.current}
                total={loadValue.total}
            />
        )
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoading, loadValue])

    useEffect(() => {
        if (isSelecting) return
        setIndexes([])
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
                    <div className="flex flex-row flex-wrap w-full gap-3 px-4! py-2!">

                        <ButtonBelt>
                            <DefaultButton
                                label={"Nuevo producto"}
                                icon={"pen-to-square"}
                                onClick={() => openDialog(
                                    <StandarNewItemDialog
                                        icon={'box'}
                                        label={'producto'}
                                        fileFields={[
                                            { 'name': 'text' },
                                            { 'tag': 'tag' },
                                            { 'code': 'text' },
                                            { 'amount': 'number' },
                                            { 'price': 'price' },
                                            { 'currency': 'currency' },
                                            { 'expiresAt': 'expiration' }
                                        ]}
                                        uiFields={[
                                            { 'name': 'Nombre' },
                                            { 'tag': 'Tipo' },
                                            { 'code': 'Numero de serie' },
                                            { 'amount': 'Stock' },
                                            { 'price': 'Precio' },
                                            { 'currency': 'Moneda de pago' },
                                            { 'expiresAt': 'Fecha de caducidad' }
                                        ]}
                                        optionalFields={['expiresAt']}
                                        additionCallback={value => addProduct(value)}
                                        alertCallback={() => addAlert(<ErrorToast label={'No se ha podido crear el nuevo item'} />)}
                                    />
                                )}
                                iconLeft
                            />
                        </ButtonBelt>

                        <ButtonBelt>
                            <DefaultButton
                                icon={'sync'}
                                label={'Rellenar inventario'}
                                iconLeft
                                onClick={() => {
                                    let newData = [...productData]
                                    newData = newData.map(entry => ({ ...entry, current: entry.amount }))
                                    overwriteFile(newData)
                                }}
                            />
                        </ButtonBelt>

                        <ButtonBelt>
                            <DefaultButton
                                label={isSelecting ? "Cancelar" : "Seleccionar"}
                                icon={isSelecting ? "times" : "clipboard-list"}
                                onClick={() => setSelecting(!isSelecting)}
                            />

                            {!isSelecting && <DefaultButton
                                label={isSelecting ? "Cancelar" : "Seleccionar todos"}
                                icon={isSelecting ? "times" : "clipboard-check"}
                                onClick={() => {
                                    setIndexes(productData.map((_, index) => index))
                                    setSelecting(true)
                                }}
                            />}

                            {selectedIndexes.length > 0 && <DeleteButton
                                label={`Eliminar todos (${selectedIndexes.length})`}
                                onDelete={async () => {
                                    setLoading(true)
                                    await deleteItems().then(() => setLoading(false))
                                }}
                            />}
                        </ButtonBelt>

                        <ImportPanel
                            model={{
                                "name": "Nombre",
                                "tag": "Categoría",
                                "code": "Codigo de barras",
                                "description": "Descripción",
                                "amount": "Cantidad",
                                "price": "Precio",
                                "currency": "Moneda",
                                "expiresAt": "Caducidad",
                                "current": "Disponibilidad"
                            }}
                            optionalFields={['description', 'expiresAt', 'current']}
                            onImport={data => handleImportation(data)}
                            previewComponent={({ data }) =>
                                <StandardItemCard
                                    icon="box"
                                    title={data.name}
                                    codeBar={data.code ?? 'N/A'}
                                    endDate={data.expiresAt}
                                    stockDisplay={
                                        <StockDisplay
                                            total={data.amount}
                                            amount={data.current}
                                        />
                                    }
                                    salaryDisplay={data.price && data.currency}
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
                        {filteredList.map((product, index) =>
                            <StandardItemCardWrapper
                                canSelect={isSelecting}
                                isSelected={selectedIndexes.includes(index)}
                                onSelect={() => {
                                    if (selectedIndexes.includes(index)) {
                                        setIndexes(prev => prev.filter(item => item !== index))
                                        return
                                    }
                                    setIndexes(prev => [...prev, index].toSorted((a, b) => a - b))
                                }}
                            >
                                <StandardItemCard
                                    key={index}
                                    icon="box"
                                    title={product.name}
                                    codeBar={product.code ?? 'N/A'}
                                    tagItem={
                                        <TagItem
                                            icon={'tag'}
                                            label={product.tag}
                                            color={tagList.find(tag => tag.name === product.tag)?.color ?? '#000'}
                                        />
                                    }
                                    stockDisplay={
                                        <StockDisplay
                                            total={product.amount}
                                            amount={product.current ?? product.amount}
                                        />
                                    }
                                    expirationDisplay={
                                        product.expiresAt ?
                                            <ExpirationDisplay
                                                days={daysFromToday(product.expiresAt)}
                                            /> : null
                                    }
                                    restockButton={
                                        product.current !== product.amount &&
                                        <DefaultButton
                                            icon={'sync'}
                                            label={'Restock'}
                                            onClick={() =>
                                                modifyProduct({ ...product, current: product.amount }, index)
                                            }

                                        />
                                    }
                                    onEdit={() => openDialog(
                                        <StandarNewItemDialog
                                            icon={'box'}
                                            label={'producto'}
                                            fileFields={[
                                                { 'name': 'text' },
                                                { 'tag': 'tag' },
                                                { 'code': 'text' },
                                                { 'amount': 'number' },
                                                { 'price': 'price' },
                                                { 'currency': 'currency' },
                                                { 'expiresAt': 'expiration' }
                                            ]}
                                            uiFields={[
                                                { 'name': 'Nombre' },
                                                { 'tag': 'Tipo' },
                                                { 'code': 'Numero de serie' },
                                                { 'amount': 'Stock' },
                                                { 'price': 'Precio' },
                                                { 'currency': 'Moneda de pago' },
                                                { 'expiresAt': 'Fecha de caducidad' }
                                            ]}
                                            currentFieldData={product}
                                            optionalFields={['expiresAt']}
                                            additionCallback={value => modifyProduct({ ...product, ...value }, index)}
                                            alertCallback={() => addAlert(<ErrorToast label={'No se ha podido crear el nuevo item'} />)}
                                        />
                                    )}
                                    endDate={product.expiresAt}
                                    onDelete={() => deleteProduct(index)}
                                    isOnPreview={isSelecting}
                                />
                            </StandardItemCardWrapper>
                        )}
                    </ItemsList>
                </div>
            </div>
        </section>
    )
}

export default InventoryView