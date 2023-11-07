import { NextRequest, NextResponse} from "next/server";
import { writeFile } from "fs";

export async function POST(request: NextRequest): Promise<NextResponse> {
    try {
        const data = await request.formData()
        const file: File | null = data.get('file') as unknown as File
        if (!file) {
            return NextResponse.json({ success: false, message: "Request must have a file"}, { status: 400 })
        } else {
            const bytes = await file.arrayBuffer()
            const buffer = Buffer.from(bytes)
            const path = './' + file.name
            writeFile(path, buffer,(err) => {
                if (err){
                    return NextResponse.json({ success: false, message: "Failed to process SRT" }, { status: 500 })
                }
                console.log(`open ${path} to see the uploaded file`)
            })
            return NextResponse.json({ success: true, message: "SRT Uploaded" }, { status: 201 })
        }
    } catch (e: any) {
        const errorMessageParsed: string = e.message.split(": ")
        return NextResponse.json({ success: false, message: errorMessageParsed[1]}, { status: 400 })
    }
}