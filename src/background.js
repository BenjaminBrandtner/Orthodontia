chrome.runtime.onInstalled.addListener(() =>
{
	chrome.storage.sync.get(["orthodontiaOptions"], result =>
	{
		if (result.orthodontiaOptions === null || result.orthodontiaOptions === undefined)
		{
			let orthodontiaOptions =
				{
					debug: false,
					userClasses: [{url: "w3schools.com", css: ".w3-code"}],
					preferredBraceStyle: "NEXTLINE",
					automaticConversion: true
				};

			chrome.storage.sync.set({"orthodontiaOptions": orthodontiaOptions});
		}
	});
});

