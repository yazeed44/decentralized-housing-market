const Verifier = artifacts.require("Verifier");
const SolnSquareVerifier = artifacts.require("SolnSquareVerifier");

module.exports = async function (deployer) {
    // deployer.deploy(SquareVerifier);
    // deployer.deploy(SolnSquareVerifier);
    // deployer.deploy(PropertyERC721Token, "Property NFT", "PRP");
    await deployer.deploy(Verifier);
    await deployer.deploy(SolnSquareVerifier, "Property", "PRP", Verifier.address);
};
