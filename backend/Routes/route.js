const express = require("express");
const { axisBankController } = require("../Controllers/Savings/AxisBank.controller");
const { kotakBankController } = require("../Controllers/Savings/KotakBankWithHeader.controller");
const { centralBankController } = require("../Controllers/Savings/CentralBank.controller");
const { IciciBankController } = require("../Controllers/Savings/IciciBank.controller");
const { IciciBankBusinessController } = require("../Controllers/Business/IciciBankBusiness.controller");
const { HdfcBankController } = require("../Controllers/Savings/HdfcBank.controller");
const router = express.Router();



router.post ("/parse-pdf-axis-bank",axisBankController)
router.post("/parse-pdf-kotak-bank",kotakBankController)  // Kotak saving bank
router.post("/parse-pdf-central-bank",centralBankController)  // Kotak saving bank
router.post("/parse-pdf-icici-bank",IciciBankController)  // Kotak saving bank
router.post("/parse-pdf-icici-bank-business",IciciBankBusinessController)  // Kotak saving bank
router.post("/parse-pdf-hdfc-bank",HdfcBankController)  // Kotak saving bank

module.exports = router