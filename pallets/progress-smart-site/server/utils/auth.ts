import { Request } from "express";
import { User } from "@shared/schema";

/**
 * Gets the authenticated user from the request object
 * 
 * @param req Express request object
 * @returns The authenticated user or undefined if not authenticated
 */
export function getUserFromRequest(req: Request): User | undefined {
  return req.user as User | undefined;
}