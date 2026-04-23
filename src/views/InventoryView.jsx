import { useEffect } from "react"
import ProductForm from "../components/ProductForm"
import SearchBar from "../components/SearchBar"
import TagFilter from "../components/TagFilter"
import ImportPanel from "../components/ImportPanel"
import useProductStore from "../stores/productStore"
import ItemsList from "../components/ItemsList"
import ProductItem from "../components/ProductItem"

function InventoryView() {
    const { productData, loadData, deleteProduct, addProduct } = useProductStore()

    /**
     * 
     * @param {String} query 
     */
    const handleSearch = (query) => {
        query
    }

    useEffect(() => {
        loadData()
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
                <div className="grid w-fit">

                    <div className="
                    flex flex-row
                    px-4! py-2! gap-1
                    justify-between
                    ">
                        <SearchBar onSearch={query => handleSearch(query)} />
                        <TagFilter />
                    </div>

                    <div className="
                    flex flex-row
                    px-4! py-2! gap-1
                    ">
                        <ImportPanel />
                    </div>

                </div>

                <ItemsList>
                    {productData.map((product, index) =>
                        <ProductItem key={index} data={{ index: index, ...product }}
                            onDelete={index => deleteProduct(index)} />
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