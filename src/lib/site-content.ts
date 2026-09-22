/**
 * Eryeza Kalalu author site, canonical content.
 * Conversion-first. No em-dashes, no carry/weight/room/quiet, no ai-slop.
 */

export const SITE = {
  author: "Pastor Eryeza Kalalu",
  role: "Pastor · Author",
  org: "Rivers of Life Healing Centre · Kawuku, Uganda",
  eyebrow: "Kampala, Uganda · 2026",
  email: "hello@eryezakalalu.com",
  speakingEmail: "speaking@eryezakalalu.com",
  beehiivEmbed: "https://subscribe-forms.beehiiv.com/08ebdc41-e9b6-4032-8703-87c65fe51eda",
  beehiivRss: "https://rss.beehiiv.com/feeds/m7Wi8T8MXS.xml",
  podcastRss: "https://anchor.fm/s/f7311ecc/podcast/rss",
  podcastIheart: "https://www.iheart.com/podcast/269-devotion-in-season-198850928",
  excerptUrl: "https://payhip.com/b/D3nkl",
  year: "2026",
} as const;

export const NAV = [
  { label: "Home", href: "#top" },
  { label: "The Influential Spirit", href: "#influential-spirit" },
  { label: "Speaking", href: "#speaking" },
  { label: "Letter", href: "#letter" },
  { label: "Books", href: "#books" },
  { label: "About", href: "#about" },
] as const;

/** Hero */
export const HERO = {
  eyebrow: "DEPTH YOU CAN LIVE IN",
  headline: "Faith. Formation. Calling. Character. Influence.",
  body: "I'm Eryeza Kalalu, a pastor, author, and communicator writing for people who want to follow Christ faithfully and live that faith meaningfully in everyday life.",
  ctaPrimary: "Explore The Influential Spirit",
  ctaPrimaryHref: "#influential-spirit",
  ctaSecondary: "Explore My Work",
  ctaSecondaryHref: "#books",
  portraitName: "Pastor Eryeza Kalalu",
  portraitLoc: "Rivers of Life Healing Centre · Kawuku, Uganda",
} as const;

export const FLAGSHIP = {
  stampOrn: "§",
  stampMeta: "NEW BOOK · AUTUMN ’26",
  stampTitle: "The Influential Spirit",
  marginNote: "Digital delivery · 30 September 2026",
  subtitle: "Volume I of The Deep Encounter Library",
} as const;

/** === FEATURED BOOK === */
export const FEATURED_BOOK = {
  eyebrow: "CURRENTLY FEATURED",
  title: "The Influential Spirit",
  subtitle: "30 Days to a Life of Kingdom Authority, Character, and Marketplace Impact",
  headline: "Become the person behind the influence.",
  paras: [
    "Influence is more than visibility, position, or reach. It begins with the person Christ is forming.",
    "The Influential Spirit is a 30-day journey into kingdom authority, character, competence, and meaningful influence, helping believers understand how who they are becoming shapes the way they lead, work, serve, and affect the people around them.",
    "If God has given you influence, the question is not only what you will do with it. It is who you will become as you live it.",
  ],
  standout: "We are not called to whisper our faith in the corner while the world dictates the culture. When your inner life is anchored in Christ, your settled competence holds more authority than any title ever could.",
  audience: "For believers whose influence is growing in ministry, business, work, community, relationships, or everyday life.",
  ctaPrimary: "Get The Book",
  ctaPrimaryHref: "#editions",
  ctaSecondary: "Explore The Influential Spirit",
  ctaSecondaryHref: "#thirtydays",
} as const;

/** === WHY THIS BOOK === */
export const WHY_THIS_BOOK = {
  eyebrow: "Why this book",
  heading: "Influence begins before the platform.",
  cards: [
    { title: "Who you are matters.", desc: "The person Christ is forming is the person who will lead, serve, and shape others." },
    { title: "Character gives influence credibility.", desc: "Gifts open doors; character is what holds you there." },
    { title: "Authority is received, not manufactured.", desc: "Kingdom authority begins with surrender, not strategy." },
  ],
} as const;

/** Why I Wrote This Book (the pastor's letter; the photo carries the identity) */
export const AUTHOR_LETTER = {
  eyebrow: "Why I Wrote This Book",
  paras: [
    "I have sat with enough believers to recognize the ache underneath this book. Sincere God-loving people still feel they are falling behind, as if the kingdom had a leaderboard.",
    "The Influential Spirit grew out of those conversations, and out of my own experiences, when God seemed more interested in straightening me than in promoting me. Thirty days is long enough to stop performing and start listening.",
    "Walk through it honestly, and you will come out of it steadier, more rooted, in the good sense. That depth is the point.",
  ],
  pullquote: "Formation before platform. The person is being shaped for the platform, not the other way around.",
} as const;

