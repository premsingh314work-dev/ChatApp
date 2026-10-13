import type { HydratedDocument } from "mongoose";
import type { IUser } from "../models/user.model.js";

export interface SocketData {
  userId: string;
  user: HydratedDocument<IUser>;
}
