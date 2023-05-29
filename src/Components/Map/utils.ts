import mapboxgl, { FillLayer } from "mapbox-gl";
import * as zones from '../../assets/zones/zones.json'

enum EArea {
    DANGER = 'danger',
    SECURITY = 'security',
    NATURE = 'nature',
    ATTENTION = 'attention'
}

/**
 * Seems vite type casts json obj to some weird module type. So we type cast
 * https://github.com/microsoft/TypeScript/issues/28067
 **/
const ZONES = zones as unknown as { readonly default: GeoJSON.FeatureCollection }

// Area scheme definitions
const areaScheme = {
    [EArea.DANGER]: ['airportMilitary2', 'airportMilitary8', 'hems1', 'hems2', 'aerodrome2', 'aerodrome5', 'airportCommercial5', 'airportCommercial2'],
    [EArea.SECURITY]: ['military', 'embassy', 'castle', 'column3', 'prison',],
    [EArea.NATURE]: ['nature'],
    [EArea.ATTENTION]: ['gliderAerodrome3', 'waterAerodrome3', 'privateRunway3', 'parachute3', 'helipad1']
}

// Color scheme definitions
const colorScheme = {
    [EArea.DANGER]: '#D35E60',
    [EArea.SECURITY]: '#7293CB',
    [EArea.NATURE]: '#84BA5B',
    [EArea.ATTENTION]: '#E1975C'
}

/**
 * Easy handle to create a new FeatureCollection source 
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
 * Convert points from static zones into buffer zones with point as centroid 
 */
const pointsToBufferZones = () => {
    // TODO still missing private runways and stuff which is represented as "Point" typeId in json
}

/**
 * Handle zones and classify them with their respective color schemes.
 * Return respective {@link mapboxgl.AnyLayer} for each zone
 */
const processZones = () => {
    const zones = ZONES.default;

    /* AREA INITIALIZATIONS. TODO: optimize to one loop. THIS SHIT SUCKS ON PERF*/
    const danger = {id: EArea.DANGER, type: 'fill', source: EArea.DANGER, features: zones.features.filter((ft) => areaScheme[EArea.DANGER].includes(ft.properties?.typeId))}
    const security = {id: EArea.SECURITY, type: 'fill', source: EArea.SECURITY, features: zones.features.filter((ft) => areaScheme[EArea.SECURITY].includes(ft.properties?.typeId))}
    const nature = {id: EArea.NATURE, type: 'fill', source: EArea.NATURE, features: zones.features.filter((ft) => areaScheme[EArea.NATURE].includes(ft.properties?.typeId))}
    const attention = {id: EArea.ATTENTION, type: 'fill', source: EArea.ATTENTION, features: zones.features.filter((ft) => areaScheme[EArea.ATTENTION].includes(ft.properties?.typeId))}
    
    return [danger, security, nature, attention]

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
                    "fill-opacity": 0.4
                }
            } as FillLayer);    
        })
    })
    return tmp_map
}