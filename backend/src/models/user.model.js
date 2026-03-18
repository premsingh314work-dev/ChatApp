import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullName:{
        type: String,
        require:true,
        trim:true,
    },
    email:{
        type:String,
        require:true,
        unique: true,
        lowercase: true,
    },
    password:{
        type:String,
        require:true,
        select:false,
        minlength:6,
    },
    avatar:{
      type: String, // location of pfp.
      default:""
    },
    phone:{
      type: String,
      unique: true,
      default:null,
    },
    
},
{timestamps: true});

const User = mongoose.model('User', userSchema);

export default User;
