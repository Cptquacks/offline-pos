import { faCaretDown, faEllipsisH, faPhone } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useState } from "react"
import DefaultButton from "./DefaultButton"
import DeleteButton from "./DeleteButton"

function ContactDisplay({ data, inEditMode = false, onEdit }) {

    const [isOpen, setOpen] = useState(false)
    const [newFragment, setFragment] = useState('')

    if (!data || data.length === 0) return null

    return (
        <div className="
        flex flex-col
        w-fit
        p-2! gap-3
        bg-(--bg-alt)
        rounded-md
        border border-white/20
        ">

            {inEditMode &&
                <form className="
                flex flex-row
                items-center
                p-2! gap-3
                bg-(--bg)
                border border-white/20
                rounded-sm
                " onSubmit={() => onEdit([...data, { value: newFragment }])}>
                    <input
                        className="border-b border-b-(--accent-alt)"
                        type="tel"
                        value={newFragment}
                        placeholder="Número telefónico"
                        onChange={event => setFragment(event.target.value)}
                        required />
                    <DefaultButton label="Añadir" icon="plus" type="submit" />
                </form>
            }
            {data.length === 1 &&
                <strong className="
                relative

                before:absolute
                before:content-['']
                before:w-2
                before:h-2
                before:bg-(--accent)
                before:top-1/3
                before:-left-3
                before:rounded-full

                flex flex-row 
                items-center 
                gap-1">
                    {data[0].value}
                </strong>
            }

            {data.length > 1 &&
                <div className="flex flex-col gap-3">
                    <div className="flex flex-row items-center gap-3">
                        <strong className="
                        flex flex-row 
                        items-center 
                        gap-1
                        text-lg
                        ">
                            <FontAwesomeIcon icon={faPhone} />
                            Telefonos de contacto
                        </strong>

                        <button className="
                        transition cursor-pointer
                        flex flex-row 
                        items-center
                        p-0.5! py-1!
                        bg-(--accent-alt) text-white
                        rounded-full

                        hover:bg-white hover:text-(--bg-alt)
                        " onClick={() => setOpen(!isOpen)}>
                            <FontAwesomeIcon icon={isOpen ? faEllipsisH : faCaretDown} />
                        </button>
                    </div>

                    {isOpen && <div className="flex flex-col gap-1">
                        {data.map((tel, index) =>
                            <div
                                key={index}
                                className="
                                relative

                                before:absolute
                                before:content-['']
                                before:w-2
                                before:h-2
                                before:bg-(--accent)
                                before:top-1/3
                                before:-left-1
                                before:rounded-full

                                flex flex-row 
                                items-center justify-between
                                px-3! pr-1! py-1!
                                bg-(--bg-soft)
                                border border-(--border)
                                rounded-sm
                                ">
                                <strong className="">
                                    {tel.value}
                                </strong>
                                {onEdit && <DeleteButton onDelete={() => {
                                    const result = data.filter((_, i) => i !== index)
                                    onEdit(result)
                                }} />}
                            </div>
                        )}
                    </div>}
                </div>
            }
        </div>
    )
}

export default ContactDisplay