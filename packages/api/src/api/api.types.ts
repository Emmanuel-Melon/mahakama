import { ApiClientError } from "./api.errors";
import type { components } from "../generated/api.types";

type BaseResource = components["schemas"]["JsonApiResource"];
type BaseSingleResponse = components["schemas"]["JsonApiResponse"];
type BaseCollectionResponse =
  components["schemas"]["JsonApiCollectionResponse"];

export interface JsonResource<T> extends Omit<BaseResource, "attributes"> {
  attributes: T;
}

export interface JsonApiSingleResponse<
  T,
  M = BaseSingleResponse["metadata"],
> extends Omit<BaseSingleResponse, "data" | "metadata"> {
  data: JsonResource<T>;
  metadata?: M;
}

export interface JsonApiCollectionResponse<
  T,
  M = BaseCollectionResponse["metadata"],
> extends Omit<BaseCollectionResponse, "data" | "metadata"> {
  data: JsonResource<T>[];
  metadata?: M;
}

export interface CollectionWithMeta<T, M> {
  data: T[];
  metadata: M;
}

export interface UnpackOptions {
  errMsg: string;
}

export type JsonApiErrorResponse =
  components["schemas"]["JsonApiErrorResponse"];
export type JsonApiError = components["schemas"]["JsonApiError"];

export type ApiMetadata = Record<string, unknown>;

export interface AsyncState {
  isLoading: boolean;
  error: ApiClientError | null;
}

export interface ApiResource<T, M = ApiMetadata> {
  data: T;
  metadata: M;
}

export interface ApiCollection<T, M = ApiMetadata> {
  data: T[];
  metadata: M;
}
