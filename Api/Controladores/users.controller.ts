import { Request, Response } from 'express';
// Modelo
import User from '../Modelos/User';


export default class UserController 
{
    constructor() {}

    public async Test( req: Request, res: Response)
    {
        const foundUser = await User.findOne ({ "email" : req.body.email });

        return res.json({data: foundUser});

    }
    public async Add( req : Request, res: Response )
    {

        // Primero analizamos si el nombre de usuario o correo ya han sido registrado
        const foundEmail = await User.findOne ({ email : req.body.email });
        const foundUsername = await User.findOne ({ username : req.body.username });

        // Segundo, realizamos la validación
        if( foundEmail !== null)
            return res.status(400).json({campo: "email", message: "Email en uso"});

        else if( foundUsername !== null)
            return res.status(400).json({campo: "username", message: "Usuario en uso"});

        // Si pasa las valiaciones sin problema, creamos el usuario.
        var Modelo = new User(req.body);

        Modelo.save( (error: Error, documento: User ) =>
        {
            if(error)
                return res.status(400).json({ message: "Ocurrió un error inesperado" });
            else
                return res.status(200).json(documento);
        });
    }

    public async Get( req : Request, res: Response )
    {
        // cuando son solicitudes de tipo: GET. 
        // Se debe usar params, no body
        let UserID : String = req.params.UserID;
        const Query = await User.findById(UserID);

        if( Query != null)
            return res.status(200).send(Query);
        else
            return res.status(400).send({message: "No existe"});
    }

    public async GetInfo( req : Request, res: Response )
    {
        // cuando son solicitudes de tipo: GET. 
        // Se debe usar params, no body
        let UserID : String = req.params.UserID;

        const Query = await User.findById(UserID);
        
        let UserInfo = {
            id: Query._id,
            lastname: Query.lastname,
            firstname: Query.firstname,
            usuario: Query.username
        }

        if( Query != null)
            return res.status(200).send(UserInfo);
        else
            return res.status(400).send({message: "No existe"});
    }

    public List( req : Request, res: Response )
    {
        User.find({}, ( error: Error, Docs : User[]) =>
        {
            if( error )
                return res.send(400);
            else
                return res.send(Docs);
        });
    }
}
