# Date and Timestamp Conventions

This document defines the mandatory rules for handling dates, timestamps, and time zones in the Web Panel.

The API distinguishes **three** date types and each one has its own rule. Treating a day as an instant (or the other way around) shifts the value by one day.

---

## Reference implementations
- [utils/format.ts](../../src/utils/format.ts) — `formatDate` (`dayjs`, correct for both instants and days) and `formatDateISO`.
- [components/input/input.date.controlled.tsx](../../src/components/input/input.date.controlled.tsx) — `DateInput`: `serializeDateOnly` when `showTime` is false, `serializeDateTime` when it is true.
- [utils/custom-schema-validations.ts](../../src/utils/custom-schema-validations.ts) — `dateOnlyOptional` and `dateRequired` (day), `dateOptional` (instant).
- [features/logs/services/logs.services.ts](../../src/features/logs/services/logs.services.ts) — period filter converted to instants.

---

## 1. The three types

| Type | Wire format | Read with | Send with |
|---|---|---|---|
| Instant (`DateTime`) | `"2026-09-02T20:00:00Z"` | `formatDate(value, true)` | `date.toISOString()` — `serializeDateTime` / `showTime` |
| Day (`DateOnly`) | `"2026-08-21"` | `formatDate(value)` | `dayjs(value).format("YYYY-MM-DD")` — `serializeDateOnly` |
| Time of day (`TimeOnly`) | `"19:30:00"` | `value.slice(0, 5)` | `"HH:mm:ss"` |

The API sends every instant in UTC with the `Z` suffix, so `dayjs()` converts it to the browser time zone on its own. **Never apply `.utc()` to a value that already carries `Z`** — it renders the time twice-converted.

A day carries no hour and no time zone: it must render the same in any time zone. `dayjs("2026-08-21")` reads it as local midnight and is correct. `new Date("2026-08-21")` reads it as **UTC** midnight, which is 9 PM of the previous day in Brasília — never use it for this type.

### Field inventory

- **Instants**: `createdAt`, `updatedAt`, `lastAccess`, `respondedAt`, `startDate` / `endDate` (events), `date` (campaign sessions and announcements), `startsAt` / `endsAt` (bookings), chat `createdAt` / `lastMessageAt`, `token.expiration`.
- **Days**: `birthDate`, `bookingDate`, and the `fromDate` / `toDate` booking filters.
- **Times of day**: `startTime`, `endTime`, `openTime`, `closeTime`.

---

## 2. Period filters are instants

Query parameters such as `startDate` / `endDate` (`/logs`, `/requesthistory`) and `from` / `to` (`/userfeedbacks/summary`) are **instants**, even though the user picks a day in the UI. A value with no offset is read as **UTC** by the API, so `endDate=2026-09-02` means 9 PM of September 1 in Brasília — the most recent hours silently disappear from the result.

The filter state and the `DateInput` keep working with `yyyy-MM-dd`. The **service** converts to instants right before the request:

```ts
const toRangeStart = (value?: Date | string) =>
  value ? dayjs(value).startOf("day").toISOString() : undefined;

const toRangeEnd = (value?: Date | string) =>
  value ? dayjs(value).endOf("day").toISOString() : undefined;
```

Keep this conversion in a single place per feature — the service — so the filter component and the initial filter constants stay in day format.

---

## 3. Date and time lifecycle in forms

1. **User input**: `DateInput` renders in the browser time zone. Without `showTime` it emits `yyyy-MM-dd`; with `showTime` it emits a full ISO string.

2. **Submission**: the schema decides the wire format, not the screen.
   - Instant fields: `dateOptional` (coerces to `Date`, serialized as ISO by axios).
   - Day fields: `dateOnlyOptional` or `dateRequired` — both normalize to `yyyy-MM-dd` using the **local** calendar.
   - Never normalize a day with `toISOString().split("T")[0]`: that reads the UTC day and picks tomorrow for anything built after 9 PM in Brasília.

3. **Loading for edit**: services do not parse responses through zod, so the raw API string reaches the form. A `yyyy-MM-dd` value goes straight into `DateInput`, which parses it at local noon and preserves the day.

---

## 4. Golden rule

> Instants travel in UTC and are converted to local time only when rendered. Days are never converted at all.

---

## 5. What NOT to do

- ❌ Do not read or normalize a day field with `new Date()` or `toISOString()`.
- ❌ Do not send a period filter as `yyyy-MM-dd` — convert to `startOf("day")` / `endOf("day")` instants.
- ❌ Do not apply `.utc()` to an API value that already ends in `Z`.
- ❌ Do not send instants without the `Z` suffix or without a UTC offset.
- ❌ Do not hardcode manual time zone math (e.g. adding or subtracting hours).
