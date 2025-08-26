const {Schema, model, default: mongoose} = require("mongoose")
const { string } = require("zod/v4")

const contactSchema = new Schema({
    username: { type:string , require: true},
    email: {type:string , require: true},
    message: {type:string ,require: true},
});

const Contact = new model("Contect", contactSchema);
module.exports = Contact;