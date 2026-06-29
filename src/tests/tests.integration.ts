import request from "supertest";
import { app } from "@/app";

export const apiRequest = request(app);
