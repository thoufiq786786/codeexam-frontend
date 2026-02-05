// Demo Questions
export interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  isHidden?: boolean;
}

export interface Question {
  id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  marks: number;
  sampleInput: string;
  sampleOutput: string;
  testCases: TestCase[];
  starterCode: {
    python: string;
    java: string;
  };
}

export interface Student {
  id: string;
  name: string;
  rollNumber: string;
  password: string;
}

export interface TestResult {
  id: string;
  studentId: string;
  studentName: string;
  rollNumber: string;
  totalMarks: number;
  obtainedMarks: number;
  correctAnswers: number;
  wrongAnswers: number;
  timeTaken: number; // in seconds
  submittedAt: string;
  answers: {
    questionId: string;
    code: string;
    language: string;
    passed: boolean;
    marks: number;
  }[];
}

export const demoQuestions: Question[] = [
  {
    id: 'q1',
    title: 'Second Largest Number',
    description: `Given an array of integers, find the second largest number in the array.

**Problem Statement:**
Write a function that takes an array of integers and returns the second largest unique number. If there is no second largest number, return -1.

**Constraints:**
- Array length: 2 ≤ n ≤ 10^5
- Array elements: -10^9 ≤ arr[i] ≤ 10^9

**Example:**
For the array [12, 35, 1, 10, 34, 1], the largest element is 35 and the second largest element is 34.`,
    difficulty: 'Easy',
    marks: 10,
    sampleInput: '[12, 35, 1, 10, 34, 1]',
    sampleOutput: '34',
    testCases: [
      { id: 'tc1', input: '[12, 35, 1, 10, 34, 1]', expectedOutput: '34' },
      { id: 'tc2', input: '[10, 5, 10]', expectedOutput: '5' },
      { id: 'tc3', input: '[1, 1, 1]', expectedOutput: '-1', isHidden: true },
      { id: 'tc4', input: '[100, 200, 300, 400]', expectedOutput: '300', isHidden: true },
    ],
    starterCode: {
      python: `def second_largest(arr):
    # Write your code here
    pass

# Read input
arr = eval(input())
print(second_largest(arr))`,
      java: `import java.util.*;

public class Solution {
    public static int secondLargest(int[] arr) {
        // Write your code here
        return -1;
    }
    
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Parse input array
    }
}`
    }
  },
  {
    id: 'q2',
    title: 'Palindrome String',
    description: `Check if a given string is a palindrome.

**Problem Statement:**
Write a function that takes a string and returns true if it's a palindrome, false otherwise. Consider only alphanumeric characters and ignore cases.

**Definition:**
A palindrome is a word, phrase, number, or other sequence of characters that reads the same forward and backward.

**Constraints:**
- String length: 1 ≤ n ≤ 10^5
- String contains only printable ASCII characters

**Example:**
"A man, a plan, a canal: Panama" is a palindrome.
"race a car" is not a palindrome.`,
    difficulty: 'Easy',
    marks: 10,
    sampleInput: '"A man, a plan, a canal: Panama"',
    sampleOutput: 'true',
    testCases: [
      { id: 'tc1', input: '"A man, a plan, a canal: Panama"', expectedOutput: 'true' },
      { id: 'tc2', input: '"race a car"', expectedOutput: 'false' },
      { id: 'tc3', input: '"madam"', expectedOutput: 'true', isHidden: true },
      { id: 'tc4', input: '"hello"', expectedOutput: 'false', isHidden: true },
    ],
    starterCode: {
      python: `def is_palindrome(s):
    # Write your code here
    pass

# Read input
s = input().strip('"')
print(str(is_palindrome(s)).lower())`,
      java: `import java.util.*;

public class Solution {
    public static boolean isPalindrome(String s) {
        // Write your code here
        return false;
    }
    
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.nextLine();
        System.out.println(isPalindrome(s));
    }
}`
    }
  },
  {
    id: 'q3',
    title: 'Balanced Parentheses',
    description: `Check if a string has balanced parentheses.

**Problem Statement:**
Given a string containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.

**Rules:**
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.

**Constraints:**
- String length: 1 ≤ n ≤ 10^4
- String contains only parentheses characters

**Example:**
"()[]{}" is valid.
"([)]" is not valid.
"{[]}" is valid.`,
    difficulty: 'Medium',
    marks: 15,
    sampleInput: '"()[]{}"',
    sampleOutput: 'true',
    testCases: [
      { id: 'tc1', input: '"()[]{}"', expectedOutput: 'true' },
      { id: 'tc2', input: '"([)]"', expectedOutput: 'false' },
      { id: 'tc3', input: '"{[]}"', expectedOutput: 'true' },
      { id: 'tc4', input: '"((()))"', expectedOutput: 'true', isHidden: true },
      { id: 'tc5', input: '"{{{{{"', expectedOutput: 'false', isHidden: true },
    ],
    starterCode: {
      python: `def is_balanced(s):
    # Write your code here
    pass

# Read input
s = input().strip('"')
print(str(is_balanced(s)).lower())`,
      java: `import java.util.*;

public class Solution {
    public static boolean isBalanced(String s) {
        // Write your code here
        return false;
    }
    
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.nextLine();
        System.out.println(isBalanced(s));
    }
}`
    }
  }
];

export const demoStudents: Student[] = [
  { id: 's1', name: 'Alex Johnson', rollNumber: '101', password: 'alex123' },
  { id: 's2', name: 'John Smith', rollNumber: '102', password: 'john123' },
];

export const demoResults: TestResult[] = [
  {
    id: 'r1',
    studentId: 's1',
    studentName: 'Alex Johnson',
    rollNumber: '101',
    totalMarks: 35,
    obtainedMarks: 25,
    correctAnswers: 2,
    wrongAnswers: 1,
    timeTaken: 1200,
    submittedAt: '2024-01-15T10:30:00Z',
    answers: [
      { questionId: 'q1', code: '...', language: 'python', passed: true, marks: 10 },
      { questionId: 'q2', code: '...', language: 'python', passed: true, marks: 10 },
      { questionId: 'q3', code: '...', language: 'python', passed: false, marks: 0 },
    ]
  },
  {
    id: 'r2',
    studentId: 's2',
    studentName: 'John Smith',
    rollNumber: '102',
    totalMarks: 35,
    obtainedMarks: 35,
    correctAnswers: 3,
    wrongAnswers: 0,
    timeTaken: 900,
    submittedAt: '2024-01-15T09:45:00Z',
    answers: [
      { questionId: 'q1', code: '...', language: 'java', passed: true, marks: 10 },
      { questionId: 'q2', code: '...', language: 'java', passed: true, marks: 10 },
      { questionId: 'q3', code: '...', language: 'java', passed: true, marks: 15 },
    ]
  }
];

// Admin credentials
export const adminCredentials = {
  username: 'admin',
  password: 'admin123'
};
