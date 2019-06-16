chrome.runtime.onInstalled.addListener(() =>
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
});