# Wisconsin Card Sorting Task (WCST) – Documentation

## 1) URL parameters (with example URL)

This test accepts the following URL query parameters (case-sensitive):

- `participant` – participant ID (string), e.g. `P001`
- `session` – session ID (string), default `001`
- `group` – study group/condition label (string), e.g. `control`
- `time_of_day` – time label (string), e.g. `morning`

If a parameter is provided in the URL, it is applied automatically and omitted from the startup dialog.

Example URL:

`https://your-host/path/index.html?participant=P001&session=001&group=control&time_of_day=morning`

---

## 2) Brief explanation of how the task works

- Participant sees 4 fixed reference cards at the top:
  - 1 red triangle
  - 2 green stars
  - 3 yellow crosses
  - 4 blue dots
- One card appears in the center each trial (from a predefined 64-card deck).
- Participant clicks one of the 4 reference cards to sort the center card.
- Correctness is based on a hidden rule (principle), which changes during the task.
- Rule sequence:
  - `colour` → `shape` → `number` → `colour` → `shape` → `number`
- The rule changes after **10 consecutive correct** responses.
- Task ends after all 6 sets are completed.
- Immediate feedback is shown after each trial: `Correct!` or `Incorrect!`

---

## 3) Results variables and coding

Data are written trial-by-trial (CSV/online data output). Key variables:

### Participant/session metadata

- `participant` – from dialog or URL
- `group` – from dialog or URL
- `session` – from dialog or URL
- `time_of_day` – from dialog or URL

### Trial descriptors

- `trial_number` – trial index starting at 1
- `set_number` – set index starting at 1
- `card_image` – stimulus image path for current card
- `card_number` – stimulus number feature (`1`, `2`, `3`, `4`)
- `card_color` – stimulus color (`red`, `green`, `yellow`, `blue`)
- `card_shape` – stimulus shape (`triangle`, `star`, `cross`, `dot`)

### Participant response

- `clicked_position` – clicked reference position (`1..4`)
- `clicked_color` – color feature of clicked reference card
- `clicked_shape` – shape feature of clicked reference card
- `clicked_number` – number feature of clicked reference card
- `rt` – response time in seconds

### Rule/error coding

- `current_principle` – active sorting rule for the trial (`colour`, `shape`, `number`)
- `previous_principle` – previous completed-set rule, or `none`
- `principles_used` – which dimensions matched the clicked card (comma-separated, e.g. `colour,shape`) or `none`
- `correct` – correctness code:
  - `1` = correct
  - `0` = incorrect
- `error_type`:
  - `none` = no error (correct response)
  - `perseverative` = incorrect, but matches previous rule
  - `non-perseverative` = incorrect, does not match current or previous rule

