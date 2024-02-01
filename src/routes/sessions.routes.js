import { Router } from "express";
import __dirname from "../utils.js";
import usersDao from "../daos/dbManager/users.dao.js";
import { createHash, isValidPassword } from '../utils.js'
import {validateUsers} from "../utils/validateUsers.js";
import passport from 'passport';


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
    res.redirect("/ghproducts")
})



// Register
router.post('/register', passport.authenticate('register', {
    failureRedirect: 'api/sessions/fail-register'
}), async (req, res) => {
    console.log("Registrando usuario:");
    res.status(201).send({ status: "success", message: "Usuario creado con extito." });
})

router.get("/fail-register", (req, res) => {
    res.status(401).send({ error: "Failed to process register!" });
});

//Login del usuario
router.post('/login', 
     passport.authenticate('login',
        {
            failureRedirect: 'api/sessions/fail-login'
        }), 
        async (req, res) => {
    console.log(req.body);
    const {username, password, email} = req.body;
    /* if (username !=='pepe' || password !=='pepepass'){
        return res.send("Login failed");
    } */
    if (email ==='adminCoder@coder.com' || password ==='adminCod3r123'){
        req.session.user = {
            name: `Administrador`,
            email: email,
            age: 0,
            role:"Admin"
        }
        
    }else{
        const user = await usersDao.getUserbyEmail(email);
        if (!user) return res.status(401).send({ status: 'error', error: "Incorrect credentials" })
        if (!isValidPassword(user, password)) {
            return res.status(401).send({ status: "error", error: "Incorrect credentials" })
        }

        
        req.session.user = {
            name: `${user.first_name} ${user.last_name}`,
            email: user.email,
            age: user.age,
            role:"usuario"
        } 
    }
    console.log("Datos de la session");
    console.log(req.session.user);
    res.send({ status: "success", payload: req.session.user, message: "¡Primer logueo realizado! :)" });
    /* console.log(user);
    req.session.user = username
    req.session.admin = true
    //res.send("login success!")
    console.log(req.session);
    res.redirect('/home'); */
})

router.get("/fail-login", (req, res) => {
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

