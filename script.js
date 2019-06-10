document.addEventListener("DOMContentLoaded", () =>
{

	document.getElementById("execute").addEventListener("click", changeCurlyBrackets);

	// identifyCodeBlocks();
	markCodeBlocks();


});

function changeCurlyBrackets()
{
	var curlyBracketsRegExp = / \{/;
	var curlyBracketsRegExpAll = / \{/g;
	var whiteSpaceRegExp = /[^ ]/;
	var cCodeNextLine = document.getElementById("cNextLine").innerText;
	var cCodeSameLine = document.getElementById("cSameLine").innerText;

	var linesOfcCodeSameLine = cCodeSameLine.split("\n");

	var result = "";

	linesOfcCodeSameLine.forEach(line =>
	{
		var whiteSpaceCount = line.search(whiteSpaceRegExp);
		console.log(whiteSpaceCount);

		if (whiteSpaceCount != -1)
		{
			var replacementString = "\n";
			for (let i = 0; i < whiteSpaceCount; i++)
			{
				replacementString += " ";
			}
			replacementString += "{";

			var modifiedLine = line.replace(curlyBracketsRegExpAll, replacementString);
		}
		else
		{
			var modifiedLine = line.replace(curlyBracketsRegExpAll, "\n{");
		}

		result += modifiedLine + "\n";
	});

	document.getElementById("cSameLine").innerText = result;
}

function identifyCodeBlocks()
{
	var codeElements = document.getElementsByTagName("code");

	for (let i = 0; i < codeElements.length; i++)
	{
		// codeElements.item(i).style.
	}

}

function markCodeBlocks()
{
		var style = document.createElement("style");

		style.setAttribute("media", "screen");

		// WebKit hack :(
		// style.appendChild(document.createTextNode(""));

		document.head.appendChild(style);

		style.sheet.insertRule("code:before " +
			"{ " +
			"content: 'CodeBlock';" +
			"background: lime;" +
			"display: block;" +
			"position: relative;" +
			"}"
		);
}
