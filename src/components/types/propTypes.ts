import React, { createContext, Dispatch, SetStateAction } from 'react';

export type TooltipProperties = {
  message?: string;
  disabled?: boolean;
};

type ModelState<T> = {
  value: T;
  setValue: Dispatch<SetStateAction<T>>;
};

export type ReactModelStates = {
  customApiKey: ModelState<string>;
  customModelName: ModelState<string>;
  customTemperature: ModelState<number>;
  customMaxLoops: ModelState<number>;
};

export const ModelContext = createContext<ReactModelStates>({
  customApiKey: { value: '', setValue: () => {} },
  customModelName: { value: '', setValue: () => {} },
  customTemperature: { value: 1, setValue: () => {} },
  customMaxLoops: { value: 100, setValue: () => {} },
});
