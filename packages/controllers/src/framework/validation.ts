import { ValidationError } from "./errors/requests";

export function validateBody<T>(
  body: any,
  schemaType: { new (): T },
  ignoreProperties?: Array<keyof T>,
): T {
  const schema = new schemaType() as object;
  const schemaKeys = Reflect.ownKeys(schema);
  const bodyKeys = Object.keys(body);

  schemaKeys
    .map((k) => k.toString())
    .forEach((key) => {
      if (ignoreProperties?.includes(key as any)) return;
      if (!bodyKeys.includes(key))
        throw new ValidationError(
          `Received request body is missing [${key}] property.`,
        );
      else {
        const desc = Reflect.getOwnPropertyDescriptor(schema, key);
        const bodyKeyType = typeof body[key];
        if (typeof desc?.value !== bodyKeyType)
          throw new ValidationError(
            `Expected request body property [${key}] had unexpected type (${bodyKeyType})`,
          );
      }
    });

  return body as T;
}
