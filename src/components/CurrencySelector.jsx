import { useState } from "react"

function CurrencySelector({ onChange }) {
    const [currency, setCurrency] = useState('CUP')

    const handleChange = (event) => {
        setCurrency(event.target.value)
        onChange(event.target.value)
    }

    return (
        <div className="
        flex flex-col
        gap-2 px-4! py-3!
        bg-(--bg-soft)!
        border border-(--border)
        rounded-md
        ">
            <p className="
            font-bold!
            ">
                Tipo de pago
            </p>

            <div className="
            flex flex-row
            ">
                <fieldset className="
                flex flex-row
                gap-4
                ">

                    <div className="
                    flex flex-row gap-1
                    ">
                        <input id="CUP" name="currency" type="radio" value="CUP"
                            checked={currency === 'CUP'} onChange={handleChange} />
                        <label htmlFor="CUP">
                            CUP
                        </label>
                    </div>

                    <div className="
                    flex flex-row gap-1
                    ">
                        <input id="USD" name="currency" type="radio" value="USD"
                            checked={currency === 'USD'} onChange={handleChange} />
                        <label htmlFor="USD">
                            USD
                        </label>
                    </div>

                </fieldset>
            </div>

        </div>
    )
}
export default CurrencySelector