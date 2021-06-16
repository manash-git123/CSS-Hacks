const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orgSchema = new Schema(
    {
        name: {
            type: string
        },
        conact: {
            type: string
        },
        description: {
            type: string
        },
        category :{
            type: string
        }
    }
);

module.exports = Org = mongoose.model("Org",orgSchema);