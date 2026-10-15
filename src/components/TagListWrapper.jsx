import { useRef, useState } from "react"
import { hexToLCH, lchToHex } from "../utils/tag-util"

function TagListWrapper({ children, color, onSelected, isSelected, onColorSelected }) {
    const [currentColor, setCurrentColor] = useState(lchToHex(color) ?? '#000')
    const colorPicker = useRef(null)
    const [canChange, setChangeable] = useState(true)

    const handleColorChange = async (color) => {
        if (!canChange) return
        setChangeable(false)
        setTimeout(() => {
            setCurrentColor(color)
            const newLCH = hexToLCH(color)
            onColorSelected(newLCH)
            setChangeable(true)
        }, 250);
    }

    if (!children) return false

    return (
        <div
            className={`
            transition cursor-pointer
            flex flex-row
            items-center
            p-2! px-4! gap-3
            bg-(--bg-alt) 
            hover:bg-white/20
            border border-white/20
            rounded-md
            ${isSelected ? 'bg-(--accent-alt)/30!' : ''}
        `}
        >
            <div className="
            flex-1
            "
                onClick={() => onSelected()}>
                {children}
            </div>

            {color &&
                <div
                    className="
                    relative
                    w-6 h-6
                    "
                >
                    <div
                        className="
                        inset-0
                        h-full w-full
                        rounded-full
                        border-2 border-white/30
                        "
                        style={{ background: currentColor }}
                        onClick={() => colorPicker.current?.click()}
                    />

                    <input
                        ref={colorPicker}
                        className="
                        absolute inset-0
                        w-0 h-0 opacity-0          
                        "
                        style={{ background: currentColor }}
                        type="color"
                        value={currentColor}
                        onChange={event => handleColorChange(event.target.value)}
                    />
                </div>
            }
        </div>
    )
}
export default TagListWrapper
