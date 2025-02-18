import mongoose, {Schema} from "mongoose";
import { Config } from "@/interfaces";

export interface File extends Omit<Config,'totalPrice'>{
    userID: mongoose.Types.ObjectId;
    link: string;  
}

const FileSchema: Schema<File> = new Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", 
        required: true,
    },
    color: {
        type: String,
        required: true,
    },
    orientation: {
        type: String,
        required: true,
    },
    sided:{
        type:String,
        required:true,
    },
    copies: {
        type: Number,
        required: true,
    },
    remarks: {
        type: String,
        required: true,
    },
    link: {
        type: String,
        required: true,
    }
})

const FileModel = (mongoose.models.File as mongoose.Model<File>) || mongoose.model<File>("File", FileSchema)
export default FileModel;