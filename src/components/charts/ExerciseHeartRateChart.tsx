import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

interface HeartRateSample {
    time: string;
    bpm: number;
}

interface Props {
    data: HeartRateSample[];
}

const formatTimeLabel = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const ExerciseHeartRateChart: React.FC<Props> = ({ data }) => {
    if (!data || data.length === 0) return null;

    // Calculate total duration in seconds
    const startTime = new Date(data[0].time).getTime();
    const endTime = new Date(data[data.length - 1].time).getTime();
    const totalDurationSeconds = (endTime - startTime) / 1000;

    // ✅ Etiketleri örnek zamanlara göre hesapla
    const labelCount = Math.min(5, Math.floor(data.length / 5) + 1);
    const labels = Array.from({ length: labelCount }, (_, i) => {
        const index = Math.floor((data.length - 1) * (i / (labelCount - 1)));
        const relativeTime = (new Date(data[index].time).getTime() - startTime) / 1000;
        return formatTimeLabel(relativeTime);
    });

    const values = data.map(d => d.bpm);

    return (
        <View style={styles.chartContainer}>
            <LineChart
                data={{
                    labels,
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
                    color: (opacity = 1) => `rgba(211, 47, 47, ${opacity})`,
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

export default ExerciseHeartRateChart;
