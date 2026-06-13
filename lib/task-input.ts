const audioExtensions = /\.(mp3|mp4|mpeg|mpga|m4a|wav|webm)$/i;
const maxAudioUploadBytes = 25 * 1024 * 1024;

function isAudioVideoFile(file: File, lowerName: string) {
  return audioExtensions.test(lowerName) || file.type.startsWith("audio/") || file.type.startsWith("video/");
}

async function transcribeAudioFile(file: File) {
  if (!process.env.OPENAI_API_KEY) {
    return {
      extractionError: "Audio transcription is not configured. Please set OPENAI_API_KEY in Vercel, then redeploy."
    };
  }

  if (file.size > maxAudioUploadBytes) {
    return {
      extractionError: "Audio file is larger than 25MB. Please upload a shorter or compressed recording."
    };
  }

  const formData = new FormData();
  formData.append("file", file, file.name);
  formData.append("model", process.env.LINKORNA_TRANSCRIBE_MODEL || "gpt-4o-mini-transcribe");
  formData.append("response_format", "text");
  formData.append(
    "prompt",
    "This is a business meeting recording for cross-border trade, supplier negotiation, sales, procurement, contract, logistics, ecommerce, German, English or Chinese business communication. Preserve names, dates, prices, quantities, action items and decisions."
  );

  const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: formData,
    signal: AbortSignal.timeout(90000)
  });

  const text = await response.text();

  if (!response.ok) {
    return {
      extractionError: `Audio transcription failed: ${text.slice(0, 300)}`
    };
  }

  return {
    extractedText: text.trim().slice(0, 60000),
    extractionMode: "audio-transcription"
  };
}

export async function extractFileValue(file: File) {
  const base = {
    name: file.name,
    size: file.size,
    type: file.type
  };

  try {
    const lowerName = file.name.toLowerCase();

    if (isAudioVideoFile(file, lowerName)) {
      return { ...base, ...(await transcribeAudioFile(file)) };
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    if (lowerName.endsWith(".docx")) {
      const mammoth = await import("mammoth");
      const result = await mammoth.extractRawText({ buffer });
      return { ...base, extractedText: result.value.slice(0, 30000) };
    }

    if (lowerName.endsWith(".pdf")) {
      const { PDFParse } = await import("pdf-parse");
      const parser = new PDFParse({ data: buffer });
      const result = await parser.getText();
      await parser.destroy();
      return { ...base, extractedText: result.text.slice(0, 30000) };
    }

    const text = buffer.toString("utf8");
    return { ...base, extractedText: text.slice(0, 30000) };
  } catch (error) {
    console.error("File extraction failed", error);
    return {
      ...base,
      extractionError: "Could not extract file content. Ask the user to upload a supported audio, DOCX, TXT or readable PDF file, or paste the relevant text."
    };
  }
}

export async function formDataToInput(formData: FormData) {
  const input: Record<string, unknown> = {};

  for (const [key, item] of Array.from(formData.entries())) {
    if (key.startsWith("$ACTION_")) continue;

    const addValue = (value: unknown) => {
      if (input[key] === undefined) {
        input[key] = value;
        return;
      }
      input[key] = Array.isArray(input[key]) ? [...input[key], value] : [input[key], value];
    };

    if (item instanceof File) {
      if (item.name) {
        addValue(await extractFileValue(item));
      }
      continue;
    }

    addValue(item);
  }

  return input;
}
