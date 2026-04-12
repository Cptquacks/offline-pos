import { useEffect, useState } from "react"
import ProductForm from "../components/ProductForm"
import ProductList from "../components/ProductList"

function InventoryView() {
    const [productData, setProductData] = useState([])

    const handleSubmition = (data) => {
        alert(data.price)
    }

    useEffect(() => {
        if (!window.electronAPI) return
        async function awaitAPI() {
            await window.electronAPI.readJSON('products.json')
                .then(res => setProductData(res))
                .catcht(err => console.error(err))
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
                <ProductList data={productData} />
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