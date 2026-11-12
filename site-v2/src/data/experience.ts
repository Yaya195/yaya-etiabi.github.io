// Verified academic and engineering experience, maintained independently of page layouts.
// Do not infer ongoing employment from institutional affiliations or research-in-progress.
export const researchExperience = [
  {
    role: 'Postdoctoral Researcher',
    institution: 'Université du Québec à Montréal (UQAM)',
    department: 'Department of Computer Science',
    location: 'Montréal, Canada',
    period: 'Aug 2025 – Jul 2026',
    highlights: [
      'Developed and evaluated a convolutional and Transformer-based model for multipath parameter estimation from MIMO-OFDM measurements.',
      'Evaluated positioning and radio-only SLAM with estimated multipath parameters, and examined integrated sensing, communication, and computation for AI workloads at the edge.',
    ],
  },
  {
    role: 'Visiting Researcher',
    institution: 'ISEP, LISITE Laboratory',
    department: 'Institut Supérieur d’Électronique de Paris',
    location: 'Paris, France',
    period: 'Jan 2023 – Jun 2023',
    highlights: [
      'Studied federated meta-learning for indoor localization, with an emphasis on adaptation to new buildings using limited calibration measurements.',
    ],
  },
  {
    role: 'Ph.D. Researcher',
    institution: 'Mohammed VI Polytechnic University (UM6P)',
    department: 'College of Computing',
    location: 'Benguerir, Morocco',
    period: '2020 – 2025',
    highlights: [
      'Developed machine-learning methods for collaborative wireless indoor localization, including federated learning, meta-learning, and federated distillation.',
      'Evaluated localization accuracy, transfer across environments, and communication requirements on experimental datasets.',
    ],
  },
] as const;

export const earlierExperience = [
  {
    role: 'Research Intern',
    institution: 'Mohammed VI Polytechnic University (UM6P)',
    details: 'Cooperative IoT localization · Engineering capstone',
    location: 'Benguerir, Morocco',
    period: 'Feb 2020 – Aug 2020',
    summary: 'Developed and evaluated a cooperative-localization method for IoT devices using MATLAB simulations and available measurements.',
  },
  {
    role: 'IoT Engineering Intern',
    institution: 'Vetrasoft Engineering',
    details: '',
    location: 'Casablanca, Morocco',
    period: 'Jul 2019 – Aug 2019',
    summary: 'Designed a machine-to-machine communication circuit for geolocation applications using the Gemalto EHS6 GSM module.',
  },
  {
    role: 'Railway Electronics Intern',
    institution: 'Office National des Chemins de Fer (ONCF)',
    details: '',
    location: 'Casablanca, Morocco',
    period: 'Jun 2018 – Jul 2018',
    summary: 'Assisted with the maintenance and fault diagnosis of electronic train-door control modules.',
  },
] as const;

export const education = [
  {
    degree: 'Ph.D. in Computer Science',
    institution: 'Mohammed VI Polytechnic University (UM6P)',
    location: 'Benguerir, Morocco',
    period: '2020 – 2025',
    detail: 'College of Computing',
  },
  {
    degree: 'Engineering Degree in Electrical Engineering',
    institution: 'Hassan II University, École Nationale Supérieure d’Électricité et de Mécanique (ENSEM)',
    location: 'Casablanca, Morocco',
    period: '2017 – 2020',
    detail: 'Specialization: embedded systems and telecommunications',
  },
] as const;
