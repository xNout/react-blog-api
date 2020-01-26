import mongoose, { Schema } from 'mongoose';

const UserTokenSchema = new Schema(
    {
        UserID: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        },
        LogInDate: {
            type: Date,
            default: Date.now
        }
    }
);

module.exports = mongoose.model( 'UserToken', UserTokenSchema);