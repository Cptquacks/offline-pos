import { useEffect, useMemo, useState } from "react"
import useDialogStore from "../stores/dialogStore"
import useLicenseStore from "../stores/licenseStore"
import { checkLicense, checkValidity } from "../utils/license-util"
import DefaultButton from "./DefaultButton"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSpinner } from "@fortawesome/free-solid-svg-icons"

function LicenseDialog() {
    const { closeDialog } = useDialogStore()
    const { licenseList, loadLicenses, addLicense } = useLicenseStore()

    const [licenseCode, setLicenseCode] = useState('')
    const licenseCodes = useMemo(() => {
        return licenseList.map(data => data.code)
    }, [licenseList])

    const validLicenseLength = useMemo(() => {
        return licenseCode.split('-').join('').length !== 16
    }, [licenseCode])

    const [loading, setLoading] = useState(true)


    const handleRegistration = async () => {
        if (licenseCodes.includes(licenseCode)) return

        const data = await checkLicense(licenseCode)

        if (!data.valid) return

        addLicense(data)
        closeDialog()
    }

    useEffect(() => {
        loadLicenses()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (licenseList.length === 0) { setLoading(false); return }

        if (!checkValidity(licenseList.toReversed()[0])) { setLoading(false); return }
        closeDialog()
    }, [licenseList, closeDialog])

    if (loading)
        return (
            <div className="
            flex flex-row
            p-4!
            border border-(--border)
            justify-center items-center
            bg-(--bg)
            rounded-lg
            text-3xl
            ">
                <FontAwesomeIcon icon={faSpinner} spinPulse size="lg" />

            </div>
        )

    return (
        <div className="
        flex flex-col
        border border-(--border)
        min-w-[60dvw] max-w-[90dvw]
        min-h-[60dvh] max-h-[90dvh]
        justify-center items-center
        
        bg-(--bg)
        overflow-hidden
        rounded-md
        ">
            <div className="
            flex flex-col
            w-fit h-fit
            items-center
            p-4! gap-3
            bg-(--bg-soft)
            border border-(--border)
            rounded-md
            ">
                <strong className="text-2xl">
                    Codigo de licencia de uso
                </strong>
                <input
                    className="
                    bg-(--bg)
                    px-2! py-0.75
                    text-xl
                    rounded-sm
                    "
                    type="text"
                    placeholder="Codigo de licencia"
                    value={licenseCode}
                    onChange={event => setLicenseCode(event.target.value)} />
                <DefaultButton
                    label="Activar"
                    icon="none"
                    disabled={validLicenseLength}
                    onClick={handleRegistration} />
            </div>
        </div>
    )
}
export default LicenseDialog