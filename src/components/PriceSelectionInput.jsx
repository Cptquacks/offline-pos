import { useEffect, useMemo, useState } from "react"
import PreferenceSwitch from "./PreferenceSwitch"
import FormInput from "./FormInput"
import ButtonBelt from "./ButtonBelt"

function PriceSelectionInput({ defaultValue, onChange }) {
    const [switchOn, setSwitch] = useState(false)
    const [cost, setCost] = useState(defaultValue ?? 0)
    const [profit, setProfit] = useState(25)

    const finalPrice = useMemo(() => {
        return parseFloat(cost) + (cost * (profit / 10))
    }, [cost, profit])

    // eslint-disable-next-line react-hooks/exhaustive-deps
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
                    onChange={value => setCost(parseFloat(value))}
                    required
                    defaultValue={defaultValue ?? 0}
                    placeholder={'Precio final...'}
                />
            }

            {switchOn &&
                <FormInput
                    label={'Costo original'}
                    min={0}
                    type="number"
                    onChange={value => setCost(parseFloat(value))}
                    required
                    defaultValue={defaultValue ?? 0}
                    placeholder={'Costo original...'}
                />
            }

            {switchOn &&
                <FormInput
                    label={'Porcentaje de ganancia'}
                    min={0}
                    type="number"
                    onChange={value => setProfit(parseFloat(value))}
                    required
                    defaultValue={25}
                    placeholder={'Margen final...'}
                />
            }

            {switchOn &&
                <ButtonBelt>
                    <strong>Precio final: {finalPrice}</strong>
                </ButtonBelt>
            }
        </div>
    )
}
export default PriceSelectionInput