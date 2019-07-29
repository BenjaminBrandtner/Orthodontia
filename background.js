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

