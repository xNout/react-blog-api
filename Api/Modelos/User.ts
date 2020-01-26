import mongoose, { Schema } from 'mongoose';

const UserSchema = new Schema(
    {
        lastname: {
            type: String,
            required: true
        },
        firstname: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        username: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        }
    }
);

module.exports = mongoose.model( 'User', UserSchema);