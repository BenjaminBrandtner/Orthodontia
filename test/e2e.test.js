const chai = require("chai");
const expect = chai.expect;
const orthodontia = require("../src/orthodontia.js");

//Destructuring the exports of orthodontia into global variables, so instead of writing orthodontia.foo() everywhere you can just write foo() instead.
for (let key in orthodontia)
{
	eval("var {" + key + "} = orthodontia;");
}

//Preparation done.


/**
 * After Orthodontia converts the brace style of one example, it won't be exactly the same as the corresponding example
 * because of things like trailing whitespaces and indenting with non-breaking spaces.
 * So to be able to assert that they look the same to the human eye, a few unimportant things have to be modified.
 *
 * @param {String} samelineExample
 * @param {String} nextlineExample
 * @return {{samelineArray: string[], nextlineArray: string[]}}
 */
function makeEqual(samelineExample, nextlineExample)
{
	//Replace all spaces with non-breaking spaces in both examples
	samelineExample = samelineExample.replace(/ /g, " ");
	nextlineExample = nextlineExample.replace(/ /g, " ");

	let samelineArray = samelineExample.split("\n");
	let nextlineArray = nextlineExample.split("\n");

	//Trim trailing whitespace in both examples
	samelineArray = samelineArray.map(line => line.trimEnd());
	nextlineArray = nextlineArray.map(line => line.trimEnd());

	return {samelineArray, nextlineArray};
}

describe("End to End", () =>
{
	beforeEach("Create various examples on the page", () =>
	{
		document.body.innerHTML = `
<h2>C Next Line</h2>
<div id="cNextline">
<pre><code>int main()
{
  int x = 0;

  while ( x < 10 )
  {
      printf( "%d", x );
      x++;
  }
}</code></pre>
</div>

<h2>C Same Line</h2>
<div id="cSameline">
<pre><code>int main() {
  int x = 0;

  while ( x < 10 ) {
      printf( "%d", x );
      x++;
  }
}</code></pre>
</div>

<h2>php next line</h2>
<div id="phpNextline">
<code><span style="color: #000000">
<span style="color: #0000BB">&lt;?php<br/></span><span style="color: #007700">function&nbsp;</span><span
style="color: #0000BB">foo</span><span style="color: #007700">()&nbsp;<br/>{<br/>&nbsp;&nbsp;function&nbsp;</span><span
style="color: #0000BB">bar</span><span style="color: #007700">()&nbsp;<br/>&nbsp;&nbsp;{<br/>&nbsp;&nbsp;&nbsp;&nbsp;echo&nbsp;</span><span
style="color: #DD0000">"I&nbsp;don't&nbsp;exist&nbsp;until&nbsp;foo()&nbsp;is&nbsp;called.\n"</span><span
style="color: #007700">;<br/>&nbsp;&nbsp;}<br/>}<br/><br/></span><span
style="color: #FF8000">/*&nbsp;</span>
</span>
</code>
</div>

<h2>php same line</h2>
<div id="phpSameline">
<code><span style="color: #000000">
<span style="color: #0000BB">&lt;?php<br/></span><span style="color: #007700">function&nbsp;</span><span
style="color: #0000BB">foo</span><span style="color: #007700">()&nbsp;{<br/>&nbsp;&nbsp;function&nbsp;</span><span
style="color: #0000BB">bar</span><span style="color: #007700">()&nbsp;{<br/>&nbsp;&nbsp;&nbsp;&nbsp;echo&nbsp;</span><span
style="color: #DD0000">"I&nbsp;don't&nbsp;exist&nbsp;until&nbsp;foo()&nbsp;is&nbsp;called.\n"</span><span
style="color: #007700">;<br/>&nbsp;&nbsp;}<br/>}<br/><br/></span><span
style="color: #FF8000">/*&nbsp;</span>
</span>
</code>
</div>
`;
	});

	it("converts SAMELINE to NEXTLINE 1", async () =>
	{
		let orthodontiaOptions =
			{
				debug: false,
				userClasses: [],
				preferredBraceStyle: "NEXTLINE",
				automaticConversion: true
			};

		await main(orthodontiaOptions);

		let cSameline = document.getElementById("cSameline").innerText;
		let cNextline = document.getElementById("cNextline").innerText;

		let {samelineArray, nextlineArray} = makeEqual(cSameline, cNextline);

		expect(samelineArray).to.deep.equal(nextlineArray);
	});

	it("converts SAMELINE to NEXTLINE 2", async () =>
	{
		let orthodontiaOptions =
			{
				debug: false,
				userClasses: [],
				preferredBraceStyle: "NEXTLINE",
				automaticConversion: true
			};

		await main(orthodontiaOptions);

		let phpSameline = document.getElementById("phpSameline").innerText;
		let phpNextline = document.getElementById("phpNextline").innerText;

		let {samelineArray, nextlineArray} = makeEqual(phpSameline, phpNextline);

		expect(samelineArray).to.deep.equal(nextlineArray);
	});

	it("converts NEXTLINE to SAMELINE 1", async () =>
	{
		let orthodontiaOptions =
			{
				debug: false,
				userClasses: [],
				preferredBraceStyle: "SAMELINE",
				automaticConversion: true
			};

		await main(orthodontiaOptions);

		let cSameline = document.getElementById("cSameline").innerText;
		let cNextline = document.getElementById("cNextline").innerText;

		let {samelineArray, nextlineArray} = makeEqual(cSameline, cNextline);

		expect(samelineArray).to.deep.equal(nextlineArray);

	});
	it("converts NEXTLINE to SAMELINE 2", async () =>
	{
		let orthodontiaOptions =
			{
				debug: false,
				userClasses: [],
				preferredBraceStyle: "SAMELINE",
				automaticConversion: true
			};

		await main(orthodontiaOptions);

		let phpSameline = document.getElementById("phpSameline").innerText;
		let phpNextline = document.getElementById("phpNextline").innerText;

		let {samelineArray, nextlineArray} = makeEqual(phpSameline, phpNextline);

		expect(samelineArray).to.deep.equal(nextlineArray);
	});
});
