export interface I18nConfig<TNamespace extends string, TResources> {
  namespace: TNamespace;
  resources: {
    en: TResources;
    ar: TResources;
  };
}
