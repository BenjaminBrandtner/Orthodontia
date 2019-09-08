const assert = require("assert"); //TODO: replace assert with real assertion library
const orthodontia = require("../src/orthodontia.js");

//Destructuring the exports of orthodontia into global variables, so instead of writng orthodontia.foo() everywhere you can just write foo() instead.
for (let key in orthodontia)
{
	eval("var {" + key + "} = orthodontia;");
}
//TODO: The preparation abvove is the same for every testing file, find out how to do it before each test suite

describe("Identifying", () =>
{
	let element;

	beforeEach("Create a code element on the page", () =>
	{
		element = document.createElement("code");
		document.body.append(element);
	});

	it("identifies NONE correctly", () =>
	{
		let bracestyle = identifyBraceStyle(element);
		assert.equal(bracestyle, "NONE");

	});
	it("identifies Array Initalisation as NONE", () =>
	{
		element.innerText = "int zahlen[] = { 17, 0, 3 };\n foo();";

		let bracestyle = identifyBraceStyle(element);
		assert.equal(bracestyle, "NONE");

	});
	it("identifies SAMELINE correctly", () =>
	{
		element.innerText = "hello {\n world }";

		let bracestyle = identifyBraceStyle(element);
		assert.equal(bracestyle, "SAMELINE");
	});
	it("identifies NEXTLINE correctly", () =>
	{
		element.innerText = "hello\n {\n world }";

		let bracestyle = identifyBraceStyle(element);
		assert.equal(bracestyle, "NEXTLINE");
	});

	it("identifies SAMELINE correctly, ignoring Array Initalisation", () =>
	{
		element.innerText = "int zahlen[] = { 17, 0, 3 };\nhello {\n world }";

		let bracestyle = identifyBraceStyle(element);
		assert.equal(bracestyle, "SAMELINE");
	});
	it("identifies NEXTLINE correctly, ignoring Array Initalisation", () =>
	{
		element.innerText = "int zahlen[] = { 17, 0, 3 };\nhello\n {\n world }";

		let bracestyle = identifyBraceStyle(element);
		assert.equal(bracestyle, "NEXTLINE");
	});

	it("identifies UNCLEAR correctly", () =>
	{
		element.innerText =
`byebye {
    love
}
byebye 
{
    happiness
}	
`;

		let bracestyle = identifyBraceStyle(element);
		assert.equal(bracestyle, "UNCLEAR");
	});

});