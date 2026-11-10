import { tag } from "../db/schema.js";
import { getDb } from "../services/dbService.js";

export function listAll() {
    const db = getDb();
    return db.query.tag.findMany({
        orderBy: { createdAt: "desc" },
    });
}

export function list(limit = 10) {
    const db = getDb();
    return db.query.tag.findMany({
        orderBy: { createdAt: "desc" },
        limit: limit > 0 ? limit : undefined,
    });
}

export function create(values) {
    const db = getDb();
    return db.insert(tag).values(values).returning().get();
}
