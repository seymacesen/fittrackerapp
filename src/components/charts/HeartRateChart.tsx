// src/components/charts/HeartRateChart.tsx
import React from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import dayjs from 'dayjs';

interface HeartRateSample {
    time: string;
    bpm: number;
}

interface Props {
    data: HeartRateSample[];
}

const mainHours = [0, 6, 12, 18, 24];
const mainLabels = ['00:00', '06:00', '12:00', '18:00', '00:00'];

const HeartRateChart: React.FC<Props> = ({ data }) => {
    if (!data || data.length === 0) return null;

    // Sort data by time
    const sortedData = [...data].sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());

    // If no data after sorting, return null
    if (sortedData.length === 0) return null;

    // Determine the time range based on the first and last data points
    const startTime = dayjs(sortedData[0].time);
    const endTime = dayjs(sortedData[sortedData.length - 1].time);
    const durationSeconds = endTime.diff(startTime, 'second');

    const values: number[] = sortedData.map(d => d.bpm);
    const labels: string[] = Array(values.length).fill('');

    // Generate dynamic labels based on the time range
    const labelCount = 5; // Start, 3 intermediate, End
    const labelTimes = Array.from({ length: labelCount }, (_, i) => {
        const time = startTime.add((durationSeconds / (labelCount - 1)) * i, 'second');
        return time.format('HH:mm');
    });

    // Place labels at approximately equal intervals in the labels array
    const labelIndexes = Array.from({ length: labelCount }, (_, i) => {
        return Math.floor((values.length - 1) * (i / (labelCount - 1)));
    });

    labelIndexes.forEach((index, i) => {
        if (index < labels.length) {
            labels[index] = labelTimes[i];
        }
    });


    return (
        <View style={styles.chartContainer}>
            <LineChart
                data={{
                    labels: labels,
                    datasets: [
                        {
                            data: values,
                        },
                    ],
                }}
                width={Dimensions.get('window').width - 64}
                height={220}
                yAxisSuffix=""
                withInnerLines={false}
                withOuterLines={false}
                withVerticalLabels={true} // Ensure vertical labels are shown
                withHorizontalLabels={true}
                chartConfig={{
                    backgroundGradientFrom: '#232323',
                    backgroundGradientTo: '#232323',
                    color: (opacity = 1) => `rgba(255, 82, 82, ${opacity})`,
                    labelColor: () => '#bbb',
                    decimalPlaces: 0,
                    propsForDots: {
                        r: '0',
                    },
                    propsForBackgroundLines: {
                        stroke: 'transparent',
                    },
                    strokeWidth: 2,
                }}
                bezier
                style={styles.chart}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    chartContainer: {
        backgroundColor: '#232323',
        borderRadius: 16,
        paddingVertical: 8,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 2,
    },
    chart: {
        borderRadius: 16,
    },
});

export default HeartRateChart;
