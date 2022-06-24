const lo = require('lodash')

const glEquiv = {
  'LineSymbolizer/stroke': 'paint/line-color',
  'LineSymbolizer/stroke-width': 'paint/line-width',

  'LinePatternSymbolizer/file': 'paint/line-pattern',

  'PolygonSymbolizer/fill': 'paint/fill-color',
  'PolygonSymbolizer/fill-opacity': 'paint/fill-opacity',

  'PolygonPatternSymbolizer/file': 'paint/background-pattern',

  'TextSymbolizer/size': 'layout/text-size',
  'TextSymbolizer/fill': 'paint/text-color',
  'TextSymbolizer/face-name': 'layout/text-font',
  'TextSymbolizer/wrap-width': 'layout/text-max-width',
  'TextSymbolizer/character-spacing': 'layout/text-letter-spacing',
  'TextSymbolizer/allow-overlap': 'layout/text-allow-overlap',
  'TextSymbolizer/justify-alignment': 'layout/text-justify',
  'TextSymbolizer/horizontal-alignment': 'layout/symbol-placement',
  'TextSymbolizer/placement': 'layout/symbol-placement',
  'TextSymbolizer/placements': '__omit__',
  'TextSymbolizer/vertical-alignment': '__omit__',
  'TextSymbolizer/placement-type': 'layout/symbol-placement',
  'TextSymbolizer/wrap-before': '__omit__',
  'TextSymbolizer/orientation': 'layout/text-rotate',
  'TextSymbolizer/text-transform': 'layout/text-transform',
  'TextSymbolizer/dx': 'layout/text-offset-x', // transitional equivalent
  'TextSymbolizer/dy': 'layout/text-offset-y', // transitional equivalent
  'TextSymbolizer/halo-fill': 'paint/text-halo-color',
  'TextSymbolizer/halo-radius': 'paint/text-halo-blur',
  'TextSymbolizer/minimum-distance': 'layout/symbol-spacing',
  'TextSymbolizer/avoid-edges': 'layout/symbol-avoid-edges',
  'TextSymbolizer/line-spacing': 'layout/text-line-height',
  'TextSymbolizer/spacing': 'layout/symbol-spacing',
  'TextSymbolizer/opacity': 'paint/text-opacity',
  'TextSymbolizer/label-position-tolerance': '__omit__',
  'TextSymbolizer/text-ratio': '__omit__',

  'ShieldSymbolizer/size': 'layout/text-size', // The size of the text for the shield-name property, in pixels.
  'ShieldSymbolizer/minimum-distance': 'layout/symbol-spacing',
  'ShieldSymbolizer/halo-fill': 'paint/text-halo-color',
  'ShieldSymbolizer/halo-radius': 'paint/text-halo-blur',
  'ShieldSymbolizer/placement': 'layout/symbol-placement',
  'ShieldSymbolizer/placement-type': 'layout/symbol-placement',
  'ShieldSymbolizer/placements': '__omit__',
  'ShieldSymbolizer/unlock-image': '__omit__',
  'ShieldSymbolizer/face-name': 'layout/text-font',
  'ShieldSymbolizer/fill': 'paint/text-color',
  'ShieldSymbolizer/avoid-edges': 'layout/symbol-avoid-edges',
  'ShieldSymbolizer/file': 'layout/icon-image',

  'MarkersSymbolizer/allow-overlap': 'layout/icon-allow-overlap',
  'MarkersSymbolizer/placement': 'layout/symbol-placement',
  'MarkersSymbolizer/width': 'layout/icon-size',
  'MarkersSymbolizer/file': 'layout/icon-image',
  'MarkersSymbolizer/marker-type': 'layout/icon-image',
  'MarkersSymbolizer/stroke': 'paint/circle-stroke-color',
  'MarkersSymbolizer/stroke-opacity': 'paint/circle-stroke-opacity',
  'MarkersSymbolizer/stroke-width': 'paint/circle-stroke-width',
  'MarkersSymbolizer/fill-opacity': 'paint/circle-opacity',
  'MarkersSymbolizer/fill': 'paint/circle-color',
  'MarkersSymbolizer/spacing': 'layout/symbol-spacing',
  'MarkersSymbolizer/opacity': '__omit__',

  'LineSymbolizer/smooth': '__omit__',
  'LineSymbolizer/rasterizer': '__omit__',
  'LineSymbolizer/stroke-dasharray': 'paint/line-dasharray',
  'LineSymbolizer/stroke-linecap': 'layout/line-cap',
  'LineSymbolizer/stroke-linejoin': 'layout/line-join',
  'LineSymbolizer/stroke-opacity': 'paint/line-opacity',

  'BuildingSymbolizer/height': '__omit__',
  'BuildingSymbolizer/fill': 'paint/fill-color',
}

const pixelToEm = (input) => Number(input) * 0.063 // presuming the base font-size is 16px
const ensureNumber = (input) => Number(input)
const stringToBoolean = (input) => input === 'true' // turn string representation of 'true' or 'false' to an actual boolean
const stringToArray = (input) => [input]

