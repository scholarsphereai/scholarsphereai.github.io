// Import configuration
import { API_KEY, API_URL, MODEL_ID } from './modules/config.js';

// First, declare the state object
const state = {
    currentCourse: null,
    currentUnit: null,
    currentTopic: null,
    currentQuestions: [],
    timerInterval: null,
    examDuration: 90 * 60 // 90 minutes in seconds
};

// Then declare the apCoursesData object with all course data
const apCoursesData = {
    // Math & Science
    'calculus-ab': {
        name: '♾️ AP Calculus AB',
        description: 'Explore the concepts, methods, and applications of differential and integral calculus, including limits, derivatives, and integrals.',
        examFormat: 'Multiple Choice (45 questions, 50% of score) and Free Response (6 questions, 50% of score)',
        units: [
            {
                name: 'Unit 1: Limits and Continuity',
                topics: [
                    {
                        name: 'Understanding Limits',
                        subtopics: ['Intuitive Understanding of Limits', 'Formal Definition of Limits', 'One-sided Limits', 'Infinite Limits']
                    },
                    {
                        name: 'Estimating Limits from Graphs',
                        subtopics: ['Reading Limits from Graphs', 'Determining Existence of Limits', 'Analyzing Discontinuities', 'Graphical Interpretations']
                    },
                    {
                        name: 'Properties of Limits',
                        subtopics: ['Sum Rule', 'Product Rule', 'Quotient Rule', 'Squeeze Theorem', 'Composition of Functions']
                    },
                    {
                        name: 'Limits at Infinity',
                        subtopics: ['Horizontal Asymptotes', 'End Behavior', 'Limits of Rational Functions', 'Infinite Limits at Infinity']
                    },
                    {
                        name: 'Continuity',
                        subtopics: ['Definition of Continuity', 'Types of Discontinuities', 'Intermediate Value Theorem', 'Extreme Value Theorem']
                    }
                ]
            },
            {
                name: 'Unit 2: Differentiation: Definition and Fundamental Properties',
                topics: [
                    {
                        name: 'Definition of Derivative',
                        subtopics: ['Limit Definition', 'Rate of Change', 'Tangent Line Problem', 'Differentiability vs. Continuity']
                    },
                    {
                        name: 'Derivative at a Point',
                        subtopics: ['Instantaneous Rate of Change', 'Slope of Tangent Line', 'Numerical Approximation', 'Graphical Interpretation']
                    },
                    {
                        name: 'Derivative as a Function',
                        subtopics: ['Derivative Notation', 'Graphing Derivatives', 'Relationship Between f and f\'', 'Higher-Order Derivatives']
                    },
                    {
                        name: 'Second Derivatives',
                        subtopics: ['Acceleration', 'Concavity', 'Inflection Points', 'Second Derivative Test']
                    },
                    {
                        name: 'Applications of Derivatives',
                        subtopics: ['Motion Along a Line', 'Related Rates', 'Optimization', 'Linear Approximation']
                    }
                ]
            },
            {
                name: 'Unit 3: Applications of Differentiation',
                topics: ['Analyzing Functions', 'Linearization', 'Optimization Problems', 'Related Rates']
            },
            {
                name: 'Unit 4: Integration and Accumulation of Change',
                topics: ['Riemann Sums', 'Definite Integrals', 'Fundamental Theorem of Calculus', 'Antiderivatives', 'Integration Techniques']
            },
            {
                name: 'Unit 5: Differential Equations',
                topics: ['Slope Fields', 'Separable Differential Equations', 'Exponential Growth and Decay', 'Logistic Growth', 'Particular Solutions']
            },
            {
                name: 'Unit 6: Applications of Integration',
                topics: ['Area Between Curves', 'Volume of Solids', 'Arc Length', 'Average Value of a Function', 'Particle Motion']
            }
        ]
    },
    'calculus-bc': {
        name: '♾️ AP Calculus BC',
        description: 'Advanced exploration of calculus concepts including series, parametric equations, and polar functions.',
        examFormat: 'Multiple Choice (45 questions, 50% of score) and Free Response (6 questions, 50% of score)',
        units: [
            {
                name: 'Unit 1: Limits and Continuity',
                topics: ['Understanding Limits', 'Estimating Limits from Graphs', 'Properties of Limits', 'Limits at Infinity', 'Continuity']
            },
            {
                name: 'Unit 2: Differentiation: Definition and Fundamental Properties',
                topics: ['Definition of Derivative', 'Derivative at a Point', 'Derivative as a Function', 'Second Derivatives', 'Applications of Derivatives']
            },
            {
                name: 'Unit 3: Applications of Differentiation',
                topics: ['Analyzing Functions', 'Linearization', 'Optimization Problems', 'Related Rates']
            },
            {
                name: 'Unit 4: Integration and Accumulation of Change',
                topics: ['Definite Integrals', 'Fundamental Theorem of Calculus', 'Integration Techniques', 'Applications of Integrals']
            },
            {
                name: 'Unit 5: Differential Equations',
                topics: ['Modeling with Differential Equations', 'Solving Differential Equations', 'Slope Fields', 'Euler\'s Method']
            },
            {
                name: 'Unit 6: Applications of Integration',
                topics: ['Area Between Curves', 'Volume of Solids', 'Arc Length', 'Average Value of a Function']
            },
            {
                name: 'Unit 7: Parametric Equations, Polar Coordinates, and Vector-Valued Functions',
                topics: ['Parametric Equations', 'Polar Coordinates', 'Vector-Valued Functions', 'Motion in the Plane']
            },
            {
                name: 'Unit 8: Infinite Sequences and Series',
                topics: ['Convergence and Divergence', 'Power Series', 'Taylor Series', 'Maclaurin Series', 'Radius of Convergence']
            }
        ]
    },
    'statistics': {
        name: '📊 AP Statistics',
        description: 'Study of collecting, analyzing, and drawing conclusions from data.',
        examFormat: 'Multiple Choice (40 questions, 50% of score) and Free Response (6 questions, 50% of score)',
        units: [
            {
                name: 'Unit 1: Exploring One-Variable Data',
                topics: ['Representing Data', 'Describing Distributions', 'Measures of Center', 'Measures of Spread', 'Density Curves and Normal Distributions']
            },
            {
                name: 'Unit 2: Exploring Two-Variable Data',
                topics: ['Scatterplots', 'Correlation', 'Linear Regression', 'Residuals', 'Non-Linear Relationships']
            },
            {
                name: 'Unit 3: Collecting Data',
                topics: ['Planning Studies', 'Sampling Methods', 'Experimental Design', 'Random Assignment', 'Sources of Bias']
            },
            {
                name: 'Unit 4: Probability, Random Variables, and Probability Distributions',
                topics: ['Probability Rules', 'Random Variables', 'Binomial Distributions', 'Geometric Distributions', 'Sampling Distributions']
            },
            {
                name: 'Unit 5: Sampling Distributions',
                topics: ['Central Limit Theorem', 'Sampling Distribution of a Sample Mean', 'Sampling Distribution of a Sample Proportion', 'Simulation']
            },
            {
                name: 'Unit 6: Inference for Categorical Data: Proportions',
                topics: ['Confidence Intervals', 'Hypothesis Testing', 'Chi-Square Tests', 'Type I and Type II Errors']
            },
            {
                name: 'Unit 7: Inference for Quantitative Data: Means',
                topics: ['t-Distributions', 'Confidence Intervals', 'Hypothesis Testing', 'Two-Sample Tests']
            },
            {
                name: 'Unit 8: Inference for Categorical Data: Chi-Square',
                topics: ['Chi-Square Goodness of Fit', 'Chi-Square Test for Homogeneity', 'Chi-Square Test for Independence']
            },
            {
                name: 'Unit 9: Inference for Quantitative Data: Slopes',
                topics: ['Inference for Linear Regression', 'Confidence Intervals for Slopes', 'Hypothesis Testing for Slopes']
            }
        ]
    },
    'pre-calculus': {
        name: '📈 AP Pre-Calculus',
        description: 'Develop a deep understanding of functions and their behaviors, preparing for calculus and other college-level mathematics.',
        examFormat: 'Multiple Choice (40 questions, 50% of score) and Free Response (6 questions, 50% of score)',
        units: [
            {
                name: 'Unit 1: Functions',
                topics: ['Function Notation', 'Domain and Range', 'Transformations', 'Composition', 'Inverse Functions']
            },
            {
                name: 'Unit 2: Polynomial and Rational Functions',
                topics: ['Polynomial Functions', 'Rational Functions', 'End Behavior', 'Zeros and Factors', 'Asymptotes']
            },
            {
                name: 'Unit 3: Exponential and Logarithmic Functions',
                topics: ['Exponential Growth and Decay', 'Logarithmic Functions', 'Properties of Logarithms', 'Solving Exponential Equations']
            },
            {
                name: 'Unit 4: Trigonometric and Polar Functions',
                topics: ['Radian Measure', 'Unit Circle', 'Trigonometric Functions', 'Graphs of Trigonometric Functions', 'Polar Coordinates']
            },
            {
                name: 'Unit 5: Conic Sections and Parametric Equations',
                topics: ['Circles', 'Ellipses', 'Hyperbolas', 'Parabolas', 'Parametric Equations']
            },
            {
                name: 'Unit 6: Vectors, Matrices, and Systems',
                topics: ['Vectors', 'Matrices', 'Systems of Equations', 'Linear Transformations', 'Determinants']
            },
            {
                name: 'Unit 7: Sequences, Series, and Limits',
                topics: ['Arithmetic Sequences', 'Geometric Sequences', 'Series', 'Convergence', 'Introduction to Limits']
            }
        ]
    },
    'biology': {
        name: '🧬 AP Biology',
        description: 'Explore the principles of biology, including cell structure and function, genetics, and ecology.',
        examFormat: 'Multiple Choice (40 questions, 50% of score) and Free Response (6 questions, 50% of score)',
        units: [
            {
                name: 'Unit 1: Cell Structure and Function',
                topics: ['The Cell', 'Cell Membrane', 'Cell Organelles', 'Cell Division', 'Cell Communication']
            },
            {
                name: 'Unit 2: Genetics',
                topics: ['Mendelian Genetics', 'Sexual Reproduction', 'Genetic Variation', 'Genetic Disorders', 'Population Genetics']
            },
            {
                name: 'Unit 3: Ecology',
                topics: ['Ecosystems', 'Population Ecology', 'Community Ecology', 'Ecological Interactions', 'Conservation Biology']
            }
        ]
    },
    'chemistry': {
        name: '🧪 AP Chemistry',
        description: 'Explore the principles of chemistry, including atomic structure, chemical bonding, and reaction mechanisms.',
        examFormat: 'Multiple Choice (40 questions, 50% of score) and Free Response (6 questions, 50% of score)',
        units: [
            {
                name: 'Unit 1: Atomic Structure',
                topics: ['The Bohr Model', 'Quantum Mechanics', 'Electron Configuration', 'Periodic Trends', 'Atomic Mass']
            },
            {
                name: 'Unit 2: Chemical Bonding',
                topics: ['Covalent Bonds', 'Ionic Bonds', 'Metallic Bonds', 'Hydrogen Bonds', 'Van der Waals Forces']
            },
            {
                name: 'Unit 3: Reaction Mechanisms',
                topics: ['Rate Laws', 'Reaction Energy', 'Equilibrium', 'Catalysis', 'Enzyme Kinetics']
            }
        ]
    },
    'physics-1': {
        name: '🎡 AP Physics 1',
        description: 'Explore the principles of physics, including mechanics, waves, and thermodynamics.',
        examFormat: 'Multiple Choice (40 questions, 50% of score) and Free Response (6 questions, 50% of score)',
        units: [
            {
                name: 'Unit 1: Mechanics',
                topics: ['Kinematics', 'Dynamics', 'Newton\'s Laws', 'Work and Energy', 'Momentum and Collisions']
            },
            {
                name: 'Unit 2: Waves',
                topics: ['Wave Characteristics', 'Wave Interference', 'Wave Diffraction', 'Wave Polarization', 'Wave Interactions']
            },
            {
                name: 'Unit 3: Thermodynamics',
                topics: ['Thermal Expansion', 'Heat Transfer', 'First Law of Thermodynamics', 'Second Law of Thermodynamics', 'Thermodynamics of Ideal Gases']
            }
        ]
    },
    'physics-2': {
        name: '🧲 AP Physics 2',
        description: 'Explore the principles of physics, including electricity and magnetism, and modern physics.',
        examFormat: 'Multiple Choice (40 questions, 50% of score) and Free Response (6 questions, 50% of score)',
        units: [
            {
                name: 'Unit 1: Electricity and Magnetism',
                topics: ['Electric Fields', 'Electric Potential', 'Capacitance', 'Current and Resistance', 'Magnetic Fields']
            },
            {
                name: 'Unit 2: Modern Physics',
                topics: ['Relativity', 'Quantum Mechanics', 'Atomic Structure', 'Nuclear Physics', 'Particle Physics']
            }
        ]
    },
    'physics-c-mechanics': {
        name: '⚙️ AP Physics C: Mechanics',
        description: 'Advanced study of mechanics, including dynamics, rotational motion, and oscillations.',
        examFormat: 'Multiple Choice (45 questions, 50% of score) and Free Response (6 questions, 50% of score)',
        units: [
            {
                name: 'Unit 1: Dynamics',
                topics: ['Newton\'s Laws', 'Conservation Laws', 'Momentum and Impulse', 'Energy and Work', 'Rotational Motion']
            },
            {
                name: 'Unit 2: Oscillations and Waves',
                topics: ['Simple Harmonic Motion', 'Damped Oscillations', 'Forced Oscillations', 'Resonance', 'Wave Motion']
            },
            {
                name: 'Unit 3: Rotational Dynamics',
                topics: ['Angular Momentum', 'Torque', 'Rolling Motion', 'Gyroscope and Precession', 'Dynamics of Rigid Bodies']
            }
        ]
    },
    'physics-c-electricity': {
        name: '💡 AP Physics C: E&M',
        description: 'Advanced study of electricity and magnetism, including electric circuits, electromagnetic waves, and Maxwell\'s equations.',
        examFormat: 'Multiple Choice (45 questions, 50% of score) and Free Response (6 questions, 50% of score)',
        units: [
            {
                name: 'Unit 1: Electric Circuits',
                topics: ['Ohm\'s Law', 'Kirchhoff\'s Laws', 'Resistors in Series and Parallel', 'Capacitors and Inductors', 'RC and RL Circuits']
            },
            {
                name: 'Unit 2: Electromagnetic Waves',
                topics: ['Maxwell\'s Equations', 'Electromagnetic Waves', 'Polarization', 'Reflection and Refraction', 'Diffraction and Interference']
            },
            {
                name: 'Unit 3: Electric and Magnetic Fields',
                topics: ['Electric Fields', 'Electric Potential', 'Capacitance', 'Current and Resistance', 'Magnetic Fields']
            }
        ]
    },
    'environmental-science': {
        name: '♻️ AP Environmental Science',
        description: 'Explore the principles of environmental science, including ecosystems, human impact, and sustainability.',
        examFormat: 'Multiple Choice (40 questions, 50% of score) and Free Response (6 questions, 50% of score)',
        units: [
            {
                name: 'Unit 1: Ecosystems',
                topics: ['Ecosystems and Their Services', 'Population Dynamics', 'Biodiversity', 'Ecological Interactions', 'Conservation Biology']
            },
            {
                name: 'Unit 2: Human Impact',
                topics: ['Population Growth', 'Resource Use', 'Pollution', 'Climate Change', 'Sustainable Development']
            },
            {
                name: 'Unit 3: Sustainability',
                topics: ['Ecological Footprint', 'Sustainable Practices', 'Global Warming', 'Biodiversity Loss', 'Environmental Justice']
            }
        ]
    },
    'computer-science-a': {
        name: '💻 AP Computer Science A',
        description: 'Explore the principles of computer science, including programming, data structures, and algorithms.',
        examFormat: 'Multiple Choice (40 questions, 50% of score) and Free Response (6 questions, 50% of score)',
        units: [
            {
                name: 'Unit 1: Introduction to Computer Science',
                topics: ['What is Computer Science?', 'Programming Basics', 'Data Types and Variables', 'Control Structures', 'Functions']
            },
            {
                name: 'Unit 2: Data Structures',
                topics: ['Arrays', 'Linked Lists', 'Stacks', 'Queues', 'Trees and Graphs']
            },
            {
                name: 'Unit 3: Algorithms',
                topics: ['Sorting Algorithms', 'Searching Algorithms', 'Recursion', 'Dynamic Programming', 'Graph Algorithms']
            },
            {
                name: 'Unit 4: Object-Oriented Programming',
                topics: ['Classes and Objects', 'Inheritance', 'Polymorphism', 'Encapsulation', 'Abstract Classes and Interfaces']
            },
            {
                name: 'Unit 5: Software Development',
                topics: ['Agile Methodologies', 'Version Control Systems', 'Software Testing', 'Debugging', 'Software Documentation']
            }
        ]
    },
    'computer-science-principles': {
        name: '⌨️ AP Computer Science P',
        description: 'Explore the principles of computer science, including programming, data structures, and algorithms.',
        examFormat: 'Multiple Choice (40 questions, 50% of score) and Free Response (6 questions, 50% of score)',
        units: [
            {
                name: 'Unit 1: Introduction to Computer Science',
                topics: ['What is Computer Science?', 'Programming Basics', 'Data Types and Variables', 'Control Structures', 'Functions']
            },
            {
                name: 'Unit 2: Data Structures',
                topics: ['Arrays', 'Linked Lists', 'Stacks', 'Queues', 'Trees and Graphs']
            },
            {
                name: 'Unit 3: Algorithms',
                topics: ['Sorting Algorithms', 'Searching Algorithms', 'Recursion', 'Dynamic Programming', 'Graph Algorithms']
            },
            {
                name: 'Unit 4: Object-Oriented Programming',
                topics: ['Classes and Objects', 'Inheritance', 'Polymorphism', 'Encapsulation', 'Abstract Classes and Interfaces']
            },
            {
                name: 'Unit 5: Software Development',
                topics: ['Agile Methodologies', 'Version Control Systems', 'Software Testing', 'Debugging', 'Software Documentation']
            }
        ]
    },

    // Language & Literature
    'english-language': {
        name: '✍🏽 AP English Language',
        description: 'Develop critical reading and writing skills through analysis of nonfiction texts, rhetorical strategies, and argumentative writing.',
        examFormat: 'Multiple Choice (45 questions, 45% of score) and Free Response (3 essays, 55% of score)',
        units: [
            {
                name: 'Unit 1: Rhetorical Analysis',
                topics: [
                    {
                        name: 'Introduction to Rhetoric',
                        subtopics: ['Rhetorical Situation', 'Appeals (Ethos, Pathos, Logos)', 'Rhetorical Triangle', 'SOAPSTone Analysis', 'Rhetorical Précis']
                    },
                    {
                        name: 'Rhetorical Modes',
                        subtopics: ['Narration', 'Description', 'Exposition', 'Argumentation', 'Persuasion']
                    },
                    {
                        name: 'Claims and Evidence',
                        subtopics: ['Types of Claims', 'Supporting Evidence', 'Qualifying Claims', 'Counterarguments', 'Concessions']
                    },
                    {
                        name: 'Analyzing Style',
                        subtopics: ['Diction and Word Choice', 'Syntax and Sentence Structure', 'Tone and Attitude', 'Imagery and Figurative Language', 'Point of View']
                    },
                    {
                        name: 'Rhetorical Analysis Essay',
                        subtopics: ['Essay Structure', 'Thesis Development', 'Evidence Selection', 'Commentary Techniques', 'Conclusion Strategies']
                    }
                ]
            },
            {
                name: 'Unit 2: Argument',
                topics: [
                    {
                        name: 'Elements of Argument',
                        subtopics: ['Toulmin Model', 'Rogerian Argument', 'Classical Argument', 'Inductive vs. Deductive Reasoning', 'Logical Fallacies']
                    },
                    {
                        name: 'Types of Evidence',
                        subtopics: ['Statistical Evidence', 'Expert Testimony', 'Anecdotal Evidence', 'Historical Examples', 'Analogies']
                    },
                    {
                        name: 'Developing Arguments',
                        subtopics: ['Claim Formulation', 'Evidence Integration', 'Warrant Development', 'Addressing Counterarguments', 'Qualifying Claims']
                    },
                    {
                        name: 'Argumentative Strategies',
                        subtopics: ['Cause and Effect', 'Compare and Contrast', 'Problem-Solution', 'Definition', 'Classification']
                    },
                    {
                        name: 'Argumentative Essay',
                        subtopics: ['Thesis Construction', 'Evidence Selection', 'Organization Patterns', 'Counterargument Integration', 'Effective Conclusions']
                    }
                ]
            },
            {
                name: 'Unit 3: Synthesis',
                topics: [
                    {
                        name: 'Synthesis Basics',
                        subtopics: ['Source Evaluation', 'Source Integration', 'Synthesizing Multiple Perspectives', 'Developing Original Arguments', 'Addressing Complexity']
                    },
                    {
                        name: 'Working with Sources',
                        subtopics: ['Summarizing Sources', 'Paraphrasing Effectively', 'Quoting Appropriately', 'Attributing Sources', 'Avoiding Plagiarism']
                    },
                    {
                        name: 'Visual Analysis',
                        subtopics: ['Analyzing Images', 'Charts and Graphs', 'Political Cartoons', 'Advertisements', 'Multimedia Sources']
                    },
                    {
                        name: 'Source Evaluation',
                        subtopics: ['Credibility Assessment', 'Bias Recognition', 'Currency and Relevance', 'Purpose Analysis', 'Audience Consideration']
                    },
                    {
                        name: 'Synthesis Essay',
                        subtopics: ['Thesis Development', 'Source Integration', 'Organization Strategies', 'Commentary on Sources', 'Addressing Multiple Viewpoints']
                    }
                ]
            },
            {
                name: 'Unit 4: Style Analysis',
                topics: [
                    {
                        name: 'Diction and Syntax',
                        subtopics: ['Formal vs. Informal Diction', 'Connotation and Denotation', 'Sentence Variety', 'Parallelism', 'Sentence Fragments and Run-ons']
                    },
                    {
                        name: 'Figurative Language',
                        subtopics: ['Metaphor and Simile', 'Personification', 'Hyperbole', 'Irony and Satire', 'Symbolism']
                    },
                    {
                        name: 'Tone and Voice',
                        subtopics: ['Author\'s Attitude', 'Establishing Voice', 'Shifts in Tone', 'Objective vs. Subjective Tone', 'Formal vs. Informal Voice']
                    },
                    {
                        name: 'Rhetorical Devices',
                        subtopics: ['Anaphora and Repetition', 'Antithesis', 'Chiasmus', 'Allusion', 'Rhetorical Questions']
                    },
                    {
                        name: 'Style Analysis Essay',
                        subtopics: ['Identifying Stylistic Elements', 'Analyzing Effect on Audience', 'Connecting Style to Purpose', 'Evaluating Effectiveness', 'Writing About Style']
                    }
                ]
            },
            {
                name: 'Unit 5: Argument Development',
                topics: [
                    {
                        name: 'Thesis Development',
                        subtopics: ['Creating Arguable Claims', 'Narrowing Topics', 'Qualifying Thesis Statements', 'Thesis Placement', 'Implied vs. Stated Thesis']
                    },
                    {
                        name: 'Organization Strategies',
                        subtopics: ['Classical Structure', 'Problem-Solution', 'Comparative', 'Chronological', 'Spatial']
                    },
                    {
                        name: 'Introductions and Conclusions',
                        subtopics: ['Hook Strategies', 'Contextualizing the Argument', 'Thesis Placement', 'Concluding Techniques', 'Framing Devices']
                    },
                    {
                        name: 'Transitions and Coherence',
                        subtopics: ['Transitional Phrases', 'Paragraph Cohesion', 'Topic Sentences', 'Idea Progression', 'Maintaining Focus']
                    },
                    {
                        name: 'Revision Strategies',
                        subtopics: ['Global Revision', 'Local Editing', 'Peer Review', 'Self-Assessment', 'Rubric-Based Revision']
                    }
                ]
            },
            {
                name: 'Unit 6: Source Evaluation',
                topics: [
                    {
                        name: 'Evaluating Credibility',
                        subtopics: ['Author Credentials', 'Publication Reputation', 'Currency', 'Accuracy', 'Purpose']
                    },
                    {
                        name: 'Identifying Bias',
                        subtopics: ['Political Bias', 'Cultural Bias', 'Confirmation Bias', 'Selection Bias', 'Framing Bias']
                    },
                    {
                        name: 'Types of Sources',
                        subtopics: ['Primary vs. Secondary', 'Scholarly vs. Popular', 'News Sources', 'Government Documents', 'Digital Media']
                    },
                    {
                        name: 'Source Integration',
                        subtopics: ['Signal Phrases', 'Direct Quotation', 'Paraphrasing', 'Summarizing', 'Commentary on Sources']
                    },
                    {
                        name: 'Documentation',
                        subtopics: ['MLA Format', 'In-text Citations', 'Works Cited', 'Avoiding Plagiarism', 'Ethical Use of Sources']
                    }
                ]
            },
            {
                name: 'Unit 7: Effective Language Use',
                topics: [
                    {
                        name: 'Grammar and Mechanics',
                        subtopics: ['Subject-Verb Agreement', 'Pronoun Reference', 'Modifier Placement', 'Parallel Structure', 'Punctuation']
                    },
                    {
                        name: 'Concision and Clarity',
                        subtopics: ['Eliminating Wordiness', 'Active vs. Passive Voice', 'Precise Word Choice', 'Sentence Combining', 'Paragraph Unity']
                    },
                    {
                        name: 'Style and Voice',
                        subtopics: ['Developing Personal Style', 'Adapting to Audience', 'Formal vs. Informal Register', 'Consistency in Voice', 'Stylistic Maturity']
                    },
                    {
                        name: 'Rhetorical Grammar',
                        subtopics: ['Sentence Fragments for Effect', 'Intentional Repetition', 'Sentence Variety for Emphasis', 'Punctuation for Rhetorical Effect', 'Syntactic Manipulation']
                    },
                    {
                        name: 'Editing Strategies',
                        subtopics: ['Proofreading Techniques', 'Common Error Patterns', 'Peer Editing', 'Using Style Guides', 'Digital Editing Tools']
                    }
                ]
            },
            {
                name: 'Unit 8: Exam Preparation',
                topics: [
                    {
                        name: 'Multiple Choice Strategies',
                        subtopics: ['Question Types', 'Process of Elimination', 'Time Management', 'Annotating Passages', 'Identifying Patterns']
                    },
                    {
                        name: 'Rhetorical Analysis Essay Practice',
                        subtopics: ['Analyzing Prompts', 'Identifying Rhetorical Strategies', 'Organizing Analysis', 'Evidence Selection', 'Timed Writing']
                    },
                    {
                        name: 'Argument Essay Practice',
                        subtopics: ['Developing Claims', 'Supporting with Evidence', 'Addressing Counterarguments', 'Organizing Arguments', 'Timed Writing']
                    },
                    {
                        name: 'Synthesis Essay Practice',
                        subtopics: ['Source Analysis', 'Source Integration', 'Developing Original Arguments', 'Organizing Synthesis', 'Timed Writing']
                    },
                    {
                        name: 'Test-Taking Strategies',
                        subtopics: ['Time Management', 'Essay Planning', 'Stress Management', 'Self-Assessment', 'Post-Exam Review']
                    }
                ]
            }
        ]
    },
    'english-literature': {
        name: '📚 AP English Literature',
        description: 'Engage with literary works from various genres and periods, developing skills in close reading, analysis, interpretation, and writing.',
        examFormat: 'Multiple Choice (55 questions, 45% of score) and Free Response (3 essays, 55% of score)',
        units: [
            {
                name: 'Unit 1: Short Fiction',
                topics: [
                    {
                        name: 'Elements of Fiction',
                        subtopics: ['Plot Structure', 'Character Development', 'Setting and Atmosphere', 'Point of View', 'Theme and Motif']
                    },
                    {
                        name: 'Narrative Perspective',
                        subtopics: ['First-Person Narration', 'Third-Person Limited', 'Third-Person Omniscient', 'Unreliable Narrator', 'Multiple Perspectives']
                    },
                    {
                        name: 'Setting and Context',
                        subtopics: ['Physical Setting', 'Historical Context', 'Cultural Context', 'Social Environment', 'Atmosphere and Mood']
                    },
                    {
                        name: 'Characterization',
                        subtopics: ['Direct vs. Indirect Characterization', 'Static vs. Dynamic Characters', 'Flat vs. Round Characters', 'Character Motivation', 'Character Relationships']
                    },
                    {
                        name: 'Short Story Analysis',
                        subtopics: ['Close Reading Techniques', 'Annotating Text', 'Identifying Literary Elements', 'Analyzing Theme Development', 'Writing Analytical Responses']
                    }
                ]
            },
            {
                name: 'Unit 2: Poetry',
                topics: [
                    {
                        name: 'Poetic Structure',
                        subtopics: ['Meter and Rhythm', 'Rhyme Schemes', 'Stanza Forms', 'Free Verse', 'Formal Verse']
                    },
                    {
                        name: 'Poetic Devices',
                        subtopics: ['Imagery', 'Metaphor and Simile', 'Symbolism', 'Alliteration and Assonance', 'Personification']
                    },
                    {
                        name: 'Types of Poetry',
                        subtopics: ['Sonnet', 'Lyric Poetry', 'Narrative Poetry', 'Dramatic Monologue', 'Epic Poetry']
                    },
                    {
                        name: 'Poetic Voice and Tone',
                        subtopics: ['Speaker vs. Poet', 'Tone and Mood', 'Irony', 'Diction and Word Choice', 'Shifts in Tone']
                    },
                    {
                        name: 'Poetry Analysis',
                        subtopics: ['TPCASTT Method', 'Scansion', 'Analyzing Figurative Language', 'Interpreting Meaning', 'Writing About Poetry']
                    }
                ]
            },
            {
                name: 'Unit 3: Longer Fiction',
                topics: [
                    {
                        name: 'Novel Structure',
                        subtopics: ['Exposition, Rising Action, Climax', 'Chapters and Divisions', 'Narrative Arcs', 'Subplots', 'Resolution and Denouement']
                    },
                    {
                        name: 'Character Development',
                        subtopics: ['Protagonist and Antagonist', 'Character Arcs', 'Foils and Doubles', 'Stock Characters', 'Complex Characters']
                    },
                    {
                        name: 'Setting and Atmosphere',
                        subtopics: ['World Building', 'Time Period', 'Geographic Location', 'Social Environment', 'Symbolic Settings']
                    },
                    {
                        name: 'Theme Development',
                        subtopics: ['Central Themes', 'Motifs and Symbols', 'Universal Themes', 'Social Commentary', 'Philosophical Questions']
                    },
                    {
                        name: 'Novel Analysis',
                        subtopics: ['Tracking Character Development', 'Analyzing Plot Structure', 'Identifying Themes', 'Examining Style and Tone', 'Writing About Novels']
                    }
                ]
            },
            {
                name: 'Unit 4: Drama',
                topics: [
                    {
                        name: 'Elements of Drama',
                        subtopics: ['Dialogue', 'Stage Directions', 'Acts and Scenes', 'Dramatic Structure', 'Performance Elements']
                    },
                    {
                        name: 'Dramatic Techniques',
                        subtopics: ['Soliloquy and Monologue', 'Aside', 'Dramatic Irony', 'Foreshadowing', 'Catharsis']
                    },
                    {
                        name: 'Character and Conflict',
                        subtopics: ['Tragic Hero', 'Comic Characters', 'Internal Conflict', 'External Conflict', 'Character Motivation']
                    },
                    {
                        name: 'Types of Drama',
                        subtopics: ['Tragedy', 'Comedy', 'Tragicomedy', 'Historical Drama', 'Modern Drama']
                    },
                    {
                        name: 'Drama Analysis',
                        subtopics: ['Reading Drama as Literature', 'Analyzing Dialogue', 'Interpreting Stage Directions', 'Examining Dramatic Structure', 'Writing About Plays']
                    }
                ]
            },
            {
                name: 'Unit 5: Literary Argument',
                topics: [
                    {
                        name: 'Thesis Development',
                        subtopics: ['Creating Arguable Claims', 'Focusing on Literary Elements', 'Developing Complex Theses', 'Addressing Ambiguity', 'Thesis Placement']
                    },
                    {
                        name: 'Textual Evidence',
                        subtopics: ['Selecting Relevant Quotations', 'Integrating Evidence', 'Analyzing Key Passages', 'Addressing Multiple Interpretations', 'Avoiding Plot Summary']
                    },
                    {
                        name: 'Literary Analysis',
                        subtopics: ['Close Reading', 'Analyzing Literary Techniques', 'Examining Structure', 'Interpreting Symbolism', 'Connecting to Themes']
                    },
                    {
                        name: 'Organization Strategies',
                        subtopics: ['Introduction Techniques', 'Body Paragraph Structure', 'Topic Sentences', 'Transitions', 'Conclusion Strategies']
                    },
                    {
                        name: 'Literary Argument Essay',
                        subtopics: ['Responding to Prompts', 'Developing Arguments', 'Supporting with Evidence', 'Addressing Complexity', 'Revision Strategies']
                    }
                ]
            },
            {
                name: 'Unit 6: Literary Contexts',
                topics: [
                    {
                        name: 'Historical Context',
                        subtopics: ['Historical Events', 'Social Movements', 'Political Climate', 'Cultural Norms', 'Historical Allusions']
                    },
                    {
                        name: 'Literary Movements',
                        subtopics: ['Romanticism', 'Realism and Naturalism', 'Modernism', 'Postmodernism', 'Contemporary Literature']
                    },
                    {
                        name: 'Cultural Perspectives',
                        subtopics: ['Cultural Values', 'Social Hierarchies', 'Gender Roles', 'Race and Ethnicity', 'Religious Influences']
                    },
                    {
                        name: 'Intertextuality',
                        subtopics: ['Allusions', 'Adaptations', 'Influence and Homage', 'Parody and Satire', 'Literary Traditions']
                    },
                    {
                        name: 'Contextual Analysis',
                        subtopics: ['Connecting Text to Context', 'Analyzing Historical Influence', 'Examining Cultural Impact', 'Recognizing Literary Traditions', 'Writing About Context']
                    }
                ]
            },
            {
                name: 'Unit 7: Literary Criticism',
                topics: [
                    {
                        name: 'Critical Approaches',
                        subtopics: ['Formalism', 'Historical/Biographical', 'Psychological', 'Feminist', 'Marxist']
                    },
                    {
                        name: 'Reader Response',
                        subtopics: ['Personal Response', 'Interpretive Communities', 'Aesthetic Response', 'Ethical Criticism', 'Affective Criticism']
                    },
                    {
                        name: 'Deconstructionism',
                        subtopics: ['Binary Oppositions', 'Textual Contradictions', 'Questioning Assumptions', 'Indeterminacy of Meaning', 'Linguistic Analysis']
                    },
                    {
                        name: 'Cultural Criticism',
                        subtopics: ['Postcolonial Criticism', 'New Historicism', 'Gender Studies', 'Race and Ethnicity Studies', 'Queer Theory']
                    },
                    {
                        name: 'Applying Critical Lenses',
                        subtopics: ['Selecting Appropriate Approaches', 'Analyzing from Multiple Perspectives', 'Evaluating Critical Interpretations', 'Synthesizing Viewpoints', 'Writing Critical Analysis']
                    }
                ]
            },
            {
                name: 'Unit 8: Exam Preparation',
                topics: [
                    {
                        name: 'Multiple Choice Strategies',
                        subtopics: ['Close Reading Techniques', 'Process of Elimination', 'Time Management', 'Question Types', 'Passage Analysis']
                    },
                    {
                        name: 'Poetry Essay',
                        subtopics: ['Analyzing Poetic Elements', 'Interpreting Meaning', 'Organizing Analysis', 'Connecting Form and Content', 'Timed Writing']
                    },
                    {
                        name: 'Prose Essay',
                        subtopics: ['Analyzing Narrative Elements', 'Examining Style and Tone', 'Interpreting Character', 'Analyzing Passages', 'Timed Writing']
                    },
                    {
                        name: 'Open Question Essay',
                        subtopics: ['Selecting Appropriate Texts', 'Developing Literary Arguments', 'Addressing Thematic Questions', 'Comparative Analysis', 'Timed Writing']
                    },
                    {
                        name: 'Test-Taking Strategies',
                        subtopics: ['Time Management', 'Essay Planning', 'Stress Management', 'Self-Assessment', 'Post-Exam Review']
                    }
                ]
            }
        ]
    },
    'spanish-language': {
        name: '🇪🇸 AP Spanish Language',
        description: 'Develop reading and writing skills in Spanish, focusing on grammar, vocabulary, and cultural context.',
        examFormat: 'Multiple Choice (45 questions, 45% of score) and Free Response (3 essays, 55% of score)',
        units: [
            {
                name: 'Unit 1: Grammar and Vocabulary',
                topics: ['Spanish Grammar Basics', 'Spanish Verb Tenses', 'Spanish Nouns and Adjectives', 'Spanish Adverbs and Prepositions', 'Spanish Pronunciation']
            },
            {
                name: 'Unit 2: Reading and Comprehension',
                topics: ['Spanish Reading Skills', 'Analyzing Cultural Context', 'Understanding Social Issues', 'Reading for Information', 'Reading for Entertainment']
            },
            {
                name: 'Unit 3: Writing and Composition',
                topics: ['Spanish Essay Writing', 'Spanish Report Writing', 'Spanish Creative Writing', 'Spanish Business Writing', 'Spanish Technical Writing']
            },
            {
                name: 'Unit 4: Listening and Speaking',
                topics: ['Spanish Listening Skills', 'Spanish Speaking Skills', 'Spanish Pronunciation Practice', 'Spanish Cultural Etiquette', 'Spanish Interpersonal Communication']
            },
            {
                name: 'Unit 5: Exam Preparation',
                topics: ['Multiple Choice Strategies', 'Essay Writing Practice', 'Speaking Practice', 'Listening Practice', 'Reading Practice']
            }
        ]
    },
    'spanish-literature': {
        name: '💃🏽 AP Spanish Literature',
        description: 'Engage with Spanish literature from various periods and genres, developing skills in close reading, analysis, interpretation, and writing.',
        examFormat: 'Multiple Choice (55 questions, 45% of score) and Free Response (3 essays, 55% of score)',
        units: [
            {
                name: 'Unit 1: Short Stories',
                topics: [
                    {
                        name: 'Spanish Short Story Elements',
                        subtopics: ['Plot Structure', 'Character Development', 'Setting and Atmosphere', 'Point of View', 'Theme and Motif']
                    },
                    {
                        name: 'Narrative Perspective',
                        subtopics: ['First-Person Narration', 'Third-Person Limited', 'Third-Person Omniscient', 'Unreliable Narrator', 'Multiple Perspectives']
                    },
                    {
                        name: 'Setting and Context',
                        subtopics: ['Physical Setting', 'Historical Context', 'Cultural Context', 'Social Environment', 'Atmosphere and Mood']
                    },
                    {
                        name: 'Characterization',
                        subtopics: ['Direct vs. Indirect Characterization', 'Static vs. Dynamic Characters', 'Flat vs. Round Characters', 'Character Motivation', 'Character Relationships']
                    },
                    {
                        name: 'Short Story Analysis',
                        subtopics: ['Close Reading Techniques', 'Annotating Text', 'Identifying Literary Elements', 'Analyzing Theme Development', 'Writing Analytical Responses']
                    }
                ]
            },
            {
                name: 'Unit 2: Poetry',
                topics: [
                    {
                        name: 'Spanish Poetry Structure',
                        subtopics: ['Meter and Rhythm', 'Rhyme Schemes', 'Stanza Forms', 'Free Verse', 'Formal Verse']
                    },
                    {
                        name: 'Poetic Devices',
                        subtopics: ['Imagery', 'Metaphor and Simile', 'Symbolism', 'Alliteration and Assonance', 'Personification']
                    },
                    {
                        name: 'Types of Poetry',
                        subtopics: ['Sonnet', 'Lyric Poetry', 'Narrative Poetry', 'Dramatic Monologue', 'Epic Poetry']
                    },
                    {
                        name: 'Poetic Voice and Tone',
                        subtopics: ['Speaker vs. Poet', 'Tone and Mood', 'Irony', 'Diction and Word Choice', 'Shifts in Tone']
                    },
                    {
                        name: 'Poetry Analysis',
                        subtopics: ['TPCASTT Method', 'Scansion', 'Analyzing Figurative Language', 'Interpreting Meaning', 'Writing About Poetry']
                    }
                ]
            },
            {
                name: 'Unit 3: Longer Fiction',
                topics: [
                    {
                        name: 'Spanish Novel Structure',
                        subtopics: ['Exposition, Rising Action, Climax', 'Chapters and Divisions', 'Narrative Arcs', 'Subplots', 'Resolution and Denouement']
                    },
                    {
                        name: 'Character Development',
                        subtopics: ['Protagonist and Antagonist', 'Character Arcs', 'Foils and Doubles', 'Stock Characters', 'Complex Characters']
                    },
                    {
                        name: 'Setting and Atmosphere',
                        subtopics: ['World Building', 'Time Period', 'Geographic Location', 'Social Environment', 'Symbolic Settings']
                    },
                    {
                        name: 'Theme Development',
                        subtopics: ['Central Themes', 'Motifs and Symbols', 'Universal Themes', 'Social Commentary', 'Philosophical Questions']
                    },
                    {
                        name: 'Novel Analysis',
                        subtopics: ['Tracking Character Development', 'Analyzing Plot Structure', 'Identifying Themes', 'Examining Style and Tone', 'Writing About Novels']
                    }
                ]
            },
            {
                name: 'Unit 4: Drama',
                topics: [
                    {
                        name: 'Spanish Drama Elements',
                        subtopics: ['Dialogue', 'Stage Directions', 'Acts and Scenes', 'Dramatic Structure', 'Performance Elements']
                    },
                    {
                        name: 'Dramatic Techniques',
                        subtopics: ['Soliloquy and Monologue', 'Aside', 'Dramatic Irony', 'Foreshadowing', 'Catharsis']
                    },
                    {
                        name: 'Character and Conflict',
                        subtopics: ['Tragic Hero', 'Comic Characters', 'Internal Conflict', 'External Conflict', 'Character Motivation']
                    },
                    {
                        name: 'Types of Drama',
                        subtopics: ['Tragedy', 'Comedy', 'Tragicomedy', 'Historical Drama', 'Modern Drama']
                    },
                    {
                        name: 'Drama Analysis',
                        subtopics: ['Reading Drama as Literature', 'Analyzing Dialogue', 'Interpreting Stage Directions', 'Examining Dramatic Structure', 'Writing About Plays']
                    }
                ]
            },
            {
                name: 'Unit 5: Literary Argument',
                topics: [
                    {
                        name: 'Thesis Development',
                        subtopics: ['Creating Arguable Claims', 'Focusing on Literary Elements', 'Developing Complex Theses', 'Addressing Ambiguity', 'Thesis Placement']
                    },
                    {
                        name: 'Textual Evidence',
                        subtopics: ['Selecting Relevant Quotations', 'Integrating Evidence', 'Analyzing Key Passages', 'Addressing Multiple Interpretations', 'Avoiding Plot Summary']
                    },
                    {
                        name: 'Literary Analysis',
                        subtopics: ['Close Reading', 'Analyzing Literary Techniques', 'Examining Structure', 'Interpreting Symbolism', 'Connecting to Themes']
                    },
                    {
                        name: 'Organization Strategies',
                        subtopics: ['Introduction Techniques', 'Body Paragraph Structure', 'Topic Sentences', 'Transitions', 'Conclusion Strategies']
                    },
                    {
                        name: 'Literary Argument Essay',
                        subtopics: ['Responding to Prompts', 'Developing Arguments', 'Supporting with Evidence', 'Addressing Complexity', 'Revision Strategies']
                    }
                ]
            },
            {
                name: 'Unit 6: Literary Contexts',
                topics: [
                    {
                        name: 'Historical Context',
                        subtopics: ['Historical Events', 'Social Movements', 'Political Climate', 'Cultural Norms', 'Historical Allusions']
                    },
                    {
                        name: 'Literary Movements',
                        subtopics: ['Romanticism', 'Realism and Naturalism', 'Modernism', 'Postmodernism', 'Contemporary Literature']
                    },
                    {
                        name: 'Cultural Perspectives',
                        subtopics: ['Cultural Values', 'Social Hierarchies', 'Gender Roles', 'Race and Ethnicity', 'Religious Influences']
                    },
                    {
                        name: 'Intertextuality',
                        subtopics: ['Allusions', 'Adaptations', 'Influence and Homage', 'Parody and Satire', 'Literary Traditions']
                    },
                    {
                        name: 'Contextual Analysis',
                        subtopics: ['Connecting Text to Context', 'Analyzing Historical Influence', 'Examining Cultural Impact', 'Recognizing Literary Traditions', 'Writing About Context']
                    }
                ]
            },
            {
                name: 'Unit 7: Literary Criticism',
                topics: [
                    {
                        name: 'Critical Approaches',
                        subtopics: ['Formalism', 'Historical/Biographical', 'Psychological', 'Feminist', 'Marxist']
                    },
                    {
                        name: 'Reader Response',
                        subtopics: ['Personal Response', 'Interpretive Communities', 'Aesthetic Response', 'Ethical Criticism', 'Affective Criticism']
                    },
                    {
                        name: 'Deconstructionism',
                        subtopics: ['Binary Oppositions', 'Textual Contradictions', 'Questioning Assumptions', 'Indeterminacy of Meaning', 'Linguistic Analysis']
                    },
                    {
                        name: 'Cultural Criticism',
                        subtopics: ['Postcolonial Criticism', 'New Historicism', 'Gender Studies', 'Race and Ethnicity Studies', 'Queer Theory']
                    },
                    {
                        name: 'Applying Critical Lenses',
                        subtopics: ['Selecting Appropriate Approaches', 'Analyzing from Multiple Perspectives', 'Evaluating Critical Interpretations', 'Synthesizing Viewpoints', 'Writing Critical Analysis']
                    }
                ]
            },
            {
                name: 'Unit 8: Exam Preparation',
                topics: [
                    {
                        name: 'Multiple Choice Strategies',
                        subtopics: ['Close Reading Techniques', 'Process of Elimination', 'Time Management', 'Question Types', 'Passage Analysis']
                    },
                    {
                        name: 'Poetry Essay',
                        subtopics: ['Analyzing Poetic Elements', 'Interpreting Meaning', 'Organizing Analysis', 'Connecting Form and Content', 'Timed Writing']
                    },
                    {
                        name: 'Prose Essay',
                        subtopics: ['Analyzing Narrative Elements', 'Examining Style and Tone', 'Interpreting Character', 'Analyzing Passages', 'Timed Writing']
                    },
                    {
                        name: 'Open Question Essay',
                        subtopics: ['Selecting Appropriate Texts', 'Developing Literary Arguments', 'Addressing Thematic Questions', 'Comparative Analysis', 'Timed Writing']
                    },
                    {
                        name: 'Test-Taking Strategies',
                        subtopics: ['Time Management', 'Essay Planning', 'Stress Management', 'Self-Assessment', 'Post-Exam Review']
                    }
                ]
            }
        ]
    },
    'french-language': {
        name: '🇫🇷 AP French',
        description: 'Develop reading and writing skills in French, focusing on grammar, vocabulary, and cultural context.',
        examFormat: 'Multiple Choice (45 questions, 45% of score) and Free Response (3 essays, 55% of score)',
        units: [
            {
                name: 'Unit 1: Grammar and Vocabulary',
                topics: ['French Grammar Basics', 'French Verb Tenses', 'French Nouns and Adjectives', 'French Adverbs and Prepositions', 'French Pronunciation']
            },
            {
                name: 'Unit 2: Reading and Comprehension',
                topics: ['French Reading Skills', 'Analyzing Cultural Context', 'Understanding Social Issues', 'Reading for Information', 'Reading for Entertainment']
            },
            {
                name: 'Unit 3: Writing and Composition',
                topics: ['French Essay Writing', 'French Report Writing', 'French Creative Writing', 'French Business Writing', 'French Technical Writing']
            },
            {
                name: 'Unit 4: Listening and Speaking',
                topics: ['French Listening Skills', 'French Speaking Skills', 'French Pronunciation Practice', 'French Cultural Etiquette', 'French Interpersonal Communication']
            },
            {
                name: 'Unit 5: Exam Preparation',
                topics: ['Multiple Choice Strategies', 'Essay Writing Practice', 'Speaking Practice', 'Listening Practice', 'Reading Practice']
            }
        ]
    },
    'german-language': {
        name: '🇩🇪 AP German',
        description: 'Develop reading and writing skills in German, focusing on grammar, vocabulary, and cultural context.',
        examFormat: 'Multiple Choice (45 questions, 45% of score) and Free Response (3 essays, 55% of score)',
        units: [
            {
                name: 'Unit 1: Grammar and Vocabulary',
                topics: ['German Grammar Basics', 'German Verb Tenses', 'German Nouns and Adjectives', 'German Adverbs and Prepositions', 'German Pronunciation']
            },
            {
                name: 'Unit 2: Reading and Comprehension',
                topics: ['German Reading Skills', 'Analyzing Cultural Context', 'Understanding Social Issues', 'Reading for Information', 'Reading for Entertainment']
            },
            {
                name: 'Unit 3: Writing and Composition',
                topics: ['German Essay Writing', 'German Report Writing', 'German Creative Writing', 'German Business Writing', 'German Technical Writing']
            },
            {
                name: 'Unit 4: Listening and Speaking',
                topics: ['German Listening Skills', 'German Speaking Skills', 'German Pronunciation Practice', 'German Cultural Etiquette', 'German Interpersonal Communication']
            },
            {
                name: 'Unit 5: Exam Preparation',
                topics: ['Multiple Choice Strategies', 'Essay Writing Practice', 'Speaking Practice', 'Listening Practice', 'Reading Practice']
            }
        ]
    },

    // Social Studies
    'world-history': {
        name: '🌎 AP World History',
        description: 'Explore key events, individuals, developments, and processes from 1200 CE to the present, developing your understanding of historical thinking skills and themes across different societies.',
        examFormat: 'Multiple Choice (55 questions, 40% of score), Short Answer (3 questions, 20% of score), Document-Based Question (1 question, 25% of score), Long Essay (1 question, 15% of score)',
        units: [
            {
                name: 'Unit 1: The Global Tapestry (1200-1450)',
                topics: [
                    {
                        name: 'Developments in East Asia',
                        subtopics: ['Neo-Confucianism', 'Song Dynasty Innovations', 'Mongol Empire', 'Ming Dynasty', 'Maritime Exploration']
                    },
                    {
                        name: 'Developments in Dar al-Islam',
                        subtopics: ['Abbasid Caliphate', 'Islamic States', 'Intellectual Traditions', 'Cultural Developments', 'Trade Networks']
                    },
                    {
                        name: 'Developments in South and Southeast Asia',
                        subtopics: ['Delhi Sultanate', 'Hindu-Buddhist Traditions', 'Indian Ocean Trade', 'Khmer Empire', 'Maritime Southeast Asia']
                    },
                    {
                        name: 'State Building in the Americas',
                        subtopics: ['Inca Empire', 'Aztec Empire', 'Maya City-States', 'North American Societies', 'Trade Networks']
                    },
                    {
                        name: 'State Building in Africa',
                        subtopics: ['Great Zimbabwe', 'Mali Empire', 'Ethiopian Kingdom', 'Swahili City-States', 'Trans-Saharan Trade']
                    },
                    {
                        name: 'Developments in Europe',
                        subtopics: ['Feudal Systems', 'Crusades', 'Medieval Universities', 'Black Death', 'Hundred Years\' War']
                    }
                ]
            },
            {
                name: 'Unit 2: Networks of Exchange (1200-1450)',
                topics: [
                    {
                        name: 'The Silk Roads',
                        subtopics: ['Trade Routes', 'Cultural Exchange', 'Technological Diffusion', 'Disease Transmission', 'Mongol Influence']
                    },
                    {
                        name: 'The Indian Ocean Trading Network',
                        subtopics: ['Maritime Technologies', 'Port Cities', 'Commercial Practices', 'Cultural Exchange', 'Environmental Impact']
                    },
                    {
                        name: 'Trans-Saharan Trade Routes',
                        subtopics: ['Gold-Salt Trade', 'Spread of Islam', 'Caravan Organization', 'Urban Development', 'Cultural Exchange']
                    },
                    {
                        name: 'Cultural Consequences of Connectivity',
                        subtopics: ['Diffusion of Scientific Knowledge', 'Spread of Religions', 'Architectural Styles', 'Literary Developments', 'Artistic Traditions']
                    },
                    {
                        name: 'Environmental Consequences of Connectivity',
                        subtopics: ['Spread of Crops', 'Animal Exchanges', 'Disease Transmission', 'Deforestation', 'Urbanization Effects']
                    }
                ]
            },
            {
                name: 'Unit 3: Land-Based Empires (1450-1750)',
                topics: [
                    {
                        name: 'The Ottoman Empire',
                        subtopics: ['Imperial Expansion', 'Suleiman the Magnificent', 'Administrative Systems', 'Religious Tolerance', 'Cultural Developments']
                    },
                    {
                        name: 'The Safavid Empire',
                        subtopics: ['Shi\'a Identity', 'Shah Abbas I', 'Administrative Systems', 'Conflict with Ottomans', 'Cultural Patronage']
                    },
                    {
                        name: 'The Mughal Empire',
                        subtopics: ['Akbar\'s Rule', 'Religious Policies', 'Administrative Systems', 'Cultural Developments', 'Economic Policies']
                    },
                    {
                        name: 'Comparison of Land-Based Empires',
                        subtopics: ['Imperial Ideologies', 'Administrative Structures', 'Religious Policies', 'Military Organizations', 'Succession Crises']
                    }
                ]
            },
            {
                name: 'Unit 4: Transoceanic Interconnections (1450-1750)',
                topics: [
                    {
                        name: 'European Technological Developments',
                        subtopics: ['Maritime Technologies', 'Cartography', 'Navigational Tools', 'Shipbuilding', 'Gunpowder Weapons']
                    },
                    {
                        name: 'European Exploration and Conquest',
                        subtopics: ['Portuguese Exploration', 'Spanish Conquest', 'Columbian Exchange', 'Treaty of Tordesillas', 'Indigenous Resistance']
                    },
                    {
                        name: 'Columbian Exchange',
                        subtopics: ['Crop Exchanges', 'Livestock Transfers', 'Disease Impact', 'Population Changes', 'Environmental Effects']
                    },
                    {
                        name: 'Maritime Empires Established',
                        subtopics: ['Spanish Empire', 'Portuguese Empire', 'Dutch Empire', 'British Empire', 'French Empire']
                    },
                    {
                        name: 'Maritime Empires Maintained',
                        subtopics: ['Colonial Administration', 'Mercantilist Policies', 'Labor Systems', 'Caste Systems', 'Religious Conversion']
                    },
                    {
                        name: 'Internal and External Challenges to State Power',
                        subtopics: ['Peasant Revolts', 'Indigenous Resistance', 'Maroon Communities', 'Religious Conflicts', 'Competition Between States']
                    },
                    {
                        name: 'Changing Social Hierarchies',
                        subtopics: ['Caste Systems', 'Racial Classifications', 'Gender Roles', 'Social Mobility', 'Elite Status']
                    }
                ]
            },
            {
                name: 'Unit 5: Revolutions (1750-1900)',
                topics: [
                    {
                        name: 'The Enlightenment',
                        subtopics: ['Natural Rights', 'Social Contract', 'Separation of Powers', 'Religious Tolerance', 'Scientific Revolution']
                    },
                    {
                        name: 'Nationalism and Revolutions',
                        subtopics: ['American Revolution', 'French Revolution', 'Haitian Revolution', 'Latin American Revolutions', 'Revolutions of 1848']
                    },
                    {
                        name: 'Industrial Revolution',
                        subtopics: ['Technological Innovations', 'Factory System', 'Urbanization', 'Working Conditions', 'Environmental Impact']
                    },
                    {
                        name: 'Economic Developments and Innovations',
                        subtopics: ['Capitalism', 'Free Trade', 'Labor Systems', 'Economic Theories', 'Banking Systems']
                    },
                    {
                        name: 'Social Effects of Industrialization',
                        subtopics: ['Urban Migration', 'Social Classes', 'Labor Movements', 'Gender Roles', 'Education Systems']
                    },
                    {
                        name: 'State Expansion: The Ottoman Empire',
                        subtopics: ['Tanzimat Reforms', 'Young Turk Movement', 'Crimean War', 'Balkan Nationalism', 'Economic Challenges']
                    },
                    {
                        name: 'State Expansion: China',
                        subtopics: ['Opium Wars', 'Taiping Rebellion', 'Self-Strengthening Movement', 'Boxer Rebellion', 'Decline of Qing Dynasty']
                    },
                    {
                        name: 'State Expansion: Japan',
                        subtopics: ['Meiji Restoration', 'Westernization', 'Industrialization', 'Imperial Expansion', 'Constitutional Monarchy']
                    },
                    {
                        name: 'State Expansion: The British in India',
                        subtopics: ['East India Company', 'Sepoy Rebellion', 'British Raj', 'Economic Policies', 'Cultural Impact']
                    }
                ]
            },
            {
                name: 'Unit 6: Consequences of Industrialization (1750-1900)',
                topics: [
                    {
                        name: 'Rationales for Imperialism',
                        subtopics: ['Economic Motivations', 'Strategic Interests', 'Civilizing Mission', 'Social Darwinism', 'Nationalism']
                    },
                    {
                        name: 'State Expansion',
                        subtopics: ['European Imperialism', 'American Expansion', 'Russian Expansion', 'Japanese Imperialism', 'Colonial Administrations']
                    },
                    {
                        name: 'Indigenous Responses to State Expansion',
                        subtopics: ['Military Resistance', 'Cultural Resistance', 'Economic Resistance', 'Collaboration', 'Reform Movements']
                    },
                    {
                        name: 'Global Economic Development',
                        subtopics: ['Industrial Capitalism', 'Global Trade Networks', 'Labor Migration', 'Economic Specialization', 'Economic Imperialism']
                    },
                    {
                        name: 'Economic Imperialism',
                        subtopics: ['Foreign Investment', 'Extraterritoriality', 'Spheres of Influence', 'Open Door Policy', 'Economic Dependency']
                    },
                    {
                        name: 'Causes of Migration',
                        subtopics: ['Push Factors', 'Pull Factors', 'Labor Demands', 'Religious Persecution', 'Political Instability']
                    },
                    {
                        name: 'Effects of Migration',
                        subtopics: ['Demographic Changes', 'Environmental Impact', 'Cultural Diffusion', 'Nativism', 'Diaspora Communities']
                    }
                ]
            },
            {
                name: 'Unit 7: Global Conflict (1900-present)',
                topics: [
                    {
                        name: 'Shifting Power After 1900',
                        subtopics: ['Decline of Ottoman Empire', 'Decline of Qing China', 'Japanese Imperialism', 'U.S. Emergence', 'European Alliances']
                    },
                    {
                        name: 'Causes of World War I',
                        subtopics: ['Militarism', 'Alliances', 'Imperialism', 'Nationalism', 'Assassination of Archduke Franz Ferdinand']
                    },
                    {
                        name: 'Conducting World War I',
                        subtopics: ['Trench Warfare', 'Total War', 'Technological Innovations', 'Propaganda', 'Home Fronts']
                    },
                    {
                        name: 'Economy in the Interwar Period',
                        subtopics: ['Post-War Reconstruction', 'Great Depression', 'Economic Nationalism', 'Soviet Collectivization', 'New Deal']
                    },
                    {
                        name: 'Unresolved Tensions After World War I',
                        subtopics: ['Treaty of Versailles', 'League of Nations', 'Territorial Disputes', 'Economic Reparations', 'Rise of Fascism']
                    },
                    {
                        name: 'Causes of World War II',
                        subtopics: ['Appeasement', 'Fascist Expansion', 'Japanese Imperialism', 'Economic Factors', 'Failure of League of Nations']
                    },
                    {
                        name: 'Conducting World War II',
                        subtopics: ['Blitzkrieg', 'Island Hopping', 'Allied Strategy', 'Holocaust', 'Atomic Bombing']
                    },
                    {
                        name: 'Mass Atrocities',
                        subtopics: ['Holocaust', 'Nanjing Massacre', 'Gulags', 'Armenian Genocide', 'Cambodian Genocide']
                    },
                    {
                        name: 'Causes and Effects of the Cold War',
                        subtopics: ['Ideological Differences', 'Nuclear Arms Race', 'Proxy Wars', 'Decolonization', 'Fall of Soviet Union']
                    }
                ]
            },
            {
                name: 'Unit 8: Cold War and Decolonization (1900-present)',
                topics: [
                    {
                        name: 'Setting the Stage for the Cold War and Decolonization',
                        subtopics: ['End of World War II', 'United Nations', 'Bretton Woods System', 'Division of Germany', 'Independence Movements']
                    },
                    {
                        name: 'The Cold War',
                        subtopics: ['Containment', 'NATO vs. Warsaw Pact', 'Nuclear Arms Race', 'Space Race', 'Détente']
                    },
                    {
                        name: 'Effects of the Cold War',
                        subtopics: ['Proxy Wars', 'Military Alliances', 'Economic Blocs', 'Cultural Competition', 'Technological Development']
                    },
                    {
                        name: 'Spread of Communism After 1900',
                        subtopics: ['Russian Revolution', 'Chinese Revolution', 'Cuban Revolution', 'Vietnamese Revolution', 'Eastern European Communism']
                    },
                    {
                        name: 'Decolonization and Independence',
                        subtopics: ['Indian Independence', 'African Decolonization', 'Southeast Asian Independence', 'Middle Eastern Nationalism', 'Non-Aligned Movement']
                    },
                    {
                        name: 'Newly Independent States',
                        subtopics: ['Nation Building', 'Economic Development', 'Political Challenges', 'Neo-colonialism', 'Regional Conflicts']
                    },
                    {
                        name: 'Global Resistance to Established Power Structures',
                        subtopics: ['Anti-Apartheid Movement', 'Civil Rights Movements', 'Student Protests', 'Women\'s Movements', 'Indigenous Rights']
                    },
                    {
                        name: 'End of the Cold War',
                        subtopics: ['Gorbachev\'s Reforms', 'Fall of Berlin Wall', 'Dissolution of USSR', 'End of Proxy Wars', 'Post-Cold War Order']
                    }
                ]
            },
            {
                name: 'Unit 9: Globalization (1900-present)',
                topics: [
                    {
                        name: 'Advances in Technology and Exchange',
                        subtopics: ['Digital Revolution', 'Internet', 'Telecommunications', 'Transportation', 'Green Revolution']
                    },
                    {
                        name: 'Technological Advances: Disease',
                        subtopics: ['Vaccines', 'Antibiotics', 'Public Health Measures', 'Global Health Organizations', 'Disease Eradication Efforts']
                    },
                    {
                        name: 'Technological Advances: Green Revolution',
                        subtopics: ['High-Yield Crops', 'Fertilizers', 'Irrigation Systems', 'Agricultural Mechanization', 'Environmental Impact']
                    },
                    {
                        name: 'Economics in the Global Age',
                        subtopics: ['Multinational Corporations', 'Economic Blocs', 'International Financial Institutions', 'Outsourcing', 'Digital Economy']
                    },
                    {
                        name: 'Calls for Reform and Responses',
                        subtopics: ['Anti-Globalization Movement', 'Environmental Activism', 'Human Rights Advocacy', 'Indigenous Rights', 'Economic Justice']
                    },
                    {
                        name: 'Globalized Culture',
                        subtopics: ['Mass Media', 'Popular Culture', 'Cultural Homogenization', 'Cultural Resistance', 'Religious Fundamentalism']
                    },
                    {
                        name: 'Resistance to Globalization',
                        subtopics: ['Religious Fundamentalism', 'Nationalism', 'Populism', 'Environmental Concerns', 'Labor Movements']
                    },
                    {
                        name: 'Demographic and Environmental Changes',
                        subtopics: ['Population Growth', 'Urbanization', 'Climate Change', 'Resource Depletion', 'Pollution']
                    }
                ]
            }
        ]
    },
    'us-history': {
        name: '🗽 AP US History',
        description: 'Explore the history of the United States from pre-Columbian societies to the present, focusing on key themes such as American identity, politics, economics, culture, and global influence.',
        examFormat: 'Multiple Choice (55 questions, 40% of score), Short Answer (3 questions, 20% of score), Document-Based Question (1 question, 25% of score), Long Essay (1 question, 15% of score)',
        units: [
            {
                name: 'Unit 1: Period 1 (1491-1607)',
                topics: [
                    {
                        name: 'Native American Societies Before European Contact',
                        subtopics: ['Mesoamerican Empires', 'North American Cultures', 'Agricultural Practices', 'Trade Networks', 'Social Structures']
                    },
                    {
                        name: 'European Exploration in the Americas',
                        subtopics: ['Spanish Exploration', 'French Exploration', 'English Exploration', 'Portuguese Exploration', 'Columbian Exchange']
                    },
                    {
                        name: 'Columbian Exchange',
                        subtopics: ['Disease Impact', 'Agricultural Exchanges', 'Livestock Introduction', 'Cultural Exchanges', 'Demographic Changes']
                    },
                    {
                        name: 'Labor Systems',
                        subtopics: ['Encomienda System', 'Slavery', 'Indentured Servitude', 'Native American Labor', 'Plantation Economy']
                    },
                    {
                        name: 'European and Native American Relations',
                        subtopics: ['Cultural Misunderstandings', 'Trade Relationships', 'Military Conflicts', 'Religious Conversion', 'Diplomatic Alliances']
                    }
                ]
            },
            {
                name: 'Unit 2: Period 2 (1607-1754)',
                topics: [
                    {
                        name: 'Early English Colonies',
                        subtopics: ['Jamestown', 'Plymouth Colony', 'Massachusetts Bay Colony', 'Chesapeake Colonies', 'Middle Colonies']
                    },
                    {
                        name: 'Transatlantic Trade',
                        subtopics: ['Mercantilism', 'Triangular Trade', 'Navigation Acts', 'Colonial Exports', 'Smuggling']
                    },
                    {
                        name: 'Colonial Society and Culture',
                        subtopics: ['Social Hierarchy', 'Religious Movements', 'Education', 'Family Structures', 'Regional Differences']
                    },
                    {
                        name: 'Slavery in Colonial America',
                        subtopics: ['Middle Passage', 'Slave Codes', 'Resistance', 'Regional Differences', 'Economic Impact']
                    },
                    {
                        name: 'Colonial Governance',
                        subtopics: ['Royal Colonies', 'Proprietary Colonies', 'Charter Colonies', 'Local Government', 'Colonial Assemblies']
                    }
                ]
            },
            {
                name: 'Unit 3: Period 3 (1754-1800)',
                topics: [
                    {
                        name: 'French and Indian War',
                        subtopics: ['Causes', 'Major Battles', 'Treaty of Paris (1763)', 'Colonial Militia', 'Impact on Colonial-British Relations']
                    },
                    {
                        name: 'Road to Revolution',
                        subtopics: ['Proclamation of 1763', 'Stamp Act', 'Townshend Acts', 'Boston Massacre', 'Boston Tea Party']
                    },
                    {
                        name: 'American Revolution',
                        subtopics: ['Declaration of Independence', 'Continental Army', 'Key Battles', 'Foreign Assistance', 'Treaty of Paris (1783)']
                    },
                    {
                        name: 'Articles of Confederation',
                        subtopics: ['Structure and Powers', 'Northwest Ordinance', 'Shays\' Rebellion', 'Economic Challenges', 'Foreign Relations']
                    },
                    {
                        name: 'Constitution and Early Republic',
                        subtopics: ['Constitutional Convention', 'Federalist Papers', 'Bill of Rights', 'Washington\'s Presidency', 'Rise of Political Parties']
                    }
                ]
            },
            {
                name: 'Unit 4: Period 4 (1800-1848)',
                topics: [
                    {
                        name: 'Jeffersonian Era',
                        subtopics: ['Election of 1800', 'Louisiana Purchase', 'Embargo Act', 'War of 1812', 'Marshall Court']
                    },
                    {
                        name: 'Market Revolution',
                        subtopics: ['Transportation Revolution', 'Cotton Gin', 'Factory System', 'Urbanization', 'Commercial Agriculture']
                    },
                    {
                        name: 'Jacksonian Democracy',
                        subtopics: ['Spoils System', 'Bank War', 'Indian Removal', 'Nullification Crisis', 'Expansion of Suffrage']
                    },
                    {
                        name: 'Reform Movements',
                        subtopics: ['Abolitionism', 'Women\'s Rights', 'Temperance', 'Education Reform', 'Utopian Communities']
                    },
                    {
                        name: 'Westward Expansion',
                        subtopics: ['Manifest Destiny', 'Oregon Territory', 'Texas Annexation', 'Mexican-American War', 'Gold Rush']
                    }
                ]
            },
            {
                name: 'Unit 5: Period 5 (1844-1877)',
                topics: [
                    {
                        name: 'Slavery and Sectional Tensions',
                        subtopics: ['Compromise of 1850', 'Kansas-Nebraska Act', 'Dred Scott Decision', 'John Brown\'s Raid', 'Lincoln-Douglas Debates']
                    },
                    {
                        name: 'Civil War',
                        subtopics: ['Secession', 'Fort Sumter', 'Emancipation Proclamation', 'Major Battles', 'Home Front']
                    },
                    {
                        name: 'Reconstruction',
                        subtopics: ['Presidential Reconstruction', 'Radical Reconstruction', 'Constitutional Amendments', 'Freedmen\'s Bureau', 'Compromise of 1877']
                    },
                    {
                        name: 'Economic Developments',
                        subtopics: ['Transcontinental Railroad', 'Homestead Act', 'Industrial Growth', 'Labor Organization', 'Financial Panics']
                    },
                    {
                        name: 'Western Expansion and Native Americans',
                        subtopics: ['Plains Wars', 'Reservation System', 'Dawes Act', 'Buffalo Extermination', 'Assimilation Policies']
                    }
                ]
            },
            {
                name: 'Unit 6: Period 6 (1865-1898)',
                topics: [
                    {
                        name: 'Industrialization',
                        subtopics: ['Steel Industry', 'Oil Industry', 'Railroad Expansion', 'Technological Innovations', 'Corporate Consolidation']
                    },
                    {
                        name: 'Immigration and Urbanization',
                        subtopics: ['New Immigration', 'Urban Growth', 'Tenement Housing', 'Political Machines', 'Nativism']
                    },
                    {
                        name: 'Gilded Age Politics',
                        subtopics: ['Spoils System', 'Civil Service Reform', 'Political Corruption', 'Laissez-faire Policies', 'Tariff Debates']
                    },
                    {
                        name: 'Agrarian and Labor Movements',
                        subtopics: ['Grange', 'Populist Party', 'Knights of Labor', 'American Federation of Labor', 'Major Strikes']
                    },
                    {
                        name: 'The New South',
                        subtopics: ['Sharecropping', 'Jim Crow Laws', 'Disfranchisement', 'Plessy v. Ferguson', 'Industrial Development']
                    }
                ]
            },
            {
                name: 'Unit 7: Period 7 (1890-1945)',
                topics: [
                    {
                        name: 'Progressive Era',
                        subtopics: ['Muckrakers', 'Political Reforms', 'Social Reforms', 'Conservation', 'Prohibition']
                    },
                    {
                        name: 'American Imperialism',
                        subtopics: ['Spanish-American War', 'Philippine-American War', 'Panama Canal', 'Roosevelt Corollary', 'Dollar Diplomacy']
                    },
                    {
                        name: 'World War I',
                        subtopics: ['Neutrality', 'U.S. Entry', 'Home Front', 'Wilson\'s Fourteen Points', 'Treaty of Versailles']
                    },
                    {
                        name: 'The Roaring Twenties',
                        subtopics: ['Consumer Culture', 'Harlem Renaissance', 'Prohibition', 'Nativism and Immigration Restriction', 'Cultural Conflicts']
                    },
                    {
                        name: 'Great Depression and New Deal',
                        subtopics: ['Stock Market Crash', 'Dust Bowl', 'First New Deal', 'Second New Deal', 'Opposition to New Deal']
                    },
                    {
                        name: 'World War II',
                        subtopics: ['Neutrality Acts', 'Pearl Harbor', 'War Production', 'Home Front', 'Atomic Bombing']
                    }
                ]
            },
            {
                name: 'Unit 8: Period 8 (1945-1980)',
                topics: [
                    {
                        name: 'Early Cold War',
                        subtopics: ['Containment', 'Truman Doctrine', 'Marshall Plan', 'NATO', 'Korean War']
                    },
                    {
                        name: 'The Affluent Society',
                        subtopics: ['Suburban Growth', 'Consumer Culture', 'Baby Boom', 'Television', 'Interstate Highway System']
                    },
                    {
                        name: 'Civil Rights Movement',
                        subtopics: ['Brown v. Board of Education', 'Montgomery Bus Boycott', 'Civil Rights Acts', 'Black Power', 'Martin Luther King Jr.']
                    },
                    {
                        name: 'The Vietnam War',
                        subtopics: ['Escalation', 'Tet Offensive', 'Anti-War Movement', 'Nixon\'s Policies', 'Fall of Saigon']
                    },
                    {
                        name: 'Social Movements of the 1960s and 1970s',
                        subtopics: ['Women\'s Movement', 'Chicano Movement', 'American Indian Movement', 'Gay Rights Movement', 'Environmental Movement']
                    },
                    {
                        name: 'Political Developments',
                        subtopics: ['Great Society', 'Watergate Scandal', 'Nixon\'s Resignation', 'Energy Crisis', 'Economic Stagflation']
                    }
                ]
            },
            {
                name: 'Unit 9: Period 9 (1980-Present)',
                topics: [
                    {
                        name: 'Conservative Resurgence',
                        subtopics: ['Reagan Revolution', 'Supply-Side Economics', 'Religious Right', 'War on Drugs', 'Supreme Court Shifts']
                    },
                    {
                        name: 'End of the Cold War',
                        subtopics: ['Reagan Doctrine', 'Gorbachev Reforms', 'Fall of Berlin Wall', 'Collapse of Soviet Union', 'Post-Cold War Foreign Policy']
                    },
                    {
                        name: 'Globalization',
                        subtopics: ['NAFTA', 'Technological Revolution', 'Immigration Reform', 'Outsourcing', 'Economic Interdependence']
                    },
                    {
                        name: 'Terrorism and National Security',
                        subtopics: ['9/11 Attacks', 'War on Terror', 'Afghanistan War', 'Iraq War', 'Homeland Security']
                    },
                    {
                        name: 'Social and Political Developments',
                        subtopics: ['Clinton Presidency', 'Bush Presidency', 'Obama Presidency', 'Trump Presidency', 'Polarization']
                    },
                    {
                        name: 'Demographic and Cultural Trends',
                        subtopics: ['Immigration Patterns', 'Aging Population', 'Digital Revolution', 'Identity Politics', 'Environmental Concerns']
                    }
                ]
            }
        ]
    },
    'european-history': {
        name: '🏰 AP European History',
        description: 'Explore the history of Europe from the Renaissance to the present, focusing on key themes such as cultural change, political developments, and global interactions.',
        examFormat: 'Multiple Choice (55 questions, 40% of score), Short Answer (3 questions, 20% of score), Document-Based Question (1 question, 25% of score), Long Essay (1 question, 15% of score)',
        units: [
            {
                name: 'Unit 1: The Renaissance (1300-1600)',
                topics: [
                    {
                        name: 'Cultural Revival',
                        subtopics: ['Humanism', 'Art and Architecture', 'Humanist Thought', 'Scientific Revolution', 'Intellectual Movements']
                    },
                    {
                        name: 'Political and Social Change',
                        subtopics: ['The Renaissance and the Reformation', 'The Rise of Nation-States', 'The Protestant Reformation', 'The Catholic Counter-Reformation', 'The Age of Exploration']
                    },
                    {
                        name: 'Economic Developments',
                        subtopics: ['Trade Networks', 'Urbanization', 'Capitalism', 'Trade Routes', 'Economic Integration']
                    },
                    {
                        name: 'Cultural Exchange',
                        subtopics: ['Humanist Thought', 'Art and Architecture', 'Intellectual Movements', 'Cultural Exchange', 'Humanist Thought']
                    },
                    {
                        name: 'Global Interactions',
                        subtopics: ['The Age of Exploration', 'Columbian Exchange', 'Global Trade Networks', 'The Protestant Reformation', 'The Catholic Counter-Reformation']
                    }
                ]
            },
            {
                name: 'Unit 2: The Enlightenment (1700-1800)',
                topics: [
                    {
                        name: 'Philosophical Movements',
                        subtopics: ['Rationalism', 'Empiricism', 'Deism', 'Skepticism', 'Philosophical Methodology']
                    },
                    {
                        name: 'Political and Social Change',
                        subtopics: ['The Enlightenment and the French Revolution', 'The American Revolution', 'The French Revolution', 'The Napoleonic Code', 'The Age of Napoleon']
                    },
                    {
                        name: 'Economic Developments',
                        subtopics: ['Industrial Revolution', 'Trade Networks', 'Capitalism', 'Economic Theories', 'Economic Integration']
                    },
                    {
                        name: 'Cultural Exchange',
                        subtopics: ['Humanist Thought', 'Art and Architecture', 'Intellectual Movements', 'Cultural Exchange', 'Humanist Thought']
                    },
                    {
                        name: 'Global Interactions',
                        subtopics: ['The Age of Exploration', 'Columbian Exchange', 'Global Trade Networks', 'The Protestant Reformation', 'The Catholic Counter-Reformation']
                    }
                ]
            },
            {
                name: 'Unit 3: The Industrial Revolution (1800-1900)',
                topics: [
                    {
                        name: 'Technological Innovations',
                        subtopics: ['Steam Engine', 'Railroad', 'Electricity', 'Internal Combustion Engine', 'Mass Production']
                    },
                    {
                        name: 'Economic Developments',
                        subtopics: ['Industrial Revolution', 'Trade Networks', 'Capitalism', 'Economic Theories', 'Economic Integration']
                    },
                    {
                        name: 'Social and Cultural Change',
                        subtopics: ['Urbanization', 'Working Class', 'Women\'s Suffrage', 'Social Reform Movements', 'The Arts']
                    },
                    {
                        name: 'Political Developments',
                        subtopics: ['Nationalism', 'Imperialism', 'Democracy', 'Socialism', 'Political Ideologies']
                    },
                    {
                        name: 'Global Interactions',
                        subtopics: ['The Industrial Revolution', 'Global Trade Networks', 'The American Civil War', 'The Franco-Prussian War', 'The Russian Revolution']
                    }
                ]
            },
            {
                name: 'Unit 4: World War I and Its Aftermath (1900-1945)',
                topics: [
                    {
                        name: 'World War I',
                        subtopics: ['Causes', 'Major Battles', 'Treaty of Versailles', 'The Russian Revolution', 'The Weimar Republic']
                    },
                    {
                        name: 'The Interwar Period',
                        subtopics: ['Economic Depression', 'Political Extremism', 'Totalitarian Movements', 'The Spanish Civil War', 'The Soviet Union']
                    },
                    {
                        name: 'World War II',
                        subtopics: ['Causes', 'Major Battles', 'The Holocaust', 'The Cold War', 'The United Nations']
                    },
                    {
                        name: 'Post-War Reconstruction',
                        subtopics: ['The Marshall Plan', 'The Bretton Woods System', 'The Cold War', 'The Decolonization of Africa', 'The United States as a Superpower']
                    },
                    {
                        name: 'Global Interactions',
                        subtopics: ['The United Nations', 'The Marshall Plan', 'The Cold War', 'The Decolonization of Africa', 'The United States as a Superpower']
                    }
                ]
            },
            {
                name: 'Unit 5: The Cold War and Its Aftermath (1945-1990)',
                topics: [
                    {
                        name: 'The Cold War',
                        subtopics: ['Containment', 'NATO vs. Warsaw Pact', 'The Cuban Missile Crisis', 'The Space Race', 'The United States as a Superpower']
                    },
                    {
                        name: 'The End of the Cold War',
                        subtopics: ['Gorbachev\'s Reforms', 'The Fall of the Berlin Wall', 'The Collapse of the Soviet Union', 'The United States as a Superpower', 'The European Union']
                    },
                    {
                        name: 'Globalization',
                        subtopics: ['The European Union', 'NAFTA', 'The World Trade Organization', 'The Information Age', 'The Global South']
                    },
                    {
                        name: 'The 1990s',
                        subtopics: ['The End of the Cold War', 'The Global Financial Crisis', 'The War on Terror', 'The Yugoslav Wars', 'The Rise of China']
                    },
                    {
                        name: 'The 21st Century',
                        subtopics: ['The Global Financial Crisis', 'The War on Terror', 'The Arab Spring', 'The European Sovereign Debt Crisis', 'The United States as a Superpower']
                    }
                ]
            }
        ]
    },
    'human-geography': {
        name: '🗺️ AP Human Geography',
        description: 'Explore the principles of human geography, including physical, cultural, and economic aspects of the world.',
        examFormat: 'Multiple Choice (55 questions, 40% of score), Short Answer (3 questions, 20% of score), Document-Based Question (1 question, 25% of score), Long Essay (1 question, 15% of score)',
        units: [
            {
                name: 'Unit 1: Physical Geography',
                topics: [
                    {
                        name: 'Earth\'s Systems',
                        subtopics: ['The Water Cycle', 'The Carbon Cycle', 'The Nitrogen Cycle', 'The Phosphorus Cycle', 'The Rock Cycle']
                    },
                    {
                        name: 'Landforms and Landscapes',
                        subtopics: ['Mountains', 'Rivers', 'Deserts', 'Coastlines', 'Glaciers']
                    },
                    {
                        name: 'Climate and Weather',
                        subtopics: ['Temperature and Precipitation', 'Wind Patterns', 'Humidity and Air Pressure', 'Climate Zones', 'Climate Change']
                    },
                    {
                        name: 'Ecosystems',
                        subtopics: ['Tropical Rainforests', 'Temperate Deciduous Forests', 'Temperate Grasslands', 'Tundra', 'Desert Ecosystems']
                    },
                    {
                        name: 'Human-Environment Interaction',
                        subtopics: ['Population Growth', 'Urbanization', 'Agricultural Land Use', 'Industrialization', 'Climate Change']
                    }
                ]
            },
            {
                name: 'Unit 2: Cultural Geography',
                topics: [
                    {
                        name: 'Cultural Patterns',
                        subtopics: ['Language', 'Religion', 'Ethnicity', 'Social Class', 'Gender']
                    },
                    {
                        name: 'Cultural Diversity',
                        subtopics: ['Cultural Regions', 'Cultural Diffusion', 'Cultural Adaptation', 'Cultural Pluralism', 'Cultural Change']
                    },
                    {
                        name: 'Cultural Impact',
                        subtopics: ['Tourism', 'Migration', 'Globalization', 'Cultural Exchange', 'Cultural Conflict']
                    },
                    {
                        name: 'Cultural Expression',
                        subtopics: ['Art and Architecture', 'Music and Dance', 'Literature', 'Film and Media', 'Cultural Festivals']
                    },
                    {
                        name: 'Cultural Continuity and Change',
                        subtopics: ['Cultural Heritage', 'Cultural Adaptation', 'Cultural Diffusion', 'Cultural Pluralism', 'Cultural Change']
                    }
                ]
            },
            {
                name: 'Unit 3: Economic Geography',
                topics: [
                    {
                        name: 'Economic Systems',
                        subtopics: ['Market Economies', 'Command Economies', 'Mixed Economies', 'Economic Development', 'Economic Globalization']
                    },
                    {
                        name: 'Trade and Commerce',
                        subtopics: ['Trade Routes', 'Trade Barriers', 'Trade Networks', 'Foreign Direct Investment', 'International Trade Organizations']
                    },
                    {
                        name: 'Economic Integration',
                        subtopics: ['European Union', 'NAFTA', 'ASEAN', 'Mercosur', 'The World Trade Organization']
                    },
                    {
                        name: 'Economic Development',
                        subtopics: ['Industrialization', 'Agricultural Development', 'Services Sector', 'Technology Transfer', 'Economic Growth']
                    },
                    {
                        name: 'Economic Inequality',
                        subtopics: ['Income Distribution', 'Class Inequality', 'Gender Inequality', 'Racial Inequality', 'Economic Development']
                    }
                ]
            },
            {
                name: 'Unit 4: Political Geography',
                topics: [
                    {
                        name: 'Political Systems',
                        subtopics: ['Nation-State Systems', 'Federal Systems', 'Unitary Systems', 'Confederation', 'Political Integration']
                    },
                    {
                        name: 'Political Borders',
                        subtopics: ['Nationalism', 'Secession', 'Border Conflicts', 'Borderlands', 'International Boundaries']
                    },
                    {
                        name: 'Political Power',
                        subtopics: ['States and Non-State Actors', 'Political Institutions', 'Political Decision-Making', 'Political Conflict', 'Political Stability']
                    },
                    {
                        name: 'Political Integration',
                        subtopics: ['International Organizations', 'Alliances', 'Conflicts', 'Cooperation', 'Global Governance']
                    },
                    {
                        name: 'Political Change',
                        subtopics: ['Democratization', 'Dictatorship', 'Revolution', 'Reform', 'Political Change']
                    }
                ]
            },
            {
                name: 'Unit 5: Social Geography',
                topics: [
                    {
                        name: 'Population and Migration',
                        subtopics: ['Population Growth', 'Urbanization', 'Migration Patterns', 'Migration Causes', 'Migration Consequences']
                    },
                    {
                        name: 'Social Stratification',
                        subtopics: ['Class Inequality', 'Gender Inequality', 'Racial Inequality', 'Social Mobility', 'Social Change']
                    },
                    {
                        name: 'Social Institutions',
                        subtopics: ['Family', 'Education', 'Religion', 'Healthcare', 'Social Welfare']
                    },
                    {
                        name: 'Social Change',
                        subtopics: ['Social Movements', 'Social Reform', 'Social Conflict', 'Social Cohesion', 'Social Change']
                    },
                    {
                        name: 'Social Inequality',
                        subtopics: ['Poverty', 'Inequality', 'Social Exclusion', 'Social Inclusion', 'Social Change']
                    }
                ]
            },
            {
                name: 'Unit 6: Environmental Geography',
                topics: [
                    {
                        name: 'Environmental Issues',
                        subtopics: ['Climate Change', 'Pollution', 'Deforestation', 'Biodiversity Loss', 'Water Scarcity']
                    },
                    {
                        name: 'Environmental Management',
                        subtopics: ['Sustainable Development', 'Environmental Policy', 'Environmental Impact Assessment', 'Ecological Restoration', 'Environmental Education']
                    },
                    {
                        name: 'Environmental Sustainability',
                        subtopics: ['Ecological Footprint', 'Carbon Footprint', 'Water Footprint', 'Sustainable Practices', 'Environmental Justice']
                    }
                ]
            }
        ]
    },
    'government-politics-us': {
        name: '⚖️ AP US Gov & Politics',
        description: 'Explore the principles of American democracy, the structure and functions of the U.S. government, and the rights and responsibilities of citizens.',
        examFormat: 'Multiple Choice (50 questions, 50% of score) and Free Response (2 questions, 50% of score)',
        units: [
            {
                name: 'Unit 1: American Government',
                topics: [
                    {
                        name: 'The Founding',
                        subtopics: ['The Articles of Confederation', 'The Constitutional Convention', 'The Constitution', 'The Bill of Rights']
                    },
                    {
                        name: 'The Presidency',
                        subtopics: ['The Executive Branch', 'The President', 'The Cabinet', 'The Vice President']
                    },
                    {
                        name: 'The Legislative Branch',
                        subtopics: ['The Congress', 'The House of Representatives', 'The Senate', 'Congressional Procedure']
                    },
                    {
                        name: 'The Judicial Branch',
                        subtopics: ['The Supreme Court', 'The Federal Courts', 'Judicial Review', 'Judicial Activism']
                    }
                ]
            },
            {
                name: 'Unit 2: American Politics',
                topics: [
                    {
                        name: 'Political Parties',
                        subtopics: ['The Two-Party System', 'Third Parties', 'Political Party Platforms', 'Political Party Organizations']
                    },
                    {
                        name: 'The Electoral Process',
                        subtopics: ['The Electoral College', 'The Popular Vote', 'The Electoral College Voting System', 'The Role of the Media']
                    },
                    {
                        name: 'Congressional Elections',
                        subtopics: ['The Role of Incumbency', 'Gerrymandering', 'Redistricting', 'The Role of Money in Politics']
                    },
                    {
                        name: 'Presidential Elections',
                        subtopics: ['The Role of Incumbency', 'The Role of the Media', 'The Role of Money in Politics', 'The Electoral College']
                    }
                ]
            },
            {
                name: 'Unit 3: Civil Liberties and Civil Rights',
                topics: [
                    {
                        name: 'Civil Liberties',
                        subtopics: ['Freedom of Speech', 'Freedom of Religion', 'Freedom of the Press', 'Freedom of Assembly', 'Freedom of Association']
                    },
                    {
                        name: 'Civil Rights',
                        subtopics: ['The Civil Rights Movement', 'Civil Rights Acts', 'Voting Rights Act', 'Affirmative Action', 'Equal Protection']
                    },
                    {
                        name: 'Liberty and Security',
                        subtopics: ['The War on Terror', 'National Security', 'Civil Liberties vs. National Security', 'Balancing Acts']
                    }
                ]
            },
            {
                name: 'Unit 4: American Foreign Policy',
                topics: [
                    {
                        name: 'The Role of the United States in the World',
                        subtopics: ['American Exceptionalism', 'The Globalization of the World', 'The Rise of China', 'The Rise of India']
                    },
                    {
                        name: 'Theories of Foreign Policy',
                        subtopics: ['Realism', 'Neoliberalism', 'Neoconservatism', 'Liberalism', 'Constructivism']
                    },
                    {
                        name: 'The Use of Force',
                        subtopics: ['Preemptive War', 'Humanitarian Intervention', 'The War on Terror', 'The Use of Force in International Law']
                    },
                    {
                        name: 'The Role of International Organizations',
                        subtopics: ['The United Nations', 'The World Trade Organization', 'The International Monetary Fund', 'The World Bank', 'The North Atlantic Treaty Organization']
                    }
                ]
            },
            {
                name: 'Unit 5: The Presidency',
                topics: [
                    {
                        name: 'The Presidency and Congress',
                        subtopics: ['The Separation of Powers', 'The Role of the President', 'The Role of Congress', 'The Role of the Executive Branch']
                    },
                    {
                        name: 'The Presidency and the Courts',
                        subtopics: ['The Role of the Supreme Court', 'The Role of the Federal Courts', 'Judicial Review', 'Judicial Activism']
                    },
                    {
                        name: 'The Presidency and the Public',
                        subtopics: ['The Role of the Media', 'The Role of Public Opinion', 'The Role of Interest Groups', 'The Role of the Electorate']
                    }
                ]
            },
            {
                name: 'Unit 6: The Judicial Branch',
                topics: [
                    {
                        name: 'The Judicial Branch and the Constitution',
                        subtopics: ['The Role of the Supreme Court', 'The Role of the Federal Courts', 'Judicial Review', 'Judicial Activism']
                    },
                    {
                        name: 'The Judicial Branch and the Presidency',
                        subtopics: ['The Role of the President', 'The Role of the Executive Branch', 'The Role of the Supreme Court', 'The Role of the Federal Courts']
                    },
                    {
                        name: 'The Judicial Branch and the Public',
                        subtopics: ['The Role of the Media', 'The Role of Public Opinion', 'The Role of Interest Groups', 'The Role of the Electorate']
                    }
                ]
            },
            {
                name: 'Unit 7: The Legislative Branch',
                topics: [
                    {
                        name: 'The Legislative Branch and the Constitution',
                        subtopics: ['The Role of the Congress', 'The Role of the House of Representatives', 'The Role of the Senate', 'Congressional Procedure']
                    },
                    {
                        name: 'The Legislative Branch and the Presidency',
                        subtopics: ['The Role of the President', 'The Role of the Executive Branch', 'The Role of Congress', 'Congressional Procedure']
                    },
                    {
                        name: 'The Legislative Branch and the Public',
                        subtopics: ['The Role of the Media', 'The Role of Public Opinion', 'The Role of Interest Groups', 'The Role of the Electorate']
                    }
                ]
            },
            {
                name: 'Unit 8: The Executive Branch',
                topics: [
                    {
                        name: 'The Executive Branch and the Constitution',
                        subtopics: ['The Role of the President', 'The Role of the Cabinet', 'The Role of the Vice President', 'The Role of the Executive Branch']
                    },
                    {
                        name: 'The Executive Branch and the Legislative Branch',
                        subtopics: ['The Role of Congress', 'The Role of the House of Representatives', 'The Role of the Senate', 'Congressional Procedure']
                    },
                    {
                        name: 'The Executive Branch and the Judicial Branch',
                        subtopics: ['The Role of the Supreme Court', 'The Role of the Federal Courts', 'Judicial Review', 'Judicial Activism']
                    },
                    {
                        name: 'The Executive Branch and the Public',
                        subtopics: ['The Role of the Media', 'The Role of Public Opinion', 'The Role of Interest Groups', 'The Role of the Electorate']
                    }
                ]
            },
            {
                name: 'Unit 9: The American Political System',
                topics: [
                    {
                        name: 'The American Political System and the Constitution',
                        subtopics: ['The Separation of Powers', 'Checks and Balances', 'The Role of the States', 'The Role of the Federal Government']
                    },
                    {
                        name: 'The American Political System and the Presidency',
                        subtopics: ['The Role of the President', 'The Role of the Executive Branch', 'The Role of Congress', 'The Role of the Supreme Court']
                    },
                    {
                        name: 'The American Political System and the Public',
                        subtopics: ['The Role of the Media', 'The Role of Public Opinion', 'The Role of Interest Groups', 'The Role of the Electorate']
                    }
                ]
            }
        ]
    },
    'government-politics-comparative': {
        name: '🏛️ AP Comparative Gov',
        description: 'Compare and contrast the political systems of different countries, focusing on the principles of democracy, the structure and functions of government, and the rights and responsibilities of citizens.',
        examFormat: 'Multiple Choice (50 questions, 50% of score) and Free Response (2 questions, 50% of score)',
        units: [
            {
                name: 'Unit 1: Comparative Democracy',
                topics: [
                    {
                        name: 'Democracy in the United States',
                        subtopics: ['The Founding', 'The Presidency', 'The Legislative Branch', 'The Judicial Branch']
                    },
                    {
                        name: 'Democracy in Other Countries',
                        subtopics: ['The United Kingdom', 'France', 'Germany', 'Japan', 'South Korea']
                    },
                    {
                        name: 'Comparing Democratic Systems',
                        subtopics: ['The Role of Political Parties', 'The Electoral Process', 'Civil Liberties and Civil Rights', 'The Role of the Media']
                    }
                ]
            },
            {
                name: 'Unit 2: Comparative Authoritarianism',
                topics: [
                    {
                        name: 'Authoritarianism in the United States',
                        subtopics: ['The Role of the Military', 'The Role of the Police', 'The Role of the Intelligence Agencies']
                    },
                    {
                        name: 'Authoritarianism in Other Countries',
                        subtopics: ['China', 'Russia', 'North Korea', 'Venezuela', 'Turkey']
                    },
                    {
                        name: 'Comparing Authoritarian Systems',
                        subtopics: ['The Role of the Military', 'The Role of the Police', 'The Role of the Intelligence Agencies', 'The Role of the Media']
                    }
                ]
            },
            {
                name: 'Unit 3: Comparative Federalism',
                topics: [
                    {
                        name: 'Federalism in the United States',
                        subtopics: ['The Role of the States', 'The Role of the Federal Government', 'The Role of the Courts']
                    },
                    {
                        name: 'Federalism in Other Countries',
                        subtopics: ['Canada', 'India', 'Germany', 'Switzerland', 'Australia']
                    },
                    {
                        name: 'Comparing Federal Systems',
                        subtopics: ['The Role of the States', 'The Role of the Federal Government', 'The Role of the Courts', 'The Role of the Media']
                    }
                ]
            },
            {
                name: 'Unit 4: Comparative Political Economy',
                topics: [
                    {
                        name: 'Capitalism in the United States',
                        subtopics: ['The Role of the Market', 'The Role of the Government', 'The Role of the Courts']
                    },
                    {
                        name: 'Capitalism in Other Countries',
                        subtopics: ['China', 'Japan', 'Germany', 'South Korea', 'Singapore']
                    },
                    {
                        name: 'Comparing Capitalist Systems',
                        subtopics: ['The Role of the Market', 'The Role of the Government', 'The Role of the Courts', 'The Role of the Media']
                    }
                ]
            },
            {
                name: 'Unit 5: Comparative Political Culture',
                topics: [
                    {
                        name: 'Political Culture in the United States',
                        subtopics: ['The Role of the Family', 'The Role of the Church', 'The Role of the Media']
                    },
                    {
                        name: 'Political Culture in Other Countries',
                        subtopics: ['Japan', 'South Korea', 'Germany', 'France', 'Italy']
                    },
                    {
                        name: 'Comparing Political Cultures',
                        subtopics: ['The Role of the Family', 'The Role of the Church', 'The Role of the Media', 'The Role of the Courts']
                    }
                ]
            },
            {
                name: 'Unit 6: Comparative Foreign Policy',
                topics: [
                    {
                        name: 'Foreign Policy in the United States',
                        subtopics: ['The Role of the United Nations', 'The Role of the European Union', 'The Role of the NATO', 'The Role of the G7']
                    },
                    {
                        name: 'Foreign Policy in Other Countries',
                        subtopics: ['China', 'Russia', 'Japan', 'South Korea', 'Germany']
                    },
                    {
                        name: 'Comparing Foreign Policy',
                        subtopics: ['The Role of the United Nations', 'The Role of the European Union', 'The Role of the NATO', 'The Role of the G7', 'The Role of the Courts']
                    }
                ]
            },
            {
                name: 'Unit 7: Comparative Political Parties',
                topics: [
                    {
                        name: 'Political Parties in the United States',
                        subtopics: ['The Role of the Democratic Party', 'The Role of the Republican Party', 'The Role of Third Parties']
                    },
                    {
                        name: 'Political Parties in Other Countries',
                        subtopics: ['Germany', 'France', 'Italy', 'Spain', 'Japan']
                    },
                    {
                        name: 'Comparing Political Parties',
                        subtopics: ['The Role of the Democratic Party', 'The Role of the Republican Party', 'The Role of Third Parties', 'The Role of the Courts']
                    }
                ]
            },
            {
                name: 'Unit 8: Comparative Civil Society',
                topics: [
                    {
                        name: 'Civil Society in the United States',
                        subtopics: ['The Role of Non-Governmental Organizations', 'The Role of the Media', 'The Role of the Courts']
                    },
                    {
                        name: 'Civil Society in Other Countries',
                        subtopics: ['Germany', 'France', 'Italy', 'Spain', 'Japan']
                    },
                    {
                        name: 'Comparing Civil Society',
                        subtopics: ['The Role of Non-Governmental Organizations', 'The Role of the Media', 'The Role of the Courts', 'The Role of the Political Parties']
                    }
                ]
            },
            {
                name: 'Unit 9: Comparative Political Systems',
                topics: [
                    {
                        name: 'Comparing Political Systems',
                        subtopics: ['The Role of the States', 'The Role of the Federal Government', 'The Role of the Courts', 'The Role of the Media']
                    },
                    {
                        name: 'Comparing Democratic Systems',
                        subtopics: ['The Role of Political Parties', 'The Electoral Process', 'Civil Liberties and Civil Rights', 'The Role of the Media']
                    },
                    {
                        name: 'Comparing Authoritarian Systems',
                        subtopics: ['The Role of the Military', 'The Role of the Police', 'The Role of the Intelligence Agencies', 'The Role of the Media']
                    },
                    {
                        name: 'Comparing Federal Systems',
                        subtopics: ['The Role of the States', 'The Role of the Federal Government', 'The Role of the Courts', 'The Role of the Media']
                    },
                    {
                        name: 'Comparing Capitalist Systems',
                        subtopics: ['The Role of the Market', 'The Role of the Government', 'The Role of the Courts', 'The Role of the Media']
                    },
                    {
                        name: 'Comparing Political Cultures',
                        subtopics: ['The Role of the Family', 'The Role of the Church', 'The Role of the Media', 'The Role of the Courts']
                    },
                    {
                        name: 'Comparing Foreign Policy',
                        subtopics: ['The Role of the United Nations', 'The Role of the European Union', 'The Role of the NATO', 'The Role of the G7', 'The Role of the Courts']
                    },
                    {
                        name: 'Comparing Political Parties',
                        subtopics: ['The Role of the Democratic Party', 'The Role of the Republican Party', 'The Role of Third Parties', 'The Role of the Courts']
                    },
                    {
                        name: 'Comparing Civil Society',
                        subtopics: ['The Role of Non-Governmental Organizations', 'The Role of the Media', 'The Role of the Courts', 'The Role of the Political Parties']
                    }
                ]
            }
        ]
    },
    'macroeconomics': {
        name: '📈 AP Macroeconomics',
        description: 'Explore the principles of macroeconomics, including the study of national income, price levels, employment, and economic growth.',
        examFormat: 'Multiple Choice (50 questions, 50% of score) and Free Response (2 questions, 50% of score)',
        units: [
            {
                name: 'Unit 1: Macroeconomic Principles',
                topics: [
                    {
                        name: 'Economic Indicators',
                        subtopics: ['Gross Domestic Product (GDP)', 'Gross National Product (GNP)', 'Inflation Rate', 'Unemployment Rate']
                    },
                    {
                        name: 'Economic Growth',
                        subtopics: ['Solow Growth Model', 'Cobb-Douglas Production Function', 'Total Factor Productivity', 'Human Capital']
                    },
                    {
                        name: 'Business Cycles',
                        subtopics: ['Phases of the Business Cycle', 'Causes of Business Cycles', 'The Role of Monetary Policy', 'The Role of Fiscal Policy']
                    }
                ]
            },
            {
                name: 'Unit 2: The AD-AS Model',
                topics: [
                    {
                        name: 'Aggregate Demand (AD)',
                        subtopics: ['Consumption Function', 'Investment Function', 'Government Expenditure Function', 'Net Exports Function']
                    },
                    {
                        name: 'Aggregate Supply (AS)',
                        subtopics: ['Short-Run Aggregate Supply', 'Long-Run Aggregate Supply', 'The Phillips Curve', 'The Natural Rate of Unemployment']
                    },
                    {
                        name: 'The AD-AS Model',
                        subtopics: ['Equilibrium in the AD-AS Model', 'Shifts in the AD Curve', 'Shifts in the AS Curve', 'Policy Analysis using the AD-AS Model']
                    }
                ]
            },
            {
                name: 'Unit 3: Monetary Policy',
                topics: [
                    {
                        name: 'The Federal Reserve System',
                        subtopics: ['The Federal Reserve Board', 'The Federal Open Market Committee', 'The Discount Rate', 'The Federal Funds Rate']
                    },
                    {
                        name: 'Monetary Policy Tools',
                        subtopics: ['Open Market Operations', 'Discount Rate Policy', 'Reserve Requirements', 'The Lender of Last Resort']
                    },
                    {
                        name: 'The Effects of Monetary Policy',
                        subtopics: ['The Multiplier Effect', 'The Crowding-Out Effect', 'The Liquidity Effect', 'The Interest Rate Channel']
                    }
                ]
            },
            {
                name: 'Unit 4: Fiscal Policy',
                topics: [
                    {
                        name: 'Government Revenue',
                        subtopics: ['Taxes', 'Tariffs', 'Fees', 'Bonds']
                    },
                    {
                        name: 'Government Expenditure',
                        subtopics: ['Transfer Payments', 'Public Goods', 'Military Expenditure', 'Infrastructure Investment']
                    },
                    {
                        name: 'The Effects of Fiscal Policy',
                        subtopics: ['The Multiplier Effect', 'The Crowding-Out Effect', 'The Ricardian Equivalence Theorem', 'The Fiscal Theory of the Price Level']
                    }
                ]
            },
            {
                name: 'Unit 5: International Trade',
                topics: [
                    {
                        name: 'Trade Theory',
                        subtopics: ['Comparative Advantage', 'Absolute Advantage', 'The Hecksher-Ohlin Model', 'The Ricardian Model']
                    },
                    {
                        name: 'Trade Policy',
                        subtopics: ['Tariffs', 'Quotas', 'Subsidies', 'Non-Tariff Barriers']
                    },
                    {
                        name: 'The Effects of Trade',
                        subtopics: ['The Gains from Trade', 'The Losses from Trade', 'The Terms of Trade', 'The Balance of Payments']
                    }
                ]
            },
            {
                name: 'Unit 6: Money and Banking',
                topics: [
                    {
                        name: 'The Money Supply',
                        subtopics: ['Money Multipliers', 'The Money Multiplier', 'The Reserve Requirement', 'The Money Supply Process']
                    },
                    {
                        name: 'The Banking System',
                        subtopics: ['The Federal Reserve System', 'Commercial Banks', 'Central Banks', 'The Lender of Last Resort']
                    },
                    {
                        name: 'The Effects of Money and Banking',
                        subtopics: ['The Money Multiplier Effect', 'The Crowding-Out Effect', 'The Liquidity Effect', 'The Interest Rate Channel']
                    }
                ]
            },
            {
                name: 'Unit 7: Financial Markets',
                topics: [
                    {
                        name: 'Financial Markets',
                        subtopics: ['Stock Markets', 'Bond Markets', 'Foreign Exchange Markets', 'Derivative Markets']
                    },
                    {
                        name: 'Financial Institutions',
                        subtopics: ['Investment Banks', 'Commercial Banks', 'Insurance Companies', 'Pension Funds']
                    },
                    {
                        name: 'The Effects of Financial Markets',
                        subtopics: ['The Efficient Market Hypothesis', 'The Market for Lemons', 'The Role of Information', 'The Role of Regulation']
                    }
                ]
            },
            {
                name: 'Unit 8: Economic Development',
                topics: [
                    {
                        name: 'Development Theories',
                        subtopics: ['The Neoclassical Growth Model', 'The Endogenous Growth Theory', 'The Dependency Theory', 'The World Systems Theory']
                    },
                    {
                        name: 'Development Policies',
                        subtopics: ['Structural Adjustment Programs', 'Trade Liberalization', 'Foreign Aid', 'Human Capital Investment']
                    },
                    {
                        name: 'The Effects of Development',
                        subtopics: ['The Poverty Trap', 'The Middle-Income Trap', 'The Resource Curse', 'The Development Dilemma']
                    }
                ]
            },
            {
                name: 'Unit 9: Macroeconomic Policy',
                topics: [
                    {
                        name: 'Policy Analysis',
                        subtopics: ['Cost-Benefit Analysis', 'Social Cost-Benefit Analysis', 'The Laffer Curve', 'The Fiscal Theory of the Price Level']
                    },
                    {
                        name: 'Policy Design',
                        subtopics: ['The Role of the Government', 'The Role of the Market', 'The Role of the Private Sector', 'The Role of the Public Sector']
                    },
                    {
                        name: 'Policy Evaluation',
                        subtopics: ['The Multiplier Effect', 'The Crowding-Out Effect', 'The Liquidity Effect', 'The Interest Rate Channel']
                    }
                ]
            }
        ]
    },
    'microeconomics': {
        name: '🤑 AP Microeconomics',
        description: 'Explore the principles of microeconomics, including the study of individual decision-making, market behavior, and the role of government in the economy.',
        examFormat: 'Multiple Choice (50 questions, 50% of score) and Free Response (2 questions, 50% of score)',
        units: [
            {
                name: 'Unit 1: Microeconomic Principles',
                topics: [
                    {
                        name: 'Consumer Behavior',
                        subtopics: ['Consumer Preferences', 'Budget Constraints', 'Utility Maximization', 'Indifference Curves']
                    },
                    {
                        name: 'Producer Behavior',
                        subtopics: ['Production Functions', 'Cost Minimization', 'Short-Run Decisions', 'Long-Run Decisions']
                    },
                    {
                        name: 'Market Equilibrium',
                        subtopics: ['Supply and Demand Analysis', 'Market Forces', 'Market Failures', 'Market Power']
                    }
                ]
            },
            {
                name: 'Unit 2: Elasticity',
                topics: [
                    {
                        name: 'Price Elasticity of Demand',
                        subtopics: ['Income Elasticity', 'Cross-Price Elasticity', 'Price Elasticity of Supply', 'Elasticity and Market Power']
                    },
                    {
                        name: 'Elasticity and Market Power',
                        subtopics: ['Monopoly', 'Oligopoly', 'Monopolistic Competition', 'Perfect Competition']
                    },
                    {
                        name: 'Elasticity and Market Failures',
                        subtopics: ['Externalities', 'Public Goods', 'Common Resources', 'Market Failures and Government Intervention']
                    }
                ]
            },
            {
                name: 'Unit 3: Market Structures',
                topics: [
                    {
                        name: 'Perfect Competition',
                        subtopics: ['Price Takers', 'Many Buyers and Sellers', 'Homogeneous Products', 'Free Entry and Exit']
                    },
                    {
                        name: 'Monopolistic Competition',
                        subtopics: ['Differentiated Products', 'Barriers to Entry', 'Product Differentiation', 'Non-Price Competition']
                    },
                    {
                        name: 'Oligopoly',
                        subtopics: ['Few Dominant Firms', 'Collusion', 'Game Theory', 'Strategic Interaction']
                    },
                    {
                        name: 'Monopoly',
                        subtopics: ['Single Seller', 'Market Power', 'Pricing Strategies', 'Regulation and Antitrust']
                    }
                ]
            },
            {
                name: 'Unit 4: Welfare Analysis',
                topics: [
                    {
                        name: 'Consumer Surplus',
                        subtopics: ['Willingness to Pay', 'Opportunity Cost', 'Deadweight Loss', 'Efficiency and Equity']
                    },
                    {
                        name: 'Producer Surplus',
                        subtopics: ['Marginal Revenue', 'Marginal Cost', 'Profit Maximization', 'Efficiency and Equity']
                    },
                    {
                        name: 'Efficiency and Equity',
                        subtopics: ['Market Efficiency', 'Income Distribution', 'Social Welfare', 'Government Policy', 'Market Failures']
                    }
                ]
            },
            {
                name: 'Unit 2: Slavery and the Slave Experience',
                topics: [
                    {
                        name: 'Slavery in the Americas',
                        subtopics: ['Slavery in the Caribbean', 'Slavery in the United States', 'Slavery in Brazil', 'Slavery in the Spanish Colonies', 'Slavery in Latin America']
                    },
                    {
                        name: 'The Slave Experience',
                        subtopics: ['Cultural Adaptation', 'Religion and Spirituality', 'Family and Community', 'Resistance and Rebellion', 'Slave Narratives']
                    }
                ]
            },
            {
                name: 'Unit 3: Emancipation and the Struggle for Freedom',
                topics: [
                    {
                        name: 'Emancipation',
                        subtopics: ['Abolition Movement', 'Emancipation Proclamation', 'Freedmen\'s Bureau', 'Reconstruction', 'Sharecropping']
                    },
                    {
                        name: 'The Struggle for Freedom',
                        subtopics: ['Civil Rights Movement', 'Black Power Movement', 'Black Nationalism', 'Black Feminism', 'Black Lives Matter']
                    }
                ]
            },
            {
                name: 'Unit 4: The African American Experience in the 20th and 21st Centuries',
                topics: [
                    {
                        name: 'The 20th Century',
                        subtopics: ['The Great Migration', 'The Harlem Renaissance', 'World War II', 'Cold War', 'Civil Rights Act of 1964']
                    },
                    {
                        name: 'The 21st Century',
                        subtopics: ['Mass Incarceration', 'Black Lives Matter', 'Black Wealth Gap', 'Black Education', 'Black Representation in Politics']
                    }
                ]
            }
        ]
    },
    'art-history': {
        name: '🎨 AP Art History',
        description: 'Explore the history of art from various periods and cultures, developing skills in close observation, analysis, interpretation, and writing.',
        examFormat: 'Multiple Choice (55 questions, 45% of score) and Free Response (3 essays, 55% of score)',
        units: [
            {
                name: 'Unit 1: Ancient Art',
                topics: [
                    {
                        name: 'Mesopotamian Art',
                        subtopics: ['Sumerian Art', 'Babylonian Art', 'Assyrian Art', 'Persian Art']
                    },
                    {
                        name: 'Egyptian Art',
                        subtopics: ['Old Kingdom Art', 'Middle Kingdom Art', 'New Kingdom Art', 'Late Period Art']
                    },
                    {
                        name: 'Ancient Greek Art',
                        subtopics: ['Archaic Art', 'Classical Art', 'Hellenistic Art', 'Roman Art']
                    },
                    {
                        name: 'Ancient Roman Art',
                        subtopics: ['Roman Republican Art', 'Roman Imperial Art', 'Roman Provincial Art', 'Roman Christian Art']
                    },
                    {
                        name: 'Ancient Near Eastern Art',
                        subtopics: ['Mesopotamian Art', 'Egyptian Art', 'Persian Art', 'Indian Art']
                    }
                ]
            },
            {
                name: 'Unit 2: Medieval Art',
                topics: [
                    {
                        name: 'Byzantine Art',
                        subtopics: ['Iconography', 'Architecture', 'Frescoes', 'Manuscripts']
                    },
                    {
                        name: 'Romanesque Art',
                        subtopics: ['Architecture', 'Frescoes', 'Manuscripts', 'Religious Art']
                    },
                    {
                        name: 'Gothic Art',
                        subtopics: ['Architecture', 'Frescoes', 'Stained Glass', 'Religious Art']
                    },
                    {
                        name: 'Islamic Art',
                        subtopics: ['Architecture', 'Calligraphy', 'Illumination', 'Ceramics']
                    },
                    {
                        name: 'Japanese Art',
                        subtopics: ['Nihonga', 'Shikishi', 'Ukiyo-e', 'Zen Buddhism']
                    }
                ]
            },
            {
                name: 'Unit 3: Renaissance Art',
                topics: [
                    {
                        name: 'Northern Renaissance',
                        subtopics: ['Jan van Eyck', 'Hans Memling', 'Jan Gossaert', 'Albrecht Dürer']
                    },
                    {
                        name: 'Italian Renaissance',
                        subtopics: ['Leonardo da Vinci', 'Michelangelo', 'Raphael', 'Botticelli']
                    },
                    {
                        name: 'Spanish Renaissance',
                        subtopics: ['El Greco', 'Diego Velázquez', 'Francisco Goya', 'Bartolomé Esteban Murillo']
                    },
                    {
                        name: 'French Renaissance',
                        subtopics: ['Leonard de Vinci', 'Raphael', 'Michelangelo', 'Botticelli']
                    },
                    {
                        name: 'Dutch Renaissance',
                        subtopics: ['Rembrandt', 'Vermeer', 'Frans Hals', 'Jan Steen']
                    }
                ]
            },
            {
                name: 'Unit 4: Baroque Art',
                topics: [
                    {
                        name: 'Italian Baroque',
                        subtopics: ['Caravaggio', 'Bernini', 'Titian', 'Velázquez']
                    },
                    {
                        name: 'Spanish Baroque',
                        subtopics: ['El Greco', 'Diego Velázquez', 'Bartolomé Esteban Murillo', 'Francisco de Zurbarán']
                    },
                    {
                        name: 'French Baroque',
                        subtopics: ['Le Brun', 'Le Vau', 'Louis XIV', 'Jean-Baptiste Colbert']
                    },
                    {
                        name: 'Dutch Baroque',
                        subtopics: ['Rembrandt', 'Vermeer', 'Jan Steen', 'Jan van Goyen']
                    },
                    {
                        name: 'German Baroque',
                        subtopics: ['Bach', 'Handel', 'Bach', 'Handel']
                    }
                ]
            },
            {
                name: 'Unit 5: Rococo and Neoclassicism',
                topics: [
                    {
                        name: 'Rococo',
                        subtopics: ['French Rococo', 'Italian Rococo', 'Spanish Rococo', 'German Rococo']
                    },
                    {
                        name: 'Neoclassicism',
                        subtopics: ['French Neoclassicism', 'Italian Neoclassicism', 'German Neoclassicism', 'Russian Neoclassicism']
                    },
                    {
                        name: 'Romanticism',
                        subtopics: ['French Romanticism', 'German Romanticism', 'English Romanticism', 'Russian Romanticism']
                    },
                    {
                        name: 'Realism',
                        subtopics: ['French Realism', 'German Realism', 'English Realism', 'Russian Realism']
                    },
                    {
                        name: 'Impressionism',
                        subtopics: ['French Impressionism', 'Impressionism', 'Post-Impressionism', 'Symbolism']
                    }
                ]
            },
            {
                name: 'Unit 6: Modern Art',
                topics: [
                    {
                        name: 'Modernism',
                        subtopics: ['Cubism', 'Futurism', 'Surrealism', 'Expressionism', 'Abstract Expressionism']
                    },
                    {
                        name: 'Postmodernism',
                        subtopics: ['Pop Art', 'Conceptual Art', 'Minimalism', 'Environmental Art', 'Installation Art']
                    },
                    {
                        name: 'Contemporary Art',
                        subtopics: ['Contemporary Art', 'Street Art', 'Digital Art', 'Performance Art', 'Video Art']
                    },
                    {
                        name: 'Global Art Movements',
                        subtopics: ['Globalization', 'Global Art Movements', 'New Media Art', 'Art and Technology', 'Art and Social Activism']
                    },
                    {
                        name: 'Art and Identity',
                        subtopics: ['Art and Identity', 'Art and Social Change', 'Art and Globalization', 'Art and Cultural Identity', 'Art and Identity']
                    }
                ]
            }
        ]
    },
    'studio-art-2d': {
        name: '🖼️ AP Studio Art: 2-D',
        description: 'Develop skills in two-dimensional art media, including drawing, painting, printmaking, and mixed media.',
        examFormat: 'Multiple Choice (45 questions, 50% of score) and Free Response (3 essays, 55% of score)',
        units: [
            {
                name: 'Unit 1: Drawing',
                topics: ['Portrait Drawing', 'Still Life Drawing', 'Landscape Drawing', 'Figure Drawing', 'Abstract Drawing']
            },
            {
                name: 'Unit 2: Painting',
                topics: ['Oil Painting', 'Acrylic Painting', 'Watercolor Painting', 'Gouache Painting', 'Fresco Painting']
            },
            {
                name: 'Unit 3: Printmaking',
                topics: ['Lithography', 'Screen Printing', 'Etching', 'Engraving', 'Intaglio']
            },
            {
                name: 'Unit 4: Mixed Media',
                topics: ['Collage', 'Collagraph', 'Photomontage', 'Assemblage', 'Installation']
            },
            {
                name: 'Unit 5: Portfolio Development',
                topics: ['Conceptual Development', 'Technical Skill Development', 'Artistic Style Development', 'Medium Exploration', 'Final Portfolio']
            }
        ]
    },
    'studio-art-3d': {
        name: '🗿 AP Studio Art: 3-D',
        description: 'Develop skills in three-dimensional art media, including sculpture, ceramics, and furniture design.',
        examFormat: 'Multiple Choice (45 questions, 50% of score) and Free Response (3 essays, 55% of score)',
        units: [
            {
                name: 'Unit 1: Sculpture',
                topics: ['Clay Sculpture', 'Wood Sculpture', 'Metal Sculpture', 'Stone Sculpture', 'Found Objects']
            },
            {
                name: 'Unit 2: Ceramics',
                topics: ['Pottery', 'Porcelain', 'Mural Ceramics', 'Ceramic Sculpture', 'Ceramic Installation']
            },
            {
                name: 'Unit 3: Furniture Design',
                topics: ['Furniture Design', 'Furniture Construction', 'Furniture Finish', 'Furniture Assembly', 'Furniture Design Project']
            },
            {
                name: 'Unit 4: Metalwork',
                topics: ['Jewelry', 'Metal Sculpture', 'Metal Furniture', 'Metal Installation', 'Metal Casting']
            },
            {
                name: 'Unit 5: Glasswork',
                topics: ['Glassblowing', 'Glass Casting', 'Glass Etching', 'Glass Staining', 'Glass Mosaic']
            },
            {
                name: 'Unit 6: Textile Arts',
                topics: ['Weaving', 'Knitting', 'Embroidery', 'Tie-Dye', 'Fabric Manipulation']
            },
            {
                name: 'Unit 7: Performance Art',
                topics: ['Installation Art', 'Performance Design', 'Theater Design', 'Dance', 'Music']
            },
            {
                name: 'Unit 8: Digital Art',
                topics: ['3D Modeling', 'Digital Painting', 'Digital Sculpture', 'Digital Animation', 'Interactive Media']
            }
        ]
    },
    'studio-art-drawing': {
        name: '✏️ AP Studio Art: Drawing',
        description: 'Develop skills in drawing media, including graphite, charcoal, ink, and digital drawing.',
        examFormat: 'Multiple Choice (45 questions, 50% of score) and Free Response (3 essays, 55% of score)',
        units: [
            {
                name: 'Unit 1: Drawing Techniques',
                topics: ['Portrait Drawing', 'Still Life Drawing', 'Landscape Drawing', 'Figure Drawing', 'Abstract Drawing']
            },
            {
                name: 'Unit 2: Drawing Media',
                topics: ['Graphite', 'Charcoal', 'Ink', 'Digital Drawing', 'Mixed Media']
            },
            {
                name: 'Unit 3: Drawing Practice',
                topics: ['Drawing from Life', 'Drawing from Memory', 'Drawing from Imagination', 'Drawing for Composition', 'Drawing for Expression']
            },
            {
                name: 'Unit 4: Drawing Projects',
                topics: ['Drawing Portfolio', 'Drawing Assignment', 'Drawing Critique', 'Drawing Workshop', 'Drawing Final Project']
            },
            {
                name: 'Unit 5: Drawing Theory',
                topics: ['Drawing Techniques', 'Drawing Principles', 'Drawing Composition', 'Drawing Perspective', 'Drawing Color Theory']
            }
        ]
    },
    'music-theory': {
        name: '🎵 AP Music Theory',
        description: 'Study music theory and analysis, including harmony, rhythm, form, and composition.',
        examFormat: 'Multiple Choice (100 questions, 66.7% of score) and Free Response (2 questions, 33.3% of score)',
        units: [
            {
                name: 'Unit 1: Music Fundamentals',
                topics: [
                    {
                        name: 'Pitch',
                        subtopics: ['Notes', 'Scales', 'Intervals', 'Chromatic Scale', 'Octave']
                    },
                    {
                        name: 'Rhythm',
                        subtopics: ['Beats', 'Meter', 'Tempo', 'Syncopation', 'Rhythmic Patterns']
                    },
                    {
                        name: 'Form',
                        subtopics: ['Binary Form', 'Ternary Form', 'Quaternary Form', 'Rondo Form', 'Sonata Form']
                    },
                    {
                        name: 'Harmony',
                        subtopics: ['Major and Minor Scales', 'Chords', 'Triads', 'Seventh Chords', 'Harmonic Function']
                    },
                    {
                        name: 'Musical Analysis',
                        subtopics: ['Analysis Techniques', 'Form Analysis', 'Harmony Analysis', 'Rhythm Analysis', 'Tonal Analysis']
                    }
                ]
            },
            {
                name: 'Unit 2: Music Composition',
                topics: [
                    {
                        name: 'Composition Techniques',
                        subtopics: ['Form and Structure', 'Theme and Variation', 'Counterpoint', 'Fugue', 'Improvisation']
                    },
                    {
                        name: 'Orchestration',
                        subtopics: ['Instrumentation', 'Timbre', 'Orchestration', 'Orchestration Techniques', 'Orchestration Project']
                    },
                    {
                        name: 'Music Analysis',
                        subtopics: ['Analysis Techniques', 'Form Analysis', 'Harmony Analysis', 'Rhythm Analysis', 'Tonal Analysis']
                    }
                ]
            },
            {
                name: 'Unit 3: Music Analysis',
                topics: [
                    {
                        name: 'Analytical Techniques',
                        subtopics: ['Form Analysis', 'Harmony Analysis', 'Rhythm Analysis', 'Tonal Analysis', 'Counterpoint Analysis']
                    },
                    {
                        name: 'Music Genres',
                        subtopics: ['Classical', 'Romantic', 'Baroque', 'Impressionist', 'Contemporary']
                    },
                    {
                        name: 'Music Periods',
                        subtopics: ['Baroque', 'Classical', 'Romantic', 'Impressionist', 'Contemporary']
                    }
                ]
            },
            {
                name: 'Unit 4: Music History',
                topics: [
                    {
                        name: 'Historical Periods',
                        subtopics: ['Baroque', 'Classical', 'Romantic', 'Impressionist', 'Contemporary']
                    },
                    {
                        name: 'Cultural Context',
                        subtopics: ['Baroque Culture', 'Classical Culture', 'Romantic Culture', 'Impressionist Culture', 'Contemporary Culture']
                    },
                    {
                        name: 'Music Movements',
                        subtopics: ['Baroque Movements', 'Classical Movements', 'Romantic Movements', 'Impressionist Movements', 'Contemporary Movements']
                    },
                    {
                        name: 'Music Influences',
                        subtopics: ['Baroque Influences', 'Classical Influences', 'Romantic Influences', 'Impressionist Influences', 'Contemporary Influences']
                    },
                    {
                        name: 'Music and Technology',
                        subtopics: ['Baroque Technology', 'Classical Technology', 'Romantic Technology', 'Impressionist Technology', 'Contemporary Technology']
                    }
                ]
            },
            {
                name: 'Unit 5: Music and Culture',
                topics: [
                    {
                        name: 'Music and Society',
                        subtopics: ['Music in Ancient Societies', 'Music in Medieval Societies', 'Music in Renaissance Societies', 'Music in Baroque Societies', 'Music in Modern Societies']
                    },
                    {
                        name: 'Music and Identity',
                        subtopics: ['National Music', 'Popular Music', 'Classical Music', 'Jazz Music', 'World Music']
                    },
                    {
                        name: 'Music and Technology',
                        subtopics: ['Music and Technology', 'Music and Media', 'Music and Social Change', 'Music and Globalization', 'Music and Identity']
                    },
                    {
                        name: 'Music and Creativity',
                        subtopics: ['Music Composition', 'Music Performance', 'Music Analysis', 'Music Interpretation', 'Music Creativity']
                    },
                    {
                        name: 'Music and Education',
                        subtopics: ['Music Education', 'Music Therapy', 'Music and Health', 'Music and Well-being', 'Music and Social Change']
                    }
                ]
            }
        ]
    },
    'chinese-language': {
        name: '🇨🇳 AP Chinese',
        description: 'Develop reading and writing skills in Chinese, focusing on grammar, vocabulary, and cultural context.',
        examFormat: 'Multiple Choice (45 questions, 45% of score) and Free Response (3 essays, 55% of score)',
        units: [
            {
                name: 'Unit 1: Grammar and Vocabulary',
                topics: ['Chinese Grammar Basics', 'Chinese Verb Tenses', 'Chinese Nouns and Adjectives', 'Chinese Adverbs and Prepositions', 'Chinese Pronunciation']
            },
            {
                name: 'Unit 2: Reading and Comprehension',
                topics: ['Chinese Reading Skills', 'Analyzing Cultural Context', 'Understanding Social Issues', 'Reading for Information', 'Reading for Entertainment']
            },
            {
                name: 'Unit 3: Writing and Composition',
                topics: ['Chinese Essay Writing', 'Chinese Report Writing', 'Chinese Creative Writing', 'Chinese Business Writing', 'Chinese Technical Writing']
            },
            {
                name: 'Unit 4: Listening and Speaking',
                topics: ['Chinese Listening Skills', 'Chinese Speaking Skills', 'Chinese Pronunciation Practice', 'Chinese Cultural Etiquette', 'Chinese Interpersonal Communication']
            },
            {
                name: 'Unit 5: Exam Preparation',
                topics: ['Multiple Choice Strategies', 'Essay Writing Practice', 'Speaking Practice', 'Listening Practice', 'Reading Practice']
            }
        ]
    },
    'japanese-language': {
        name: '🇯🇵 AP Japanese',
        description: 'Develop reading and writing skills in Japanese, focusing on grammar, vocabulary, and cultural context.',
        examFormat: 'Multiple Choice (45 questions, 45% of score) and Free Response (3 essays, 55% of score)',
        units: [
            {
                name: 'Unit 1: Grammar and Vocabulary',
                topics: ['Japanese Grammar Basics', 'Japanese Verb Tenses', 'Japanese Nouns and Adjectives', 'Japanese Adverbs and Prepositions', 'Japanese Pronunciation']
            },
            {
                name: 'Unit 2: Reading and Comprehension',
                topics: ['Japanese Reading Skills', 'Analyzing Cultural Context', 'Understanding Social Issues', 'Reading for Information', 'Reading for Entertainment']
            },
            {
                name: 'Unit 3: Writing and Composition',
                topics: ['Japanese Essay Writing', 'Japanese Report Writing', 'Japanese Creative Writing', 'Japanese Business Writing', 'Japanese Technical Writing']
            },
            {
                name: 'Unit 4: Listening and Speaking',
                topics: ['Japanese Listening Skills', 'Japanese Speaking Skills', 'Japanese Pronunciation Practice', 'Japanese Cultural Etiquette', 'Japanese Interpersonal Communication']
            },
            {
                name: 'Unit 5: Exam Preparation',
                topics: ['Multiple Choice Strategies', 'Essay Writing Practice', 'Speaking Practice', 'Listening Practice', 'Reading Practice']
            }
        ]
    },
    'italian-language': {
        name: '🇮🇹 AP Italian',
        description: 'Develop reading and writing skills in Italian, focusing on grammar, vocabulary, and cultural context.',
        examFormat: 'Multiple Choice (45 questions, 45% of score) and Free Response (3 essays, 55% of score)',
        units: [
            {
                name: 'Unit 1: Grammar and Vocabulary',
                topics: ['Italian Grammar Basics', 'Italian Verb Tenses', 'Italian Nouns and Adjectives', 'Italian Adverbs and Prepositions', 'Italian Pronunciation']
            },
            {
                name: 'Unit 2: Reading and Comprehension',
                topics: ['Italian Reading Skills', 'Analyzing Cultural Context', 'Understanding Social Issues', 'Reading for Information', 'Reading for Entertainment']
            },
            {
                name: 'Unit 3: Writing and Composition',
                topics: ['Italian Essay Writing', 'Italian Report Writing', 'Italian Creative Writing', 'Italian Business Writing', 'Italian Technical Writing']
            },
            {
                name: 'Unit 4: Listening and Speaking',
                topics: ['Italian Listening Skills', 'Italian Speaking Skills', 'Italian Pronunciation Practice', 'Italian Cultural Etiquette', 'Italian Interpersonal Communication']
            },
            {
                name: 'Unit 5: Exam Preparation',
                topics: ['Multiple Choice Strategies', 'Essay Writing Practice', 'Speaking Practice', 'Listening Practice', 'Reading Practice']
            }
        ]
    },
    'latin': {
        name: '🏛️ AP Latin',
        description: 'Develop reading and writing skills in Latin, focusing on grammar, vocabulary, and cultural context.',
        examFormat: 'Multiple Choice (45 questions, 45% of score) and Free Response (3 essays, 55% of score)',
        units: [
            {
                name: 'Unit 1: Grammar and Vocabulary',
                topics: ['Latin Grammar Basics', 'Latin Verb Tenses', 'Latin Nouns and Adjectives', 'Latin Adverbs and Prepositions', 'Latin Pronunciation']
            },
            {
                name: 'Unit 2: Reading and Comprehension',
                topics: ['Latin Reading Skills', 'Analyzing Cultural Context', 'Understanding Social Issues', 'Reading for Information', 'Reading for Entertainment']
            },
            {
                name: 'Unit 3: Writing and Composition',
                topics: ['Latin Essay Writing', 'Latin Report Writing', 'Latin Creative Writing', 'Latin Business Writing', 'Latin Technical Writing']
            },
            {
                name: 'Unit 4: Listening and Speaking',
                topics: ['Latin Listening Skills', 'Latin Speaking Skills', 'Latin Pronunciation Practice', 'Latin Cultural Etiquette', 'Latin Interpersonal Communication']
            },
            {
                name: 'Unit 5: Exam Preparation',
                topics: ['Multiple Choice Strategies', 'Essay Writing Practice', 'Speaking Practice', 'Listening Practice', 'Reading Practice']
            }
        ]
    },
    'psychology': {
        name: '🧠 AP Psychology',
        description: 'Explore the principles of psychology, including cognitive, social, and developmental aspects.',
        examFormat: 'Multiple Choice (40 questions, 50% of score) and Free Response (6 questions, 50% of score)',
        units: [
            {
                name: 'Unit 1: Introduction to Psychology',
                topics: ['The Scientific Study of Psychology', 'Research Methods', 'Biological Bases of Behavior', 'Sensory Perception', 'Consciousness']
            },
            {
                name: 'Unit 2: Cognitive Psychology',
                topics: ['Memory', 'Learning', 'Thinking and Problem Solving', 'Language and Communication', 'Perception']
            },
            {
                name: 'Unit 3: Social Psychology',
                topics: ['Social Cognition', 'Social Influence', 'Attitudes and Persuasion', 'Group Dynamics', 'Prejudice and Discrimination']
            },
            {
                name: 'Unit 4: Developmental Psychology',
                topics: ['Infancy and Childhood', 'Adolescence', 'Adulthood', 'Midlife and Aging', 'Lifespan Development']
            },
            {
                name: 'Unit 5: Clinical Psychology',
                topics: ['Assessment and Diagnosis', 'Treatment Modalities', 'Psychotherapy', 'Biological Therapies', 'Psychopharmacology']
            },
            {
                name: 'Unit 6: Abnormal Psychology',
                topics: ['Theories of Abnormal Behavior', 'Mental Disorders', 'Assessment and Diagnosis', 'Treatment Modalities', 'Psychopathology']
            },
            {
                name: 'Unit 7: Industrial and Organizational Psychology',
                topics: ['Job Analysis and Design', 'Selection and Training', 'Motivation and Performance', 'Leadership and Management', 'Organizational Behavior']
            },
            {
                name: 'Unit 8: Social and Personality Psychology',
                topics: ['Social Cognition', 'Social Influence', 'Attitudes and Persuasion', 'Group Dynamics', 'Prejudice and Discrimination']
            }
        ]
    },
    'us-government': {
        name: '🧑🏽‍⚖️ AP US Government',
        description: 'Explore the principles of American democracy, the structure and functions of the U.S. government, and the rights and responsibilities of citizens.',
        examFormat: 'Multiple Choice (50 questions, 50% of score) and Free Response (2 questions, 50% of score)',
        units: [
            {
                name: 'Unit 1: American Government',
                topics: [
                    {
                        name: 'The Founding',
                        subtopics: ['The Articles of Confederation', 'The Constitutional Convention', 'The Constitution', 'The Bill of Rights']
                    },
                    {
                        name: 'The Presidency',
                        subtopics: ['The Executive Branch', 'The President', 'The Cabinet', 'The Vice President']
                    },
                    {
                        name: 'The Legislative Branch',
                        subtopics: ['The Congress', 'The House of Representatives', 'The Senate', 'Congressional Procedure']
                    },
                    {
                        name: 'The Judicial Branch',
                        subtopics: ['The Supreme Court', 'The Federal Courts', 'Judicial Review', 'Judicial Activism']
                    }
                ]
            },
            {
                name: 'Unit 2: American Politics',
                topics: [
                    {
                        name: 'Political Parties',
                        subtopics: ['The Two-Party System', 'Third Parties', 'Political Party Platforms', 'Political Party Organizations']
                    },
                    {
                        name: 'The Electoral Process',
                        subtopics: ['The Electoral College', 'The Popular Vote', 'The Electoral College Voting System', 'The Role of the Media']
                    },
                    {
                        name: 'Congressional Elections',
                        subtopics: ['The Role of Incumbency', 'Gerrymandering', 'Redistricting', 'The Role of Money in Politics']
                    },
                    {
                        name: 'Presidential Elections',
                        subtopics: ['The Role of Incumbency', 'The Role of the Media', 'The Role of Money in Politics', 'The Electoral College']
                    }
                ]
            },
            {
                name: 'Unit 3: Civil Liberties and Civil Rights',
                topics: [
                    {
                        name: 'Civil Liberties',
                        subtopics: ['Freedom of Speech', 'Freedom of Religion', 'Freedom of the Press', 'Freedom of Assembly', 'Freedom of Association']
                    },
                    {
                        name: 'Civil Rights',
                        subtopics: ['The Civil Rights Movement', 'Civil Rights Acts', 'Voting Rights Act', 'Affirmative Action', 'Equal Protection']
                    },
                    {
                        name: 'Liberty and Security',
                        subtopics: ['The War on Terror', 'National Security', 'Civil Liberties vs. National Security', 'Balancing Acts']
                    }
                ]
            },
            {
                name: 'Unit 4: American Foreign Policy',
                topics: [
                    {
                        name: 'The Role of the United States in the World',
                        subtopics: ['American Exceptionalism', 'The Globalization of the World', 'The Rise of China', 'The Rise of India']
                    },
                    {
                        name: 'Theories of Foreign Policy',
                        subtopics: ['Realism', 'Neoliberalism', 'Neoconservatism', 'Liberalism', 'Constructivism']
                    },
                    {
                        name: 'The Use of Force',
                        subtopics: ['Preemptive War', 'Humanitarian Intervention', 'The War on Terror', 'The Use of Force in International Law']
                    },
                    {
                        name: 'The Role of International Organizations',
                        subtopics: ['The United Nations', 'The World Trade Organization', 'The International Monetary Fund', 'The World Bank', 'The North Atlantic Treaty Organization']
                    }
                ]
            },
            {
                name: 'Unit 5: The Presidency',
                topics: [
                    {
                        name: 'The Presidency and Congress',
                        subtopics: ['The Separation of Powers', 'The Role of the President', 'The Role of Congress', 'The Role of the Executive Branch']
                    },
                    {
                        name: 'The Presidency and the Courts',
                        subtopics: ['The Role of the Supreme Court', 'The Role of the Federal Courts', 'Judicial Review', 'Judicial Activism']
                    },
                    {
                        name: 'The Presidency and the Public',
                        subtopics: ['The Role of the Media', 'The Role of Public Opinion', 'The Role of Interest Groups', 'The Role of the Electorate']
                    }
                ]
            },
            {
                name: 'Unit 6: The Judicial Branch',
                topics: [
                    {
                        name: 'The Judicial Branch and the Constitution',
                        subtopics: ['The Role of the Supreme Court', 'The Role of the Federal Courts', 'Judicial Review', 'Judicial Activism']
                    },
                    {
                        name: 'The Judicial Branch and the Presidency',
                        subtopics: ['The Role of the President', 'The Role of the Executive Branch', 'The Role of the Supreme Court', 'The Role of the Federal Courts']
                    },
                    {
                        name: 'The Judicial Branch and the Public',
                        subtopics: ['The Role of the Media', 'The Role of Public Opinion', 'The Role of Interest Groups', 'The Role of the Electorate']
                    }
                ]
            },
            {
                name: 'Unit 7: The Legislative Branch',
                topics: [
                    {
                        name: 'The Legislative Branch and the Constitution',
                        subtopics: ['The Role of the Congress', 'The Role of the House of Representatives', 'The Role of the Senate', 'Congressional Procedure']
                    },
                    {
                        name: 'The Legislative Branch and the Presidency',
                        subtopics: ['The Role of the President', 'The Role of the Executive Branch', 'The Role of Congress', 'Congressional Procedure']
                    },
                    {
                        name: 'The Legislative Branch and the Public',
                        subtopics: ['The Role of the Media', 'The Role of Public Opinion', 'The Role of Interest Groups', 'The Role of the Electorate']
                    }
                ]
            },
            {
                name: 'Unit 8: The Executive Branch',
                topics: [
                    {
                        name: 'The Executive Branch and the Constitution',
                        subtopics: ['The Role of the President', 'The Role of the Cabinet', 'The Role of the Vice President', 'The Role of the Executive Branch']
                    },
                    {
                        name: 'The Executive Branch and the Legislative Branch',
                        subtopics: ['The Role of Congress', 'The Role of the House of Representatives', 'The Role of the Senate', 'Congressional Procedure']
                    },
                    {
                        name: 'The Executive Branch and the Judicial Branch',
                        subtopics: ['The Role of the Supreme Court', 'The Role of the Federal Courts', 'Judicial Review', 'Judicial Activism']
                    },
                    {
                        name: 'The Executive Branch and the Public',
                        subtopics: ['The Role of the Media', 'The Role of Public Opinion', 'The Role of Interest Groups', 'The Role of the Electorate']
                    }
                ]
            },
            {
                name: 'Unit 9: The American Political System',
                topics: [
                    {
                        name: 'The American Political System and the Constitution',
                        subtopics: ['The Separation of Powers', 'Checks and Balances', 'The Role of the States', 'The Role of the Federal Government']
                    },
                    {
                        name: 'The American Political System and the Presidency',
                        subtopics: ['The Role of the President', 'The Role of the Executive Branch', 'The Role of Congress', 'The Role of the Supreme Court']
                    },
                    {
                        name: 'The American Political System and the Public',
                        subtopics: ['The Role of the Media', 'The Role of Public Opinion', 'The Role of Interest Groups', 'The Role of the Electorate']
                    }
                ]
            }
        ]
    },
    'comparative-government': {
        name: '🗳️ AP Comparative Government',
        description: 'Compare and contrast the political systems of different countries, focusing on the principles of democracy, the structure and functions of government, and the rights and responsibilities of citizens.',
        examFormat: 'Multiple Choice (50 questions, 50% of score) and Free Response (2 questions, 50% of score)',
        units: [
            {
                name: 'Unit 1: Comparative Democracy',
                topics: [
                    {
                        name: 'Democracy in the United States',
                        subtopics: ['The Founding', 'The Presidency', 'The Legislative Branch', 'The Judicial Branch']
                    },
                    {
                        name: 'Democracy in Other Countries',
                        subtopics: ['The United Kingdom', 'France', 'Germany', 'Japan', 'South Korea']
                    },
                    {
                        name: 'Comparing Democratic Systems',
                        subtopics: ['The Role of Political Parties', 'The Electoral Process', 'Civil Liberties and Civil Rights', 'The Role of the Media']
                    }
                ]
            },
            {
                name: 'Unit 2: Comparative Authoritarianism',
                topics: [
                    {
                        name: 'Authoritarianism in the United States',
                        subtopics: ['The Role of the Military', 'The Role of the Police', 'The Role of the Intelligence Agencies']
                    },
                    {
                        name: 'Authoritarianism in Other Countries',
                        subtopics: ['China', 'Russia', 'North Korea', 'Venezuela', 'Turkey']
                    },
                    {
                        name: 'Comparing Authoritarian Systems',
                        subtopics: ['The Role of the Military', 'The Role of the Police', 'The Role of the Intelligence Agencies', 'The Role of the Media']
                    }
                ]
            },
            {
                name: 'Unit 3: Comparative Federalism',
                topics: [
                    {
                        name: 'Federalism in the United States',
                        subtopics: ['The Role of the States', 'The Role of the Federal Government', 'The Role of the Courts']
                    },
                    {
                        name: 'Federalism in Other Countries',
                        subtopics: ['Canada', 'India', 'Germany', 'Switzerland', 'Australia']
                    },
                    {
                        name: 'Comparing Federal Systems',
                        subtopics: ['The Role of the States', 'The Role of the Federal Government', 'The Role of the Courts', 'The Role of the Media']
                    }
                ]
            },
            {
                name: 'Unit 4: Comparative Political Economy',
                topics: [
                    {
                        name: 'Capitalism in the United States',
                        subtopics: ['The Role of the Market', 'The Role of the Government', 'The Role of the Courts']
                    },
                    {
                        name: 'Capitalism in Other Countries',
                        subtopics: ['China', 'Japan', 'Germany', 'South Korea', 'Singapore']
                    },
                    {
                        name: 'Comparing Capitalist Systems',
                        subtopics: ['The Role of the Market', 'The Role of the Government', 'The Role of the Courts', 'The Role of the Media']
                    }
                ]
            },
            {
                name: 'Unit 5: Comparative Political Culture',
                topics: [
                    {
                        name: 'Political Culture in the United States',
                        subtopics: ['The Role of the Family', 'The Role of the Church', 'The Role of the Media']
                    },
                    {
                        name: 'Political Culture in Other Countries',
                        subtopics: ['Japan', 'South Korea', 'Germany', 'France', 'Italy']
                    },
                    {
                        name: 'Comparing Political Cultures',
                        subtopics: ['The Role of the Family', 'The Role of the Church', 'The Role of the Media', 'The Role of the Courts']
                    }
                ]
            },
            {
                name: 'Unit 6: Comparative Foreign Policy',
                topics: [
                    {
                        name: 'Foreign Policy in the United States',
                        subtopics: ['The Role of the United Nations', 'The Role of the European Union', 'The Role of the NATO', 'The Role of the G7']
                    },
                    {
                        name: 'Foreign Policy in Other Countries',
                        subtopics: ['China', 'Russia', 'Japan', 'South Korea', 'Germany']
                    },
                    {
                        name: 'Comparing Foreign Policy',
                        subtopics: ['The Role of the United Nations', 'The Role of the European Union', 'The Role of the NATO', 'The Role of the G7', 'The Role of the Courts']
                    }
                ]
            },
            {
                name: 'Unit 7: Comparative Political Parties',
                topics: [
                    {
                        name: 'Political Parties in the United States',
                        subtopics: ['The Role of the Democratic Party', 'The Role of the Republican Party', 'The Role of Third Parties']
                    },
                    {
                        name: 'Political Parties in Other Countries',
                        subtopics: ['Germany', 'France', 'Italy', 'Spain', 'Japan']
                    },
                    {
                        name: 'Comparing Political Parties',
                        subtopics: ['The Role of the Democratic Party', 'The Role of the Republican Party', 'The Role of Third Parties', 'The Role of the Courts']
                    }
                ]
            },
            {
                name: 'Unit 8: Comparative Civil Society',
                topics: [
                    {
                        name: 'Civil Society in the United States',
                        subtopics: ['The Role of Non-Governmental Organizations', 'The Role of the Media', 'The Role of the Courts']
                    },
                    {
                        name: 'Civil Society in Other Countries',
                        subtopics: ['Germany', 'France', 'Italy', 'Spain', 'Japan']
                    },
                    {
                        name: 'Comparing Civil Society',
                        subtopics: ['The Role of Non-Governmental Organizations', 'The Role of the Media', 'The Role of the Courts', 'The Role of the Political Parties']
                    }
                ]
            },
            {
                name: 'Unit 9: Comparative Political Systems',
                topics: [
                    {
                        name: 'Comparing Political Systems',
                        subtopics: ['The Role of the States', 'The Role of the Federal Government', 'The Role of the Courts', 'The Role of the Media']
                    },
                    {
                        name: 'Comparing Democratic Systems',
                        subtopics: ['The Role of Political Parties', 'The Electoral Process', 'Civil Liberties and Civil Rights', 'The Role of the Media']
                    },
                    {
                        name: 'Comparing Authoritarian Systems',
                        subtopics: ['The Role of the Military', 'The Role of the Police', 'The Role of the Intelligence Agencies', 'The Role of the Media']
                    },
                    {
                        name: 'Comparing Federal Systems',
                        subtopics: ['The Role of the States', 'The Role of the Federal Government', 'The Role of the Courts', 'The Role of the Media']
                    },
                    {
                        name: 'Comparing Capitalist Systems',
                        subtopics: ['The Role of the Market', 'The Role of the Government', 'The Role of the Courts', 'The Role of the Media']
                    },
                    {
                        name: 'Comparing Political Cultures',
                        subtopics: ['The Role of the Family', 'The Role of the Church', 'The Role of the Media', 'The Role of the Courts']
                    },
                    {
                        name: 'Comparing Foreign Policy',
                        subtopics: ['The Role of the United Nations', 'The Role of the European Union', 'The Role of the NATO', 'The Role of the G7', 'The Role of the Courts']
                    },
                    {
                        name: 'Comparing Political Parties',
                        subtopics: ['The Role of the Democratic Party', 'The Role of the Republican Party', 'The Role of Third Parties', 'The Role of the Courts']
                    },
                    {
                        name: 'Comparing Civil Society',
                        subtopics: ['The Role of Non-Governmental Organizations', 'The Role of the Media', 'The Role of the Courts', 'The Role of the Political Parties']
                    }
                ]
            }
        ]
    },
    'seminar': {
        name: '💬 AP Seminar',
        description: 'Develop skills in research, writing, and presentation, preparing for college-level academic work and future careers.',
        examFormat: 'Multiple Choice (40 questions, 50% of score) and Free Response (2 essays, 50% of score)',
        units: [
            {
                name: 'Unit 1: Research and Writing',
                topics: ['Research Methods', 'Writing a Research Paper', 'Writing a Research Proposal', 'Writing a Literature Review', 'Writing a Thesis Statement']
            },
            {
                name: 'Unit 2: Presentation Skills',
                topics: ['Public Speaking', 'Group Presentations', 'PowerPoint Presentations', 'Visual Aids', 'Effective Communication Techniques']
            },
            {
                name: 'Unit 3: Academic Integrity',
                topics: ['Plagiarism', 'Academic Dishonesty', 'Citation Styles', 'Ethical Research Practices', 'Scholarly Integrity']
            },
            {
                name: 'Unit 4: College Readiness',
                topics: ['Time Management', 'Note-Taking', 'Study Skills', 'Test Preparation', 'College Application Process']
            },
            {
                name: 'Unit 5: Professional Development',
                topics: ['Career Exploration', 'Resume Writing', 'Cover Letters', 'Networking', 'Interview Skills']
            }
        ]
    },
    'research': {
        name: '🔍 AP Research',
        description: 'Develop skills in research design, data collection, analysis, and presentation, preparing for college-level research projects.',
        examFormat: 'Multiple Choice (40 questions, 50% of score) and Free Response (2 essays, 50% of score)',
        units: [
            {
                name: 'Unit 1: Research Design',
                topics: ['Research Questions', 'Research Hypotheses', 'Research Methods', 'Sampling Techniques', 'Data Collection Methods']
            },
            {
                name: 'Unit 2: Data Analysis',
                topics: ['Descriptive Statistics', 'Inferential Statistics', 'Research Design', 'Data Collection', 'Data Analysis Software']
            },
            {
                name: 'Unit 3: Research Presentation',
                topics: ['Research Paper', 'Research Proposal', 'Data Visualization', 'Research Poster', 'Oral Presentation']
            },
            {
                name: 'Unit 4: Research Ethics',
                topics: ['Research Ethics', 'Bias and Fairness', 'Confidentiality and Anonymity', 'Intellectual Property', 'Research Integrity']
            },
            {
                name: 'Unit 5: Research Project',
                topics: ['Research Project Proposal', 'Research Project Design', 'Research Data Collection', 'Research Analysis', 'Research Report']
            }
        ]
    },
    'african-american-studies': {
        name: '✊🏿 AP African American Studies',
        description: 'Explore the history, culture, and contributions of African Americans, preparing for college-level academic work and future careers.',
        examFormat: 'Multiple Choice (40 questions, 50% of score) and Free Response (6 questions, 50% of score)',
        units: [
            {
                name: 'Unit 1: African American History',
                topics: ['The African American Experience', 'The Harlem Renaissance', 'The Civil Rights Movement', 'Black Power Movement', 'Black Lives Matter']
            },
            {
                name: 'Unit 2: African American Culture',
                topics: ['Music', 'Literature', 'Art', 'Food', 'Religion']
            },
            {
                name: 'Unit 3: African American Contributions',
                topics: ['Economic Contributions', 'Social Contributions', 'Political Contributions', 'Cultural Contributions', 'Educational Contributions']
            },
            {
                name: 'Unit 4: African American Identity',
                topics: ['Racial Identity', 'Gender Identity', 'Class Identity', 'Generational Identity', 'Cultural Identity']
            },
            {
                name: 'Unit 5: African American Social Issues',
                topics: ['Racial Inequality', 'Gender Inequality', 'Class Inequality', 'Educational Inequality', 'Health Inequality']
            }
        ]
    }
};

