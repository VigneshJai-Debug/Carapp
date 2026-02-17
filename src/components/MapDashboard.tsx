import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import MapView, { Marker, Polyline, UrlTile, PROVIDER_DEFAULT } from 'react-native-maps';
import { useAppStore } from '../store/useAppStore';

const { width, height } = Dimensions.get('window');

const MapDashboard: React.FC = () => {
    const mapRef = useRef<MapView>(null);
    const mapState = useAppStore((state) => state.mapState);

    // Follow user mode
    useEffect(() => {
        if (mapRef.current && mapState.latitude !== 0) {
            mapRef.current.animateCamera({
                center: {
                    latitude: mapState.latitude,
                    longitude: mapState.longitude,
                },
                heading: mapState.heading,
                pitch: 0,
                zoom: 17,
                altitude: 1000 // Zoom level approximation
            }, { duration: 500 });
        }
    }, [mapState.latitude, mapState.longitude, mapState.heading]);

    return (
        <View style={styles.container}>
            <MapView
                ref={mapRef}
                provider={PROVIDER_DEFAULT}
                style={styles.map}
                mapType="none" // We use custom tiles
                rotateEnabled={false} // Keep North Up as requested? Quote: "Map orientation fixed (north-up)" -> rotateEnabled={false}
                scrollEnabled={true}
                zoomEnabled={true}
                initialRegion={{
                    latitude: 37.78825, // Default SF
                    longitude: -122.4324,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                }}
            >
                <UrlTile
                    /**
                     * OpenStreetMap Tile Server
                     * Format: https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
                     * Note: In production, you might want to use a specific tile provider or cache.
                     */
                    urlTemplate="https://a.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    maximumZ={19}
                    flipY={false}
                />

                {/* Vehicle Marker */}
                {mapState.latitude !== 0 && (
                    <Marker
                        coordinate={{
                            latitude: mapState.latitude,
                            longitude: mapState.longitude
                        }}
                        anchor={{ x: 0.5, y: 0.5 }}
                        flat={true} // Rotates with map if map rotates, but here map is fixed north up.
                        rotation={mapState.heading}
                    >
                        {/* Simple Arrow or Dot for Vehicle. Using a View for custom high contrast marker */}
                        <View style={styles.vehicleMarker}>
                            <View style={styles.arrow} />
                        </View>
                    </Marker>
                )}

                {/* Path History */}
                <Polyline
                    coordinates={mapState.pathHistory}
                    strokeColor="#00FF00" // High contrast green
                    strokeWidth={4}
                />

            </MapView>

            {/* Range Overlay on Map */}
            <View style={styles.overlay}>

            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        borderRadius: 15,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: '#333',
    },
    map: {
        flex: 1,
    },
    vehicleMarker: {
        width: 20,
        height: 20,
        backgroundColor: 'cyan',
        borderRadius: 10,
        borderWidth: 2,
        borderColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
    },
    arrow: {
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderLeftWidth: 5,
        borderRightWidth: 5,
        borderBottomWidth: 10,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: 'blue',
        transform: [{ translateY: -2 }]
    },
    overlay: {
        position: 'absolute',
        bottom: 10,
        left: 10,
    }
});

export default MapDashboard;