/** === WHAT YOU WILL DISCOVER === */
export const DISCOVER = {
  eyebrow: "What you will discover",
  heading: "What the book holds.",
  items: [
    { title: "Christ forms the person.", desc: "Before influence, formation. The Spirit shapes the kind of person whose presence changes a gathering." },
    { title: "The Spirit empowers the person.", desc: "Not self-improvement. It is the very life of God at work in ordinary believers." },
    { title: "Character gives credibility.", desc: "Who you are when no one watches is who you will be when everyone does." },
    { title: "Competence gives depth.", desc: "Skill, grown humbly, makes the message usable in the real world." },
    { title: "Influence becomes stewardship.", desc: "Influence is received from God to be spent for others, not hoarded, not performed." },
  ],
} as const;

/** Library (shown on the dark "What comes next" section) */
export const LIBRARY = {
  eyebrow: "The Deep Encounter Library",
  heading: "The library.",
  books: [
    { status: "Pre-order", caption: "30 Sept 2026", title: "The Influential Spirit", role: "Volume I · The Deep Encounter Library", excerpt: "The book that anchors the library. Thirty days inside the person behind the influence.", cta: "Open the book page", href: "#influential-spirit", cover: "cover" },
    { status: "Coming next", caption: "Volume II", title: "Unedited Christmas", role: "A fresh encounter with the mystery of the incarnation", excerpt: "Advent, stripped of sentimentality.", cta: "Get notice by letter", href: "#letter", cover: "oxblood" },
    { status: "In preparation", caption: "2027", title: "Forthcoming volumes", role: "Holy Week Every Week · Prayer Craft · Discerning God’s Whisper · Spiritual Health Solution", excerpt: "Ongoing volumes on prayer, spiritual health, and hearing God.", cta: "Get notice by letter", href: "#letter", cover: "forest" },
  ],
} as const;

/** Podcast */
export const PODCAST = {
  eyebrow: "The Podcast",
  title: "Devotion In Season",
  lede: "Short episodes on faith, formation, and the practical realities of walking with God. Scripture read plainly, a little reflection, prayer where prayer belongs.",
  platformsLabel: "Listen everywhere",
  platformsHeading: "Follow the show on your player of choice.",
  platforms: [
    { name: "Spotify", url: "https://open.spotify.com/show/7xWARwXWq7Zm3qHuyOvfrH" },
    { name: "Apple Podcasts", url: "https://podcasts.apple.com/nl/podcast/devotional-podcast/id1759589414" },
    { name: "iHeart", url: "https://www.iheart.com/podcast/269-devotion-in-season-198850928" },
    { name: "Castbox", url: "https://castbox.fm/channel/id6232002" },
    { name: "Amazon Music", url: "https://music.amazon.co.uk/podcasts/389aee71-9690-41b3-ae1e-e3b3912dcbbd/devotion-in-season" },
    { name: "Audible", url: "https://a.co/d/dpTPj2Z" },
  ],
} as const;

/** Newsletter (the Beehiiv box carries its own description) */
export const NEWSLETTER = {
  eyebrow: "Eryeza Writes",
  heading: "Read personal updates from Pastor Eryeza.",
} as const;

/** Day 1 summary */
export const THIRTY_DAYS = {
  eyebrow: "Sit with Day 1.",
  heading: "Following to Lead",
  intro: "Day 1 turns around three movements. Read the summary, then open the full day below.",
  chapters: [
    { title: "The Rabbi’s Choice", desc: "Before you lead anyone, you choose the rabbi you will follow. ‘Follow Me’ was a rabbi’s call to a student. Jesus initiated it, to ordinary, tired people." },
    { title: "The Rabbi’s Scent", desc: "Virtues are not just taught; they are caught. Whoever you walk closest to, you begin to resemble. The Spirit forms a person whose presence is felt before they speak." },
    { title: "Walking It Out", desc: "Faith that shrinks on Monday was only ever mood. Day 1 hands you a practice you can bring into the kitchen, the classroom, the boardroom." },
  ],
} as const;