// DOM Elements - convert to object for better organization
const elements = {
    apSelectionSection: document.getElementById("apSelectionSection"),
    apCourseSection: document.getElementById('apCourseSection'),
    apQuestionsSection: document.getElementById('apQuestionsSection'),
    apResultsSection: document.getElementById('apResultsSection'),
    loadingScreen: document.getElementById('loadingScreen'),
    apTestButtons: document.querySelectorAll('.ap-test-btn'),
    backToApTests: document.getElementById('backToApTests'),
    backToApCourse: document.getElementById('backToApCourse'),
    apCourseName: document.getElementById('apCourseName'),
    apCourseDescription: document.getElementById('apCourseDescription'),
    apExamFormat: document.getElementById('apExamFormat'),
    apUnitsAccordion: document.getElementById('apUnitsAccordion'),
    apQuestionsTitle: document.getElementById('apQuestionsTitle'),
    apQuestionsForm: document.getElementById('apQuestionsForm'),
    submitApQuestions: document.getElementById('submitApQuestions'),
    returnToUnit: document.getElementById('returnToUnit'),
    tryAnotherSet: document.getElementById('tryAnotherSet'),
    backToCourse: document.getElementById('backToCourse'),
    startFullPracticeTest: document.getElementById('startFullPracticeTest'),
    timerContainer: document.getElementById('timerContainer'),
    timerDisplay: document.getElementById('timerDisplay'),
    apCountdownArea: document.getElementById('apCountdownArea')
};

