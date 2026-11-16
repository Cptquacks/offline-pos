import { eq } from "drizzle-orm";
import { notes } from "../db/schema.js";
import { getDb } from "../services/dbService.js";

const ownerConfig = {
    staff: { column: notes.staffId, field: "staffId" },
    provider: { column: notes.providerId, field: "providerId" },
    product: { column: notes.productId, field: "productId" },
};

function getOwnerColumn(ownerType) {
    const config = ownerConfig[ownerType];
    if (!config) throw new Error(`Tipo de propietario de nota no válido: ${ownerType}`);
    return config;
}

export function listByOwner(ownerType, ownerId) {
    const { column } = getOwnerColumn(ownerType);
    return getDb().select().from(notes)
        .where(eq(column, ownerId))
        .orderBy(notes.createdAt)
        .all();
}

export function create(ownerType, ownerId, note) {
    const { field } = getOwnerColumn(ownerType);
    return getDb().insert(notes)
        .values({ title: note.title, value: note.value, [field]: ownerId })
        .returning()
        .get();
}

export function remove(id) {
    return getDb().delete(notes).where(eq(notes.id, id)).returning().get();
}
