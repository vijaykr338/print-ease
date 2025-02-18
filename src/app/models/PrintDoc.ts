import mongoose, {Schema, Document} from "mongoose";
import UserProfileModel from "./UserProfile";
import FileModel from "./File";
import StoreModel from "./Store";


export interface PrintDoc extends Document{
    userID: mongoose.Types.ObjectId;
    fileID: mongoose.Types.ObjectId[];
    storeID: mongoose.Types.ObjectId;
    status: 'pending' | 'completed' | 'collected';
    type: string;
    cost: number;
    createdAt: Date;
    paymentId:string;
}

const PrintDocSchema: Schema<PrintDoc> = new Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", 
        required: true,
    },
    fileID: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "File", 
        required: true,
    },
    storeID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Store", 
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    cost: {
        type: Number,
        required: true,
    },
    createdAt:{
        type: Date,
        default : Date.now(),
        required:true
    },
    paymentId:{
        type:String,
        required : true
    }
})

const PrintDocModel = (mongoose.models.PrintDoc as mongoose.Model<PrintDoc>) || mongoose.model<PrintDoc>("PrintDoc", PrintDocSchema)

export default PrintDocModel;