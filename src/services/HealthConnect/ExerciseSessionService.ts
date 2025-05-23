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
}

// Detay ekranı için type
export interface DetailedExerciseInfo {
    session: BasicExerciseInfo;
    calories: number;
    steps: number;
    distance: number;
    averageHeartRate: number | null;
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

    return records.map((session) => ({
        id: session.metadata?.id ?? `${session.startTime}-${session.endTime}`,
        startTime: session.startTime,
        endTime: session.endTime,
        exerciseType: session.exerciseType,
        exerciseName: getExerciseName(session.exerciseType),
        title: session.title,
    }));
};

// Seçilen bir egzersizin detaylarını getiren fonksiyon
export const fetchExerciseDetails = async (
    session: BasicExerciseInfo
): Promise<DetailedExerciseInfo> => {
    const { startTime, endTime } = session;
    console.log('🕒 Egzersiz zamanı:', startTime, '→', endTime);

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
    console.log('🔥 ActiveCaloriesBurned Records:', activeCaloriesData.records);
    console.log('🔥 TotalCaloriesBurned Records:', totalCaloriesData.records);
    activeCaloriesData.records.forEach((r, i) => {
        console.log(`Active #${i}: joule = ${r.energy}`);
    });

    totalCaloriesData.records.forEach((r, i) => {
        console.log(`Total #${i}: joule = ${r.energy}`);
    });


    const activeCalories = activeCaloriesData.records.reduce((sum, c) => {
        const record = c as unknown as ActiveCaloriesBurnedRecord;
        const joules = Number(record.energy ?? 0); // ✅ düzeltildi
        return sum + joules / 4184;
    }, 0);


    const totalCalories = totalCaloriesData.records.reduce((sum, c) => {
        const record = c as unknown as ActiveCaloriesBurnedRecord;
        const joules = Number(record.energy ?? 0); // ✅ düzeltildi
        return sum + joules / 4184;
    }, 0);



    const calories = activeCalories > 0 ? activeCalories : totalCalories;

    const steps = stepsData.records.reduce(
        (sum, s) => sum + ((s as StepsRecord).count ?? 0),
        0
    );

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
    };
};
