import {Request} from "express";

// extends default express request type wit userId
export interface ExpressRequestInterface extends Request {
  userId?: number
}