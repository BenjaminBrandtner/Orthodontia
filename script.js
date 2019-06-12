document.addEventListener("DOMContentLoaded", () =>
{
	console.log("Orthodontia is running");

	let codeBlocks = identifyCodeBlocks();

	codeBlocks.forEach(element =>
	{
		markCodeBlock(element);
	});

	// codeBlocks.forEach(function (block)
	// {
	// 	block.innerHTML = changeCurlyBrackets(block.innerHTML);
	// });
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

		if (whiteSpaceCount !== -1)
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
			var modifiedLine = line.replace(curlyBracketsRegExpAll, "\n<br>{");
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

function createTooltip(text)
{
	var markContainer = document.createElement("span");
	markContainer.style.position = "relative";
	markContainer.style.display = "hidden";

	var mark = document.createElement("div");
	mark.innerText = text;
	mark.style.background = "lime";
	mark.style.transition = "opacity 200ms";
	mark.addEventListener("mouseenter", event => event.target.style.opacity = "0");
	mark.addEventListener("mouseleave", event => event.target.style.opacity = "initial");
	mark.style.position = "absolute";
	mark.style.display = "inline-block";
	mark.style.bottom = "100%";
	mark.style.zIndex = "10";
	mark.style.fontSize = "small";

	markContainer.appendChild(mark);

	return markContainer;
}

function markCodeBlock(codeBlock)
{
	// Mouth Emoji: \ud83d\udc44

	codeBlock.prepend(createTooltip("Here be code:"));
}

function identifyCodeStyle(codeBlock)
{
	//TODO: Write this function

}
