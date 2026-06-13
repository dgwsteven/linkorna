export async function extractFileValue(file: File) {
  const base = {
    name: file.name,
    size: file.size,
    type: file.type
  };

  try {
      const lowerName = file.name.toLowerCase();
      const buffer = Buffer.from(await file.arrayBuffer());

      if (/\.(mp3|mp4|m4a|wav|mov|avi|webm)$/i.test(lowerName) || file.type.startsWith("audio/") || file.type.startsWith("video/")) {
        return {
          ...base,
          extractionError: "Audio/video transcription is not enabled yet. Please paste or upload a readable meeting transcript."
        };
      }

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
      extractionError: "Could not extract file text. Ask the user to paste the relevant contract text."
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