/** Full Day 1 devotional (verbatim from the manuscript) */
export const DAY1_FULL = {
  library: "The Deep Encounter Library · Vol. I",
  day: "Day 1",
  title: "Following to Lead",
  scripture: "Then Jesus said to them, ‘Follow Me, and I will make you become fishers of men.’",
  scriptureRef: "Mark 1:17",
  reading: [
    "Far from polished pews and familiar temple hymnbooks, the lakeshore presented a raw, unfiltered scene. The sun beat down on drying fish, filling the air with the pungent aroma of wet rope, human sweat, and the salty mist of the Sea of Galilee. This was Simon’s and Andrew’s everyday labor, unadorned and demanding.",
    "They were busy, tired, and dealing with the same ordinary pressures you know. These fishermen had bills to pay, families to feed, and a business to keep afloat. Their worries were as real as yours.",
    "Then, right in the middle of their ordinary day, Jesus stepped onto their dock and disrupted their setup.",
    "To understand why Simon and Andrew dropped their nets without hesitation, we have to look at what had already taken place between them and the Master.",
    "During their first meeting, Jesus gave Simon a new prophetic name, Cephas, meaning ‘rock’ or ‘stone.’ So, He called men who already knew His voice. Because they had met Him before. The Lord then invited them to take that relationship to a committed, no-return level.",
    "The choice they faced stares at you and me today. Were they to cling to their safety nets, or risk everything to follow Jesus? That single decision echoed through history and set a pattern for every generation of believers.",
    "Their first encounter with Jesus laid a foundation of trust. But from that point, He called them to step up, to grow, and to commit themselves. For three years, Jesus invested in them as if the entire mission on earth depended on them, and to a great extent, it did. He taught, corrected, and shaped them into the leaders God intended them to become.",
  ],
  movements: [
    { title: "The Rabbi’s Choice", paras: [
      "In declaring, ‘I will make you fishers of men,’ Jesus invited His disciples into a daily journey of conversion rather than a sudden title.",
      "Jesus handed them a new dream, bigger than anything they had ever imagined. The mission was bold. He invited these common fishermen to join Him, not only for their benefit, but to fulfill a purpose only He could help them achieve, with their permission, of course. They did not know where the journey led, yet He showed them who they were to become if they dared to trust Him.",
      "During that period, ‘Follow Me’ was a rabbi’s call to a student. Jesus reversed the usual dynamic in which students pursued esteemed teachers. He initiated the call to these ordinary people who were tired and worn from their work.",
      "To transition from fishing to evangelizing, they needed to remain with the Teacher. Nothing about this arrangement was casual, so they couldn’t take anything for granted. Their influence wasn’t the result of their own efforts alone. Following Christ gave their effective leadership a solid foundation.",
    ]},
    { title: "The Rabbi’s Scent", paras: [
      "Virtues are not just taught; they are caught. People learn by observing, not merely by listening. The disciples discovered that their ability to bring others to Christ came from knowing Christ at close range. They did not center the season on memorizing a set of methods. It focused more on capturing the heart of the Master and learning in a way that changes the learner, whereby the change is the proof of learning.",
      "Returning home after a full day in a charcoal pit requires no explanation for your whereabouts. The smoke clings to your clothes. The smell lingers on your skin. You bring the scent of charcoal home with you.",
      "This also applies to spiritual authority. And in the next chapter, we’ll find Peter and John, lacking formal education, astounding the council.",
      "How often do we crave Jesus’ power yet neglect to sit at His feet and learn from Him? We hope our words will change lives, but we have not let Him change us first. Jesus is saying, stop striving for influence in your own strength. Walk with Me first, and true impact will result.",
      "Jesus asked His first disciples to spend their days in His company. He asks the same of you.",
    ]},
    { title: "Walking It Out", paras: [] },
  ],
  reflectionLabel: "Daily Reflection",
  reflectionQuestion: "What keeps you from following Jesus? Is it fear, career ambition, or a craving for control?",
  challengeLabel: "The Influence Challenge",
  challengeBody: "Set aside ten minutes today. Turn off your phone and silence mental distractions. In stillness, pray: ‘Heavenly Father, I give You my agenda. Position me where You desire.’ Discipleship is not about checking a religious box. It means finding calm in His presence and following the Spirit’s guidance. It is wanting to become the person He wants you to be.",
  prayerLabel: "Prayer",
  prayerBody: "Loving Father, shape me, mold me, and use me as a vessel for Your glory. In the matchless name of Jesus, Amen.",
  declarationLabel: "Daily Declaration · Following the Shepherd",
  declarationBody: "Before anything else, I am a follower of Christ. His power flows through my life as I submit to His authority. God is shaping me into a fisher of souls and a life-changer.",
  furtherReadingLabel: "Further Reading",
  furtherReading: "Mark 3:13–15 · John 12:26 · Matthew 4:18–22",
  closer: "The end of Day 1. Twenty-nine more days follow this same rhythm. A scripture, an honest reading, and a question that walks with you.",
} as const;

