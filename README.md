# Measure Experiment (ExpB: Evaluativity)

## Quick Links

| Version | URL |
|---------|-----|
| **Experiment 1** | [English](https://lingsyrina.github.io/MagnitudeExperiments/ExpA_gradability.html) · [Mandarin](https://lingsyrina.github.io/MagnitudeExperiments/ExpA_gradability_zh.html) |
| **Experiment 2** | [English](https://lingsyrina.github.io/MeasureExperiment/ExpB_evaluativity.html) · [Mandarin](https://lingsyrina.github.io/MeasureExperiment/ExpB_evaluativity_zh.html) |

---

## 1. Code Structure

```
root/
├── ExpB_evaluativity.html        # Main experiment (English)
├── ExpB_evaluativity_zh.html     # Main experiment (Mandarin)
├── consent.html                  # IRB-approved consent form
│
├── utils/
│   ├── blob.js                   # Blob shape definitions
│   ├── canvasMorpher.js          # Canvas rendering for morphs
│   ├── draw.js                   # Drawing utilities
│   ├── util.js                   # Stimuli generation & utilities
│   └── logsaver.js               # Debug logging utilities
│
├── blocks/
│   ├── prompts.js                # English prompts & trial configs
│   ├── mandarin_prompts.js       # Mandarin prompts & trial configs
│   ├── slider_response.js        # Slider trial blocks (EN)
│   ├── slider_response_zh.js     # Slider trial blocks (ZH)
│   ├── block_intervention.js     # Learning blocks (EN)
│   ├── block_intervention_zh.js  # Learning blocks (ZH)
│   └── consent_handler.js        # Subject ID, consent, data save
│
├── design/
│   ├── exp2.json                 # Blob shape parameters
│   └── blobs.json                # Alternative blob configs
│
└── external/
    └── plugin-canvas-slider-response.js  # Custom jsPsych plugin
```

---

## 2. URL Parameters for Testing

| Parameter | Values | Description |
|-----------|--------|-------------|
| `test` | `1` | Reduced trials (2 pre, 4 learn, ~9 test) |
| `quicktest` | `1` | Minimal trials, skip learning phase |
| `auto` | `1` | **Auto-advance mode** - runs experiment automatically |
| `group` | `0`, `1`, `2` | Force group assignment (Ord/Int/Rat) |
| `print` | `1` | Download stimuli configs to console |

### Example URLs

```bash
# Full auto test (fastest debugging)
http://localhost:8080/ExpB_evaluativity.html?quicktest=1&group=0&auto=1

# Test mode with learning phase
http://localhost:8080/ExpB_evaluativity.html?test=1&group=1

# Production (no params)
http://localhost:8080/ExpB_evaluativity.html
```

---

## 3. Experiment Design

### Trial Counts (Production)

| Phase | Trials | Description |
|-------|--------|-------------|
| Pre-Slider | 20 | Baseline calibration |
| Learning | 40 | Label/measure training (Pass + Active) |
| Test: Comparative | 20 | "Xer than" judgments |
| Test: Equative | 20 | "as X as" judgments |
| **Total** | **100** | |

### Group Conditions

| Group | Code | Learning Type |
|-------|------|---------------|
| 0 | `Ord` | Comparative + Intensifier (ordinal) |
| 1 | `Int` | Comparative + Measure Phrase (interval) |
| 2 | `Rat` | Absolute + Measure Phrase (ratio) |

### Test Stimuli Distribution (Stratified Sampling)

**Comparative Trials (20 total):**
| Category | Count | Description |
|----------|-------|-------------|
| Congruent | 8 | A vs B (clear different zones) |
| Incongruent AA | 3 | Both objects in A zone |
| Incongruent BB | 3 | Both objects in B zone |
| Ambiguous | 6 | At least one in middle zone |

**Equative Trials (20 total):**
| Category | Count | Description |
|----------|-------|-------------|
| Congruent A | 4 | A zone, labeled "as A as" |
| Congruent B | 4 | B zone, labeled "as B as" |
| Incongruent A | 3 | B zone, mislabeled "as A as" |
| Incongruent B | 3 | A zone, mislabeled "as B as" |
| Ambiguous | 6 | Middle zone (0.4-0.6) |

---

## 4. Main Functions

### Stimuli Generation (`utils/util.js`)

#### `BlockAppend2` - General stimuli generation
```javascript
BlockAppend2({
  labelDict,           // Label mapping by radius range
  configs: [{          // Array of config objects
    radiusRange: [0, 1],
    randRange: [0.3, 0.7],
    numStimuli: 20
  }],
  trialType: 'PreLabelSlider',  // Prompt type
  labelType: ['Bare', 'Adv']    // Optional label modifiers
})
```

#### `generateBalancedTestStimuli` - Stratified test stimuli
```javascript
generateBalancedTestStimuli({
  // Comparative distribution
  numCompCongruent: 8,
  numCompIncongruentAA: 3,
  numCompIncongruentBB: 3,
  numCompAmbiguous: 6,
  
  // Equative distribution
  numEquaCongruentA: 4,
  numEquaCongruentB: 4,
  numEquaIncongruentA: 3,
  numEquaIncongruentB: 3,
  numEquaAmbiguous: 6,
  
  // Constraints
  minCompDiff: 0.15,
  randRange: [0.3, 0.7]
})
// Returns: { compStimuli: [...], equaStimuli: [...], allStimuli: [...] }
```

### Trial Blocks (`blocks/slider_response.js`)

| Function | Description |
|----------|-------------|
| `GetSlider(prompts, stimuli, task_name)` | Pre-slider calibration trials |
| `GetCombinedSlider(prompts, stimuli, task_name)` | Test slider with button response |

### Intervention Blocks (`blocks/block_intervention.js`)

| Function | Description |
|----------|-------------|
| `GerCombinedPass(prompts, stimuli, task_name)` | Passive learning (observation) |
| `GerCombinedAct(prompts, stimuli, task_name)` | Active learning (with feedback) |

---

## 5. Data Output Columns

### Pre-Slider Trials (`task: "pre_slider"`)

| Column | Description |
|--------|-------------|
| `radius` | Morph radius (0-1) |
| `rand` | Noise parameter |
| `method` | `"SliderMorph"` |
| `condition` | Visual condition (0/1) |
| `reforder` | Reference order (`"AB"` or `"BA"`) |
| `response` | Slider position (0-100) |

### Button Response (`task: "ButtonforSlider"`)

| Column | Description |
|--------|-------------|
| `radius` | `[p1, p2]` morph pair |
| `rand` | `[r1, r2]` noise pair |
| `order` | Button options array |
| `key` | Correct button (`"q"` or `"p"`) |
| `truelabel` | Correct answer text |
| `congruity` | `"congruit"`, `"incongruit"`, or `"ambiguous"` |
| `reforder` | Reference order (`"AB"` or `"BA"`) |
| `correct` | `true` / `false` |
| `response` | Button clicked (0, 1, 2) |

### Test Slider Trials (`task: "test_slider"`)

| Column | Description |
|--------|-------------|
| `radius` | `[p1, p2]` morph pair |
| `rand` | `[r1, r2]` noise pair |
| `method` | `"MorphPair"` |
| `condition` | `"baseline"` or `"degQ"` |
| `reforder` | Reference order (`"AB"` or `"BA"`) |
| `congruity` | `"congruit"`, `"incongruit"`, or `"ambiguous"` |
| `response` | Slider position (0-100) |

---

## 6. Canvas Types (`utils/canvasMorpher.js`)

| Type | Description | Parameters |
|------|-------------|------------|
| `SliderMorph` | Single morph + slider with references | `par`: radius, `r`: [0,1], `condition`: 0/1 |
| `SliderPair` | Morph pair + slider with references | `par`: [p1,p2], `r`: [0,1], `condition`: 0/1 |
| `MorphSingle` | Single morph only | `par`: radius, `n`: noise |
| `MorphPair` | Morph pair only | `par`: [p1,p2], `n`: [n1,n2] |

---

## 7. Randomization & Reproducibility

- **Seeded randomization:** `Math.seedrandom('fixed-seed')` ensures identical stimuli across subjects
- **Shuffled labels:** `linglabels = Shuffle(['raflen', 'luprit'])` varies per session (before seed)
- **Group assignment:** Random unless specified via `?group=` parameter

---

## 8. Debug Mode Features

When `?test=1` or `?quicktest=1`:
- Local CSV download instead of OSF upload
- Console logging of data structure
- Skip consent (quicktest only)
- Skip learning phase (quicktest only)

When `?auto=1`:
- Automatically advances through all trials
- Random button clicks and slider positions
- ~500ms per action
- Useful for rapid testing of all conditions

---

## 9. IRB Information

- **Protocol:** #25337
- **PI:** Robert Goldstone
- **Contact:** Ling Sun (812-391-4571)
- **Consent:** `consent.html` matches IRB-approved `SIS.docx`
