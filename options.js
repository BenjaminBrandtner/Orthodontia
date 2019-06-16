//TODO Make orthodontiaOptions.userClasses an Array and parse it when saving and loading

var orthodontiaOptions;

document.addEventListener("DOMContentLoaded", () =>
{
	load();

	document.getElementById("save").addEventListener("click", save);
});

function save()
{
	orthodontiaOptions.preferredBraceStyle = document.getElementById("preferredBraceStyle").value;
	orthodontiaOptions.userClasses = document.getElementById("userClasses").value;
	orthodontiaOptions.automaticConversion = document.getElementById("automaticConversion").checked;
	orthodontiaOptions.debug = document.getElementById("debug").checked;

	chrome.storage.sync.set({"orthodontiaOptions": orthodontiaOptions});

	document.getElementById("savedIndicator").innerText = "Saved.";
}

function load()
{
	chrome.storage.sync.get(["orthodontiaOptions"], result =>
	{
		if (result.orthodontiaOptions === null || result.orthodontiaOptions === undefined)
		{
			console.error("Orthodontia Options could not be loaded");
			return;
		}

		orthodontiaOptions = result.orthodontiaOptions;

		document.getElementById("preferredBraceStyle").value = orthodontiaOptions.preferredBraceStyle;
		document.getElementById("userClasses").value = orthodontiaOptions.userClasses;
		document.getElementById("automaticConversion").checked = orthodontiaOptions.automaticConversion;
		document.getElementById("debug").checked = orthodontiaOptions.debug;
	});
}
