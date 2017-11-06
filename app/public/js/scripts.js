function selectText(e) {
    e.select();
	//e.setSelectionRange(0, e.value.length);
}

function toggleToken(e) {
	e.siblings("input").first().toggle();
	e.children("i").first().toggleClass("fa-plus");
	e.children("i").first().toggleClass("fa-minus");
	var input = e.siblings("input").first().get(0);
	selectText(input);
}