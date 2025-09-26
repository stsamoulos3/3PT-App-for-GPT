export enum WorkoutSource {
	HEALTHKIT = "HEALTHKIT",
	MANUAL = "MANUAL",
}

export type Workout = {
	hkId?: string | null;
	userId: string;
	activityType: string;
	startDate: Date;
	endDate: Date;
	totalDistanceMeters: number;
	totalEnergyBurnedKcal: number;
	workoutDurationSeconds: number;
	averageHeartRateBPM?: number;
	firstHeartRateTime?: Date;
	lastHeartRateTime?: Date;
	highestHeartRate?: number;
	lowestHeartRate?: number;
	source?: WorkoutSource;
	isDeleted?: boolean;
	deletedAt?: Date | null;
	MODEL1?: number;
	MODEL2?: number;
	MODEL3?: number;
	MODEL4?: number;
};
