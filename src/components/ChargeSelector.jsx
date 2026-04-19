import { faUserCog } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect, useState } from "react"

function ChargeSelector({ onChange }) {
    const [charges, setCharges] = useState([])

    const [selectedCharge, setSelectedCharge] = useState(charges[0])

    const handleChange = (event) => {
        setSelectedCharge(event.target.value)
        onChange(event.target.value)
    }

    useEffect(() => {
        if (!window.electronAPI) return
        async function awaitAPI() {
            await window.electronAPI.readJSON('charges.json')
                .then(res => setCharges(res))
                .catch(err => console.log(err))
        }

        awaitAPI()
    }, [])

    useEffect(() => {
        onChange(charges[0])
        setSelectedCharge(charges[0])
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [charges])

    return (
        <div className="
        flex flex-col
        p-4! gap-1
        bg-(--bg-soft)
        border border-(--border)
        rounded-md
        ">
            <div className="
            grid grid-cols-2
            items-start justify-between
            ">
                <p className="font-bold!">
                    Cargo del empleado
                </p>

                <p className="
                flex flex-row 
                items-center justify-self-end
                px-2! py-0.5! gap-1
                bg-(--accent-alt)/50 text-white! font-bold!
                border-2 border-(--border)
                rounded-full
                ">
                    <FontAwesomeIcon icon={faUserCog} />
                    {selectedCharge}
                </p>
            </div>

            <select value={selectedCharge} onChange={handleChange} className="
            px-2! py-0.5!
            bg-(--bg)
            border border-white/20
            rounded-sm
            ">
                <option value="N/A">Ninguno</option>

                {charges.map((charge, index) =>
                    <option key={index} value={charge}>
                        {charge}
                    </option>
                )}
            </select>
        </div>
    )
}
export default ChargeSelector