// Function to generate quiz button for topics
function handleQuizButtonClick(topic) {
    console.log('Quiz button clicked for topic:', topic);
    
    // Find the course and unit for this topic
    const found = {
        selectedCourse: null,
        selectedUnit: null,
        selectedTopic: null,
        isSubtopic: false
    };
    
    // Search through all courses and units to find the topic or subtopic
    for (const courseId in apCoursesData) {
        const course = apCoursesData[courseId];
        for (const unit of course.units) {
            // Check if it's a unit name
            if (unit.name === topic) {
                found.selectedCourse = courseId;
                found.selectedUnit = unit.name;
                break;
            }
            
            // Check if it's a topic or subtopic
            for (const topicItem of unit.topics) {
                if (typeof topicItem === 'object' && topicItem.name) {
                    // Check if it's a topic name
                    if (topicItem.name === topic) {
                        found.selectedCourse = courseId;
                        found.selectedUnit = unit.name;
                        found.selectedTopic = topicItem.name;
                        break;
                    }
                    
                    // Check if it's a subtopic
                    if (topicItem.subtopics && topicItem.subtopics.includes(topic)) {
                        found.selectedCourse = courseId;
                        found.selectedUnit = unit.name;
                        found.selectedTopic = topicItem.name;
                        found.isSubtopic = true;
                        break;
                    }
                } else if (topicItem === topic) {
                    // Legacy format (string topics)
                    found.selectedCourse = courseId;
                    found.selectedUnit = unit.name;
                    found.selectedTopic = topicItem;
                    break;
                }
            }
            
            if (found.selectedCourse) break;
        }
        if (found.selectedCourse) break;
    }
    
    if (found.selectedCourse) {
        console.log(`Found: Course=${found.selectedCourse}, Unit=${found.selectedUnit}, Topic=${found.selectedTopic}, isSubtopic=${found.isSubtopic}`);
        generateQuizForTopic(found.selectedCourse, found.selectedUnit, topic, found.isSubtopic, found.selectedTopic);
    } else {
        console.error('Could not find course and unit for topic:', topic);
    }
}

