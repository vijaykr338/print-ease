import mongoose, {Schema} from "mongoose";
import { Config } from "@/interfaces";

export interface File extends Omit<Config,'totalPrice'>{
    userID: mongoose.Types.ObjectId;
    link: string;
    publicId?: string;
    checksum?: string;
    state?: 'draft'|'uploading'|'uploaded'|'expired'|'failed';
    uploadedAt?: Date;
    expiresAt?: Date;
    failure_reason?: string;
    failure_code?: string;
    retry_count?: number;
    idempotency_key?: string;
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
    },
    publicId: {
        type: String,
        required: false,
    },
    checksum: {
        type: String,
        required: false,
    },
    state: {
        type: String,
        enum: ["draft","uploading","uploaded","expired","failed"],
        default: "draft",
    },
    uploadedAt: {
        type: Date,
        required: false,
    },
    expiresAt: {
        type: Date,
        required: false,
    },
    failure_reason: {
        type: String,
        required: false,
    },
    failure_code: {
        type: String,
        required: false,
    },
    retry_count: {
        type: Number,
        default: 0,
    },
    idempotency_key: {
        type: String,
        required: false,
    }
})

// Indexes for cleanup and querying
FileSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
FileSchema.index({ userID: 1, state: 1 });

const FileModel = (mongoose.models.File as mongoose.Model<File>) || mongoose.model<File>("File", FileSchema)
export default FileModel;