/** Christ Forms the Person (parchment) */
export const PILLARS = {
  eyebrow: "Three pillars of kingdom influence",
  heading: "Christ forms the person.",
  items: [
    { roman: "I", title: "Kingdom Authority", desc: "Influence that begins with surrender. The authority of the cross, laid down, is the only authority that endures." },
    { roman: "II", title: "Formed Character", desc: "Who you are when no one is watching is who you will be when everyone is. Formation is slow, unglamorous, and the only foundation that doesn’t crack under visibility." },
    { roman: "III", title: "Marketplace Impact", desc: "Your desk, your clinic, your classroom, your kitchen table. These are pulpits. Most of the book is written to the person whose pulpit is ordinary work." },
  ],
} as const;

/** The 30 days */
export const THE_DAYS = {
  eyebrow: "The 30 days.",
  heading: "What the days practice.",
  items: [
    { title: "The ground.", desc: "Day 1–10, who you are before God. Surrender, identity, the rabbi you follow, the Spirit’s forming work that no platform can substitute for." },
    { title: "The forming.", desc: "Day 11–20, who you are becoming. Character under pressure, the prayers that hold when visibility rises, the slow work of being shaped rather than promoted." },
    { title: "The hand-off.", desc: "Day 21–30, who you are sent to. Influence as sending, not self-promotion. The whole book turns toward the Monday you walk back into." },
  ],
} as const;

/** Editions */
export const EDITIONS = {
  eyebrow: "Choose how you want to buy.",
  regionUSD: "Rest of the world",
  regionUSDSub: "Payhip, card & PayPal",
  regionUGX: "Africa",
  regionUGXSub: "Selar, mobile money & card",
  note: "Pre-order, early-bird pricing built in. No coupon needed. Digital delivery 30 September 2026.",
  tiers: [
    { region: "usd", name: "Digital Pre-order Edition", price: "$12", was: "$15", desc: "The complete 30-day devotional. PDF and EPUB delivered 30 September.", href: "https://payhip.com/b/CidbX", popular: false },
    { region: "usd", name: "Formation Bundle", price: "$23", was: "$29", desc: "Digital edition, author-narrated audiobook, six-session Group Study Guide, and the 30-Day Reading Plan and Challenge.", href: "https://payhip.com/b/CidbX", popular: true },
    { region: "usd", name: "Complete Formation Edition", price: "$39", was: "$49", desc: "Everything in the Formation Bundle, plus the Companion Journal, bonus audio declarations and prayers, and the digital resource library.", href: "https://payhip.com/b/CidbX", popular: false },
    { region: "ugx", name: "Digital Pre-order Edition", price: "UGX 36,000", was: "45,000", desc: "The complete 30-day devotional. PDF and EPUB delivered 30 September.", href: "https://selar.com/8818840887", popular: false },
    { region: "ugx", name: "Formation Bundle", price: "UGX 72,000", was: "90,000", desc: "Digital edition, author-narrated audiobook, six-session Group Study Guide, and the 30-Day Reading Plan and Challenge.", href: "https://selar.com/8818840887", popular: true },
    { region: "ugx", name: "Complete Formation Edition", price: "UGX 120,000", was: "150,000", desc: "Everything in the Formation Bundle, plus the Companion Journal, bonus audio declarations and prayers, and the digital resource library.", href: "https://selar.com/8818840887", popular: false },
  ],
} as const;

