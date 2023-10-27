const fs = require('fs')


const DAO = artifacts.require("DAO")

module.exports = async function (deployer, network, accounts) {

  //18*6000 = 3 hrs
  await deployer.deploy(DAO,6000,6000,50);
  const dAO = await DAO.deployed();
  console.log("dAO.address : ", dAO.address);
  let config = `
export const dAOaddress= "${dAO.address}"
`;

  let data = JSON.stringify(config);
  fs.writeFileSync('./config.js', JSON.parse(data))

};





