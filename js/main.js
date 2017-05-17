window.addEventListener("load", () => {
	window.zeroFrame = new ZeroFrame();
	window.zeroPage = new ZeroPage(zeroFrame);
	window.zeroFS = new ZeroFS(zeroPage);
	window.files = new Files(zeroFS);

	zeroPage.cmd("wrapperInnerLoaded");
	setTimeout(() => {
		if(location.hash == "") {
			files.load("");
		}
	}, 0);
});

window.addEventListener("hashchange", () => {
	if(location.hash.indexOf("#/") == 0) {
		let path = location.hash.replace(/^#\//, "");
		files.load(path);
	}
});