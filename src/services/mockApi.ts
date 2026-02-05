import { demoQuestions, demoStudents, demoResults, adminCredentials, Question, Student, TestResult } from '@/data/mockData';

// Initialize localStorage with demo data
export const initializeMockData = () => {
  if (!localStorage.getItem('questions')) {
    localStorage.setItem('questions', JSON.stringify(demoQuestions));
  }
  if (!localStorage.getItem('students')) {
    localStorage.setItem('students', JSON.stringify(demoStudents));
  }
  if (!localStorage.getItem('results')) {
    localStorage.setItem('results', JSON.stringify(demoResults));
  }
};

// Auth APIs
export const loginStudent = (rollNumber: string, password: string): Student | null => {
  const students: Student[] = JSON.parse(localStorage.getItem('students') || '[]');
  const student = students.find(s => s.rollNumber === rollNumber && s.password === password);
  if (student) {
    localStorage.setItem('currentUser', JSON.stringify({ ...student, role: 'student' }));
    return student;
  }
  return null;
};

export const loginAdmin = (username: string, password: string): boolean => {
  if (username === adminCredentials.username && password === adminCredentials.password) {
    localStorage.setItem('currentUser', JSON.stringify({ username, role: 'admin' }));
    return true;
  }
  return false;
};

export const registerStudent = (name: string, rollNumber: string, password: string): { success: boolean; message: string } => {
  const students: Student[] = JSON.parse(localStorage.getItem('students') || '[]');
  
  if (students.some(s => s.rollNumber === rollNumber)) {
    return { success: false, message: 'Roll number already exists' };
  }
  
  const newStudent: Student = {
    id: `s${Date.now()}`,
    name,
    rollNumber,
    password
  };
  
  students.push(newStudent);
  localStorage.setItem('students', JSON.stringify(students));
  return { success: true, message: 'Registration successful' };
};

export const logout = () => {
  localStorage.removeItem('currentUser');
  localStorage.removeItem('testSession');
};

export const getCurrentUser = () => {
  const user = localStorage.getItem('currentUser');
  return user ? JSON.parse(user) : null;
};

// Question APIs
export const getQuestions = (): Question[] => {
  return JSON.parse(localStorage.getItem('questions') || '[]');
};

export const getQuestionById = (id: string): Question | undefined => {
  const questions = getQuestions();
  return questions.find(q => q.id === id);
};

export const addQuestion = (question: Omit<Question, 'id'>): Question => {
  const questions = getQuestions();
  const newQuestion: Question = {
    ...question,
    id: `q${Date.now()}`
  };
  questions.push(newQuestion);
  localStorage.setItem('questions', JSON.stringify(questions));
  return newQuestion;
};

export const updateQuestion = (id: string, updates: Partial<Question>): Question | null => {
  const questions = getQuestions();
  const index = questions.findIndex(q => q.id === id);
  if (index === -1) return null;
  
  questions[index] = { ...questions[index], ...updates };
  localStorage.setItem('questions', JSON.stringify(questions));
  return questions[index];
};

export const deleteQuestion = (id: string): boolean => {
  const questions = getQuestions();
  const filtered = questions.filter(q => q.id !== id);
  if (filtered.length === questions.length) return false;
  
  localStorage.setItem('questions', JSON.stringify(filtered));
  return true;
};

// Results APIs
export const getResults = (): TestResult[] => {
  return JSON.parse(localStorage.getItem('results') || '[]');
};

export const getStudentResult = (studentId: string): TestResult | undefined => {
  const results = getResults();
  return results.find(r => r.studentId === studentId);
};

export const saveResult = (result: TestResult): void => {
  const results = getResults();
  const existingIndex = results.findIndex(r => r.studentId === result.studentId);
  
  if (existingIndex !== -1) {
    results[existingIndex] = result;
  } else {
    results.push(result);
  }
  
  localStorage.setItem('results', JSON.stringify(results));
};

// Test Session APIs
export const startTestSession = (studentId: string, startTime: number, duration: number) => {
  const session = {
    studentId,
    startTime,
    duration,
    answers: {} as Record<string, { code: string; language: string }>
  };
  localStorage.setItem('testSession', JSON.stringify(session));
  return session;
};

export const getTestSession = () => {
  const session = localStorage.getItem('testSession');
  return session ? JSON.parse(session) : null;
};

export const updateTestAnswer = (questionId: string, code: string, language: string) => {
  const session = getTestSession();
  if (session) {
    session.answers[questionId] = { code, language };
    localStorage.setItem('testSession', JSON.stringify(session));
  }
};

export const clearTestSession = () => {
  localStorage.removeItem('testSession');
};

// Simulate code execution (mock)
export const simulateCodeExecution = (
  code: string, 
  language: string, 
  input: string,
  expectedOutput: string
): { output: string; passed: boolean } => {
  // This is a mock - in real app, this would call backend
  // For demo, we'll simulate some basic outputs
  
  // Simple simulation based on question patterns
  const cleanInput = input.replace(/"/g, '');
  
  // Simulate some delay and return mock result
  // In demo, we'll randomly pass/fail or check for basic patterns
  
  // For demo purposes, let's check if the code has the basic structure
  const hasImplementation = code.length > 100 && !code.includes('pass') && !code.includes('return -1');
  
  if (hasImplementation) {
    // More likely to pass if code looks complete
    const passed = Math.random() > 0.3;
    return {
      output: passed ? expectedOutput : 'Wrong Answer',
      passed
    };
  }
  
  return {
    output: 'No output - implement your solution',
    passed: false
  };
};

// Leaderboard
export const getLeaderboard = (): TestResult[] => {
  const results = getResults();
  return [...results].sort((a, b) => {
    // Sort by marks (desc), then by time taken (asc)
    if (b.obtainedMarks !== a.obtainedMarks) {
      return b.obtainedMarks - a.obtainedMarks;
    }
    return a.timeTaken - b.timeTaken;
  });
};
