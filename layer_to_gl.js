const lo = require('lodash')

const glEquiv = {
  'LineSymbolizer/stroke': 'paint/line-color',
  'LineSymbolizer/stroke-width': 'paint/line-width',
  'PolygonSymbolizer/fill': 'paint/fill-color',
  'TextSymbolizer/size': 'layout/text-size',
  'TextSymbolizer/fill': 'layout/text-color',
  'TextSymbolizer/face-name': 'layout/text-font',
  'TextSymbolizer/wrap-width': 'layout/text-max-width',
  'TextSymbolizer/character-spacing': 'layout/text-letter-spacing',
  'TextSymbolizer/allow-overlap': 'layout/text-allow-overlap',
  'TextSymbolizer/justify-alignment': 'layout/text-justify',
  'TextSymbolizer/horizontal-alignment': 'layout/symbol-placement',
  'TextSymbolizer/placement': 'layout/symbol-placement',
  'TextSymbolizer/placements': '__omit__',
  'TextSymbolizer/vertical-alignment': '__omit__',
  'TextSymbolizer/placement-type': '__omit__',
  'TextSymbolizer/wrap-before': '__omit__',
  'TextSymbolizer/orientation': 'layout/text-rotate',
  'TextSymbolizer/text-transform': 'layout/text-transform',
  'TextSymbolizer/dx': 'layout/text-offset-x', // transitional equivalent
  'TextSymbolizer/dy': 'layout/text-offset-y', // transitional equivalent
  'TextSymbolizer/halo-fill': 'layout/text-halo-color',
  'TextSymbolizer/halo-radius': 'layout/text-halo-blur',
  'TextSymbolizer/minimum-distance': 'layout/symbol-spacing',
  'TextSymbolizer/avoid-edges': 'layout/symbol-avoid-edges',
  'TextSymbolizer/line-spacing': 'layout/text-line-height',
}

const pixelToEm = (input) => Number(input) * 0.063 // presuming the base font-size is 16px

const glConv = {
  'TextSymbolizer/wrap-width': pixelToEm,
  'TextSymbolizer/character-spacing': pixelToEm,
  'TextSymbolizer/placement': () => 'point',
  'TextSymbolizer/horizontal-alignment': () => 'point',
  'TextSymbolizer/orientation': (input) => Number(input),
  'TextSymbolizer/dx': pixelToEm,
  'TextSymbolizer/dy': pixelToEm,
  'TextSymbolizer/avoid-edges': (input) => input === 'true', // turn string representation of 'true' or 'false' to an actual boolean
  'TextSymbolizer/line-spacing': pixelToEm,
}

module.exports = function (layer) {
  var layers = []
  let missed = 0
  layer.rules.forEach(function (group, i) {
    group.forEach(function (subgroup, j) {
      subgroup.forEach(function (symbolizer, k) {
        const out = { id: layer.id, paint: {}, layout: {} }
        symbolizer.properties.forEach(function (prop) {
          try {
            const key = symbolizer.symbolizer + '/' + prop[0]
            let value = prop[1]
            if (glEquiv[key] === '__omit__') {
              return
            }
            const gltype = glEquiv[key].split('/')
            if (glConv[key]) {
              value = glConv[key](value)
            }
            out[gltype[0]][gltype[1]] = value
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
  console.log('total gl styles missed:', missed)
  return layers
}
