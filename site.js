// Shared behaviour for every page of the clinic website.

// ── TIMINGS: edit here and they update everywhere (service cards, doctor pages, pharmacy popup).
// Leave a value empty ("") to show "Call 91772 56111 for timings".
const TIMINGS = {
  psy: "Evening · 5:00 PM – 9:00 PM",   // Dr. Tetali Rama Reddy – Psychiatry
  ent: "Evening · 5:00 PM – 9:00 PM",   // Dr. Bobba Rachana – ENT
  rx:  "4:00 PM – 10:00 PM",            // In-clinic pharmacy
};
const CLINIC_PHONE = "91772 56111";
const CLINIC_LATLNG = "16.929583,81.957667";

document.querySelectorAll("[data-timing]").forEach(el => {
  el.textContent = TIMINGS[el.dataset.timing] || `Call ${CLINIC_PHONE} for timings`;
});

const yr = document.getElementById("yr");
if (yr) yr.textContent = new Date().getFullYear();

// ── Popups: any element with data-open="dialog-id" opens that <dialog>
document.querySelectorAll("[data-open]").forEach(btn =>
  btn.addEventListener("click", e => {
    e.preventDefault();
    document.getElementById(btn.dataset.open)?.showModal();
  }));
// ── Clock buttons (data-timepop="psy|ent|rx") show that service's timings in #timing-pop
const timingPop = document.getElementById("timing-pop");
document.querySelectorAll("[data-timepop]").forEach(btn =>
  btn.addEventListener("click", () => {
    timingPop.querySelector("h3").textContent = btn.dataset.title;
    timingPop.querySelector(".time-big span").textContent =
      TIMINGS[btn.dataset.timepop] || `Call ${CLINIC_PHONE} for timings`;
    timingPop.showModal();
  }));
document.querySelectorAll("dialog").forEach(d => {
  d.addEventListener("click", e => { if (e.target === d) d.close(); });           // click outside closes
  d.querySelectorAll("[data-close]").forEach(b => b.addEventListener("click", () => d.close()));
});

// ── How to reach: Google Maps directions from the visitor's town (train/bus links are plain <a>)
const reachForm = document.getElementById("reach-form");
reachForm?.addEventListener("submit", e => {
  e.preventDefault();
  const from = reachForm.elements.from.value.trim();
  const url = "https://www.google.com/maps/dir/?api=1&destination=" + CLINIC_LATLNG +
    (from ? "&origin=" + encodeURIComponent(from) : "");
  window.open(url, "_blank", "noopener");
});
