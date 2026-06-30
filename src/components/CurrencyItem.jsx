import { useRef } from "react"
import TagItem from "./TagItem"

function CurrencyItem({ currency, group, checked = false, onChange }) {
    const radio = useRef(null)

    return (
        <div className={`
        relative
        transition cursor-pointer
        w-fit
        **:w-fit!
        flex flex-row
        items-center
        ${checked ? 'bg-white/30' : ''}
        rounded-full
        `} onClick={() => radio.current?.click()}>
            <input
                className="hidden absolute"
                ref={radio}
                name={group}
                type="radio"
                value={currency}
                checked={checked}
                onChange={event => onChange(event.target.value)}
            />
            <span>
                <TagItem
                    label={currency}
                    icon="dollar-sign"
                />
            </span>
        </div>
    )
}
export default CurrencyItem