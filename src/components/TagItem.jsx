import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import usePreferenceStore from "../stores/preferenceStore";
import { useMemo } from "react";

function TagItem({ label, color, icon, sm = false, lg = false }) {
    const { preferenceData } = usePreferenceStore()
    const coloredTags = useMemo(() => {
        if (preferenceData.length == 0) return false
        return preferenceData.find(preference => preference.key === 'coloredTags').value
    }, [preferenceData])

    const componentStyling = useMemo(() => {
        let stylingString = `
        transition
        flex flex-row
        items-center
        h-fit w-fit
        border-2 border-white/15
        rounded-full
        bg-(--accent-alt)/30
        text-white!
        `
        if (!sm) {
            stylingString += `
            px-4! py-1! gap-1
            `
        }
        else if (sm) {
            stylingString += `
            px-2! py-0.5! gap-1
            text-sm
            `
        }
        return stylingString
    }, [sm])

    const customStyle = color && coloredTags
        ? { backgroundColor: `lch(${color} / 0.3)`, }
        : {}
    return (
        <div className={componentStyling}
            style={
                customStyle
            }>
            {!sm && <FontAwesomeIcon icon={`${icon ?? 'times'}`} />}
            <strong>
                {label || 'N/A'}
            </strong>
        </div>
    )
}

export default TagItem