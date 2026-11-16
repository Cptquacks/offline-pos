import { create } from "zustand";
import { loadData, writeData } from "../utils/storage-util";

const defaultPreferences = [
    { key: 'sideBarExpanded', name: 'Barra lateral expandida', value: true },
    { key: 'coloredTags', name: 'Categorías coloreadas', value: false },
    { key: 'hasKiosk', name: 'Kiosko', value: true },
];

const usePreferenceStore = create((set, get) => ({
    preferenceData: defaultPreferences,

    loadData: async () => {
        const preferenceData = await loadData('preferences');
        set({
            preferenceData: Array.isArray(preferenceData) && preferenceData.length > 0
                ? preferenceData
                : defaultPreferences,
        });
    },

    setPreference: async (index, value) => {
        const preference = get().preferenceData[index];
        if (!preference) throw new Error(`No se encontró la preferencia en el índice ${index}.`);

        const nextData = get().preferenceData.map((item, itemIndex) =>
            itemIndex === index ? { ...item, value } : item
        );

        const saved = await writeData('preferences', nextData);
        const preferenceData = Array.isArray(saved) && saved.length > 0 ? saved : nextData;
        set({ preferenceData });
    },
}));

export default usePreferenceStore;
