import { Request, Response } from 'express';

// Modelos
import UserModel from '../Modelos/User';
import UserToken from '../Modelos/UserToken';

// Utiles
import GenerateToken from '../Infraestructura/token-generator';

export default class Auth 
{
    public async LogIn (req : Request, res : Response) 
    {
        let Username : String = req.body.usr;
        let Password : String = req.body.pwd;

        const foundUser = await UserModel.findOne ({username: Username});

        if( foundUser === undefined || foundUser === null)
            return res.status(400).json({message: "Usuario no existe"});
  
        else if( foundUser.password !== Password)
            return res.status(400).json({message: 'La Contraseña no coincide'})  
        
        let UserID : String = foundUser._id;

        // Antes de iniciar una nueva sesión, se debe eliminar las anteriores.
        await UserToken.deleteMany({ UserID: UserID });

        // La sesión va a tener un token que se guardará en el cookie del cliente
        // y a su vez en el servidor
        let Token = GenerateToken();

        let Model = {
            UserID: UserID,
            token: Token,
        }

        new UserToken(Model).save();

        return res.status(200).json(Model);
    }

    public async ValidateToken (req : Request, res : Response) 
    {
        let UserId : String = req.body.UserID;
        let Token : String = req.body.token;

        const foundToken = await UserToken.findOne ({UserID: UserId});

        if( foundToken === undefined || foundToken === null)
            return res.status(400).json({action: "NO_USER_TOKEN"});

        if( foundToken.token !== Token)
            return res.status(400).json({action: "TOKEN_INCORRECT"});
        
        return res.status(200).json({action: "VALID_SESSION"});
    }

    public async LogOut ( req : Request, res : Response)
    {
        const { UserID } = req.body;

        UserToken.deleteOne({ UserID: UserID }, function (err : Error) {
            if (err) return res.status(400).json({message: err});

            return res.status(200).json({message: "OK"});
          });
    }

}