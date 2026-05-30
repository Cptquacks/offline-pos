import { useEffect, useRef, useState } from "react"
import DropdownMenuButton from "./DropdownMenuButton"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCaretDown } from "@fortawesome/free-solid-svg-icons"

function DropdownMenu({ elements, onSelected }) {
    const [isOpen, setOpen] = useState(false)
    const [selection, setSelection] = useState(elements[0])
    const containerRef = useRef(null);

    useEffect(() => {
        if (!isOpen) return;

        const handleClickOutside = (event) => {
            // Si el clic fue fuera del contenedor, cerramos
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);


    return (
        <div className="
        relative
        flex flex-col 
        w-fit
        ">
            {selection &&
                <button className="
                    cursor-pointer
                    flex-2
                    flex flex-row
                    w-full
                    items-center justify-between
                    px-4! py-2! gap-3 
                    bg-(--bg-alt)
                    border border-(--border)
                    rounded-full
                    "
                    onClick={() => setOpen(!isOpen)}
                >
                    <div className="
                    flex flex-row
                    items-center
                    gap-1
                    ">
                        {selection.icon !== undefined && <FontAwesomeIcon icon={selection.icon} />}
                        <strong className="whitespace-nowrap">
                            {selection.label}
                        </strong>
                    </div>
                    <FontAwesomeIcon icon={faCaretDown} />
                </button>
            }
            <div
                ref={containerRef}
                data-open={isOpen ? '' : undefined}

                className="
                transition 
                absolute
                top-full left-0 right-0 origin-top
                flex flex-col
                w-full scale-y-0
                p-1! mt-1! gap-1
                opacity-0
                bg-(--bg-alt)
                border border-(--border)
                rounded-md
                overflow-hidden

                data-open:scale-y-100
                data-open:opacity-100
                "
            >
                {elements.map((element, index) =>
                    <DropdownMenuButton
                        key={index}
                        data={element}
                        onSelected={data => {
                            setOpen(false)
                            setSelection(data)
                            onSelected(data.value ?? data.label)
                        }}
                    />
                )}
            </div>
        </div >
    )
}
export default DropdownMenu