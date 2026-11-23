import { useMemo } from 'react'
import EmptyList from './EmptyList'
import StandardNewItemCard from './StandardNewItemCard'

function ItemsList({ newItemLabel, onAdd, children, cols = 4, vertical = false, removeAdd = false }) {

    const computedStyle = useMemo(() => {
        let finalStyle = ''

        if (vertical) {
            finalStyle += 'flex flex-row overflow-x-auto gap-0.5'
        }
        else if (!vertical) {
            finalStyle += `grid grid-cols-${cols} gap-1.25`
        }
        return finalStyle
    }, [vertical, cols])

    if (vertical && (children && children.length === 0)) return
    return (
        <div className="p-4!">

            <ul className={`
            ${computedStyle}
            `}>
                {!removeAdd && <StandardNewItemCard label={newItemLabel} onAdd={onAdd} />}
                {((!children || children.length === 0) && vertical) &&
                    <EmptyList />}
                {children}
            </ul>
        </div>
    )
}

export default ItemsList