const glConv = {
  'LinePatternSymbolizer/file': (input) => ['image', input], // converting to "resolvedImage" expression in GL

  'PolygonSymbolizer/fill-opacity': ensureNumber,

  'PolygonPatternSymbolizer/file': (input) => ['image', input],

  'TextSymbolizer/allow-overlap': stringToBoolean,
  'TextSymbolizer/wrap-width': pixelToEm,
  'TextSymbolizer/face-name': stringToArray,
  'TextSymbolizer/character-spacing': pixelToEm,
  'TextSymbolizer/placement': () => 'point',
  'TextSymbolizer/placement-type': () => 'point',
  'TextSymbolizer/horizontal-alignment': () => 'point',
  'TextSymbolizer/orientation': ensureNumber,
  'TextSymbolizer/minimum-distance': ensureNumber,
  'TextSymbolizer/dx': pixelToEm,
  'TextSymbolizer/dy': pixelToEm,
  'TextSymbolizer/avoid-edges': stringToBoolean,
  'TextSymbolizer/halo-radius': ensureNumber,
  'TextSymbolizer/line-spacing': pixelToEm,
  'TextSymbolizer/spacing': ensureNumber,
  'TextSymbolizer/opacity': ensureNumber,
  'TextSymbolizer/size': ensureNumber,

  'ShieldSymbolizer/size': ensureNumber,
  'ShieldSymbolizer/halo-radius': ensureNumber,
  'ShieldSymbolizer/placement': () => 'point',
  'ShieldSymbolizer/placement-type': () => 'point',
  'ShieldSymbolizer/face-name': stringToArray,
  'ShieldSymbolizer/avoid-edges': stringToBoolean,
  'ShieldSymbolizer/minimum-distance': ensureNumber,
  'ShieldSymbolizer/file': (input) => ['image', input],

  'MarkersSymbolizer/allow-overlap': stringToBoolean,
  'MarkersSymbolizer/placement': () => 'point',
  'MarkersSymbolizer/width': () => 1, // marker is not a layer type in gl, converting to icon with sprite and set to original size (i.e. 100%)
  'MarkersSymbolizer/stroke-opacity': ensureNumber,
  'MarkersSymbolizer/stroke-width': ensureNumber,
  'MarkersSymbolizer/fill-opacity': ensureNumber,
  'MarkersSymbolizer/spacing': ensureNumber,
  'MarkersSymbolizer/file': (input) => ['image', input],
  'MarkersSymbolizer/marker-type': (input) => ['image', input],

  'LineSymbolizer/stroke-dasharray': (input) => input.replace(' ', '').split(','),
  'LineSymbolizer/stroke-opacity': ensureNumber,
}

let totalStyleProperties = 0

module.exports = function (layer) {
  var layers = []
  let missed = 0
  layer.rules.forEach(function (group, i) {
    group.forEach(function (subgroup, j) {
      subgroup.forEach(function (symbolizer, k) {
        const out = { id: layer.id, type: '', paint: {}, layout: {}, metadata: {} }
        symbolizer.properties.forEach(function (prop) {
          totalStyleProperties++
          try {
            const key = symbolizer.symbolizer + '/' + prop[0]
            let value = prop[1]

            // key filter
            if (glEquiv[key] === '__omit__') {
              return
            }
            const gltype = glEquiv[key].split('/')

            // value converter
            if (glConv[key]) {
              value = glConv[key](value)
            }

            // finalize
            out[gltype[0]][gltype[1]] = value

            // guess the most possible "type" in a GL style
            if (key === 'MarkersSymbolizer/marker-type' && value === 'ellipse') {
              // convert ellipse marker as in CartoCSS to circle as in GL
              out.type = 'circle'
            } else if (~['TextSymbolizer', 'ShieldSymbolizer', 'MarkersSymbolizer'].indexOf(symbolizer.symbolizer)) {
              out.type = 'symbol'
            } else if (~['LineSymbolizer', 'LinePatternSymbolizer'].indexOf(symbolizer.symbolizer)) {
              out.type = 'line'
            } else if (
              ~['PolygonSymbolizer', 'BuildingSymbolizer', 'PolygonPatternSymbolizer'].indexOf(symbolizer.symbolizer)
            ) {
              out.type = 'fill'
            } else {
              out.metadata['carto_key'] = key
              out.metadata['carto_val'] = value
              console.log('GL style "type" unknown yet:', key, '/', value)
            }
          } catch (e) {
            missed++
            console.log(symbolizer.symbolizer, '/', prop)
            console.log('no equivalent found for', symbolizer.symbolizer, '/', prop[0])
          }
        })
        out.__original__layer = layer.id
        if (symbolizer.zoom) {
          if (symbolizer.zoom.minzoom) out.minzoom = symbolizer.zoom.minzoom
          if (symbolizer.zoom.maxzoom) out.maxzoom = symbolizer.zoom.maxzoom
        }

        // merge text-offset to an array
        if (lo.get(out, ['layout', 'text-offset-x']) || lo.get(out, ['layout', 'text-offset-y'])) {
          const x = lo.get(out, ['layout', 'text-offset-x'], 0)
          const y = lo.get(out, ['layout', 'text-offset-y'], 0)
          out['layout']['text-offset'] = [x, y]
          delete out['layout']['text-offset-x']
          delete out['layout']['text-offset-y']
        }

        out.id = layer.id + [, i, j, k].join('-')

        layers.push(out)
      })
    })
  })
  console.log('unmatched carto styles in group:', missed)
  console.log('total styles properties so far:', totalStyleProperties)
  return layers
}
