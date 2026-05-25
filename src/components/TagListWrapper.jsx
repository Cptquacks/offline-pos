import { useState } from "react"
import { hexToLCH, lchToHex } from "../utils/tag-util"

function TagListWrapper({ children, color, onSelected, isSelected, onColorSelected }) {
    const [currentColor, setCurrentColor] = useState(lchToHex(color) ?? '#000')

    const handleColorChange = (color) => {
        setCurrentColor(color)
        const newLCH = hexToLCH(color)
        onColorSelected(newLCH)
    }

    if (!children) return false

    return (
        <div className={`
        transition cursor-pointer
        flex flex-row
        items-center
        p-2! px-4! gap-3
        bg-(--bg-alt) hover:bg-white/20
        border border-white/20
        rounded-md
        ${isSelected ? 'bg-(--accent-alt)/30!' : ''}
        `}>
            <div className="
            flex-1
            "
                onClick={() => onSelected()}>
                {children}
            </div>
            <input type="color" value={currentColor} onChange={event => handleColorChange(event.target.value)} />
        </div>
    )
}
export default TagListWrapper
