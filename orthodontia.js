//Chrome Plugin Functionality
{
	/**
	 * Retrieves the orthodontiaOptions from Chrome storage and saves it to a global variable,
	 * then calls the provided callback function
	 *
	 * @param {Function} callback
	 */
	function initPlugin(callback)
	{
		chrome.storage.sync.get(["orthodontiaOptions"], result =>
		{
			if (result.orthodontiaOptions === null || result.orthodontiaOptions === undefined)
			{
				console.error("Orthodontia Options could not be loaded");
				return;
			}

			window.orthodontiaOptions = result.orthodontiaOptions;
			callback();
		});
	}

	/**
	 * Displays a number as a badge on the extension icon.
	 *
	 * @param {Number} number
	 */
	function displayBlocksChanged(number)
	{
		//TODO
	}
}

initPlugin(startOrthodontia);

/**
 * Main Function
 */
function startOrthodontia()
{
	window.orthodontiaData =
		{
			debugInfo: {},
			codeBlocks: null,
			styleInfo: null
		};

	if (orthodontiaOptions.debug)
	{
		console.log("Orthodontia is running with Debug Flag");
	}

	let codeBlocks = identifyCodeBlocks();

	if (codeBlocks.length !== 0)
	{
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
	}
}


/**
 * Function invoked either on load (if automaticConversion is set), or on the press of a button/keystroke.
 * Changes all codeBlocks to the preferred braceStyle.
 */
function changeAllBraces()
{
	if (orthodontiaOptions.debug)
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

	displayBlocksChanged(blocksChanged);

	if (orthodontiaOptions.debug)
	{
		console.log("Procedure complete. " + blocksChanged + " CodeBlocks changed.");
	}
}

/**
 * Changes BraceStyle of given codeblock to the preferred style
 * @param {HTMLElement} codeBlock
 * @param {String} preferredStyle
 */
function changeBraces(codeBlock, preferredStyle)
{
	if (orthodontiaOptions.debug)
	{
		console.log("Changing to " + preferredStyle + ": ");
		console.log(codeBlock);
	}

	if (preferredStyle === "NEXTLINE")
	{
		const sameLineRegEx = /((?:<br>|<br\/>|<br \/>|\n)*((?: |\t|&nbsp;)*))(.+?){(?=(?:<\/[a-z]+>)*(?:<br>|<br\/>|<br \/>|\n))/gi;
		/*
		This Regex matches:
		Group 1
		(
			0 or more linebreaks
			followed by Group 2 ("Whitespace-Group")
			(
				0 or more Space, Tab, or &nbsp;
			)
		)
		followed by Group 3
		(
			as few various characters as possible
		)
		followed by {
		but only if it is followed by 0 or more closing tags and a linebreak

		During replacement, a linebreak and the characters of the Whitespace-Group are inserted before the {
		 */

		codeBlock.innerHTML = codeBlock.innerHTML.replace(sameLineRegEx, "$1$3<br />$2{");
	}

	//TODO: Converting to SAMELINE

}

/**
 * Finds all nodes on the page that are likely to contain code.
 * Hopefully does not match the same codeblock twice.
 *
 * @returns {Array<HTMLElement>}
 */
function identifyCodeBlocks()
{
	let codeBlocks = Array.from(document.querySelectorAll("pre, code"));

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
		orthodontiaData.debugInfo.basicCodeBlocks = codeBlocks;
	}

	let userCodeBlocks = Array.from(document.querySelectorAll(orthodontiaOptions.userClasses));

	if (orthodontiaOptions.debug)
	{
		console.log("Completed extended Code Block Identification based on User classes. Identified " + userCodeBlocks.length + " additional CodeBlocks");
		orthodontiaData.debugInfo.userCodeBlocks = userCodeBlocks;
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
	let tooltipContainer = document.createElement("span");
	tooltipContainer.style.position = "relative";
	tooltipContainer.style.display = "hidden";

	let tooltip = document.createElement("div");
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
 * @param {Array<HTMLElement>} codeBlocks
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
 * @param {Array<HTMLElement>} codeBlocks Array of all codeBlocks on the page
 *
 * @returns {Array<String>} Array containing the info "SAMELINE", "NEXTLINE", "UNCLEAR" or "NONE" for each element of codeBlocks
 */
function buildBraceStyleInfo(codeBlocks)
{
	let styleInfo = [];

	for (let i = 0; i < codeBlocks.length; i++)
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
			if (styleInfo[i] === "NONE" || styleInfo[i] === "UNCLEAR")
			{
				continue;
			}

			console.log("Identified Bracestyle " + styleInfo[i] + " for ");
			console.log(codeBlocks[i]);
		}
	}


	return styleInfo;
}

/**
 * Finds out if this codeBlock's braces are on the same or the next line or if it doesn't contain any braces
 *
 * @param {HTMLElement} codeBlock
 *
 * @returns {String} "SAMELINE", "NEXTLINE", "UNCLEAR" or "NONE"
 */
function identifyBraceStyle(codeBlock)
{
	const sameLine = /\S+.*{\s*\n/g;
	/*
	This regex matches
	1 or more non-whitespace characters
	followed by 0 or more any characters that aren't linebreaks
	followed by {
	followed by 0 or more whitespaces characters
	followed by a linebreak

	In other words:
	Any line that has some text before a { and no text after it
	 */

	const nextLine = /\n(\s+)?{/g;

	/*
	Using Element.innerText here is advised:
	- because it is aware of how it will be rendered as opposed to Node.textContent
		- See: https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/innerText
	- and it is easier to match with RegEx than Element.innerHTML
	*/
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
			console.log("Unclear Brace Style for:");
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
