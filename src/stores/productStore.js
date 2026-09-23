import { create } from "zustand";
import { loadData, updateData, writeData } from "../utils/storage-util";


/**
 * @typedef {Object} productStore
 * @property {Array} productData
 * @property {() => Promise<void>} loadData
 * @property {(product: Object) => Promise<void>} addProduct
 * @property {(product: Object, index: number) => Promise<void>} modifyProduct
 * @property {(target: number) => Promise<void>} deleteProduct
 * @property {(chunk: Array) => Promise<void>} overwriteFile You could nuke the products, beware
 */

/** @type {import('zustand').UseBoundStore<import('zustand').StoreApi<productStore>>} */
const useProductStore = create((set, get) => ({
    productData: [],

    loadData: async () => {
        const data = await loadData('products')
        set({ productData: data })
    },

    addProduct: async (product) => {
        const data = await updateData('products', product)
        set({ productData: data })
    },

    modifyProduct: async (product, index) => {
        const { productData } = get()
        const updatedData = [...productData]

        updatedData[index] = product
        const data = await writeData('products', updatedData)

        set({ productData: data })
    },

    deleteProduct: async (target) => {
        const { productData } = get()
        let updatedData = [...productData]

        updatedData = updatedData.filter((_, index) => index !== target)
        const data = await writeData('products', updatedData)

        set({ productData: data })
    },

    overwriteFile: async (chunk) => {
        const data = await writeData('products', chunk)
        set({ productData: data })
    }
}))
export default useProductStore