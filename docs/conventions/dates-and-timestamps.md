# Date and Timestamp Conventions

This document defines the mandatory rules for handling dates, timestamps, and time zones in the Web Panel.

---

## Reference implementations
- [utils/format.ts](../../src/utils/format.ts) — Date formatting helpers (`formatDate`, `formatDateISO`).
- [components/input/input.date.controlled.tsx](../../src/components/input/input.date.controlled.tsx) — `DateInput` controlled component (`serializeDateTime`, `parseDateValue`).

---

## 1. General Timestamp Rule (Front-end <-> Back-end Communication)

1. **Submission (Front-end -> Back-end)**:
   The front-end must **never** send dates or times formatted with local time zone (GMT/Local) or un-offset strings to the API.
   All request payloads containing date/time data must be submitted in absolute **UTC ISO 8601** format (e.g. `new Date().toISOString()`).

2. **API Response (Back-end -> Front-end)**:
   The back-end acts as the absolute single source of truth for time and is completely **time-zone blind**. It receives UTC, stores UTC, and returns UTC in ISO 8601 format.

3. **UI Rendering (Front-end)**:
   Time zone conversion to the user's local region (local GMT) is the **exclusive responsibility** of the front-end presentation layer. Local formatting must only happen when rendering data on screen (using `Intl.DateTimeFormat`, `dayjs`, or `new Date()`).

---

## 2. Date and Time Lifecycle in Forms

1. **User Input**:
   Users view and interact with date/time fields (`DateInput`) in their local time zone.

2. **Submission (Creation / Update)**:
   When a form includes time selection (`showTime: true`), the submitted value must be converted to absolute **UTC ISO 8601** format (`date.toISOString()`).

3. **Loading for Edit**:
   When loading a form for editing, the UTC ISO 8601 value received from the back-end is parsed as a UTC `Date`, enabling the UI layer (`DateInput` / react-datepicker) to render the time converted to the user's local time zone.

---

## 3. Golden Rule

> The back-end is time-zone blind. It receives UTC, stores UTC, and returns UTC. All time zone transformations occur strictly in the front-end visual layer.

---

## 4. What NOT to do

- ❌ Do not send date-time strings without `Z` or UTC offset in form payloads (`YYYY-MM-DDTHH:mm:ss`).
- ❌ Do not ignore the `Z` flag when parsing API responses.
- ❌ Do not hardcode manual time zone offsets (e.g., manually adding/subtracting hours).
