import * as squint_core from 'squint-cljs/core.js';
var make_draggable = function (node, _params) {
const state1 = squint_core.atom(({"dragging?": false, "start-x": 0, "start-y": 0, "pos-x": 0, "pos-y": 0, "start-mouse-x": 0, "start-mouse-y": 0}));
const update_transform2 = (function () {
const map__34 = squint_core.deref(state1);
const pos_x5 = squint_core.get(map__34, "pos-x");
const pos_y6 = squint_core.get(map__34, "pos-y");
return node.style.transform = `${"translate("}${pos_x5??''}${"px, "}${pos_y6??''}${"px)"}`;

});
const handle_pointer_down7 = (function (e) {
squint_core.swap_BANG_(state1, squint_core.assoc, "dragging?", true, "start-mouse-x", e.clientX, "start-mouse-y", e.clientY, "start-x", squint_core.get(squint_core.deref(state1), "pos-x"), "start-y", squint_core.get(squint_core.deref(state1), "pos-y"));
node.setPointerCapture(e.pointerId);
node.style.cursor = "grabbing";
node.style.zIndex = "100";
const temp__23126__auto__8 = node.querySelector(".donut-container");
if (squint_core.truth_(temp__23126__auto__8)) {
const container9 = temp__23126__auto__8;
return container9.classList.add("dragging");
};

});
const handle_pointer_move10 = (function (e) {
if (squint_core.truth_(squint_core.get(squint_core.deref(state1), "dragging?"))) {
const curr11 = squint_core.deref(state1);
const dx12 = (e.clientX - squint_core.get(curr11, "start-mouse-x"));
const dy13 = (e.clientY - squint_core.get(curr11, "start-mouse-y"));
squint_core.swap_BANG_(state1, squint_core.assoc, "pos-x", (squint_core.get(curr11, "start-x") + dx12), "pos-y", (squint_core.get(curr11, "start-y") + dy13));
return update_transform2();
};

});
const handle_pointer_up14 = (function (e) {
squint_core.swap_BANG_(state1, squint_core.assoc, "dragging?", false);
node.releasePointerCapture(e.pointerId);
node.style.cursor = "grab";
node.style.zIndex = "50";
const temp__23126__auto__15 = node.querySelector(".donut-container");
if (squint_core.truth_(temp__23126__auto__15)) {
const container16 = temp__23126__auto__15;
return container16.classList.remove("dragging");
};

});
node.style.cursor = "grab";
node.style.touchAction = "none";
node.style.userSelect = "none";
node.style.position = "relative";
node.style.zIndex = "50";
node.addEventListener("pointerdown", handle_pointer_down7);
node.addEventListener("pointermove", handle_pointer_move10);
node.addEventListener("pointerup", handle_pointer_up14);
node.addEventListener("pointercancel", handle_pointer_up14);
return ({"destroy": (function () {
node.removeEventListener("pointerdown", handle_pointer_down7);
node.removeEventListener("pointermove", handle_pointer_move10);
node.removeEventListener("pointerup", handle_pointer_up14);
return node.removeEventListener("pointercancel", handle_pointer_up14);

})});

};

export { make_draggable }
