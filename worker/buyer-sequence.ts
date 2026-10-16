/**
 * Letters to people who bought The Influential Spirit on Selar. The Worker learns
 * of a sale from the Kit tag Selar adds (worker/kit.ts) and sends these by cron.
 * `day` counts from the purchase. {first}, {edition}, {extras}, {group}, {christmas},
 * {site} and {unsub} are filled in per buyer.
 */

export type Edition = "reader" | "formation" | "complete" | "christmas";

export const EDITION_NAME: Record<Edition, string> = {
  reader: "the Reader Edition",
  formation: "the Formation Bundle",
  complete: "the Complete Formation Edition",
  christmas: "Unscripted Christmas",
};

/** One line per edition about the files beyond the book. */
export const EXTRAS: Record<Edition, string> = {
  reader: "Keep the Start Here guide close for the first few days; it shows a simple rhythm for each morning.",
  formation: "The audiobook is in your library too, so on the mornings you travel you can listen to the day in my voice.",
  complete: "The audiobook, the Prayers and Declarations audio and the Companion Journal are in your library too, so on the mornings you travel you can listen, and in the evening you can write.",
  christmas: "",
};

/** One line per edition about reading with others. */
export const GROUP: Record<Edition, string> = {
  reader: "The guide for using the book with your church or team, which came with your copy, shows how to do this in one short meeting a week.",
  formation: "Your Group Study Guide has six sessions ready for a small group, a staff team or a fellowship at work.",
  complete: "Your Group Study Guide has six sessions ready for a small group, a staff team or a fellowship at work.",
  christmas: "",
};

export const BUYER_SEQUENCE: { day: number; subject: string; body: string }[] = [
  {
    day: 0,
    subject: "Before your first morning",
    body: `Dear {first},

Thank you for choosing {edition} of The Influential Spirit. I prayed for the people who would read this book long before it was finished, and today that includes you.

Your files are in your Selar library. Open the email from Selar, or sign in at selar.com with the email you used to pay, and download them to your phone or computer so you can read without data.

Here is how I would begin. Choose one place and one time, and keep them for thirty mornings. Read the day, sit still for the verse for a minute, and take the Influence Challenge into your work that same day. {extras}

If a file will not open, reply to this letter and I will help you.

May the Lord meet you on your first morning.

Eryeza`,
  },
  {
    day: 4,
    subject: "Three mornings in",
    body: `Dear {first},

By now you have read the first few days. Some readers tell me the first week is the hardest, because the habit is new and the day is already full before it begins.

If you missed a morning, start again where you stopped. The book is written for people with real responsibility, and Christ is patient with us in our formation. The Holy Spirit does His work over thirty mornings, one at a time.

One small help: the Influence Challenge at the end of each day is meant for the office, the shop, the classroom or the home that same day. Write it on a card and keep it where you work.

Eryeza`,
  },
  {
    day: 10,
    subject: "Read it with someone",
    body: `Dear {first},

Influence grows best in company. Jesus formed twelve men by walking with them, and most of us grow faster when someone asks us how the week went.

Think of one person this week: a friend, your spouse, a colleague or someone in your fellowship. Ask them to read alongside you. {group}

If you lead a team or a church and would like copies for your people, reply to this letter and we will arrange it.

Eryeza`,
  },
  {
    day: 21,
    subject: "A few honest words",
    body: `Dear {first},

You are three weeks into The Influential Spirit. Would you send me a few honest words about what the book has done in you so far? Two or three sentences are enough. Reply to this letter, and tell me if I may share your words, with your first name, on the book page.

Your words help the next reader decide, and they help me write better for you.

Eryeza`,
  },
  {
    day: 31,
    subject: "After thirty mornings",
    body: `Dear {first},

If you have kept the rhythm, you have now finished thirty mornings with Christ. The book ends, and the work of the Holy Spirit in you goes on.

Here are three ways to keep going. One, listen to the Devotion in Season podcast, where we open the Scriptures together each week. Two, read the letters I send from eryezakalalu.com. Three, go back to the day that spoke to you most and read it again with someone else.

{christmas}

May the Lord establish the work He has begun in you.

Eryeza`,
  },
];
