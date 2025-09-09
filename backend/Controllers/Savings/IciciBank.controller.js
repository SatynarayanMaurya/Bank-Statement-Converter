const pdfParse = require('pdf-parse');

exports.IciciBankController = async (req, res) => {

  try {
    const file = req.files?.pdfInput;
    if (!file) return res.status(400).json({ error: "No PDF uploaded." });

    const dataBuffer = file.tempFilePath; // NOTE: use file.data instead of tempFilePath for express-fileupload
    const parsed = await pdfParse(dataBuffer);
    const lines = parsed.text.split('\n').map(line => line.trim()).filter(Boolean);
    // console.log("Lines : ",lines)

    const transactions = [];
    const groupedLines = [];

    let currentGroup = [];

    for (const line of lines) {
      const dateMatch = line.match(/^(\d{2}-\d{2}-\d{4})/);
      if (dateMatch) {
        if (currentGroup.length > 0) groupedLines.push(currentGroup);
        currentGroup = [line];
      } else if (currentGroup.length > 0) {
        currentGroup.push(line);
      }
    }
    if (currentGroup.length > 0) groupedLines.push(currentGroup);
    // console.log("Group lines : ",groupedLines)

    function cleanFooterText(text) {
        return text
            .replace(/This is a system-generated statement.*?Page \d+/gi, '')
            .replace(/Account Number:\d+/gi, '')
            .replace(/Transaction date\s*:?\s*From .*?To .*?$/gi, '')
            .replace(/Page \d+/gi, '')
            .trim();
    }

    for (const group of groupedLines) {
        const fullText = group.join(' ').replace(/\s+/g, ' ').trim();
        // console.log("FUll text : ",fullText)

        // 1. Extract date
        const dateMatch = fullText.match(/^(\d{2}-\d{2}-\d{4})/);
        if (!dateMatch) continue;

        const date = dateMatch[1];

        // Remove date from rest of the string
        let rest = fullText.replace(date, '').trim();
            rest = cleanFooterText(rest);


        // 2. Extract type (CR or DR)
        const typeMatch = rest.match(/\b(CR|DR)\b$/);
        if (!typeMatch) continue;

        const type = typeMatch[1] === 'CR' ? 'CR' : 'DR';

        // 3. Extract amount (just before CR/DR)
        const amountMatch = rest.match(/(\d+\.\d{2})\s+(CR|DR)$/);
        if (!amountMatch) continue;

        const amountStr = amountMatch[1];
        const amount = parseFloat(amountStr);

        // 4. Extract narration (everything before amount)
        const narrationEndIndex = rest.lastIndexOf(amountStr);
        const narration = rest.substring(0, narrationEndIndex).trim();

        transactions.push({
            date,
            description:narration,
            amount,
            type,
        });
    }

    console.log("Transactions : ",transactions?.slice(12,15))


    return res.status(200).json({ data: transactions });

  } catch (error) {
    console.error("❌ Error parsing PDF:", error);
    return res.status(500).json({ error: error?.message });
  }
};
