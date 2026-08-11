import { Article, MagazineIssue, VideoItem, AudioItem, InfographicItem, TeamMember, ContactMessage, CoHostUser } from '../types';

export const initialArticles: Article[] = [
  {
    id: 'art-issue1-1',
    title_fa: 'چرا ایدئولوژی مهدویت؟ (یادداشت سردبیر)',
    slug: 'why-ideology-of-mahdism-editorial',
    excerpt_fa: 'در روزگاری که انسان معاصر زیر بار سنگین بی‌عدالتی کمر خم کرده و سیستم‌های بشری از پاسخ به نیازهای معنوی عاجزند، ایدئولوژی مهدویت دریچه‌ای نو به سوی آینده‌ای روشن می‌گشاید.',
    content_fa: `بنام خدای عادل جل جلاله، که فریاد مستضعفان را می‌شنود و وعده داده است تا سردمداری و رهبری زمین را به بندگان مؤمن و صالح‌اش بسپارد و جهان را بر پایه‌ی عدالت، برادری و برابری برای همه‌ی ساکنانش برقرار سازد.

در روزگاری که انسان معاصر، زیر بار سنگین بی‌عدالتی، ظلم و فریب کمر خم کرده و به دنبال پناهگاهی برای آسایش مادی و آرامش معنوی، عدالت اجتماعی و امیدی برای فرداهای روشن است؛ در زمانی که او احساس می‌کند هیچ یک از نظام‌ها و ایدئولوژی‌های موجود بشری توان پاسخگویی به نیازهای عمیق مادی، معنوی، فردی و اجتماعی‌اش را ندارند؛ ما در جایگاه مسلمانان و انسان‌هایی رسالتمند، اهل گفت‌وگو و دغدغه‌مند برای سرنوشت مشترک بشریت امروزی؛ تصمیم گرفتیم، دریچه‌ای نو بگشاییم.

این دریچه، نام خود را از مفهومی برگرفته است که هم در اعماق تاریخ دینی-سیاسی جهان ما جای دارد و هم در افق آینده‌های روشن برای بشر شوریده‌سر امروزی از اهمیت فوق‌العاده‌ای برخوردار است: **ایدئولوژی مهدویت!**

### عهدی نو برای بیداری شناختی
مجله‌ای که اکنون نخستین شماره‌ی آن را ورق می‌زنید، با هدف تبیین و بازاندیشی در باره‌ی این مفهوم عمیق تأسیس شده است. ایده‌ی این نشریه در دل همین بحران‌های موجود و فراگیر جهانی، در میان دود و خاکستر جنگ‌های روانی و فیزیکی علیه بشریت مظلوم امروزی شکل گرفته است.

ایدئولوژی مهدویت در نگاه ما صرفاً روایتی از آینده‌ای مبهم و دور نیست که تنها با دعا و زاری منتظر ظهور ناجی باشیم. این ایده‌ی مقدس در اصل و ذات خود یک دعوت است؛ دعوت به تحول، بیداری و بازسازی اخلاق، فردی و اجتماعی؛ فراخوانی برای برپایی نظام انسانی در سطح جهانی که در آن سلامت، عدالت، صلح و همزیستی بر همه‌جا و همه‌کس حاکم باشد.

حضرت مهدی (علیه‌السلام)، در این نگاه، نه تنها رهبر دینی برای گروهی خاص، بلکه نماینده‌ی اراده‌ی الهی برای بازگرداندن تعادل به حیات بشر و تحقق یک ساختار جهانی آرام و انسانی بر مبنای عدالت است.`,
    category_fa: 'سرمقاله‌ها',
    author_name_fa: 'میر الهام الدین سادات',
    author_title_fa: 'سردبیر و پژوهشگر ارشد مهدویت',
    author_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    read_time_fa: '۶ دقیقه',
    published_at: 'تابستان ۱۴۰۴ خورشیدی',
    image_url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    featured: true,
    audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    views: 3100,
  },
  {
    id: 'art-issue1-2',
    title_fa: 'رهبریت در اسلام؛ اصول، مبانی و مسئولیت‌ها',
    slug: 'leadership-in-islam',
    excerpt_fa: 'رهبریت در اسلام جایگاهی الهی و مسئولیتی سنگین به شمار می‌آید که بر مبنای تقوا، عدالت و شایستگی استوار است. بررسی جایگاه رهبری از منظر قرآن و سنت نبوی.',
    content_fa: `رهبریت در اسلام جایگاهی الهی و مسئولیتی سنگین به شمار می‌آید که بر مبنای تقوا، عدالت و شایستگی استوار است. قرآن کریم و سنت پیامبر اکرم (ص) رهبری را وسیله‌ای برای هدایت مردم به سوی خیر و صلاح معرفی می‌کنند.

در اندیشه اسلامی، اطاعت از رهبر عادل، اطاعت از خداوند تلقی می‌شود. هدف نهایی رهبری در اسلام، تحقق عدالت، رشد معنوی، حفظ وحدت امت اسلامی و حاکمیت دین در روی زمین است.

### ۱. رهبریت از منظر قرآن:
- **متابعت از پیامبر (ص) نماد محبت الهی:** «قُلْ إِن کُنتُمْ تُحِبُّونَ اللَّهَ فَاتَّبِعُونِی یُحْبِبْکُمُ اللَّهُ» (آل عمران، ۳۱).
- **اطاعت از پیامبر، اطاعت از خداست:** «مَّن یُطِعِ الرَّسُولَ فَقَدْ أَطَاعَ اللَّهَ» (نساء، ۸۰).
- **تبعیت از اولی‌الامر:** «أَطِیعُوا اللَّهَ وَأَطِیعُوا الرَّسُولَ وَأُولِی الْأَمْرِ مِنکُمْ» (نساء، ۵۹).`,
    category_fa: 'تحلیل‌ها',
    author_name_fa: 'عبدالظهور مدبر',
    author_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    read_time_fa: '۱۰ دقیقه',
    published_at: 'تابستان ۱۴۰۴ خورشیدی',
    image_url: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80',
    featured: true,
    views: 2420,
  },
  {
    id: 'art-issue1-3',
    title_fa: 'داشتن رهبری سلیم پس از توحید بزرگترین نعمت خداست',
    slug: 'honest-leadership-greatest-blessing',
    excerpt_fa: 'میزان محبت یک رهبر سلیم نسبت به رعیت مانند دلسوزی پدر نسبت به فرزندان است. نقد بی‌کفایتی زعمای دنیاطلب و ضرورت شعور سیاسی جمعی.',
    content_fa: `میزان محبت یک رهبر سلیم نسبت به رعیت به اندازه محبت، دلسوزی و مراقبت یک پدر نسبت به فرزندان است؛ با این تفاوت که اکثراً پدران توجه به تربیت و رشد ظاهری فرزندان کنند اما رهبران سلیم عنایت جدی به رشد ظاهری و باطنی رعیت در قلمرو خود می‌داشته باشند.

بدرستی که نقش رهبر در جامعه مانند روح است که آسایش و آرامش جامعه بستگی به موجودیت رهبران آزاده، سلیم، خبیر و خردمند دارد. چنانچه در نبود روح، جسد پوسیده و گندیده می‌شود، در نبود زعیم سلیم و وطن‌خواه، جامعه رو به فساد و پوسیدگی می‌گراید.

*شهی که پاس رعیت نگاه می‌دارد / حلال باد خراجش که مزد چوپانی ست*
*وگرنه راعی خلق ست زهرمارش باد / که هرچه می‌خورد او جزیت مسلمانی ست (سعدی)*`,
    category_fa: 'نقد مکاتب',
    author_name_fa: 'حبیب الله شریفی',
    author_avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    read_time_fa: '۵ دقیقه',
    published_at: 'تابستان ۱۴۰۴ خورشیدی',
    image_url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80',
    featured: false,
    views: 1890,
  }
];

