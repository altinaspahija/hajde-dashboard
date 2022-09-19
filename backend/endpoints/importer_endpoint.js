const express = require('express');
const router = express.Router();
const authZ = require('../middlewares/authorization');
const Importer = require('../data_access/importer_repository');

router.post('/save', authZ('company', 'restaurant'), async (req, res) => {
  try {
    const importer = new Importer();
    await importer.saveImporter({
      companyId: req.user.companyId,
      ...req.body
    });

    res.json({
      status: 'Sukses',
      message: 'Konfigurimi është ruajtur me sukses'
    });
  } catch (err) {
    res.statusCode = 500;
    return res.json({
      status: 'Dështuar',
      error: 'Gabim në server'
    });
  }
});


router.post('/save/:companyId', authZ('admin'), async (req, res) => {
  try {
    const importer = new Importer();
    await importer.saveImporter({
      companyId: req.params.companyId,
      ...req.body
    });

    res.json({
      status: 'Sukses',
      message: 'Konfigurimi është ruajtur me sukses'
    });
  } catch (err) {
    res.statusCode = 500;
    return res.json({
      status: 'Dështuar',
      error: 'Gabim në server'
    });
  }
});



router.get('/', authZ('company', 'restaurant'), async (req, res) => {
  try {
    const importer = new Importer();
    const importerData = await importer.getImporter(req.user.companyId);
    res.json({
      status: 'Sukses',
      importer: importerData
    });
  } catch (err) {
    res.statusCode = 500;
    return res.json({
      status: 'Dështuar',
      error: 'Gabim në server'
    });
  }
});

router.get('/:companyId', authZ('admin'), async (req, res) => {
  try {
    const importer = new Importer();
    const importerData = await importer.getImporter(req.params.companyId);
    res.json({
      status: 'Sukses',
      importer: importerData
    });
  } catch (err) {
    res.statusCode = 500;
    return res.json({
      status: 'Dështuar',
      error: 'Gabim në server'
    });
  }
});


module.exports = router;