/** Reviews */
export const REVIEWS = {
  eyebrow: "Perspectives on the author’s work",
  heading: "Words from readers & friends.",
  subhead: "What readers said about the first edition.",
  items: [
    { quote: "The principles Pastor Eryeza writes daily can influence a chef on the kitchen table to the judge on the verdict table.", name: "Martin Nangoli", role: "Specialty Coffee Producer" },
    { quote: "Pastor Eryeza is one of those God has set apart to shine a light on His people in these dark, turbulent times. He exudes a lot of charisma, with excellent oratory and writing skills.", name: "Babirye Agatha", role: "Reader · Uganda" },
    { quote: "Each devotional in this book is thoughtful and has a conclusion and a short prayer which is meaningful. I felt that the message of this book was encouraging and timely for our day and age.", name: "The Rebecca Review", role: "United States · Amazon Verified" },
    { quote: "This book is simple and practical and yet very instructive and inspiring.", name: "Jeff Mutenga", role: "United Kingdom · Amazon Verified" },
    { quote: "Practical and full of wisdom gained from experience. This is not a dry theological treatise but is a clear explanation of the steps needed to follow Christ and be a good influence in this world.", name: "Chris Gould", role: "United Kingdom · Amazon Verified" },
    { quote: "This book is well written and biblically sound. If you follow the principles of this book, it will put you on the right path.", name: "SP80", role: "United Kingdom · Amazon Verified" },
  ],
} as const;

/** FAQ */
export const FAQ = {
  eyebrow: "Questions readers are already asking.",
  items: [
    { q: "Do I need to be a leader to read it?", a: "No. Influence here has nothing to do with a title. It’s about ordinary responsibility, character, and the people who are already watching your life." },
    { q: "Is this a leadership book?", a: "It’s more than that. The Influential Spirit is a devotional about spiritual formation. Leadership, work, and influence are where that formation gets tested." },
    { q: "Is the book against platforms?", a: "No. Ambition, visibility, leadership. None of that is the target here. The question underneath the whole book is simpler and harder: who are you becoming while you become visible?" },
    { q: "Is there a journal?", a: "Yes, in the Complete Formation Edition." },
    { q: "Can I use it with a group?", a: "Yes. The Formation Bundle and Complete Formation Edition both include the six-session Group Study Guide." },
    { q: "Is the audiobook included?", a: "Yes. The Formation Bundle includes the author-narrated audiobook." },
    { q: "Will this work if I’m not in ministry?", a: "Yes, especially. Most of the book is written to the person whose “pulpit” is a desk, a classroom, a clinic, a business, a boardroom, a kitchen table. Ministry is one field. This book is for every field where a Christian is asked to represent Christ well." },
    { q: "How long is each day?", a: "Short enough for a morning. A scripture, an honest reading of it, a reflection question, a practice for the day, a prayer, and a declaration. Most readers finish a day in ten to fifteen minutes, then take the question into whatever their Monday holds." },
    { q: "How is this different from your first book, Becoming an Influence?", a: "Becoming an Influence focused on God’s call for us to lead. This edition, renamed The Influential Spirit, answers a different question: what manner of person must we become to represent Christ in modern society? Formation first, then the platform. The Spirit’s work in you is what propels the work through you. It is an expanded response for a moment when we are all mistaking visibility for spiritual maturity." },
  ],
} as const;

/** Two ways forward + what comes next */
export const WHATS_NEXT = {
  twoWaysEyebrow: "Two ways to begin.",
  twoWaysHeading: "Begin, or take with you the excerpt and preview assets.",
  twoWays: [
    { title: "Get the book", desc: "Three editions, from $12 · UGX 36,000. Digital delivery 30 September 2026.", cta: "Choose your edition", href: "#editions", variant: "primary" },
    { title: "Read Day 1 free", desc: "The full opening day is on this page: scripture, reading, reflection, prayer, and declaration. Or get the full excerpt and all the preview materials sent to your inbox, free.", cta: "Open Day 1", href: "#day-one", variant: "ghost" },
  ],
  nextEyebrow: "What comes next.",
  nextHeading: "The library is just beginning.",
} as const;

