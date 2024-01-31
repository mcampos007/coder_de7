import  { Schema,  model } from "mongoose";

const messageCollection = "messages";

const messageSchema = new Schema({
    correoDelUsuario: { type: String, required: true },
    message: { type: String, required: true },
}
);

export const messageModel = model(messageCollection, messageSchema);