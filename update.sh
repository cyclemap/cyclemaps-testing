#!/bin/bash

set -e #exit on failure

jq \
	--compact-output \
	'.' \
	style-input.json \
	> style.json

cp style.json style-normal.json
sed --expression='s/hsl(25, 60%, 45%)/red/2' style.json >style-red.json
sed \
	--expression='s/hsl(120, 60%, 30%)/hsl(0, 0%, 100%)/g' \
	--expression='s/hsl(25, 60%, 45%)/hsl(0, 0%, 100%)/1' \
	--expression='s/"line-color":"hsl(0, 0%, \(95\|97\|100\)%)"/&,"line-opacity":0.2/g' \
	--expression='s/"line-color":"hsl(25, 60%, 45%)","line-width":{[^{}]*}/"line-color":"red","line-width":{"base":1.1,"stops":[[9,4],[18,6]]}/' \
	style.json >style-highlight.json

sed --expression='s#pmtiles://https://aporter.org/map/cyclemaps.pmtiles#pmtiles://https://aporter.org/map/monaco.pmtiles#g' \
	style-red.json > style-testing.json

