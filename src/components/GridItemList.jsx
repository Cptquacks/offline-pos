import EmptyList from "./EmptyList"

function GridItemList({ children, columns = 3 }) {
    return (
        <div className={`
            grid
            w-full
            gap-3
            overflow-y-auto
        `} style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
            {(!children || children.length === 0) &&
                <div className="col-span-full">
                    <EmptyList />
                </div>
            }
            {children}
        </div>
    )
}
export default GridItemList