import passport from 'passport';
//import userModel from '../models/user.model.js';
import userSevice from "../daos/dbManager/users.dao.js";
import GitHubStrategy from "passport-github2";
import jwtStrategy from 'passport-jwt';
import passportLocal from 'passport-local';
import {  createHash } from '../utils.js';
import {PRIVATE_KEY}  from  "../.env.js";

const localStrategy = passportLocal.Strategy;

const JwtStrategy = jwtStrategy.Strategy;
const ExtractJWT = jwtStrategy.ExtractJwt;

const initializePassport = () => {
    //Estrategia de obtener Token JWT por Cookie:
    passport.use('jwt', new JwtStrategy(
        {
            jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
            secretOrKey: PRIVATE_KEY
        }, async (jwt_payload, done) => {
            console.log("Entrando a passport Strategy con JWT.");
            try {
                console.log("JWT obtenido del Payload");
                console.log(jwt_payload);
                return done(null, jwt_payload.user)
            } catch (error) {
                return done(error)
            }
        }
    ));

    // Usando GitHub
    passport.use('github', new GitHubStrategy(
        {
            clientID: 'Iv1.dba638ea20862968',
            clientSecret: '3798abaa71634c7b427288d54526bf97c1a9dadb',
            callbackUrl: 'http://localhost:8090/api/sessions/githubcallback'
        },
        async (accessToken, refreshToken, profile, done) => {
            console.log("Profile obtenido del usuario de GitHub: ");
            console.log(profile);
            try {
                //Validamos si el user existe en la DB
                const email = profile._json.email
                const user = await userSevice.getUserbyEmail(email);
                console.log("Usuario encontrado para login:");
                console.log(user);
                if (!user) {
                    console.warn("User doesn't exists with username: " + profile._json.email);
                    let newUser = {
                        first_name: profile._json.name,
                        last_name: '',
                        age: 57,
                        email: profile._json.email,
                        password: '',
                        loggedBy: "GitHub"
                    }
                    const result = await userSevice.createUser(newUser);
                    return done(null, result)
                } else {
                    // Si entramos por aca significa que el user ya existe en la DB
                    return done(null, user)
                }

            } catch (error) {
                return done(error)
            }
        }
    ))


    passport.use('register', new localStrategy(
        // passReqToCallback: para convertirlo en un callback de request, para asi poder iteracturar con la data que viene del cliente
        // usernameField: renombramos el username
        { passReqToCallback: true, usernameField: 'email' },
        async (req, username, password, done) => {
            const { first_name, last_name, email, age } = req.body;
            try {
                //Validamos si el user existe en la DB
                const exist = await userSevice.getUserbyEmail( email);
                if (exist) {
                    console.log("El user ya existe!!");
                    done(null, false)
                }

                const user = {
                    first_name,
                    last_name,
                    email,
                    age,
                    // password //se encriptara despues...
                    password: createHash(password),
                    loggedBy: 'form',
                    role:"user"
                }
                const result = await userSevice.createUser(user);
                console.log(result);
                // Todo sale ok
                return done(null, result)
            } catch (error) {
                return done(error)
            }
        }
    ));

    //Funciones de Serializacion y Desserializacion
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            let user = await userSevice.getUserById(id);
            done(null, user);
        } catch (error) {
            console.error("Error deserializando el usuario: " + error);
        }
    });
};

const cookieExtractor = req => {
    let token = null;
    console.log("Entrando a Cookie Extractor");
    if (req && req.cookies) {//Validamos que exista el request y las cookies.
        console.log("Cookies presentes: ");
        console.log(req.cookies);
        token = req.cookies['jwtCookieToken']
        console.log("Token obtenido desde Cookie:");
        console.log(token);
    }
    return token;
};

export default initializePassport;
