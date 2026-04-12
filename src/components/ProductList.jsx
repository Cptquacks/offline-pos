import ProductItem from "./ProductItem"

function ProductList({ data }) {
    return (
        <div className="
        p-4!
        ">
            {data.map((item, index) =>
                <ProductItem key={index} data={item} />
            )}
        </div>
    )
}
export default ProductList