import userModel from "../../models/users.model.js";
import mongoose, { Mongoose, Types  } from 'mongoose';

class UserDao {
    // Recuperar todos los usuarios
    async getAllUsers(){
        return await userModel.find();
    };
    
    //recuperar un usuario en base a si id
    async getUserById(id){
        const result = await userModel.findById(id);
        console.log(result);
        return result;
    };

    //recuperar un usuario en base a su mail
    async getUserbyEmail(userEmail){
        const result = await userModel.findOne({ email: userEmail })
        
            // Usuario encontrado, puedes hacer algo con él
            // console.log('Resultado de la búsqueda:', result);
            return result;
        
    };

    //create usuario
    async createUser(user){
        console.log("Voy a crear el usuario");
        return await userModel.create(user);
    };

    //actualizar datos de un usuario
    async updateUser(id, user){
        return await userModel.findByIdAndUpdate(id, user);
    }

    //Eliminar un usuario
    async deleteUser(id){
        return await userModel.findByIdAndDelete(id)
    }


}

export default new UserDao();
