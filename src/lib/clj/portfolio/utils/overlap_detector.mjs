import * as squint_core from 'squint-cljs/core.js';
var min_size = 10;
var min_area = 100;
var scan_overlaps = function () {
"Scans viewport for overlapping elements. Returns array of overlap hits.\n   Browser-only — returns empty array in SSR.";
if (squint_core.truth_(((typeof document !== 'undefined') && (typeof window !== 'undefined')))) {
const vw1 = window.innerWidth;
const vh2 = window.innerHeight;
const all3 = document.querySelectorAll("*");
const candidates4 = squint_core.atom([]);
let i5 = 0;
while(true){
if ((i5 < all3.length)) {
const el6 = all3[i5];
if (squint_core.truth_(el6.hasAttribute("data-overlap-detector"))) {
} else {
const s7 = document.getComputedStyle(el6);
const r8 = el6.getBoundingClientRect();
if (squint_core.truth_((!(s7.display === "none") && (!(s7.visibility === "hidden") && (!(s7.opacity === "0") && ((r8.width >= min_size) && ((r8.height >= min_size) && ((r8.bottom >= 0) && ((r8.top <= vh2) && ((r8.right >= 0) && (r8.left <= vw1))))))))))) {
squint_core.swap_BANG_(candidates4, squint_core.conj, ({"el": el6, "rect": r8}))}};
let G__9 = (i5 + 1);
i5 = G__9;
continue;
};break;
}
;
const hits10 = squint_core.atom([]);
const n111 = squint_core.count(squint_core.deref(candidates4));
let i12 = 0;
for (;i12<n111;i12++) {
(() => {
const n213 = squint_core.count(squint_core.deref(candidates4));
let j14 = 0;
for (;j14<n213;j14++) {
(((j14 > i12)) ? ((() => {
const a15 = squint_core.nth(squint_core.deref(candidates4), i12);
const b16 = squint_core.nth(squint_core.deref(candidates4), j14);
if (squint_core.truth_((() => {
const or__23461__auto__17 = a15.el.contains(b16.el);
if (squint_core.truth_(or__23461__auto__17)) {
return or__23461__auto__17} else {
return b16.el.contains(a15.el)};

})())) {
return null} else {
const aRect18 = a15.rect;
const bRect19 = b16.rect;
if (squint_core.truth_(((aRect18.left < bRect19.right) && ((aRect18.right > bRect19.left) && ((aRect18.top < bRect19.bottom) && (aRect18.bottom > bRect19.top)))))) {
const x20 = Math.max(0, (Math.min(aRect18.right, bRect19.right) - Math.max(aRect18.left, bRect19.left)));
const y21 = Math.max(0, (Math.min(aRect18.bottom, bRect19.bottom) - Math.max(aRect18.top, bRect19.top)));
const area22 = (x20 * y21);
if ((area22 >= min_area)) {
return squint_core.swap_BANG_(hits10, squint_core.conj, ({"elA": a15.el, "elB": b16.el, "area": area22, "aRect": aRect18, "bRect": bRect19}));
};
};
};

})()) : (null))
};
return null;

})()
};
return squint_core.deref(hits10);
};

};

export { min_size, min_area, scan_overlaps }
