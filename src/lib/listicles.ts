/**
 * Ad landing pages (listicle format). One page per ad angle; the ad's headline
 * is the page's first line. Copy written in Eryeza's voice and checked against
 * the house rules (Meta ads/COPY_DRAFT_listicles_and_ads.md).
 */

export interface Reason { title: string; body: string; audio?: string; quote?: { text: string; who: string } }
export interface Listicle {
  slug: string; metaTitle: string; metaDescription: string;
  kicker: string; headline: string; subhead: string;
  reasons: Reason[]; ctaAfter: number[]; closing: string; faq: { q: string; a: string }[];
}

const FAQ_COMMON = [
  { q: "How do I receive the book?", a: "Straight after payment your books open on the next page, and the same links arrive by email. You can download them again at any time." },
  { q: "Can I pay by mobile money?", a: "Yes. You can pay by mobile money in most African countries, by bank transfer or USSD in Nigeria, and by card from anywhere in the world." },
];

export const LISTICLES: Record<string, Listicle> = {
  desk: {
    slug: "desk",
    metaTitle: "Your pulpit may be a desk · The Influential Spirit",
    metaDescription: "A 30-day devotional by Pastor Eryeza Kalalu for Christians who serve God where they work.",
    kicker: "Your pulpit may be a desk.",
    headline: "7 reasons The Influential Spirit was written for the believer who goes to work every morning",
    subhead: "A 30-day devotional by a Ugandan pastor for Christians whose field is a clinic, a classroom, a shop, an office or a kitchen table. Ten to fifteen minutes a day. Read it, or hear it in the author's voice.",
    reasons: [
      { title: "Your work is a place of calling.", body: "Scripture never treated the workplace as second class. Joseph served Pharaoh's household, Daniel served in Babylon's administration, and Lydia sold purple cloth. The Influential Spirit starts from that ground and speaks to the nurse on the night shift and the teacher with sixty pupils as people God has positioned." },
      { title: "Each day takes ten to fifteen minutes.", body: "You read one passage, one short teaching, one honest question, one practical step, a prayer and a declaration. That is a morning you can keep before the taxi, the school run or the first meeting. A devotional you can finish is a devotional that can form you." },
      { title: "You can hear it in the author's voice.", body: "The Formation Bundle includes the full audiobook, narrated by Pastor Eryeza himself. You can listen on the way to work and read again in the evening.", audio: "/audio/day-25-my-own-wall.mp3" },
      { title: "It deals with the person behind the work.", body: "Your skill opened the door. Your character is what will keep you in the room. Thirty days walk through humility, integrity, how you speak, how you handle money and how you treat the people under you, with the Holy Spirit as the One who forms you." },
      { title: "It is honest about pressure.", body: "Day after day the book names real situations: the colleague who takes the credit, the promotion that tempts you to cut corners, the season when nobody notices your faithfulness. It brings each one to the cross and to the word of God." },
      { title: "You can read it with others.", body: "The Formation Bundle includes a six-session Group Study Guide and a 30-day reading plan. It is built for fellowships at work, small groups and couples who want to read together." },
      { title: "Readers of the first edition said so.", body: "The Influential Spirit is the expanded second edition of Becoming an Influence.", quote: { text: "Practical and full of wisdom gained from experience.", who: "Chris Gould, United Kingdom, Amazon verified review of the first edition" } },
    ],
    ctaAfter: [3, 7],
    closing: "Begin tomorrow morning with ten to fifteen minutes, one passage and one honest question, and let Christ meet you at your desk.",
    faq: [
      { q: "I am not a pastor or a leader. Is this for me?", a: "Yes. The book treats influence as the responsibility God has already given you at work, at home and in your community." },
      ...FAQ_COMMON,
    ],
  },
  signs: {
    slug: "signs",
    metaTitle: "6 signs your influence is growing faster than your character",
    metaDescription: "Read the six signs, then Day 1 of The Influential Spirit free.",
    kicker: "Who are you becoming while you become visible?",
    headline: "6 signs your influence is growing faster than your character",
    subhead: "Most leaders recognise two or three of these. Read them honestly, then decide what the next thirty mornings will hold.",
    reasons: [
      { title: "Your prayer time has become preparation time.", body: "You still pray, and most of it is for the sermon, the meeting or the post. The Lord Jesus rose long before daylight to pray, and He went out to a solitary place. Prayer was where He received before He gave." },
      { title: "You disciple people and nobody disciples you.", body: "You are the one everyone calls. When did someone last ask about your soul? Paul had Barnabas, and Timothy had Paul. Leaders who stand for long seasons stay under someone's eye." },
      { title: "People know your gift better than they know you.", body: "Crowds celebrate what you do in public. Character is formed in the hours nobody sees. God formed David with the sheep long before Israel saw him with Goliath." },
      { title: "You start devotionals and stop on Day 4.", body: "This is common, and it is fixable. A short daily rhythm with a clear end point is a plan you can keep." },
      { title: "You are tired in a way sleep does not fix.", body: "Elijah slept under the broom tree and still needed the Lord to meet him on the mountain. Rest restores the body, and the presence of God restores the person.", audio: "/audio/day-25-my-own-wall.mp3" },
      { title: "Your capability has become the reason nobody checks on you.", body: "Competent people are often the least cared for in the church. The Influential Spirit gives you thirty days in which you are the one being served by the word of God." },
    ],
    ctaAfter: [3, 6],
    closing: "For thirty days you will read one passage, one teaching, one honest question, one step and a prayer. Pastor Eryeza Kalalu wrote this book for leaders because he needed it himself.",
    faq: [
      { q: "Is this only for pastors?", a: "No. It is for anyone whose life others are watching: managers, teachers, parents, worship leaders, business owners and pastors." },
      { q: "Can my leadership team use it together?", a: "Yes. The Formation Bundle includes a six-session Group Study Guide for a team or small group." },
      ...FAQ_COMMON,
    ],
  },
};
