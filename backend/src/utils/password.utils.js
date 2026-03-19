import bcrypt from "bcryptjs";
export const GenerateHashedPass=async(password)=>{
    const salt=await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password,salt)
    return hashedPassword
}

export const verifyPass=async(regularPass,hashedPassword)=>{
    const ismatch=await bcrypt.compare(regularPass,hashedPassword);
    return ismatch;
}