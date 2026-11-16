import { sql, defineRelations } from "drizzle-orm";
import { sqliteTable, text, integer, real, unique, check } from "drizzle-orm/sqlite-core";

// Models
export const products = sqliteTable('products', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
    cost: real('cost').notNull().default(0),
    stock: integer('stock').notNull(),
    unit: text('unit').notNull(),
    category: text('category'),
    currency: text('currency').notNull(),
    expiresAt: text('expires_at'),
    createdAt: integer('created_at', { mode: 'timestamp_ms' })
        .notNull().default(sql`(unixepoch() * 1000)`)
})

export const staff = sqliteTable('staff', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
    uid: text('uid').notNull(),
    salary: real('salary').notNull().default(0),
    currency: text('currency').notNull(),
    role: text('role'),
    startedAt: text('started_at'),
    endsAt: text('ends_at'),
    createdAt: integer('created_at', { mode: 'timestamp_ms' })
        .notNull().default(sql`(unixepoch() * 1000)`)
}, (table) => [
    unique('staff_uid_unique').on(table.uid)
])

export const staffAccounts = sqliteTable('staff_accounts', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    staffId: integer('staff_id')
        .notNull()
        .references(() => staff.id, { onDelete: 'cascade' }),
    username: text('username').notNull(),
    password: text('password').notNull(),
    createdAt: integer('created_at', { mode: 'timestamp_ms' })
        .notNull().default(sql`(unixepoch() * 1000)`)
}, (table) => [
    unique('staff_accounts_username_unique').on(table.username)
])

export const providers = sqliteTable('providers', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
    waste: real('waste').notNull().default(0),
    currency: text('currency').notNull(),
    startedAt: text('started_at'),
    endsAt: text('ends_at'),
    span: integer('span').notNull().default(31),
    active: integer('active').notNull().default(1),
    createdAt: integer('created_at', { mode: 'timestamp_ms' })
        .notNull().default(sql`(unixepoch() * 1000)`)
})

export const traces = sqliteTable('traces', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    date: text('date').notNull(),
    refunds: integer('refunds').notNull().default(0),
    sells: integer('sells').notNull().default(0),
    total: text('total', { mode: 'json' }).notNull().default({}),
    isClosed: integer('is_closed').notNull().default(0),
    createdAt: integer('created_at', { mode: 'timestamp_ms' })
        .notNull().default(sql`(unixepoch() * 1000)`)
})

export const tickets = sqliteTable('tickets', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    traceId: integer('trace_id')
        .notNull()
        .references(() => traces.id, { onDelete: 'cascade' }),
    total: real('total').notNull().default(0),
    kind: text('kind').notNull().default('sale'),
    archived: integer('archived', { mode: 'boolean' }).notNull().default(false),
    isClosed: integer('is_closed').notNull().default(0),
    createdAt: integer('created_at', { mode: 'timestamp_ms' })
        .notNull().default(sql`(unixepoch() * 1000)`)
})

export const ticketItems = sqliteTable('ticket_items', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    ticketId: integer('ticket_id')
        .notNull()
        .references(() => tickets.id, { onDelete: 'cascade' }),
    productId: integer('product_id')
        .notNull()
        .references(() => products.id, { onDelete: 'restrict' }),
    amount: integer('amount').notNull(),
    unitPrice: real('unit_price').notNull(),
    subTotal: real('sub_total').notNull(),
    transactionCurrency: text('transaction_currency').notNull(),
    originalTicketItemId: integer('original_ticket_item_id')
        .references(() => ticketItems.id, { onDelete: 'restrict' }),
})

export const tag = sqliteTable('tags', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
    type: integer('type').notNull(),
    color: text('color'),
    createdAt: integer('created_at', { mode: 'timestamp_ms' })
        .notNull().default(sql`(unixepoch() * 1000)`)
}, (table) => [
    unique('tags_name_type_unique').on(table.name, table.type)
])

export const contacts = sqliteTable('contacts', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    phone: text('phone').notNull(),
    email: text('email'),
    address: text('address'),
    staffId: integer('staff_id')
        .references(() => staff.id, { onDelete: 'cascade' }),
    providerId: integer('provider_id')
        .references(() => providers.id, { onDelete: 'cascade' }),
    createdAt: integer('created_at', { mode: 'timestamp_ms' })
        .notNull().default(sql`(unixepoch() * 1000)`)
})

export const notes = sqliteTable('notes', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    title: text('title').notNull(),
    value: text('value').notNull(),
    staffId: integer('staff_id').references(() => staff.id, { onDelete: 'cascade' }),
    providerId: integer('provider_id').references(() => providers.id, { onDelete: 'cascade' }),
    productId: integer('product_id').references(() => products.id, { onDelete: 'cascade' }),
    createdAt: integer('created_at', { mode: 'timestamp_ms' })
        .notNull().default(sql`(unixepoch() * 1000)`),
}, (table) => [
    check('notes_single_owner_check', sql`
        (${table.staffId} IS NOT NULL) +
        (${table.providerId} IS NOT NULL) +
        (${table.productId} IS NOT NULL) = 1
    `),
])

// Relations
export const relations = defineRelations(
    { products, staff, providers, traces, tickets, ticketItems, tag, contacts, notes },
    (r) => ({
        tickets: {
            trace: r.one.traces({
                from: r.tickets.traceId,
                to: r.traces.id,
            }),
            items: r.many.ticketItems(),
        },

        ticketItems: {
            ticket: r.one.tickets({
                from: r.ticketItems.ticketId,
                to: r.tickets.id,
            }),
            product: r.one.products({
                from: r.ticketItems.productId,
                to: r.products.id,
            }),
        },

        traces: {
            tickets: r.many.tickets(),
        },

        products: {
            ticketItems: r.many.ticketItems(),
            notes: r.many.notes({ from: r.products.id, to: r.notes.productId }),
        },

        staff: {
            contacts: r.many.contacts(),
            notes: r.many.notes({ from: r.staff.id, to: r.notes.staffId }),
        },
        providers: {
            contacts: r.many.contacts(),
            notes: r.many.notes({ from: r.providers.id, to: r.notes.providerId }),
        },

        contacts: {
            staff: r.one.staff({
                from: r.contacts.staffId,
                to: r.staff.id,
            }),
            provider: r.one.providers({
                from: r.contacts.providerId,
                to: r.providers.id,
            }),
        },

        notes: {
            staff: r.one.staff({
                from: r.notes.staffId,
                to: r.staff.id,
            }),
            provider: r.one.providers({
                from: r.notes.providerId,
                to: r.providers.id,
            }),
            product: r.one.products({
                from: r.notes.productId,
                to: r.products.id,
            }),
        },
    })
);
