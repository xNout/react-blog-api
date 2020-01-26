import Article from '../Modelos/Article';
import User from '../Modelos/User';

import { Request, Response } from 'express';

import fs from 'fs';
import mime from 'mime-types';

import { Config } from '../config';


async function CountByCategory( Categoria : string)
{
    return await Article.countDocuments({Categoria: Categoria});
}

async function GetAuthorModel( AuthorID : string )
{
    let Author = await User.findById(AuthorID);
    if( Author === undefined || Author === null)
        Author = {
            _id: "_",
            username: "anonimo"
        }
    
    let nombres_author = 'Anonimo';
    if( Author.firstname !== undefined || Author.lastname !== undefined)
        nombres_author = `${Author.firstname} ${Author.lastname}`;

    return {
        id: Author._id,
        nombres: nombres_author,
        usuario: Author.username
    }
}

async function GetModel ( Articulo : Article )
{
    return {
        id: Articulo._id,
        titulo: Articulo.Titulo,
        categoria: Articulo.Categoria,
        fecha: Articulo.PostDate,
        contenido: Articulo.Contenido,
        author: await GetAuthorModel(Articulo.AuthorID)
    }
}
    
export default class ArticleController
{
    public Add( req : Request, res: Response )
    {
        const file = req.file;
        
        const { titulo, categoria, contenido, AuthorID } = req.body;

        let Modelo = new Article({
            AuthorID: AuthorID,
            Categoria: categoria,
            ImageUri: file.path,
            Titulo: titulo,
            Contenido: contenido.split(/\n/g)
        });

        Modelo.save( (error: Error, Documento : Article) => 
        {
            if(error)
                return res.status(400).json({message: error});
            
            return res.status(200).json(Documento);

        });
    }

    public async Get( req : Request, res: Response )
    {
        // Cuando son urls de este tipo: http://localhost:3535/api/article/5e116707d623542d34ebbd89
        // se debe usar params
        const { ArticleID } = req.params;
        try{
            let Articulo = await Article.findById(ArticleID);
            if( Articulo === undefined || Articulo === null)
                return res.status(400).send({message: "No existe"});

            const Modelo = await GetModel(Articulo);
            return res.status(200).send(Modelo);
        }
        catch ( err )
        {
            return res.status(400).send({message: "No existe"});
        }
            
    }

    public async Search( req : Request, res: Response )
    {
        const { SearchStr } = req.params;
        try{
            // Busquedas con texto parcial
            let Articulos = await Article.find( { Titulo : { $regex: SearchStr, $options: "i" } }).limit(10);

            let NArticles = Array.from( Articulos, (Articulo : Article, _ ) => {
                return {
                    _id: Articulo._id,
                    titulo: Articulo.Titulo,
                    resumen: Articulo.Contenido[0]
                }
            } )
            return res.status(200).send(NArticles);
        }
        catch ( err )
        {
            return res.status(200).send([]);
        }
    }

    public async GetArticleImage( req : Request, res: Response )
    {
        let Articulo = await Article.findById(req.params.ArticleID);

        if( Articulo === undefined || Articulo === null)
            return res.status(400).send({message: "No existe"});

        let imagen = fs.readFileSync(Articulo.ImageUri); 
        let c_type = mime.lookup(Articulo.ImageUri);
        
        return res.contentType(c_type).send(imagen);
    }

    public async List( req : Request, res: Response )
    {
        // Cuando son urls con parámetros de este tipo: http://localhost:3535/api/articles?Categoria=Noticias&Pagina=1
        // se debe usar query
        const { Pagina, Categoria } = req.query;

        try{
            let TotalPaginas = Math.ceil(await CountByCategory(Categoria) / Config.ItemsPerPage);

            let Articles = await Article.find({Categoria: Categoria})
            .sort({PostDate: 'descending'})
            .skip(( Pagina - 1 ) * Config.ItemsPerPage)
            .limit(Config.ItemsPerPage);
            
            let NewDocs : any[] = Array.from( Articles, ( Articulo : Article, _ ) => 
            {
                return {
                    _id: Articulo._id,
                    titulo: Articulo.Titulo,
                    categoria: Articulo.Categoria,
                    fecha: Articulo.PostDate,
                    contenido: Articulo.Contenido
                }
            } );


            res.status(200).send({Articulos: NewDocs, TotalPages: TotalPaginas });
        }
        catch( error )
        {
            res.status(400).json({message: "Ocurrió un eror", err: error});
        }
    }

}