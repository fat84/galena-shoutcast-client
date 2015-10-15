import PageObject from '../../page-object';

let {
	clickable,
	isVisible,
	isHidden
} = PageObject;

function button(scope) {
	return {
		scope: scope,
		isVisible: isVisible(),
		isHidden: isHidden(),
		click: clickable(),
	};
}

// export default PageObject.customHelper(button);
export default button;
