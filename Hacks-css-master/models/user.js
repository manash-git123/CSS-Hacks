const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        name: {
            type: String
        },
        email: {
            type: String,
            unique: true
        },
        password: {
            type: String
        },
        active: { 
            type: Boolean, 
            default: false, 
        },
        created_at: {
            type: Date,
            required: true,
            default: Date.now 
        },
        phone: {
            type: String
        }
    },
    {
        timestamps: true
    }
)

module.exports = User = mongoose.model("User", userSchema);