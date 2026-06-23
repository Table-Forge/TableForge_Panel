# Forms

This document defines how we manage forms, state, and validation using React Hook Form and Zod.

---

## Reference implementations
- [features/users/schemas/users.schema.ts](../../src/features/users/schemas/users.schema.ts) — Example Zod schema.
- [utils/custom-schema-validations.ts](../../src/utils/custom-schema-validations.ts) — Reusable validators.

---

## Schema-first types

The Zod schema is the single source of truth for the form payload.

1. Define the schema in `features/<domain>/schemas/`.
2. Infer the TypeScript interface from the schema.
3. Pass the resolver to React Hook Form.

```ts
// users.schema.ts
export const UserCreateSchema = z.object({
  name: stringRequired,
  email: emailRequired,
  password: createPasswordSchema(),
});

export type IUserCreate = z.infer<typeof UserCreateSchema>;
```

## Reusable validators

Always use the pre-built Zod primitives in `utils/custom-schema-validations.ts`. They provide consistent error messages in pt-BR.

- `stringRequired`
- `emailRequired`
- `dateRequired`
- `cpfCnpjValidation`
- `numberOptional`

## Controlled inputs

We use custom generic wrappers (e.g., `ControlledInput<TFieldValues>`) that consume React Hook Form's `useController`.

- Pass the `hookForm` object (the return value of `useForm()`) and the `name` prop.
- Variants like `input.password`, `input.date`, and `input.masked` exist to handle specialized input types.

## Rules

1. **Strict typing**: The form must be strictly typed `useForm<IYourSchema>`.
2. **Portuguese validation**: All validation messages must be in pt-BR. Use the shared primitives to guarantee this.
3. **Submit = Mutation**: The `onSubmit` handler should generally just pass the values directly to a mutation's `mutate` function.

## What NOT to do
- **Don't declare duplicate interfaces**: Never write `interface IUserCreate` by hand if a Zod schema exists.
- **Don't use raw native inputs**: Always use the components from `src/components/input/`.
