
import { NextRequest, NextResponse } from "next/server";

import clientPromise from "@/lib/db";

const client = await clientPromise;
const db = client.db("PrintEase");
const FileCollection = db.collection("File");
const UserCollection = db.collection("users");

// Ensure indexes exist (safe to call repeatedly)
try{
    await FileCollection.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
    await FileCollection.createIndex({ userId: 1, state: 1 });
}catch(e){
    // ignore index creation errors in runtime
}

export async function POST(req:NextRequest){
        const {userId,link,publicId,checksum,state,uploadedAt,expiresAt,color,orientation,sided,remarks,copies,specificRange,pagesToPrint,idempotency_key} =await req.json();
    try{
       const user = UserCollection.find({_id:userId});
       if(!user){
        return NextResponse.json(
            {message:"No user exists with given id"},
            {status:500}
        )
       }

        // If idempotency_key provided, return existing doc to avoid duplicates
        if(idempotency_key){
            const existing = await FileCollection.findOne({ userId: userId, idempotency_key: idempotency_key });
            if(existing){
                return NextResponse.json(
                    { message: "Document already exists", id: existing._id },
                    { status: 200 }
                );
            }
        }

        const doc: any = {
        userId: userId,
        link: link,
        publicId: publicId,
        color: color,
        orientation: orientation,
        sided: sided,
        remarks: remarks,
        copies: copies,
        specificRange: specificRange,
        pagesToPrint: pagesToPrint,
        checksum: checksum || null,
        state: state || 'uploaded',
        uploadedAt: uploadedAt ? new Date(uploadedAt) : new Date(),
        expiresAt: expiresAt ? new Date(expiresAt) : null,
                idempotency_key: idempotency_key || null,
        failure_reason: null,
        failure_code: null,
        retry_count: 0
    };

    const res = await FileCollection.insertOne(doc);

    return NextResponse.json(
        { message: "Document created successfully", id: res.insertedId },
        { status: 201 }
      );
    }
    catch(e:unknown){
        return NextResponse.json(
            {message:"some error while creating file instance"},
            {status:500}
        )
    }

}