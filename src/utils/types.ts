type ApiKey = string;
type ModelName = string;
type Temperature = number;
type MaxLoops = number;

export type ModelSettings = {
  customApiKey: ApiKey;
  customModelName: ModelName;
  customTemperature?: Temperature;
  customMaxLoops?: MaxLoops;
};

const defaultModelSettings: ModelSettings = {
  customApiKey: '',
  customModelName: '',
};

export const getDefaultModelSettings = (): ModelSettings => ({
  ...defaultModelSettings,
  customTemperature: 1,
  customMaxLoops: 100,
});
