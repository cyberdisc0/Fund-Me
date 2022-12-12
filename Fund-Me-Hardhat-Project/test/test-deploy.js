const { ethers } = require("hardhat")
const { assert, expect } = require("chai")

describe("Simple Storage", () => {

  let simpleStorageFactory, simpleStorage

  beforeEach(async() => {
    simpleStorageFactory = await ethers.getContractFactory("SimpleStorage")
    simpleStorage = await simpleStorageFactory.deploy()
  })

  it("Should start with favorite number of 0", async() => {
    const currentValue = await simpleStorage.retrieve()
    const expectedValue = "0"

    assert.equal(currentValue.toString(), expectedValue)
  })

  it("Should update when we call store", async() => {
    const expectedValue = "7"
    const transactionResponse = await simpleStorage.store(expectedValue)
    transactionResponse.wait(1)
    const currentValue = await simpleStorage.retrieve()
    assert.equal(expectedValue, currentValue.toString())
  })

  it("Should should add person", async() => {
    const txR = await simpleStorage.addPerson("guy", "7")
    txR.wait(1)
    const person = await simpleStorage.people(0)
    // console.log(person[0])
    const favNum = person[0]
    const name = person[1]
    assert.equal(favNum, "7")
    assert.equal(name, "guy")

  })
})