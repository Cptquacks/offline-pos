import EmptyList from "./EmptyList"
import ProductItem from "./ProductItem"

function ProductList({ data, onDelete }) {
    return (
        <div className="
        flex flex-col
        p-4! gap-2
        ">
            {data.length === 0 &&
                <EmptyList />}
            {data.map((item, index) =>
                <ProductItem key={index} data={{ index: index, ...item }} onDelete={index => onDelete(index)} />
            )}
        </div>
    )
}
export default ProductList