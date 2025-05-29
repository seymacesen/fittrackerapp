import React from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import { LineChart } from 'react-native-chart-kit'; // Using LineChart to match HeartRateChart

interface CalorieSample {
    time: string;
    calories: number; // Changed from bpm
}

interface Props {
    data: CalorieSample[];
    chartColor?: string; // Add chartColor prop
}

function getDecimalHour(time: string) {
    // time: '2025-05-17T06:00:00' veya '06:00' gibi olabilir
    let date;
    if (time.includes('T')) {
        date = new Date(time);
        return date.getHours() + date.getMinutes() / 60;
    } else {
        const [h, m] = time.split(':').map(Number);
        return h + (m || 0) / 60;
    }
}

// Helper function to convert hex to rgba
const hexToRgba = (hex: string, alpha = 1) => {
    const bigint = parseInt(hex.replace('#', ''), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const mainHours = [0, 6, 12, 18, 24];
const mainLabels = ['00:00', '06:00', '12:00', '18:00', '00:00'];

const CalorieChart: React.FC<Props> = ({ data, chartColor }) => {
    if (!data || data.length === 0) return null;

    // Saatleri decimal olarak al
    const normalizedData = data.map((item) => ({
        x: getDecimalHour(item.time),
        y: item.calories, // Using calories
    }));

    const values = normalizedData.map((d) => d.y);
    const totalPoints = values.length;

    // 5 ana saat label'ı için indeksleri hesapla
    const labelIndexes = [0, Math.floor(totalPoints * 0.25), Math.floor(totalPoints * 0.5), Math.floor(totalPoints * 0.75), totalPoints - 1];
    const labels = Array(totalPoints).fill('');
    labelIndexes.forEach((idx, i) => {
        if (labels[idx] !== undefined) labels[idx] = mainLabels[i];
    });

    const defaultChartColor = '#f46409'; // Default orange color
    const chartLineColor = chartColor || defaultChartColor;

    return (
        <View style={styles.chartContainer}>
            <LineChart // Using LineChart to match HeartRateChart
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
                    backgroundGradientFrom: '#121212', // Darker background
                    backgroundGradientTo: '#121212', // Darker background
                    color: (opacity = 1) => hexToRgba(chartLineColor, opacity), // Use hexToRgba helper
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
        backgroundColor: '#121212', // Darker background
        borderRadius: 16,
        paddingVertical: 8,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 2,
    },
    chart: {
        borderRadius: 16,
    },
    labelRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: Dimensions.get('window').width - 64,
        paddingHorizontal: 8,
        marginTop: 4,
    },
    label: {
        color: '#bbb',
        fontSize: 12,
    },
});

export default CalorieChart; 