import type {
  ApiCollection,
  JsonApiCollectionResponse,
  JsonApiSingleResponse,
  ApiResource,
  UnpackOptions,
} from "./api.types";
import { createApiClient, AxiosApiClient } from "../axios";

export abstract class BaseApiClient {
  protected readonly defaultHeaders = {
    "Content-Type": "application/json",
  };

  constructor(protected readonly api: AxiosApiClient = createApiClient()) {}

  protected unpackSingle<T extends object, M>(
    response: JsonApiSingleResponse<T, M>,
    options: UnpackOptions,
  ): ApiResource<T, M> {
    if (!response.data?.attributes) {
      throw new Error(`${options.errMsg}: missing attributes`);
    }

    return {
      data: response.data.attributes,
      metadata: response.metadata ?? ({} as M),
    };
  }

  protected unpackCollection<T, M>(
    response: JsonApiCollectionResponse<T, M>,
    options: UnpackOptions,
  ): ApiCollection<T, M> {
    if (!response.data || !Array.isArray(response.data)) {
      throw new Error(`${options.errMsg}: missing data array`);
    }

    return {
      data: response.data.map((item) => item.attributes),
      metadata: response.metadata ?? ({} as M),
    };
  }
}
