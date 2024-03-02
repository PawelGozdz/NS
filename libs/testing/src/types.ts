/* eslint-disable @typescript-eslint/no-explicit-any */
export type FunctionMock<T extends (...args: any) => any> = jest.Mock<ReturnType<T>, Parameters<T>>;

export type ClassMock<T> = jest.Mocked<Required<T>> & Required<T>;
