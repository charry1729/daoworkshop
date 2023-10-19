const fs = require('fs')


const DAO = artifacts.require("DAO")

module.exports = async function (deployer, network, accounts) {

// module.exports = async function (deployer, network, accounts) {

  await deployer.deploy(DAO,6000,6000,50);
  const dAO = await DAO.deployed();
  console.log("dAO.address : ", dAO.address);
  let config = `
export const dAOaddress= "${dAO.address}"
`;
// export const documentVerificationaddress= "${documentVerification.address}"

  let data = JSON.stringify(config);
  fs.writeFileSync('./config.js', JSON.parse(data))

};





