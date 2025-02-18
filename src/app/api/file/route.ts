
import { NextRequest, NextResponse } from "next/server";

import clientPromise from "@/lib/db";

const client = await clientPromise;
const db = client.db("PrintEase");
const FileCollection = db.collection("File");
const UserCollection = db.collection("users");

export async function POST(req:NextRequest){
    const {userId,link,color,orientation,sided,remarks,copies,specificRange,pagesToPrint} =await req.json();
    try{
       const user = UserCollection.find({_id:userId});
       if(!user){
        return NextResponse.json(
            {message:"No user exists with given id"},
            {status:500}
        )
       }

    const res = await FileCollection.insertOne({
        userId:userId,
        link:link,
        color:color,
        orientation:orientation,
        sided:sided,
        remarks:remarks,
        copies:copies,
        specificRange:specificRange,
        pagesToPrint:pagesToPrint
    });

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