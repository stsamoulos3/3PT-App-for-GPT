# Workout Calorie Burn Investigation

## Current Implementation

### Data Sources

1. **HealthKit Integration**: Primary source for workout data from iOS Health app

   - Located in: `apps/mobile-app/src/services/HealthService.ts`
   - Method: `getWorkouts()` - retrieves `totalEnergyBurned?.quantity`

2. **Custom Calculation**: Secondary calculation using physiological data

   - Method: `getBurntCalories()` in HealthService
   - Uses heart rate, VO2 max, weight, age, and gender

3. **Manual Entry**: Users can manually create and edit workouts
   - Editable in WorkoutCard component
   - Stored as `totalEnergyBurnedKcal` in database

### Calculation Formula

**For Males:**

```javascript
caloriesBurned =
  durationMinutes *
  ((0.634 * averageHeartRate +
    0.404 * vo2Max +
    0.394 * weightKg +
    0.271 * age -
    95.7735) /
    4.184);
```

**For Females:**

```javascript
caloriesBurned =
  durationMinutes *
  ((0.45 * averageHeartRate +
    0.38 * vo2Max +
    0.103 * weightKg +
    0.274 * age -
    59.3954) /
    4.184);
```

## Potential Issues Identified

### 1. Data Consistency

- **Issue**: Conflict between HealthKit data and custom calculations
- **Location**: `WorkoutCard.tsx` line 417 shows `{Math.round(workout.totalEnergyBurnedKcal)} cal`
- **Impact**: Users might see inconsistent calorie values

### 2. Missing Required Data

- **Issue**: Formula requires heart rate, VO2 max, weight, age - if any are missing, calculation fails
- **Code**: `if (Number.isNaN(caloriesBurned)) { caloriesBurned = 0; }`
- **Impact**: Zero calories shown when data is incomplete

### 3. Formula Limitations

- **Issue**: Single formula for all workout types (running, cycling, swimming, etc.)
- **Impact**: Inaccurate for activities with different metabolic demands

### 4. Heart Rate Data Quality

- **Issue**: Average heart rate calculation depends on continuous monitoring
- **Code**: `getAverageHeartRateDuringWorkout()` may return 0 if no data
- **Impact**: Significant underestimation of calories

### 5. Weight Data Freshness

- **Issue**: Uses most recent weight measurement, which might be outdated
- **Code**: `limit: 1` in weight query
- **Impact**: Calculations based on old weight data

### 6. Distance Unit Confusion

- **Issue**: Distance shown as miles but stored as meters
- **Code**: `{workout.totalDistanceMeters.toFixed(2)} miles`
- **Impact**: Incorrect distance display (should convert meters to miles)

## Recommendations

### Immediate Fixes

1. **Fix Distance Display**: Convert meters to miles for display

   ```javascript
   {
     (workout.totalDistanceMeters * 0.000621371).toFixed(2);
   }
   miles;
   ```

2. **Improve Data Validation**: Add checks for required data before calculation

3. **Fallback Strategy**: Use HealthKit data as primary, custom calculation as fallback

### Medium-term Improvements

1. **Activity-Specific Formulas**: Different calculations for different workout types
2. **Data Quality Indicators**: Show users when data is incomplete
3. **Multiple Data Sources**: Cross-validate between HealthKit and custom calculations

### Long-term Enhancements

1. **Machine Learning**: Train models on user-specific data for better accuracy
2. **Wearable Integration**: Direct integration with fitness trackers for better data
3. **Metabolic Profiling**: Personalized metabolic rates based on user history

## Files to Investigate Further

- `apps/mobile-app/src/services/HealthService.ts` (lines 738-819)
- `apps/mobile-app/src/components/screens/home/Workouts/WorkoutCard.tsx` (lines 417, 428)
- `apps/mobile-app/src/components/screens/home/ActiveWorkoutCard.tsx` (calorie tracking during workout)

## Testing Recommendations

1. Test with missing heart rate data
2. Test with missing weight data
3. Test with missing VO2 max data
4. Compare results with popular fitness apps
5. Test distance display accuracy