// Helper to generate full 45 pages for Issue 1
const generateIssuePages = () => {
  const pageTitles = [
    'جلد شماره نخست مجله ایدئولوژی مهدویت',
    'فهرست مطالب (بخش ۱)',
    'فهرست مطالب (بخش ۲) و شناسنامه مجله',
    'چرا ایدئولوژی مهدویت؟ - یادداشت سردبیر (صفحه ۱)',
    'چرا ایدئولوژی مهدویت؟ (صفحه ۲ - نقد اومانیسم)',
    'چرا ایدئولوژی مهدویت؟ (صفحه ۳ - افق مهدوی)',
    'رهبریت در اسلام - استاد عبدالظهور مدبر (صفحه ۱)',
    'رهبریت در اسلام (صفحه ۲ - متابعت از رسول)',
    'رهبریت در اسلام (صفحه ۳ - اولی‌الامر)',
    'رهبریت در اسلام (صفحه ۴ - پیروی از مرشد)',
    'رهبریت در اسلام (صفحه ۵ - اهل ذکر & تقوا)',
    'رهبریت در اسلام (صفحه ۶ - نتیجه‌گیری)',
    'داشتن رهبری سلیم پس از توحید - دکتر حبیب الله شریفی',
    'تنهایی - شعر و طرح برای کودکان غزه',
    'اخوت اسلامی و وحدت امت - بیژن بهزاد (صفحه ۱)',
    'اخوت اسلامی و وحدت امت (صفحه ۲ - نقد تفرقه)',
    'اخوت اسلامی و وحدت امت (صفحه ۳ - راهکارهای عملی)',
    'اتصال به اصل - محمد شهیر شریفی (صفحه ۱)',
    'اتصال به اصل (صفحه ۲ - تمثیل‌های تمثیلی)',
    'اتصال به اصل (صفحه ۳ - مرگ و وصال)',
    'اتصال به اصل (صفحه ۴ - حکمت آفرینش)',
    'روشنگری چیست و روشنگر کیست؟ - احسان الله عتیق (صفحه ۱)',
    'روشنگری چیست و روشنگر کیست؟ (صفحه ۲ - مؤلفه‌ها)',
    'روشنگری چیست و روشنگر کیست؟ (صفحه ۳ - ایثار)',
    'معیت خدای متعال با انسان - زکریا رحیمی (صفحه ۱)',
    'معیت خدای متعال با انسان (صفحه ۲ - سیر تاریخی)',
    'معیت خدای متعال با انسان (صفحه ۳ - توکل و نصرت)',
    'معیت خدای متعال با انسان (صفحه ۴ - آیات و احادیث)',
    'معیت خدای متعال با انسان (صفحه ۵ - تقوی و معیت)',
    'صحنه‌های عملی - دکتور عبدالله اسعدی',
    'تفسیر آیه بسم الله - دکتر سید دستغیب صائب (صفحه ۱)',
    'تفسیر آیه بسم الله (صفحه ۲ - الرحمن الرحیم)',
    'تفسیر آیه بسم الله (صفحه ۳ - تفکر در مصنوعات)',
    'تفسیر آیه بسم الله (صفحه ۴ - ارزش ایمان)',
    'تفسیر آیه بسم الله (صفحه ۵ - صفت الرحیم)',
    'تفسیر آیه بسم الله (صفحه ۶ - نتیجه‌گیری)',
    'محیط زیست و تدابیر بهبود آن (صفحه ۱)',
    'محیط زیست و تدابیر بهبود آن (صفحه ۲ - اکولوژی)',
    'محیط زیست (صفحه ۳ - نقد بمب MOAB استکبار)',
    'محیط زیست (صفحه ۴ - راهکارهای اسلام)',
    'بخش اشعار و ادبیات مهدوی (صفحه ۱)',
    'یادداشتی در مورد انواع شعر (صفحه ۲)',
    'اشعار راه خدا و وضعیت مسلمانان (صفحه ۳)',
    'اشعار ادای تقصیر و موریانه درد (صفحه ۴)',
    'پشت جلد شماره نخست و راه‌های ارتباطی'
  ];

  const images = [
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=1000&q=80'
  ];

  return pageTitles.map((title, index) => {
    const pageNum = index + 1;
    const img = images[index % images.length];
    return {
      page_number: pageNum,
      image_url: img,
      title_fa: title,
      text_fa: `صفحه ${pageNum} از شماره نخست مجله ایدئولوژی مهدویت (تابستان ۱۴۰۴ خورشیدی). ${title}`
    };
  });
};

