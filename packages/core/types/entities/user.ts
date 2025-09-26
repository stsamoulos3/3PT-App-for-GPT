export type CalorieCountingMethod = "MODEL1" | "MODEL2" | "MODEL3" | "MODEL4";

export type UserRole = "ADMIN" | "USER";

export type User = {
	id: string;
	email: string;
	first_name: string;
	last_name: string;
	dob: string | null;
	gender: string | null;
	role: UserRole;
	is3PTPatient: boolean | null;
	patientId: string | null;
	isMultidisciplinaryPatient: boolean | null;
	rmr: number | null;
	prescribedExerciseHR: number | null;
	hourlyCaloriesAtHR: number | null;
	prescribedDailyCalories: number | null;
	vo2Max: number | null;
	calorieCountingMethod: CalorieCountingMethod | null;
	emailVerified: boolean;
	emailVerificationToken: string | null;
	createdAt: string;
	updatedAt: string;
};
