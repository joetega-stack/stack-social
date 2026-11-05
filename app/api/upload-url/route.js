import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs"

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY
)

const BUCKET = process.env.SUPABASE_BUCKET || "file_upload"

const allowedTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
])

export async function POST(req) {
  try {
    const body = await req.json()
    const { fileName, fileType, type } = body
    
    if (!fileName || !fileType) {
      return NextResponse.json(
        { error: "Missing file data" },
        {status:400}
      )
    }

    if (!allowedTypes.has(fileType)) {
      return NextResponse.json(
        { error: "Unsupported image type" },
        {status: 400}
      )
    }

    const extensionByType = {
      "image/jpeg":"jpg",
      "image/png":"png",
      "image/webp":"webp",
      "image/gif":"gif",
    }

    const folderByType = {
      profile_image:"profiles",
      cover_image:"covers",
      post:"posts",
    }

    const folder = folderByType[type] || "uploads";
    const extension = extensionByType[fileType]
    const path = `${folder}/${randomUUID()}.${extension}`

    const { data, error } = await supabase.storage.from(BUCKET).createSignedUploadUrl(path)
    
    if (error) {
      console.error("Supabase signed upload error:", error.message)

      return NextResponse.json(
        { error: "Failed to create upload permission" },
        {status:500}
      )
    }

    return NextResponse.json({
      path: data.path,
      token: data.token
    })


  } catch (err) {
    console.error("Upload URL API error", err)
    
    return NextResponse.json(
      { error: "Internal server error" },
      {status:500}
    )
  }
  
}