var orthodontiaOptions =
	{
		debug: true,
		debugInfo: {},
		classlist: ".w3-code",
		preferredBraceStyle: "NEXTLINE",
		automaticConversion: true
	};

var orthodontiaData =
	{
		codeBlocks: null,
		styleInfo: null
	};

document.addEventListener("DOMContentLoaded", () =>
{

	if (orthodontiaOptions.debug)
	{
		console.log("Orthodontia is running with Debug Flag");
	}

	let codeBlocks = identifyCodeBlocks();

	let styleInfo = buildBraceStyleInfo(codeBlocks);

	if (orthodontiaOptions.debug)
	{
		markCodeBlocks(codeBlocks, styleInfo);
	}

	orthodontiaData.codeBlocks = codeBlocks;
	orthodontiaData.styleInfo = styleInfo;

	if (orthodontiaOptions.automaticConversion)
	{
		changeAllBraces();
	}
});

/**
 * Function invoked either on load (if automaticConversion is set), or on the press of a button/keystroke.
 * Changes all codeBlocks to the preferred braceStyle.
 */
function changeAllBraces()
{
	if(orthodontiaOptions.debug)
	{
		console.log("Starting orthodontic procedure.");
	}

	let styleInfo = orthodontiaData.styleInfo;
	let codeBlocks = orthodontiaData.codeBlocks;
	let blocksChanged = 0;

	for (let i = 0; i < codeBlocks.length; i++)
	{
		if (styleInfo[i] === "NONE" || styleInfo[i] === "UNCLEAR")
		{
			continue;
		}
		else if (styleInfo[i] === orthodontiaOptions.preferredBraceStyle)
		{
			continue;
		}

		changeBraces(codeBlocks[i], orthodontiaOptions.preferredBraceStyle);
		styleInfo[i] = orthodontiaOptions.preferredBraceStyle;
		blocksChanged++;
	}

	if (orthodontiaOptions.debug)
	{
		console.log("Procedure complete. " + blocksChanged + " CodeBlocks changed.");
	}
}

/**
 * Changes BraceStyle of given codeblock to the preferred style
 * @param {Node} codeBlock
 * @param {String} preferredStyle
 */
function changeBraces(codeBlock, preferredStyle)
{
	if (orthodontiaOptions.debug)
	{
		console.log("Changing to " + preferredStyle + ": ");
		console.log(codeBlock);
	}

	//TODO: Write this method.
	//Elements and text nodes need to be treated differently, probably.

}

//Deprecated, only here for reference
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
 * Hopefully does not match the same codeblock twice.
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

	if (orthodontiaOptions.debug)
	{
		console.log("Completed basic Code Block Identification. Identified " + codeBlocks.length + " CodeBlocks");
		orthodontiaOptions.debugInfo.basicCodeBlocks = codeBlocks;
	}

	let userCodeBlocks = Array.from(document.querySelectorAll(orthodontiaOptions.classlist));

	if (orthodontiaOptions.debug)
	{
		console.log("Completed extended Code Block Identification based on User classes. Identified " + userCodeBlocks.length + " additional CodeBlocks");
		orthodontiaOptions.debugInfo.userCodeBlocks = userCodeBlocks;
	}

	return codeBlocks.concat(userCodeBlocks);
}

/**
 * Creates the tooltip for markCodeBlocks()
 *
 * @param {String} text Text to be displayed in the tooltip
 * @param {Number} i The number of times this function has been called
 * @returns {HTMLSpanElement} The element that needs to be prepended to the codeBlock
 */
function createTooltip(text, i)
{
	var tooltipContainer = document.createElement("span");
	tooltipContainer.style.position = "relative";
	tooltipContainer.style.display = "hidden";

	var tooltip = document.createElement("div");
	tooltip.innerText = text;
	tooltip.style.background = i % 2 === 0 ? "#00ff00" : "#00ffff";
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
 * For debugging purposes: Marks all the identified codeBlocks with a tooltip containing their identified braceStyle
 *
 * @param {Array<Node>} codeBlocks
 * @param {Array<String>} styleInfo
 */
function markCodeBlocks(codeBlocks, styleInfo)
{
	console.log("Creating graphical tooltips.");

	for (let i = 0; i < codeBlocks.length; i++)
	{
		codeBlocks[i].prepend(createTooltip(styleInfo[i], i));
	}
}

/**
 * Builds an Array containing info about braceStyle for each element of codeBlocks
 *
 * @param {Array<Node>} codeBlocks Array of all codeBlocks on the page
 *
 * @returns {Array<String>} Array containing the info "SAMELINE", "NEXTLINE", "UNCLEAR" or "NONE" for each element of codeBlocks
 */
function buildBraceStyleInfo(codeBlocks)
{
	let styleInfo = [];

	for (var i = 0; i < codeBlocks.length; i++)
	{
		styleInfo[i] = identifyBraceStyle(codeBlocks[i]);
	}

	if (orthodontiaOptions.debug)
	{
		console.log("Completed Brace Style Identification.");
	}

	if (orthodontiaOptions.debug)
	{
		for (let i = 0; i < codeBlocks.length; i++)
		{
			console.log("Identified Bracestyle " + styleInfo[i] + " for ");
			console.log(codeBlocks[i]);
		}
	}


	return styleInfo;
}

/**
 * Finds out if this codeBlock's braces are on the same or the next line or if it doesn't contain any braces
 *
 * @param {Node} codeBlock
 *
 * @returns {String} "SAMELINE", "NEXTLINE", "UNCLEAR" or "NONE"
 */
function identifyBraceStyle(codeBlock)
{
	const sameLine = /\S+(.+)?{/g;
	const nextLine = /\n(\s+)?{/g;

	//Using Element.innerText here is advised, because it is aware of how it will be rendered as opposed to Node.textContent
	//See: https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/innerText
	let sameLineMatches = codeBlock.innerText.match(sameLine);
	let nextLineMatches = codeBlock.innerText.match(nextLine);

	if (sameLineMatches === null)
	{
		sameLineMatches = [];
	}
	if (nextLineMatches === null)
	{
		nextLineMatches = [];
	}

	if (sameLineMatches.length > 0 && nextLineMatches.length > 0)
	{
		if (orthodontiaOptions.debug)
		{
			console.warn("Unclear Brace Style for:");
			console.log(codeBlock);
			console.log("SAMELINE matches:");
			console.log(sameLineMatches);
			console.log("NEXTLINE matches:");
			console.log(nextLineMatches);
		}

		return "UNCLEAR";
	}

	if (sameLineMatches.length === 0 && nextLineMatches.length === 0)
	{
		return "NONE";
	}

	if (sameLineMatches.length > 0)
	{
		return "SAMELINE";
	}

	if (nextLineMatches.length > 0)
	{
		return "NEXTLINE";
	}
}
