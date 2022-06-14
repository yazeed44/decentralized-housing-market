const PropertyERC721Token = artifacts.require("./PropertyERC721Token");
const assert = require("assert");

contract("TestERC721Mintable", (accounts) => {
    const account_one = accounts[0];
    const account_two = accounts[1];
    const account_three = accounts[2];
    const tokenNum = 10;
    const tokens = [];
    describe("match erc721 spec", function () {
        before(async function () {
            this.contract = await PropertyERC721Token.new("Property", "PRP", { from: account_one });

            // TODO: mint multiple tokens
            await Promise.all(
                new Array(tokenNum).fill(null).map(async (_, i) => {
                    await this.contract.mint(account_two, i);
                    tokens.push(i);
                })
            );
        });

        it("should return total supply", async function () {
            const totalSupply = await this.contract.totalSupply();
            assert.equal(totalSupply, tokenNum);
        });

        it("should get token balance", async function () {
            const tokenBalanceOfAccountTwo = await this.contract.balanceOf(account_two);
            assert.equal(tokenBalanceOfAccountTwo, tokenNum);
        });

        // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
        it("should return token uri", async function () {
            await Promise.all(
                tokens.map(async (tokenId) => {
                    const tokenURI = await this.contract.tokenURI(tokenId);
                    assert.equal(tokenURI, `https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/${tokenId}`);
                })
            );
        });

        it("should transfer token from one owner to another", async function () {
            const toTransferTokenId = tokens[0];
            assert.equal(
                await this.contract.ownerOf(toTransferTokenId),
                account_two,
                `Owner of token ${toTransferTokenId} should be ${account_two}`
            );
            const tx = await this.contract.transferFrom(account_two, account_three, toTransferTokenId, { from: account_two });
            const newOwner = tx.receipt.logs[0].args["to"];
            assert.equal(newOwner, account_three, `New owner of token ${toTransferTokenId} should be ${account_three}`);
        });
    });

    describe("have ownership properties", function () {
        before(async function () {
            this.contract = await PropertyERC721Token.new("Property", "PRP", { from: account_one });
        });

        it("should fail when minting when address is not contract owner", async function () {
            try {
                await this.contract.mint(account_three, 0, { from: account_two });
                assert.fail(`Minting should fail if caller is not owner`);
            } catch {}
        });

        it("should return contract owner", async function () {
            assert.equal(await this.contract.getOwner(), account_one);
        });
    });
});
