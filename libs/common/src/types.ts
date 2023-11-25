export type Nullable<T> = T | null | undefined;

export type DeepPartial<T> = T extends object ? { [P in keyof T]?: DeepPartial<T[P]> } : T;

export type JSONResult<T> = T extends Date ? string : T extends object ? { [P in keyof T]: JSONResult<T[P]> } : T;