export const initialMagazineIssues: MagazineIssue[] = [
  {
    id: 'mag-issue-1',
    issue_number: 1,
    title_fa: 'شماره نخست: ایدئولوژی مهدویت',
    description_fa: 'نخستین شماره مجله تخصصی ایدئولوژی مهدویت شامل ۴۵ صفحه کامل با تمامی مقالات، سرمقاله، رهبریت در اسلام، اخوت اسلامی، اتصال به اصل، روشنگری چیست، و معیت خدای متعال.',
    publish_date_fa: 'تابستان ۱۴۰۴ خورشیدی',
    cover_image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
    pdf_url: '/magazines/issue-1-mahdaviyat.pdf',
    download_count: 2450,
    featured: true,
    pages: generateIssuePages()
  },
  {
    id: 'mag-issue-2',
    issue_number: 2,
    title_fa: 'شماره دوم: اخوت اسلامی و بیداری امت',
    description_fa: 'شماره دوم مجله شامل بررسی راهکارهای عملی وحدت امت اسلامی، نقد فرقه گرایی، مبانی رشد اخلاقی و تحلیل شناختی جامعه موعود.',
    publish_date_fa: 'پاییز ۱۴۰۴ خورشیدی',
    cover_image: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=800&q=80',
    pdf_url: '/magazines/issue-1-mahdaviyat.pdf',
    download_count: 1890,
    featured: false,
    pages: generateIssuePages()
  },
  {
    id: 'mag-issue-3',
    issue_number: 3,
    title_fa: 'شماره سوم: تبیین حاکمیت عادلانه',
    description_fa: 'شماره سوم مجله تمرکز بر تبیین حقوق عامه در حکومت مهدوی، نقد اومانیسم غربی و بازخوانی جایگاه انسان در هندسه آفرینش دارد.',
    publish_date_fa: 'زمستان ۱۴۰۴ خورشیدی',
    cover_image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80',
    pdf_url: '/magazines/issue-1-mahdaviyat.pdf',
    download_count: 1240,
    featured: false,
    pages: generateIssuePages()
  }
];

