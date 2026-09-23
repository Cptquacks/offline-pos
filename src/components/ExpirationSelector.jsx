import { useEffect, useState } from "react";
import FormInput from "./FormInput";
import PreferenceSwitch from "./PreferenceSwitch";

function ExpirationSelector({ defaultValue, onChange }) {
    const [expires, setExpires] = useState(defaultValue ? true : false)

    useEffect(() => {
        if (expires) return
        onChange(null)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [expires])

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => { onChange(null) }, [])
    return (
        <div
            className="
            flex flex-col 
            gap-3 p-2!
            bg-(--bg-soft)
            border border-white/10 rounded-lg
            "
        >
            <strong>Selector de caducidad <span className="text-red-400">*</span></strong>
            <PreferenceSwitch
                name={'Incluir fecha de caducidad'}
                onChange={value => setExpires(value)}
                value={expires}
            />
            {expires && <FormInput
                label={'Fecha de caducidad'}
                placeholder={'Fecha de caducidad'}
                type="date"
                defaultValue={defaultValue ?? new Date().toLocaleDateString('sv-SE')}
                onChange={onChange}
            />}
        </div>
    )
}
export default ExpirationSelector