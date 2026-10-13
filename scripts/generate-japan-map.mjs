import { readFile, writeFile } from "node:fs/promises";

// Natural Earth 1:50m country geometry, saved locally so regeneration is offline.
// Public-domain source and extraction details: references/map-data/README.md.
const feature = JSON.parse(
  (await readFile("references/map-data/japan-natural-earth.geojson", "utf8")).replace(/^\uFEFF/, ""),
);
if (feature.properties.ADM0_A3 !== "JPN" || feature.geometry.type !== "MultiPolygon") {
  throw new Error("Expected the Natural Earth Japan MultiPolygon");
}

// Mercator projection preserves the country's north-up geographic orientation.
function project([longitude, latitude]) {
  const radians = Math.PI / 180;
  return [longitude * radians, -Math.log(Math.tan(Math.PI / 4 + latitude * radians / 2))];
}

const polygons = feature.geometry.coordinates.map((polygon) =>
  polygon.map((ring) => ring.map(project)),
);
const points = polygons.flat(2);
const xMin = Math.min(...points.map(([x]) => x));
const xMax = Math.max(...points.map(([x]) => x));
const yMin = Math.min(...points.map(([, y]) => y));
const yMax = Math.max(...points.map(([, y]) => y));
const width = 600;
const height = 640;
const padding = 26;
const scale = Math.min((width - padding * 2) / (xMax - xMin), (height - padding * 2) / (yMax - yMin));
const offsetX = (width - (xMax - xMin) * scale) / 2;
const offsetY = (height - (yMax - yMin) * scale) / 2;
const path = polygons.map((polygon) => polygon.map((ring) =>
  ring.map(([x, y], index) =>
    `${index === 0 ? "M" : "L"}${((x - xMin) * scale + offsetX).toFixed(2)},${((y - yMin) * scale + offsetY).toFixed(2)}`,
  ).join("") + "Z",
).join("")).join("");

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="640" viewBox="0 0 600 640" role="img" aria-labelledby="title desc">
  <title id="title">Peta Jepang</title>
  <desc id="desc">Garis pantai kepulauan Jepang dari Natural Earth 1:50m. Utara berada di atas.</desc>
  <metadata>Natural Earth, public domain. Source: https://github.com/nvkelso/natural-earth-vector/blob/master/geojson/ne_50m_admin_0_countries.geojson</metadata>
  <path d="${path}" fill="#dae3e8" stroke="#788e9e" stroke-width="0.85" stroke-linejoin="round" fill-rule="evenodd"/>
</svg>
`;
await writeFile("public/images/japan-map.svg", svg);
console.log(`Japan SVG: ${polygons.length} polygons, ${points.length} coordinates, ${Buffer.byteLength(svg)} bytes`);
