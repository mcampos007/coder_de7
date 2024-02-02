import  {Schema, model} from "mongoose";

const userCollection = "users";

const userSchema = new Schema({
    first_name: {
    type: String,
    required: true
    },
    last_name: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    age: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: false
    },
    cart: {
        type: Schema.Types.ObjectId,
        ref: 'Cart'
      },
    loggedBy: {
    type: String,
    required: false,
    },
    role: {
        type: String,
        enum: ["user", "premium", "admin"],
        default: "user", // Valor por defecto "user"
        required: true
    }
});

userSchema.pre('find', function(){
   this.populate('users')
})

const userModel = model(userCollection, userSchema);

export default userModel ;