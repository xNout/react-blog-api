import mongoose, { Schema } from 'mongoose';

const ArticleSchema = new Schema(
    {
        AuthorID: {
            required: true,
            type: String
        },
        Categoria: {
            required: true,
            type: String
        },
        PostDate: {
            type: Date,
            default: Date.now
        },
        ImageUri: {
            type: String,
            required: true
        },
        Titulo: {
            required: true,
            type: String
        },
        Contenido: [{
            type: String
        }]

    }
);

module.exports = mongoose.model( 'Article', ArticleSchema);