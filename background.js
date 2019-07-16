chrome.runtime.onInstalled.addListener(() =>
{
	chrome.storage.sync.get(["orthodontiaOptions"], result =>
	{
		if (result.orthodontiaOptions === null || result.orthodontiaOptions === undefined)
		{
			let orthodontiaOptions =
				{
					debug: false,
					userClasses: ".w3-code",
					preferredBraceStyle: "NEXTLINE",
					automaticConversion: true
				};

			chrome.storage.sync.set({"orthodontiaOptions": orthodontiaOptions});
		}
	});
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) =>
{
	switch (message.function)
	{
		case "changeBadgeText":
			changeBadgeText(message.parameter.toString());
			break;
		default:
			break;
	}
});

function changeBadgeText(text)
{
	chrome.browserAction.setBadgeText({text: text});
}
