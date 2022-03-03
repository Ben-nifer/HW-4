



$.getJSON('./data/mode-share.geojson', function(rawData) {

  mapboxgl.accessToken = 'pk.eyJ1IjoiYmVubmlmZXIiLCJhIjoiY2t6bmZpaTB4MmNyMjJucXIyM2s2a3M5OCJ9.yfIClB9zes7RF2saxS5JlA'

  var manCenter = [-73.948265, 40.795157] //somewhere on the upper east side. good center for just Manhattan


  var map = new mapboxgl.Map({
    container: 'mapContainer', // HTML container id
    style: 'mapbox://styles/mapbox/dark-v9', // look for something that can better display transit routes/ stops. Contextualize the numbers
    center: manCenter, // starting position as [lng, lat]
    zoom: 11,

  });

  map.on('load', function() {
    map.addSource('mode-share', {
      type: 'geojson',
      data: './data/mode-share.geojson'
    })

    map.addLayer({
      id: 'mode-share-fill',
      type: 'fill',
      source: 'mode-share',
      paint: {
        'fill-color': [
          'interpolate',
          ['linear'],
          ['get', 'MN_ModeShare_% Subway or elevated rail'],
          // blue/purp graidient from QGIS
          .08,
          '#edf8fb',
          .23,
          '#b3cde3',
          .38,
          '#8c96c6',
          .53,
          '#8856a7',
          .68,
          '#810f7c',
        ]
      }
    })

    map.on('click', function(e) {
      var features = map.queryRenderedFeatures(e.point)
      var featureOfInterestProperties = features[0].properties


      var ctNum = featureOfInterestProperties['NAMELSAD']
      var percSub = featureOfInterestProperties['MN_ModeShare_% Subway or elevated rail']
      var percWalk = featureOfInterestProperties['MN_ModeShare_% Walked']
      var percBus = featureOfInterestProperties['MN_ModeShare_% Bus']

      $('#sidebar-content-area').html(`
        <h4>${ctNum}</h4>
        <p> Share of commuters using the subway: ${numeral(percSub).format('0%')}</p>
        <p> Share of commuters using the bus: ${numeral(percBus).format('0%')}</p>
        <p> Share of commuters walking: ${numeral(percWalk).format('0%')}</p>
      `)

    })

  })
})
