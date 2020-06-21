const fs = require('fs');

const MOCK_DATA = [
  JSON.parse(fs.readFileSync('./mock-data/11YVCHAR001.json')),
  JSON.parse(fs.readFileSync('./mock-data/11YVCHAR002.json')),
  JSON.parse(fs.readFileSync('./mock-data/15MPPN002-VK.json')),
];

module.exports = {
  buildBreakdownData,
  buildBreakdownDataForYearandVariety,
  MOCK_DATA,
  getWine,
};

function buildBreakdownData(type, lotCode) {
  const filteredData = {};
  const result = [];
  const dataSet = getWine(lotCode).components;
  const uniqueDataset = dataSet
    .map((data) => data[type])
    .filter((val, idx, self) => self.indexOf(val) === idx);

  uniqueDataset.map((uData) => {
    filteredData[uData] = dataSet.filter((data) => data[type] === uData);
    result.push({
      [type]: uData,
      percentage: filteredData[uData].reduce((s, b) => s + b.percentage, 0),
    });
  });
  return result.sort((a, b) => (a.percentage > b.percentage ? -1 : 1));
}

function buildBreakdownDataForYearandVariety(lotCode) {
  const marks = [];
  const filteredData = {};
  const uniqueDataset = [];
  const dataSet = getWine(lotCode).components;
  const result = [];

  dataSet.map((data, i) => {
    const el = `${data.year}-${data.variety}`;
    if (!marks[el]) {
      marks[el] = true;
      uniqueDataset.push(el);
    }
  });

  uniqueDataset.map((uData) => {
    const uDataYear = +uData.split('-')[0];
    const uDataVariety = uData.split('-')[1];
    filteredData[uData] = dataSet.filter(
      (data) => data.year === uDataYear && data.variety === uDataVariety
    );
    result.push({
      year: uDataYear,
      variety: uDataVariety,
      percentage: filteredData[uData].reduce((s, b) => s + b.percentage, 0),
    });
  });
  return result.sort((a, b) => (a.percentage > b.percentage ? -1 : 1));
}

function getWine(lotCode) {
  return MOCK_DATA.find((data) => data.lotCode === lotCode);
}
