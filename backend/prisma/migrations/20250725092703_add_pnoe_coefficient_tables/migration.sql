-- CreateTable
CREATE TABLE "UserHrCalorieZone" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "hrMin" INTEGER NOT NULL,
    "hrMax" INTEGER NOT NULL,
    "caloriesPerMinute" DOUBLE PRECISION NOT NULL,
    "fatPercentage" DOUBLE PRECISION,
    "carbPercentage" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserHrCalorieZone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserVo2Profile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "estimatedVo2Max" DOUBLE PRECISION NOT NULL,
    "vo2EfficiencyCoefficient" DOUBLE PRECISION NOT NULL,
    "restingMetabolicRate" DOUBLE PRECISION,
    "hrVo2Slope" DOUBLE PRECISION,
    "hrVo2Intercept" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserVo2Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserRerMapping" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "hrRangeStart" INTEGER NOT NULL,
    "hrRangeEnd" INTEGER NOT NULL,
    "averageRerValue" DOUBLE PRECISION NOT NULL,
    "fatOxidationRate" DOUBLE PRECISION NOT NULL,
    "carbOxidationRate" DOUBLE PRECISION NOT NULL,
    "averageEeKcalPerMin" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserRerMapping_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserEeCoefficient" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "baseMetabolicRate" DOUBLE PRECISION NOT NULL,
    "hrMultiplier" DOUBLE PRECISION NOT NULL,
    "efficiencyFactor" DOUBLE PRECISION NOT NULL,
    "regressionR2" DOUBLE PRECISION,
    "hrEeIntercept" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserEeCoefficient_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserHrCalorieZone_userId_hrMin_hrMax_key" ON "UserHrCalorieZone"("userId", "hrMin", "hrMax");

-- CreateIndex
CREATE UNIQUE INDEX "UserVo2Profile_userId_key" ON "UserVo2Profile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserRerMapping_userId_hrRangeStart_hrRangeEnd_key" ON "UserRerMapping"("userId", "hrRangeStart", "hrRangeEnd");

-- CreateIndex
CREATE UNIQUE INDEX "UserEeCoefficient_userId_key" ON "UserEeCoefficient"("userId");

-- AddForeignKey
ALTER TABLE "UserHrCalorieZone" ADD CONSTRAINT "UserHrCalorieZone_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserVo2Profile" ADD CONSTRAINT "UserVo2Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRerMapping" ADD CONSTRAINT "UserRerMapping_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserEeCoefficient" ADD CONSTRAINT "UserEeCoefficient_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
