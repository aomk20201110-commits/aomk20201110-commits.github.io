import assert from "node:assert/strict";
import {
  analyseArray,
  arrayPattern,
  gratingLimit,
  resonanceCurve,
  resonanceMetrics,
  RESONANCE_PRESETS,
} from "../.cache/ssr/entry-server.js";

let passed = 0;
function check(name, fn) {
  fn();
  passed += 1;
  console.log(`ok ${passed} - ${name}`);
}

check("eight-element broadside array has known peak, HPBW and sidelobe", () => {
  const metrics = analyseArray(arrayPattern(0, 0.5), 0, 0.5);
  assert.equal(metrics.peakAngle, 0);
  assert.ok(metrics.peakDb > -0.01 && metrics.peakDb < 0.01);
  assert.ok(metrics.hpbw !== null && Math.abs(metrics.hpbw - 13) < 0.6);
  assert.ok(metrics.sidelobe !== null && Math.abs(metrics.sidelobe + 12.8) < 0.6);
  assert.equal(metrics.grating, false);
});

check("steering moves the main lobe to the requested direction", () => {
  const metrics = analyseArray(arrayPattern(18, 0.5), 18, 0.5);
  assert.ok(Math.abs(metrics.peakAngle - 18) <= 0.3);
});

check("grating-lobe condition triggers above the spacing limit", () => {
  assert.ok(Math.abs(gratingLimit(30) - 2 / 3) < 1e-9);
  assert.equal(analyseArray(arrayPattern(0, 0.9), 0, 0.9).grating, false);
  assert.equal(analyseArray(arrayPattern(30, 0.9), 30, 0.9).grating, true);
});

check("critically coupled resonator absorbs all power at resonance", () => {
  const metrics = resonanceMetrics(120, 120, 1);
  assert.equal(metrics.regime, "critical");
  assert.ok(Math.abs(metrics.r0) < 1e-12);
  assert.ok(Math.abs(metrics.a0 - 1) < 1e-12);
  assert.ok(Math.abs(metrics.totalQ - 60) < 1e-9);
  assert.ok(Math.abs(metrics.linewidthGHz - 16.6667) < 0.001);

  const centre = resonanceCurve(120, 120, 1, 481)[240];
  assert.ok(Math.abs(centre.delta) < 1e-9);
  assert.ok(Math.abs(centre.r) < 1e-12);
  assert.ok(Math.abs(centre.a - 1) < 1e-12);
});

check("under- and over-coupled resonators reflect equally at resonance", () => {
  const under = resonanceMetrics(
    RESONANCE_PRESETS.under.qi,
    RESONANCE_PRESETS.under.qe,
    1,
  );
  const over = resonanceMetrics(
    RESONANCE_PRESETS.over.qi,
    RESONANCE_PRESETS.over.qe,
    1,
  );
  assert.equal(under.regime, "under");
  assert.equal(over.regime, "over");
  assert.ok(Math.abs(under.r0 - over.r0) < 1e-12);
  assert.ok(Math.abs(under.r0 - 0.3864134404674945) < 1e-9);
  assert.ok(Math.abs(under.a0 - 0.6135865595325055) < 1e-9);
  assert.ok(Math.abs(under.linewidthGHz - 17.619047619047617) < 1e-6);
});

check("resonance curve stays physical and symmetric", () => {
  const curve = resonanceCurve(300, 70, 1.4, 481);
  for (const point of curve) {
    assert.ok(point.r >= 0 && point.r <= 1);
    assert.ok(point.a >= 0 && point.a <= 1);
    assert.ok(Math.abs(point.r + point.a - 1) < 1e-12);
  }
  for (let i = 0; i < 8; i += 1) {
    assert.ok(Math.abs(curve[i].delta + curve[curve.length - 1 - i].delta) < 1e-9);
    assert.ok(Math.abs(curve[i].r - curve[curve.length - 1 - i].r) < 1e-9);
  }
});

console.log(`models: ${passed} checks passed`);