export const initialVideos: VideoItem[] = [
  {
    id: 'vid-yt-user-1',
    title_fa: 'نشست تصویری ویژه: ایدئولوژی مهدویت و پاسخ به پرسش‌های شناختی',
    description_fa: 'ویدیو اختصاصی منتشرشده در یوتیوب با موضوع تبیین جهان‌بینی مهدوی و نقد شبهات معاصر.',
    video_url: 'https://youtu.be/Xbc0i8B6FEs',
    thumbnail_url: 'https://img.youtube.com/vi/Xbc0i8B6FEs/hqdefault.jpg',
    duration_fa: '۱۵ دقیقه',
    category_fa: 'وبینارها',
    speaker_fa: 'میر الهام الدین سادات & هیئت تحریریه',
    published_at: 'تابستان ۱۴۰۴',
    views: 4800,
    featured: true,
    download_url: 'https://youtu.be/Xbc0i8B6FEs',
    transcript_fa: `بسم‌الله الرحمن الرحیم. در این ویدیوی یوتیوبی به تبیین محتوای شماره نخست مجله ایدئولوژی مهدویت می‌پردازیم...`,
    timestamps: [
      { time: '00:00', label_fa: 'معرفی مجله و ضرورت ایدئولوژی مهدویت' },
      { time: '05:00', label_fa: 'تحلیل مقاله رهبریت در اسلام' },
      { time: '10:00', label_fa: 'جمع‌بندی و پرسش‌های بینندگان' }
    ]
  },
  {
    id: 'vid-webinar-1',
    title_fa: 'وبینار تخصصی: تبیین ابعاد عقلانی ایدئولوژی مهدویت',
    description_fa: 'سمینار آنلاین و وبینار تخصصی با حضور استاد میر الهام الدین سادات و دکتر مدبر در خصوص تبیین ضرورت عقلانی مهدویت و پاسخ به شبهات مکاتب غرب.',
    video_url: 'https://www.w3schools.com/html/mov_bbb.mp4',
    thumbnail_url: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1200&q=80',
    duration_fa: '۴۵ دقیقه',
    category_fa: 'وبینارها',
    speaker_fa: 'میر الهام الدین سادات & عبدالظهور مدبر',
    published_at: 'تابستان ۱۴۰۴',
    views: 4100,
    featured: false,
    download_url: '#',
    transcript_fa: `بسم‌الله الرحمن الرحیم. با سلام خدمت شرکت‌کنندگان عزیز در وبینار تخصصی تبیین ایدئولوژی مهدویت...`,
    timestamps: [
      { time: '00:00', label_fa: 'افتتاحیه وبینار و تبیین مسئله' },
      { time: '10:15', label_fa: 'نقد پوزیتیویسم و اومانیسم' },
      { time: '25:30', label_fa: 'پرسش و پاسخ شرکت‌کنندگان وبینار' }
    ]
  },
  {
    id: 'vid-lecture-1',
    title_fa: 'درس‌گفتار تصویری: نقد اومانیسم و فلسفه‌های مادی',
    description_fa: 'تحلیل تصویری و درس‌گفتار استاد عبدالظهور مدبر در مورد ریشه‌های بحران انسان معاصر و راهکار مهدوی.',
    video_url: 'https://www.w3schools.com/html/mov_bbb.mp4',
    thumbnail_url: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=1200&q=80',
    duration_fa: '۳۰ دقیقه',
    category_fa: 'درس‌گفتارها',
    speaker_fa: 'استاد عبدالظهور مدبر',
    published_at: 'تابستان ۱۴۰۴',
    views: 2900,
    featured: false,
    transcript_fa: `در این درس‌گفتار به تبیین نقد تفکر اومانیسم و جایگاه توحید پرداخته می‌شود...`,
    timestamps: [
      { time: '00:00', label_fa: 'مقدمه درس‌گفتار' },
      { time: '15:00', label_fa: 'تحلیل فلسفه مادی' }
    ]
  }
];

