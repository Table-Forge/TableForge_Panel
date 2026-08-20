# Forms

This document defines how we manage forms and validation using React Hook Form and Zod.

> Date and timestamp rules in forms are defined in [dates-and-timestamps.md](./dates-and-timestamps.md).

## Reference implementations
- [features/users/schemas/user.schema.ts](../../src/features/users/schemas/user.schema.ts) — Zod schemas with inferred types.
- [utils/custom-schema-validations.ts](../../src/utils/custom-schema-validations.ts) — Reusable validators.
- [pages/users/components/modal-edit/modal-edit.tsx](../../src/pages/users/components/modal-edit/modal-edit.tsx) — Full form: `zodResolver`, controlled inputs, enum selects, mutation submit.

---

## Schema-first types

The Zod schema is the single source of truth for the form payload.

1. Define the schema in `features/<domain>/schemas/<domain>.schema.ts` (singular file name: `user.schema.ts`, `campaign.schema.ts`).
2. Infer the TypeScript type from the schema and export it next to it, with the `I` prefix.
3. Pass the resolver to React Hook Form.

```ts
// user.schema.ts
export const UserCreateSchema = z
  .object({
    username: stringRequired,
    nickname: stringRequired,
    email: emailRequired,
    birthDate: dateRequired,
    password: createPasswordSchema(),
    confirmPassword: stringRequired,
  })
  .superRefine((data, context) => {
    if (data.password !== data.confirmPassword) {
      context.addIssue({
        code: "custom",
        message: "As senhas devem ser iguais.",
        path: ["confirmPassword"],
      });
    }
  });

export type IUserCreateInput = z.infer<typeof UserCreateSchema>;
```

Cross-field and conditional validation lives in `.superRefine` on the schema (see `UserSchema` in `user.schema.ts` for create-only and Organizer-only required fields).

Form setup (from `pages/users/components/modal-edit/modal-edit.tsx`):

```ts
const form = useForm<IUser>({
  defaultValues,
  mode: "onChange",
  resolver: zodResolver(UserSchema) as Resolver<IUser>,
});
```

Edit modals build `defaultValues` with `useMemo` merging the fetched entity, and call `reset(defaultValues)` in a `useEffect` once the data loads.

Filter forms (`pages/*/components/search-filters/search-filters.tsx`) use plain `useForm` without a resolver — there is nothing to validate there.

## Reusable validators

Always use the pre-built Zod primitives in `utils/custom-schema-validations.ts`. They preprocess empty/null values and provide consistent pt-BR error messages (from `ERROR_MESSAGE`/`FILE_ERROR_MESSAGE` in `src/components/error-message/error-message.constant.ts`).

- `stringRequired` / `stringOptional`
- `numberRequired` / `numberOptional`
- `dateRequired` / `dateOptional`
- `emailRequired` / `emailOptional`
- `cpfCnpjValidation` / `cpfValidation`
- `fileRequired` / `fileListRequired` / `fileSchema`
- `createPasswordSchema()` + `getPasswordError` / `PASSWORD_RULES` (used by `PasswordRequirements`)

## Controlled components

Generic wrappers consume React Hook Form's `useController` internally. All of them receive `hookForm` (the return value of `useForm()`) and `name`, and render their own `ErrorMessage`; forms usually also pass `error={errors.field?.message}` explicitly.

- `ControlledInput` — `components/input/input.default.controlled.tsx` (flags: `sanitize`, `sanitizeEmail`, `uppercase`, `removeSpaces`)
- `ControlledMaskedInput` — `components/input/input.masked.controlled.tsx` (requires `mask`)
- `ControlledNumberInput` — `components/input/input.number.controlled.tsx`
- `DateInput` — `components/input/input.date.controlled.tsx`
- `ControlledTextarea` — `components/input/input.textarea.controlled.tsx`
- `ControlledImageInput` — `components/input/input.image.controlled.tsx`
- `PasswordInput` — `components/input/input.password.tsx`
- `Select` — `components/select/select.tsx` (options as `TSelectOptions[]` via `initialOptions`)
- `CheckboxControlled` — `components/checkbox/checkbox-controlled.tsx`
- `MultiSelect` — `components/multi-select/multi-select.tsx`
- `ControlledLocationAutocomplete` — `components/location-autocomplete/location-autocomplete.controlled.tsx`

## Form layout

Each field is an `InputGroup` containing a `Label` and one controlled component; rows of fields are grouped in `FieldsWrapper`. `Label` (`components/label/label.tsx`) receives the text as **children**, plus `htmlFor`, `isRequired`, and optional `infoText`:

```tsx
<InputGroup>
  <Label htmlFor="email" isRequired>
    E-mail
  </Label>
  <ControlledInput hookForm={form} name="email" placeholder="Digite o e-mail" />
</InputGroup>
```

## Side effects between fields

- Do not add side-effect callback props (e.g., `onSelect`, `onChangeText`) to controlled components to react to a field and change another.
- To derive UI or chain values from a field, read it with `watch`/`useWatch` and, when another field must change, call `setValue` from a handler or effect. Example: `pages/users/components/modal-edit/modal-edit.tsx` watches `type`/`documentType` to toggle the Organizer fields and the document mask.
- Existing exceptions, not a template for new components: `ControlledLocationAutocomplete` exposes `onSelectLocation`/`onClearSelection` (used in `pages/campaigns/components/modal-edit/modal-edit.tsx`), and `Select`'s `onChangeInputSearch` exists only for server-side option search.

## Rules

1. **Strict typing**: The form must be strictly typed `useForm<IYourSchemaType>` with the type inferred from the schema.
2. **Portuguese validation**: All validation messages must be in pt-BR. Use the shared primitives to guarantee this.
3. **Submit = Mutation**: The `handleSubmit` callback assembles the payload and hands it to a mutation hook (e.g., `createOrUpdate` from `useUsersMutation`); success/error feedback lives in the mutation hook, not the form.
4. **Labels**: Every field must have an explicit `<Label htmlFor="...">` inside its `InputGroup`, unless the design says otherwise.

## What NOT to do
- **Don't declare duplicate interfaces**: Never write a payload `interface`/`type` by hand if a Zod schema exists. Legacy counterexample not to copy: `ICampaignForm` in `pages/campaigns/components/modal-edit/modal-edit.tsx` (hand-written type, no resolver).
- **Don't use raw native inputs**: Always use the components from `src/components/input/` (and `select/`, `checkbox/`, `multi-select/`).
- **Don't skip the resolver on validated forms**: If the form has validation rules, they belong in the schema wired via `zodResolver`, not in the submit handler.
