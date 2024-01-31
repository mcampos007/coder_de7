import { messageModel } from "../../models/messages.model.js";

class MessageDao {
    async getAllMessages(){
        return await messageModel.find();
    };

    async getMessageById(id){
        return await messageModel.findById(id);
    };

    async createMessage(message){
        return await messageModel.create(message);
    };

    async updateMessage(id, newMessage){
        return await messageModel.findByIdAndUpdate(id, newMessage);
    };
    

    async deleteMessage(id){
        return await messageModel.findByIdAndDelete(id);
    }

}

export default new MessageDao();