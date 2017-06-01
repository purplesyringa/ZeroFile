window.addEventListener("load", () => {
	window.zeroFrame = new ZeroFrame();
	window.zeroPage = new ZeroPage(zeroFrame);
	window.zeroOptionalProxy = new ZeroOptionalProxy(zeroPage);
	window.files = new Files(zeroOptionalProxy);

	zeroPage.cmd("wrapperInnerLoaded");
	setTimeout(() => {
		if(location.hash.substr(0, 2) != "#/") {
			files.load("");
		}
	}, 0);
});

window.addEventListener("hashchange", () => {
	if(location.hash.indexOf("#/") == 0) {
		let path = atob(location.hash.replace(/^#\//, ""));
		files.load(path);
	}
});