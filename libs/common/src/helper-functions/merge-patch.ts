/* eslint-disable */
// There are so many rules that would have to be disabled, due to very dynamic nature of the code,
// it's just easier to disable whole ESLint for this one file.

import { Nullable } from '../types';

// Based on json-merge-patch library, which itself follows the JSON merge patch standard (RFC7386).
// Customized and slightly changed the behavior compared to original implementation, in regards to
// handling undefined values. The standard states:
//
// "If the patch is anything other than an object, the result will always be to replace the entire
// target with the entire patch."
//
// However, in JS world having an `undefined` value in a property, while not the same, is often
// equivalent of having no property set at all. This is especially relevant when using
// class-transformer (aka. every DTO in our project), since it creates keys for all undefined
// properties. Treating undefined value as such makes the function easier to use.

type NullIfOptional<T> = T extends undefined ? null : never;

type PatchValues<T> = T extends any[] ? T : T extends object ? { [P in keyof T]?: PatchValues<T[P]> | NullIfOptional<T[P]> } : T;

type SerializedTarget<T> = T extends { toJSON: (...args: any[]) => infer U } ? U : T;

type PatchParam<T> = Nullable<PatchValues<SerializedTarget<T>>>;

type MapOptional<U> = Extract<U, null | undefined>;

type MapFn<T, V> = (result: Exclude<SerializedTarget<T>, null | undefined>) => V;

export function mergePatch<T, U extends PatchParam<T>>(target: T, patch: U): SerializedTarget<T> | MapOptional<U>;
export function mergePatch<T, U extends PatchParam<T>, V>(target: T, patch: U, mapFn: MapFn<T, V>): V | MapOptional<U>;
export function mergePatch<T, U extends PatchParam<T>, V>(target: T, patch: U, mapFn?: MapFn<T, V>): SerializedTarget<T> | MapOptional<U> | V {
  const targetCopy = structuredClone(serialize(target));

  const result = patch && apply(targetCopy, patch);
  if (mapFn && result != null) {
    return mapFn(result);
  }

  return result;
}

function serialize(value: any): any {
  return value && typeof value.toJSON === 'function' ? value.toJSON() : value;
}

function apply(target: any, patch: any): any {
  target = serialize(target);
  if (patch === undefined) {
    return target;
  }

  patch = serialize(patch);

  if (patch === null || typeof patch !== 'object' || Array.isArray(patch)) {
    return patch;
  }

  if (target === null || typeof target !== 'object' || Array.isArray(target)) {
    target = {};
  }
  for (const [key, value] of Object.entries(patch)) {
    if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
      return target;
    }
    if (value === null) {
      if (target.hasOwnProperty(key)) {
        delete target[key];
      }
    } else {
      target[key] = apply(target[key], value);
    }
  }
  return target;
}
