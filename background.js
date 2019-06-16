chrome.runtime.onInstalled.addListener(() =>
{
	var orthodontiaOptions =
		{
			debug: true,
			debugInfo: {},
			classlist: ".w3-code",
			preferredBraceStyle: "NEXTLINE",
			automaticConversion: true
		};

	chrome.storage.sync.set({"orthodontiaOptions": orthodontiaOptions});
});