import { readRecords } from 'react-native-health-connect';
import type {
    ExerciseSessionRecord,
    ActiveCaloriesBurnedRecord,
    StepsRecord,
    DistanceRecord,
    HeartRateRecord,
} from 'react-native-health-connect';
import { getExerciseName } from '../../utils/exerciseTypes';


// Basit listeleme verisi için type
export interface BasicExerciseInfo {
    id: string;
    startTime: string;
    endTime: string;
    exerciseType: number;
    exerciseName: string;
    title?: string;
    calories?: number;
}

// Detay ekranı için type
export interface DetailedExerciseInfo {
    session: BasicExerciseInfo;
    calories: number;
    steps: number;
    distance: number;
    averageHeartRate: number | null;
    heartRateSamples: Array<{ time: string; beatsPerMinute: number }>;
}


// Egzersiz geçmişini listeleyen fonksiyon
export const fetchExerciseSessions = async (): Promise<BasicExerciseInfo[]> => {
    const { records } = await readRecords<'ExerciseSession'>('ExerciseSession', {
        timeRangeFilter: {
            operator: 'between',
            startTime: '2023-01-01T00:00:00.000Z',
            endTime: new Date().toISOString(),
        },
    });

    const sessionsWithCalories = await Promise.all(records.map(async (session) => {
        const [activeCaloriesData] = await Promise.all([
            readRecords<'ActiveCaloriesBurned'>('ActiveCaloriesBurned', {
                timeRangeFilter: { operator: 'between', startTime: session.startTime, endTime: session.endTime },
            }),
        ]);

        const calories = activeCaloriesData.records.reduce((sum, c) => {
            const kcal = (c as any).energy?.inKilocalories ?? 0;
            return sum + kcal;
        }, 0);

        return {
            id: session.metadata?.id ?? `${session.startTime}-${session.endTime}`,
            startTime: session.startTime,
            endTime: session.endTime,
            exerciseType: session.exerciseType,
            exerciseName: getExerciseName(session.exerciseType),
            title: session.title,
            calories: calories > 0 ? calories : undefined,
        };
    }));

    return sessionsWithCalories;
};

// Seçilen bir egzersizin detaylarını getiren fonksiyon
export const fetchExerciseDetails = async (
    session: BasicExerciseInfo
): Promise<DetailedExerciseInfo> => {
    const { startTime, endTime } = session;

    const [activeCaloriesData, totalCaloriesData, stepsData, distanceData, heartRateData] = await Promise.all([
        readRecords<'ActiveCaloriesBurned'>('ActiveCaloriesBurned', {
            timeRangeFilter: { operator: 'between', startTime, endTime },
        }),
        readRecords<'TotalCaloriesBurned'>('TotalCaloriesBurned', {
            timeRangeFilter: { operator: 'between', startTime, endTime },
        }),
        readRecords<'Steps'>('Steps', {
            timeRangeFilter: { operator: 'between', startTime, endTime },
        }),
        readRecords<'Distance'>('Distance', {
            timeRangeFilter: { operator: 'between', startTime, endTime },
        }),
        readRecords<'HeartRate'>('HeartRate', {
            timeRangeFilter: { operator: 'between', startTime, endTime },
        }),
    ]);

    console.log('Exercise session time range:', { startTime, endTime });
    console.log('Steps data records:', stepsData.records);
    console.log('Steps data records length:', stepsData.records.length);

    const activeCalories = activeCaloriesData.records.reduce((sum, c) => {
        const kcal = (c as any).energy?.inKilocalories ?? 0;
        return sum + kcal;
    }, 0);

    const totalCalories = totalCaloriesData.records.reduce((sum, c) => {
        const kcal = (c as any).energy?.inKilocalories ?? 0;
        return sum + kcal;
    }, 0);

    const calories = activeCalories > 0 ? activeCalories : totalCalories;

    const steps = stepsData.records.reduce(
        (sum, s) => {
            const count = (s as StepsRecord).count ?? 0;
            console.log('Step record:', { count, startTime: s.startTime, endTime: s.endTime });
            return sum + count;
        },
        0
    );
    console.log('Total steps calculated:', steps);
    console.log('Exercise type:', session.exerciseType);

    const distance = distanceData.records.reduce(
        (sum, d) => sum + (d.distance?.inKilometers ?? 0),
        0
    );

    const heartRateSamples = (heartRateData.records as HeartRateRecord[]).flatMap(
        (record) => record.samples ?? []
    );

    const averageHeartRate =
        heartRateSamples.length > 0
            ? Math.round(
                heartRateSamples.reduce(
                    (sum, sample) => sum + (sample.beatsPerMinute ?? 0),
                    0
                ) / heartRateSamples.length
            )
            : null;

    return {
        session,
        calories,
        steps,
        distance,
        averageHeartRate,
        heartRateSamples: heartRateSamples.map(sample => ({
            time: sample.time,
            beatsPerMinute: sample.beatsPerMinute ?? 0
        }))
    };
};
