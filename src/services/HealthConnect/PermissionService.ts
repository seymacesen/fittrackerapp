import {
    getSdkStatus,
    initialize,
    requestPermission,
    Permission,
    SdkAvailabilityStatus,
} from 'react-native-health-connect';

export const permissions: Permission[] = [
    { recordType: 'Steps', accessType: 'read' },
    { recordType: 'HeartRate', accessType: 'read' },
    { recordType: 'RestingHeartRate', accessType: 'read' },
    { recordType: 'ExerciseSession', accessType: 'read' },
    { recordType: 'SleepSession', accessType: 'read' },
    { recordType: 'BloodPressure', accessType: 'read' },
    { recordType: 'OxygenSaturation', accessType: 'read' },
    { recordType: 'Weight', accessType: 'read' },
    { recordType: 'MenstruationFlow', accessType: 'read' },
    { recordType: 'Vo2Max', accessType: 'read' },
    { recordType: 'TotalCaloriesBurned', accessType: 'read' },
    { recordType: 'ActiveCaloriesBurned', accessType: 'read' },
    { recordType: 'Distance', accessType: 'read' },
];

export const initHealthConnect = async () => {
    await initialize();

    const status = await getSdkStatus();
    if (status !== SdkAvailabilityStatus.SDK_AVAILABLE) {
        throw new Error('Health Connect is not available on this device.');
    }

    const result = await requestPermission(permissions);
    console.log('Permission result:', JSON.stringify(result, null, 2));
};
