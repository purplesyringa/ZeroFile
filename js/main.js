window.addEventListener("load", () => {
	window.zeroFrame = new ZeroFrame();
	window.zeroPage = new ZeroPage(zeroFrame);
	window.zeroFS = new ZeroFS(zeroPage);
	window.files = new Files(zeroFS);

	let path = location.search.replace(/[?&]wrapper_nonce=[\d\w]*/, "").replace(/^[?&]/, "");
	files.load(path);
});