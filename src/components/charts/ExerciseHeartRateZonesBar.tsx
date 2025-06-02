import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
    age: number;
    data: number[];
    sampleTimes: string[];
}

const zoneColors = {
    light: '#1fb456',
    moderate: '#eead00',
    aerobic: '#f68202',
    anaerobic: '#eb3d3c',
    vo2max: '#ff0000',
};

const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60);
    return `${minutes} min ${remainingSeconds > 0 ? `${remainingSeconds} sec` : ''}`;
};

const ExerciseHeartRateZonesBar: React.FC<Props> = ({ age, data, sampleTimes }) => {
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

    // Calculate time spent in each zone based on sample intervals
    for (let i = 0; i < data.length; i++) {
        const bpm = data[i];
        if (bpm < zones.light.min) continue;

        // Calculate time interval for this sample
        const currentTime = new Date(sampleTimes[i]).getTime();
        const nextTime = i < sampleTimes.length - 1
            ? new Date(sampleTimes[i + 1]).getTime()
            : currentTime;
        const intervalSeconds = (nextTime - currentTime) / 1000;

        if (bpm < zones.light.max) zoneDurations.light += intervalSeconds;
        else if (bpm < zones.moderate.max) zoneDurations.moderate += intervalSeconds;
        else if (bpm < zones.aerobic.max) zoneDurations.aerobic += intervalSeconds;
        else if (bpm < zones.anaerobic.max) zoneDurations.anaerobic += intervalSeconds;
        else zoneDurations.vo2max += intervalSeconds;
    }

    const totalSeconds = Object.values(zoneDurations).reduce((sum, duration) => sum + duration, 0);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Heart rate zones during exercise</Text>
            <View style={styles.barContainer}>
                {Object.keys(zoneDurations).map((zone) => {
                    const duration = zoneDurations[zone as keyof typeof zoneDurations];
                    const percentage = totalSeconds > 0 ? (duration / totalSeconds) * 100 : 0;
                    return (
                        <View
                            key={zone}
                            style={[
                                styles.barSegment,
                                {
                                    width: `${percentage}%`,
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
                            <Text style={styles.zoneDuration}>
                                {formatDuration(zoneDurations[zone as keyof typeof zoneDurations])}
                            </Text>
                        </View>
                    </View>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
        backgroundColor: '#232323',
        borderRadius: 16,
        padding: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 16,
    },
    barContainer: {
        flexDirection: 'row',
        height: 8,
        borderRadius: 4,
        overflow: 'hidden',
    },
    barSegment: {
        height: '100%',
    },
    legendContainer: {
        marginTop: 16,
    },
    legendRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    colorBox: {
        width: 12,
        height: 12,
        borderRadius: 2,
        marginRight: 8,
    },
    legendTextContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    zoneName: {
        fontSize: 14,
        fontWeight: '500',
    },
    zoneDuration: {
        fontSize: 14,
        color: '#cccccc',
    },
});

export default ExerciseHeartRateZonesBar; 