import mongoose from 'mongoose';

import UserModel from './Modelos/User';

class Database 
{
    private DB_HOST : string = "mongodb://localhost:27017/blog";


    private Seed( ) : void
    {
        var Usuario = new UserModel({
            name: 'Eduardo Jimenez',
            email: "eduardo.ji@gmail.com",
            username: "eduardo",
            password: "eduardo123"
        });


        Usuario.save( (error : Error, documento : UserModel ) =>
        {
            if(error)
                console.log(`Ocurrio un error en el seed: ${error}`);
        });

        console.log("Semillas insertadas");
    }

    public TryConnect() : void
    {
        mongoose.connect(this.DB_HOST, {useNewUrlParser: true, useUnifiedTopology: true}, (error : Error ) => {
            if(error)
            {
                console.log("Error en la conexión a la base de datos");
                console.log(error);
            }
                
            else
            {
                console.log("Base de datos funcionando...");

                // this.Seed( );
            }
                
        });
    }
}

export default new Database();