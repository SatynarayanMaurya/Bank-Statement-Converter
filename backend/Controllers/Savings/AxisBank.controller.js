const pdfParse = require('pdf-parse');

exports.axisBankController = async (req, res) => {

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

    let prevBalance = null;

    for (const group of groupedLines) {
    const fullText = group.join(' ').replace(/\s+/g, ' ');
    //   console.log("Full text:", fullText);

    // 1. Extract date
    const dateMatch = fullText.match(/^(\d{2}-\d{2}-\d{4})/);
    if (!dateMatch) continue;

    const date = dateMatch[1];
    let rest = fullText.replace(date, '').trim();
    //   console.log("Rest part is : ",rest)

    const amountBalanceRegex =  /(\d+\.\d{2})\s+(\d+\.\d{2})\d*/;



    const amountMatch = rest.match(amountBalanceRegex);
    //   console.log("Amount match : ",amountMatch)
    if (!amountMatch) continue;

    const [matchStr, amountStr, balanceStr] = amountMatch;
    //   const amount = parseFloat(amountStr.replace(/,/g, ''));
    //   const balance = parseFloat(balanceStr.replace(/,/g, ''));

    const amount = parseFloat(amountStr);      
    const balance = parseFloat(balanceStr); 

    // 3. Extract narration (everything before amount)
    const narrationEndIndex = rest.indexOf(amountStr);
    const narration = narrationEndIndex !== -1 ? rest.substring(0, narrationEndIndex).trim() : "";

    // 4. Determine type
    let type = "credit";
    if (prevBalance !== null) {
        type = balance > prevBalance ? "credit" : "debit";
    }

    prevBalance = balance;

    transactions.push({
        date,
        narration,
        amount,
        type,
        balance
    });
    }

    console.log("Transactions : ",transactions?.slice(12,15))


    return res.status(200).json({ data: transactions });

  } catch (error) {
    console.error("❌ Error parsing PDF:", error);
    return res.status(500).json({ error: error?.message });
  }
};
