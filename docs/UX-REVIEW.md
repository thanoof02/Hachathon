# Therapulse website experience review

Reviewed and implemented locally on 17 November 2026. No GitHub push or deployment was performed for this revision.

## Public reference review

These are design observations from the public pages below, not claims that competitor services were clinically evaluated or that their private account flows were tested.

| Reference | Observed pattern | Therapulse decision |
| --- | --- | --- |
| [7 Cups: How it works](https://www.7cups.com/about/howitworks.php) | Distinguishes listeners, professional therapy, and other community support; describes how to choose a person. | Label peer support separately from professional care. Explain the difference before someone enters a circle or books. |
| [Wysa FAQ](https://www.wysa.com/faq) | Groups self-help around difficulties, explains AI limitations, and calls for consistent navigation, headings, contrast, and responsive layouts. | Group tools by the person's immediate need, keep one clear action in the plan, provide transparent consent, and audit accessibility. |
| [NHS Every Mind Matters: Mind Plan](https://www.nhs.uk/every-mind-matters/mental-wellbeing-tips/your-mind-plan-quiz/) | Explains the sequence from short questions to practical actions, with general-wellbeing rather than diagnostic positioning. | Explain the journey before starting. Show a specific next action and its reason; keep scores and raw answers in optional details. |
| [Amaha: Therapy FAQs](https://www.amahahealth.com/help/counselling/) | Its public question categories foreground choosing a therapist, session duration, fees, rescheduling, privacy, and emergency boundaries. Interactive answer text was not fully available to the reader. | Put session type, time zone, duration, price, privacy, and cancellation directly in the booking flow, rather than assuming the person knows them. |

The BetterHelp FAQ was protected by a JavaScript/bot-verification screen. Its signed-in interface was not inspected. The changes use original Therapulse copy and styling, rather than copying competitor branding or claiming equivalent clinical services.

## Patient journey

1. The website header has predictable, plain-language destinations. Extra features live under More support rather than competing on the home screen.
2. The home page has one primary start: Pulse Check. Direct access to a therapist, calming tools, and a journal stays available.
3. Before questions, the person sees duration, skip/privacy expectations, and consent. During questions, comments are optional and collapsed; radios, Back, Next, Skip, and Leave have explicit meanings.
4. A saved check-in opens My next step. Its first action has a reason, a time expectation, and a specific destination. Professional-help preferences are respected. Higher-support responses lead to professional options, with free options prioritised.
5. A calming recommendation opens that exercise directly. Completion offers the next planned step. Nothing is booked or shared automatically.
6. A therapist selection leads to a date/time screen, then a complete review and confirmation. Saved appointments show reschedule/cancel actions and clear demonstration boundaries.
7. Answers, score, history, milestones, and a downloadable weekly reflection are optional. Progress is never presented as a health assessment or used to block care.
8. Concerning self-harm responses open immediate support before an ordinary results screen. Deterministic safety logic overrides AI classification.

## Therapist journey

- Therapist sign-in always opens the licence check. Existing current documents can be reviewed and confirmed; otherwise the therapist pastes, drops, or selects a PNG/JPG/PDF.
- The server checks role, file signature/type/size, required details, expiry, and consent. The private file is encrypted. A visual upload is not proof of authentic professional registration.
- The separate workspace contains Overview, Services & fees, Availability, My sessions, and My licence. Patient navigation is not shown there.
- A therapist can save an introduction, support area, languages, session duration, modes, individual/group fees, and free/reduced-fee options.
- Days/times and accepting-new-client status are saved explicitly. Unreviewed profiles remain private regardless of the switch.
- Directory publication requires a current document, approved review status, fresh account verification, and accepting-new-client status. Uploading a replacement resets review and withdraws publication.
- The directory and booking system use the provider's saved fees/modes/times after approval. Atomic reservation records prevent the same provider/time from being booked twice. A therapist sees a scoped appointment copy with the alias, not patient journals or check-in answers.

## Accessibility and verification

Native radios/checkboxes, visible labels, large controls, focus outlines, headings, a skip link, restrained motion, readable text, and native modal dialogs with keyboard wrapping/restored focus are used. Institution charts have a table alternative. Colour contrast was audited and adjusted. Automated checks do not replace an assistive-technology user study.

Repeatable tests live in `tests/` and `tests/browser/`. They cover patient guidance; urgency routing; therapist paste/upload/pricing/availability; private-data and role access; booking fees, slots, duplication, cancellation and provider visibility; all nine wellness tools; journals, gratitude, expression, safety contacts and circles; institution schedules; progress/downloads; keyboard behaviour; mobile navigation; and automated WCAG A/AA checks.

Live Neon, Anthropic vision/reflection, real payments, video delivery, email, human licence review, and human moderation cannot be verified without their operational integrations. Current demo boundaries remain visible where they affect a visitor's decisions.
