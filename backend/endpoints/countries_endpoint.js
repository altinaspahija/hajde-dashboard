const express = require("express");
const Countries = require("../data_access/countries_repository");
const router = express.Router();

router.get("/", async (req, res) => {
  try {

    const countriesDa = new Countries();
    const countries = await countriesDa.getAllCountries();
    
    return res.json(countries)
  } catch (error) {
    console.log(error);
    res.statusCode = 500;
    return res.json({
      status: "Dështuar",
      error: error.message,
    });
  }
});

module.exports = router;
