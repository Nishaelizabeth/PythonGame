// ============================================================================
//  PYTHON QUEST — LEVEL DATA
//  Every level: identity + map position + story + reflection (the teaching).
//  Workflow nodes:  { type: 'start'|'input'|'process'|'end', label }
//                   { type: 'decision', label, yes, no }
//  Code lines:      { code, explain }
// ============================================================================

export const LEVELS = [
  // ----------------------------------------------------------------- LEVEL 1
  {
    id: 1,
    name: 'Programming Village',
    subtitle: 'The Isle of First Steps',
    topics: ['Programming', 'Coding', 'Computer Program', 'Algorithm'],
    emoji: '🏡',
    scene: 'village',
    gradient: 'from-emerald-400 via-green-500 to-teal-600',
    accent: '#22c55e',
    pos: { x: 12, y: 80 },
    rewards: { xp: 100, coins: 40, stars: 3, badge: 'first-steps' },
    story: {
      title: 'Welcome to Programming Village',
      paragraphs: [
        'A gentle wind carries the smell of fresh bread across Programming Village. The friendly villagers have a problem — their delivery robot, Beepo, has forgotten how to get to the bakery!',
        'Beepo can only follow a list of simple instructions, one after another. A list of clear steps like this is called an ALGORITHM.',
      ],
      mission: 'Help Elizabeth teach Beepo the way to the bakery by arranging the steps in the correct order.',
      objective: 'Build a working algorithm: put the movement steps in the right sequence so Beepo reaches the bakery.',
    },
    reflection: {
      experienced:
        'You gave Beepo a list of steps — move, move, turn, move — and the robot followed them one at a time, in order. When the steps were in the right order, Beepo reached the bakery.',
      concept: {
        title: 'Programs & Algorithms',
        body: 'A COMPUTER PROGRAM is a set of instructions that tells a computer what to do. Writing those instructions is called PROGRAMMING (or coding). Before we write code, we plan the exact steps to solve a problem — that ordered plan is called an ALGORITHM. Computers do exactly what you say, in the exact order you say it.',
      },
      workflow: [
        { type: 'start', label: 'Beepo starts here 🤖' },
        { type: 'process', label: 'Step 1 — Move forward' },
        { type: 'process', label: 'Step 2 — Turn right' },
        { type: 'process', label: 'Step 3 — Move forward' },
        { type: 'end', label: 'Beepo reaches the bakery 🥖' },
      ],
      code: [
        { code: 'move_forward()', explain: 'The first instruction. Beepo moves one step ahead.' },
        { code: 'turn_right()', explain: 'The second instruction runs AFTER the first. Beepo turns.' },
        { code: 'move_forward()', explain: 'The third instruction. Order matters — swap them and Beepo gets lost!' },
      ],
      practice: {
        question: 'If you swapped the order and told Beepo to "turn right" BEFORE "move forward", would Beepo still reach the bakery?',
        options: ['Yes, order never matters', 'No — a computer follows steps in the exact order given'],
        answerIndex: 1,
        reveal:
          'Correct! An algorithm is an ORDERED list of steps. Change the order and you change the result. Computers never guess what you meant — they follow your steps exactly.',
      },
    },
  },

  // ----------------------------------------------------------------- LEVEL 2
  {
    id: 2,
    name: 'Memory Forest',
    subtitle: 'Where Names Hold Treasures',
    topics: ['Variables', 'Keywords', 'Identifiers'],
    emoji: '🌲',
    scene: 'forest',
    gradient: 'from-green-500 via-emerald-600 to-lime-500',
    accent: '#16a34a',
    pos: { x: 34, y: 82 },
    rewards: { xp: 120, coins: 45, stars: 3, badge: null },
    story: {
      title: 'Into the Memory Forest',
      paragraphs: [
        'Deep in the Memory Forest stand rows of enchanted chests. Each chest can hold ONE treasure, and each chest has a name carved on it so you can find it again.',
        'These magical named chests are exactly how a computer remembers things. We call them VARIABLES — a name that stores a value.',
      ],
      mission: 'Help Elizabeth place each treasure into the correctly named chest to power up the forest.',
      objective: 'Match each value to the variable (named chest) that should store it.',
    },
    reflection: {
      experienced:
        'You dropped a treasure (a value) into a chest that had a NAME on it. Later, whenever you said the chest\'s name, you got the treasure back. That is exactly what a variable does.',
      concept: {
        title: 'Variables, Keywords & Identifiers',
        body: 'A VARIABLE is a labeled box in the computer\'s memory. The label (the name you choose, like score or player_name) is called an IDENTIFIER. Some words are reserved by Python itself — like if, for, and while — these are KEYWORDS and you cannot use them as your own names.',
      },
      workflow: [
        { type: 'start', label: 'Pick a name (identifier) 🏷️' },
        { type: 'process', label: 'Use = to store a value in it' },
        { type: 'process', label: 'The name now points to that value' },
        { type: 'end', label: 'Say the name → get the value back ✨' },
      ],
      code: [
        { code: 'coins = 50', explain: 'Create a variable named "coins" and store the value 50 inside it. The = sign means "put the right side into the left name".' },
        { code: 'player_name = "Elizabeth"', explain: 'A variable can hold text too. "player_name" is the identifier (the name we chose).' },
        { code: 'print(coins)', explain: 'Say the name "coins" and Python gives back what is stored: 50.' },
      ],
      practice: {
        question: 'Which of these is NOT allowed as a variable name in Python?',
        options: ['score', 'for', 'player2'],
        answerIndex: 1,
        reveal:
          'Right! "for" is a KEYWORD — a special word Python reserves for loops. Keywords cannot be used as your own variable names. "score" and "player2" are perfectly fine identifiers.',
      },
    },
  },

  // ----------------------------------------------------------------- LEVEL 3
  {
    id: 3,
    name: 'Data Type Mountain',
    subtitle: 'The Peak of Four Kinds',
    topics: ['String', 'Integer', 'Float', 'Boolean'],
    emoji: '⛰️',
    scene: 'mountain',
    gradient: 'from-sky-400 via-indigo-500 to-slate-600',
    accent: '#6366f1',
    pos: { x: 58, y: 80 },
    rewards: { xp: 130, coins: 50, stars: 3, badge: null },
    story: {
      title: 'Climbing Data Type Mountain',
      paragraphs: [
        'High on Data Type Mountain, magical crystals tumble down the slopes. Each crystal is one of four kinds, and each kind belongs in its own glowing bin.',
        'Computers sort information the same way. Every value has a TYPE, and knowing the type tells the computer what it can do with the value.',
      ],
      mission: 'Help Elizabeth catch each falling crystal and drop it into the matching data-type bin.',
      objective: 'Sort values into the four bins: String, Integer, Float and Boolean.',
    },
    reflection: {
      experienced:
        'You sorted falling crystals: words went into one bin, whole numbers into another, decimal numbers into a third, and true/false crystals into the last. You were sorting by TYPE.',
      concept: {
        title: 'The Four Everyday Data Types',
        body: 'A STRING is text, always wrapped in quotes: "hello". An INTEGER is a whole number with no decimal point: 7. A FLOAT is a number with a decimal point: 3.14. A BOOLEAN is one of only two values: True or False. Python decides an action based on the type — you can add numbers, but "adding" strings just glues them together.',
      },
      workflow: [
        { type: 'start', label: 'A value appears' },
        { type: 'decision', label: 'Is it wrapped in quotes?', yes: 'It is a String 🔤', no: 'Check further ↓' },
        { type: 'decision', label: 'Does it have a decimal point?', yes: 'It is a Float 🔵', no: 'Whole number → Integer 🔢' },
        { type: 'end', label: 'True / False → Boolean ✅' },
      ],
      code: [
        { code: 'name = "Elizabeth"', explain: 'Quotes mean this is a STRING (text).' },
        { code: 'age = 11', explain: 'A whole number, no decimal point → this is an INTEGER.' },
        { code: 'height = 1.42', explain: 'It has a decimal point → this is a FLOAT.' },
        { code: 'is_hero = True', explain: 'Only True or False → this is a BOOLEAN.' },
      ],
      practice: {
        question: 'What data type is the value 100 (with no quotes and no decimal point)?',
        options: ['String', 'Integer', 'Float'],
        answerIndex: 1,
        reveal:
          'Correct! 100 has no quotes (so not a string) and no decimal point (so not a float). It is a whole number — an INTEGER.',
      },
    },
  },

  // ----------------------------------------------------------------- LEVEL 4
  {
    id: 4,
    name: 'Operator Valley',
    subtitle: 'The Bridge of Symbols',
    topics: ['Arithmetic', 'Comparison', 'Logical', 'Assignment', 'Membership', 'Identity'],
    emoji: '🌉',
    scene: 'valley',
    gradient: 'from-amber-400 via-orange-500 to-rose-500',
    accent: '#f97316',
    pos: { x: 82, y: 78 },
    rewards: { xp: 140, coins: 55, stars: 3, badge: null },
    story: {
      title: 'Crossing Operator Valley',
      paragraphs: [
        'Operator Valley is split by a canyon crossed only by magic bridges. Each bridge lights up when you place the correct SYMBOL between two values to make the spell true.',
        'These symbols are called OPERATORS. They tell Python to do something with values — add them, compare them, or combine true/false answers.',
      ],
      mission: 'Help Elizabeth choose the right operator to complete each bridge and cross the valley.',
      objective: 'Pick the operator that makes each expression correct or True.',
    },
    reflection: {
      experienced:
        'You slotted a symbol between two values and the bridge either lit up (True) or stayed dark (False). Each symbol did a different job — some did maths, some compared, some combined answers.',
      concept: {
        title: 'The Families of Operators',
        body: 'ARITHMETIC operators do maths: + - * /. COMPARISON operators ask a true/false question: > < >= <= == !=. LOGICAL operators combine true/false answers: and, or, not. ASSIGNMENT operators store values: = and += . MEMBERSHIP operators ask "is it inside?": in, not in. IDENTITY operators ask "is it the exact same object?": is, is not.',
      },
      workflow: [
        { type: 'start', label: 'Two values: 7 and 5' },
        { type: 'decision', label: 'Use > (comparison): 7 > 5', yes: 'Bridge lights up → True ✅', no: 'Stays dark → False' },
        { type: 'process', label: 'Use + (arithmetic): 7 + 5 → 12' },
        { type: 'end', label: 'Right operator, spell complete ✨' },
      ],
      code: [
        { code: 'total = 7 + 5', explain: 'ARITHMETIC: + adds the numbers. total becomes 12.' },
        { code: 'is_bigger = 7 > 5', explain: 'COMPARISON: > asks "is 7 greater than 5?" The answer is the Boolean True.' },
        { code: 'can_pass = (score > 5) and (lives > 0)', explain: 'LOGICAL: "and" is True only when BOTH sides are True.' },
        { code: 'has_key = "gold" in bag', explain: 'MEMBERSHIP: "in" checks whether "gold" is inside the bag.' },
      ],
      practice: {
        question: 'What is the result of the comparison  10 == 10 ?',
        options: ['True', 'False', '20'],
        answerIndex: 0,
        reveal:
          'Correct! A single = stores a value, but a double == asks "are these equal?". 10 equals 10, so the answer is the Boolean True.',
      },
    },
  },

  // ----------------------------------------------------------------- LEVEL 5
  {
    id: 5,
    name: 'Input & Output Town',
    subtitle: 'The Town That Talks Back',
    topics: ['print()', 'input()', 'int()', 'float()', 'str()', 'type()'],
    emoji: '🏙️',
    scene: 'town',
    gradient: 'from-cyan-400 via-sky-500 to-blue-600',
    accent: '#0ea5e9',
    pos: { x: 84, y: 52 },
    rewards: { xp: 150, coins: 60, stars: 3, badge: 'io-explorer' },
    story: {
      title: 'A Day in Input & Output Town',
      paragraphs: [
        'In Input & Output Town, a talking vending machine greets everyone. It ASKS you a question (that is input), and then it SHOWS you an answer (that is output).',
        'But the machine has a secret quirk: no matter what you type — even numbers — it always hears it as TEXT. This one rule confuses almost every new programmer!',
      ],
      mission: 'Help Elizabeth talk to the machine, and discover the famous "5" + "5" mystery.',
      objective: 'Use the machine to see why "5" + "5" is not 10 — and how to fix it.',
    },
    reflection: {
      experienced:
        'You typed 5 twice and asked the machine to add them. Instead of 10, it showed 55! Then, when you converted the text into real numbers first, it finally showed 10.',
      concept: {
        title: 'Why input() Always Returns a String',
        body: 'print() shows output on the screen. input() asks the user to type something — but whatever they type, Python receives it as a STRING (text), even if it looks like a number. Adding two strings glues them together: "5" + "5" = "55". To do maths you must first CONVERT the text into a number using int() (whole number) or float() (decimal). str() turns a number back into text, and type() tells you what type a value currently is.',
      },
      workflow: [
        { type: 'input', label: 'input() → you type 5' },
        { type: 'process', label: 'Python stores it as the STRING "5"' },
        { type: 'decision', label: 'Did you convert with int()?', yes: '5 + 5 = 10 ✅ (numbers)', no: '"5" + "5" = "55" (glued text)' },
        { type: 'end', label: 'print() shows the result' },
      ],
      code: [
        { code: 'a = input("Enter a number: ")', explain: 'input() shows the question and waits. Whatever is typed is stored as TEXT — so a is the string "5", not the number 5.' },
        { code: 'print(a + a)', explain: 'Because a is text, + GLUES the strings together. "5" + "5" becomes "55".' },
        { code: 'b = int(a)', explain: 'int() CONVERTS the text "5" into the real number 5.' },
        { code: 'print(b + b)', explain: 'Now b is a true number, so + does maths: 5 + 5 = 10. Mystery solved!' },
      ],
      practice: {
        question: 'A user types 5 into input(). What does  "5" + "5"  show on screen?',
        options: ['10', '"55" (the text 55)', 'An error'],
        answerIndex: 1,
        reveal:
          'Correct! input() gives you TEXT, and adding two strings glues them: "5" + "5" = "55". To get 10 you must convert first with int("5") + int("5"). This is the #1 surprise for new coders — and now you know it!',
      },
    },
  },

  // ----------------------------------------------------------------- LEVEL 6
  {
    id: 6,
    name: 'Traffic City',
    subtitle: 'The City of One Rule',
    topics: ['IF Statement'],
    emoji: '🚦',
    scene: 'city',
    gradient: 'from-rose-400 via-red-500 to-orange-500',
    accent: '#ef4444',
    pos: { x: 60, y: 54 },
    rewards: { xp: 160, coins: 65, stars: 3, badge: null },
    story: {
      title: 'Speeding Through Traffic City',
      paragraphs: [
        'Traffic City has one golden rule: do not drive faster than the speed limit of 80. Sharp-eyed police watch every road.',
        'The city works like a computer making a single decision: IF something is true, then do something about it.',
      ],
      mission: 'Help Elizabeth drive through the city and feel the ONE rule the police are checking.',
      objective: 'Drive fast to earn points — but notice what happens whenever your speed goes over 80.',
    },
    reflection: {
      experienced:
        'You noticed that whenever your car went faster than the speed limit, the police stopped you. When you stayed under the limit, nothing happened and you kept driving. The game was checking a condition before making a decision.',
      concept: {
        title: 'The IF Statement',
        body: 'An IF statement checks a CONDITION — a question that is either True or False. If the condition is True, the indented code below runs. If it is False, that code is skipped entirely. This is how programs make decisions.',
      },
      workflow: [
        { type: 'start', label: 'Current speed' },
        { type: 'process', label: 'Check the rule' },
        { type: 'decision', label: 'Is speed > 80?', yes: 'Police catch you 🚔', no: 'Keep driving 🚗' },
        { type: 'end', label: 'Continue the journey' },
      ],
      code: [
        { code: 'speed = 95', explain: 'A variable storing how fast the car is going right now.' },
        { code: 'if speed > 80:', explain: 'The IF keyword starts a decision. "speed > 80" is the CONDITION — a True/False question. The colon (:) means "here comes the code to run if it is True".' },
        { code: '    print("Police catch you!")', explain: 'This line is INDENTED (pushed right). It only runs when the condition is True. Since 95 > 80 is True, this message appears.' },
      ],
      practice: {
        question: 'Your car is going speed = 60. Does the line  print("Police catch you!")  run?',
        options: ['Yes, it always runs', 'No — 60 > 80 is False, so the indented line is skipped'],
        answerIndex: 1,
        reveal:
          'Exactly! 60 > 80 is False, so the IF is skipped and the police message never appears. The indented code only runs when the condition is True. Stay under 80 and you are safe!',
      },
    },
  },

  // ----------------------------------------------------------------- LEVEL 7
  {
    id: 7,
    name: 'Highway Escape',
    subtitle: 'The Road of Two Choices',
    topics: ['IF ELSE'],
    emoji: '🛣️',
    scene: 'highway',
    gradient: 'from-indigo-400 via-violet-500 to-purple-600',
    accent: '#8b5cf6',
    pos: { x: 36, y: 50 },
    rewards: { xp: 170, coins: 70, stars: 3, badge: null },
    story: {
      title: 'The Great Highway Escape',
      paragraphs: [
        'Elizabeth is racing down a two-lane highway with obstacles rushing toward her. There is no time to freeze — every moment demands a choice.',
        'When there is a block in your lane you must swerve; otherwise you stay. That is a two-way decision: do THIS, or ELSE do THAT.',
      ],
      mission: 'Help Elizabeth survive the highway by making the right two-way choice every time.',
      objective: 'Dodge obstacles: switch lanes when one is blocked, otherwise keep going.',
    },
    reflection: {
      experienced:
        'Every obstacle forced a choice with exactly two outcomes. If the road ahead was blocked, you swerved. Otherwise (else), you kept your lane. There was always a plan for both cases.',
      concept: {
        title: 'IF … ELSE',
        body: 'IF … ELSE handles TWO paths. If the condition is True, the IF block runs. If it is False, the ELSE block runs instead. Exactly one of the two always runs — never both, never neither. It guarantees your program has an answer for both situations.',
      },
      workflow: [
        { type: 'start', label: 'Obstacle ahead?' },
        { type: 'decision', label: 'Is my lane blocked?', yes: 'Swerve to the other lane ↔️', no: 'Stay in my lane ⬆️' },
        { type: 'end', label: 'Keep racing 🏁' },
      ],
      code: [
        { code: 'if lane_blocked:', explain: 'The condition. If there IS a block in the lane (True)...' },
        { code: '    swerve()', explain: 'Indented under IF — runs only when the lane is blocked.' },
        { code: 'else:', explain: 'The ELSE keyword. It catches every OTHER case — when the condition was False.' },
        { code: '    keep_going()', explain: 'Indented under ELSE — runs only when the lane is clear. One path always runs.' },
      ],
      practice: {
        question: 'If  lane_blocked  is False, which line runs?',
        options: ['swerve()', 'keep_going()', 'both of them'],
        answerIndex: 1,
        reveal:
          'Correct! When the IF condition is False, Python skips the IF block and runs the ELSE block instead — so keep_going() runs. With IF/ELSE, exactly one of the two paths always runs.',
      },
    },
  },

  // ----------------------------------------------------------------- LEVEL 8
  {
    id: 8,
    name: 'Football Championship',
    subtitle: 'The Stadium of Many Paths',
    topics: ['IF ELIF ELSE'],
    emoji: '⚽',
    scene: 'stadium',
    gradient: 'from-green-400 via-emerald-500 to-cyan-500',
    accent: '#10b981',
    pos: { x: 14, y: 48 },
    rewards: { xp: 180, coins: 75, stars: 3, badge: null },
    story: {
      title: 'The Football Championship',
      paragraphs: [
        'The stadium roars! Elizabeth steps up to take the championship-winning shot. But the power of her kick decides everything.',
        'A weak kick misses, a medium kick gets saved by the keeper, and a strong-but-accurate kick scores. Three different outcomes need more than a simple yes/no — they need multiple checks in a row.',
      ],
      mission: 'Help Elizabeth pick the perfect power so the ball flies past the keeper and into the net.',
      objective: 'Charge your shot to the right power zone to score the winning goal.',
    },
    reflection: {
      experienced:
        'Your kick had three possible results depending on the power. Low power missed, medium power was saved, and the perfect power scored. The game checked several conditions in order and stopped at the first one that matched.',
      concept: {
        title: 'IF … ELIF … ELSE',
        body: 'When there are MORE than two possibilities, we chain conditions with ELIF (short for "else if"). Python checks each condition from top to bottom and runs the FIRST one that is True, then skips the rest. ELSE at the end catches everything that did not match any condition.',
      },
      workflow: [
        { type: 'start', label: 'Kick power chosen' },
        { type: 'decision', label: 'Is power < 30?', yes: 'Too weak → Miss 😢', no: 'Check next ↓' },
        { type: 'decision', label: 'Elif power < 70?', yes: 'Keeper saves it 🧤', no: 'Check next ↓' },
        { type: 'end', label: 'Else → GOAL! ⚽🥅' },
      ],
      code: [
        { code: 'if power < 30:', explain: 'First check. If the power is very low...' },
        { code: '    print("Miss!")', explain: 'Runs only for a weak kick.' },
        { code: 'elif power < 70:', explain: 'ELIF = "else, if the first was False, try this". Checked only when power was NOT under 30.' },
        { code: '    print("Saved!")', explain: 'Runs for a medium kick (30 up to 69).' },
        { code: 'else:', explain: 'Catches everything left — power of 70 or more.' },
        { code: '    print("GOAL!")', explain: 'Runs for a strong kick. Python stops at the FIRST True condition.' },
      ],
      practice: {
        question: 'With power = 50, which message prints?',
        options: ['Miss!', 'Saved!', 'GOAL!'],
        answerIndex: 1,
        reveal:
          'Correct! 50 < 30 is False, so we move on. 50 < 70 is True, so "Saved!" prints and Python skips the rest. It always runs the FIRST condition that is True.',
      },
    },
  },

  // ----------------------------------------------------------------- LEVEL 9
  {
    id: 9,
    name: 'Zombie Forest',
    subtitle: 'The Forest of Repetition',
    topics: ['FOR LOOP'],
    emoji: '🧟',
    scene: 'zombie',
    gradient: 'from-lime-500 via-green-600 to-emerald-700',
    accent: '#65a30d',
    pos: { x: 16, y: 22 },
    rewards: { xp: 190, coins: 80, stars: 3, badge: null },
    story: {
      title: 'Survive the Zombie Forest',
      paragraphs: [
        'Night falls on the Zombie Forest, and a wave of exactly the same number of zombies shuffles toward Elizabeth every round.',
        'Instead of writing one instruction for each zombie, a clever coder repeats ONE instruction a set number of times. That is what a FOR loop does.',
      ],
      mission: 'Help Elizabeth zap the whole wave by repeating the same action for each zombie.',
      objective: 'Defeat every zombie in the wave — repeat your attack a fixed number of times.',
    },
    reflection: {
      experienced:
        'A wave had a known number of zombies. You repeated the exact same action — zap — once for each zombie, until the whole wave was cleared. You did not write the action many times; you repeated one action.',
      concept: {
        title: 'The FOR Loop',
        body: 'A FOR loop repeats a block of code a KNOWN number of times — perfect when you know how many. range(5) produces the numbers 0, 1, 2, 3, 4 (five values), and the loop body runs once for each. It saves you from copying the same line over and over.',
      },
      workflow: [
        { type: 'start', label: 'Wave of 5 zombies' },
        { type: 'process', label: 'for each zombie in the wave...' },
        { type: 'decision', label: 'Any zombie left?', yes: 'Zap it! Repeat 🔫', no: 'Wave cleared ✅' },
        { type: 'end', label: 'Loop ends — you survive 🌙' },
      ],
      code: [
        { code: 'for zombie in range(5):', explain: 'Repeat the indented block 5 times, once for each number 0,1,2,3,4. "zombie" holds the current count.' },
        { code: '    zap()', explain: 'The action to repeat. Because it is inside the loop, it runs 5 times — once per zombie.' },
        { code: 'print("Wave cleared!")', explain: 'This line is OUTSIDE the loop (not indented), so it runs once, only after all 5 zaps finish.' },
      ],
      practice: {
        question: 'How many times does  zap()  run in  for zombie in range(5): ?',
        options: ['1 time', '5 times', 'Forever'],
        answerIndex: 1,
        reveal:
          'Correct! range(5) gives five values (0,1,2,3,4), so the loop body runs exactly 5 times — one zap per zombie. A FOR loop is your best friend when you know the count in advance.',
      },
    },
  },

  // ----------------------------------------------------------------- LEVEL 10
  {
    id: 10,
    name: 'Temple Escape',
    subtitle: 'The Temple of Until',
    topics: ['WHILE LOOP'],
    emoji: '🏛️',
    scene: 'temple',
    gradient: 'from-amber-500 via-yellow-600 to-orange-700',
    accent: '#d97706',
    pos: { x: 40, y: 20 },
    rewards: { xp: 200, coins: 85, stars: 3, badge: null },
    story: {
      title: 'Escape the Crumbling Temple',
      paragraphs: [
        'The ancient temple is collapsing! Elizabeth must keep running, but she does not know how far the exit is — only that she must keep going WHILE she still has energy.',
        'When you do not know the exact number of repeats, but you DO know a condition to keep going, you use a WHILE loop: repeat as long as something stays true.',
      ],
      mission: 'Help Elizabeth keep running while her stamina lasts, and reach the exit before it runs out.',
      objective: 'Keep moving while a condition stays True — stop the moment it becomes False.',
    },
    reflection: {
      experienced:
        'You kept running again and again. Each step used a little stamina. The running continued WHILE stamina was above zero, and stopped the instant stamina ran out. You did not know the exact number of steps in advance — only the condition to keep going.',
      concept: {
        title: 'The WHILE Loop',
        body: 'A WHILE loop repeats a block AS LONG AS a condition stays True. Before each repeat it re-checks the condition; the moment it becomes False, the loop stops. Something inside the loop must eventually change the condition — otherwise it never stops (an "infinite loop"). Use WHILE when you do not know the exact number of repeats ahead of time.',
      },
      workflow: [
        { type: 'start', label: 'stamina = 10' },
        { type: 'decision', label: 'Is stamina > 0?', yes: 'Take a step, stamina − 1 🏃', no: 'Stop running' },
        { type: 'process', label: 'Loop back and check again 🔁' },
        { type: 'end', label: 'Reached the exit 🚪' },
      ],
      code: [
        { code: 'stamina = 10', explain: 'Start with 10 energy.' },
        { code: 'while stamina > 0:', explain: 'The condition is re-checked before every repeat. As long as stamina is above 0, keep looping.' },
        { code: '    run()', explain: 'The action that repeats while the condition is True.' },
        { code: '    stamina = stamina - 1', explain: 'CRUCIAL: each loop lowers stamina. This is what eventually makes the condition False so the loop can stop.' },
      ],
      practice: {
        question: 'What would happen if we FORGOT the line  stamina = stamina - 1 ?',
        options: ['The loop runs once', 'The loop runs forever (infinite loop)', 'Nothing changes'],
        answerIndex: 1,
        reveal:
          'Correct! If nothing ever changes stamina, the condition stamina > 0 stays True forever and the loop never stops — an infinite loop. A WHILE loop always needs something inside it that will eventually make the condition False.',
      },
    },
  },

  // ----------------------------------------------------------------- LEVEL 11
  {
    id: 11,
    name: 'Treasure Island',
    subtitle: 'The Island of Many-in-One',
    topics: ['LISTS'],
    emoji: '🏝️',
    scene: 'island',
    gradient: 'from-teal-400 via-cyan-500 to-sky-600',
    accent: '#14b8a6',
    pos: { x: 64, y: 22 },
    rewards: { xp: 210, coins: 90, stars: 3, badge: 'treasure-hunter' },
    story: {
      title: 'The Hunt on Treasure Island',
      paragraphs: [
        'Golden treasures are scattered across Treasure Island. Elizabeth needs one bag that can hold ALL of them, in order, so she can find any treasure again by its position.',
        'A single container that stores many values in order is called a LIST. Each item has a position number called an INDEX, starting at 0.',
      ],
      mission: 'Help Elizabeth collect every treasure into her inventory list and read items back by index.',
      objective: 'Gather treasures into a list, then use their index to find specific items.',
    },
    reflection: {
      experienced:
        'You collected many treasures into a single bag. They stayed in the order you picked them up, and you could point to any one of them by its position number. That bag is a list.',
      concept: {
        title: 'Lists',
        body: 'A LIST holds many values in one variable, kept in order, written inside square brackets []. Each item has an INDEX — its position — and Python counts from 0, not 1. So the first item is index 0, the second is index 1, and so on. Lists can grow with .append() and you can read any item with its index.',
      },
      workflow: [
        { type: 'start', label: 'Empty bag: treasures = []' },
        { type: 'process', label: 'Pick up gold → append to the list' },
        { type: 'process', label: 'Pick up gem → append to the list' },
        { type: 'decision', label: 'Want the first item?', yes: 'Use index 0 → treasures[0]', no: 'Use its index number' },
        { type: 'end', label: 'Full inventory in one variable 🎒' },
      ],
      code: [
        { code: 'treasures = ["gold", "gem", "crown"]', explain: 'A LIST of three items inside square brackets, kept in order.' },
        { code: 'print(treasures[0])', explain: 'Index 0 is the FIRST item. Python counts from 0, so this prints "gold".' },
        { code: 'treasures.append("map")', explain: '.append() adds a new item to the END of the list. Now the list has four items.' },
        { code: 'print(len(treasures))', explain: 'len() tells you how many items are in the list — here, 4.' },
      ],
      practice: {
        question: 'For  treasures = ["gold", "gem", "crown"] , what does  treasures[1]  give?',
        options: ['"gold"', '"gem"', '"crown"'],
        answerIndex: 1,
        reveal:
          'Correct! Lists start counting at 0, so index 0 is "gold" and index 1 is "gem". This "counting from zero" trips up many beginners — but not you anymore!',
      },
    },
  },

  // ----------------------------------------------------------------- LEVEL 12
  {
    id: 12,
    name: 'Wizard Academy',
    subtitle: 'The Academy of Spells',
    topics: ['Functions', 'Built-in Functions', 'User-defined Functions', 'Parameters', 'Arguments', 'Return'],
    emoji: '🧙',
    scene: 'academy',
    gradient: 'from-fuchsia-500 via-purple-600 to-indigo-700',
    accent: '#a855f7',
    pos: { x: 86, y: 20 },
    rewards: { xp: 250, coins: 120, stars: 3, badge: 'spellcaster' },
    story: {
      title: 'Graduation at the Wizard Academy',
      paragraphs: [
        'Elizabeth reaches the highest tower of the Wizard Academy. Here, spells are stored as reusable magic: define a spell once, then cast it any time by name.',
        'A stored, reusable block of code with a name is a FUNCTION. You can give it ingredients (parameters), and it can hand back a result (return).',
      ],
      mission: 'Help Elizabeth define her own spell, cast it with different ingredients, and catch what it returns.',
      objective: 'Create and call functions, pass arguments, and use the returned value.',
    },
    reflection: {
      experienced:
        'You wrote a spell once and gave it a name. Then you cast it many times, sometimes with different ingredients, and each time it did its job and handed you back a result you could use.',
      concept: {
        title: 'Functions',
        body: 'A FUNCTION is a named, reusable block of code. BUILT-IN functions come with Python (like print(), len(), int()). USER-DEFINED functions are ones you create with def. A PARAMETER is the ingredient name in the definition; the ARGUMENT is the real value you pass when you call it. RETURN hands a result back to whoever called the function so it can be used later.',
      },
      workflow: [
        { type: 'start', label: 'def cast_spell(power): 🪄' },
        { type: 'process', label: 'Call it with an argument: cast_spell(10)' },
        { type: 'process', label: 'Inside, do the magic with power' },
        { type: 'decision', label: 'Does it return a value?', yes: 'Catch it: result = cast_spell(10)', no: 'It just runs its actions' },
        { type: 'end', label: 'Reuse the spell any time ✨' },
      ],
      code: [
        { code: 'def cast_spell(power):', explain: 'def creates a USER-DEFINED function named cast_spell. "power" is a PARAMETER — a placeholder for the ingredient.' },
        { code: '    return power * 2', explain: 'RETURN hands a result back to the caller. Here it doubles the power and gives it back.' },
        { code: 'damage = cast_spell(10)', explain: 'CALLING the function. 10 is the ARGUMENT (the real value). The returned result (20) is stored in damage.' },
        { code: 'print(damage)', explain: 'print() is a BUILT-IN function. It shows 20 — the value the spell handed back.' },
      ],
      practice: {
        question: 'In  cast_spell(10) , what is the number 10 called?',
        options: ['A parameter', 'An argument', 'A return value'],
        answerIndex: 1,
        reveal:
          'Correct! The name in the definition (power) is the PARAMETER. The real value you pass in when calling (10) is the ARGUMENT. The function then RETURNS a result you can store and reuse. You are officially a Grand Wizard, Elizabeth! 🎓',
      },
    },
  },
]

export function getLevel(id) {
  return LEVELS.find((l) => l.id === Number(id))
}
