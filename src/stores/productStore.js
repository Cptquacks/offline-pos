import { create } from "zustand";
import {
    listAll,
    create as productCreate,
    createMany as productsCreateMany,
    update as productUpdate,
    remove as productRemove,
    removeMany as productsRemoveMany,
    adjustStock as productAdjustStock,
} from "../facades/products-facade";

function normalizeProduct(product) {
    const normalized = { ...product };

    if ("cost" in normalized) normalized.cost = Number(normalized.cost);
    if ("stock" in normalized) normalized.stock = Number.parseInt(normalized.stock, 10);
    if (normalized.category === "N/A" || normalized.category === "") normalized.category = null;
    if (normalized.expiresAt === "") normalized.expiresAt = null;

    delete normalized.id;
    delete normalized.createdAt;

    return normalized;
}


/**
 * @typedef {Object} productStore Store for products
 * @property {Array} productData
 * @property {() => Promise<void>} loadData
 * @property {(product: Object) => Promise<void>} addProduct
 * @property {(products: Array) => Promise<void>} addProducts
 * @property {(id: number, patch: Object) => Promise<void>} modifyProduct
 * @property {(id: number) => Promise<void>} deleteProduct
 * @property {(ids: Array<number>) => Promise<void>} deleteProducts
 * @property {(id: number, delta: number) => Promise<void>} adjustStock
 */

/** @type {import('zustand').UseBoundStore<import('zustand').StoreApi<productStore>>} */
const useProductStore = create((set) => ({
    productData: [],

    loadData: async () => {
        const data = await listAll()
        set({ productData: data })
    },

    addProduct: async (product) => {
        const created = await productCreate(normalizeProduct(product));
        if (!created) throw new Error("No se pudo crear el producto.");
        set(({ productData }) => ({ productData: [created, ...productData] }));
    },

    addProducts: async (products) => {
        if (products.length === 0) return;
        const created = await productsCreateMany(products.map(normalizeProduct));
        set(({ productData }) => ({ productData: [...created, ...productData] }));
    },

    modifyProduct: async (id, patch) => {
        const updated = await productUpdate(id, normalizeProduct(patch));
        if (!updated) throw new Error(`No se encontró el producto ${id}.`);
        set(({ productData }) => ({
            productData: productData.map((product) => product.id === id ? updated : product),
        }));
    },

    deleteProduct: async (id) => {
        const removed = await productRemove(id);
        if (!removed) throw new Error(`No se encontró el producto ${id}.`);
        set(({ productData }) => ({
            productData: productData.filter((product) => product.id !== id),
        }));
    },

    deleteProducts: async (ids) => {
        if (ids.length === 0) return;
        const removed = await productsRemoveMany(ids);
        const removedIds = new Set(removed.map((product) => product.id));
        set(({ productData }) => ({
            productData: productData.filter((product) => !removedIds.has(product.id)),
        }));
    },

    adjustStock: async (id, delta) => {
        const updated = await productAdjustStock(id, delta);
        if (!updated) throw new Error(`No se encontró el producto ${id}.`);
        set(({ productData }) => ({
            productData: productData.map((product) => product.id === id ? updated : product),
        }));
    },
}))
export default useProductStore