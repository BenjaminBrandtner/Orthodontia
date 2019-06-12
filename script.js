document.addEventListener("DOMContentLoaded", () =>
{
	console.log("Orthodontia is running");

	let codeBlocks = identifyCodeBlocks();

	let styleInfo = buildCodeStyleInfo(codeBlocks);

	markCodeBlock(codeBlocks, styleInfo);

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

/**
 * Finds all nodes on the page that are likely to contain code.
 *
 * @returns {Array<Node>}
 */
function identifyCodeBlocks()
{
	var codeBlocks = Array.from(document.querySelectorAll("pre, code"));

	codeBlocks = codeBlocks.filter(element =>
	{
		let containsCodeOrPre = false;

		for (let i = 0; i < element.childNodes.length; i++)
		{
			let child = element.childNodes.item(i);

			if ((child.nodeName === "CODE") || (child.nodeName === "PRE"))
			{
				containsCodeOrPre = true;
				break;
			}
		}

		return !containsCodeOrPre;
	});

	return codeBlocks;
}

/**
 * Creates the tooltip for markCodeBlocks()
 *
 * @param {String} text Text to be displayed in the tooltip
 * @returns {HTMLSpanElement} The element that needs to be prepended to the codeBlock
 */
function createTooltip(text)
{
	var tooltipContainer = document.createElement("span");
	tooltipContainer.style.position = "relative";
	tooltipContainer.style.display = "hidden";

	var tooltip = document.createElement("div");
	tooltip.innerText = text;
	tooltip.style.background = "lime";
	tooltip.style.transition = "opacity 200ms";
	tooltip.addEventListener("mouseenter", event => event.target.style.opacity = "0");
	tooltip.addEventListener("mouseleave", event => event.target.style.opacity = "initial");
	tooltip.style.position = "absolute";
	tooltip.style.display = "inline-block";
	tooltip.style.bottom = "100%";
	tooltip.style.zIndex = "10";
	tooltip.style.fontSize = "small";

	tooltipContainer.appendChild(tooltip);

	return tooltipContainer;
}

/**
 * For debugging purposes: Marks all the identified codeBlocks with a tooltip containing their identified codestyle
 *
 * @param {Array<Node>} codeBlocks
 * @param {Array<String>} styleInfo
 */
function markCodeBlock(codeBlocks, styleInfo)
{
	// Mouth Emoji: \ud83d\udc44

	for (let i = 0; i < codeBlocks.length; i++)
	{
		codeBlocks[i].prepend(createTooltip(styleInfo[i]))
	}
}

/**
 * Builds an Array containing info about codeStyle for each element of codeBlocks
 *
 * @param {Array<Node>} codeBlocks Array of all codeBlocks on the page
 *
 * @returns {Array<String>} Array containing the info "SAMELINE", "NEXTLINE", or "NONE" for each element of codeBlocks
 */
function buildCodeStyleInfo(codeBlocks)
{
	let codeStyles = [];

	for (let i = 0; i < codeBlocks.length; i++)
	{
		if(codeBlocks[i].nodeName === "CODE")
		{
			codeStyles[i] = identifyCodeStyle(codeBlocks[i]);
		}
	}

	return codeStyles;
}

/**
 * Finds out if this codeBlock's braces are on the same or the next line or if it doesn't contain any braces
 *
 * @param {Node} codeBlock
 *
 * @returns {String} "SAMELINE", "NEXTLINE", or "NONE"
 */
function identifyCodeStyle(codeBlock)
{
	return "NONE";
}
