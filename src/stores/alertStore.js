import { create } from "zustand";

/**
 * @typedef alertStore
 * @property {Array} alertTrail
 * @property {(data: import("react").ReactElement) => void} addAlert
 * @property {() => void} removeAlert
 */

/** @type {import("zustand").UseBoundStore<import("zustand").StoreApi<alertStore>>} */
const useAlertStore = create((set, get) => ({
    alertTrail: [],

    addAlert: (data) => {
        const { alertTrail } = get()
        const updatedTrail = alertTrail
        updatedTrail.push(data)
        set({ alertTrail: updatedTrail })
    },
    removeAlert: () => {

        const { alertTrail } = get()
        let updatedTrail = alertTrail.toReversed()

        updatedTrail.pop()
        updatedTrail = updatedTrail.toReversed()

        set({ alertTrail: updatedTrail })
    }
}))

export default useAlertStore