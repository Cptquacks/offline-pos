import { faAdd, } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect, useState } from "react"
import DeleteButton from "./DeleteButton"

function ListInput({ label, placeHolder = '', type = 'text', required = true, onChange }) {
    const [data, setData] = useState([
        { value: '' }
    ])

    const handleAdd = () => {
        const result = data.find(entry => entry.value.trim().length === 0)
        if (result) return

        setData(prev => ([...prev, { value: '' }]))
    }

    /**
     * @param {Number} index
     * @param {String} value 
     */
    const handleChange = (target, value) => {
        setData(prev =>
            prev.map((item, index) =>
                index === target ? { ...item, value: value } : item
            )
        )
    }

    /**
     * @param {Number} target 
     */
    const handleDeletion = (target) => {
        setData(prev => prev.filter((item, index) => index !== target))
    }

    useEffect(() => {
        onChange(data)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data])

    return (
        <div
            className="
            flex flex-col
            p-4! gap-3
            bg-(--bg-soft)
            border border-(--border)
            rounded-md
            "
        >
            <div
                className="
                flex flex-row
                items-start justify-between
                "
            >
                <strong>
                    {label}
                </strong>

                <button
                    className="
                    transition cursor-pointer
                    flex flex-row
                    items-center
                    px-3! py-1! gap-1
                    text-white bg-(--accent-alt)
                    hover:text-(--bg-alt) hover:bg-white
                    rounded-xs
                    "
                    type="button"
                    onClick={handleAdd}
                >
                    <strong>
                        Añadir
                    </strong>
                    <FontAwesomeIcon icon={faAdd} />
                </button>
            </div>

            <div
                className="
                flex flex-col
                gap-1
                "
            >
                {data.map((item, index) =>
                    <div
                        key={index}
                        className="
                        flex flex-row
                        items-end
                        p-3! gap-3
                        bg-(--bg-alt)
                        border border-(--border)
                        rounded-md
                        "
                    >
                        <div
                            className="
                            flex-1
                            flex flex-col
                            items-start
                            "
                        >
                            <strong>
                                {placeHolder}
                            </strong>

                            <input
                                className="
                                transition
                                w-full
                                px-2! py-0.5!
                                bg-(--bg)
                                border border-white/20
                                rounded-sm
                                
                                focus:bg-(--accent-alt)/30
                                focus:border-(--accent)/50
                                focus:text-white
                                "
                                placeholder={placeHolder}
                                type={type}
                                value={item.value}
                                required={required}

                                onChange={event => handleChange(index, event.target.value)}
                            />
                        </div>

                        <DeleteButton onDelete={() => handleDeletion(index)} />
                    </div>
                )}
            </div>
        </div>
    )
}
export default ListInput