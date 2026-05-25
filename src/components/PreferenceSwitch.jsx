import SwitchItem from "./SwitchItem"

function PreferenceSwitch({ name, value, onChange }) {
    return (
        <div className="
        flex flex-row
        w-fit
        items-center
        px-2! py-1! gap-12
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