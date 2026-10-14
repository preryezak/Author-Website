/**
 * The Day 1 follow-up letters, sent by the checkout Worker's cron (worker/checkout.ts).
 * Written in Eryeza's voice and checked against the house rules (Content_Hub/START_HERE.md).
 * `day` = days after sign-up. {first} {site} {buy} {unsub} are filled in when sent.
 * Edit the words here; the schedule follows the order and `day` values.
 */

export interface Letter { day: number; subject: string; body: string }

export const SEQUENCE: Letter[] = [
  {
    day: 0,
    subject: "Day 1: Following to Lead",
    body: `Dear {first},

Thank you for asking for Day 1 of The Influential Spirit. Here it is:

Read Day 1: {site}/influential-spirit/#day-one
Download Day 1 as a PDF: {site}/free/Day_1_Following_to_Lead.pdf

Simon and Andrew were washing their nets when Jesus stepped onto their shore. They had bills to pay and a business to keep afloat. He called them in the middle of an ordinary working day, and He still calls people there.

Here is how to use it. Read it tomorrow morning before the day begins. It takes ten to fifteen minutes. Answer the reflection question honestly, do the one practical step, then pray the prayer aloud.

Over the next two weeks I will write to you a few times about what this book is for. You can stop these letters at any time with the link below.

May the Lord meet you tomorrow morning.
Eryeza Kalalu`,
  },
  {
    day: 2,
    subject: "The smell of charcoal",
    body: `Dear {first},

When someone comes home after a full day beside a charcoal pit, nobody needs to ask where they have been. The smoke stays in their clothes and the smell stays on their skin.

That picture is in Day 1, and I keep returning to it. The disciples did not learn a set of methods first. They spent their days with Jesus, and people could tell. Acts 4 says the council "realized that they had been with Jesus."

So here is the question for this week. What do people pick up from you after an hour in your company? Your colleagues, your children, the people under you at work?

Spend ten minutes with the Lord tomorrow before you open your phone. Ask Him to form you where you are.

Eryeza`,
  },
  {
    day: 4,
    subject: "Your pulpit may be a desk",
    body: `Dear {first},

Many believers have concluded that serious spiritual formation is for pastors. The nurse on the night shift, the teacher with sixty pupils and the trader at the market think the deep things are written for someone else.

Scripture says otherwise. Joseph served in Pharaoh's house. Daniel served in the administration of Babylon. Lydia sold purple cloth. God formed each of them in the place where they worked, and He used that place.

I wrote The Influential Spirit for that believer. Your pulpit may be a desk, a ward, a classroom, a shop counter or a kitchen table. The question underneath every day of the book is the same: who are you becoming while you become visible?

If that is your question too, the full thirty days are here: {buy}

Eryeza`,
  },
  {
    day: 6,
    subject: "When you hit the wall",
    body: `Dear {first},

Marathon runners fear the wall. Around the thirty-second kilometre the body runs out of stored energy, the legs grow heavy and the mind begins to bargain. Stop. It hurts. What is the point?

Day 25 of the book is about that moment in our walk with God. While I was revising six books in one season, I hit that wall myself, and I tell that story in the chapter. You can hear me read part of it here (about 35 seconds):

{site}/audio/day-25-my-own-wall.mp3

Paul wrote, "And let us not grow weary while doing good, for in due season we shall reap if we do not lose heart." If you are tired, learn to rest, and then return to the field.

Readers of the first edition in the United Kingdom called it "simple and practical and yet very instructive and inspiring." The Formation Bundle includes the whole audiobook in my voice, so you can listen on the way to work: {buy}

Eryeza`,
  },
  {
    day: 9,
    subject: "Which edition is right for you",
    body: `Dear {first},

A few readers have asked me which edition to choose, so here is a plain answer.

The Reader Edition is the complete thirty-day devotional as a PDF and EPUB. Choose it if you mainly read.

The Formation Bundle adds the full audiobook in my voice, the six-session Group Study Guide and the 30-Day Reading Plan and Challenge. Choose it if you want to listen as well as read, or to go through the book with a small group, your spouse or a fellowship at work. This is the one I recommend for most people.

The Complete Formation Edition adds the Companion Journal, the Declarations and Prayers in audio, and the full Notion workspace. Choose it if you write as you pray and want everything.

You can pay by mobile money in most African countries, or by card from anywhere. The files open on your screen straight away and arrive by email.

See the editions: {buy}

Eryeza`,
  },
  {
    day: 14,
    subject: "Thirty mornings",
    body: `Dear {first},

This is my last letter in this short series.

Thirty mornings is long enough to stop performing and start listening. Each day is one passage of Scripture, a short teaching, an honest question, one practical step, a prayer and a declaration. It takes ten to fifteen minutes, and then you go to work with it.

If you have been waiting for the right moment, begin on the first day of next month and let the book walk with you through that month.

Get the book: {buy}

Thank you for reading these letters. May the Lord form Christ in you, by His Holy Spirit, in the place where He has planted you.

Eryeza Kalalu`,
  },
];
