// src/pages/Explore/exploreData.js
import { CATEGORY_IMAGES } from './topicImages.js';

const CLINICAL_PERSPECTIVE = `**Clinical perspective**\nThe appropriate interpretation of this topic depends on the person's age, reproductive stage, symptoms, medical history, medications, and individual risk factors. Current international guidance emphasizes individualized assessment and shared decision-making. Educational content should therefore be used to understand the condition and prepare questions for a qualified healthcare professional, rather than to make a diagnosis or start, stop, or change treatment independently.`;

const WHEN_TO_SEEK_MEDICAL_ADVICE = `**When to seek medical advice**\nMedical review is particularly important when symptoms are new, rapidly worsening, severe, associated with pregnancy, or causing substantial functional or emotional distress. Urgent assessment may be needed for severe bleeding with weakness or fainting, severe pelvic pain, symptoms of a medical emergency, or thoughts of self-harm. This educational article is not intended to provide an individual diagnosis or replace professional medical care.`;

const PATIENT_EDUCATION = `For patient education, the most useful approach is to connect the scientific concept with observable symptoms, relevant screening, and the person's own goals. The information should encourage questions and shared decision-making rather than present one universal treatment pathway.`;

const CLINICAL_SIGNIFICANCE = `The clinical significance of this topic depends on the individual's symptoms, reproductive goals, metabolic profile, medications, and other health conditions. For that reason, educational information should support informed discussion with a healthcare professional rather than replace individualized assessment.`;

const PSYCH_WELLBEING = `Psychological well-being is an integral part of PMOS care. Appearance-related symptoms, fertility concerns, chronic disease management, stigma, and uncertainty can affect mood and quality of life. The relationship is bidirectional: psychological distress can make healthy routines and healthcare engagement more difficult, while effective symptom management and appropriate psychological support can improve well-being.`;

const PRACTICAL_ASSESSMENT_PSYCH = `A practical assessment should ask how the concern affects sleep, eating, relationships, work or study, physical activity, and willingness to seek care. When distress is persistent or functionally impairing, psychological support should be considered alongside treatment of physical symptoms. Support should be respectful and should not reinforce weight or appearance stigma.`;

const SEXUAL_RELATIONSHIP_HEALTH = `Sexual and relationship health should be approached as individual quality-of-life domains rather than assumed consequences of PMOS. Menstrual symptoms, infertility, body-image concerns, mood symptoms, pain, and medication effects may influence intimacy differently for different people. Confidential communication allows the underlying concern to be identified without attributing every sexual or relationship difficulty to hormones.`;

const SPECIFIC_PROBLEM_ID = `People may find it useful to identify the specific problem—desire, arousal, pain, fertility stress, body-image concern, communication difficulty, or another factor—because each may require a different response. Confidential discussion with a qualified clinician can help separate medical causes from psychological or relationship factors and identify appropriate support.`;

const REPRODUCTIVE_ISSUE = `The key reproductive issue in PMOS is often inconsistent ovulation. Follicular development may stall before a mature follicle is released, leading to long or unpredictable cycles and reduced probability of conception in a given cycle. This does not mean that pregnancy is impossible. Fertility evaluation should consider age and other infertility factors, and treatment can be highly effective when anovulation is the main problem.`;

const PRACTICAL_CONSULTATION = `In practice, a useful consultation should establish the person's reproductive goal first: avoiding pregnancy, planning pregnancy later, or trying to conceive now. The same symptom may be managed differently in each situation. Medication safety in pregnancy, ovulation status, glucose regulation, blood pressure, and other infertility factors should be considered before treatment is selected.`;

const MENSTRUAL_PATTERNS = `Menstrual patterns provide useful information about ovulatory function, but bleeding itself does not prove that ovulation occurred. Long intervals without a period may also have implications for endometrial health. For this reason, persistent menstrual irregularity deserves clinical attention even when symptoms are otherwise mild. A menstrual record can make consultations more precise and help evaluate treatment response.`;

const MENSTRUAL_DIARY = `A menstrual diary can record the first day of bleeding, number of bleeding days, spotting, unusually heavy flow, pain, and relevant medication use. For people trying to conceive, the diary can also record intercourse and possible ovulation indicators, while recognizing that calendar prediction is less reliable when cycles are irregular.`;

const HAIR_RELATED = `Hair-related symptoms are influenced by androgen exposure, follicular sensitivity, genetics, and hair-growth cycles. Visible improvement usually takes time because treatments affect existing follicles progressively rather than immediately. A sudden change in hair growth, particularly when accompanied by other signs of virilization, should be assessed promptly to exclude causes other than typical PMOS-related androgen excess.`;

const PRACTICAL_MANAGEMENT_DERM = `Practical management often combines symptom-directed treatment with attention to the underlying endocrine context. Cosmetic or dermatologic measures can improve appearance and comfort, while hormonal or metabolic treatment may address contributing biology. Because hair and skin treatments can require months to show their full effect, consistent follow-up is more informative than judging treatment after only a few weeks.`;

const INSULIN_RESISTANCE_INFO = `Insulin resistance is common but is not required for the diagnosis. When present, reduced insulin responsiveness may lead to compensatory hyperinsulinemia and can contribute to ovarian androgen production. The resulting metabolic environment may increase the risk of impaired glucose tolerance, type 2 diabetes, and dyslipidemia. Metabolic assessment should therefore use validated clinical measures rather than relying on symptoms alone.`;

const WEIGHT_ONE_MEASURE = `Weight is one health measure, not a complete description of metabolic health. People with PMOS can have metabolic risk at different body sizes, while weight change does not necessarily reflect improvement in every clinical outcome. A broader assessment includes glucose regulation, blood pressure, lipid profile, physical activity, sleep, and quality of life. Weight-related care should be individualized and free from stigma.`;

const WEIGHT_MANAGEMENT_GOALS = `When weight management is clinically appropriate, goals should focus on sustainable behaviors and measurable health outcomes. Changes in blood pressure, glucose, lipid profile, fitness, menstrual regularity, or quality of life may be meaningful even when weight changes are modest. People with a history of disordered eating require particular care to avoid harmful restriction.`;

const LIFESTYLE_CARE = `Lifestyle care is best understood as long-term health support rather than a short-term weight-loss program. Regular movement, adequate sleep, balanced nutrition, stress management, and preventive screening can improve health outcomes across the life course. Goals should be realistic, measurable, and adapted to the individual's circumstances so that progress can be maintained.`;

const TREATMENT_SELECTED = `Treatment is selected according to the problem being treated and the individual's goals. Menstrual regulation, androgen-related symptoms, metabolic risk, infertility, and psychological symptoms may require different interventions. Because PMOS is heterogeneous, a treatment that is appropriate for one person may not be appropriate for another. Shared decision-making is therefore a central principle of evidence-based care.`;

const BEFORE_STARTING_TREATMENT = `Before starting a treatment, it is useful to clarify the intended outcome, expected time to benefit, common adverse effects, important contraindications, and what follow-up will be required. Pregnancy intentions and other medicines should always be disclosed because they can materially change treatment selection.`;

const HORMONE_FLUCTUATE = `The endocrine picture in PMOS involves interactions among ovarian steroidogenesis, androgen action, insulin signaling, sex hormone-binding globulin, and the hypothalamic–pituitary–ovarian axis. These pathways help explain why reproductive and dermatologic symptoms can occur together. Importantly, hormone concentrations can fluctuate, and treatment may change the laboratory pattern without eliminating the underlying predisposition.`;

const LAB_INTERPRETATION = `Laboratory results need to be interpreted against the laboratory's reference interval and the individual's clinical context. Hormone concentrations vary with timing, assay method, medication use, and reproductive state. Similarly, glucose and lipid results describe specific metabolic domains rather than proving or disproving PMOS on their own. A clinician integrates several pieces of evidence before reaching a diagnosis or treatment decision.`;

const PRACTICAL_PREPARE_ASSESSMENT = `A practical way to prepare for assessment is to record menstrual dates, current medicines and supplements, relevant symptoms, previous laboratory results, and family history. This information helps clinicians interpret test results in context and reduces the risk of over-interpreting a single laboratory value or imaging finding.`;

const PREGNANCY_ACHIEVED = `Pregnancy can be achieved in people with PMOS, but the condition is associated with higher rates of some pregnancy complications, including gestational diabetes and hypertensive disorders. Risk varies between individuals and is influenced by metabolic health, age, body composition, and other factors. Preconception assessment and appropriate antenatal monitoring are therefore important.`;

const CUTANEOUS_MANIFESTATIONS = `Cutaneous manifestations are frequently linked to androgen activity, but skin findings can also have other causes. Acne and oily skin reflect sebaceous-gland activity and inflammation, while acanthosis nigricans is associated with insulin resistance. Management is directed at the specific dermatologic problem and may be combined with treatment of androgen excess or metabolic risk.`;

const SYMPTOMS_REPRODUCTIVE = `Symptoms may be reproductive, androgen-related, metabolic, or psychological. Menstrual irregularity can be the first recognizable feature, while acne, hirsutism, or scalp hair thinning may draw attention to androgen excess. Metabolic risk can remain clinically important even when reproductive symptoms are mild. Symptom severity is not a reliable measure of the underlying metabolic risk, so a comprehensive assessment is preferable to symptom-based assumptions.`;

