// src/services/lifestyleService.js

// This service simulates fetching lifestyle articles from a backend database.
// In a production environment, this would be replaced by actual API calls (e.g., using axios).

const mockArticles = [
  {
    id: 'healthy-diet',
    image: '/healthy-diet.jpg',
    category: 'Nutrition',
    icon: '🥗',
    translations: {
      en: {
        title: "Balanced Diet for Hormonal Health",
        description: "Discover how nutrition plays a vital role in managing PMOS and improving overall well-being.",
        whatIsIt: "A balanced diet provides essential nutrients the body needs to function properly. For women with PMOS, it involves focusing on whole foods, low glycemic index carbohydrates, lean proteins, and healthy fats.",
        whyIsItImportant: "Diet directly impacts insulin resistance, inflammation, and hormone production—key factors in PMOS.",
        benefits: ["Improves insulin sensitivity", "Helps maintain a healthy weight", "Reduces inflammation", "Regulates menstrual cycles"],
        recommendations: "Aim for a plate that is 50% vegetables, 25% lean protein, and 25% complex carbohydrates.",
        thingsToAvoid: ["Highly processed foods", "Sugary drinks and snacks", "Refined carbohydrates (white bread, pastries)", "Excessive saturated fats"],
        quickTips: ["Drink plenty of water", "Never skip breakfast", "Include fiber in every meal"],
      },
      hi: {
        title: "हार्मोनल स्वास्थ्य के लिए संतुलित आहार",
        description: "जानें कि पीसीओएस (PMOS) को प्रबंधित करने और समग्र स्वास्थ्य को बेहतर बनाने में पोषण कैसे महत्वपूर्ण भूमिका निभाता है।",
        whatIsIt: "संतुलित आहार शरीर को ठीक से काम करने के लिए आवश्यक पोषक तत्व प्रदान करता है। पीसीओएस वाली महिलाओं के लिए, इसमें साबुत अनाज, कम ग्लाइसेमिक इंडेक्स वाले कार्बोहाइड्रेट, लीन प्रोटीन और स्वस्थ वसा पर ध्यान केंद्रित करना शामिल है।",
        whyIsItImportant: "आहार सीधे इंसुलिन प्रतिरोध, सूजन और हार्मोन उत्पादन को प्रभावित करता है - जो पीसीओएस में प्रमुख कारक हैं।",
        benefits: ["इंसुलिन संवेदनशीलता में सुधार करता है", "स्वस्थ वजन बनाए रखने में मदद करता है", "सूजन कम करता है", "मासिक धर्म चक्र को नियंत्रित करता है"],
        recommendations: "ऐसी प्लेट का लक्ष्य रखें जिसमें 50% सब्जियां, 25% लीन प्रोटीन और 25% जटिल कार्बोहाइड्रेट हों।",
        thingsToAvoid: ["अत्यधिक प्रसंस्कृत खाद्य पदार्थ", "मीठे पेय और स्नैक्स", "परिष्कृत कार्बोहाइड्रेट", "अत्यधिक संतृप्त वसा"],
        quickTips: ["खूब पानी पिएं", "कभी भी नाश्ता न छोड़ें", "हर भोजन में फाइबर शामिल करें"],
      },
      mr: {
        title: "हार्मोनल आरोग्यासाठी संतुलित आहार",
        description: "पीसीओएस (PMOS) व्यवस्थापित करण्यात आणि एकंदर आरोग्य सुधारण्यात पोषण कशी महत्त्वाची भूमिका बजावते ते शोधा.",
        whatIsIt: "संतुलित आहार शरीराला योग्यरित्या कार्य करण्यासाठी आवश्यक पोषक तत्त्वे प्रदान करतो. पीसीओएस असलेल्या महिलांसाठी, यामध्ये संपूर्ण धान्य, कमी ग्लायसेमिक इंडेक्स कार्बोहायड्रेट्स, पातळ प्रथिने आणि निरोगी चरबी यावर लक्ष केंद्रित करणे समाविष्ट आहे.",
        whyIsItImportant: "आहार थेट इन्सुलिन प्रतिरोध, जळजळ आणि संप्रेरक उत्पादनावर परिणाम करतो - जे पीसीओएस मधील प्रमुख घटक आहेत.",
        benefits: ["इन्सुलिन संवेदनशीलता सुधारते", "निरोगी वजन राखण्यास मदत करते", "जळजळ कमी करते", "मासिक पाळी नियंत्रित करते"],
        recommendations: "अशा प्लेटचे लक्ष्य ठेवा ज्यामध्ये ५०% भाज्या, २५% प्रथिने आणि २५% जटिल कर्बोदके असतील.",
        thingsToAvoid: ["अति प्रक्रिया केलेले पदार्थ", "साखरयुक्त पेये आणि स्नॅक्स", "परिष्कृत कार्बोहायड्रेट्स", "अतिरिक्त संतृप्त चरबी"],
        quickTips: ["भरपूर पाणी प्या", "कधीही नाश्ता वगळू नका", "प्रत्येक जेवणात फायबर समाविष्ट करा"],
      }
    }
  },
  {
    id: 'daily-exercise',
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=1000&auto=format&fit=crop',
    category: 'Exercise',
    icon: '🏃‍♀️',
    translations: {
      en: {
        title: "Exercise for PMOS Management",
        description: "Learn which types of physical activities are most effective for hormonal balance.",
        whatIsIt: "Regular physical activity that includes a mix of cardiovascular exercises, strength training, and flexibility workouts.",
        whyIsItImportant: "Exercise helps lower insulin levels, reduces stress, and aids in weight management, significantly improving PMOS symptoms.",
        benefits: ["Boosts metabolism", "Enhances mood and reduces anxiety", "Builds lean muscle mass", "Improves cardiovascular health"],
        recommendations: "Aim for at least 150 minutes of moderate-intensity aerobic activity or 75 minutes of vigorous activity each week, plus strength training twice a week.",
        thingsToAvoid: ["Overtraining, which can increase stress hormones", "Exercising immediately after a heavy meal"],
        quickTips: ["Find an activity you enjoy", "Start slow if you are new to exercising", "Stay consistent"],
      },
      hi: {
        title: "पीसीओएस प्रबंधन के लिए व्यायाम",
        description: "जानें कि हार्मोनल संतुलन के लिए कौन सी शारीरिक गतिविधियाँ सबसे प्रभावी हैं।",
        whatIsIt: "नियमित शारीरिक गतिविधि जिसमें हृदय व्यायाम, शक्ति प्रशिक्षण (strength training) और लचीलापन व्यायाम का मिश्रण शामिल है।",
        whyIsItImportant: "व्यायाम इंसुलिन के स्तर को कम करने में मदद करता है, तनाव कम करता है, और वजन प्रबंधन में सहायता करता है, जिससे पीसीओएस के लक्षणों में काफी सुधार होता है।",
        benefits: ["चयापचय (metabolism) को बढ़ाता है", "मूड में सुधार करता है और चिंता कम करता है", "मांसपेशियों का निर्माण करता है", "हृदय स्वास्थ्य में सुधार करता है"],
        recommendations: "हर सप्ताह कम से कम 150 मिनट की मध्यम-तीव्रता वाली एरोबिक गतिविधि, साथ ही सप्ताह में दो बार शक्ति प्रशिक्षण (strength training) का लक्ष्य रखें।",
        thingsToAvoid: ["अत्यधिक व्यायाम, जो तनाव हार्मोन बढ़ा सकता है", "भारी भोजन के तुरंत बाद व्यायाम करना"],
        quickTips: ["ऐसी गतिविधि खोजें जिसका आप आनंद लेते हैं", "यदि आप नए हैं तो धीरे-धीरे शुरू करें", "नियमित रहें"],
      },
      mr: {
        title: "पीसीओएस व्यवस्थापनासाठी व्यायाम",
        description: "हार्मोनल संतुलनासाठी कोणत्या शारीरिक क्रियाकलाप सर्वात प्रभावी आहेत ते जाणून घ्या.",
        whatIsIt: "नियमित शारीरिक क्रियाकलाप ज्यामध्ये हृदय व रक्तवाहिन्यासंबंधी व्यायाम, सामर्थ्य प्रशिक्षण आणि लवचिकता व्यायामाचे मिश्रण समाविष्ट आहे.",
        whyIsItImportant: "व्यायाम इन्सुलिनची पातळी कमी करण्यास मदत करतो, तणाव कमी करतो आणि वजन व्यवस्थापनात मदत करतो, ज्यामुळे पीसीओएसची लक्षणे लक्षणीयरीत्या सुधारतात.",
        benefits: ["चयापचय वाढवते", "मूड सुधारते आणि चिंता कमी करते", "स्नायू तयार करते", "हृदयाचे आरोग्य सुधारते"],
        recommendations: "दर आठवड्याला किमान १५० मिनिटे मध्यम-तीव्रतेचा एरोबिक क्रियाकलाप किंवा ७५ मिनिटे जोमदार क्रियाकलाप, तसेच आठवड्यातून दोनदा सामर्थ्य प्रशिक्षणाचे लक्ष्य ठेवा.",
        thingsToAvoid: ["अतिव्यायाम, ज्यामुळे तणाव हार्मोन्स वाढू शकतात", "जड जेवणानंतर लगेच व्यायाम करणे"],
        quickTips: ["तुम्हाला आवडणारी क्रियाकलाप शोधा", "तुम्ही नवीन असाल तर हळू सुरुवात करा", "सातत्यपूर्ण रहा"],
      }
    }
  },
  {
    id: 'mental-health',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1000&auto=format&fit=crop',
    category: 'Mental Health',
    icon: '🧘‍♀️',
    translations: {
      en: {
        title: "Stress Management & Mental Wellbeing",
        description: "Effective techniques to lower cortisol levels and improve your mental health.",
        whatIsIt: "Practices and habits designed to reduce psychological stress and promote emotional resilience.",
        whyIsItImportant: "Chronic stress elevates cortisol levels, which can disrupt other hormones and worsen insulin resistance and PMOS symptoms.",
        benefits: ["Lowers cortisol levels", "Improves sleep quality", "Reduces emotional eating", "Enhances focus and clarity"],
        recommendations: "Practice mindfulness, meditation, deep breathing exercises, or yoga for at least 10-15 minutes daily.",
        thingsToAvoid: ["Excessive caffeine intake", "Doomscrolling on social media", "Ignoring signs of burnout"],
        quickTips: ["Take short walks in nature", "Journal your thoughts", "Prioritize 'me time'"],
      },
      hi: {
        title: "तनाव प्रबंधन और मानसिक स्वास्थ्य",
        description: "कोर्टिसोल के स्तर को कम करने और अपने मानसिक स्वास्थ्य में सुधार करने की प्रभावी तकनीकें।",
        whatIsIt: "मनोवैज्ञानिक तनाव को कम करने और भावनात्मक लचीलेपन को बढ़ावा देने के लिए डिज़ाइन की गई प्रथाएं और आदतें।",
        whyIsItImportant: "लगातार तनाव कोर्टिसोल के स्तर को बढ़ाता है, जो अन्य हार्मोनों को बाधित कर सकता है और इंसुलिन प्रतिरोध और पीसीओएस के लक्षणों को खराब कर सकता है।",
        benefits: ["कोर्टिसोल के स्तर को कम करता है", "नींद की गुणवत्ता में सुधार करता है", "भावनात्मक खाने (emotional eating) को कम करता है", "फोकस बढ़ाता है"],
        recommendations: "रोजाना कम से कम 10-15 मिनट तक माइंडफुलनेस, ध्यान, गहरी सांस लेने के व्यायाम या योग का अभ्यास करें।",
        thingsToAvoid: ["अत्यधिक कैफीन का सेवन", "सोशल मीडिया पर लगातार नकारात्मक खबरें पढ़ना", "थकान के संकेतों को नजरअंदाज करना"],
        quickTips: ["प्रकृति में छोटी सैर करें", "अपने विचारों को डायरी में लिखें", "खुद के लिए समय निकालें"],
      },
      mr: {
        title: "तणाव व्यवस्थापन आणि मानसिक आरोग्य",
        description: "कॉर्टिसोलची पातळी कमी करण्यासाठी आणि तुमचे मानसिक आरोग्य सुधारण्यासाठी प्रभावी तंत्रे.",
        whatIsIt: "मानसिक ताण कमी करण्यासाठी आणि भावनिक लवचिकता वाढवण्यासाठी डिझाइन केलेल्या पद्धती आणि सवयी.",
        whyIsItImportant: "तीव्र तणावामुळे कॉर्टिसोलची पातळी वाढते, ज्यामुळे इतर हार्मोन्स विस्कळीत होऊ शकतात आणि इन्सुलिन प्रतिरोध आणि पीसीओएसची लक्षणे वाढू शकतात.",
        benefits: ["कॉर्टिसोलची पातळी कमी करते", "झोपेची गुणवत्ता सुधारते", "भावनिक खाणे कमी करते", "लक्ष केंद्रित करते"],
        recommendations: "दररोज किमान १०-१५ मिनिटे माइंडफुलनेस, ध्यान, खोल श्वासोच्छवासाचे व्यायाम किंवा योगाभ्यास करा.",
        thingsToAvoid: ["अतिरिक्त कॅफीनचे सेवन", "सोशल मीडियाचा अतिवापर", "थकव्याच्या लक्षणांकडे दुर्लक्ष करणे"],
        quickTips: ["निसर्गात फेरफटका मारा", "तुमचे विचार डायरीत लिहा", "स्वतःसाठी वेळ काढा"],
      }
    }
  },
  {
    id: 'healthy-sleep',
    image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?q=80&w=1000&auto=format&fit=crop',
    category: 'Sleep',
    icon: '😴',
    translations: {
      en: {
        title: "The Importance of Healthy Sleep",
        description: "Why getting 7-9 hours of quality sleep is crucial for your hormone regulation.",
        whatIsIt: "Sleep hygiene involves habits that ensure you get sufficient, restful, and uninterrupted sleep each night.",
        whyIsItImportant: "Sleep is when the body repairs itself and regulates hormones, including cortisol, insulin, and reproductive hormones.",
        benefits: ["Regulates appetite hormones", "Improves insulin sensitivity", "Reduces fatigue", "Enhances immune function"],
        recommendations: "Maintain a consistent sleep schedule and aim for 7-9 hours of sleep per night.",
        thingsToAvoid: ["Screens (phones, TVs) 1 hour before bed", "Heavy meals late at night", "Caffeine in the late afternoon or evening"],
        quickTips: ["Keep your bedroom cool and dark", "Read a book before bed", "Establish a relaxing bedtime routine"],
      },
      hi: {
        title: "स्वस्थ नींद का महत्व",
        description: "आपके हार्मोन विनियमन के लिए 7-9 घंटे की अच्छी नींद लेना क्यों महत्वपूर्ण है।",
        whatIsIt: "नींद की स्वच्छता में ऐसी आदतें शामिल हैं जो यह सुनिश्चित करती हैं कि आपको हर रात पर्याप्त, आरामदायक और निर्बाध नींद मिले।",
        whyIsItImportant: "नींद के दौरान शरीर खुद की मरम्मत करता है और कोर्टिसोल, इंसुलिन और प्रजनन हार्मोन सहित हार्मोनों को नियंत्रित करता है।",
        benefits: ["भूख लगने वाले हार्मोन को नियंत्रित करता है", "इंसुलिन संवेदनशीलता में सुधार करता है", "थकान कम करता है", "प्रतिरक्षा समारोह को बढ़ाता है"],
        recommendations: "सोने का एक निश्चित समय बनाए रखें और प्रति रात 7-9 घंटे की नींद का लक्ष्य रखें।",
        thingsToAvoid: ["सोने से 1 घंटे पहले स्क्रीन (फोन, टीवी)", "देर रात भारी भोजन", "देर दोपहर या शाम को कैफीन"],
        quickTips: ["अपने शयनकक्ष को ठंडा और अंधेरा रखें", "सोने से पहले कोई किताब पढ़ें", "सोने से पहले एक आरामदायक दिनचर्या स्थापित करें"],
      },
      mr: {
        title: "निरोगी झोपेचे महत्त्व",
        description: "तुमच्या संप्रेरक नियमनासाठी ७-९ तासांची दर्जेदार झोप का महत्त्वाची आहे.",
        whatIsIt: "स्लीप हायजीनमध्ये अशा सवयींचा समावेश असतो ज्याद्वारे तुम्हाला दररोज पुरेशी, आरामदायी आणि अखंड झोप मिळेल.",
        whyIsItImportant: "झोपेत असताना शरीर स्वतःची दुरुस्ती करते आणि कॉर्टिसोल, इन्सुलिन आणि पुनरुत्पादक संप्रेरकांसह हार्मोन्सचे नियमन करते.",
        benefits: ["भूक संप्रेरकांचे नियमन罚े", "इन्सुलिन संवेदनशीलता सुधारते", "थकवा कमी करते", "रोगप्रतिकारक शक्ती वाढवते"],
        recommendations: "झोपेचे वेळापत्रक निश्चित ठेवा आणि रात्री ७-९ तासांच्या झोपेचे लक्ष्य ठेवा.",
        thingsToAvoid: ["झोपण्यापूर्वी १ तास स्क्रीन (फोन, टीव्ही)", "रात्री उशिरा जड जेवण", "दुपारी किंवा संध्याकाळी उशिरा कॅफीन"],
        quickTips: ["तुमची बेडरूम थंड आणि अंधारी ठेवा", "झोपण्यापूर्वी पुस्तक वाचा", "झोपण्यापूर्वी आरामदायी दिनचर्या स्थापित करा"],
      }
    }
  }
];

export const lifestyleService = {
  /**
   * Fetch all articles (summaries).
   * @param {string} lang - The language code ('en', 'hi', 'mr').
   * @returns {Promise<Array>} List of articles mapped to the requested language.
   */
  getArticles: async (lang = 'en') => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return mockArticles.map(article => ({
      id: article.id,
      image: article.image,
      category: article.category,
      icon: article.icon,
      title: article.translations[lang]?.title || article.translations['en'].title,
      description: article.translations[lang]?.description || article.translations['en'].description,
    }));
  },

  /**
   * Fetch a single article by ID.
   * @param {string} id - The article ID.
   * @param {string} lang - The language code.
   * @returns {Promise<Object>} The article data.
   */
  getArticleById: async (id, lang = 'en') => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const article = mockArticles.find(a => a.id === id);
    if (!article) throw new Error("Article not found");

    const content = article.translations[lang] || article.translations['en'];
    
    return {
      id: article.id,
      image: article.image,
      category: article.category,
      icon: article.icon,
      ...content
    };
  }
};
