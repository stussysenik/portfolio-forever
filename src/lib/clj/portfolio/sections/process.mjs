import * as squint_core from 'squint-cljs/core.js';
import * as content from './../data/content.mjs';
import * as portfolio_DOT_data_DOT_content from './../data/content.mjs';
var get_phases = function () {
return squint_core.map_indexed((function (idx, step) {
return ({"label": squint_core.get(step, "title"), "description": squint_core.get(step, "description"), "order": idx});

}), content.process_steps);

};
var rect_width = 180;
var rect_height = 60;
var rect_x = 80;
var phase_spacing = 100;
var first_y = 20;
var center_x = (rect_x + (rect_width / 2));
var cycle_margin = 60;
var cycle_x = 40;
var compute_geometry = function (phases_count) {
const last_phase_y1 = (first_y + ((phases_count - 1) * phase_spacing));
const view_box_height2 = (last_phase_y1 + rect_height + cycle_margin);
return ({"lastPhaseY": last_phase_y1, "viewBoxHeight": view_box_height2, "centerX": center_x, "firstMidY": (first_y + (rect_height / 2)), "cycleBottom": (last_phase_y1 + rect_height + (cycle_margin - 20))});

};

export { get_phases, rect_height, rect_x, cycle_margin, compute_geometry, phase_spacing, center_x, first_y, cycle_x, rect_width }
