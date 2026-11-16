import { eq, inArray } from "drizzle-orm";
import { tag } from "../db/schema.js";
import { getDb } from "../services/dbService.js";

export function listByType(type) {
    const db = getDb();
    return db.query.tag.findMany({
        where: (row, { eq: equals }) => equals(row.type, type),
        orderBy: { createdAt: "desc" },
    });
}

export function listAll() {
    const db = getDb();
    return db.query.tag.findMany({ orderBy: { createdAt: "desc" } });
}

export function list(type, limit = 10) {
    const db = getDb();
    return db.query.tag.findMany({
        where: (row, { eq: equals }) => equals(row.type, type),
        orderBy: { createdAt: "desc" },
        limit: limit > 0 ? limit : undefined,
    });
}

export function create(values) {
    const db = getDb();
    return db.insert(tag).values(values).returning().get();
}

export function update(id, patch) {
    const { id: _id, createdAt: _createdAt, ...safe } = patch;
    return getDb().update(tag).set(safe).where(eq(tag.id, id)).returning().get();
}

export function remove(id) {
    return getDb().delete(tag).where(eq(tag.id, id)).returning().get();
}

export function removeMany(ids) {
    if (!Array.isArray(ids) || ids.length === 0) return [];
    return getDb().delete(tag).where(inArray(tag.id, ids)).returning().all();
}

export function createMany(values) {
    if (!Array.isArray(values) || values.length === 0) return [];
    const db = getDb();
    return db.transaction((tx) => values.map((value) =>
        tx.insert(tag).values(value).returning().get()
    ));
}
