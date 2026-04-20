import { faDizzy, faPlus, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

function ItemListSM({ label, children, selectedList, onSubmit, onDelete }) {

    const [newItem, setItem] = useState('')

    return (
        <div className="
        flex flex-col
        w-fit
        p-4! gap-3
        bg-(--bg-soft)
        border border-(--border)
        rounded-md
        ">
            <div>
                <p className="font-bold!">
                    {label}
                </p>
            </div>

            <form className="
            flex flex-row
            p-2! gap-2
            bg-(--bg)
            border border-white/20
            rounded-sm
            text-sm!
            ">
                <input className="
                border-b-2 border-b-(--accent-alt)
                " type="text" placeholder={`${label} adicionales...`}
                    value={newItem} onChange={event => setItem(event.target.value)} required />

                <button className="
                transition-normal cursor-pointer
                font-bold! 
                px-3! py-1! gap-1
                text-white hover:text-(--bg-alt)!
                bg-(--accent-alt) hover:bg-white
                rounded-xs
                " onClick={() => onSubmit(newItem)}>
                    Añadir
                    <FontAwesomeIcon icon={faPlus} />
                </button>
            </form>

            {selectedList.length !== 0 &&
                <div className="
                flex flex-row
                items-center justify-between
                ">
                    <p>
                        Elementos seleccionados: {selectedList.length}
                    </p>

                    <button className="
                    transition-normal cursor-pointer
                    bg-red-500/50
                    text-white!
                    px-1! py-1!
                    border-2 border-(--border)
                    rounded-lg
                    hover:shadow-(--shadow)
                    " onClick={() => onDelete(selectedList)}>
                        <FontAwesomeIcon icon={faTrashAlt} size="lg" />
                    </button>
                </div>
            }

            <ol className="
            flex-1
            flex flex-col 
            items-start overflow-y-scroll
            gap-1
            ">
                {(children.length === 0) &&
                    <div className="
                    flex flex-row
                    w-fit items-center self-center
                    bg-(--bg) opacity-75
                    p-4! py-2! gap-1
                    border-2 border-dashed border-white/30
                    ">
                        Esta lista esta vacía
                        <FontAwesomeIcon icon={faDizzy} />
                    </div>
                }
                {children}
            </ol>
        </div>
    )
}

export default ItemListSM