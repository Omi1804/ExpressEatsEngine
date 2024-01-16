import { CustomerPayload } from "./Customer.dto";
import { VandorPayload } from "./Vandor.dto";

export type AuthPayload = VandorPayload | CustomerPayload;
