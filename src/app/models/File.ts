
import mongoose, {Schema, Document} from "mongoose";



export interface File extends Document{
    fileID: string;
    userID: mongoose.Types.ObjectId;
    name: string;
    color: string;
    orientation: string;
    noOfCopies: number;
    remarks: string;
    link: string;
}

const FileSchema: Schema<File> = new Schema({
    fileID: {
        type: String,
        required: true,
        unique: true
    },
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", 
        required: true,
    },
    name: {
        type: String,
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
    noOfCopies: {
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