/** === ABOUT (the expanded author bio, finer print) === */
export const ABOUT = {
  eyebrow: "About",
  heading: "Eryeza Kalalu",
  lead: "Eryeza Kalalu is a pastor, author, speaker, and communicator who writes about the formation of people who can faithfully live, lead, work, and influence in the world God has placed them in.",
  paras: [
    "His work sits at the intersection of **faith, character, purpose, influence, and everyday life**. Through his writing, preaching, and teaching, Eryeza helps Christians move beyond merely knowing what they believe toward becoming the kind of people whose lives make their faith visible.",
    "He is the author of *The Influential Spirit*, a book about the person behind the influence. Drawing from Scripture and the realities of modern life, Eryeza explores how Christ forms the believer, how the Holy Spirit empowers them, and how character, competence, relationships, responsibility, and spiritual authority shape the influence entrusted to them. His wider writing explores subjects such as spiritual formation, prayer, purpose, discernment, passion, and the practical life of faith.",
    "Eryeza is also the founder of **THE CCN DAILY**, a devotional and discipleship platform that began in 2017 with simple text devotionals sent to friends and church members. It has grown into a wider expression of his conviction that a timely word, grounded in Scripture, can help a person see God, themselves, and their present season differently.",
    "As a pastor, Eryeza is particularly interested in the connection between **what happens in the presence of God and what happens in ordinary life**. He writes and teaches for people navigating work, leadership, family, calling, relationships, responsibility, and the pressures that come with being visible in the world. His approach is biblical and practical, with a strong emphasis on the work of the Holy Spirit in forming believers for faithful living.",
    "He is a pastor of **Rivers of Life Healing Centre** in Kawuku, Entebbe, Uganda, and continues to serve in local church ministry while developing resources for a much wider audience.",
    "Through **Eryeza Writes**, his author and publishing work, he is building a growing body of books and resources designed to help people encounter God, understand His Word, and live with greater clarity and spiritual maturity. His speaking ministry, **Eryeza Speaks**, extends these themes into churches, leadership spaces, conferences, and other settings where faith and everyday life meet.",
    "Eryeza lives and writes from Uganda. He is married to Geraldine, and together they are raising their 3 sons.",
  ],
  closer: "Explore the books, listen to the teaching, and join Eryeza on the journey of becoming the person God has called you to be.",
  photo: "/images/author-640.webp",
  logo: "/brand/logo-monogram-gold.svg",
} as const;

