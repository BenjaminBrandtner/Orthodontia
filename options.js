let orthodontiaOptions;
let userClassesSelectElement;
let userClassesUrlInput;
let userClassesCssInput;

document.addEventListener("DOMContentLoaded", () =>
{
	userClassesSelectElement = document.getElementById("userClassesSelect");
	userClassesUrlInput = document.getElementById("userClassesUrl");
	userClassesCssInput = document.getElementById("userClassesCss");

	load();

	document.getElementById("save").addEventListener("click", save);
	document.getElementById("userClassesSelect").addEventListener("change", fillUserClassesTextboxes);
	document.getElementById("userClassesAdd").addEventListener("click", addUserClass);
	document.getElementById("userClassesRemove").addEventListener("click", removeUserClass);
});

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
		document.getElementById("automaticConversion").checked = orthodontiaOptions.automaticConversion;
		document.getElementById("debug").checked = orthodontiaOptions.debug;

		displayUserClasses();
	});
}

function save()
{
	orthodontiaOptions.preferredBraceStyle = document.getElementById("preferredBraceStyle").value;
	orthodontiaOptions.automaticConversion = document.getElementById("automaticConversion").checked;
	orthodontiaOptions.debug = document.getElementById("debug").checked;

	chrome.storage.sync.set({"orthodontiaOptions": orthodontiaOptions});

	document.getElementById("savedIndicator").innerText = "Saved.";
}

function displayUserClasses()
{
	//Working with select and option elements: http://www.javascriptkit.com/jsref/select.shtml

	while (userClassesSelectElement.length !== 0)
	{
		userClassesSelectElement.remove(0);
	}

	for (let userClass of orthodontiaOptions.userClasses)
	{
		let option = new Option((userClass.url + ", " + userClass.css), JSON.stringify(userClass));
		userClassesSelectElement.add(option);
	}
}

function fillUserClassesTextboxes()
{
	let option = userClassesSelectElement.options[userClassesSelectElement.selectedIndex];
	let userClass = JSON.parse(option.value);

	userClassesUrlInput.value = userClass.url;
	userClassesCssInput.value = userClass.css;
}

function clearUserClassesTextboxes()
{
	userClassesUrlInput.value = "";
	userClassesCssInput.value = "";
}

function addUserClass()
{
	let url = userClassesUrlInput.value;
	let css = userClassesCssInput.value;

	orthodontiaOptions.userClasses.push({url: url, css: css});

	clearUserClassesTextboxes();
	displayUserClasses();
}

function removeUserClass()
{
	orthodontiaOptions.userClasses.splice(userClassesSelectElement.selectedIndex,1);

	clearUserClassesTextboxes();
	displayUserClasses();
}
