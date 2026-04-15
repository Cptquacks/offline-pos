import { useEffect, useState } from "react"
import ProductForm from "../components/ProductForm"
import ProductList from "../components/ProductList"
import SearchBar from "../components/SearchBar"
import TagFilter from "../components/TagFilter"
import ImportPanel from "../components/ImportPanel"

function InventoryView() {
    const [productData, setProductData] = useState([])

    /**
     * 
     * @param {Object} data 
     * @returns {void}
     */
    const handleSubmition = async (data) => {
        if (!window.electronAPI) return
        await window.electronAPI.modifyJSON('products.json', data)
            .then(res => console.log(res))
            .catch(err => console.error(err))

        await window.electronAPI.readJSON('products.json')
            .then(res => setProductData(res))
            .catch(err => console.error(err))
    }

    /**
     * 
     * @param {Number} target 
     * @returns {void}
     */
    const handleDeletion = async (target) => {
        const data = productData.filter((_, index) => index !== target)

        if (!window.electronAPI) return
        await window.electronAPI.writeJSON('products.json', data)
            .then(res => console.log(res))
            .catch(err => console.error(err))

        await window.electronAPI.readJSON('products.json')
            .then(res => setProductData(res))
            .catch(err => console.error(err))
    }

    /**
     * 
     * @param {String} query 
     */
    const handleSearch = (query) => {
        query
    }

    useEffect(() => {
        if (!window.electronAPI) return
        async function awaitAPI() {
            await window.electronAPI.readJSON('products.json')
                .then(res => setProductData(res))
                .catch(err => console.error(err))
        }
        awaitAPI()
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

                <ProductList data={productData} onDelete={index => handleDeletion(index)} />
            </div>

            <div className="
            flex flex-col 
            bg-(--bg-soft)!
            rounded-md
            p-4! overflow-y-scroll
            ">
                <ProductForm onSubmit={data => handleSubmition(data)} />
            </div>

        </section>
    )
}

export default InventoryView