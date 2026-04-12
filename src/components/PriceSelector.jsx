import { useState } from "react"

function PriceSelector({ onChange }) {
    const [currentSelection, setSelection] = useState('manual')
    const handleChange = (event) => {
        onChange(event.target.value)
        setSelection(event.target.value)
    }

    return (
        <div className="
        flex flex-col
        p-4! gap-2
        bg-(--bg-soft)
        border border-(--border)
        rounded-md
        ">
            <p className="font-bold!">
                Calculo de precio
            </p>

            <fieldset className="
            flex flex-row
            gap-4
            ">
                <div className="
                flex flex-row
                items-center gap-1
                ">
                    <input id="manual" name="selector" type="radio" value='manual'
                        checked={currentSelection === 'manual'} onChange={handleChange} />
                    <label htmlFor="manual">
                        Manual
                    </label>
                </div>

                <div className="
                flex flex-row
                items-center gap-1
                ">
                    <input id="automatic" name="selector" type="radio" value='automatic'
                        checked={currentSelection === 'automatic'} onChange={handleChange} />
                    <label htmlFor="automatic">
                        Automatico
                    </label>
                </div>
            </fieldset>
        </div>
    )
}
export default PriceSelector