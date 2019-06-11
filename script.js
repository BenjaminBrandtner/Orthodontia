document.addEventListener("DOMContentLoaded", () =>
{
	console.log("Orthodontia is running");

	let codeBlocks = identifyCodeBlocks();

	codeBlocks.forEach(element =>
	{
        markCodeBlock(element);
	})

	// codeBlocks.forEach(function(block)
	// {
	// 	block.innerHTML = changeCurlyBrackets(block.innerHTML);
	// })

});

function changeCurlyBrackets(code)
{
	console.log("changeCurlyBrackets wurde aufgerufen");

	var curlyBracketsRegExp = / \{/;
	var curlyBracketsRegExpAll = / \{/g;
	var whiteSpaceRegExp = /[^ ]/;

	var linesOfCode = code.split("\n");

	var result = "";

	linesOfCode.forEach(line =>
	{
		var whiteSpaceCount = line.search(whiteSpaceRegExp);

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
			var modifiedLine = line.replace(curlyBracketsRegExpAll, "<br>{");
		}

		result += modifiedLine + "\n";
	});

	return result;
}

function identifyCodeBlocks()
{
	var codeBlocks = Array.from(document.querySelectorAll("pre, code"));

	codeBlocks = codeBlocks.filter(element =>
	{
		var containsCodeOrPre = false;

		for (let i = 0; i < element.childNodes.length; i++)
		{
			child = element.childNodes.item(i);

			if ((child.nodeName === "CODE") || (child.nodeName === "PRE"))
			{
				containsCodeOrPre = true;
				break;
			}
		}

		if (containsCodeOrPre)
		{
			return false;
		}
		else
		{
			return true;
		}
	});

	return codeBlocks;
}

function markCodeBlock(codeBlock)
{
	var mark = document.createElement("p");
	mark.innerText = "There be code here:";
	mark.style.background = "lime";
	codeBlock.prepend(mark);

}