export const initialAudios: AudioItem[] = [
  {
    id: 'aud-rahbar-salim',
    title_fa: 'پادکست شماره ۱: پادکست، رهبر سلیم',
    speaker_fa: 'دکتر حبیب الله شریفی & سردبیری',
    audio_url: '/audios/01-podcast-rahbar-salim.mp3',
    duration_fa: '۱۰ دقیقه',
    description_fa: 'قرائت صوتی و تحلیل تخصصی مقاله «داشتن رهبری سلیم پس از توحید بزرگترین نعمت خداست» برگرفته از شماره نخست مجله ایدئولوژی مهدویت.',
    published_at: 'تابستان ۱۴۰۴',
    category_fa: 'پادکست‌ها',
    cover_image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=800&q=80',
    plays: 3410
  },
  {
    id: 'aud-lecture-1',
    title_fa: 'درس‌گفتار صوتی ۱: تبیین اصول رهبریت در اسلام',
    speaker_fa: 'استاد عبدالظهور مدبر',
    audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    duration_fa: '۳۵ دقیقه',
    description_fa: 'ارائه صوتی اختصاصی درس‌گفتار مبانی رهبری اسلامی و مسئولیت‌های اجتماعی زعمای عادل.',
    published_at: 'تابستان ۱۴۰۴',
    category_fa: 'درس‌گفتارها',
    cover_image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
    plays: 2890
  },
  {
    id: 'aud-webinar-audio-1',
    title_fa: 'پادکست شماره ۲: نسخه صوتی وبینار وحدت امت و اخوت اسلامی',
    speaker_fa: 'بیژن بهزاد & نخبگان علمی',
    audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    duration_fa: '۴۰ دقیقه',
    description_fa: 'نسخه صوتی وبینار بین‌المللی تحلیل راهکارهای سه گانه وحدت امت و اخوت اسلامی.',
    published_at: 'تابستان ۱۴۰۴',
    category_fa: 'وبینارها',
    cover_image: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=800&q=80',
    plays: 2150
  }
];

