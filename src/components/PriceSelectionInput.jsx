import { useEffect, useMemo, useState } from "react"
import PreferenceSwitch from "./PreferenceSwitch"
import FormInput from "./FormInput"

function PriceSelectionInput({ onChange }) {
    const [switchOn, setSwitch] = useState(false)
    const [cost, setCost] = useState(0)
    const [profit, setProfit] = useState(0)

    const finalPrice = useMemo(() => {
        return cost + (cost * (profit / 100))
    }, [cost, profit])

    useEffect(() => { onChange(cost) }, [])

    useEffect(() => {
        if (!switchOn) {
            onChange(cost)
            return
        }
        onChange(finalPrice)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cost, switchOn])

    return (
        <div
            className="
            flex flex-col 
            gap-3 p-2!
            bg-(--bg-soft)
            border border-white/10 rounded-lg
            "
        >
            <strong>Selector de precio <span className="text-red-400">*</span></strong>
            <PreferenceSwitch
                name={'Precio automatico'}
                value={switchOn}
                onChange={value => setSwitch(value)}
            />

            {!switchOn &&
                <FormInput
                    label={'Precio'}
                    min={0}
                    type="number"
                    onChange={value => setCost(value)}
                    required
                    defaultValue={0}
                    placeholder={'Precio final...'}
                />
            }

            {switchOn &&
                <FormInput
                    label={'Costo original'}
                    min={0}
                    type="number"
                    onChange={value => setCost(value)}
                    required
                    defaultValue={0}
                    placeholder={'Costo original...'}
                />
            }

            {switchOn &&
                <FormInput
                    label={'Margen de ganancia'}
                    min={0}
                    type="number"
                    onChange={value => setProfit(value)}
                    required
                    defaultValue={0}
                    placeholder={'Margen final...'}
                />
            }
        </div>
    )
}
export default PriceSelectionInput