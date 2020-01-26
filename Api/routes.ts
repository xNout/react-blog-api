import { Router, Request, Response } from 'express';
// tambien se debe instalar: @types/multer
import multer from 'multer';
import fs from 'fs';
// necesario para saber la extension de los archivos
import mime from 'mime';

// Controladores
import UsersController from './Controladores/users.controller';
import AuthController from './Controladores/auth.controller';
import ArticleController from './Controladores/articles.controller';



class Routes 
{
    public Enrutador : Router;
    private UserController : UsersController;
    private AuthenticationController : AuthController;
    private ArticleController : ArticleController;
    private UploadDir : string = 'uploads';
    private MulterUpload : multer.Instance;

    constructor()
    {
        this.UserController = new UsersController();
        this.AuthenticationController = new AuthController();
        this.ArticleController = new ArticleController();

        
        CreateDir(this.UploadDir);
        CreateDir(this.UploadDir + "/images");
        this.MulterUpload = multer({storage: this.MulterStorage()});

        this.Enrutador = Router();

        this.addRoutes();
    }

    

    private MulterStorage()
    {
        return multer.diskStorage({
            destination: ( req, file, cb) => {
                let dir = this.UploadDir;
                if( HavePartialStr(file.mimetype, "image"))
                    dir += "/images";

                cb(null, dir)
            },
            filename: ( req, file, cb) => {
                // al parecer getExtension no sirve
                cb(null, `${file.fieldname}-${Date.now()}.${mime.extension(file.mimetype)}`)
            }
        });
    }

    private addRoutes()
    {
        this.UsersRoutes();
        this.AddAuthRoutes();
        this.AddArticleRoutes();
    }

    private UsersRoutes()
    {
        this.Enrutador.route('/users')
            .post( this.UserController.Add )
            .get( this.UserController.List );

        this.Enrutador.route('/usrinfo/:UserID')
            .get( this.UserController.GetInfo );
    }

    private AddArticleRoutes()
    {
        this.Enrutador.route('/articles')
            .get( this.ArticleController.List )
            .post( this.MulterUpload.single('image'), this.ArticleController.Add );

        this.Enrutador.route('/article/:ArticleID')
            .get( this.ArticleController.Get );

        this.Enrutador.route('/article/search/:SearchStr')
            .get( this.ArticleController.Search );

        this.Enrutador.route('/article/image/:ArticleID')
            .get( this.ArticleController.GetArticleImage );
    }
    

    private AddAuthRoutes()
    {
        this.Enrutador.route('/auth')
            .post( this.AuthenticationController.LogIn );
    
        this.Enrutador.route('/auth/validate')
            .post( this.AuthenticationController.ValidateToken );

        this.Enrutador.route('/logout')
            .post( this.AuthenticationController.LogOut );
    }

}

const HavePartialStr = ( tString : string, sub_str : string) => tString.indexOf(sub_str) !== -1;
function CreateDir(dir : string)
{
    if( ! fs.existsSync(dir))
        fs.mkdirSync(dir);
}


module.exports = new Routes().Enrutador;