// Make handleQuizButtonClick globally accessible
window.handleQuizButtonClick = handleQuizButtonClick;

// Function to generate a quiz for a specific topic
function generateQuizForTopic(course, unit, topic, isSubtopic = false, parentTopic = null) {
    console.log(`Generating quiz for ${isSubtopic ? 'subtopic' : 'topic'}: ${topic} in ${unit} of ${course}`);
    
    // Hide course section and show questions section
    elements.apCourseSection.classList.add('hidden');
    elements.apQuestionsSection.classList.remove('hidden');
    
    // Set the title with context
    if (isSubtopic && parentTopic) {
        elements.apQuestionsTitle.textContent = `Quiz: ${parentTopic} - ${topic}`;
    } else {
        elements.apQuestionsTitle.textContent = `Quiz: ${topic}`;
    }
    
    // Show loading screen while generating questions
    toggleLoadingScreen(true);
    elements.loadingScreen.querySelector('p').textContent = 'Generating quiz questions...';
    
    // Generate questions with AI
    const contextInfo = isSubtopic && parentTopic ? 
        `${topic} (a subtopic of ${parentTopic})` : topic;
    
    generateQuestionsWithAI(contextInfo, apCoursesData[course].name, unit)
        .then(questions => {
            toggleLoadingScreen(false);
            displayQuizQuestions(questions);
        })
        .catch(error => {
            console.error('Error generating questions:', error);
            toggleLoadingScreen(false);
            // Fallback to placeholder questions if AI generation fails
            const fallbackQuestions = generateFallbackQuestions(topic);
            displayQuizQuestions(fallbackQuestions);
        });
}

