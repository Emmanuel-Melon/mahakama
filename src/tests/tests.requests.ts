import request from "supertest";
import { app } from "@/app";
import { expect } from "vitest";

export const apiRequest = request(app);

export const expectSuccess = (response: any, status = 200) => {
  expect(response.status).toBe(status);
  expect(response.body).toHaveProperty("data");
  expect(response.body).toHaveProperty("metadata");
};

export const expectError = (response: any, status: number) => {
  expect(response.status).toBe(status);
  expect(response.body).toHaveProperty("message");
};

export const authedRequest = (token: string) => ({
  get: (url: string) =>
    apiRequest.get(url).set("Authorization", `Bearer ${token}`),
  post: (url: string, body?: object) =>
    apiRequest.post(url).set("Authorization", `Bearer ${token}`).send(body),
  patch: (url: string, body?: object) =>
    apiRequest.patch(url).set("Authorization", `Bearer ${token}`).send(body),
  delete: (url: string) =>
    apiRequest.delete(url).set("Authorization", `Bearer ${token}`),
});
