function binaryToText(binary) {
	if(binary == "") {
		return "Empty file";
	}

	let segments = []
	for(let i = 0; i < binary.length; i += 16) {
		segments.push(binary.substr(i, 16));
	}

	console.log(segments);

	return segments
		.map((segment, pos) => {
			let posString = (pos * 16).toString(16);
			posString = "0".repeat(8 - posString.length) + posString;

			let binChars = segment
				.split("")
				.map(char => {
					let str = char.charCodeAt(0).toString(16);
					str = "0".repeat(2 - str.length) + str;

					return str;
				})
				.join(" ");
			binChars += " ".repeat(3 * 16 - 1 - binChars.length);

			let chars = segment
				.split("")
				.map(char => {
					if(char.charCodeAt(0) >= 32) {
						return char == "<" ? "&lt;" :
						       char == ">" ? "&gt;" :
						       char == "&" ? "&amp;" :
						       char;
					} else {
						return ".";
					}
				})
				.join("");

			return "<span class='binary-pos'>" + posString + "</span> <span class='binary-binchars'>" + binChars + "</span> <span class='binary-chars'>" + chars + "</span>";
		})
		.join("<br>");
}