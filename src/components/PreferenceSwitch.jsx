import SwitchItem from "./SwitchItem"

function PreferenceSwitch({ name, value, onChange }) {
    return (
        <div className="
        flex flex-row
        w-full
        items-center justify-between
        px-1! py-1! gap-12
        bg-(--bg-alt)
        border border-(--border)
        rounded-md
        ">
            <strong>
                {name}
            </strong>
            <SwitchItem value={value} onChange={value => onChange(value)} />
        </div>
    )
}
export default PreferenceSwitch