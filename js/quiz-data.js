/* AQ.QUIZZES — 5 questions per module. c = index of correct option. */
window.AQ = window.AQ || {};

AQ.QUIZZES = {
  ele: [
    { en: { q: 'What is the medium-voltage level supplied to the compound?', o: ['400 V', '13.8 kV', '33 kV', '220 V'] },
      ar: { q: 'ما مستوى الجهد المتوسط المغذي للمجمع؟', o: ['400 فولت', '13.8 كيلوفولت', '33 كيلوفولت', '220 فولت'] }, c: 1 },
    { en: { q: 'What does the ATS do when utility power fails?', o: ['Shuts down all loads', 'Transfers the load to generator supply', 'Charges the UPS', 'Trips the transformers'] },
      ar: { q: 'ماذا يفعل مفتاح التحويل ATS عند انقطاع التيار من الشبكة؟', o: ['يفصل كل الأحمال', 'ينقل الحمل إلى تغذية المولدات', 'يشحن UPS', 'يفصل المحولات'] }, c: 1 },
    { en: { q: 'How many standby generators feed the generator busbar, and at what rating?', o: ['4 × 800 kVA', '7 × 1400 kVA', '8 × 1000 kVA', '2 × 2000 kVA'] },
      ar: { q: 'كم عدد مولدات الطوارئ المغذية لقضيب المولدات وما قدرتها؟', o: ['4 × 800 ك.ف.أ', '7 × 1400 ك.ف.أ', '8 × 1000 ك.ف.أ', '2 × 2000 ك.ف.أ'] }, c: 1 },
    { en: { q: 'What is the role of the UPS during an ATS transfer?', o: ['It replaces the generators', 'It bridges critical loads instantly during the transfer gap', 'It powers the whole compound', 'It starts the diesel generators'] },
      ar: { q: 'ما دور UPS أثناء تحويل ATS؟', o: ['يحل محل المولدات', 'يغذي الأحمال الحساسة فورًا خلال فجوة التحويل', 'يغذي المجمع كاملًا', 'يشغّل مولدات الديزل'] }, c: 1 },
    { en: { q: 'When a detector activates, what does the ASR help do?', o: ['Steps down the voltage', 'Links the alarm zone with the nearest camera for the operator', 'Refuels the generators', 'Opens the RMU'] },
      ar: { q: 'عند تفعيل كاشف حريق، بماذا يساعد نظام ASR؟', o: ['يخفض الجهد', 'يربط منطقة الإنذار بأقرب كاميرا للمشغل', 'يزود المولدات بالوقود', 'يفتح RMU'] }, c: 1 }
  ],
  aws: [
    { en: { q: 'What is the source of the facility\u2019s water?', o: ['Wells on site', 'National Water Company via two lines', 'Sea water intake', 'Rain collection'] },
      ar: { q: 'ما مصدر مياه المنشأة؟', o: ['آبار في الموقع', 'شركة المياه الوطنية عبر خطين', 'مأخذ مياه بحر', 'تجميع أمطار'] }, c: 1 },
    { en: { q: 'Why must chlorine be removed before the RO membranes?', o: ['It makes water taste better', 'Chlorine damages the membranes', 'It increases pressure', 'It clogs the sand filter'] },
      ar: { q: 'لماذا يجب إزالة الكلور قبل أغشية التناضح العكسي؟', o: ['لتحسين الطعم', 'لأن الكلور يتلف الأغشية', 'لزيادة الضغط', 'لأنه يسد فلتر الرمل'] }, c: 1 },
    { en: { q: 'Which pump starts first on a small pressure drop in the fire network?', o: ['Diesel pump', 'Jockey pump', 'Electric fire pump', 'Transfer pump'] },
      ar: { q: 'أي مضخة تعمل أولًا عند هبوط ضغط بسيط في شبكة الحريق؟', o: ['مضخة الديزل', 'المضخة الجوكي', 'مضخة الحريق الكهربائية', 'مضخة النقل'] }, c: 1 },
    { en: { q: 'When does the diesel fire pump run?', o: ['Every morning', 'When the electric pump fails or power is lost', 'During normal pressure', 'Only for testing'] },
      ar: { q: 'متى تعمل مضخة الحريق بالديزل؟', o: ['كل صباح', 'عند تعطل المضخة الكهربائية أو انقطاع الكهرباء', 'أثناء الضغط الطبيعي', 'للاختبار فقط'] }, c: 1 },
    { en: { q: 'Why is air compressed in two screw stages with cooling between them?', o: ['To add moisture', 'To control temperature and improve efficiency', 'To reduce pressure', 'To bypass the dryer'] },
      ar: { q: 'لماذا يُضغط الهواء على مرحلتين مع تبريد بينهما؟', o: ['لإضافة رطوبة', 'للتحكم في الحرارة وتحسين الكفاءة', 'لتقليل الضغط', 'لتجاوز المجفف'] }, c: 1 }
  ],
  mr4: [
    { en: { q: 'Which refrigerant does the MR4 system use?', o: ['R-410', 'R-22', 'R-404', 'Ammonia'] },
      ar: { q: 'ما غاز التبريد المستخدم في نظام MR4؟', o: ['R-410', 'R-22', 'R-404', 'أمونيا'] }, c: 1 },
    { en: { q: 'How many compressors work in parallel on the MR4 rack?', o: ['9', '15', '27', '5'] },
      ar: { q: 'كم عدد الضواغط العاملة على التوازي في رف MR4؟', o: ['9', '15', '27', '5'] }, c: 1 },
    { en: { q: 'How many condensers are installed, and how many fans does each carry?', o: ['9 condensers × 3 fans', '15 condensers × 2 fans', '3 condensers × 9 fans', '27 condensers × 1 fan'] },
      ar: { q: 'كم عدد المكثفات وكم مروحة لكل منها؟', o: ['9 مكثفات × 3 مراوح', '15 مكثفًا × مروحتان', '3 مكثفات × 9 مراوح', '27 مكثفًا × مروحة'] }, c: 0 },
    { en: { q: 'What happens in the expansion device?', o: ['Pressure and temperature rise', 'Pressure drops and the refrigerant chills', 'Refrigerant is stored', 'Heat is rejected to air'] },
      ar: { q: 'ماذا يحدث في أداة التمدد؟', o: ['يرتفع الضغط والحرارة', 'يهبط الضغط ويبرد الوسيط', 'يُخزَّن الوسيط', 'تُطرد الحرارة للهواء'] }, c: 1 },
    { en: { q: 'What system monitors and controls the MR4 plant?', o: ['SCADA + AKC', 'GPS', 'CCTV only', 'Manual gauges only'] },
      ar: { q: 'ما النظام الذي يراقب ويتحكم في MR4؟', o: ['SCADA + AKC', 'GPS', 'كاميرات فقط', 'عدادات يدوية فقط'] }, c: 0 }
  ],
  hatchback: [
    { en: { q: 'Which unit provides central air conditioning through ducts to several rooms?', o: ['FCU', 'AHU', 'Split unit', 'CRAC'] },
      ar: { q: 'أي وحدة توفر تكييفًا مركزيًا عبر مجاري الهواء لعدة غرف؟', o: ['FCU', 'AHU', 'سبليت', 'CRAC'] }, c: 1 },
    { en: { q: 'What refrigerant does the split unit use?', o: ['R-407', 'R-410', 'R-507', 'Galco'] },
      ar: { q: 'ما غاز التبريد في وحدة السبليت؟', o: ['R-407', 'R-410', 'R-507', 'جالكو'] }, c: 1 },
    { en: { q: 'The CRAC unit is designed to protect which type of room?', o: ['Cold stores', 'Server / equipment rooms', 'Kitchens', 'Offices only'] },
      ar: { q: 'وحدة CRAC مصممة لحماية أي نوع من الغرف؟', o: ['غرف التبريد', 'غرف الخوادم والمعدات', 'المطابخ', 'المكاتب فقط'] }, c: 1 },
    { en: { q: 'What is special about the FAU (Fresh Air Unit)?', o: ['It uses R-404', 'It uses no Freon — it cools with cold Galco flow', 'It only heats air', 'It is underground'] },
      ar: { q: 'ما المميز في وحدة الهواء النقي FAU؟', o: ['تستخدم R-404', 'بلا فريون — تبرد بتدفق جالكو البارد', 'تسخن الهواء فقط', 'تحت الأرض'] }, c: 1 },
    { en: { q: 'Which refrigerant serves the 3rd-floor cold store?', o: ['R-507', 'R-410', 'R-407', 'Galco'] },
      ar: { q: 'ما غاز التبريد لغرفة التبريد بالدور الثالث؟', o: ['R-507', 'R-410', 'R-407', 'جالكو'] }, c: 0 }
  ],
  poultry: [
    { en: { q: 'What temperature is the frozen storage kept at?', o: ['-4 \u00b0C', '-16 \u00b0C', '0 \u00b0C', '-31 \u00b0C'] },
      ar: { q: 'ما درجة حرارة مستودع التجميد؟', o: ['-4 م', '-16 م', '0 م', '-31 م'] }, c: 1 },
    { en: { q: 'How long does the Rinsing Scan Midi cycle take?', o: ['5 minutes', '20 minutes', '60 minutes', '2 hours'] },
      ar: { q: 'كم تستغرق دورة الشطف Scan Midi؟', o: ['5 دقائق', '20 دقيقة', '60 دقيقة', 'ساعتان'] }, c: 1 },
    { en: { q: 'Where do rejected pieces from inspection go?', o: ['Waste bins', 'The shawarma line for mincing', 'Back to defrosting', 'Directly to dispatch'] },
      ar: { q: 'إلى أين تذهب القطع المرفوضة من الفحص؟', o: ['النفايات', 'خط الشاورما للفرم', 'إلى التذويب مجددًا', 'إلى الشحن مباشرة'] }, c: 1 },
    { en: { q: 'What does the GCM freezer do in Area 18?', o: ['Fries the product', 'Freezes product at \u221231 \u00b0C for ~40 minutes', 'Packs the product', 'Washes the line'] },
      ar: { q: 'ما وظيفة مجمد GCM في منطقة 18؟', o: ['يقلي المنتج', 'يجمد المنتج عند -31 م لمدة ~40 دقيقة', 'يعبئ المنتج', 'يغسل الخط'] }, c: 1 },
    { en: { q: 'When is the weekly preventive maintenance window?', o: ['Monday morning', 'Friday 02:00\u201311:00', 'Every midnight', 'Sunday 12:00\u201314:00'] },
      ar: { q: 'متى نافذة الصيانة الوقائية الأسبوعية؟', o: ['صباح الاثنين', 'الجمعة 02:00–11:00', 'كل منتصف ليل', 'الأحد 12:00–14:00'] }, c: 1 }
  ]
};