export const initialInfographics: InfographicItem[] = [
  {
    id: 'info-1',
    title_fa: 'اینفوگرافیک ۱: ابعاد شناختی ایدئولوژی مهدویت در یک نگاه',
    description_fa: 'نمودار تصویری جامع تبیین‌کننده اصول، اهداف و مؤلفه‌های کلیدی ایدئولوژی مهدویت.',
    image_url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    category_fa: 'شناخت مهدویت',
    published_at: 'تابستان ۱۴۰۴'
  },
  {
    id: 'info-2',
    title_fa: 'اینفوگرافیک ۲: مؤلفه‌های ۱۲گانه روشنگری واقعی',
    description_fa: 'جمع‌بندی تصویری مقاله روشنگری چیست و روشنگر کیست به صورت داده‌نما.',
    image_url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1200&q=80',
    category_fa: 'نقد مکاتب',
    published_at: 'تابستان ۱۴۰۴'
  }
];

export const initialTeamMembers: TeamMember[] = [
  {
    id: 'team-1',
    name_fa: 'میر الهام الدین سادات',
    role_fa: 'سردبیر مجله',
    bio_fa: 'کارشناس ارشد حقوق عامه و آگاه امور اسلامی، نویسنده مقاله «چرا ایدئولوژی مهدویت؟».',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    specialization_fa: 'حقوق عامه و مهدویت‌شناسی'
  }
];

export const initialContactMessages: ContactMessage[] = [
  {
    id: 'msg-1',
    sender_name: 'احمد شهاب',
    email: 'ahmad@example.com',
    subject: 'قدردانی از انتشار شماره نخست مجله',
    message: 'با سلام، شماره نخست مجله بسیار غنی و تحلیلی بود.',
    created_at: 'تابستان ۱۴۰۴',
    status: 'new'
  }
];

export const initialCoHosts: CoHostUser[] = [
  {
    id: 'cohost-super-admin',
    name_fa: 'M. Nazir Yosuf',
    password_code: '190716',
    role_fa: 'مدیر کل و سردبیر ارشد',
    created_at: '۱۴۰۴/۰۵/۰۱',
    is_super_admin: true,
    permissions: {
      can_manage_articles: true,
      can_manage_magazines: true,
      can_manage_videos: true,
      can_manage_audios: true,
      can_manage_team: true,
      can_manage_messages: true,
      can_manage_cohosts: true,
    }
  },
  {
    id: 'cohost-articles-manager',
    name_fa: 'همکار / مدیر مقالات',
    password_code: '123456',
    role_fa: 'ویرایشگر و مسئول انتشار مقالات',
    created_at: '۱۴۰۴/۰۵/۱۰',
    is_super_admin: false,
    permissions: {
      can_manage_articles: true,
      can_manage_magazines: false,
      can_manage_videos: false,
      can_manage_audios: false,
      can_manage_team: false,
      can_manage_messages: false,
      can_manage_cohosts: false,
    }
  }
];
