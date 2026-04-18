import * as squint_core from 'squint-cljs/core.js';
import * as clojure_DOT_string from 'squint-cljs/src/squint/string.js';
var width = 80;
var height = 24;
var buffer_size = (width * height);
var chars = ".,-~:;=!*%#@";
var pi = 3.141592653589793;
var tau = (2 * pi);
var create_buffers = function () {
"Ada-style robust buffer initialization";
return ({"b": (new Uint8Array(buffer_size)), "z": (new Float32Array(buffer_size))});

};
var calculate_luminance = function (sin_i, cos_j, sin_a, sin_j, cos_a, cos_b, cos_i, sin_b) {
"Fortran-inspired high-precision luminance calculation";
const L1 = ((((sin_j * sin_a) - (sin_i * cos_j * cos_a)) * cos_b) - (sin_i * cos_j * sin_a) - (sin_j * cos_a) - (cos_i * cos_j * sin_b));
return Math.floor((8 * L1));

};
var compute_frame = function (buffers, a, b) {
"The core functional rendering loop";
const b_arr1 = buffers["b"];
const z_arr2 = buffers["z"];
const sin_a3 = Math.sin(a);
const cos_a4 = Math.cos(a);
const sin_b5 = Math.sin(b);
const cos_b6 = Math.cos(b);
b_arr1.fill(32);
z_arr2.fill(0);
let j7 = 0;
while(true){
if ((j7 < tau)) {
const sin_j8 = Math.sin(j7);
const cos_j9 = Math.cos(j7);
let i10 = 0;
while(true){
if ((i10 < tau)) {
const sin_i11 = Math.sin(i10);
const cos_i12 = Math.cos(i10);
const h13 = (cos_j9 + 2);
const d14 = (1 / ((sin_i11 * h13 * sin_a3) + (sin_j8 * cos_a4) + 5));
const t15 = ((sin_i11 * h13 * cos_a4) - (sin_j8 * sin_a3));
const x16 = Math.floor((40 + (30 * d14 * ((cos_i12 * h13 * cos_b6) - (t15 * sin_b5)))));
const y17 = Math.floor((12 + (15 * d14 * ((cos_i12 * h13 * sin_b5) + (t15 * cos_b6)))));
const o18 = (x16 + (width * y17));
const n19 = calculate_luminance(sin_i11, cos_j9, sin_a3, sin_j8, cos_a4, cos_b6, cos_i12, sin_b5);
if (squint_core.truth_(((y17 >= 0) && ((y17 < height) && ((x16 >= 0) && ((x16 < width) && (d14 > z_arr2[o18]))))))) {
(z_arr2[o18] = d14);
const char_idx20 = Math.min((squint_core.count(chars) - 1), Math.max(0, n19));
(b_arr1[o18] = chars.charCodeAt(char_idx20))};
let G__21 = (i10 + 0.02);
i10 = G__21;
continue;
};break;
}
;
let G__22 = (j7 + 0.07);
j7 = G__22;
continue;
};break;
}
;
return clojure_DOT_string.join("", squint_core.map_indexed((function (idx, v) {
return `${String.fromCharCode(v)??''}${(((squint_core.mod((idx + 1), width) === 0)) ? ("\n") : (null))??''}`;

}), b_arr1));

};

export { width, height, buffer_size, chars, pi, tau, create_buffers, compute_frame }