/** === SPEAKING (invite + form) === */
export const SPEAKING = {
  eyebrow: "Speaking",
  heroEyebrow: "Eryeza Speaks",
  heroHeading: "Bringing Scripture into the places where faith is lived.",
  heroLede: "Eryeza speaks to churches, leadership gatherings, conferences, retreats, universities, and the spaces where faith and everyday life meet. His teaching is biblical, practical, and Christ-centred, aimed at the formation of people who can faithfully live, lead, work, and influence in the world God has placed them in.",
  whereHeading: "Where Eryeza Can Serve",
  whereItems: [
    "Church services and congregations",
    "Conferences and conventions",
    "Leadership and ministry gatherings",
    "Retreats and formation weekends",
    "University and academic gatherings",
    "Corporate and professional settings",
    "Community gatherings",
    "Podcast and media conversations",
  ],
  themesHeading: "Themes I Explore",
  themesLede: "These are some of the territories I explore through Scripture, teaching, conversation, and lived experience. Each engagement is shaped around the gathering, the audience, and the questions they are facing.",
  themes: [
    { title: "Spiritual Formation", desc: "The formation of the inner life, maturity, identity, discipleship, character, and becoming who Christ is forming us to be." },
    { title: "Influence, Character & Leadership", desc: "Leadership, credibility, authority, responsibility, character, competence, and the kind of person behind the influence." },
    { title: "Faith at Work", desc: "Following Christ in ordinary work, professional life, business, vocation, relationships, and public life." },
    { title: "Hearing God & Discernment", desc: "Recognising God's voice, spiritual discernment, wisdom, obedience, and navigating life's decisions with God." },
    { title: "Prayer & Encounter", desc: "Prayer, intimacy with God, spiritual hunger, the presence of God, and developing a life of communion with Him." },
    { title: "Faithfulness, Pressure & Legacy", desc: "Walking with God through pressure, seasons of waiting, responsibility, perseverance, finishing well, and the life we leave behind." },
  ],
  howHeading: "How I Teach",
  howParas: [
    "My approach is biblical and practical. I work from Scripture outward into the real rooms people walk into on Monday, the desk, the clinic, the classroom, the kitchen table, the verdict, the lesson plan.",
    "I teach for formation, not noise. The aim is not to impress a gathering but to help people become the kind of person Christ is forming, whose life then speaks.",
    "I hold the pulpit and the marketplace together. Most of what I preach and teach is written for the believer whose influence is already larger than they feel comfortable with, and who wants to carry it faithfully.",
  ],
  engagementsHeading: "Selected Engagements",
  engagementsLede: "A selection of gatherings Eryeza has served. A fuller list is available on request.",
  engagements: [
    { event: "Rivers of Life Healing Centre", note: "Pastoral and teaching ministry, Kawuku, Uganda" },
    { event: "THE CCN DAILY", note: "Devotional and discipleship platform, since 2017" },
    { event: "Devotion In Season", note: "Podcast, on iHeart, Spotify, Apple Podcasts" },
  ],
  ctaHeading: "Invite Eryeza to Speak",
  ctaLede: "Have a gathering, conversation, conference, retreat, or community where you would like Eryeza to contribute? Tell us about it.",
  cta: "Invite Eryeza to Speak",
  emails: [
    { label: "Speaking", address: "speaking@eryezakalalu.com" },
    { label: "General", address: "hello@eryezakalalu.com" },
  ],
  /** The exhaustive 8-section multi-step invitation form */
  invite: {
    eyebrow: "SPEAKING INVITATION",
    heading: "Invite Eryeza to Speak",
    intro: "Tell us about your gathering, your audience, and what you are hoping Eryeza can contribute. The more context you provide, the better we can understand the invitation before getting back to you.",
    submitCta: "Send Speaking Invitation",
    preSubmit: "Please submit this invitation with as much relevant detail as possible. Your submission does not confirm Eryeza's availability or acceptance of the invitation. The details will be reviewed before next steps are discussed.",
    success: "Thank you. Your speaking invitation has been received. We will review the details and respond regarding next steps.",
    sections: [
      { id: "details", title: "Your Details", fields: [
        { key: "name", label: "Full name", type: "text", placeholder: "Your name", required: true },
        { key: "email", label: "Email address", type: "email", placeholder: "you@company.com", required: true },
        { key: "phone", label: "Phone / WhatsApp", type: "tel", placeholder: "Phone or WhatsApp number", required: true },
        { key: "organisation", label: "Organisation / Church / Institution", type: "text", placeholder: "Name of your church, organisation, company, institution, or group", required: true },
        { key: "role", label: "Your role", type: "text", placeholder: "Your role or position within the organisation", required: true },
        { key: "country", label: "Country", type: "country", required: true },
        { key: "city", label: "City / Location", type: "text", placeholder: "City", required: true },
      ]},
      { id: "gathering", title: "Your Gathering", fields: [
        { key: "eventName", label: "Event / gathering name", type: "text", placeholder: "What is the name of the event or gathering?", required: true },
        { key: "gatheringType", label: "Type of gathering", type: "select", required: true, options: ["Church service", "Conference", "Leadership gathering", "Pastors / ministry leaders gathering", "Retreat", "Workshop", "Seminar", "Training", "University / academic gathering", "Corporate / professional gathering", "Community gathering", "Podcast / media conversation", "Other"] },
        { key: "eventDate", label: "Event date", type: "date", required: true },
        { key: "altDate", label: "Alternative date", type: "date", required: false, help: "Useful when the preferred date is not possible." },
        { key: "location", label: "Location", type: "text", placeholder: "Where will the gathering take place?", required: true },
        { key: "format", label: "Event format", type: "radio", required: true, options: ["In person", "Online", "Hybrid"] },
        { key: "attendance", label: "Expected attendance", type: "text", placeholder: "Approximately how many people do you expect?", required: true },
        { key: "sessions", label: "Number of speaking sessions", type: "text", placeholder: "e.g. 1, 2, 3", required: true },
        { key: "duration", label: "Approximate duration", type: "select", required: true, options: ["Up to 20 minutes", "20 to 40 minutes", "40 to 60 minutes", "60 to 90 minutes", "Half day", "Full day", "Other"] },
      ]},
      { id: "reason", title: "Reason for Invitation", intro: "This is one of the most important parts of the form.", fields: [
        { key: "speakAbout", label: "What would you like Eryeza to speak about?", type: "textarea", placeholder: "Tell us about the topic, theme, Scripture, or subject you have in mind.", required: true },
        { key: "contribute", label: "What are you hoping Eryeza will contribute?", type: "textarea", placeholder: "What would you particularly like him to bring to the gathering?", required: true },
        { key: "audience", label: "Who is the audience?", type: "textarea", placeholder: "Tell us about the people who will be attending. Who are they, and what is the context they are coming from?", required: true },
        { key: "leaveWith", label: "What would you like participants to leave with?", type: "textarea", required: false, placeholder: "What would you like people to understand, experience, or be equipped to do as a result of the session?" },
        { key: "themeOutcome", label: "Is there a particular theme, Scripture, message, or outcome you would like addressed?", type: "textarea", required: false },
      ]},
      { id: "practical", title: "Practical Arrangements", intro: "This lets us establish feasibility before a long exchange begins.", fields: [
        { key: "honorarium", label: "Is there a speaking honorarium / budget for this invitation?", type: "select", required: true, options: ["Yes", "No", "To be discussed", "Please provide details"] },
        { key: "budget", label: "Available honorarium / budget", type: "text", placeholder: "Indicate the available budget and currency.", required: false, showIf: { field: "honorarium", anyOf: ["Yes", "Please provide details"] } },
        { key: "travel", label: "Travel arrangements", type: "select", required: false, options: ["Travel will be arranged by the host", "Travel reimbursement will be provided", "Travel arrangements to be discussed", "Not applicable, online event"] },
        { key: "accommodation", label: "Accommodation", type: "select", required: false, options: ["Accommodation will be provided", "Accommodation reimbursement will be provided", "Accommodation to be discussed", "Not required", "Not applicable"] },
        { key: "logistics", label: "Additional logistical information", type: "textarea", required: false, placeholder: "Anything relevant about travel, accommodation, schedule, security, venue arrangements, or other practical considerations." },
      ]},
      { id: "media", title: "Recording & Media", fields: [
        { key: "recorded", label: "Will the session be recorded?", type: "radio", required: true, options: ["Yes", "No", "Not yet decided"] },
        { key: "photosVideo", label: "Will photographs or video be taken during the event?", type: "radio", required: true, options: ["Yes", "No", "Not yet decided"] },
        { key: "contentUse", label: "How will recorded content be used?", type: "textarea", required: false, placeholder: "Any intended use of recordings, livestreams, podcasts, YouTube, social media, internal training, or other distribution." },
      ]},
      { id: "books", title: "Books & Resources", fields: [
        { key: "booksInterest", label: "Would you be interested in making Eryeza's books or resources available to participants?", type: "radio", required: false, options: ["Yes", "No", "Perhaps", "Not applicable"] },
        { key: "booksInfo", label: "Additional information about books / resources", type: "textarea", required: false, placeholder: "Any book table, bulk orders, resource distribution, signing, or related opportunity." },
      ]},
      { id: "else", title: "Anything Else", fields: [
        { key: "anythingElse", label: "Is there anything else you would like Eryeza to know about the invitation?", type: "textarea", required: false, placeholder: "Share anything else that would help us understand the gathering, your vision, or the invitation." },
      ]},
      { id: "found", title: "How You Found Eryeza", fields: [
        { key: "howFound", label: "How did you hear about Eryeza?", type: "select", required: false, options: ["Referred by someone", "Website", "Book", "THE CCN DAILY", "Devotion in Season", "YouTube", "Social media", "Speaking engagement", "Search engine", "Other"] },
        { key: "referrer", label: "If referred, who referred you?", type: "text", required: false },
      ]},
    ],
  },
} as const;

