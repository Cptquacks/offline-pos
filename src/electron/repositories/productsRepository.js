import { and, eq, gte, sql } from "drizzle-orm";
import { products } from "../db/schema.js";
import { getDb } from "../services/dbService.js";

const productRelations = {
    ticketItems: {
        with: {
            ticket: true,
        },
    },
};

export function listAll(withRelations = false) {
    const db = getDb();
    return db.query.products.findMany({
        with: withRelations ? productRelations : undefined,
        orderBy: { createdAt: "desc" },
    });
}

export function list(withRelations = false, limit = 10) {
    const db = getDb()
    return db.query.products.findMany({
        with: withRelations ? productRelations : undefined,
        orderBy: { createdAt: "desc" },
        limit: limit > 0 ? limit : undefined
    })
}


export function findById(id, withRelations = false) {
    const db = getDb();
    return db.query.products.findFirst({
        where: (product, { eq }) => eq(product.id, id),
        with: withRelations ? productRelations : undefined,
    });
}

export function findByName(name, withRelations = false) {
    const db = getDb();
    return db.query.products.findFirst({
        where: (product, { like }) => like(product.name, `%${name}%`),
        with: withRelations ? productRelations : undefined,
    });
}

export function findByCategory(category, withRelations = false) {
    const db = getDb();
    return db.query.products.findMany({
        where: (product, { eq, isNull }) => category == null
            ? isNull(product.category)
            : eq(product.category, category),
        with: withRelations ? productRelations : undefined,
    });
}

export function lowStock(threshold = 10, withRelations = false) {
    const db = getDb();
    return db.query.products.findMany({
        where: (product, { lt }) => lt(product.stock, threshold),
        with: withRelations ? productRelations : undefined,
    });
}

export function create(product) {
    const db = getDb();
    return db.insert(products).values(product).returning().get();
}

export function createMany(productList) {
    if (!Array.isArray(productList) || productList.length === 0) return [];

    const db = getDb();
    return db.transaction((tx) => productList.map((product) =>
        tx.insert(products).values(product).returning().get()
    ));
}

export function update(id, patch) {
    const { id: _id, createdAt: _ca, ...safe } = patch;
    return getDb().update(products).set(safe)
        .where(eq(products.id, id)).returning().get();
}

export function remove(id) {
    const db = getDb();
    return db.delete(products).where(eq(products.id, id)).returning().get();
}

export function removeMany(ids) {
    if (!Array.isArray(ids) || ids.length === 0) return [];

    const db = getDb();
    return db.transaction((tx) => ids.map((id) =>
        tx.delete(products).where(eq(products.id, id)).returning().get()
    ));
}

export function adjustStock(id, delta) {
    const stockGuard = delta < 0 ? gte(products.stock, -delta) : undefined;
    return getDb()
        .update(products)
        .set({ stock: sql`${products.stock} + ${delta}` })
        .where(stockGuard
            ? and(eq(products.id, id), stockGuard)
            : eq(products.id, id))
        .returning()
        .get();
}