export const EXPLORE_CATEGORIES = [
  {
    id: 'understanding-pmos',
    title: 'Understanding PMOS',
    description: 'The basics — what PMOS is, why it happens, and how it is diagnosed.',
    icon: 'MenuBook',
    gradient: ['#E91E63', '#EC407A'],
    subpoints: [
      { id: 'what-is-pmos', title: 'What is PMOS?', icon: 'HelpOutline', article: `Polyendocrine metabolic ovarian syndrome (PMOS), formerly known as polycystic ovary syndrome (PCOS), is a common endocrine and metabolic disorder affecting people during the reproductive years and potentially across the life course. It is characterized by a combination of ovulatory dysfunction, androgen excess, and polycystic ovarian morphology or an elevated anti-Müllerian hormone level in appropriate adult diagnostic settings. PMOS is heterogeneous: individuals may present predominantly with menstrual, reproductive, dermatologic, or metabolic features. The condition is also associated with increased risks of dysglycemia, dyslipidemia, sleep disorders, psychological symptoms, and adverse pregnancy outcomes. Diagnosis is clinical and biochemical rather than based on ovarian appearance alone, and alternative causes of androgen excess or menstrual disturbance must be excluded. Management is individualized according to symptoms, reproductive goals, metabolic risk, and patient preferences.

PMOS should be understood as a heterogeneous, multisystem condition rather than as a problem confined to the ovaries. Its reproductive manifestations may coexist with metabolic, dermatologic, sleep, and psychological features, and the combination differs substantially between individuals. This heterogeneity is important because the absence of one feature does not exclude the condition, and the presence of one feature does not establish the diagnosis by itself.

${PATIENT_EDUCATION}

${CLINICAL_PERSPECTIVE}

${WHEN_TO_SEEK_MEDICAL_ADVICE}

References for this subtab: [1], [3], [9]` },
      { id: 'causes-risk-factors', title: 'Causes & Risk Factors', icon: 'ReportProblem', article: `The precise cause of PMOS is multifactorial and remains incompletely understood. Genetic susceptibility interacts with endocrine, metabolic, and environmental factors. Familial clustering supports a heritable component, while insulin resistance and compensatory hyperinsulinemia may contribute to ovarian androgen production and altered ovulatory function. Adiposity can amplify metabolic and reproductive manifestations, although PMOS also occurs in individuals without overweight or obesity. Risk is additionally influenced by life stage and family history of PMOS or type 2 diabetes. Importantly, no single exposure or behavior is considered the sole cause of PMOS. A scientific approach therefore recognizes PMOS as a heterogeneous condition arising from interacting biological pathways rather than from a single lifestyle factor.

Current evidence supports a multifactorial model involving inherited susceptibility, ovarian and adrenal androgen biology, insulin signaling, adiposity in some individuals, and environmental or behavioral influences. These factors interact rather than acting as independent causes. Family history can increase susceptibility, but PMOS can also occur without an obvious family history. Risk assessment therefore focuses on the overall clinical pattern instead of searching for one single trigger.

${PATIENT_EDUCATION}

${CLINICAL_PERSPECTIVE}

${WHEN_TO_SEEK_MEDICAL_ADVICE}

References for this subtab: [1], [3], [4]` },
      { id: 'signs-symptoms', title: 'Signs & Symptoms', icon: 'Checklist', article: `Clinical manifestations of PMOS vary substantially between individuals. Common features include irregular or infrequent menstrual cycles, anovulation, clinical or biochemical hyperandrogenism, acne, hirsutism, and female-pattern hair thinning. Metabolic features may include insulin resistance, dysglycemia, central adiposity, dyslipidemia, or increased blood pressure. Some individuals have psychological symptoms such as anxiety, depression, reduced quality of life, or concerns about body image. Symptoms may change with age, pregnancy, treatment, and changes in metabolic health. The presence or absence of one symptom does not independently establish or exclude PMOS. Clinical assessment should integrate menstrual history, androgen-related features, metabolic risk, reproductive goals, and relevant laboratory or imaging findings.

${SYMPTOMS_REPRODUCTIVE}

${PATIENT_EDUCATION}

${CLINICAL_PERSPECTIVE}

${WHEN_TO_SEEK_MEDICAL_ADVICE}

References for this subtab: [1], [3], [4]` },
      { id: 'how-diagnosed', title: 'How PMOS is Diagnosed', icon: 'FactCheck', article: `In adults, PMOS is generally diagnosed after exclusion of alternative disorders when at least two of three major features are present: ovulatory dysfunction, clinical or biochemical hyperandrogenism, and polycystic ovarian morphology or an elevated anti-Müllerian hormone level, depending on the diagnostic pathway. When irregular cycles and hyperandrogenism are both clearly present, ovarian ultrasound or AMH is not required for diagnosis. In adolescents, diagnostic criteria are more stringent because irregular cycles and polycystic ovarian morphology can occur normally during maturation. Thyroid dysfunction, hyperprolactinemia, non-classic congenital adrenal hyperplasia, and other androgen-excess disorders may need consideration. Diagnosis should be individualized and should not be based solely on an ultrasound report.

Diagnosis requires clinical reasoning and exclusion of alternative explanations. In adults, current international guidance uses combinations of ovulatory dysfunction, hyperandrogenism, and ovarian morphology or AMH, depending on the diagnostic pathway. Age, medications, pregnancy status, and other endocrine disorders can alter interpretation. Ultrasound findings alone should therefore not be treated as a diagnosis.

${PRACTICAL_PREPARE_ASSESSMENT}

${CLINICAL_PERSPECTIVE}

${WHEN_TO_SEEK_MEDICAL_ADVICE}

References for this subtab: [1], [2], [3]` },
      { id: 'hormones-pmos', title: 'Hormones & PMOS', icon: 'Biotech', article: `PMOS involves interactions among the hypothalamic–pituitary–ovarian axis, ovarian steroidogenesis, insulin signaling, and androgen metabolism. Hyperandrogenism may arise from increased ovarian androgen production and altered adrenal contribution. Elevated androgen activity can interfere with follicular development and ovulation and can contribute to acne, hirsutism, and scalp hair thinning. Insulin resistance and hyperinsulinemia may further stimulate ovarian androgen production and reduce hepatic production of sex hormone-binding globulin, increasing the biologically available androgen fraction. Estrogen and progesterone patterns may also vary because ovulation is irregular. These hormonal changes are interconnected rather than isolated abnormalities, which explains why reproductive, dermatologic, and metabolic manifestations can coexist in the same individual.

${HORMONE_FLUCTUATE}

${PATIENT_EDUCATION}

${CLINICAL_PERSPECTIVE}

${WHEN_TO_SEEK_MEDICAL_ADVICE}

References for this subtab: [1], [3], [4]` },
      { id: 'insulin-metabolic', title: 'Insulin & Metabolic Changes', icon: 'MonitorHeart', article: `Insulin resistance is an important metabolic feature of PMOS, although its severity differs among individuals and it is not itself a diagnostic criterion. Reduced insulin responsiveness can lead to compensatory hyperinsulinemia and may contribute to increased ovarian androgen production. Over time, this metabolic environment can increase the risk of impaired glucose tolerance and type 2 diabetes. Central adiposity can further worsen insulin resistance, but metabolic risk is not limited to people with obesity. Current guidelines emphasize assessment of glycemic status and cardiovascular risk rather than relying on routine clinical measurement of insulin resistance itself, because commonly available surrogate measures are not sufficiently accurate for routine diagnosis. Lifestyle intervention remains central to metabolic risk reduction.

${INSULIN_RESISTANCE_INFO}

${PATIENT_EDUCATION}

${CLINICAL_PERSPECTIVE}

${WHEN_TO_SEEK_MEDICAL_ADVICE}

References for this subtab: [1], [3], [5]` },
      { id: 'test-results', title: 'Understanding Your Test Results', icon: 'Assessment', article: `Laboratory interpretation in PMOS should be performed in clinical context rather than from isolated numerical values. Depending on the presentation, clinicians may assess total or free testosterone, sex hormone-binding globulin, glucose regulation, lipid profile, thyroid function, prolactin, and other tests required to exclude alternative diagnoses. An elevated androgen result can support biochemical hyperandrogenism, but assay quality and reference ranges are important. Glycemic testing helps identify prediabetes or diabetes and may be more clinically informative than an isolated insulin value. Results should therefore be interpreted against the laboratory's reference interval, the individual's age and reproductive status, medications, and symptoms. A single abnormal result does not automatically establish PMOS or determine treatment.

${LAB_INTERPRETATION}

${PRACTICAL_PREPARE_ASSESSMENT}

${CLINICAL_PERSPECTIVE}

${WHEN_TO_SEEK_MEDICAL_ADVICE}

References for this subtab: [1], [2], [3]` },
      { id: 'common-questions', title: 'Common Questions About PMOS', icon: 'QuestionAnswer', article: `PMOS is not simply an ovarian cyst disorder, and ovarian cysts are not required for diagnosis. It is also possible to have PMOS at a healthy body weight. PMOS can affect fertility because ovulation may be infrequent, but many individuals conceive spontaneously or with appropriate treatment. There is currently no single curative therapy; management aims to control symptoms, protect endometrial and metabolic health, and support reproductive goals. Treatment is selected according to the individual's priorities and risk profile. Because PMOS is heterogeneous, two people with the same diagnosis may require very different management plans. Evidence-based care therefore emphasizes individualized treatment and shared decision-making.

${CLINICAL_SIGNIFICANCE}

${PATIENT_EDUCATION}

${CLINICAL_PERSPECTIVE}

${WHEN_TO_SEEK_MEDICAL_ADVICE}

References for this subtab: [1], [3], [4]` },
    ],
  },
  {
    id: 'fertility-reproductive-health',
    title: 'Fertility & Reproductive Health',
    description: 'Conceiving, pregnancy, and reproductive options with PMOS.',
    icon: 'FavoriteBorder',
    gradient: ['#D81B60', '#BA68C8'],
    subpoints: [
      { id: 'pmos-fertility', title: 'PMOS & Fertility', icon: 'FavoriteBorder', article: `PMOS is a major cause of ovulatory infertility because disrupted follicular development can result in infrequent or absent ovulation. Importantly, impaired ovulation does not mean permanent infertility. Many people with PMOS can achieve pregnancy naturally, while others benefit from ovulation-induction therapy or assisted reproductive techniques. Fertility assessment should consider age, duration of trying to conceive, ovulatory status, semen factors, tubal factors, and other causes of infertility rather than attributing infertility automatically to PMOS. Preconception optimization of metabolic health, blood pressure, nutrition, physical activity, medications, and psychological well-being is also important. Fertility care should be individualized and aligned with the person's reproductive goals.

${REPRODUCTIVE_ISSUE}

${PRACTICAL_CONSULTATION}

${CLINICAL_PERSPECTIVE}

${WHEN_TO_SEEK_MEDICAL_ADVICE}

References for this subtab: [1], [3], [4]` },
      { id: 'ovulation-fertility', title: 'Ovulation & Fertility', icon: 'Cyclone', article: `Ovulation is the release of a mature oocyte from the ovary and is necessary for natural conception. In PMOS, abnormal follicular development and endocrine signaling can result in oligo-ovulation or anovulation. Menstrual bleeding may still occur without regular ovulation, so cycle frequency alone cannot always confirm ovulatory function. When pregnancy is desired, clinicians may assess ovulation clinically and, when appropriate, use laboratory or ultrasound-based methods. For anovulatory infertility associated with PMOS, letrozole is recommended as first-line pharmacological ovulation induction in the 2023 international guideline when there are no other infertility factors that alter management. Treatment should occur under appropriate clinical supervision.

${REPRODUCTIVE_ISSUE}

${PRACTICAL_CONSULTATION}

${CLINICAL_PERSPECTIVE}

${WHEN_TO_SEEK_MEDICAL_ADVICE}

References for this subtab: [1], [2]` },
      { id: 'planning-pregnancy', title: 'Planning for Pregnancy', icon: 'EventNote', article: `Preconception care is particularly relevant in PMOS because metabolic and obstetric risks may be increased. Before conception, clinicians should review blood pressure, glucose regulation, weight trajectory, medications, nutrition, physical activity, sleep, mental health, and smoking or alcohol exposure. Folic acid supplementation should follow routine preconception recommendations, with individualized dosing when clinically indicated. Pregnancy should be excluded before ovulation-induction therapy is initiated. Optimizing modifiable risk factors before conception can reduce avoidable complications and provides an opportunity to establish an appropriate monitoring plan. Preconception counseling should also include discussion of fertility expectations and the possibility that ovulation may require treatment.

${PREGNANCY_ACHIEVED}

${PRACTICAL_CONSULTATION}

${CLINICAL_PERSPECTIVE}

${WHEN_TO_SEEK_MEDICAL_ADVICE}

References for this subtab: [1], [7]` },
      { id: 'pregnancy-pmos', title: 'Pregnancy & PMOS', icon: 'PregnantWoman', article: `Pregnancy is achievable in people with PMOS, but the condition is associated with increased risks of several pregnancy complications. Evidence indicates higher rates of gestational diabetes, hypertensive disorders of pregnancy, and some other adverse outcomes compared with populations without PMOS. Risk assessment should begin before conception or early in pregnancy and should consider individual factors such as age, body mass index, glucose status, and blood pressure. Appropriate antenatal care can identify and manage complications early. PMOS should therefore be viewed as a condition requiring informed reproductive and metabolic monitoring rather than as a reason to avoid pregnancy. Management decisions during pregnancy should be made with obstetric and relevant specialist teams.

${PREGNANCY_ACHIEVED}

${PRACTICAL_CONSULTATION}

${CLINICAL_PERSPECTIVE}

${WHEN_TO_SEEK_MEDICAL_ADVICE}

References for this subtab: [7], [8]` },
      { id: 'gestational-diabetes', title: 'Gestational Diabetes', icon: 'Bloodtype', article: `Gestational diabetes mellitus (GDM) is glucose intolerance first recognized during pregnancy. People with PMOS have an increased risk of GDM, reflecting the metabolic abnormalities that can accompany the condition. Screening and follow-up should follow pregnancy-specific clinical guidelines, with additional attention to preconception and early-pregnancy glycemic status when indicated. A 75-g oral glucose tolerance test may be used according to clinical timing recommendations. Risk reduction focuses on appropriate nutrition, physical activity, weight management before pregnancy when relevant, and management of pre-existing dysglycemia. GDM requires treatment and monitoring because maternal hyperglycemia is associated with adverse maternal and neonatal outcomes. Individual risk should be discussed with the antenatal care team.

${PREGNANCY_ACHIEVED}

${PATIENT_EDUCATION}

${CLINICAL_PERSPECTIVE}

${WHEN_TO_SEEK_MEDICAL_ADVICE}

References for this subtab: [7], [8]` },
      { id: 'fertility-treatments', title: 'Fertility Treatments', icon: 'LocalHospital', article: `For anovulatory infertility related to PMOS, treatment commonly progresses from lifestyle and preconception optimization to pharmacological ovulation induction, with escalation according to response and other infertility factors. Letrozole is recommended as the first-line pharmacological option for many individuals with PMOS-related anovulatory infertility. Metformin may have a role in selected patients, particularly where metabolic indications are present, but it is not a universal substitute for ovulation induction. If first-line therapy is unsuccessful, other approaches can be considered by a fertility specialist. Treatment should account for ovarian response, multiple-pregnancy risk, medication contraindications, and coexisting infertility factors. Fertility treatment should always be medically supervised.

${REPRODUCTIVE_ISSUE}

${PRACTICAL_CONSULTATION}

${CLINICAL_PERSPECTIVE}

${WHEN_TO_SEEK_MEDICAL_ADVICE}

References for this subtab: [1], [2]` },
      { id: 'assisted-reproductive', title: 'Assisted Reproductive Options', icon: 'Biotech', article: `Assisted reproductive technologies (ART) include procedures such as intrauterine insemination and in-vitro fertilization. In PMOS, ART may be considered when ovulation-induction approaches are unsuccessful, when other infertility factors are present, or when clinically appropriate based on the overall fertility assessment. Ovarian stimulation requires careful monitoring because some individuals with PMOS may have a high ovarian follicle count and an increased risk of ovarian hyperstimulation. Modern stimulation protocols and individualized dosing can reduce this risk. ART decisions should consider age, ovarian reserve, semen analysis, tubal status, previous treatment response, financial factors, and patient preferences. Counseling should explain expected benefits, risks, alternatives, and uncertainties.

${CLINICAL_SIGNIFICANCE}

${PATIENT_EDUCATION}

${CLINICAL_PERSPECTIVE}

${WHEN_TO_SEEK_MEDICAL_ADVICE}

References for this subtab: [1], [2]` },
      { id: 'fertility-questions', title: 'Fertility Questions to Ask Your Doctor', icon: 'QuestionAnswer', article: `Useful fertility consultations should address whether ovulation is occurring, whether additional infertility factors have been assessed, and which treatment is appropriate for the individual's goals. Questions may include: What evidence suggests that PMOS is affecting ovulation? Do I need evaluation of my partner's fertility or tubal patency? What preconception tests are appropriate? Which ovulation-induction medicine is recommended and why? What monitoring is required? What are the risks of multiple pregnancy or ovarian hyperstimulation? When should treatment be escalated? How will glucose, blood pressure, medications, and mental health be managed before pregnancy? Shared decision-making is central because fertility treatment involves trade-offs in effectiveness, burden, cost, and risk.

${REPRODUCTIVE_ISSUE}

${PRACTICAL_CONSULTATION}

${CLINICAL_PERSPECTIVE}

${WHEN_TO_SEEK_MEDICAL_ADVICE}

References for this subtab: [1], [2]` },
    ],
  },
  {
    id: 'periods-hormones',
    title: 'Periods & Hormones',
    description: 'How your cycle works, what changes with PMOS, and when to worry.',
    icon: 'CalendarMonth',
    gradient: ['#2196F3', '#8B5CF6'],
    subpoints: [
      { id: 'menstrual-cycle', title: 'Understanding Your Menstrual Cycle', icon: 'CalendarMonth', article: `The menstrual cycle is regulated by coordinated changes in the hypothalamus, pituitary gland, ovaries, and endometrium. Follicle-stimulating hormone promotes follicular development, luteinizing hormone contributes to ovulation, and ovarian estrogen and progesterone coordinate endometrial changes. In PMOS, altered endocrine signaling can disrupt follicular maturation and ovulation, producing longer, shorter, or unpredictable cycles. Tracking cycle timing, duration, bleeding intensity, and associated symptoms can help identify patterns. However, cycle tracking alone cannot diagnose PMOS. Persistent irregularity should be evaluated, especially when periods are very infrequent, absent, unusually heavy, or accompanied by hyperandrogenic symptoms.

${MENSTRUAL_PATTERNS}

${MENSTRUAL_DIARY}

${CLINICAL_PERSPECTIVE}

${WHEN_TO_SEEK_MEDICAL_ADVICE}

References for this subtab: [1], [3]` },
      { id: 'irregular-periods', title: 'Irregular Periods', icon: 'EventBusy', article: `Irregular menstrual cycles are common in PMOS and generally reflect ovulatory dysfunction. Cycle irregularity may manifest as infrequent periods, prolonged intervals between bleeding episodes, or unpredictable bleeding. Persistent anovulation can expose the endometrium to prolonged estrogenic stimulation without adequate progesterone opposition, increasing the risk of endometrial hyperplasia. Management therefore aims not only to improve cycle predictability but also to provide appropriate endometrial protection when indicated. Hormonal contraception or periodic progestogen therapy may be used according to individual circumstances. New or markedly changed bleeding patterns should be clinically assessed because not all irregular bleeding is attributable to PMOS.

${MENSTRUAL_PATTERNS}

${MENSTRUAL_DIARY}

${CLINICAL_PERSPECTIVE}

${WHEN_TO_SEEK_MEDICAL_ADVICE}

References for this subtab: [1], [3], [4]` },
      { id: 'heavy-light-periods', title: 'Heavy or Light Periods', icon: 'WaterDrop', article: `Menstrual bleeding volume can vary in PMOS. Some individuals experience prolonged or heavy bleeding after extended intervals without menstruation, whereas others have infrequent or relatively light bleeding. Heavy bleeding may contribute to iron deficiency and anemia and should be evaluated when persistent, severe, or associated with dizziness, fatigue, or other concerning symptoms. Bleeding patterns can also be influenced by hormonal contraception, pregnancy, thyroid disorders, structural uterine conditions, medications, and other causes. Scientific assessment therefore considers the pattern, duration, quantity, associated symptoms, pregnancy possibility, and clinical context rather than assuming that all bleeding changes are caused by PMOS.

${MENSTRUAL_PATTERNS}

${MENSTRUAL_DIARY}

${CLINICAL_PERSPECTIVE}

${WHEN_TO_SEEK_MEDICAL_ADVICE}

References for this subtab: [3], [4]` },
      { id: 'period-tracking', title: 'Period Tracking', icon: 'Timeline', article: `Menstrual tracking provides longitudinal information about cycle length, bleeding duration, spotting, pain, and associated symptoms. In PMOS, tracking can help identify prolonged intervals between periods and changes after treatment or lifestyle interventions. Digital tracking should be considered a monitoring tool rather than a diagnostic test. Useful records include the first day of each period, number of bleeding days, unusually heavy days, pain, medications, and pregnancy-related information when relevant. For individuals trying to conceive, tracking can also support discussion of potential ovulation timing, although irregular cycles make calendar-based prediction less reliable. Persistent abnormalities should be reviewed by a healthcare professional.

${MENSTRUAL_PATTERNS}

${MENSTRUAL_DIARY}

${CLINICAL_PERSPECTIVE}

${WHEN_TO_SEEK_MEDICAL_ADVICE}

References for this subtab: [1], [3]` },
      { id: 'ovulation-hormones', title: 'Ovulation & Hormones', icon: 'Science', article: `Ovulation depends on coordinated follicular maturation and the mid-cycle luteinizing hormone surge. In PMOS, disrupted follicular development and androgen–insulin interactions can impair this process. Consequently, some individuals may have long cycles or periods without ovulation. The presence of menstrual bleeding does not necessarily prove that ovulation occurred. When fertility is a priority, clinicians may use appropriate biochemical, ultrasound, or clinical assessments to evaluate ovulation. Treatment targets the underlying reproductive goal rather than attempting to normalize a single hormone value. Hormone results should always be interpreted with timing, medication use, and menstrual-cycle context in mind.

${HORMONE_FLUCTUATE}

${PATIENT_EDUCATION}

${CLINICAL_PERSPECTIVE}

${WHEN_TO_SEEK_MEDICAL_ADVICE}

References for this subtab: [1], [2]` },
      { id: 'hormonal-contraception', title: 'Hormonal Contraception', icon: 'Medication', article: `Combined hormonal contraceptives contain estrogen and progestin and are commonly used in PMOS for menstrual regulation and treatment of androgen-related symptoms in individuals who do not wish to become pregnant. They can reduce endometrial exposure to unopposed estrogen and may improve acne and hirsutism over time. Progestin-only methods may be appropriate when estrogen-containing contraception is contraindicated or not preferred. Contraceptive choice should consider cardiovascular and thromboembolic risk, migraine history, smoking, blood pressure, medications, reproductive goals, and personal preferences. Contraception remains important in PMOS because irregular ovulation does not eliminate the possibility of spontaneous pregnancy.

${CLINICAL_SIGNIFICANCE}

${PATIENT_EDUCATION}

${CLINICAL_PERSPECTIVE}

${WHEN_TO_SEEK_MEDICAL_ADVICE}

References for this subtab: [1], [4]` },
      { id: 'period-symptoms', title: 'Period-Related Symptoms', icon: 'Sick', article: `PMOS-related menstrual symptoms may include irregular bleeding, prolonged cycles, pelvic discomfort, premenstrual symptoms, and variable bleeding intensity. Symptoms should be considered alongside possible non-PMOS causes, including pregnancy, thyroid disease, anemia, endometriosis, fibroids, infection, or medication effects. Tracking symptom severity and timing can help clinicians distinguish recurrent patterns from new abnormalities. Severe pelvic pain, very heavy bleeding, fainting, or bleeding during pregnancy requires prompt medical assessment. Management should be directed at the identified cause and the individual's reproductive goals rather than assuming that every menstrual symptom represents PMOS.

${SYMPTOMS_REPRODUCTIVE}

${MENSTRUAL_DIARY}

${CLINICAL_PERSPECTIVE}

${WHEN_TO_SEEK_MEDICAL_ADVICE}

References for this subtab: [3], [4]` },
      { id: 'seek-medical-advice', title: 'When to Seek Medical Advice', icon: 'LocalHospital', article: `Medical review is appropriate when periods are persistently irregular or absent, bleeding becomes unusually heavy or prolonged, or new androgen-related symptoms develop. Assessment is particularly important when menstrual changes are accompanied by rapid-onset hirsutism, severe acne, voice deepening, or other signs of marked androgen excess, because alternative diagnoses may need to be excluded. Pregnancy should be considered whenever menstruation is unexpectedly absent in a person who could become pregnant. Urgent care is warranted for severe bleeding causing weakness or fainting, severe pelvic pain, or symptoms suggesting a medical emergency. Early evaluation can reduce complications and improve symptom management.

${CLINICAL_SIGNIFICANCE}

${PATIENT_EDUCATION}

${CLINICAL_PERSPECTIVE}

${WHEN_TO_SEEK_MEDICAL_ADVICE}

References for this subtab: [1], [3], [4]` },
    ],
  },
  {
    id: 'skin-hair-body',
    title: 'Skin, Hair & Body',
    description: 'Managing acne, excess hair, hair thinning, and body confidence.',
    icon: 'Face',
    gradient: ['#FFA726', '#FB8C00'],
    subpoints: [
      { id: 'skin-changes', title: 'Skin Changes', icon: 'Face', article: `Cutaneous manifestations of PMOS are commonly related to androgen excess and metabolic factors. Acne, oily skin, hirsutism, and female-pattern hair loss may occur together but are not present in every individual. Acanthosis nigricans—thickened, hyperpigmented, velvety skin, often in body folds—is associated with insulin resistance and may provide a clinical clue to metabolic risk. Dermatologic symptoms can have substantial effects on quality of life and body image. Management may include hormonal therapy, topical dermatologic treatment, mechanical hair removal, laser therapy, or systemic medications depending on the specific condition. Persistent or rapidly progressive changes should be evaluated clinically.

${CUTANEOUS_MANIFESTATIONS}

${PRACTICAL_MANAGEMENT_DERM}

${CLINICAL_PERSPECTIVE}

${WHEN_TO_SEEK_MEDICAL_ADVICE}

References for this subtab: [1], [3], [10]` },
      { id: 'acne', title: 'Acne', icon: 'Healing', article: `Acne in PMOS may be influenced by androgen activity, sebaceous-gland stimulation, follicular keratinization, and inflammation. Adult or persistent acne can occur even when other PMOS manifestations are subtle. Treatment is selected according to severity, scarring risk, pregnancy plans, and contraindications. Topical retinoids, benzoyl peroxide, topical antibiotics, hormonal therapy, and other dermatologic treatments may be considered according to standard acne-care principles. Combined hormonal contraception can improve androgen-mediated acne in suitable patients. Pregnancy planning is essential because several acne medicines are contraindicated during pregnancy. Severe, scarring, or treatment-resistant acne warrants dermatologic assessment.

${CUTANEOUS_MANIFESTATIONS}

${PRACTICAL_MANAGEMENT_DERM}

${CLINICAL_PERSPECTIVE}

${WHEN_TO_SEEK_MEDICAL_ADVICE}

References for this subtab: [1], [4], [10]` },
      { id: 'excess-hair', title: 'Excess Facial & Body Hair', icon: 'ContentCut', article: `Hirsutism refers to terminal hair growth in androgen-sensitive areas in a male-pattern distribution. In PMOS, it is commonly associated with androgen excess, although hair growth is influenced by genetics, ethnicity, age, and follicular sensitivity. Clinical assessment may use standardized scoring systems and may include biochemical androgen testing when indicated. Treatment can combine mechanical methods such as shaving or waxing with medical therapies that reduce androgen activity or production. Improvement is gradual because existing terminal hairs have a growth cycle. Rapid onset, virilization, or unusually severe progression requires evaluation for causes other than typical PMOS-related hirsutism.

${HAIR_RELATED}

${PRACTICAL_MANAGEMENT_DERM}

${CLINICAL_PERSPECTIVE}

${WHEN_TO_SEEK_MEDICAL_ADVICE}

References for this subtab: [1], [4], [10]` },
      { id: 'hair-thinning', title: 'Hair Thinning & Hair Loss', icon: 'AutoFixHigh', article: `Female-pattern hair loss in PMOS may be associated with androgen activity and genetic susceptibility. It typically presents as progressive reduction in hair density, particularly over the central scalp, rather than complete baldness. Other causes—including iron deficiency, thyroid dysfunction, nutritional deficiency, telogen effluvium, autoimmune disease, and medication effects—should be considered. Treatment may include topical minoxidil and, in selected patients, therapies targeting androgen activity. Response usually requires several months and should be assessed over time. Sudden, patchy, painful, or inflammatory hair loss is not typical of androgen-related hair thinning and warrants dermatologic evaluation.

${HAIR_RELATED}

${PRACTICAL_MANAGEMENT_DERM}

${CLINICAL_PERSPECTIVE}

${WHEN_TO_SEEK_MEDICAL_ADVICE}

References for this subtab: [1], [10]` },
      { id: 'hair-removal-options', title: 'Hair Removal Options', icon: 'Spa', article: `Hair-removal strategies for PMOS-related hirsutism include shaving, trimming, depilatory products, waxing, threading, epilation, and other mechanical approaches. These methods remove or reduce visible hair but do not directly correct the underlying androgenic stimulus. Shaving does not increase the biological rate of hair growth, although the blunt regrowth may feel thicker. Choice depends on skin sensitivity, hair density, cost, convenience, and personal preference. Combining hair removal with medical treatment may provide greater long-term improvement. Skin irritation, folliculitis, and post-inflammatory hyperpigmentation are possible with some methods, so technique and skin care are important.

${HAIR_RELATED}

${PRACTICAL_MANAGEMENT_DERM}

${CLINICAL_PERSPECTIVE}

${WHEN_TO_SEEK_MEDICAL_ADVICE}

References for this subtab: [6]` },
      { id: 'laser-hair-removal', title: 'Laser Hair Removal', icon: 'FlashOn', article: `Laser hair reduction targets melanin within the hair follicle and can produce sustained reduction in unwanted terminal hair after multiple treatment sessions. It is a cosmetic treatment rather than a cure for androgen excess, so new hair growth may continue when the underlying hormonal stimulus persists. Outcomes vary with hair color, skin type, device, treatment parameters, and hormonal status. Multiple sessions are usually required because follicles respond differently during the hair-growth cycle. Treatment should be performed by appropriately trained professionals, particularly for darker skin tones where pigmentary adverse effects can occur. Medical treatment may be combined with laser therapy when clinically appropriate.

${HAIR_RELATED}

${PRACTICAL_MANAGEMENT_DERM}

${CLINICAL_PERSPECTIVE}

${WHEN_TO_SEEK_MEDICAL_ADVICE}

References for this subtab: [6]` },
      { id: 'skin-hair-treatment', title: 'Treatment Options', icon: 'MedicalServices', article: `Treatment of PMOS-related skin and hair symptoms should be individualized. Acne may require topical or systemic dermatologic therapy, while hirsutism can be managed using hair-removal methods, hormonal therapy, or antiandrogen approaches in appropriate patients. Female-pattern hair loss may require dermatologic evaluation and targeted treatment. Combined hormonal contraceptives can improve several androgen-mediated symptoms when suitable, while antiandrogens may be considered with appropriate contraception and monitoring. Treatment choice depends on symptom severity, pregnancy intentions, contraindications, cost, and patient preference. Improvement is often gradual, and realistic expectations are essential.

${TREATMENT_SELECTED}

${BEFORE_STARTING_TREATMENT}

${CLINICAL_PERSPECTIVE}

${WHEN_TO_SEEK_MEDICAL_ADVICE}

References for this subtab: [1], [4], [6]` },
      { id: 'body-image-skin', title: 'Body Image', icon: 'SelfImprovement', article: `Visible manifestations of PMOS—including acne, hirsutism, hair thinning, weight changes, and menstrual irregularity—can affect body image and quality of life. These effects are not merely cosmetic; social stigma and appearance-related distress can contribute to anxiety, depression, disordered eating, and avoidance of healthcare. Management should therefore address both physical symptoms and psychological well-being. Weight-neutral, respectful communication is recommended, and treatment should not imply that appearance determines health or personal value. Individuals experiencing persistent body-image distress may benefit from psychological support, particularly when symptoms interfere with relationships, eating, work, or daily functioning.

${PSYCH_WELLBEING}

${PRACTICAL_ASSESSMENT_PSYCH}

${CLINICAL_PERSPECTIVE}

${WHEN_TO_SEEK_MEDICAL_ADVICE}

References for this subtab: [1], [3], [10]` },
    ],
  },
  {
    id: 'long-term-health',
    title: 'Long-Term Health',
    description: 'How PMOS affects your heart, metabolism, and health over a lifetime.',
    icon: 'HealthAndSafety',
    gradient: ['#00897B', '#26C6DA'],
    subpoints: [
      { id: 'life-stages', title: 'PMOS Across Life Stages', icon: 'Timeline', article: `PMOS can change in presentation across the life course. During adolescence, irregular cycles may overlap with normal pubertal maturation, making diagnosis more challenging. During reproductive years, fertility and pregnancy considerations become prominent. With increasing age, reproductive symptoms may become less obvious while metabolic and cardiovascular risks can remain clinically relevant. PMOS therefore should not be regarded as a condition limited to fertility. Long-term care should adapt to life stage and include appropriate assessment of glycemic health, cardiovascular risk, psychological well-being, sleep, reproductive needs, and symptom burden. Individualized follow-up is more appropriate than a single fixed management plan.

${CLINICAL_SIGNIFICANCE}

${PATIENT_EDUCATION}

${CLINICAL_PERSPECTIVE}

${WHEN_TO_SEEK_MEDICAL_ADVICE}

References for this subtab: [1], [3], [10]` },
      { id: 'blood-sugar-diabetes', title: 'Blood Sugar & Diabetes', icon: 'Bloodtype', article: `PMOS is associated with increased risk of impaired glucose tolerance and type 2 diabetes, partly because insulin resistance and other metabolic risk factors are common. Glycemic assessment should be incorporated into routine PMOS care, with testing selected according to current clinical guidelines and individual risk. The oral glucose tolerance test can provide useful information when more detailed assessment is indicated. Risk is influenced by adiposity, family history, age, previous gestational diabetes, and other metabolic factors. Prevention focuses on sustainable lifestyle measures and treatment of identified dysglycemia. Early detection is important because glucose abnormalities may develop even when reproductive symptoms are stable.

${CLINICAL_SIGNIFICANCE}

${PATIENT_EDUCATION}

${CLINICAL_PERSPECTIVE}

${WHEN_TO_SEEK_MEDICAL_ADVICE}

References for this subtab: [1], [3], [5]` },
      { id: 'heart-health', title: 'Heart Health', icon: 'Favorite', article: `People with PMOS may have a higher prevalence of cardiovascular risk factors, including elevated blood pressure, dyslipidemia, impaired glucose regulation, and central adiposity. The presence of PMOS does not mean that cardiovascular disease is inevitable, but it supports systematic assessment of modifiable risk factors. Blood pressure, lipid profile, glycemic status, smoking exposure, physical activity, sleep, and weight trajectory should be considered as part of comprehensive care. Risk management follows established cardiovascular prevention principles. The goal is not simply to treat the reproductive manifestations of PMOS but to reduce long-term cardiometabolic risk across the life course.

${CLINICAL_SIGNIFICANCE}

${PATIENT_EDUCATION}

${CLINICAL_PERSPECTIVE}

${WHEN_TO_SEEK_MEDICAL_ADVICE}

References for this subtab: [1], [3], [13]` },
      { id: 'metabolic-health', title: 'Metabolic Health', icon: 'MonitorHeart', article: `Metabolic health in PMOS includes glucose regulation, lipid metabolism, blood pressure, adiposity, and insulin sensitivity. These domains are interconnected and may influence reproductive and androgen-related symptoms. A person can have PMOS without obesity and still have metabolic risk, while obesity can amplify risk in susceptible individuals. Comprehensive care therefore avoids using body weight as the sole marker of metabolic health. Assessment should include clinically appropriate measurements and laboratory testing, followed by individualized interventions. Sustainable dietary patterns, physical activity, adequate sleep, and treatment of identified metabolic disorders form the foundation of long-term risk reduction.

${INSULIN_RESISTANCE_INFO}

${PATIENT_EDUCATION}

${CLINICAL_PERSPECTIVE}

${WHEN_TO_SEEK_MEDICAL_ADVICE}

References for this subtab: [1], [3], [5]` },
      { id: 'long-term-risks', title: 'Long-Term Health Risks', icon: 'WarningAmber', article: `Long-term conditions associated with PMOS include type 2 diabetes, dyslipidemia, hypertension, sleep apnea, endometrial hyperplasia, and potentially increased cardiovascular risk. Psychological conditions such as anxiety, depression, eating disorders, and negative body image are also important components of the disease burden. Risk varies between individuals and is shaped by age, metabolic profile, family history, reproductive factors, and social determinants of health. Preventive care should therefore be proactive rather than symptom-driven. Regular monitoring allows clinicians to identify changes in glucose regulation, blood pressure, lipids, menstrual pattern, psychological well-being, and sleep health early.

${CLINICAL_SIGNIFICANCE}

${PATIENT_EDUCATION}

${CLINICAL_PERSPECTIVE}

${WHEN_TO_SEEK_MEDICAL_ADVICE}

References for this subtab: [1], [3]` },
      { id: 'disordered-eating', title: 'Eating & Disordered Eating', icon: 'Restaurant', article: `Eating concerns are clinically relevant in PMOS because weight-focused messaging, body-image distress, and repeated dieting can contribute to unhealthy eating behaviors. Individuals with PMOS may experience binge eating, restrictive eating, emotional eating, or other disordered patterns. These concerns should be assessed sensitively without assuming that body weight reveals eating behavior. Management should prioritize nutritional adequacy, metabolic health, psychological safety, and sustainable habits. If an eating disorder is suspected, referral to appropriately trained mental-health and nutrition professionals is recommended. Weight-loss advice should not be delivered in a way that reinforces stigma or promotes unsafe restriction.

${PSYCH_WELLBEING}

${PRACTICAL_ASSESSMENT_PSYCH}

${CLINICAL_PERSPECTIVE}

${WHEN_TO_SEEK_MEDICAL_ADVICE}

References for this subtab: [1], [3]` },
      { id: 'sleep-health', title: 'Sleep & Health', icon: 'Bedtime', article: `Sleep disturbances are common in PMOS and may include poor sleep quality and obstructive sleep apnea. Sleep apnea risk can be increased by obesity, but it may also occur in individuals without obesity. Symptoms such as loud snoring, witnessed breathing pauses, morning headaches, and excessive daytime sleepiness should prompt clinical evaluation. Poor sleep can adversely affect mood, appetite regulation, metabolic health, and quality of life. Management may include sleep-hygiene measures and, when obstructive sleep apnea is diagnosed, evidence-based treatments such as positive airway pressure. Sleep assessment should be considered part of holistic PMOS care rather than an unrelated issue.

Sleep is relevant to PMOS because poor sleep can affect glucose regulation, appetite, mood, recovery, and daily functioning. Obstructive sleep apnea is also more common in PMOS, particularly when other risk factors are present. Persistent snoring, witnessed breathing pauses, or excessive daytime sleepiness warrants clinical assessment rather than being attributed simply to stress or fatigue.

Practical sleep support includes keeping a consistent sleep and wake schedule, creating a dark and comfortable sleep environment, limiting stimulating activities close to bedtime, and addressing persistent snoring or daytime sleepiness clinically. If sleep remains poor despite basic measures, further assessment may be appropriate.

${CLINICAL_PERSPECTIVE}

${WHEN_TO_SEEK_MEDICAL_ADVICE}

References for this subtab: [1], [3]` },
      { id: 'health-screening', title: 'Health Screening', icon: 'FactCheck', article: `Preventive screening in PMOS should be individualized and aligned with evidence-based guidelines. Key domains include glucose regulation, blood pressure, lipid profile, menstrual and endometrial health, psychological well-being, sleep symptoms, and reproductive health. Screening intervals depend on age, baseline risk, prior results, family history, medications, and pregnancy status. Endometrial protection is particularly important in individuals with prolonged untreated amenorrhea or infrequent menstruation. Screening should not be limited to laboratory tests: a structured clinical history can identify symptoms requiring further assessment. Shared decision-making helps determine which investigations are appropriate and avoids unnecessary testing.

${CLINICAL_SIGNIFICANCE}

${PATIENT_EDUCATION}

${CLINICAL_PERSPECTIVE}

${WHEN_TO_SEEK_MEDICAL_ADVICE}

References for this subtab: [1], [3], [4]` },
    ],
  },
  {
    id: 'treatment-management',
    title: 'Treatment & Management',
    description: 'Medication, lifestyle care, and building the right healthcare team.',
    icon: 'MedicalServices',
    gradient: ['#1565C0', '#2196F3'],
    subpoints: [
      { id: 'managing-pmos', title: 'Managing PMOS', icon: 'TaskAlt', article: `PMOS management is long-term and individualized. The major goals are to improve quality of life, manage menstrual and androgen-related symptoms, reduce metabolic risk, protect endometrial health, and support fertility when desired. Lifestyle intervention is recommended for all individuals, but no single diet or exercise pattern is universally superior. Pharmacological therapy may include combined hormonal contraceptives, metformin, antiandrogen treatment, anti-obesity medicines in selected circumstances, or fertility medicines. Treatment selection depends on symptoms, comorbidities, pregnancy intentions, contraindications, cost, and preferences. Regular review is appropriate because priorities can change across life stages.

${CLINICAL_SIGNIFICANCE}

${PATIENT_EDUCATION}

${CLINICAL_PERSPECTIVE}

${WHEN_TO_SEEK_MEDICAL_ADVICE}

References for this subtab: [1], [2], [5]` },
      { id: 'medicines', title: 'Medicines', icon: 'Medication', article: `Medicines used in PMOS target specific symptoms or metabolic and reproductive goals rather than the syndrome as a single disease entity. Combined hormonal contraceptives may regulate cycles and improve acne or hirsutism. Metformin is primarily used for metabolic indications and may improve some reproductive outcomes in selected individuals. Antiandrogens may be used for persistent hirsutism under appropriate contraceptive and safety considerations. Ovulation-induction medicines are used when pregnancy is desired and anovulatory infertility is present. Medication choice should account for contraindications, adverse effects, pregnancy status, interactions, and patient preferences. Medicines should be prescribed and monitored by qualified clinicians.

${TREATMENT_SELECTED}

${BEFORE_STARTING_TREATMENT}

${CLINICAL_PERSPECTIVE}

${WHEN_TO_SEEK_MEDICAL_ADVICE}

References for this subtab: [1], [4], [5]` },
      { id: 'hormonal-treatments', title: 'Hormonal Treatments', icon: 'Science', article: `Hormonal treatment in PMOS is commonly used to regulate bleeding and reduce androgen-mediated symptoms. Combined hormonal contraceptives suppress ovarian androgen production and increase sex hormone-binding globulin, thereby reducing free androgen activity. They can improve menstrual regularity, acne, and hirsutism over time. Progestogen therapy can provide endometrial protection for selected individuals who cannot or do not wish to use combined hormonal contraception. Treatment must be individualized because estrogen-containing therapy is not suitable for everyone. Blood pressure, thromboembolic risk, migraine history, smoking, medications, and pregnancy intentions should be considered before prescribing.

${TREATMENT_SELECTED}

${BEFORE_STARTING_TREATMENT}

${CLINICAL_PERSPECTIVE}

${WHEN_TO_SEEK_MEDICAL_ADVICE}

References for this subtab: [1], [4]` },
      { id: 'insulin-resistance', title: 'Insulin Resistance', icon: 'Bloodtype', article: `Insulin resistance in PMOS is managed primarily through comprehensive metabolic care. Lifestyle intervention, including regular physical activity and a sustainable eating pattern, is recommended regardless of body weight because it supports cardiometabolic health. Metformin may be considered for selected individuals, particularly when metabolic risk is elevated or glucose abnormalities are present. Evidence indicates that metformin can modestly improve measures such as BMI, fasting glucose, insulin resistance, and lipid parameters, with gastrointestinal adverse effects being relatively common. Routine clinical measurement of insulin resistance is not recommended as a stand-alone diagnostic test because available surrogate measures have limitations.

${INSULIN_RESISTANCE_INFO}

${PATIENT_EDUCATION}

${CLINICAL_PERSPECTIVE}

${WHEN_TO_SEEK_MEDICAL_ADVICE}

References for this subtab: [1], [5]` },
      { id: 'weight-management', title: 'Weight Management', icon: 'MonitorWeight', article: `Weight management in PMOS should be approached without assuming that weight loss is required for everyone. Individuals with overweight or obesity may benefit from evidence-based interventions that improve metabolic health, while people at lower body weight still require appropriate screening and lifestyle support. Effective management emphasizes nutrition quality, physical activity, sleep, behavioral support, and realistic goals. In selected adults, anti-obesity pharmacotherapy may be considered according to general obesity-management indications and pregnancy plans. The 2023 guideline also emphasizes minimizing weight stigma and using person-centered communication. Health outcomes should be evaluated using metabolic, reproductive, psychological, and functional measures rather than weight alone.

${WEIGHT_ONE_MEASURE}

${WEIGHT_MANAGEMENT_GOALS}

${CLINICAL_PERSPECTIVE}

${WHEN_TO_SEEK_MEDICAL_ADVICE}

References for this subtab: [1], [3], [5]` },
      { id: 'lifestyle-management', title: 'Lifestyle-Based Management', icon: 'DirectionsRun', article: `Lifestyle intervention is a core component of PMOS care. Current evidence does not support one specific diet or exercise program as universally superior. Instead, individuals should be supported to adopt sustainable dietary patterns, regular physical activity, adequate sleep, and behaviors that fit their preferences and circumstances. Benefits can include improved cardiometabolic health, quality of life, and physical fitness even when substantial weight loss does not occur. Lifestyle care should be framed positively and without blame. Goals should be measurable and realistic, with periodic review to address barriers, adherence, social circumstances, and changing health priorities.

${TREATMENT_SELECTED}

${BEFORE_STARTING_TREATMENT}

${CLINICAL_PERSPECTIVE}

${WHEN_TO_SEEK_MEDICAL_ADVICE}

References for this subtab: [1], [3], [7]` },
      { id: 'complementary-approaches', title: 'Complementary Approaches', icon: 'Spa', article: `Complementary approaches such as yoga, mindfulness, herbal products, and nutritional supplements are sometimes used by people with PMOS. Evidence for many of these interventions remains limited or heterogeneous, and product quality and dosing can vary substantially. Complementary approaches should not replace evidence-based treatment for infertility, dysglycemia, hypertension, or other clinically significant conditions. Inositol may provide modest benefits for selected metabolic or reproductive outcomes, but current evidence does not establish a universally optimal formulation or dose. Patients should disclose supplements and herbal products to clinicians because interactions, contamination, and pregnancy-related safety issues are possible.

${CLINICAL_SIGNIFICANCE}

${PATIENT_EDUCATION}

${CLINICAL_PERSPECTIVE}

${WHEN_TO_SEEK_MEDICAL_ADVICE}

References for this subtab: [1], [2]` },
      { id: 'health-monitoring', title: 'Health Monitoring', icon: 'MonitorHeart', article: `Ongoing monitoring in PMOS should reflect the individual's clinical phenotype and risk profile. Follow-up may include menstrual pattern, androgen-related symptoms, blood pressure, glucose regulation, lipid profile, weight trajectory, sleep symptoms, mental health, and reproductive goals. Monitoring frequency should be individualized rather than identical for every patient. Treatment response should be evaluated using outcomes that matter to the person, such as cycle regularity, acne, hirsutism, fertility, energy, metabolic markers, or quality of life. Long-term monitoring is important because symptoms and risks can change over time even when the original presenting complaint improves.

${CLINICAL_SIGNIFICANCE}

${PATIENT_EDUCATION}

${CLINICAL_PERSPECTIVE}

${WHEN_TO_SEEK_MEDICAL_ADVICE}

References for this subtab: [1], [3]` },
      { id: 'healthcare-team', title: 'Working With Your Healthcare Team', icon: 'Groups', article: `PMOS care often benefits from a multidisciplinary approach involving primary care, gynecology, endocrinology, dermatology, fertility specialists, dietitians, and mental-health professionals according to individual needs. Clear communication is important because PMOS affects reproductive, metabolic, dermatologic, and psychological health simultaneously. Patients should be encouraged to bring medication lists, menstrual records, laboratory results, and questions to appointments. Clinicians should explain the purpose, expected benefit, limitations, and adverse effects of proposed interventions. Coordinated care reduces fragmented treatment and helps ensure that fertility, metabolic health, symptom control, and quality of life are considered together.

${CLINICAL_SIGNIFICANCE}

${PATIENT_EDUCATION}

${CLINICAL_PERSPECTIVE}

${WHEN_TO_SEEK_MEDICAL_ADVICE}

References for this subtab: [1], [10]` },
      { id: 'shared-decision-making', title: 'Shared Decision-Making', icon: 'Handshake', article: `Shared decision-making combines scientific evidence with the individual's values, preferences, goals, and circumstances. In PMOS, this is particularly important because several reasonable treatments may exist for the same symptom, and priorities can change over time. For example, treatment for menstrual irregularity may differ when pregnancy is desired compared with when contraception is the primary goal. A shared decision should include discussion of benefits, risks, alternatives, uncertainty, costs, and practical burden. The process should be collaborative rather than prescriptive. The 2023 international guideline explicitly emphasizes shared decision-making and person-centered care as central components of PMOS management.

${CLINICAL_SIGNIFICANCE}

${PATIENT_EDUCATION}

${CLINICAL_PERSPECTIVE}

${WHEN_TO_SEEK_MEDICAL_ADVICE}

References for this subtab: [1], [2]` },
    ],
  },
  {
    id: 'relationships-sexual-health',
    title: 'Relationships & Sexual Health',
    description: 'Intimacy, communication, and sexual well-being with PMOS.',
    icon: 'Favorite',
    gradient: ['#EF5350', '#F48FB1'],
    subpoints: [
      { id: 'pmos-sexual-health', title: 'PMOS & Sexual Health', icon: 'Favorite', article: `PMOS can influence sexual health through hormonal symptoms, menstrual irregularity, infertility concerns, body-image distress, pain, mood symptoms, and treatment effects. Sexual well-being is therefore broader than fertility and should be addressed when relevant to the individual's concerns. Some people may experience reduced sexual satisfaction or desire, while others may not experience sexual difficulties at all. Clinicians should use confidential, nonjudgmental communication and distinguish sexual symptoms from relationship factors, medication effects, psychological distress, and other medical causes. Sexual health counseling should also include contraception when pregnancy is not desired, because irregular ovulation does not eliminate fertility.

${SEXUAL_RELATIONSHIP_HEALTH}

${SPECIFIC_PROBLEM_ID}

${CLINICAL_PERSPECTIVE}

${WHEN_TO_SEEK_MEDICAL_ADVICE}

References for this subtab: [1], [3]` },
      { id: 'intimacy-relationships', title: 'Intimacy & Relationships', icon: 'FavoriteBorder', article: `PMOS-related symptoms can affect intimacy indirectly through body-image concerns, anxiety, fertility stress, menstrual unpredictability, or fatigue. These effects vary widely and should not be assumed to occur in every relationship. Open communication can help partners understand that symptoms are biological and multifactorial rather than a reflection of attraction or commitment. When infertility treatment is involved, repeated appointments and uncertainty may increase emotional strain. Couples may benefit from counseling when communication difficulties or distress persist. Healthcare professionals should recognize relationship concerns as part of quality-of-life assessment while respecting privacy and individual preferences.

${SEXUAL_RELATIONSHIP_HEALTH}

${SPECIFIC_PROBLEM_ID}

${CLINICAL_PERSPECTIVE}

${WHEN_TO_SEEK_MEDICAL_ADVICE}

References for this subtab: [1], [3]` },
      { id: 'sexual-wellbeing', title: 'Sexual Well-being', icon: 'Spa', article: `Sexual well-being includes desire, arousal, comfort, satisfaction, safety, and the ability to make informed reproductive choices. PMOS-related hormonal changes, mood symptoms, medications, relationship factors, and concerns about appearance can influence one or more of these domains. There is no single sexual-health pattern associated with PMOS. A clinical evaluation should therefore identify the specific concern rather than attributing it automatically to the syndrome. Persistent pain, bleeding with intercourse, marked loss of desire, erectile or arousal difficulties in a partner, or relationship distress may require targeted assessment. Confidential counseling can support individualized care.

${SEXUAL_RELATIONSHIP_HEALTH}

${SPECIFIC_PROBLEM_ID}

${CLINICAL_PERSPECTIVE}

${WHEN_TO_SEEK_MEDICAL_ADVICE}

References for this subtab: [1], [3]` },
      { id: 'body-image-intimacy', title: 'Body Image & Intimacy', icon: 'SelfImprovement', article: `Visible PMOS manifestations such as acne, hirsutism, hair thinning, and body-weight changes may influence confidence and comfort during intimacy. Body-image distress can lead some individuals to avoid sexual situations or relationships, but this response is not inevitable. Treatment should address the physical symptom when desired while also recognizing the psychological impact. Weight-neutral and non-stigmatizing communication is important because shame can worsen distress and discourage healthcare engagement. Psychological therapies that address body-image concerns, self-esteem, anxiety, or relationship difficulties may complement medical management. The objective is improved well-being rather than conformity to a particular appearance standard.

${PSYCH_WELLBEING}

${PRACTICAL_ASSESSMENT_PSYCH}

${CLINICAL_PERSPECTIVE}

${WHEN_TO_SEEK_MEDICAL_ADVICE}

References for this subtab: [1], [3]` },
      { id: 'communication-partner', title: 'Communication With Your Partner', icon: 'Forum', article: `Communication about PMOS can reduce misunderstanding around irregular periods, fertility, sexual symptoms, and emotional distress. Useful conversations may include what symptoms are present, what medical treatment involves, whether pregnancy is desired, and what support is helpful. Fertility-related uncertainty can be particularly stressful, so couples may benefit from discussing expectations before beginning treatment. Communication should remain voluntary and respectful of privacy. When conversations repeatedly lead to conflict, avoidance, or significant distress, couples counseling or individual psychological support can be considered. Healthcare professionals can provide neutral educational information that helps partners understand the biological basis of PMOS.

${SEXUAL_RELATIONSHIP_HEALTH}

${SPECIFIC_PROBLEM_ID}

${CLINICAL_PERSPECTIVE}

${WHEN_TO_SEEK_MEDICAL_ADVICE}

References for this subtab: [1], [3]` },
      { id: 'fertility-relationships', title: 'Fertility & Relationships', icon: 'People', article: `Infertility associated with PMOS can affect both partners emotionally and practically. The irregularity of ovulation may make conception unpredictable, while fertility investigations and treatments can add time, cost, and treatment burden. These pressures may influence intimacy, communication, and emotional well-being. Couples should be encouraged to distinguish fertility difficulty from relationship quality and to seek support when stress becomes persistent. Fertility care should consider both partners and should evaluate other causes of infertility rather than assuming PMOS is the sole explanation. Psychological counseling can be useful during prolonged or emotionally demanding fertility treatment.

${REPRODUCTIVE_ISSUE}

${PRACTICAL_CONSULTATION}

${CLINICAL_PERSPECTIVE}

${WHEN_TO_SEEK_MEDICAL_ADVICE}

References for this subtab: [1], [2]` },
      { id: 'seek-support-relationships', title: 'When to Seek Support', icon: 'SupportAgent', article: `Professional support is appropriate when sexual, relationship, fertility, or body-image concerns cause persistent distress or interfere with daily functioning. Examples include severe anxiety around intimacy, ongoing pain during sexual activity, significant relationship conflict related to infertility, or avoidance caused by appearance concerns. A healthcare professional can determine whether the issue is primarily medical, psychological, relational, or multifactorial. Mental-health support may include counseling or evidence-based psychotherapy, while medical concerns may require gynecologic, endocrine, dermatologic, or sexual-medicine assessment. Seeking support is a normal component of comprehensive chronic-condition care.

${PSYCH_WELLBEING}

${PATIENT_EDUCATION}

${CLINICAL_PERSPECTIVE}

${WHEN_TO_SEEK_MEDICAL_ADVICE}

References for this subtab: [1], [3]` },
    ],
  },
  {
    id: 'body-image-wellbeing',
    title: 'Body Image & Well-being',
    description: 'Self-esteem, emotional health, and a kinder relationship with your body.',
    icon: 'SelfImprovement',
    gradient: ['#4A148C', '#BA68C8'],
    subpoints: [
      { id: 'weight-stigma', title: 'Understanding Weight Stigma', icon: 'ReportProblem', article: `Weight stigma refers to negative stereotyping, discrimination, or social devaluation based on body size. It is particularly relevant in PMOS because weight-related symptoms may be discussed frequently during healthcare encounters. Stigmatizing communication can increase shame, reduce healthcare engagement, and contribute to unhealthy eating behaviors and psychological distress. Evidence-based PMOS care therefore emphasizes respectful, person-centered communication and avoids assuming that weight reflects motivation, adherence, or personal responsibility. Clinicians should distinguish health risk from body size alone and address metabolic risk using objective clinical measures. A supportive environment can improve communication and facilitate sustainable health behaviors.

${WEIGHT_ONE_MEASURE}

${WEIGHT_MANAGEMENT_GOALS}

${CLINICAL_PERSPECTIVE}

${WHEN_TO_SEEK_MEDICAL_ADVICE}

References for this subtab: [1], [3]` },
      { id: 'body-image', title: 'Body Image', icon: 'SelfImprovement', article: `Body image describes how a person perceives, feels about, and relates to their body. PMOS symptoms such as acne, hirsutism, hair thinning, menstrual irregularity, and changes in body weight can affect body image and self-confidence. Distress may occur regardless of actual body size or symptom severity. Supportive care includes validating the concern, offering evidence-based treatment for symptoms when desired, and avoiding language that reinforces shame. Psychological interventions may help individuals reduce appearance-related preoccupation and improve quality of life. Body image should be assessed as part of holistic care when it affects emotional health, relationships, eating, or healthcare engagement.

${PSYCH_WELLBEING}

${PRACTICAL_ASSESSMENT_PSYCH}

${CLINICAL_PERSPECTIVE}

${WHEN_TO_SEEK_MEDICAL_ADVICE}

References for this subtab: [1], [3]` },
      { id: 'self-esteem-confidence', title: 'Self-Esteem & Confidence', icon: 'EmojiEmotions', article: `Self-esteem can be influenced by chronic symptoms, social expectations, infertility, and visible dermatologic changes. PMOS does not determine a person's attractiveness, competence, or social value, although symptoms may affect confidence in specific situations. Supportive strategies include realistic symptom management, reducing self-critical thinking, building activities unrelated to appearance, and seeking psychological support when distress persists. Cognitive-behavioral approaches can be useful for maladaptive beliefs and avoidance behaviors. Healthcare professionals should use neutral, respectful language and recognize that improvement in quality of life may require attention to psychological well-being alongside medical treatment.

${PSYCH_WELLBEING}

${PRACTICAL_ASSESSMENT_PSYCH}

${CLINICAL_PERSPECTIVE}

${WHEN_TO_SEEK_MEDICAL_ADVICE}

References for this subtab: [1], [3]` },
      { id: 'emotional-wellbeing', title: 'Emotional Well-being', icon: 'SentimentSatisfied', article: `Psychological symptoms are common in PMOS and may include anxiety, depression, stress, and reduced quality of life. These symptoms can be influenced by hormonal and metabolic factors, chronic disease burden, infertility, stigma, body-image concerns, and social circumstances. Current international guidance recommends awareness and assessment of psychological features rather than treating them as secondary concerns. Screening tools can help identify individuals who may need further evaluation, but a positive screening result is not itself a diagnosis. Persistent or severe symptoms should receive appropriate mental-health assessment and treatment. Psychological care can be integrated with endocrine, reproductive, and lifestyle management.

${PSYCH_WELLBEING}

${PRACTICAL_ASSESSMENT_PSYCH}

${CLINICAL_PERSPECTIVE}

${WHEN_TO_SEEK_MEDICAL_ADVICE}

References for this subtab: [1], [3]` },
      { id: 'stress-pmos', title: 'Stress & PMOS', icon: 'Bolt', article: `Stress is a normal physiological response, but persistent stress can influence sleep, mood, eating behavior, physical activity, and perceived symptom burden. In PMOS, stress may arise from irregular menstruation, fertility concerns, appearance-related symptoms, chronic disease management, or social pressures. Stress should not be described as the sole cause of PMOS; the syndrome is biologically multifactorial. Evidence-based stress-management strategies include regular physical activity, adequate sleep, structured routines, mindfulness-based practices, social support, and psychological therapy when indicated. The most appropriate strategy is one that is sustainable and compatible with the individual's circumstances.

${PSYCH_WELLBEING}

${PRACTICAL_ASSESSMENT_PSYCH}

${CLINICAL_PERSPECTIVE}

${WHEN_TO_SEEK_MEDICAL_ADVICE}

References for this subtab: [1], [3]` },
      { id: 'eating-concerns', title: 'Eating Concerns', icon: 'Restaurant', article: `Eating concerns in PMOS require a nonjudgmental approach. Repeated dieting, fear of weight gain, binge eating, restrictive intake, or compensatory behaviors may occur in the context of body-image distress or weight-focused healthcare. Such behaviors can impair nutritional adequacy and psychological health. Clinicians should avoid assuming that a person's eating pattern can be inferred from body size. When disordered eating is suspected, assessment by appropriately trained professionals is recommended. Nutritional care should focus on adequate intake, metabolic health, flexibility, and a sustainable relationship with food. Treatment of PMOS should never rely on unsafe or extreme dietary restriction.

${PSYCH_WELLBEING}

${PRACTICAL_ASSESSMENT_PSYCH}

${CLINICAL_PERSPECTIVE}

${WHEN_TO_SEEK_MEDICAL_ADVICE}

References for this subtab: [1], [3]` },
      { id: 'positive-relationship-body', title: 'Building a Positive Relationship With Your Body', icon: 'Favorite', article: `A positive relationship with the body does not require liking every physical feature; it involves respecting the body, supporting health needs, and reducing harmful self-judgment. In PMOS, this approach can help counter the effects of weight stigma and appearance-related symptoms. Practical strategies include focusing on function and health behaviors, choosing comfortable movement, eating regularly and adequately, reducing appearance-based comparison, and seeking evidence-based treatment for distressing symptoms. If body dissatisfaction becomes persistent or leads to avoidance, restrictive eating, or significant anxiety, professional psychological support is appropriate. Health goals should be individualized rather than defined by a single body shape or weight.

${SEXUAL_RELATIONSHIP_HEALTH}

${SPECIFIC_PROBLEM_ID}

${CLINICAL_PERSPECTIVE}

${WHEN_TO_SEEK_MEDICAL_ADVICE}

References for this subtab: [1], [3]` },
      { id: 'emotional-support', title: 'Getting Emotional Support', icon: 'SupportAgent', article: `Emotional support may come from trusted family members, partners, peer-support communities, primary-care clinicians, psychologists, psychiatrists, or other qualified professionals. The appropriate level of support depends on symptom severity and functional impact. People experiencing persistent low mood, anxiety, disordered eating, severe body-image distress, or thoughts of self-harm require timely professional assessment. Support should be confidential, respectful, and culturally appropriate. Psychological care can be combined with medical treatment for PMOS and may improve coping, quality of life, and treatment engagement. Seeking emotional support is not a sign that physical symptoms are unimportant; both dimensions deserve care.

${PSYCH_WELLBEING}

${PRACTICAL_ASSESSMENT_PSYCH}

${CLINICAL_PERSPECTIVE}

${WHEN_TO_SEEK_MEDICAL_ADVICE}

References for this subtab: [1], [3]` },
    ],
  },
  {
    id: 'lifestyle-nutrition',
    title: 'Lifestyle & Nutrition',
    description: 'Food, movement, sleep, and daily habits that support hormone balance.',
    icon: 'Restaurant',
    gradient: ['#009E73', '#80DEEA'],
    subpoints: [
      { id: 'nutrition-balanced-eating', title: 'Nutrition & Balanced Eating', icon: 'Restaurant', article: `There is no single evidence-based diet that is universally recommended for PMOS. A balanced dietary pattern should provide adequate protein, fiber, micronutrients, and healthy fats while limiting excessive intake of highly processed foods, added sugars, and energy-dense foods when these displace nutrient-rich options. Dietary choices should reflect culture, affordability, food access, medical conditions, and personal preference. For individuals with metabolic abnormalities, dietary patterns that support stable glucose regulation and cardiovascular health may be particularly useful. Nutrition goals should emphasize sustainability rather than short-term restriction. Registered dietitians can provide individualized nutrition plans when needed.

${PSYCH_WELLBEING}

${PRACTICAL_ASSESSMENT_PSYCH}

${CLINICAL_PERSPECTIVE}

${WHEN_TO_SEEK_MEDICAL_ADVICE}

References for this subtab: [1], [3]` },
      { id: 'food-pmos', title: 'Understanding Food & PMOS', icon: 'LocalDining', article: `Food affects metabolic health through its influence on energy balance, glucose regulation, lipid metabolism, satiety, and nutrient intake. In PMOS, nutrition should be considered in the context of insulin resistance and cardiovascular risk, but individual responses vary. Foods should not be classified as universally 'good' or 'bad'; overall dietary pattern and consistency are more important than isolated foods. Regular meals, adequate fiber, minimally processed foods, protein-rich choices, and appropriate hydration can support healthy routines. People with diabetes, gastrointestinal disease, pregnancy, or eating disorders may require individualized nutritional advice rather than generic dietary recommendations.

Evidence does not identify a single diet that is universally superior for PMOS. A balanced dietary pattern can support glucose regulation, cardiovascular health, adequate nutrition, and sustainable energy intake. The most appropriate approach depends on cultural food patterns, affordability, medical conditions, preferences, and eating-behavior history. Extreme restriction is neither necessary nor appropriate as a default treatment strategy.

A practical nutrition plan can begin with regular meals, adequate protein and fiber, a variety of vegetables and fruits, minimally processed staple foods, and appropriate hydration. The plan should be culturally familiar and financially realistic. Individuals with diabetes, pregnancy, kidney disease, gastrointestinal conditions, or eating disorders may need individualized dietary guidance.

${CLINICAL_PERSPECTIVE}

${WHEN_TO_SEEK_MEDICAL_ADVICE}

References for this subtab: [1], [3]` },
      { id: 'physical-activity', title: 'Physical Activity', icon: 'DirectionsRun', article: `Regular physical activity is recommended for people with PMOS because it improves cardiorespiratory fitness, insulin sensitivity, metabolic health, and quality of life. Benefits can occur independently of substantial weight loss. Current evidence does not establish one exercise type as uniquely superior for PMOS, so activity should be selected according to fitness level, preference, accessibility, and medical status. A combination of aerobic activity and resistance training can address different components of physical fitness. Progression should be gradual, especially for previously inactive individuals. Exercise should be viewed as a long-term health behavior rather than solely as a weight-control strategy.

${CLINICAL_SIGNIFICANCE}

${PATIENT_EDUCATION}

${CLINICAL_PERSPECTIVE}

${WHEN_TO_SEEK_MEDICAL_ADVICE}

References for this subtab: [1], [3]` },
      { id: 'exercise-movement', title: 'Exercise & Movement', icon: 'FitnessCenter', article: `Exercise includes planned physical activity, while movement also encompasses walking, household activity, occupational activity, and reducing prolonged sitting. For PMOS, both contribute to overall health. Resistance training can support muscle strength and glucose disposal, while aerobic activity improves cardiovascular fitness. A practical program may combine moderate-intensity aerobic activity with strength training and frequent daily movement. The most effective plan is generally the one that can be maintained safely and consistently. Individuals with medical limitations should obtain appropriate advice before beginning vigorous exercise. Exercise goals should be individualized and adjusted according to symptoms, fitness, and life circumstances.

Physical activity can improve cardiorespiratory fitness, insulin sensitivity, metabolic health, and quality of life, even when body weight changes little. Aerobic activity and resistance training provide complementary benefits, but the most sustainable program is the one that fits the person's health status, preferences, schedule, and access to facilities or safe spaces.

A practical activity plan can start with manageable sessions and gradually increase frequency, duration, or intensity. Combining aerobic activity with resistance exercise can improve different components of fitness. Reducing prolonged sitting and adding routine daily movement can also contribute to overall activity. Symptoms, injuries, and medical conditions should guide progression.

${CLINICAL_PERSPECTIVE}

${WHEN_TO_SEEK_MEDICAL_ADVICE}

References for this subtab: [1], [3]` },
      { id: 'sleep-recovery', title: 'Sleep & Recovery', icon: 'Bedtime', article: `Sleep supports metabolic regulation, cognitive function, emotional health, and physical recovery. Poor sleep can affect appetite regulation, glucose metabolism, stress responses, and quality of life. Because sleep apnea is more prevalent in PMOS, persistent snoring, witnessed apneas, or excessive daytime sleepiness should prompt assessment. Sleep-supportive habits include a regular sleep schedule, adequate sleep duration, limiting stimulating substances near bedtime, and maintaining a comfortable sleep environment. Sleep problems that persist despite good sleep hygiene should be medically evaluated. Recovery is not an optional component of lifestyle care; it is part of maintaining sustainable physical activity and metabolic health.

Sleep is relevant to PMOS because poor sleep can affect glucose regulation, appetite, mood, recovery, and daily functioning. Obstructive sleep apnea is also more common in PMOS, particularly when other risk factors are present. Persistent snoring, witnessed breathing pauses, or excessive daytime sleepiness warrants clinical assessment rather than being attributed simply to stress or fatigue.

Practical sleep support includes keeping a consistent sleep and wake schedule, creating a dark and comfortable sleep environment, limiting stimulating activities close to bedtime, and addressing persistent snoring or daytime sleepiness clinically. If sleep remains poor despite basic measures, further assessment may be appropriate.

${CLINICAL_PERSPECTIVE}

${WHEN_TO_SEEK_MEDICAL_ADVICE}

References for this subtab: [1], [3]` },
      { id: 'stress-management', title: 'Stress Management', icon: 'SelfImprovement', article: `Stress-management strategies can support emotional well-being and help maintain healthy routines. Useful approaches include structured daily schedules, breathing exercises, mindfulness, relaxation training, physical activity, social connection, and evidence-based psychotherapy. Stress should not be presented as the primary cause of PMOS, which is a multifactorial endocrine and metabolic disorder. Instead, stress management is used to reduce the psychological and behavioral burden associated with living with a chronic condition. Strategies should be practical and culturally appropriate. When stress is persistent, causes substantial impairment, or occurs with anxiety or depressive symptoms, professional mental-health assessment may be appropriate.

${PSYCH_WELLBEING}

${PRACTICAL_ASSESSMENT_PSYCH}

${CLINICAL_PERSPECTIVE}

${WHEN_TO_SEEK_MEDICAL_ADVICE}

References for this subtab: [1], [3]` },
      { id: 'healthy-daily-habits', title: 'Healthy Daily Habits', icon: 'CheckCircle', article: `Daily habits that support PMOS care include regular meals, routine physical activity, adequate sleep, medication adherence when prescribed, menstrual tracking when useful, and attendance at recommended health checks. Small, consistent changes are generally more sustainable than extreme short-term interventions. Individuals should also avoid smoking and limit alcohol according to general health guidance. Because PMOS is heterogeneous, healthy habits should be adapted to medical conditions, pregnancy plans, work schedules, culture, and available resources. Progress should be evaluated through health outcomes and quality of life rather than through weight alone.

${LIFESTYLE_CARE}

${PATIENT_EDUCATION}

${CLINICAL_PERSPECTIVE}

${WHEN_TO_SEEK_MEDICAL_ADVICE}

References for this subtab: [1], [3]` },
      { id: 'weight-metabolic-health', title: 'Weight & Metabolic Health', icon: 'MonitorWeight', article: `Body weight is one component of metabolic health but is not a complete measure of it. In PMOS, assessment should also include glucose regulation, blood pressure, lipid profile, waist-related adiposity when clinically relevant, physical activity, sleep, and family history. People with overweight or obesity may benefit from evidence-based weight-management interventions, while individuals without overweight still require metabolic screening when indicated. The objective is to reduce cardiometabolic risk and improve health outcomes, not to achieve a predetermined appearance. Weight-related interventions should be free from stigma and should account for eating-disorder risk and individual preferences.

${INSULIN_RESISTANCE_INFO}

${WEIGHT_ONE_MEASURE}

${WEIGHT_MANAGEMENT_GOALS}

${CLINICAL_PERSPECTIVE}

${WHEN_TO_SEEK_MEDICAL_ADVICE}

References for this subtab: [1], [3], [5]` },
      { id: 'setting-lifestyle-goals', title: 'Setting Lifestyle Goals', icon: 'Flag', article: `Lifestyle goals in PMOS should be specific, achievable, measurable, and meaningful to the individual. Examples include increasing weekly physical activity, establishing a consistent sleep schedule, improving dietary fiber intake, reducing prolonged sitting, or attending recommended screening appointments. Goals should be reviewed periodically and adjusted when barriers arise. A useful plan identifies the behavior, frequency, context, and method of monitoring progress. Weight change can be one outcome when clinically appropriate, but it should not be the only measure of success. Sustainable behavior change is more important than short-term perfection, and setbacks should be treated as opportunities for adjustment rather than failure.

${LIFESTYLE_CARE}

${PATIENT_EDUCATION}

${CLINICAL_PERSPECTIVE}

${WHEN_TO_SEEK_MEDICAL_ADVICE}

References for this subtab: [1], [3]` },
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
