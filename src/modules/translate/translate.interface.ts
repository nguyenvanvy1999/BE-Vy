export type ITranslate = Record<string, string>;

export type ITranslateOptionsProperties = Record<string, string>;
export interface ITranslateOptions {
  readonly appLanguages?: string[];
  readonly properties?: ITranslateOptionsProperties;
}

export type ITranslateSetOptions = Omit<ITranslateOptions, 'appLanguages'>;
