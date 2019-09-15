# Documentation
Really just a place for me to store what I've learned / had to consider during development of this extension.

## Using node
Originally this project consisted only of the files necessary for use as a Chrome extension. As it grew I wanted to incorporate Unit Tests, which is why I significantly changed the directory structure and started using various node modules.

In order to test single functions I first need to export them. Since modules are not available for Chrome extension content scripts, adding `module.exports` to orthodontia.js throws errors when it's running as an extension. Adding a transpilation step was necessary.

- *Browserify* includes a definition of `module` to it's destination files.
- The test runner is *Karma*, which runs the Unit tests in Chrome, giving access to an HTMLDom, which is obviously essential for testing.
- The tests are written in *Mocha* with the *Chai* assertion library.

## File and Directory structure
- Javscript source code is located in src/ and with `npm run build` or `npm run watch` is transpiled to dist/ .
- dist/ also contains all non-js files that are part of the plugin, like manifest.json. This means, after building, the dist directory can be loaded as a Chrome extension with the Load Unpacked button on the Chrome extension page.
- Test files are located in the test/ directory, any auxiliary test files in subdirectories of test/
- The root folder contains config files for nodejs, modules, git, and the Readme.

## Quick Overview of an "orthodontic procedure"
All the logic is contained in `orthodontia.js` which is injected as a content script into every page a Chrome user visits and runs in the context of that page's HTMLDom.
There are 4 global variables that are read and changed by various functions. Two regexes for identifying SAMELINE and NEXTLINE brace style, `orthodontiaOptions` which holds user-defined settings like prefered brace style, custom css classes and whether to print debug information to the page and console, and `orthodontiaData` which holds the identified codeBlocks and the corresponding brace style information.

An instance of `orthodontiaOptions` is needed for some functions. When running as an extension the script retrieves one from Chrome storage, during tests it is injected into the main method.

The first step is to identify all HTMLElements on the page that are likely to contain code. Many (sadly not all) websites use `<code>` or `<pre>` tags or nested combinations of those to mark code.
All of these are written as an Array of HTMLElements to `orthodontiaData.codeBlocks`.

The user can specify, which additional css-classes should be considered codeBlocks. For example, w3schools.com presents their code in `<div>`s with the class `w3code`.
These HTMLElements are appended to `orthodontiaData.codeBlocks`.

Next, all the identified HTMLElements' `innerText` are analysed on what type of brace style they use. An Array is saved at `orthodontiaData.styleInfo` which holds the corresponding information for each position of `orthodontiaData.codeBlocks`.

Writing RegExes for Element.innerText is advised:
- because Element.innerText is aware of how it is rendered as opposed to Node.textContent
	- See: https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/innerText
- and it is much easier to match with RegEx than Element.innerHTML

Now, all the codeBlocks not matching `orthodontiaOptions.preferredBraceStyle` are changed:

This is a bit complicated. The naive solution would be to make the necessary changes with a regular expression and substitution and assign the new string to Element.innerText.
This approach would be fine for HTML as simple as this:

```html
<pre>int main (void) {
   printf("Hallo Welt\n");
   return 0;
}</pre>
```

but virtually all websites, [like this example](http://openbook.rheinwerk-verlag.de/c_von_a_bis_z/002_c_das_erste_programm_002.htm), include things like syntax highlighting in their codeblocks, which means the HTML actually looks like this:

```HTML
<pre class="prettyprint"><span class="kwd">int</span><span class="pln"> main </span><span class="pun">(</span><span class="kwd">void</span><span class="pun">)</span><span class="pln"> </span><span class="pun"><br>{</span><span class="pln">
   printf</span><span class="pun">(</span><span class="str">"Hallo Welt\n"</span><span class="pun">);</span><span class="pln">
  </span><span class="kwd">return</span><span class="pln"> </span><span class="lit">0</span><span class="pun">;</span><span class="pln">
  </span><span class="pun">}</span></pre>
```

Assigning anything to Element.innerText loses all this extra information. So instead, Element.innerHTML needs to be manipulated with surgical precision. Refer to the implementation of changeBraces() to see the detailed steps.
