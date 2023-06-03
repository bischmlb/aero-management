import mapboxgl, { FillLayer } from "mapbox-gl";
import * as zones from '../../assets/zones/zones.json'

enum EArea {
    DANGER = 'danger',
    SECURITY = 'security',
    NATURE = 'nature',
    ATTENTION = 'attention'
}

/**
 * Seems vite casts json obj to some weird module type. So we type cast
 * If you dont type cast to unknown first you get 'TS2352: Coversion... If this was intentional, convert the expression to 'unknown' first.'
 * https://github.com/microsoft/TypeScript/issues/28067
 **/
const ZONES = zones as unknown as { readonly default: GeoJSON.FeatureCollection }

// Area scheme definitions
const areaScheme = {
    [EArea.DANGER]: ['airportMilitary2', 'airportMilitary8', 'hems1', 'hems2', 'aerodrome2', 'aerodrome5', 'airportCommercial5', 'airportCommercial2'],
    [EArea.SECURITY]: ['military', 'embassy', 'castle', 'column3', 'prison', 'bufferSecurity'],
    [EArea.NATURE]: ['nature'],
    [EArea.ATTENTION]: ['gliderAerodrome3', 'waterAerodrome3', 'privateRunway3', 'parachute3', 'helipad1', 'bufferAttention']
}

// Color scheme definitions
const colorScheme = {
    [EArea.DANGER]: '#D35E60',
    [EArea.SECURITY]: '#7293CB',
    [EArea.NATURE]: '#84BA5B',
    [EArea.ATTENTION]: '#E1975C'
}

/**
 * create a new FeatureCollection source 
 **/
const newSource = (features: Array<GeoJSON.Feature<GeoJSON.Geometry>>): mapboxgl.AnySourceData => {
    return {
        type: 'geojson', data: {
            type: 'FeatureCollection',
            features
        }
    }
}

/**
 * Handle zones and classify them with their respective color schemes.
 * Return respective {@link mapboxgl.AnyLayer} for each zone
 */
const processZones = () => {
     const zones = ZONES.default.features;    

    /* AREA INITIALIZATIONS. TODO: optimize to one loop. THIS SHIT SUCKS ON PERF*/
    const danger = {id: EArea.DANGER, type: 'fill', source: EArea.DANGER, features: zones.filter((ft) => areaScheme[EArea.DANGER].includes(ft.properties?.typeId))}
    const security = {id: EArea.SECURITY, type: 'fill', source: EArea.SECURITY, features: zones.filter((ft) => areaScheme[EArea.SECURITY].includes(ft.properties?.typeId))}
    const nature = {id: EArea.NATURE, type: 'fill', source: EArea.NATURE, features: zones.filter((ft) => areaScheme[EArea.NATURE].includes(ft.properties?.typeId))}
    const attention = {id: EArea.ATTENTION, type: 'fill', source: EArea.ATTENTION, features: zones.filter((ft) => areaScheme[EArea.ATTENTION].includes(ft.properties?.typeId)) }
    

    // Add most severe zones last, so they will be on top of other layers
    return [attention, nature, security, danger]

}


/**
 * Initializes a new map, and sets up layout stuff
 */
export const initMap = (options: mapboxgl.MapboxOptions): mapboxgl.Map => {
    const processedZones = processZones()
    const tmp_map = new mapboxgl.Map(options)
    tmp_map.once('load', () => {
        processedZones.map((area) => {
            tmp_map.addSource(area.id, newSource(area.features))
            tmp_map.addLayer({
                ...area,
                id: `${area.id}-layer`,
                paint: {
                    "fill-color": colorScheme[area.id],
                    "fill-opacity": 0.3
                }
            } as FillLayer);    
        })
    })
    return tmp_map
}