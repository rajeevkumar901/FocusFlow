// components/stats/UsageChart.tsx
import React from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { ChartData } from 'react-native-chart-kit/dist/HelperTypes';

const screenWidth = Dimensions.get('window').width;

const chartConfig = {
    backgroundColor: '#023047',
    backgroundGradientFrom: '#023047',
    backgroundGradientTo: '#023047',
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(131, 225, 228, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: {
        borderRadius: 16,
    },
    propsForDots: {
        r: '6',
        strokeWidth: '2',
        stroke: '#83E1E4',
    },
};

type UsageChartProps = {
    data: ChartData;
};

const UsageChart = ({ data }: UsageChartProps) => {
    return (
        <View style={styles.container}>
            <Text style={styles.header}>Weekly Screen Time (Hours)</Text>
            <LineChart
                data={data}
                width={screenWidth - 32}
                height={220}
                yAxisSuffix="h"
                chartConfig={chartConfig}
                bezier
                style={{
                    marginVertical: 8,
                    borderRadius: 16,
                }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 16,
        paddingVertical: 16,
        elevation: 3,
        marginHorizontal: 16,
    },
    header: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
});

export default UsageChart;