export const PRIVACY = {
  eyebrow: "Privacy",
  heading: "How your information is handled",
  updated: "Last updated: September 2026",
  paras: [
    "This page explains what information eryezakalalu.com collects and how it is used. It applies to visitors, subscribers, readers, and anyone who submits a speaking invitation or message.",
    "**Information you provide directly.** When you subscribe to Eryeza Writes, you share your email address. When you submit a speaking invitation, you share the details you choose to provide on that form, which may include your name, email, phone, organisation, role, location, and the particulars of your gathering. This information is used to respond to your request and to consider the invitation.",
    "**Information collected automatically.** Like most websites, this site may collect basic technical data (browser type, pages visited, referring page) through the hosting platform and any analytics in use. No personal data is sold.",
    "**How your information is used.** Information you submit is used to respond to you, to consider invitations, and to send the updates you have asked for. Your email is never added to a list you did not request.",
    "**Third-party services.** This site uses third-party services to deliver its work: a newsletter provider for Eryeza Writes, a payment provider for book orders, and an email service that forwards speaking invitations to the team. Each operates under its own privacy terms. This site does not control and is not responsible for their separate practices.",
    "**Email and storage.** Speaking invitations are stored in this site's database and, when email delivery is configured, forwarded to speaking@eryezakalalu.com. Submissions are retained until no longer needed and then removed.",
    "**Your choices.** You may unsubscribe from Eryeza Writes at any time using the link in any letter. You may request access to, correction of, or deletion of information you have submitted by writing to hello@eryezakalalu.com.",
    "**Cookies.** This site uses only essential cookies and those required by the third-party services above, such as the newsletter embed and the podcast players. No advertising cookies are used. You may decline non-essential cookies using the banner below and change your preference at any time.",
  ],
  contactLine: "Questions about privacy can be sent to hello@eryezakalalu.com.",
} as const;
