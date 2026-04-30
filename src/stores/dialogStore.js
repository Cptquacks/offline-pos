// stores/dialogStore.js
import { create } from 'zustand';

/**
 * @typedef dialogStore
 * @property {Boolean} isOpen
 * @property {import('react').ReactElement} dialogContent
 * @property {(content : import('react').ReactElement) => void} openDialog 
 * @property {() => void} openDialog 
 */

/** @type {import('zustand').UseBoundStore<import('zustand').StoreApi<dialogStore>>} */
const useDialogStore = create((set) => ({
    isOpen: false,
    dialogContent: null,   // componente React (ej. <WarnDialog />)

    openDialog: (content) => set({ isOpen: true, dialogContent: content }),
    closeDialog: () => set({ isOpen: false, dialogContent: null }),
}));

export default useDialogStore;