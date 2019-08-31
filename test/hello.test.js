const assert = require("assert");

describe("A suite", () => {
	it("testing works", () =>
	{
		assert.equal(1,1);
	})
	it("this should fail", () =>
	{
		assert.equal(1,);
	})
});