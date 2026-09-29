import { useEffect, useState } from "react"
import DeleteButton from "./DeleteButton"
import DefaultButton from "./DefaultButton"

function PhoneList({ single = false, onChange, defaultValue }) {
    const [listData, setData] = useState(defaultValue ?? [])
    const [fieldData, setFieldData] = useState(defaultValue ?? null)

    useEffect(() => {
        if (single) return
        onChange(listData)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [listData])

    useEffect(() => {
        if (!single) return
        onChange(fieldData)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fieldData])

    return (
        <section
            className="
            flex flex-col
            p-4! gap-3
            bg-(--bg-soft)
            border border-white/15
            rounded-md
            "
        >

            <div
                className="
                flex flex-row
                items-center justify-between
                gap-3
                "
            >
                {!single &&
                    <strong classname="flex flex-row items-center gap-6">
                        Telefonos moviles
                    </strong>
                }
                {single &&
                    <strong>
                        Telefono movil
                    </strong>
                }
                {!single &&
                    <DefaultButton
                        icon="plus"
                        label={'Añadir numero'}
                        iconLeft
                        onClick={() => setData(prev => [...prev, { 'value': null }])}
                    />
                }
            </div>

            <div
                className="
                flex flex-col
                gap-1
                "
            >
                {single &&
                    <input
                        className="
                        p-2! py-0.75!
                        bg-(--bg)
                        border border-white/20
                        rounded-sm
                        "
                        type="tel"
                        placeholder="Numero telefonico..."
                        required={single}
                        value={fieldData}
                        onChange={event => setFieldData(event.target.value)}
                    />
                }

                {!single &&
                    listData.map((item, index) =>
                        <div
                            key={index}
                            className="
                            flex flex-row
                            items-center justify-between
                            p-2! gap-3
                            bg-(--bg-alt)
                            border border-white/15
                            rounded-sm
                            "
                        >
                            <div className="flex flex-row gap-1 items-center">
                                <strong>#{index + 1} : </strong>
                                <input
                                    className="
                                    p-2! py-0.75!
                                    bg-(--bg)
                                    border border-white/20
                                    rounded-xs
                                    "
                                    type="tel"
                                    placeholder="Numero telefonico..."
                                    required={!single}
                                    value={item.value}
                                    onChange={event =>
                                        setData(prev =>
                                            prev.map((entry, i) =>
                                                i === index ?
                                                    { 'value': event.target.value } :
                                                    entry
                                            ))
                                    }
                                />
                            </div>
                            <DeleteButton
                                onDelete={() => listData.filter((_, i) => i !== index)}
                            />
                        </div>
                    )
                }
            </div>

        </section>
    )
}
export default PhoneList