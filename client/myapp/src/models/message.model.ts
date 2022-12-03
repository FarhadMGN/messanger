import { UserModel } from "./user.model";

export interface MessageModel {
    content: string;
    type: string;
    from: UserModel;
}

