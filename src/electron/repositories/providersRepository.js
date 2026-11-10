import { eq } from "drizzle-orm";
import { providers } from "../db/schema.js";
import { getDb } from "../services/dbService.js";

const providerRelations = {
    contacts: true,
};

export function listAll(withRelations = false) {
    const db = getDb();
    return db.query.providers.findMany({
        with: withRelations ? providerRelations : undefined,
    });
}

export function list(withRelations = false, limit = 10) {
    const db = getDb();
    return db.query.providers.findMany({
        with: withRelations ? providerRelations : undefined,
        limit: limit > 0 ? limit : undefined,
    });
}

export function listActive(withRelations = false) {
    const db = getDb();
    return db.query.providers.findMany({
        where: (provider, { eq }) => eq(provider.active, 1),
        with: withRelations ? providerRelations : undefined,
    });
}

export function findById(id, withRelations = false) {
    const db = getDb();
    return db.query.providers.findFirst({
        where: (provider, { eq }) => eq(provider.id, id),
        with: withRelations ? providerRelations : undefined,
    });
}

export function findByName(name, withRelations = false) {
    const db = getDb();
    return db.query.providers.findMany({
        where: (provider, { like }) => like(provider.name, `%${name}%`),
        with: withRelations ? providerRelations : undefined,
    });
}

export function findByStartedAt(startedAt, withRelations = false) {
    const db = getDb();
    return db.query.providers.findMany({
        where: (provider, { eq, isNull }) => startedAt == null
            ? isNull(provider.startedAt)
            : eq(provider.startedAt, startedAt),
        with: withRelations ? providerRelations : undefined,
    });
}

export function findByEndsAt(endsAt, withRelations = false) {
    const db = getDb();
    return db.query.providers.findMany({
        where: (provider, { eq, isNull }) => endsAt == null
            ? isNull(provider.endsAt)
            : eq(provider.endsAt, endsAt),
        with: withRelations ? providerRelations : undefined,
    });
}

export function create(provider) {
    const db = getDb();
    return db.insert(providers).values(provider).returning().get();
}

export function update(id, patch) {
    const { id: _id, createdAt: _createdAt, ...safe } = patch;
    const db = getDb();
    return db.update(providers)
        .set(safe)
        .where(eq(providers.id, id))
        .returning()
        .get();
}

export function remove(id) {
    const db = getDb();
    return db.delete(providers).where(eq(providers.id, id)).returning().get();
}
