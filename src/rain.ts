
import * as main from './main.js';
import * as layer from './layer.js';

const TILE_SIZE = 2048;

//layer ids found here:  curl https://nowcoast.noaa.gov/arcgis/rest/services/nowcoast/analysis_meteohydro_sfc_qpe_time/MapServer/?f=json |jq .
//also found here     :  curl https://mapservices.weather.noaa.gov/raster/rest/services/obs/rfc_qpe/MapServer/?f=json |jq .

interface LayerIdMap {
	[key: string]: number;
}

//const RAIN_PATH = 'https://nowcoast.noaa.gov/arcgis/rest/services/nowcoast/analysis_meteohydro_sfc_qpe_time/MapServer/export'; const LAYER_ID_MAP: LayerIdMap = {'1d': 19, '3d': 27};
const RAIN_PATH = 'https://mapservices.weather.noaa.gov/raster/rest/services/obs/rfc_qpe/MapServer/export'; const LAYER_ID_MAP: LayerIdMap = {'1d': 25+3, '3d': 37+3, '5d': 45+3};

//5 day and 7 day can be found here:  https://www.wpc.ncep.noaa.gov/qpf/p120i.gif  https://www.wpc.ncep.noaa.gov/qpf/p168i.gif

export function setupRain() {
	main.map.on('style.load', (event: Event) => {
		addRainButtons();
	});
	main.map.on('load', (event: Event) => {
		addRainButtons();
	});
}

function addRainButtons() {
	for(let key in LAYER_ID_MAP) {
		addRainButton(key);
	}
}

function addRainButton(key: string) {
	let layerId: number = LAYER_ID_MAP[key];

	layer.addLayerButton({
		"id": `rain-history-${key}`,
		"name": `rain ${key}`,
		"active": false,
		"type": "raster",
		"layout": {"visibility": "visible"},
		"paint": {"raster-opacity": 0.5},
		"beforeId": "rain-anchor",
		"onAddLayer": addRainLegend,
		"onRemoveLayer": removeRainLegend,
		"source": {
			"type": "raster",
			"tileSize": TILE_SIZE,
			"tiles" : [
				`${RAIN_PATH}?bbox={bbox-epsg-3857}&size=${TILE_SIZE/4},${TILE_SIZE/4}&dpi=96&format=png8&transparent=true&bboxSR=3857&imageSR=3857&layers=show:${layerId}&f=image`
			],
		},
	});
}

function addRainLegend(layer: layer.CyclemapLayerSpecification) {
	document.getElementById('rainLegend')!.style.visibility = 'visible';
}

function removeRainLegend(layer: layer.CyclemapLayerSpecification) {
	document.getElementById('rainLegend')!.style.visibility = 'hidden';
}

