import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
    age: number;
    data: number[];
}

const formatDuration = (minutes: number) => {
    const hrs = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return `${hrs > 0 ? `${hrs} hour ` : ''}${mins} min`;
};

const HeartRateZonesBar: React.FC<Props> = ({ age, data }) => {
    const maxHR = 220 - age;

    const zones = {
        light: { min: 0.5 * maxHR, max: 0.6 * maxHR },
        moderate: { min: 0.6 * maxHR, max: 0.7 * maxHR },
        aerobic: { min: 0.7 * maxHR, max: 0.8 * maxHR },
        anaerobic: { min: 0.8 * maxHR, max: 0.9 * maxHR },
        vo2max: { min: 0.9 * maxHR, max: maxHR },
    };

    const zoneDurations = {
        light: 0,
        moderate: 0,
        aerobic: 0,
        anaerobic: 0,
        vo2max: 0,
    };

    data.forEach((bpm) => {
        if (bpm < zones.light.min) return;
        else if (bpm < zones.light.max) zoneDurations.light += 1;
        else if (bpm < zones.moderate.max) zoneDurations.moderate += 1;
        else if (bpm < zones.aerobic.max) zoneDurations.aerobic += 1;
        else if (bpm < zones.anaerobic.max) zoneDurations.anaerobic += 1;
        else zoneDurations.vo2max += 1;
    });

    const totalMinutes = data.length || 1;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Heart rate zone</Text>
            <View style={styles.barContainer}>
                {Object.keys(zoneDurations).map((zone) => {
                    const width = zoneDurations[zone as keyof typeof zoneDurations];
                    return (
                        <View
                            key={zone}
                            style={[
                                styles.barSegment,
                                {
                                    flex: width,
                                    backgroundColor: zoneColors[zone as keyof typeof zoneColors],
                                },
                            ]}
                        />
                    );
                })}
            </View>
            <View style={styles.legendContainer}>
                {Object.keys(zoneDurations).map((zone) => (
                    <View key={zone} style={styles.legendRow}>
                        <View style={[styles.colorBox, { backgroundColor: zoneColors[zone as keyof typeof zoneColors] }]} />
                        <View style={styles.legendTextContainer}>
                            <Text style={[styles.zoneName, { color: zoneColors[zone as keyof typeof zoneColors] }]}>
                                {zone.charAt(0).toUpperCase() + zone.slice(1).replace('vo2max', 'VO₂ max')}
                            </Text>
                            <Text style={styles.zoneDuration}>{formatDuration(zoneDurations[zone as keyof typeof zoneDurations])}</Text>
                        </View>
                    </View>
                ))}
            </View>
        </View>
    );
};

const zoneColors = {
    light: '#269ae9',
    moderate: '#1fb456',
    aerobic: '#eead00',
    anaerobic: '#f68202',
    vo2max: '#eb3d3c',
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#1e1e1e',
        borderRadius: 12,
        marginHorizontal: 16,
        marginBottom: 24,
        padding: 12,
    },
    title: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    barContainer: {
        flexDirection: 'row',
        height: 14,
        borderRadius: 8,
        overflow: 'hidden',
        marginBottom: 12,
    },
    barSegment: {
        height: '100%',
    },
    legendContainer: {
        gap: 8,
        marginTop: 8,
    },
    legendRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    colorBox: {
        width: 18,
        height: 18,
        borderRadius: 4,
        marginRight: 10,
    },
    legendTextContainer: {
        flexDirection: 'column',
    },
    zoneName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    zoneDuration: {
        fontSize: 14,
        color: '#ccc',
        marginTop: -2,
    },
});

export default HeartRateZonesBar;
