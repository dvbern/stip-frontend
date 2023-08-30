export const lowercased = <T extends string>(value: T) =>
  value.toLocaleLowerCase() as Lowercase<T>;

export const capitalized = <T extends string>(text: T) =>
  (text.length > 1
    ? `${text[0].toLocaleUpperCase()}${text.slice(1).toLocaleLowerCase()}`
    : text.toUpperCase()) as Capitalize<Lowercase<T>>;
