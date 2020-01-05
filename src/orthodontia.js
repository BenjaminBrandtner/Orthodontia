//Run the main method if this is running as a chrome extension
(async () =>
{
	if (chrome.extension)
	{
		try
		{
			await initPlugin();
		}
		catch (e)
		{
			console.error(e);
			return;
		}

		main();
	}
})();

//Exports
module.exports.setOptions = setOptions;
module.exports.main = main;
module.exports.identifyCodeBlocks = identifyCodeBlocks;
module.exports.identifyBraceStyle = identifyBraceStyle;

//Global Variables
let orthodontiaOptions = {};
let orthodontiaData =
	{
		debugInfo: {},
		codeBlocks: null,
		styleInfo: null
	};

const sameLineRegEx = /^(?<whitespace>[^\S\r\n]*)\S+.*{\s*\n/gm;
/*
This regex matches
From the beginning of the line: ^
0 or more horizontal whitespace characters, which are captured ([^\S\r\n] is a workaround for regex engines without \h)
1 or more non-whitespace characters: \S+
followed by 0 or more any characters: .*
followed by {
followed by 0 or more whitespaces characters: \s*
followed by a linebreak: \n

In simpler words:
Any line that has some text before a { and no text after it, capturing its indentation
 */

const nextLineRegEx = /\n(\s+)?{/g;

/* Not fully tested yet */

/**
 * Retrieves the orthodontiaOptions from Chrome storage and saves it to a global variable.
 */
function initPlugin()
{
	return new Promise(((resolve, reject) =>
	{
		chrome.storage.sync.get(['orthodontiaOptions'], result =>
		{
			if (result.orthodontiaOptions === null || result.orthodontiaOptions === undefined)
			{
				reject('Orthodontia Options could not be loaded. Please reinstall the extension.');
			}

			orthodontiaOptions = result.orthodontiaOptions;
			resolve();
		});
	}));
}

/**
 * Injects the orthodontiaOptions for the purposes of unit testing.
 *
 * @param {Object} options An instance of orthodontiaOptions
 */
function setOptions(options)
{
	orthodontiaOptions = options;
}

function debugPrint(text)
{
	if (orthodontiaOptions.debug)
	{
		console.log(text);
	}
}

function debugExecute(func)
{
	if (orthodontiaOptions.debug)
	{
		func();
	}
}

/**
 * Main Function
 */
function main()
{

	debugPrint('Orthodontia is running with Debug Flag');

	let codeBlocks = identifyCodeBlocks();

	if (codeBlocks.length !== 0)
	{
		let styleInfo = buildBraceStyleInfo(codeBlocks);

		debugExecute(() =>
		{
			markCodeBlocks(codeBlocks, styleInfo);
		});

		orthodontiaData.codeBlocks = codeBlocks;
		orthodontiaData.styleInfo = styleInfo;

		if (orthodontiaOptions.automaticConversion)
		{
			changeAllBraces();
		}

		debugPrint('Additional Debug Info:');
		debugPrint(orthodontiaData.debugInfo);
		debugPrint('Orthodontia is finished.');
	}
}


/**
 * Changes all codeBlocks to the preferred braceStyle.
 * Accesses global variable orthodontiaData.
 */
function changeAllBraces()
{
	debugPrint('Starting orthodontic procedure.');

	let styleInfo = orthodontiaData.styleInfo;
	let codeBlocks = orthodontiaData.codeBlocks;
	let blocksChanged = 0;

	for (let i = 0; i < codeBlocks.length; i++)
	{
		if (styleInfo[i] === 'NONE' || styleInfo[i] === 'UNCLEAR')
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

	debugPrint('Procedure complete. ' + blocksChanged + ' CodeBlocks changed.');
}

/**
 * Changes BraceStyle of an individual codeblock to the preferred style
 *
 * With the help of the regular expressions declared at the top this method searches through Element.innerText for { that need to be changed.
 * It then builds an array of necessary changes, e.g. "the first, second, and fourth { of this codeblock need to be changed".
 * It then goes through Element.innerHTML and makes those changes.
 * We have to use this roundabout way because changing Element.innerText directly loses the website's syntax highlighting.
 *
 * @param {HTMLElement} codeBlock
 * @param {String} preferredStyle
 */
function changeBraces(codeBlock, preferredStyle)
{
	debugPrint('Changing to ' + preferredStyle + ': ');
	debugPrint(codeBlock);

	if (preferredStyle === 'NEXTLINE')
	{
		let sameLineMatches = Array.from(codeBlock.innerText.matchAll(sameLineRegEx));
		/*
		This creates an Array, where each entry is an Array of capturing groups and further properties
		Example structure of entries in sameLineMatches:
		["   else if(age > 18)  {↵", "   ", index: 9, input:"the entire input", groups: { whitespace: "   " } ]
		["   else if(age == 18) {↵", "   ", index: 79, input: "the entire input", groups:  { whitespace: "   " } ]
		*/

		let necessaryChanges = [];
		let braceIndex = codeBlock.innerText.indexOf('{');
		let braceCount = 0;

		while (braceIndex !== -1)
		{
			/*
			Build an array of necessary changes
			A change is an object like this:
			{
				brace: 3,
				whitespace: "   "
			}
			Which means: The fourth (0-indexed) brace of the codeblock needs to be prepended with a linebreak and this whitespace
			*/

			//Performance upgrade of this loop would be possible at the cost of readability
			for (let match of sameLineMatches)
			{
				let matchedBraceIndex = match.index + match[0].indexOf('{'); //Determine index of this match's { in the whole codeblock

				if (braceIndex === matchedBraceIndex) //The { at braceIndex is the same as the match
				{
					necessaryChanges.push({ brace: braceCount, whitespace: match.groups.whitespace });
					break;
				}
			}

			braceCount++;

			braceIndex = codeBlock.innerText.indexOf('{', braceIndex + 1);
		}

		//Replace whitespace with non-breaking-spaces
		for (let change of necessaryChanges)
		{
			change.whitespace = change.whitespace.replace(/\s/g, '&nbsp;');
		}

		//Build a new codeblock with the changes
		let newCodeblock = '';
		let oldIndex = 0;

		for (let change of necessaryChanges)
		{
			let braceIndex = 0;

			//Find index of the brace that needs to be changed
			for (let i = 0; i <= change.brace; i++)
			{
				braceIndex = codeBlock.innerHTML.indexOf('{', braceIndex + 1);
			}

			newCodeblock += codeBlock.innerHTML.substring(oldIndex, braceIndex); //Add everything from the last { (or the start) up to, but not including, the current {
			newCodeblock += '<br />' + change.whitespace; //Add a linebreak and the whitespace

			oldIndex = braceIndex;
		}

		newCodeblock += codeBlock.innerHTML.substring(oldIndex); //Add the rest of the codeblock

		//Put new codeblock on website
		codeBlock.innerHTML = newCodeblock;
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
	//TODO: try  :not(pre) > code, pre
	let codeBlocks = Array.from(document.querySelectorAll('pre, code'));

	codeBlocks = codeBlocks.filter(element =>
	{
		let containsCodeOrPre = false;

		for (let i = 0; i < element.childNodes.length; i++)
		{
			let child = element.childNodes.item(i);

			if ((child.nodeName === 'CODE') || (child.nodeName === 'PRE'))
			{
				containsCodeOrPre = true;
				break;
			}
		}

		return !containsCodeOrPre;
	});

	debugPrint('Completed basic Code Block Identification. Identified ' + codeBlocks.length + ' CodeBlocks');
	debugExecute(() =>
	{
		orthodontiaData.debugInfo.basicCodeBlocks = codeBlocks;
	});

	let userCodeBlocks = [];

	for (let userClass of orthodontiaOptions.userClasses)
	{
		//TODO: Match current url against userClass.url
		// See https://stackoverflow.com/questions/39094017/javascript-match-url-with-wildcards-chrome-extension

		userCodeBlocks = userCodeBlocks.concat(Array.from(document.querySelectorAll(userClass.css)));
	}

	debugPrint('Completed extended Code Block Identification based on User classes. Identified ' + userCodeBlocks.length + ' additional CodeBlocks');
	debugExecute(() =>
	{
		orthodontiaData.debugInfo.userCodeBlocks = userCodeBlocks;
	});

	return codeBlocks.concat(userCodeBlocks);
}

/**
 * Creates the tooltip for markCodeBlocks().
 * Alternates colors too more easily spot cases where a codeblock has been identified twice.
 *
 * @param {String} text Text to be displayed in the tooltip
 * @param {Number} i The number of times this function has been called
 * @returns {HTMLSpanElement} The element that needs to be prepended to the codeBlock
 */
function createTooltip(text, i)
{
	let tooltipContainer = document.createElement('span');
	tooltipContainer.style.position = 'relative';
	tooltipContainer.style.display = 'hidden';

	let tooltip = document.createElement('div');
	tooltip.innerText = text;
	tooltip.style.background = i % 2 === 0 ? '#00ff00' : '#00ffff';
	tooltip.style.transition = 'opacity 200ms';
	tooltip.addEventListener('mouseenter', event => event.target.style.opacity = '0');
	tooltip.addEventListener('mouseleave', event => event.target.style.opacity = 'initial');
	tooltip.style.position = 'absolute';
	tooltip.style.display = 'inline-block';
	tooltip.style.bottom = '100%';
	tooltip.style.zIndex = '10';
	tooltip.style.fontSize = 'small';

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
	debugPrint('Creating graphical tooltips.');

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

	debugPrint('Completed Brace Style Identification.');
	debugExecute(() =>
	{
		for (let i = 0; i < codeBlocks.length; i++)
		{
			if (styleInfo[i] === 'NONE' || styleInfo[i] === 'UNCLEAR')
			{
				continue;
			}

			debugPrint('Identified Bracestyle ' + styleInfo[i] + ' for ');
			debugPrint(codeBlocks[i]);
		}

	});

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
	let sameLineMatches = codeBlock.innerText.match(sameLineRegEx);
	let nextLineMatches = codeBlock.innerText.match(nextLineRegEx);

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
		debugPrint('Unclear Brace Style for:');
		debugPrint(codeBlock);
		debugPrint('SAMELINE matches:');
		debugPrint(sameLineMatches);
		debugPrint('NEXTLINE matches:');
		debugPrint(nextLineMatches);

		return 'UNCLEAR';
	}

	if (sameLineMatches.length === 0 && nextLineMatches.length === 0)
	{
		return 'NONE';
	}

	if (sameLineMatches.length > 0)
	{
		return 'SAMELINE';
	}

	if (nextLineMatches.length > 0)
	{
		return 'NEXTLINE';
	}
}
