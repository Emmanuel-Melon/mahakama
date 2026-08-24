import { createApiClient, AxiosApiClient } from "../axios";
import type { ApiCollection, ApiResource } from "../api/api.types";
import { BaseApiClient } from "../api";
import { CORPUS_API_ROUTES } from "../api.routes";
import {
  getClientToken,
  consumeSSEStream,
  handleSSEFetchError,
} from "../api/api.sse";
import type { components } from "../generated/api.types";

export type Corpus = components["schemas"]["Corpus"];
export type CorpusResource = components["schemas"]["CorpusResource"];
export type CorpusSingleResponse =
  components["schemas"]["CorpusSingleResponse"];
export type CorpusCollectionResponse =
  components["schemas"]["CorpusCollectionResponse"];

export type CorpusMetadata = CorpusSingleResponse["metadata"];
export type CorpusResult = ApiResource<Corpus, CorpusMetadata>;
export type CorpusCollection = ApiCollection<
  Corpus,
  CorpusCollectionResponse["metadata"]
>;

export type CorpusIngestionEvent =
  | {
      type: "started";
      data: { timestamp: string; filename: string; size: number };
    }
  | {
      type: "progress";
      data: {
        processed: number;
        total: number;
        percentage: number;
        chunk: number;
        totalChunks: number;
      };
    }
  | { type: "content"; data: { chunk: number; preview: string } }
  | {
      type: "completed";
      data: {
        filename: string;
        size: number;
        processedAt: string;
        totalChunks: number;
      };
    }
  | { type: "error"; data: { message: string; code?: string } };

export interface UploadCorpusOptions {
  title?: string;
  description?: string;
  type?: string;
}

export class CorpusApiClient extends BaseApiClient {
  protected readonly path = CORPUS_API_ROUTES.ROOT;

  constructor(api: AxiosApiClient = createApiClient()) {
    super(api);
  }

  public async getCorpusEntries(
    options: { headers?: Record<string, string> } = {},
  ): Promise<CorpusCollection> {
    const response = await this.api.request<CorpusCollectionResponse>(
      this.path,
      {
        headers: { ...this.defaultHeaders, ...options.headers },
      },
    );

    return this.unpackCollection(response, {
      errMsg: "Invalid corpus data received from the server",
    });
  }

  public async getCorpusEntryById(
    corpusId: string | number,
    options: { headers?: Record<string, string> } = {},
  ): Promise<CorpusResult> {
    const route = CORPUS_API_ROUTES.CORPUS.replace(
      ":corpusId",
      String(corpusId),
    );
    const response = await this.api.request<CorpusSingleResponse>(route, {
      headers: { ...this.defaultHeaders, ...options.headers },
    });

    return this.unpackSingle(response, {
      errMsg: "Invalid corpus entry data received from the server",
    });
  }

  public async uploadCorpusEntry(
    file: File,
    options: UploadCorpusOptions = {},
    onEvent: (event: CorpusIngestionEvent) => void,
    signal?: AbortSignal,
  ): Promise<void> {
    const formData = new FormData();
    formData.append("file", file);
    if (options.title) formData.append("title", options.title);
    if (options.description)
      formData.append("description", options.description);
    if (options.type) formData.append("type", options.type);

    const baseURL =
      import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";
    const token = getClientToken();

    const response = await fetch(`${baseURL}${CORPUS_API_ROUTES.INGEST}`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
      credentials: "include",
      signal,
    });

    if (!response.ok) {
      return handleSSEFetchError(
        response,
        `Upload failed with status ${response.status}`,
      );
    }

    await consumeSSEStream<CorpusIngestionEvent>(response, onEvent, signal);
  }
}

let _corpusApi: CorpusApiClient | null = null;
export const corpusApi = new Proxy({} as CorpusApiClient, {
  get(_, prop) {
    if (!_corpusApi) _corpusApi = new CorpusApiClient();
    return _corpusApi[prop as keyof CorpusApiClient];
  },
});
