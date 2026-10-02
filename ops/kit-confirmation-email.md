# Kit confirmation email: study guides

Where it goes: Kit → Grow → Landing Pages & Forms → **Influential Spirit Study Guide** (form 9991957) →
Settings → **Incentive** (Confirmation email) → **Edit Email Contents**. Paste the parts below, then **Save** and **Publish**.

**Sender (From):** `resources@eryezakalalu.com`. Cloudflare Email Routing forwards it to eryezawrites@gmail.com
(added 2 Oct; the Gmail address had to be verified in Cloudflare first). Add it in Kit as a sender address and
click Kit's verification email, which arrives in eryezawrites@gmail.com through the forward.
Fallback: `hello@eryezakalalu.com` (forwards to pastor.eryeza@gmail.com).

**Button:** keep Kit's own confirmation button and its link `{{ confirm_url }}`; change only its label.
`{{ confirm_url }}` is each reader's personal confirm link. Clicking it confirms them, and Kit then sends them
to the "After confirming, redirect to" address below.

Check in the same place that **"After confirming, redirect to"** is set to a URL:
`https://eryezakalalu.com/resources/library/`

---

**Subject**
Confirm your email for the Devotion in Season study guides

**Preview text**
One tap and the study guides are yours.

**Body**

Hi {{ subscriber.first_name | default: "friend" }},

Thank you for asking for the Devotion in Season study guides. Please tap the button below to confirm your email address. It opens the Study Library, where the guides are kept.

**Button label:** Confirm and open the guides *(link stays `{{ confirm_url }}`)*

Each guide goes with a Sunday episode of the podcast. It gives you the passages, five questions for personal or group study, one practice for the week, and a prayer. On your own it takes about twenty minutes. With a small group or a team at work, allow about forty-five.

A new guide opens every Sunday at 8 PM East Africa Time, when its episode airs. The first one, "Integrity at Work", opens on Sunday 4 October. *(Delete this sentence after 4 October.)*

Save this link so you can return to the library at any time: eryezakalalu.com/resources/library

My prayer is that the Holy Spirit will use these studies to make Christ visible in the way you work.

Grace and peace,
Eryeza

P.S. If you did not ask for these guides, you can ignore this email and you will not hear from us again.

---

Audit: no banned words, no em-dashes, no binary contrasts, no weekday-as-work, no fragments in the body. The Gospel edge is the prayer line naming the Holy Spirit and Christ.
