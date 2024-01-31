import { Router } from "express";
import __dirname from "../utils.js";
import messagesDao from "../daos/dbManager/messages.dao.js";

const router = Router();

// Recuperar todos los mensajes
router.get('/', async(req, res) => {
    try {
        const messages = await messagesDao.getAllMessages();
        res.json(messages);
    }
    catch(error){
        console.log(error);
        res.status(400).json({
            error: error
        });
    }
});

//Registrar un message
router.post('/',  async (req, res) => {
     let message = req.body;
     try {
         const messageAdded = await messagesDao.createMessage(message);
         res.json({
                 message: "Message created",
                 messageAdded,
               });
         console.log("Message creado:");
         console.log(messageAdded);
         }
     catch (e) {
       res.json({
         error: e.message,
       });
     }
 }); 

export default router;