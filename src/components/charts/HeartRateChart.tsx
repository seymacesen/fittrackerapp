// src/components/charts/HeartRateChart.tsx
import React from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

interface HeartRateSample {
    time: string;
    bpm: number;
}

interface Props {
    data: HeartRateSample[];
}

function getDecimalHour(time: string) {
    let date;
    if (time.includes('T')) {
        date = new Date(time);
        return date.getHours() + date.getMinutes() / 60;
    } else {
        const [h, m] = time.split(':').map(Number);
        return h + (m || 0) / 60;
    }
}

const mainHours = [0, 6, 12, 18, 24];
const mainLabels = ['00:00', '06:00', '12:00', '18:00', '00:00'];

const HeartRateChart: React.FC<Props> = ({ data }) => {
    if (!data || data.length === 0) return null;

    const values = data.map(d => d.bpm);
    const totalPoints = values.length;

    const labelIndexes = [0, Math.floor(totalPoints * 0.25), Math.floor(totalPoints * 0.5), Math.floor(totalPoints * 0.75), totalPoints > 0 ? totalPoints - 1 : 0];

    const labels = Array(totalPoints).fill('');
    labelIndexes.forEach((idx, i) => {
        if (labels[idx] !== undefined) labels[idx] = mainLabels[i];
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
                withVerticalLabels={true}
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
