const {
  buildBreakdownData,
  buildBreakdownDataForYearandVariety,
  MOCK_DATA,
  getWine,
} = require('./data-service');

const express = require('express');
const router = express.Router();

router.get('/getYearBreakdown/:lotCode', (req, res) => {
  return renderBreakdownResponse('year', req, res);
});

router.get('/getVarietyBreakdown/:lotCode', (req, res) => {
  return renderBreakdownResponse('variety', req, res);
});

router.get('/getRegionBreakdown/:lotCode', (req, res) => {
  return renderBreakdownResponse('region', req, res);
});

router.get('/getYearAndVarietyBreakdown/:lotCode', (req, res) => {
  return renderBreakdownResponse('year-variety', req, res);
});

/*
 * not included in Excercise 1 scope.
 */
router.get('/', (req, res) => {
  return res.json(MOCK_DATA);
});
router.get('/:lotCode', (req, res) => {
  const data = getWine(req.params.lotCode);
  !data && renderNotFound(res);
  return res.json(data);
});

function renderBreakdownResponse(type, req, res) {
  const lotCode = req.params.lotCode;
  !getWine(lotCode) && renderNotFound(res);
  const breakDownData =
    type === 'year-variety'
      ? buildBreakdownDataForYearandVariety(lotCode)
      : buildBreakdownData(type, lotCode);
  const result = {
    breakdownType: type,
    breakdown: breakDownData,
  };
  return res.json(result);
}

function renderNotFound(res) {
  res.status(404);
  res.json({ message: `Not Found` });
  return;
}

//Routes will go here
module.exports = router;