// Function to generate questions with AI
async function generateQuestionsWithAI(topic, courseName, unitName) {
    try {
        // Create a prompt for the AI
        const prompt = `Generate 5 multiple-choice quiz questions about "${topic}" for ${courseName} ${unitName}. 
        Each question should have 4 options (A, B, C, D) with one correct answer.
        Format the response as a JSON array with this structure:
        [
            {
                "question": "Question text here",
                "options": ["Option A", "Option B", "Option C", "Option D"],
                "correctAnswer": "Option that is correct",
                "explanation": "Brief explanation of why the answer is correct"
            }
        ]
        Make sure the questions are challenging but appropriate for high school AP students.`;

        // Make API request
        const response = await fetch(`${API_URL}?key=${API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                                text: prompt
                    }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 2048
                }
            })
        });

        const data = await response.json();
        
        // Extract the generated text
        const generatedText = data.candidates[0].content.parts[0].text;
        
        // Find the JSON part in the response
        const jsonMatch = generatedText.match(/\[\s*\{.*\}\s*\]/s);
        if (!jsonMatch) {
            throw new Error('Could not extract JSON from response');
        }
        
        // Parse the JSON
        const questions = JSON.parse(jsonMatch[0]);
        return questions;
    } catch (error) {
        console.error('Error generating questions with AI:', error);
        throw error;
    }
}

// Function to generate fallback questions if AI fails
function generateFallbackQuestions(topic) {
    return [
        {
            question: `Which of the following best describes ${topic}?`,
            options: ["Description A", "Description B", "Description C", "Description D"],
            correctAnswer: "Description A",
            explanation: "This is a placeholder explanation for the correct answer."
        },
        {
            question: `What is a key principle of ${topic}?`,
            options: ["Principle A", "Principle B", "Principle C", "Principle D"],
            correctAnswer: "Principle B",
            explanation: "This is a placeholder explanation for the correct answer."
        },
        {
            question: `In the context of ${topic}, what is most important?`,
            options: ["Factor A", "Factor B", "Factor C", "Factor D"],
            correctAnswer: "Factor C",
            explanation: "This is a placeholder explanation for the correct answer."
        },
        {
            question: `Which example best illustrates ${topic}?`,
            options: ["Example A", "Example B", "Example C", "Example D"],
            correctAnswer: "Example D",
            explanation: "This is a placeholder explanation for the correct answer."
        },
        {
            question: `What is a common misconception about ${topic}?`,
            options: ["Misconception A", "Misconception B", "Misconception C", "Misconception D"],
            correctAnswer: "Misconception A",
            explanation: "This is a placeholder explanation for the correct answer."
        }
    ];
}

// Function to display quiz questions
function displayQuizQuestions(questions) {
    // Store questions for grading
    state.currentQuestions = questions;
    
    // Clear previous questions
    elements.apQuestionsForm.innerHTML = '';
    
    // Create HTML for each question
    questions.forEach((question, index) => {
        const questionNumber = index + 1;
        const questionId = `question-${questionNumber}`;
        
        const questionHTML = `
            <div class="question" id="${questionId}">
                <div class="question-header">
                    <h3 class="question-number">Question ${questionNumber}</h3>
                </div>
                <div class="question-content">
                    <p class="question-text">${question.question}</p>
                <div class="options">
                        ${question.options.map((option, optIndex) => `
                            <label class="option" data-value="${option}">
                                <input type="radio" name="${questionId}" value="${option}">
                            <span>${option}</span>
                        </label>
                    `).join('')}
                    </div>
                </div>
                <div class="question-footer">
                    <div class="question-meta">
                        <span class="question-difficulty">AP Level</span>
                    </div>
                </div>
            </div>
        `;
        
        elements.apQuestionsForm.innerHTML += questionHTML;
    });
    
    // Add event listeners to options for selection
    document.querySelectorAll('.option').forEach(option => {
        option.addEventListener('click', function() {
            // Remove selected class from all options in this question
            const questionEl = this.closest('.question');
            questionEl.querySelectorAll('.option').forEach(opt => {
                opt.classList.remove('selected');
            });
            
            // Add selected class to clicked option
            this.classList.add('selected');
            
            // Check the radio button
            const radioBtn = this.querySelector('input[type="radio"]');
            radioBtn.checked = true;
        });
    });
    
    // Add event listener to submit button
    elements.submitApQuestions.addEventListener('click', handleQuizSubmit);
}

// Function to handle quiz submission
function handleQuizSubmit() {
    // Collect user answers
    const userAnswers = [];
    let correctCount = 0;
    
    state.currentQuestions.forEach((question, index) => {
        const questionId = `question-${index + 1}`;
        const selectedOption = document.querySelector(`input[name="${questionId}"]:checked`);
        const userAnswer = selectedOption ? selectedOption.value : null;
        
        userAnswers.push({
            question: question.question,
            userAnswer: userAnswer,
            correctAnswer: question.correctAnswer,
            isCorrect: userAnswer === question.correctAnswer,
            explanation: question.explanation
        });
        
        if (userAnswer === question.correctAnswer) {
            correctCount++;
        }
    });
    
    // Calculate score
    const score = Math.round((correctCount / state.currentQuestions.length) * 100);
    
    // Display results
    displayQuizResults(userAnswers, score, state.currentQuestions.length);
}

// Function to display quiz results
function displayQuizResults(answers, score, totalQuestions) {
    // Hide questions section and show results section
    elements.apQuestionsSection.classList.add('hidden');
    elements.apResultsSection.classList.remove('hidden');
    
    // Update score display
    document.querySelector('.score-number').textContent = `${score}%`;
    document.querySelector('.score-details').textContent = `${answers.filter(a => a.isCorrect).length} out of ${totalQuestions} correct`;
    
    // Clear previous results
    const resultsContainer = document.getElementById('apResultsContainer');
    resultsContainer.innerHTML = '';
    
    // Add each question result
    answers.forEach((answer, index) => {
        const resultClass = answer.isCorrect ? 'correct' : 'incorrect';
        const resultIndicator = answer.isCorrect ? '✓' : '✗';
        
        const resultHTML = `
            <div class="question-result ${resultClass}">
            <div class="question-header">
                    <span class="result-indicator">${resultIndicator}</span>
                <h3>Question ${index + 1}</h3>
            </div>
            <div class="question-content">
                    <p>${answer.question}</p>
                <div class="answer-section">
                        <p><strong>Your answer:</strong> ${answer.userAnswer || 'No answer provided'}</p>
                        <p><strong>Correct answer:</strong> ${answer.correctAnswer}</p>
                </div>
                <div class="explanation">
                        <p><strong>Explanation:</strong> ${answer.explanation || generateExplanation(answer)}</p>
                    </div>
                </div>
            </div>
        `;
        
        resultsContainer.innerHTML += resultHTML;
    });
    
    // Remove existing event listeners before adding new ones
    elements.returnToUnit.removeEventListener('click', returnToUnitHandler);
    elements.tryAnotherSet.removeEventListener('click', tryAnotherSetHandler);
    elements.backToCourse.removeEventListener('click', backToCourseHandler);
    
    // Define handler functions
    const returnToUnitHandler = () => {
        elements.apResultsSection.classList.add('hidden');
        elements.apCourseSection.classList.remove('hidden');
    };
    
    const tryAnotherSetHandler = () => {
        elements.apResultsSection.classList.add('hidden');
        elements.apQuestionsSection.classList.remove('hidden');
        generateQuizForTopic(state.currentCourse, state.currentUnit, state.currentTopic);
    };
    
    const backToCourseHandler = () => {
        elements.apResultsSection.classList.add('hidden');
        elements.apCourseSection.classList.remove('hidden');
    };
    
    // Add event listeners
    elements.returnToUnit.addEventListener('click', returnToUnitHandler);
    elements.tryAnotherSet.addEventListener('click', tryAnotherSetHandler);
    elements.backToCourse.addEventListener('click', backToCourseHandler);
}

// Function to generate explanation if none provided
function generateExplanation(answer) {
    if (answer.isCorrect) {
        return `Correct! "${answer.correctAnswer}" is the right answer.`;
    } else if (!answer.userAnswer) {
        return `You didn't select an answer. The correct answer is "${answer.correctAnswer}".`;
    } else {
        return `Your answer "${answer.userAnswer}" is incorrect. The correct answer is "${answer.correctAnswer}".`;
    }
}

// Function to initialize the page
function init() {
    // Hide loading screen initially
    toggleLoadingScreen(false);
    
    // Add event listeners to AP test buttons
    elements.apTestButtons.forEach(button => {
        button.addEventListener('click', handleTestButtonClick);
    });
    
    // Add event listener to back buttons
    elements.backToApTests.addEventListener('click', () => {
        elements.apCourseSection.classList.add('hidden');
        elements.apSelectionSection.classList.remove('hidden');
    });
    
    elements.backToApCourse.addEventListener('click', () => {
        elements.apQuestionsSection.classList.add('hidden');
        elements.apCourseSection.classList.remove('hidden');
    });
    
    // Initialize theme
    initializeTheme();
    
    // Initialize modal
    initializeModal();
    
    verifyButtonDataMatch();
}

// Function to toggle loading screen
function toggleLoadingScreen(show) {
    if (show) {
        elements.loadingScreen.classList.remove('hidden');
        elements.loadingScreen.classList.add('active');
    } else {
        elements.loadingScreen.classList.remove('active');
        setTimeout(() => {
            elements.loadingScreen.classList.add('hidden');
        }, 300);
    }
}

// Function to handle AP test button click
function handleTestButtonClick(e) {
    const testId = e.target.getAttribute('data-test');
    state.currentCourse = testId;
    
    // Show loading screen
    toggleLoadingScreen(true);
    
    // Get course data
    const courseData = apCoursesData[testId];
    
    if (!courseData) {
        console.error(`Course data not found for ${testId}`);
        toggleLoadingScreen(false);
        return;
    }
    
    // Update course section with course data
    elements.apCourseName.textContent = courseData.name;
    elements.apCourseDescription.textContent = courseData.description;
    elements.apExamFormat.textContent = courseData.examFormat;
    
    // Generate units accordion
    generateUnitsAccordion(courseData.units);
    
    // Hide selection section and show course section
    elements.apSelectionSection.classList.add('hidden');
    elements.apCourseSection.classList.remove('hidden');
    
    // Hide loading screen
    toggleLoadingScreen(false);
}

// Function to generate units accordion
function generateUnitsAccordion(units) {
    // Clear previous accordion
    elements.apUnitsAccordion.innerHTML = '';
    
    // Generate HTML for each unit
    units.forEach((unit, index) => {
        const unitId = `unit-${index + 1}`;
        const isActive = index === 0 ? 'active' : '';
        
        // Generate topics list
        const topicsList = unit.topics.map(topic => {
            // Check if topic is an object with name and subtopics
            if (typeof topic === 'object' && topic.name && topic.subtopics) {
                const topicName = topic.name;
                const subtopicsList = topic.subtopics.map(subtopic => `
                    <li class="subtopic-item">
                        <span>${subtopic}</span>
                        <button class="quiz-btn" onclick="handleQuizButtonClick('${subtopic}')">Quiz</button>
                    </li>
                `).join('');
                
                return `
                    <li class="topic-item">
                        <span>${topicName}</span>
                        <button class="quiz-btn" onclick="handleQuizButtonClick('${topicName}')">Quiz</button>
                        <ul class="subtopics-list">
                            ${subtopicsList}
                        </ul>
                    </li>
                `;
            } else {
                // Handle legacy format (string topics)
                return `
                    <li class="topic-item">
                        <span>${topic}</span>
                        <button class="quiz-btn" onclick="handleQuizButtonClick('${topic}')">Quiz</button>
                    </li>
                `;
            }
        }).join('');
        
        const unitHTML = `
            <div class="accordion-item">
                <div class="accordion-header ${isActive}" data-target="${unitId}">
                    <div class="accordion-title">
                        <span>${unit.name}</span>
                    </div>
                    <div class="accordion-icon">
                        <svg viewBox="0 0 24 24" width="24" height="24">
                            <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"/>
                        </svg>
                    </div>
                </div>
                <div id="${unitId}" class="accordion-content ${isActive ? '' : 'hidden'}">
                    <div class="accordion-body">
                        <div class="unit-header">
                            <h4>Topics</h4>
                            <button class="quiz-btn unit-quiz-btn" onclick="handleQuizButtonClick('${unit.name}')">Unit Quiz</button>
                        </div>
                        <ul class="topics-list">
                            ${topicsList}
                        </ul>
                    </div>
                </div>
            </div>
        `;
        
        elements.apUnitsAccordion.innerHTML += unitHTML;
    });
    
    // Add event listeners to accordion headers
    document.querySelectorAll('.accordion-header').forEach(header => {
        header.addEventListener('click', function() {
            const target = this.getAttribute('data-target');
            const content = document.getElementById(target);
            
            // Toggle active class on header
            this.classList.toggle('active');
            
            // Toggle content visibility
            content.classList.toggle('hidden');
        });
    });
}

// Function to initialize theme
function initializeTheme() {
    const themeToggle = document.getElementById('themeToggle');
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    }
    
    // Add event listener to theme toggle
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });
}

