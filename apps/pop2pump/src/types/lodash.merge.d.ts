declare module "lodash.merge" {
  const merge: <TObject, TSource>(
    object: TObject,
    source: TSource
  ) => TObject & TSource;
  export default merge;
}
