Wisconsin Card Sorting Task (WCST)
---------------------------------------

The experiment
--------------

Participants are presented with four fixed target cards displayed across the top of the screen:
(1) one red dot, (2) two yellow triangles, (3) three green crosses, and (4) four blue stars.
On each trial a test card appears in the centre of the screen. Participants must sort the test card
by clicking on whichever target card they believe matches according to an unknown rule. The rule can
be based on colour (match the target card of the same colour), shape (match the target card of the
same shape), or number (match the target card with the same number of symbols). After every
response, feedback ("Correct!" or "Incorrect") is displayed for 1 second.

Instructions given to participants:
    Screen 1: "In this task you will be required to sort the presented cards based on a rule i.e.
    the cards will have to be sorted based on either colour, shape or number. The rule will not be
    presented, however you will receive feedback on each trial. After a certain amount of trials the
    rule will change to a different one. To select your response click on one of the four cards
    presented at the top of the screen."

    Screen 2 (example): "The presented card (bottom centre) can be categorised based on shape
    (dots), colour (yellow) or number (three). Click on the first card if you want to categorise it
    by the shape, second if you want categorise it by colour and third if you want to categorise it
    by number. After you select your response, feedback will be provided. Click on the image to
    start the experiment."

Stimuli:
    The stimulus set consists of 192 test cards drawn from the full factorial combination of four
    colours (red, blue, green, yellow), four shapes (dot, triangle, cross, star), and four
    numerosities (1, 2, 3, 4), yielding 64 unique cards per sorting dimension. Three sorting rules
    are used (colour, number, shape), each associated with a distinct subset of 64 cards from the
    stimulus file (cards.xlsx). Each card subset is randomised independently within its block.

Trial and block structure:
    The task consists of 6 blocks. Each block is randomly drawn (without replacement within a pair
    of repetitions) from the three possible rules, so that every rule appears exactly twice across
    the session. Within each block all 64 cards from the active rule's subset are presented in
    randomised order. The total number of unique card images in the stimulus set is 64.


Comparison with the standard WCST
----------------------------------

The standard Wisconsin Card Sorting Test (Grant & Berg, 1948; Heaton et al., 1993) uses a deck of
128 response cards and four key cards (one red triangle, two green stars, three yellow crosses, four
blue circles in the original Berg version). The sorting rule changes after 10 consecutive correct
responses, and the test continues until six categories are completed or all 128 cards are exhausted.
The total number of trials therefore varies across participants (64-128) and depends entirely on
performance.

The present computerised implementation differs from the standard version in the following ways:

1. Fixed rather than criterion-based rule shifts. In the standard WCST the rule changes only after
   10 consecutive correct responses, making attainment of each category contingent on performance.
   Here the rule changes after exactly 64 trials regardless of accuracy. This removes the
   criterion-based element that is central to the clinical interpretation of perseverative errors
   and the total number of categories completed, so those standard indices cannot be computed.

2. Fewer trials per block. Sixty-four trials per block is shorter than the full standard version,
   which can extend across 128 cards. The shorter block length reduces statistical power for
   estimating within-block learning and limits the detection of perseverative responding.

3. Reduced total trial count. The standard WCST administers 64 to 128 cards; this version
   administers exactly 64. The reduced number of trials limits the reliability of derived scores
   (e.g., total errors, perseverative errors) relative to normative data collected with the full
   version.

4. Fixed number of categories. The task always presents exactly 6 rule blocks (2 repetitions x 3
   rules), whereas the standard WCST terminates either at 6 categories or at card 128. The fixed
   structure ensures all participants complete the same number of shifts and removes variance in
   categories completed as an outcome measure.

5. Computer-administered mouse-click response. The original WCST uses physical cards sorted by
   hand. Computerised administration may reduce administration variability and permits millisecond-
   precision reaction-time recording, but normative data from Heaton et al. (1993) and comparable
   sources were collected with physical materials.

6. Instructions disclose the sorting dimensions. The participant instructions explicitly state that
   cards "will have to be sorted based on either colour, shape or number" and the example screen
   names each dimension individually. The standard WCST explicitly prohibits this: "While it is
   permissible to clarify the meaning of the stimulus (key) cards and the manner in which the
   client is to respond, the examiner must never violate the integrity of the WCST by giving any
   indication of the sorting principles or the nature of the shift from one category to the next"
   (Strauss et al., 2006, p. 655). Disclosing the dimension names reduces the inductive-reasoning
   demand of the task and may lower scores on measures sensitive to concept formation (e.g., trials
   to first category, total errors in early blocks).

