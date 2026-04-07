import { uploadFilesWorkflow } from "@medusajs/core-flows"
import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { MedusaError } from "@medusajs/framework/utils"
import path from "path"
import sharp from "sharp"

type UploadedFile = {
  originalname: string
  mimetype: string
  buffer: Buffer
}

const MAX_TARGET_BYTES = 900 * 1024

const shouldCompress = (file: UploadedFile) => {
  if (!file.mimetype?.startsWith("image/")) {
    return false
  }

  // SVG and GIF are skipped to avoid breaking vector/animated assets.
  if (file.mimetype === "image/svg+xml" || file.mimetype === "image/gif") {
    return false
  }

  return true
}

const renderWebp = async (buffer: Buffer, quality: number) => {
  return sharp(buffer)
    .rotate()
    .resize({
      width: 1920,
      height: 1920,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality })
    .toBuffer()
}

const compressImageIfNeeded = async (file: UploadedFile) => {
  if (!shouldCompress(file)) {
    return {
      filename: file.originalname,
      mimeType: file.mimetype,
      content: file.buffer.toString("base64"),
    }
  }

  try {
    let quality = 82
    let compressed = await renderWebp(file.buffer, quality)

    while (compressed.length > MAX_TARGET_BYTES && quality > 42) {
      quality -= 8
      compressed = await renderWebp(file.buffer, quality)
    }

    // If compression is not materially better, keep original file.
    if (compressed.length >= file.buffer.length * 0.98) {
      return {
        filename: file.originalname,
        mimeType: file.mimetype,
        content: file.buffer.toString("base64"),
      }
    }

    const baseName = path.parse(file.originalname).name.replace(/\s+/g, "-")

    return {
      filename: `${baseName}.webp`,
      mimeType: "image/webp",
      content: compressed.toString("base64"),
    }
  } catch {
    // Fallback to original when sharp can't decode file.
    return {
      filename: file.originalname,
      mimeType: file.mimetype,
      content: file.buffer.toString("base64"),
    }
  }
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const input = (((req as any).files as UploadedFile[] | undefined) ?? [])

  if (!input.length) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, "No files were uploaded")
  }

  const files = await Promise.all(input.map(compressImageIfNeeded))

  const { result } = await uploadFilesWorkflow(req.scope).run({
    input: {
      files: files.map((f) => ({
        filename: f.filename,
        mimeType: f.mimeType,
        content: f.content,
        access: "public",
      })),
    },
  })

  res.status(200).json({ files: result })
}
