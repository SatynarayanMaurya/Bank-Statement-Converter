
const pdfParse = require("pdf-parse");

exports.centralBankController = async (req, res) => {
  try {
    const file = req.files?.pdfInput;
    if (!file) return res.status(400).json({ error: "No PDF uploaded." });
    

    const dataBuffer = file.tempFilePath;
    const parsed = await pdfParse(dataBuffer);
    const lines = parsed.text.split('\n').map(line => line.trim()).filter(Boolean);
    // console.log("Lines : ",lines)

    const transactions = [];
const groupedLines = [];
let currentGroup = [];

const dualDateRegex = /^(\d{2}\/\d{2}\/\d{2})(\d{2}\/\d{2}\/\d{2})/;

for (const line of lines) {
  if (dualDateRegex.test(line)) {
    if (currentGroup.length > 0) groupedLines.push(currentGroup);
    currentGroup = [line]; // New transaction starts
  } else {
    currentGroup.push(line); // Continue current transaction
  }
}

if (currentGroup.length > 0) groupedLines.push(currentGroup);


    // console.log("GroupLines : ",groupedLines)


const headerLines = [
  'POST DateTXN DateBranch CodeCheque',
  'Number',
  'DESCRIPTIONDEBITCREDITBALANCE',
  'Page',
  '/5'
];

let previousBalance = null;

for (const group of groupedLines) {
  const cleaned = group.filter(line => {
    return !headerLines.some(h => line.includes(h)) && !/^\d+$/.test(line);
  });

  const fullText = cleaned.join(' ').replace(/\s+/g, ' ').trim();
  const dateMatch = fullText.match(/^(\d{2}\/\d{2}\/\d{2})(\d{2}\/\d{2}\/\d{2})/);
  if (!dateMatch) continue;

  const postDate = dateMatch[1];
  const txnDate = dateMatch[2];
  let rest = fullText.replace(dateMatch[0], '').trim();

  const amtBalRegex = /(\d+\.\d{2})(\d+\.\d{2})$/;
  const amtBalMatch = rest.match(amtBalRegex);
  if (!amtBalMatch) continue;

  const amount = parseFloat(amtBalMatch[1].replace(/,/g, ''));
  const balance = parseFloat(amtBalMatch[2].replace(/,/g, ''));

  rest = rest.replace(amtBalMatch[0], '').trim();
  const description = rest;

  // Determine type using previous balance
  let type = 'unknown';
  if (previousBalance !== null) {
    if (balance < previousBalance) type = 'debit';
    else if (balance > previousBalance) type = 'credit';
  }

  // Store transaction
  transactions.push({
    postDate,
    txnDate,
    description,
    amount,
    balance,
    type
  });

  // Update previous balance for next comparison
  previousBalance = balance;
}


console.log("Transactions length : ",transactions?.length)


  return res.status(200).json({ data: transactions });
  } catch (error) {
    console.error("❌ Error parsing PDF:", error);
    return res.status(500).json({ error: error?.message });
  }
};
