import { NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { r2 } from "@/lib/r2";
import { error } from "node:console";

export async function POST(req) {
  try {
    const body = await req.json()

    if (!body.fileName || !body.fileType) {
      return NextResponse.json(
        { error: "Missing file data" },
        {status:400}
      )
    }

    const key = `uploads/${Date.now()}-${body.fileName}`

    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
      ContentType: body.fileType
    })

    const url = await getSignedUrl(r2, command, { expiresIn: 60 })
    
    return NextResponse.json({url,key})

  } catch (err) {
    console.error("API ERROR", err)
    
    return NextResponse.json(
      { error: "Internal server error" },
      {status:500}
    )
  }
  
}