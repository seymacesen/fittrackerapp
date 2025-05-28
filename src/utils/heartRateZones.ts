export interface HeartRateZone {
    name: string;
    min: number;
    max: number;
    color: string;
}

export const getHeartRateZones = (age: number): HeartRateZone[] => {
    const maxHR = 220 - age;

    return [
        { name: 'Rest', min: 0, max: 0.5 * maxHR, color: '#269ae9' },
        { name: 'Fat Burn', min: 0.5 * maxHR, max: 0.6 * maxHR, color: '#1fb456' },
        { name: 'Cardio', min: 0.6 * maxHR, max: 0.7 * maxHR, color: '#eead00' },
        { name: 'Aerobic', min: 0.7 * maxHR, max: 0.85 * maxHR, color: '#f68202' },
        { name: 'Anaerobic', min: 0.85 * maxHR, max: maxHR, color: '#eb3d3c' },
    ];
};
