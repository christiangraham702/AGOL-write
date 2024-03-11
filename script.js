require([
  "esri/config",
  "esri/Map",
  "esri/views/MapView",
  "esri/Graphic",
  "esri/layers/GraphicsLayer",
  "esri/layers/FeatureLayer",
  "esri/widgets/Editor",
  "esri/widgets/Legend"

], function (esriConfig, Map, MapView, Graphic, GraphicsLayer, FeatureLayer, Editor, Legend) {
  esriConfig.apiKey =
    "AAPK7a7ab4389a5d49e6baa08b2db7987c36t7-xSeM7W_C_4WgjNwvZHp-6iY2m0a50YtOBjTaD2LqDhdvOH-tzFAsITV2yCxlQ"; // Make sure to use your actual API key

  const map = new Map({
    basemap: "arcgis-topographic", // Basemap layer service
  });

  //
  const view = new MapView({
    map: map,
    // Longitude, latitude for Redwood National Park
    center: [-124.0046, 41.2132],
    zoom: 10, // Zoom level
    container: "viewDiv", // Div element
  });

  const graphicsLayer = new GraphicsLayer();
  map.add(graphicsLayer);

  const point = {
    //Create a point
    type: "point",
    longitude: -124.0046, //long lat of Redwood National Park
    latitude: 41.2132,
  };

  const simpleMarkerSymbol = {
    type: "simple-marker",
    color: [226, 119, 40], // Orange
    style: "diamond",
    outline: {
      color: [255, 255, 255], // White
      width: 1,
    },
  };

  const popupTemplate = {
    title: "{Name}",
    content: [
      {
        type: "text",
        text: "{Description}",
      },
      {
        type: "media",
        mediaInfos: [
          {
            type: "image",
            value: {
              sourceURL: "ewok.jpeg",
            },
            caption: "<i>A stud of an Ewok</i>",
          },
        ],
      },
      {
        type: "text",
        text: "<a href='https://starwars.fandom.com/wiki/Ewok'>Learn more about Ewoks here</a>",
      },
    ],
  };
  const attributes = {
    Name: "Home of the Ewoks",
    Description:
      "The forest moon of Endor is home to the Ewok species. It was filmed in the Redwood National Park. The line shows the path of the speeder in the chase (probably).",
  };

  const pointGraphic = new Graphic({
    geometry: point,
    symbol: simpleMarkerSymbol,

    attributes: attributes,
    popupTemplate: popupTemplate,
  });

  graphicsLayer.add(pointGraphic);

  // poly line
  const polyline = {
    type: "polyline",
    paths: [
      [-124.0046, 41.2132], // Coordinates of Redwood National Park
      [-124.0146, 41.2232], // Some other coordinates
      // Add more coordinates as needed
    ],
  };

  const simpleLineSymbol = {
    type: "simple-line",
    color: [226, 119, 40], // Orange
    width: 2,
  };

  const polylineGraphic = new Graphic({
    geometry: polyline,
    symbol: simpleLineSymbol,
  });

  graphicsLayer.add(polylineGraphic);

  const popupAirportsusa = {
    title: "Airports",
    content:
      "<b>Name:</b> {Fac_Name}<br><b>City:</b> {City}<br><b>State:</b> {State_Name}",
  };

  const airportLabels = {
    symbol: {
      type: "text",
      color: "#FFFFFF",
      haloColor: "#5E8D74",
      haloSize: "2px",
      font: {
        size: "12px",
        family: "Noto Sans",
        style: "italic",
        weight: "normal",
      },
    },
    labelPlacement: "above-center",
    labelExpressionInfo: {
      expression: "$feature.Fac_Name",
    },
  };

  const airportRenderer = {
    type: "simple",
    symbol: {
      type: "picture-marker",
      url: "outline_local_airport_black_24dp.png",
      width: "18px",
      height: "18px",
      opacity: 0.3,
    },
  };

  const airportsusaLayer = new FeatureLayer({
    url: "https://services.arcgis.com/LBbVDC0hKPAnLRpO/arcgis/rest/services/US_Airports_JS_STACK_READ/FeatureServer",
    outFields: ["Fac_Name", "City", "State_Name"],
    popupTemplate: popupAirportsusa,
    renderer: airportRenderer,
    definitionExpression: "Fac_Type = 'AIRPORT'",
    labelingInfo: [airportLabels],
  });
  map.add(airportsusaLayer);

  const heliRenderer = {
    type: "simple",
    symbol: {
      type: "picture-marker",
      url: "helicopter_FILL0_wght400_GRAD0_opsz24.png",
      width: "18px",
      height: "18px",
    },
  };

  const heliLayer = new FeatureLayer({
    url: "https://services.arcgis.com/LBbVDC0hKPAnLRpO/arcgis/rest/services/US_Airports_JS_STACK_READ/FeatureServer",
    outFields: ["Fac_Name", "City", "State_Name"],
    popupTemplate: popupAirportsusa,
    renderer: heliRenderer,
    definitionExpression: "Fac_Type = 'HELIPORT'",
    labelingInfo: [airportLabels],
  });

  map.add(heliLayer);

  const popupEduusa = {
    title: "EDUs",
    content:
      "<b>Name:</b> {INSTNM}<br><b>Total Enrollment:</b> {INSTSIZE}<br><b>City:</b> {CITY}<br><b>State:</b> {STABBR}",
  };

  //adding the Const for the feature layer
  const usaeduLayer = new FeatureLayer({
    url: "https://services2.arcgis.com/FiaPA4ga0iQKduv3/arcgis/rest/services/Colleges_and_Universities_View/FeatureServer",

    //adding the popup here
    outFields: ["NAME", "TOT_ENROLL"],
    popupTemplate: popupEduusa,
  });

  //adding the feature layer to the map
  map.add(usaeduLayer);

  // write
  const myAirports = new FeatureLayer({
    url: "https://services.arcgis.com/LBbVDC0hKPAnLRpO/arcgis/rest/services/Airports_Write/FeatureServer",
    outFields: ["AirportCode"],
    labelingInfo: [{
      labelExpressionInfo: { expression: "$feature.AirportCode" },
      symbol: {
        type: "text",
        color: "blue",
        haloColor: "white",
        haloSize: "1px",
        font: { size: 18 }
      },
      labelPlacement: "above-center"
    }],
    renderer: {
      type: "simple",  // autocasts as new SimpleRenderer()
      symbol: {
        type: "simple-marker",  // autocasts as new SimpleMarkerSymbol()
        style: "circle",
        color: "blue",
        size: "8px",  // pixels
        outline: {  // autocasts as new SimpleLineSymbol()
          color: [0, 0, 255],
          width: 3  // points
        }
      }
    }
  });

  map.add(myAirports);

  const pointInfos = {
    layer: myAirports,
  }

  const editor = new Editor({
    view: view,
    layerInfos: [pointInfos]
  });

  view.ui.add(editor, "top-right");


  const legend = new Legend({
    view: view,
    layerInfos: [
      {
        layer: airportsusaLayer,
        title: "Airports"
      },
      {
        layer: heliLayer,
        title: "Heliports"
      },
      {
        layer: usaeduLayer,
        title: "Colleges and Universities"
      },
      {
        layer: myAirports,
        title: "Airport Codes"
      }
    ]
  });
  view.ui.add(legend, "bottom-right");
});

