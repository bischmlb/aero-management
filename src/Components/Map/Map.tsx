import mapboxgl from "mapbox-gl";
import { useEffect, useMemo, useRef, useState } from "react";
import { initMap } from "./utils";

const MAP_TOKEN = 'pk.eyJ1IjoibWxiMjIwMyIsImEiOiJjazlvMG1qMXUwN2VkM2ZwN2lrem5pM29kIn0.Zq3KTAN1Bp05v6Dw4NGOHg'
const MAP_CENTER: mapboxgl.LngLatLike = [10.771244, 56.176146]

enum EMapType {
    LIGHT = 'mapbox://styles/mapbox/light-v11',
    DARK = 'mapbox://styles/mapbox/dark-v11',
    SATELLITE = 'mapbox://styles/mapbox/satellite-v9',
    SATELLITE_STREETS = 'mapbox://styles/mapbox/satellite-streets-v11',
    STREETS = 'mapbox://styles/mapbox/streets-v11',
    OUTDOORS = 'mapbox://styles/mapbox/outdoors-v11',
    NAVIGATION_DAY = 'mapbox://styles/mapbox/navigation-day-v1',
    NAVIGATION_NIGHT = 'mapbox://styles/mapbox/navigation-night-v1',
}


/**
 * Mapbox Map component. Try not to change stuff here unless it is absolutely necessary.
 * Limit new map renders as much as possible.  
 * **Development**: Keep in mind hot reload triggers a new render also.
 **/
export const Map: React.FC = () => {
    const mapContainer = useRef<HTMLDivElement>(null);
    const [map, setMap] = useState<mapboxgl.Map>()
    const [zoom, setZoom] = useState(6);

    const loading = useMemo(() => map?.loaded(), [map])

    useEffect(() => {
        if (!map) {
            const newMap = initMap({
                container: mapContainer.current || '',
                accessToken: MAP_TOKEN,
                style: EMapType.DARK,
                center: MAP_CENTER,
                zoom: zoom,
                attributionControl: false,
            })
            setMap(newMap)
        }
    }, [map]);

    if (loading) {
        return <> LOADING </>
    }

    return (
        <div className='map'>
            <div ref={mapContainer} className='map-container' />
        </div>
    )

}