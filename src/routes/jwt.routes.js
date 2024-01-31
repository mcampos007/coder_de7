import { Router } from "express";
import __dirname from "../utils.js";
import usersDao from "../daos/dbManager/users.dao.js";
import { createHash, isValidPassword } from '../utils.js'
import { generateJWToken, authToken } from '../utils.js';
import {validateUsers} from "../utils/validateUsers.js";
import {PRIVATE_KEY} from "../.env.js";
import passport from 'passport';

//JSON Web Tokens JWT functinos:
//const PRIVATE_KEY = "CoderhouseBackendCourseSecretKeyJWT";

const router = Router();

//Registro un usuario
/* router.post('/register', 
            passport.authenticate('register', {
                failureRedirect: 'api/sessions/fail-register'
            }),
            validateUsers,  async(req,res) =>{
                console.log("Registrando usuario");
                console.log(req.body);
                res.status(201).send({ status: "success", message: "Usuario creado con extito." });
}) */
/*=============================================
=                   Passport Github           =
=============================================*/
router.get("/github", passport.authenticate('github', { scope: ['user:email'] }), async (req, res) => {
    { }
})

router.get("/githubcallback", passport.authenticate('github', { failureRedirect: '/github/error' }), async (req, res) => {
    const user = req.user;
    req.session.user = {
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        age: user.age
    };
    req.session.admin = true;
    res.redirect("/")
})



// Register
router.post('/register', passport.authenticate('register', {
    failureRedirect: 'api/sessions/fail-register'
}), async (req, res) => {
    console.log(req);
    console.log("Registrando usuario:");
    res.status(201).send({ status: "success", message: "Usuario creado con extito." });
    
})

router.get("/fail-register", (req, res) => {
    res.status(401).send({ error: "Failed to process register!" });
});


// Login del usuario con jwt sin Passport
router.post('/login', async(req, res) => {
    const {email, password } = req.body;
    console.log(email);
    console.log(password);
    try {
        const user = await usersDao.getUserbyEmail(email);
        console.log("Usuario encontrado para el login");
        console.log(user);

        if(!user){
            console.warn(`User doesn't exist with username:${email}`);
            return res.status(204).send({ status: "Not found", error: "usuario no encontrado con el email:"+email});
        }

        if (!isValidPassword(user, password)){
            console.warn("Invalid credentials for user: " +email);
            return res.status(401).send({status:"error", error:"Invalid credentials"});
        }
        const tokenUser = {
            name: `${user.first_name} ${user.last_name}`,
            email: user.email,
            edad: user.age,
            role: user.role
        }
        // IMplementamos jwt
        const access_token = generateJWToken(tokenUser);
        console.log("Access_token");
        console.log(access_token);
    
        // 1ro usando localStorage
        //res.send({message:"Login successfull" , jwt:acces_token});

        // 2do con Cookies
        res.cookie('jwtCookieToken', access_token,
            {
                maxAge: 60000,
                httpOnly: true //No se expone la cookie
               // httpOnly: false //Si se expone la cookie
            }

        )
        res.status(200).send({ message: "Login success!!" })
    }catch(error){
        console.error(error);
        return res.status(500).send({status:"error", error: "Error interno de la aplicacion"});
    }
        
} );
//Login del usuario con passport

router.get("/fail-login", (req, res) => {
    console.log("Hubo errores al realizar el login");
    res.status(401).send({ error: "Failed to process login!" });
});

router.post('/passwordreset', async(req, res) => {
    console.log(req.body);
    if (!req.body.email || !req.body.password){
        console.log("Faltan Datos!!!");
        return res.status(400).send({
            error:"Falta Datos!!!"
        })    
    }
    //buscar el usuario por el mail ingresado
    const {email, password } = req.body;
    const user = await usersDao.getUserbyEmail(email);
    user.password = createHash(password);
    const result = await usersDao.updateUser(user._id, user);
    console.log("Resultado de la actualización");
    res.status(200).send(result);
})
export default router;  

