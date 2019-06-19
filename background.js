chrome.runtime.onInstalled.addListener(() =>
{
	chrome.storage.sync.get(["orthodontiaOptions"], result =>
	{
		if (result.orthodontiaOptions === null || result.orthodontiaOptions === undefined)
		{

			var orthodontiaOptions =
				{
					debug: true,
					debugInfo: {},
					userClasses: ".w3-code",
					preferredBraceStyle: "NEXTLINE",
					automaticConversion: true
				};

			chrome.storage.sync.set({"orthodontiaOptions": orthodontiaOptions});
		}
	});
});
