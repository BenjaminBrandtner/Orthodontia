const assert = require("assert");
const orthodontia = require("../src/orthodontia.js");

//Destructuring the exports of orthodontia into global variables, so instead of writng orthodontia.foo() everywhere you can just write foo() instead.
for (let key in orthodontia)
{
	eval("var {" + key + "} = orthodontia;");
}
//TODO: The preparation abvove is the same for every testing file, find out how to do it before each test suite

//TODO: Find out how to create element and append it before each test
//TODO: replace assert with real assertion library
//TODO: Write tests that SAMELINE and NEXTLINE examples with Array initalisations in them are identified correctly

describe("Identifying", () => {
	it("identifies NONE correctly", () =>
	{
		let element = document.createElement("code");
		document.body.append(element);

		let bracestyle = identifyBraceStyle(element);
		assert.equal(bracestyle, "NONE");

	});
	it("identifies Array Initalisation as NONE", () =>
	{
		let element = document.createElement("code");
		document.body.append(element);

		element.innerText = "int zahlen[] = { 17, 0, 3 };\n foo();";

		let bracestyle = identifyBraceStyle(element);
		assert.equal(bracestyle, "NONE");

	});
	it("identifies SAMELINE correctly", () =>
	{
		let element = document.createElement("code");
		document.body.append(element);

		element.innerText = "hello {\n world }";

		bracestyle = identifyBraceStyle(element);

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