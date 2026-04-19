import EmptyList from "./EmptyList"
import KioskProductItem from "./KioskProductItem"

function KioskProductList({ data, onSell, onRefund }) {
    return (
        <div className="
        flex flex-col
        p-4! gap-2
        ">
            {data.length === 0 &&
                <EmptyList />}
            {data.map((item, index) =>
                <KioskProductItem key={index} data={{ index: index, ...item }}
                    onSell={(index, amount) => onSell(index, amount)} onRefund={(index, amount) => onRefund(index, amount)} />
            )}
        </div>
    )
}
export default KioskProductList