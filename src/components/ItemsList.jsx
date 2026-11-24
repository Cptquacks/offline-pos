import { useMemo } from 'react'
import EmptyList from './EmptyList'
import StandardNewItemCard from './StandardNewItemCard'

function ItemsList({
    newItemLabel, onAdd, children,
    cols = 4,
    listStyling = 'grid', removeAdd = false
}) {

    const computedStyle = useMemo(() => {
        switch (listStyling) {
            case 'vertical':
                return 'flex flex-row overflow-x-auto gap-0.5'
            case 'horizontal':
                return 'flex flex-col overflow-y-auto gap-0.5'
            case 'grid':
            default:
                return `grid grid-cols-${cols} gap-1.25`
        }
    }, [listStyling, cols])

    if (listStyling === 'vertical' && (children && children.length === 0)) return
    return (
        <div className="p-4!">

            <ul className={`
            ${computedStyle}
            `}>
                {!removeAdd && <StandardNewItemCard label={newItemLabel} onAdd={onAdd} />}
                {((!children || children.length === 0) && listStyling === 'vertical') &&
                    <EmptyList />}
                {children}
            </ul>
        </div>
    )
}

export default ItemsList