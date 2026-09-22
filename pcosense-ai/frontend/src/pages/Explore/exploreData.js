// src/pages/Explore/exploreData.js
// Static content tree for the Explore page: 9 top-level categories, each with
// a set of subpoint topics. Every entry carries a MUI icon name (resolved to a
// component in ExploreIcon.jsx) used as a small label badge, a gradient pair
// for accents, and an `article` with the actual educational content shown
// when a subpoint is opened. Real cover photos are merged in below from
// topicImages.js, keyed by category id.
import { CATEGORY_IMAGES } from './topicImages.js';

export const EXPLORE_CATEGORIES = [
  {
    id: 'understanding-pmos',
    title: 'Understanding PMOS',
    description: 'The basics — what PMOS is, why it happens, and how it is diagnosed.',
    icon: 'MenuBook',
    gradient: ['#E91E63', '#EC407A'],
    subpoints: [
      { id: 'what-is-pmos', title: 'What is PMOS?', icon: 'HelpOutline', article: 'PMOS (Polyendocrine Metabolic Ovarian Syndrome) is one of the most common hormonal disorders in women of reproductive age, affecting roughly 1 in 10. It disrupts ovulation and hormone balance, and can look very different from one woman to the next — some develop ovarian cysts, others don’t, and symptoms can range from mild to significant.' },
      { id: 'causes-risk-factors', title: 'Causes & Risk Factors', icon: 'ReportProblem', article: 'PMOS is linked to a mix of genetics, insulin resistance, and hormonal imbalance. Having a mother or sister with PMOS raises your risk, and being overweight can worsen symptoms — though PMOS also affects women at a healthy weight. Researchers believe no single cause explains every case.' },
      { id: 'signs-symptoms', title: 'Signs & Symptoms', icon: 'Checklist', article: 'Common signs include irregular or missed periods, excess hair growth, acne, thinning scalp hair, and weight gain. Some women have few or no visible symptoms, which is why blood tests and ultrasound are often needed to confirm a diagnosis.' },
      { id: 'how-diagnosed', title: 'How PMOS is Diagnosed', icon: 'FactCheck', article: 'Diagnosis usually requires meeting at least two of three criteria: irregular ovulation, higher-than-typical androgen levels, and polycystic ovaries on ultrasound. Your doctor will also rule out thyroid and other hormonal conditions that can look similar.' },
      { id: 'hormones-pmos', title: 'Hormones & PMOS', icon: 'Biotech', article: 'PMOS involves elevated androgens (male hormones), which can suppress ovulation and drive symptoms like acne and excess hair. Levels of LH, FSH, and insulin are often imbalanced too, creating a cycle that keeps periods irregular.' },
      { id: 'insulin-metabolic', title: 'Insulin & Metabolic Changes', icon: 'MonitorHeart', article: 'Many women with PMOS have insulin resistance, meaning their cells respond less efficiently to insulin. The body compensates by producing more insulin, which can in turn raise androgen levels — a key reason diet and activity make such a difference.' },
      { id: 'test-results', title: 'Understanding Your Test Results', icon: 'Assessment', article: 'Typical tests include a hormone panel (LH, FSH, testosterone, AMH), fasting glucose or insulin, and a pelvic ultrasound. Your doctor interprets these together, not in isolation, so ask them to walk you through what each number means for you.' },
      { id: 'common-questions', title: 'Common Questions About PMOS', icon: 'QuestionAnswer', article: 'Common questions include whether PMOS goes away, whether it’s inherited, and whether treatment is lifelong. There’s no cure, but symptoms are very manageable with the right combination of lifestyle changes, medication, and regular monitoring.' },
    ],
  },
  {
    id: 'fertility-reproductive-health',
    title: 'Fertility & Reproductive Health',
    description: 'Conceiving, pregnancy, and reproductive options with PMOS.',
    icon: 'FavoriteBorder',
    gradient: ['#D81B60', '#BA68C8'],
    subpoints: [
      { id: 'pmos-fertility', title: 'PMOS & Fertility', icon: 'FavoriteBorder', article: 'PMOS is one of the leading causes of ovulatory infertility, but most women with PMOS can conceive — sometimes with lifestyle changes alone, sometimes with medical support like ovulation-inducing medication.' },
      { id: 'ovulation-fertility', title: 'Ovulation & Fertility', icon: 'Cyclone', article: 'Irregular or absent ovulation is the main fertility challenge in PMOS. Tracking cycles, basal body temperature, or ovulation predictor kits can help identify a fertile window, though results can be less predictable than in a typical cycle.' },
      { id: 'planning-pregnancy', title: 'Planning for Pregnancy', icon: 'EventNote', article: 'If you’re planning a pregnancy with PMOS, a pre-conception check-up is a good first step — reviewing weight, blood sugar, and any medications that should be adjusted before you try to conceive.' },
      { id: 'pregnancy-pmos', title: 'Pregnancy & PMOS', icon: 'PregnantWoman', article: 'Pregnancy with PMOS carries a somewhat higher risk of gestational diabetes, high blood pressure, and preterm birth, so extra monitoring is common. With good prenatal care, most women with PMOS have healthy pregnancies.' },
      { id: 'gestational-diabetes', title: 'Gestational Diabetes', icon: 'Bloodtype', article: 'Because PMOS is linked to insulin resistance, the risk of developing diabetes during pregnancy is higher. Screening usually happens earlier and more often, and it’s managed through diet, activity, and sometimes medication.' },
      { id: 'fertility-treatments', title: 'Fertility Treatments', icon: 'LocalHospital', article: 'First-line fertility treatment is often oral medication (like letrozole or clomiphene) to trigger ovulation. If that doesn’t work, options include injectable hormones or procedures such as ovarian drilling.' },
      { id: 'assisted-reproductive', title: 'Assisted Reproductive Options', icon: 'Biotech', article: 'When medication alone isn’t enough, assisted reproduction such as IUI (intrauterine insemination) or IVF (in vitro fertilization) can help. Women with PMOS often respond well to IVF, though careful monitoring helps avoid ovarian overstimulation.' },
      { id: 'fertility-questions', title: 'Fertility Questions to Ask Your Doctor', icon: 'QuestionAnswer', article: 'Good questions for your doctor: What’s causing my irregular ovulation? Which fertility treatment fits my situation? How does my weight or insulin resistance affect my chances? Should we test my partner too?' },
    ],
  },
  {
    id: 'periods-hormones',
    title: 'Periods & Hormones',
    description: 'How your cycle works, what changes with PMOS, and when to worry.',
    icon: 'CalendarMonth',
    gradient: ['#2196F3', '#8B5CF6'],
    subpoints: [
      { id: 'menstrual-cycle', title: 'Understanding Your Menstrual Cycle', icon: 'CalendarMonth', article: 'A typical cycle runs about 21–35 days, driven by a rise and fall of estrogen and progesterone that triggers ovulation and, if no pregnancy occurs, a period. PMOS can disrupt this rhythm at almost any stage.' },
      { id: 'irregular-periods', title: 'Irregular Periods', icon: 'EventBusy', article: 'Periods that come fewer than 8 times a year, or cycles longer than 35 days, are considered irregular and are one of the most common PMOS signs — usually because ovulation isn’t happening regularly.' },
      { id: 'heavy-light-periods', title: 'Heavy or Light Periods', icon: 'WaterDrop', article: 'When ovulation is infrequent, the uterine lining can build up longer than usual, leading to heavier bleeding when a period finally comes. Some women instead have very light or spotty periods.' },
      { id: 'period-tracking', title: 'Period Tracking', icon: 'Timeline', article: 'A period-tracking app or simple calendar helps spot patterns over time — useful both for your own awareness and for giving your doctor accurate cycle history at appointments.' },
      { id: 'ovulation-hormones', title: 'Ovulation & Hormones', icon: 'Science', article: 'Ovulation is triggered by a surge in luteinizing hormone (LH). In PMOS, LH is often chronically elevated relative to FSH, which can prevent that clean mid-cycle surge from happening.' },
      { id: 'hormonal-contraception', title: 'Hormonal Contraception', icon: 'Medication', article: 'Combined birth control pills are commonly prescribed to regulate cycles, reduce androgen-related symptoms like acne, and protect the uterine lining — even for women not trying to avoid pregnancy.' },
      { id: 'period-symptoms', title: 'Period-Related Symptoms', icon: 'Sick', article: 'Alongside irregular timing, PMOS periods can bring more intense cramping, mood changes, and premenstrual symptoms, often linked to the underlying hormonal imbalance rather than the period itself.' },
      { id: 'seek-medical-advice', title: 'When to Seek Medical Advice', icon: 'LocalHospital', article: 'See a doctor if you miss periods for 3+ months, bleed through a pad or tampon every hour, or have sudden, severe pelvic pain — these warrant prompt evaluation.' },
    ],
  },
  {
    id: 'skin-hair-body',
    title: 'Skin, Hair & Body',
    description: 'Managing acne, excess hair, hair thinning, and body confidence.',
    icon: 'Face',
    gradient: ['#FFA726', '#FB8C00'],
    subpoints: [
      { id: 'skin-changes', title: 'Skin Changes', icon: 'Face', article: 'Higher androgen levels can make skin oilier and more acne-prone, and some women develop darker, velvety patches of skin (acanthosis nigricans) at the neck or underarms — a visible sign of insulin resistance.' },
      { id: 'acne', title: 'Acne', icon: 'Healing', article: 'PMOS-related acne tends to appear along the jawline and chin and can be more stubborn than typical acne because it’s hormonally driven. Treatment often combines skincare, hormonal therapy, and sometimes prescription medication.' },
      { id: 'excess-hair', title: 'Excess Facial & Body Hair', icon: 'ContentCut', article: 'Excess hair growth (hirsutism) on the face, chest, or back happens when androgens stimulate hair follicles that are normally more dormant. It affects up to 70% of women with PMOS.' },
      { id: 'hair-thinning', title: 'Hair Thinning & Hair Loss', icon: 'AutoFixHigh', article: 'Scalp hair can thin in a male-pattern-like way (more noticeable at the crown or part line) due to androgen sensitivity — different from the all-over shedding seen with other hair loss causes.' },
      { id: 'hair-removal-options', title: 'Hair Removal Options', icon: 'Spa', article: 'Options range from shaving and waxing to threading, epilation, and depilatory creams. None of these change the underlying hormone levels, but they manage visible hair effectively in the short term.' },
      { id: 'laser-hair-removal', title: 'Laser Hair Removal', icon: 'FlashOn', article: 'Laser hair removal targets the pigment in hair follicles for longer-lasting reduction. It typically needs several sessions and works best alongside treatment that addresses the hormonal cause.' },
      { id: 'skin-hair-treatment', title: 'Treatment Options', icon: 'MedicalServices', article: 'Anti-androgen medication, hormonal birth control, and topical treatments are common options for skin and hair symptoms. A dermatologist and gynecologist working together often gives the best results.' },
      { id: 'body-image-skin', title: 'Body Image', icon: 'SelfImprovement', article: 'Visible symptoms like acne or excess hair can affect confidence. Treating the underlying hormone imbalance often helps symptoms fade over months, and support from others who understand PMOS can ease the emotional side too.' },
    ],
  },
  {
    id: 'long-term-health',
    title: 'Long-Term Health',
    description: 'How PMOS affects your heart, metabolism, and health over a lifetime.',
    icon: 'HealthAndSafety',
    gradient: ['#00897B', '#26C6DA'],
    subpoints: [
      { id: 'life-stages', title: 'PMOS Across Life Stages', icon: 'Timeline', article: 'PMOS can look different across life stages — irregular periods and fertility concerns in the 20s–30s, and a shifting focus toward metabolic and heart health risk after menopause, when protective estrogen declines.' },
      { id: 'blood-sugar-diabetes', title: 'Blood Sugar & Diabetes', icon: 'Bloodtype', article: 'Women with PMOS have a significantly higher lifetime risk of type 2 diabetes because of underlying insulin resistance. Regular blood sugar screening is recommended even without other symptoms.' },
      { id: 'heart-health', title: 'Heart Health', icon: 'Favorite', article: 'Insulin resistance, higher cholesterol, and higher blood pressure are all more common in PMOS, which raises long-term cardiovascular risk — making heart-healthy habits especially worthwhile.' },
      { id: 'metabolic-health', title: 'Metabolic Health', icon: 'MonitorHeart', article: 'Metabolic syndrome — the cluster of high blood sugar, high blood pressure, excess abdominal weight, and abnormal cholesterol — is more common in PMOS and is worth tracking with your doctor over time.' },
      { id: 'long-term-risks', title: 'Long-Term Health Risks', icon: 'WarningAmber', article: 'Beyond fertility, PMOS is linked to higher long-term risk of diabetes, cardiovascular disease, and endometrial changes from irregular shedding of the uterine lining. Regular check-ups help catch issues early.' },
      { id: 'disordered-eating', title: 'Eating & Disordered Eating', icon: 'Restaurant', article: 'The pressure around weight and appearance in PMOS can contribute to disordered eating patterns. If food or body image feels distressing, a therapist experienced in eating concerns can help alongside your medical care.' },
      { id: 'sleep-health', title: 'Sleep & Health', icon: 'Bedtime', article: 'PMOS is associated with higher rates of sleep apnea and poor sleep quality, partly linked to weight and hormone levels. Better sleep, in turn, can improve insulin sensitivity and mood.' },
      { id: 'health-screening', title: 'Health Screening', icon: 'FactCheck', article: 'Recommended screening often includes blood pressure, cholesterol, blood sugar or HbA1c, and mental health check-ins — done regularly, not just at diagnosis, since PMOS-related risks build over time.' },
    ],
  },
  {
    id: 'treatment-management',
    title: 'Treatment & Management',
    description: 'Medication, lifestyle care, and building the right healthcare team.',
    icon: 'MedicalServices',
    gradient: ['#1565C0', '#2196F3'],
    subpoints: [
      { id: 'managing-pmos', title: 'Managing PMOS', icon: 'TaskAlt', article: 'There’s no single cure for PMOS, but a combination of lifestyle changes, medication, and regular monitoring effectively manages most symptoms and reduces long-term health risks.' },
      { id: 'medicines', title: 'Medicines', icon: 'Medication', article: 'Common medications include hormonal birth control for cycle regulation, metformin for insulin resistance, and anti-androgens for hair and skin symptoms. Your doctor will tailor the combination to your goals.' },
      { id: 'hormonal-treatments', title: 'Hormonal Treatments', icon: 'Science', article: 'Hormonal treatments — birth control, progesterone therapy, or anti-androgens — help regulate periods, protect the uterine lining, and reduce androgen-driven symptoms like acne and excess hair.' },
      { id: 'insulin-resistance', title: 'Insulin Resistance', icon: 'Bloodtype', article: 'Improving insulin sensitivity through diet, exercise, and sometimes metformin can ease multiple PMOS symptoms at once, since insulin resistance is often a root driver of the hormone imbalance.' },
      { id: 'weight-management', title: 'Weight Management', icon: 'MonitorWeight', article: 'Even a modest weight loss of 5–10% can restore ovulation and improve symptoms for many women with PMOS, though weight isn’t the cause for everyone and management looks different case by case.' },
      { id: 'lifestyle-management', title: 'Lifestyle-Based Management', icon: 'DirectionsRun', article: 'Regular movement, a balanced low-glycemic diet, consistent sleep, and stress management together support hormone balance — often making a bigger difference than any single change alone.' },
      { id: 'complementary-approaches', title: 'Complementary Approaches', icon: 'Spa', article: 'Some women find added benefit from approaches like yoga, acupuncture, or specific supplements (such as inositol) alongside standard treatment — worth discussing with your doctor rather than replacing medical care.' },
      { id: 'health-monitoring', title: 'Health Monitoring', icon: 'MonitorHeart', article: 'Regular follow-up — tracking cycles, blood pressure, blood sugar, and how you’re feeling — helps your care team adjust treatment as your needs change over time.' },
      { id: 'healthcare-team', title: 'Working With Your Healthcare Team', icon: 'Groups', article: 'A gynecologist, and sometimes an endocrinologist, dietitian, dermatologist, or mental health professional, may all play a role. Building this team makes it easier to manage PMOS from every angle.' },
      { id: 'shared-decision-making', title: 'Shared Decision-Making', icon: 'Handshake', article: 'Because PMOS treatment involves trade-offs — like whether to prioritize fertility, symptom control, or long-term risk — it works best as a shared decision between you and your doctor, based on your goals.' },
    ],
  },
  {
    id: 'relationships-sexual-health',
    title: 'Relationships & Sexual Health',
    description: 'Intimacy, communication, and sexual well-being with PMOS.',
    icon: 'Favorite',
    gradient: ['#EF5350', '#F48FB1'],
    subpoints: [
      { id: 'pmos-sexual-health', title: 'PMOS & Sexual Health', icon: 'Favorite', article: 'PMOS can affect sexual health through hormone-driven changes in libido, vaginal dryness, or discomfort during sex — all things worth raising with your doctor rather than living with quietly.' },
      { id: 'intimacy-relationships', title: 'Intimacy & Relationships', icon: 'FavoriteBorder', article: 'Physical symptoms and emotional ups and downs from PMOS can sometimes strain intimacy. Openly sharing what you’re experiencing with a partner often eases pressure on both sides.' },
      { id: 'sexual-wellbeing', title: 'Sexual Well-being', icon: 'Spa', article: 'Sexual well-being with PMOS includes both physical comfort and emotional confidence. Addressing hormone imbalances and any body-image concerns together tends to help both.' },
      { id: 'body-image-intimacy', title: 'Body Image & Intimacy', icon: 'SelfImprovement', article: 'Symptoms like weight changes, acne, or excess hair can affect how comfortable you feel during intimacy. This is common, and treatment plus supportive conversations with a partner can help rebuild confidence.' },
      { id: 'communication-partner', title: 'Communication With Your Partner', icon: 'Forum', article: 'Explaining what PMOS is — and what it isn’t — helps partners understand mood shifts, fertility timelines, or the effort involved in managing symptoms, reducing misunderstandings.' },
      { id: 'fertility-relationships', title: 'Fertility & Relationships', icon: 'People', article: 'Fertility challenges from PMOS can bring stress into a relationship. Approaching it as a shared journey, and looping in a fertility specialist together, often helps couples feel less alone in it.' },
      { id: 'seek-support-relationships', title: 'When to Seek Support', icon: 'SupportAgent', article: 'If PMOS-related stress is affecting your relationship or self-esteem, a couples counselor or PMOS support group can provide tools and perspective beyond what medical treatment alone offers.' },
    ],
  },
  {
    id: 'body-image-wellbeing',
    title: 'Body Image & Well-being',
    description: 'Self-esteem, emotional health, and a kinder relationship with your body.',
    icon: 'SelfImprovement',
    gradient: ['#4A148C', '#BA68C8'],
    subpoints: [
      { id: 'weight-stigma', title: 'Understanding Weight Stigma', icon: 'ReportProblem', article: 'Weight is often unfairly treated as a personal failing rather than a symptom. PMOS makes weight harder to manage due to insulin resistance — and stigma from providers or others can add unnecessary shame.' },
      { id: 'body-image', title: 'Body Image', icon: 'SelfImprovement', article: 'Changes in weight, skin, and hair can shift how you see your body. Reconnecting with what your body does for you — not just how it looks — is a helpful starting point for many women.' },
      { id: 'self-esteem-confidence', title: 'Self-Esteem & Confidence', icon: 'EmojiEmotions', article: 'Confidence often dips when visible symptoms flare. Treating the underlying symptoms helps, but so does separating your self-worth from symptoms that are a medical condition, not a personal shortcoming.' },
      { id: 'emotional-wellbeing', title: 'Emotional Well-being', icon: 'SentimentSatisfied', article: 'PMOS is linked to higher rates of anxiety and depression, likely from a mix of hormonal effects and the emotional weight of managing a chronic condition. Naming this connection is often the first step to addressing it.' },
      { id: 'stress-pmos', title: 'Stress & PMOS', icon: 'Bolt', article: 'Stress raises cortisol, which can worsen insulin resistance and hormone imbalance — creating a loop where PMOS symptoms and stress feed each other. Stress-reduction practices can help break that cycle.' },
      { id: 'eating-concerns', title: 'Eating Concerns', icon: 'Restaurant', article: 'Diet advice for PMOS should never tip into restriction or guilt. If eating feels stressful or controlled by fear of symptoms, support from a dietitian who understands PMOS can help build a healthier relationship with food.' },
      { id: 'positive-relationship-body', title: 'Building a Positive Relationship With Your Body', icon: 'Favorite', article: 'Building a kinder relationship with your body often means focusing on function over appearance — what helps you feel energized, strong, and well, rather than chasing a specific look.' },
      { id: 'emotional-support', title: 'Getting Emotional Support', icon: 'SupportAgent', article: 'Support can come from a therapist, a PMOS support group, or trusted friends and family. You don’t have to manage the emotional side of PMOS alone — asking for support is a legitimate part of care.' },
    ],
  },
  {
    id: 'lifestyle-nutrition',
    title: 'Lifestyle & Nutrition',
    description: 'Food, movement, sleep, and daily habits that support hormone balance.',
    icon: 'Restaurant',
    gradient: ['#009E73', '#80DEEA'],
    subpoints: [
      { id: 'nutrition-balanced-eating', title: 'Nutrition & Balanced Eating', icon: 'Restaurant', article: 'A balanced, low-glycemic diet — whole grains, lean protein, vegetables, and healthy fats — helps stabilize blood sugar and insulin, which are central to managing PMOS symptoms.' },
      { id: 'food-pmos', title: 'Understanding Food & PMOS', icon: 'LocalDining', article: 'Foods that spike blood sugar quickly (refined carbs, sugary drinks) can worsen insulin resistance and androgen levels, while fiber-rich, minimally processed foods tend to help keep both steadier.' },
      { id: 'physical-activity', title: 'Physical Activity', icon: 'DirectionsRun', article: 'Regular movement improves insulin sensitivity independent of weight loss, meaning even modest, consistent activity can meaningfully improve PMOS symptoms.' },
      { id: 'exercise-movement', title: 'Exercise & Movement', icon: 'FitnessCenter', article: 'A mix of cardio and strength training tends to work best — cardio for insulin sensitivity, strength training for building muscle that helps regulate blood sugar over time.' },
      { id: 'sleep-recovery', title: 'Sleep & Recovery', icon: 'Bedtime', article: 'Poor sleep worsens insulin resistance and appetite-regulating hormones, making PMOS symptoms harder to manage. Aiming for consistent, quality sleep supports every other part of treatment.' },
      { id: 'stress-management', title: 'Stress Management', icon: 'SelfImprovement', article: 'Practices like mindfulness, yoga, or simply regular downtime lower cortisol, which can ease the hormonal imbalance at the core of PMOS over time.' },
      { id: 'healthy-daily-habits', title: 'Healthy Daily Habits', icon: 'CheckCircle', article: 'Small, sustainable habits — a consistent wake time, regular meals, short daily walks — tend to stick better than dramatic overhauls, and they add up meaningfully for PMOS management.' },
      { id: 'weight-metabolic-health', title: 'Weight & Metabolic Health', icon: 'MonitorWeight', article: 'Because PMOS ties weight closely to insulin and hormone levels, even modest, sustainable changes in activity and diet can improve metabolic health more than weight loss alone suggests.' },
      { id: 'lifestyle-goals', title: 'Setting Lifestyle Goals', icon: 'Flag', article: 'Setting specific, realistic goals — like a 20-minute walk most days, rather than a vague “get healthy” — makes lifestyle changes for PMOS easier to sustain long term.' },
    ],
  },
];

// Merge in the curated real photos: each category's first pool image becomes
// its cover photo, and subpoints cycle through the pool so every card gets a
// topic-appropriate image without needing one hand-picked photo per topic.
EXPLORE_CATEGORIES.forEach((category) => {
  const pool = CATEGORY_IMAGES[category.id] || [];
  category.coverImage = pool[0];
  category.subpoints.forEach((subpoint, index) => {
    subpoint.image = pool[index % pool.length];
  });
});