// Function to initialize modal
function initializeModal() {
    const aboutBtn = document.getElementById('aboutBtn');
    const aboutModal = document.getElementById('aboutModal');
    const closeBtn = aboutModal.querySelector('.close-btn');
    
    // Add event listener to about button
    aboutBtn.addEventListener('click', () => {
        aboutModal.classList.remove('hidden');
    });
    
    // Add event listener to close button
    closeBtn.addEventListener('click', () => {
        aboutModal.classList.add('hidden');
    });
    
    // Close modal when clicking outside
    aboutModal.addEventListener('click', (e) => {
        if (e.target === aboutModal) {
            aboutModal.classList.add('hidden');
        }
    });
}

// Add this function to verify button-data matching
function verifyButtonDataMatch() {
    const buttons = document.querySelectorAll('[data-test]');
    buttons.forEach(button => {
        const testId = button.getAttribute('data-test');
        if (!apCoursesData[testId]) {
            console.error(`Missing data for button ${button.textContent} with data-test="${testId}"`);
            // Log available keys to help debugging
            console.log('Available keys:', Object.keys(apCoursesData));
            button.disabled = true;
            button.classList.add('disabled');
            button.title = 'Course content coming soon';
        }
    });
}

// Initialize the page when DOM is loaded
document.addEventListener('DOMContentLoaded', init);