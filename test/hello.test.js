const assert = require("assert");
const o = require("../src/orthodontia.js");

//TODO: Findo out how to create element and append it before each test
//TODO: replace assert with real assertion library

describe("Identifying", () => {
	it("identifies NONE correctly", () =>
	{
		let element = document.createElement("code");
		document.body.append(element);

		let bracestyle = o.identifyBraceStyle(element);
		assert.equal(bracestyle, "NONE");

	});
	it("identifies SAMELINE correctly", () =>
	{
		let element = document.createElement("code");
		document.body.append(element);

		element.innerText = "hello {\n world }";

		bracestyle = o.identifyBraceStyle(element);

		assert.equal(bracestyle, "SAMELINE");
	});
	it("identifies NEXTLINE correctly", function ()
	{
		this.skip();
	});
	it("identifies UNCLEAR correctly", function ()
	{
		this.skip();
	});

});