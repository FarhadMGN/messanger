import {MessageModel} from "./message.model";
import {UserModel} from "./user.model";

export interface RoomModel {
    roomId: string;
    messages: MessageModel[];
    users: UserModel[];
}
