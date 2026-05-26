import { useEffect, useState } from "react"
import useCurrencyStore from "../stores/currencyStore"
import CurrencyItem from "./CurrencyItem"
import TagItem from "./TagItem"
import EmptyList from "./EmptyList"

function CurrencySelector({ onChange, current }) {
    const { currencyList, loadData } = useCurrencyStore()
    const [currency, setCurrency] = useState(current ?? 'CUP')

    const handleChange = (data) => {
        setCurrency(data)
        onChange(data)
    }

    useEffect(() => {
        loadData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div className="
        flex flex-col
        gap-3 px-4! py-3!
        bg-(--bg-soft)!
        border border-(--border)
        rounded-md
        ">
            <div className="flex flex-row items-center justify-between gap-3 ">
                <p className="font-bold!">
                    Tipo de pago
                </p>
                <TagItem label={currency} icon='dollar-sign' />
            </div>

            <div className="
            flex flex-row
            ">
                <fieldset className="
                grid grid-cols-3
                gap-1 w-full
                ">
                    {(!currencyList || currencyList.length === 0) &&
                        <EmptyList />
                    }
                    {currencyList.map((item, index) =>
                        <CurrencyItem
                            key={index}
                            group="currency"
                            currency={item}
                            checked={currency === item}
                            onChange={data => handleChange(data)}
                        />
                    )}

                </fieldset>
            </div>

        </div>
    )
}
export default CurrencySelector