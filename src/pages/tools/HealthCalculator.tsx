import { useState, useMemo } from 'react';
import {
  ShieldCheckIcon,
  BeakerIcon,
} from '@heroicons/react/24/outline';
import { Seo } from '../../components/Seo';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { useLanguage } from '../../lib/lang-context';

type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'very' | 'extra';
type Goal = 'cut' | 'maintain' | 'bulk';

export function HealthCalculator() {
  const { t, localePath } = useLanguage();
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [age, setAge] = useState<number>(30);
  const [weightKg, setWeightKg] = useState<number>(75);
  const [heightCm, setHeightCm] = useState<number>(178);
  const [activity, setActivity] = useState<ActivityLevel>('moderate');
  const [goal, setGoal] = useState<Goal>('maintain');

  const breadcrumbs = [
    { label: t.home, href: localePath('/') },
    { label: 'Tools', href: localePath('/tools') },
    { label: 'Health & Metabolic Calculator' },
  ];

  // Calculations
  const metrics = useMemo(() => {
    // 1. BMI = weight (kg) / (height (m))^2
    const heightM = heightCm / 100;
    const bmi = weightKg / (heightM * heightM);

    let bmiCategory = 'Normal';
    let bmiColor = 'text-emerald-500';
    if (bmi < 18.5) {
      bmiCategory = 'Underweight';
      bmiColor = 'text-amber-500';
    } else if (bmi >= 25 && bmi < 30) {
      bmiCategory = 'Overweight';
      bmiColor = 'text-amber-500';
    } else if (bmi >= 30) {
      bmiCategory = 'Obese';
      bmiColor = 'text-red-500';
    }

    // 2. BMR via Mifflin-St Jeor:
    // Men: 10 * weight(kg) + 6.25 * height(cm) - 5 * age + 5
    // Women: 10 * weight(kg) + 6.25 * height(cm) - 5 * age - 161
    const baseBmr = 10 * weightKg + 6.25 * heightCm - 5 * age;
    const bmr = gender === 'male' ? baseBmr + 5 : baseBmr - 161;

    // 3. TDEE
    const multipliers: Record<ActivityLevel, number> = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      very: 1.725,
      extra: 1.9,
    };
    const tdee = Math.round(bmr * multipliers[activity]);

    // 4. Goal adjusted calories
    let targetCalories = tdee;
    if (goal === 'cut') targetCalories = Math.round(tdee * 0.8);
    if (goal === 'bulk') targetCalories = Math.round(tdee * 1.15);

    // 5. Macro splits (Protein: 2g/kg, Fat: 25% cals, Carbs: remainder)
    const proteinGrams = Math.round(weightKg * 2.0);
    const proteinCals = proteinGrams * 4;
    const fatCals = targetCalories * 0.25;
    const fatGrams = Math.round(fatCals / 9);
    const carbCals = Math.max(0, targetCalories - proteinCals - fatCals);
    const carbGrams = Math.round(carbCals / 4);

    // 6. Water hydration (35ml per kg + exercise bonus)
    const waterLiters = (weightKg * 0.035 + (activity === 'sedentary' ? 0 : 0.5)).toFixed(1);

    return {
      bmi: parseFloat(bmi.toFixed(1)),
      bmiCategory,
      bmiColor,
      bmr: Math.round(bmr),
      tdee,
      targetCalories,
      proteinGrams,
      fatGrams,
      carbGrams,
      waterLiters,
    };
  }, [gender, age, weightKg, heightCm, activity, goal]);

  return (
    <div className="space-y-10 max-w-5xl mx-auto pb-16">
      <Seo
        title="Evidence-Based Health, BMI & Metabolic TDEE Calculator | Questo Tools"
        description="Calculate BMI, basal metabolic rate (BMR), total daily energy expenditure (TDEE), and macro-nutrient targets with zero server requests."
        pathname="/tools/health-calculator"
      />

      <Breadcrumbs items={breadcrumbs} />

      {/* Header */}
      <div className="space-y-3 border-b border-editorial-border pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono uppercase bg-editorial-surface border border-editorial-border text-editorial-text">
          <ShieldCheckIcon className="w-3.5 h-3.5 text-emerald-500" />
          <span>Mifflin-St Jeor Clinical Formulation • 100% Private Health Computation</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold font-sans tracking-tight text-editorial-text">
          Metabolic &amp; Health Architecture Calculator
        </h1>
        <p className="font-serif text-editorial-muted text-base sm:text-lg leading-relaxed max-w-3xl">
          Evaluate body composition indices, daily caloric burn thresholds, and precision macro-nutrient allocations without transmitting sensitive biometric data.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Biometric Inputs */}
        <div className="lg:col-span-5 space-y-4 bg-editorial-surface border border-editorial-border rounded-xl p-6">
          <div className="flex items-center justify-between border-b border-editorial-border pb-3">
            <span className="text-xs font-sans uppercase font-semibold text-editorial-text">Biometric Profile</span>
            <div className="flex bg-editorial-bg border border-editorial-border rounded-md p-0.5 text-[11px] font-mono">
              <button
                type="button"
                onClick={() => setGender('male')}
                className={`px-2 py-0.5 rounded-sm ${gender === 'male' ? 'bg-editorial-text text-editorial-bg font-bold' : 'text-editorial-muted'}`}
              >
                Male
              </button>
              <button
                type="button"
                onClick={() => setGender('female')}
                className={`px-2 py-0.5 rounded-sm ${gender === 'female' ? 'bg-editorial-text text-editorial-bg font-bold' : 'text-editorial-muted'}`}
              >
                Female
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-mono uppercase text-editorial-muted block mb-1">Age (Years)</label>
              <input
                type="number"
                min="14"
                max="100"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full bg-editorial-bg border border-editorial-border rounded-lg px-3 py-2 text-xs font-mono text-editorial-text"
              />
            </div>
            <div>
              <label className="text-[10px] font-mono uppercase text-editorial-muted block mb-1">Weight (kg)</label>
              <input
                type="number"
                min="30"
                max="250"
                value={weightKg}
                onChange={(e) => setWeightKg(Number(e.target.value))}
                className="w-full bg-editorial-bg border border-editorial-border rounded-lg px-3 py-2 text-xs font-mono text-editorial-text"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-mono uppercase text-editorial-muted block mb-1">Height (cm)</label>
            <input
              type="number"
              min="100"
              max="230"
              value={heightCm}
              onChange={(e) => setHeightCm(Number(e.target.value))}
              className="w-full bg-editorial-bg border border-editorial-border rounded-lg px-3 py-2 text-xs font-mono text-editorial-text"
            />
          </div>

          <div>
            <label className="text-[10px] font-mono uppercase text-editorial-muted block mb-1">Physical Activity</label>
            <select
              value={activity}
              onChange={(e) => setActivity(e.target.value as ActivityLevel)}
              className="w-full bg-editorial-bg border border-editorial-border rounded-lg px-3 py-2 text-xs font-sans text-editorial-text"
            >
              <option value="sedentary">Sedentary (Desk work, little exercise)</option>
              <option value="light">Lightly Active (1–3 days/week)</option>
              <option value="moderate">Moderately Active (3–5 days/week)</option>
              <option value="very">Very Active (6–7 days vigorous)</option>
              <option value="extra">Extra Active (Twice daily training)</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-mono uppercase text-editorial-muted block mb-1">Physiological Goal</label>
            <div className="grid grid-cols-3 gap-2">
              {(['cut', 'maintain', 'bulk'] as Goal[]).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGoal(g)}
                  className={`py-1.5 px-2 text-xs font-sans uppercase rounded-lg border transition-all cursor-pointer ${
                    goal === g
                      ? 'bg-editorial-text text-editorial-bg border-editorial-text font-bold'
                      : 'bg-editorial-bg text-editorial-text border-editorial-border hover:border-editorial-text'
                  }`}
                >
                  {g === 'cut' ? 'Fat Loss' : g === 'maintain' ? 'Maintain' : 'Muscle Gain'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-7 space-y-6">
          <div className="grid grid-cols-3 gap-3">
            {/* BMI Card */}
            <div className="p-4 bg-editorial-surface border border-editorial-border rounded-xl">
              <span className="text-[10px] font-mono text-editorial-muted uppercase block">Body Mass Index</span>
              <div className="text-xl sm:text-2xl font-mono font-bold text-editorial-text mt-1">
                {metrics.bmi}
              </div>
              <span className={`text-xs font-semibold ${metrics.bmiColor}`}>{metrics.bmiCategory}</span>
            </div>

            {/* BMR Card */}
            <div className="p-4 bg-editorial-surface border border-editorial-border rounded-xl">
              <span className="text-[10px] font-mono text-editorial-muted uppercase block">Basal BMR</span>
              <div className="text-xl sm:text-2xl font-mono font-bold text-editorial-text mt-1">
                {metrics.bmr}
              </div>
              <span className="text-[10px] font-mono text-editorial-muted">kcal / day resting</span>
            </div>

            {/* Target Cals */}
            <div className="p-4 bg-editorial-surface border border-editorial-border rounded-xl">
              <span className="text-[10px] font-mono text-editorial-muted uppercase block">Daily Target</span>
              <div className="text-xl sm:text-2xl font-mono font-bold text-emerald-500 mt-1">
                {metrics.targetCalories}
              </div>
              <span className="text-[10px] font-mono text-editorial-muted">kcal / day total</span>
            </div>
          </div>

          {/* Macro Breakdown */}
          <div className="bg-editorial-surface border border-editorial-border rounded-xl p-6 space-y-4">
            <span className="text-xs font-sans uppercase font-semibold text-editorial-text tracking-wider block">
              Precision Macro-Nutrient Split
            </span>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-3 bg-editorial-bg border border-editorial-border rounded-lg">
                <span className="text-[10px] font-mono uppercase text-editorial-muted block">Protein</span>
                <span className="text-lg font-mono font-bold text-editorial-text">{metrics.proteinGrams}g</span>
                <span className="text-[10px] font-mono text-editorial-muted block mt-0.5">
                  {metrics.proteinGrams * 4} kcal
                </span>
              </div>
              <div className="p-3 bg-editorial-bg border border-editorial-border rounded-lg">
                <span className="text-[10px] font-mono uppercase text-editorial-muted block">Carbohydrates</span>
                <span className="text-lg font-mono font-bold text-editorial-text">{metrics.carbGrams}g</span>
                <span className="text-[10px] font-mono text-editorial-muted block mt-0.5">
                  {metrics.carbGrams * 4} kcal
                </span>
              </div>
              <div className="p-3 bg-editorial-bg border border-editorial-border rounded-lg">
                <span className="text-[10px] font-mono uppercase text-editorial-muted block">Healthy Fats</span>
                <span className="text-lg font-mono font-bold text-editorial-text">{metrics.fatGrams}g</span>
                <span className="text-[10px] font-mono text-editorial-muted block mt-0.5">
                  {metrics.fatGrams * 9} kcal
                </span>
              </div>
            </div>

            {/* Hydration Metric */}
            <div className="pt-2 border-t border-editorial-border flex items-center justify-between text-xs font-mono">
              <span className="text-editorial-muted flex items-center gap-1.5">
                <BeakerIcon className="w-4 h-4 text-blue-500" />
                Minimum Recommended Water Intake
              </span>
              <span className="font-bold text-editorial-text">{metrics.waterLiters} Liters / Day</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
