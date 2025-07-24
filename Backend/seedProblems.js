require("dotenv").config();
const mongoose = require("mongoose");
const Problem = require("./models/Problem");

async function seedProblems() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("✅ Connected to MongoDB");

    const problems = [
      {
        title: "Two Sum",
        description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
        difficulty: "Easy",
        examples: [
          { input: "nums = [2,7,11,15], target = 9", output: "[0,1]" }
        ],
        constraints: [
          "2 <= nums.length <= 10^4",
          "-10^9 <= nums[i] <= 10^9",
          "-10^9 <= target <= 10^9",
          "Only one valid answer exists"
        ],
        starterCode: {
          cpp: "#include <iostream>\nusing namespace std;\nint main() { cout << \"Hello World\"; return 0; }",
          c: "#include <stdio.h>\nint main() { printf(\"Hello World\"); return 0; }",
          java: "public class Main { public static void main(String[] args) { System.out.println(\"Hello World\"); } }",
          python: "print(\"Hello World\")"
        },
        testCases: [
          { input: "5\n2 7 11 15 1\n9", expectedOutput: "[0,1]" },
          { input: "4\n3 2 4 0\n6", expectedOutput: "[1,2]" },
          { input: "6\n3 3 5 6 2 1\n6", expectedOutput: "[0,1]" },
          { input: "2\n1 5\n6", expectedOutput: "[0,1]" },
          { input: "3\n0 4 3\n7", expectedOutput: "[1,2]" }
        ]
      },
      {
        title: "Best Time to Buy and Sell Stock",
        description: "You are given an array prices where prices[i] is the price of a given stock on the ith day. Return the maximum profit you can achieve.",
        difficulty: "Easy",
        examples: [
          { input: "prices = [7,1,5,3,6,4]", output: "5" }
        ],
        constraints: [
          "1 <= prices.length <= 10^5",
          "0 <= prices[i] <= 10^4"
        ],
        starterCode: {
          cpp: "#include <iostream>\nusing namespace std;\nint main() { cout << \"Hello World\"; return 0; }",
          c: "#include <stdio.h>\nint main() { printf(\"Hello World\"); return 0; }",
          java: "public class Main { public static void main(String[] args) { System.out.println(\"Hello World\"); } }",
          python: "print(\"Hello World\")"
        },
        testCases: [
          { input: "6\n7 1 5 3 6 4", expectedOutput: "5" },
          { input: "5\n7 6 4 3 1", expectedOutput: "0" },
          { input: "4\n2 4 1 5", expectedOutput: "4" },
          { input: "3\n2 1 2", expectedOutput: "1" },
          { input: "5\n3 2 6 5 0", expectedOutput: "4" }
        ]
      },
      {
        title: "Valid Parentheses",
        description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
        difficulty: "Easy",
        examples: [
          { input: "s = '()[]{}'", output: "true" }
        ],
        constraints: [
          "1 <= s.length <= 10^4",
          "s consists of parentheses only '()[]{}'."
        ],
        starterCode: {
          cpp: "#include <iostream>\nusing namespace std;\nint main(){ cout<<\"Hello World\"; return 0; }",
          c: "#include <stdio.h>\nint main(){ printf(\"Hello World\"); return 0; }",
          java: "public class Main { public static void main(String[] args) { System.out.println(\"Hello World\"); } }",
          python: "print(\"Hello World\")"
        },
        testCases: [
          { input: "()[]{}", expectedOutput: "true" },
          { input: "(]", expectedOutput: "false" },
          { input: "([)]", expectedOutput: "false" },
          { input: "{[]}", expectedOutput: "true" },
          { input: "((()))", expectedOutput: "true" }
        ]
      },
      {
        title: "Merge Two Sorted Lists",
        description: "Merge two sorted linked lists and return it as a sorted list.",
        difficulty: "Easy",
        examples: [
          { input: "l1 = [1,2,4], l2 = [1,3,4]", output: "[1,1,2,3,4,4]" }
        ],
        constraints: [
          "The number of nodes in both lists is in the range [0, 50]",
          "-100 <= Node.val <= 100"
        ],
        starterCode: {
          cpp: "#include <iostream>\nusing namespace std;\nint main() { cout << \"Hello World\"; return 0; }",
          c: "#include <stdio.h>\nint main() { printf(\"Hello World\"); return 0; }",
          java: "public class Main { public static void main(String[] args) { System.out.println(\"Hello World\"); } }",
          python: "print(\"Hello World\")"
        },
        testCases: [
          { input: "3\n1 2 4\n3\n1 3 4", expectedOutput: "[1,1,2,3,4,4]" },
          { input: "2\n5 6\n2\n3 4", expectedOutput: "[3,4,5,6]" },
          { input: "0\n\n0\n", expectedOutput: "[]" },
          { input: "1\n2\n1\n1", expectedOutput: "[1,2]" },
          { input: "2\n0 2\n2\n1 3", expectedOutput: "[0,1,2,3]" }
        ]
      },
      {
        title: "Longest Substring Without Repeating Characters",
        description: "Given a string s, find the length of the longest substring without repeating characters.",
        difficulty: "Medium",
        examples: [
          { input: "s = 'abcabcbb'", output: "3" }
        ],
        constraints: [
          "0 <= s.length <= 5 * 10^4",
          "s consists of English letters, digits, symbols and spaces."
        ],
        starterCode: {
          cpp: "#include <iostream>\nusing namespace std;\nint main(){ cout<<\"Hello World\"; return 0; }",
          c: "#include <stdio.h>\nint main(){ printf(\"Hello World\"); return 0; }",
          java: "public class Main { public static void main(String[] args) { System.out.println(\"Hello World\"); } }",
          python: "print(\"Hello World\")"
        },
        testCases: [
          { input: "abcabcbb", expectedOutput: "3" },
          { input: "bbbbb", expectedOutput: "1" },
          { input: "pwwkew", expectedOutput: "3" },
          { input: "abcd", expectedOutput: "4" },
          { input: "au", expectedOutput: "2" }
        ]
      },
      {
        title: "Add Two Numbers",
        description: "You are given two non-empty linked lists representing two non-negative integers. Add the two numbers and return the sum as a linked list.",
        difficulty: "Medium",
        examples: [
          { input: "l1 = [2,4,3], l2 = [5,6,4]", output: "[7,0,8]" }
        ],
        constraints: [
          "The number of nodes in each linked list is in the range [1, 100]",
          "0 <= Node.val <= 9"
        ],
        starterCode: {
          cpp: "#include <iostream>\nusing namespace std;\nint main(){ cout<<\"Hello World\"; return 0; }",
          c: "#include <stdio.h>\nint main(){ printf(\"Hello World\"); return 0; }",
          java: "public class Main { public static void main(String[] args) { System.out.println(\"Hello World\"); } }",
          python: "print(\"Hello World\")"
        },
        testCases: [
          { input: "3\n2 4 3\n3\n5 6 4", expectedOutput: "[7,0,8]" },
          { input: "1\n0\n1\n0", expectedOutput: "[0]" },
          { input: "2\n9 9\n1\n1", expectedOutput: "[0,0,1]" },
          { input: "3\n1 8 3\n3\n5 6 4", expectedOutput: "[6,4,8]" },
          { input: "2\n1 8\n1\n0", expectedOutput: "[1,8]" }
        ]
      },
      {
        title: "Group Anagrams",
        description: "Given an array of strings strs, group the anagrams together.",
        difficulty: "Medium",
        examples: [
          { input: "strs = ['eat','tea','tan','ate','nat','bat']", output: "[['eat','tea','ate'],['tan','nat'],['bat']]" }
        ],
        constraints: [
          "1 <= strs.length <= 10^4",
          "0 <= strs[i].length <= 100"
        ],
        starterCode: {
          cpp: "#include <iostream>\nusing namespace std;\nint main(){ cout<<\"Hello World\"; return 0; }",
          c: "#include <stdio.h>\nint main(){ printf(\"Hello World\"); return 0; }",
          java: "public class Main { public static void main(String[] args) { System.out.println(\"Hello World\"); } }",
          python: "print(\"Hello World\")"
        },
        testCases: [
          { input: "6\neat tea tan ate nat bat", expectedOutput: "[[\"eat\",\"tea\",\"ate\"],[\"tan\",\"nat\"],[\"bat\"]]" },
          { input: "3\na a a", expectedOutput: "[[\"a\",\"a\",\"a\"]]" },
          { input: "2\naa aa", expectedOutput: "[[\"aa\",\"aa\"]]" },
          { input: "3\na ab abc", expectedOutput: "[[\"a\"],[\"ab\"],[\"abc\"]]" },
          { input: "1\na", expectedOutput: "[[\"a\"]]" }
        ]
      }
    ];

    await Problem.insertMany(problems);
    console.log("✅ Part 2 problems seeded successfully");
  } catch (err) {
    console.error("❌ Seeding failed:", err.message);
  } finally {
    await mongoose.disconnect();
  }
}

seedProblems();
