const chai = require("chai");
const expect = chai.expect;
const orthodontia = require("../src/orthodontia.js");

//Destructuring the exports of orthodontia into global variables, so instead of writing orthodontia.foo() everywhere you can just write foo() instead.
for (let key in orthodontia)
{
	eval("var {" + key + "} = orthodontia;");
}

//Preparation done.

describe("Identifying", () =>
{
	describe("Codeblocks", () =>
	{
		beforeEach('clear the body', () =>
		{
			document.body.innerHTML = "";
		});

		it("identifies pre and code", () =>
		{
			setOptions({userClasses: []});

			let element1 = document.createElement("code");
			document.body.append(element1);

			let element2 = document.createElement("pre");
			document.body.append(element2);

			let codeblocks = identifyCodeBlocks();

			expect(codeblocks.length).to.equal(2);
		});

		it("doesnt identify nested pre and code tags twice", () =>
		{
			setOptions({userClasses: []});

			let parent1 = document.createElement("code");
			let child1 = document.createElement("pre");
			parent1.append(child1);

			let parent2 = document.createElement("pre");
			let child2 = document.createElement("code");
			parent2.append(child2);

			document.body.append(parent1);
			document.body.append(parent2);

			let codeblocks = identifyCodeBlocks();

			expect(codeblocks.length).to.equal(2);
		});

		it("identifies codeblocks with user classes", () =>
		{
			setOptions({userClasses: [{url: 'w3schools.com', css: '.w3code'}]});

			let element = document.createElement("div");
			element.className = "w3code";
			document.body.append(element);

			let codeblocks = identifyCodeBlocks();

			expect(codeblocks.length).to.equal(1);

		});
	});

	describe("Brace Styles", () =>
	{
		let element;

		before("Create one code element on the page", () =>
		{
			document.body.innerHTML = "";
			element = document.createElement("code");
			document.body.append(element);
		});

		it("identifies NONE correctly", () =>
		{
			let bracestyle = identifyBraceStyle(element);
			expect(bracestyle).to.equal("NONE");
		});
		it("identifies Array Initalisation as NONE", () =>
		{
			element.innerText = "int zahlen[] = { 17, 0, 3 };\n foo();";

			let bracestyle = identifyBraceStyle(element);
			expect(bracestyle).to.equal("NONE");

		});
		it("identifies SAMELINE correctly", () =>
		{
			element.innerText = "hello {\n world }";

			let bracestyle = identifyBraceStyle(element);
			expect(bracestyle).to.equal("SAMELINE");
		});
		it("identifies NEXTLINE correctly", () =>
		{
			element.innerText = "hello\n {\n world }";

			let bracestyle = identifyBraceStyle(element);
			expect(bracestyle).to.equal("NEXTLINE");
		});

		it("identifies SAMELINE correctly, ignoring Array Initalisation", () =>
		{
			element.innerText = "int zahlen[] = { 17, 0, 3 };\nhello {\n world }";

			let bracestyle = identifyBraceStyle(element);
			expect(bracestyle).to.equal("SAMELINE");
		});
		it("identifies NEXTLINE correctly, ignoring Array Initalisation", () =>
		{
			element.innerText = "int zahlen[] = { 17, 0, 3 };\nhello\n {\n world }";

			let bracestyle = identifyBraceStyle(element);
			expect(bracestyle).to.equal("NEXTLINE");
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
			expect(bracestyle).to.equal("UNCLEAR");
		});

	});

});
