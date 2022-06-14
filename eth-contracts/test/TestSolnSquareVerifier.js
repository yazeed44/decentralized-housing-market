const SolnSquareVerifier = artifacts.require("SolnSquareVerifier");
const Verifier = artifacts.require("Verifier");
const zokratesProof = require("../../zokrates/code/square/proof.json");
// Test if a new solution can be added for contract - SolnSquareVerifier

contract("SolnSquareVerifier", async (accounts) => {
    const [accountOne, accountTwo] = [accounts[0], accounts[1]];
    let verifier, solSquareVerifier;

    beforeEach(async () => {
        verifier = await Verifier.new({ from: accountOne });
        solSquareVerifier = await SolnSquareVerifier.new("Property", "PRP", verifier.address, { from: accountTwo });
    });

    it("Test if a new solution can be added for contract - SolnSquareVerifier", async function () {
        return new Promise(async (resolve) => {
            solSquareVerifier.contract.once("SolutionAdded", {}, function () {
                resolve();
            });

            await solSquareVerifier.addSolution(accountTwo, 1);
        });
    });

    it("Test if an ERC721 token can be minted for contract - SolnSquareVerifier", async function () {
        const originalSupply = await solSquareVerifier.totalSupply();

        assert.equal(originalSupply, 0, "No tokens have been minted so supply should be 0");
        const tx = await solSquareVerifier.methods[
            "mint(address,uint256,((uint256,uint256),(uint256[2],uint256[2]),(uint256,uint256)),uint256[2])"
        ](accountOne, 1, zokratesProof.proof, zokratesProof.inputs, { from: accountTwo });

        const supplyAfterMint = await solSquareVerifier.totalSupply();
        assert.equal(supplyAfterMint, 1, "One token have been minted so Supply should be 1");
        assert.equal(await solSquareVerifier.ownerOf(1), accountOne, `Owner of token 1 should be ${accountOne}`);

        try {
            await solSquareVerifier.methods[
                "mint(address,uint256,((uint256,uint256),(uint256[2],uint256[2]),(uint256,uint256)),uint256[2])"
            ](accountOne, 1, zokratesProof.proof, zokratesProof.inputs, { from: accountTwo });
            assert.fail("Should fail to mint same token twice");
        } catch {}
    });
});

// Test if an ERC721 token can be minted for contract - SolnSquareVerifier
