import EmptyList from './EmptyList'

function ItemsList({ children }) {
    return (
        <div className="p-4!">

            <ul className="
            grid grid-cols-4
            gap-1
            ">
                {(!children || children.length == 0) &&
                    <EmptyList />}
                {children}
            </ul>
        </div>
    )
}

export default ItemsList