Implications: Because rule shifts are time-based rather than criterion-based, because the total
trial count is substantially reduced, and because the instructions disclose the sorting dimensions
to participants, the standard clinical indices (perseverative errors, perseverative responses,
categories completed, failure to maintain set) cannot be interpreted using published normative data
(Heaton et al., 1993; Kongs et al., 2000). The task is suitable for experimental research requiring
a brief, computerised measure of cognitive flexibility and set-shifting, but direct comparisons with
clinical WCST norms should be made with caution. For guidance on comparing results with other
research studies, see the section below.


Comparing with other research versions of the WCST
---------------------------------------------------

Even though comparison with clinical norms is not appropriate here (see above), the results can
still be compared to other research studies that used modified or computerised versions of WCST.
There is quite a lot of such research, especially in studies of cognitive flexibility and prefrontal
functions (Nyhus & Barcelo, 2009). However different research versions vary quite a lot in how many
trials they use, whether rule shifts are fixed or criterion-based, and also whether or not sorting
dimensions are disclosed to participants. This version uses fixed 64-trial blocks and discloses the
dimensions in instructions, which will affect how results compare to other versions.
When comparing across studies it is probably best to use proportion correct as the main accuracy
measure (Heaton et al., 1993) rather than raw error counts, because different versions have
different total number of trials.


Analysing your data
-------------------

Data are saved to a CSV file in the data/ folder, named
<participant>_Wisconsin Card Sorting Task_<date>.csv.

The following columns are saved for each trial:

Participant and session information:
    participant         - Participant identifier entered at the start of the session.
    session             - Session number (default "001").
    group               - Group label entered at the start of the session.
    time_of_day         - Time-of-day label entered at the start of the session.
    date                - Date and time stamp of the experimental session.

Trial-level variables:
    rule                - Sorting rule active in the current block: "colour", "number", or "shape".
    card                - File path of the test card image presented on the current trial.
    corrAns             - Name of the correct target card for the current trial
                          (one_red_dot | two_yellow_triangles | three_green_crosses |
                          four_blue_stars).
    Score               - Accuracy on the current trial: 1 = correct, 0 = incorrect.
    RT                  - Reaction time in milliseconds, measured from onset of the test card to
                          the mouse click.

Response details:
    response.clicked_name  - Name of the target card that was clicked.
    response.x             - Horizontal screen coordinate (in height units) of the mouse click.
    response.y             - Vertical screen coordinate (in height units) of the mouse click.
    response.leftButton    - State of the left mouse button at response offset (1 = pressed).
    response.midButton     - State of the middle mouse button at response offset.
    response.rightButton   - State of the right mouse button at response offset.
    response.started       - Onset time of the response window (seconds from trial start).
    response.stopped       - Offset time of the response window (seconds from trial start).

Stimulus timing (seconds from experiment start):
    fixation.started / fixation.stopped                          - Fixation cross display window.
    one_red_dot.started / one_red_dot.stopped                    - Target card 1 display window.
    two_yellow_triangles.started / two_yellow_triangles.stopped  - Target card 2 display window.
    three_green_crosses.started / three_green_crosses.stopped    - Target card 3 display window.
    four_blue_stars.started / four_blue_stars.stopped            - Target card 4 display window.
    trial_card.started / trial_card.stopped                      - Test card display window.


References
----------

Grant, D. A., & Berg, E. A. (1948). A behavioral analysis of degree of reinforcement and ease of
    shifting to new responses in a Weigl-type card-sorting problem. Journal of Experimental
    Psychology, 38(4), 404-411. https://doi.org/10.1037/h0059831

Heaton, R. K., Chelune, G. J., Talley, J. L., Kay, G. G., & Curtiss, G. (1993). Wisconsin Card
    Sorting Test manual: Revised and expanded. Psychological Assessment Resources.

Kongs, S. K., Thompson, L. L., Iverson, G. L., & Heaton, R. K. (2000). Wisconsin Card Sorting
    Test-64 Card Version (WCST-64). Psychological Assessment Resources.

Strauss, E., Sherman, E. M. S., & Spreen, O. (2006). A compendium of neuropsychological tests:
    Administration, norms, and commentary (3rd ed.). Oxford University Press.

Nyhus, E., & Barcelo, F. (2009). The Wisconsin Card Sorting Test and the cognitive neuroscience of
    prefrontal cortex and attention networks. Brain and Cognition, 71(3), 352-365.
    https://doi.org/10.1016/j.bandc.2009.03.005

Peirce, J., Gray, J. R., Simpson, S., MacAskill, M., Hochenberger, R., Sogo, H., Kastman, E., &
    Lindelov, J. K. (2019). PsychoPy2: Experiments in behavior made easy. Behavior Research
    Methods, 51(1), 195-203. https://doi.org/10.3758/s13428-018-01193-y
