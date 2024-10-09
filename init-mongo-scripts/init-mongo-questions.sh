#!/bin/bash
mongosh <<EOF
use question_service

db.questions.insertMany([
  {
    title: "Reverse a String",
    description: "Write a function that reverses a string. The input string is given as an array of characters s. You must do this by modifying the input array in-place with O(1) extra memory.",
    category: "Strings, Algorithms",
    complexity: "easy"
  },
  {
    title: "Linked List Cycle Detection",
    description: "Implement a function to detect if a linked list contains a cycle.",
    category: "Data Structures, Algorithms",
    complexity: "easy"
  },
  {
    title: "Roman to Integer",
    description: "Given a roman numeral, convert it to an integer.",
    category: "Algorithms",
    complexity: "easy"
  },
  {
    title: "Add Binary",
    description: "Given two binary strings a and b, return their sum as a binary string.",
    category: "Bit Manipulation, Algorithms",
    complexity: "easy"
  },
  {
    title: "Fibonacci Number",
    description: "Given n, calculate F(n) which is the Fibonacci number.",
    category: "Recursion, Algorithms",
    complexity: "easy"
  },
  {
    title: "Implement Stack using Queues",
    description: "Implement a last-in-first-out (LIFO) stack using only two queues.",
    category: "Data Structures",
    complexity: "easy"
  },
  {
    title: "Combine Two Tables",
    description: "Write a SQL solution to combine two tables, reporting the first name, last name, city, and state of each person.",
    category: "Databases",
    complexity: "easy"
  },
  {
    title: "Repeated DNA Sequences",
    description: "Given a string s that represents a DNA sequence, return all the 10-letter-long sequences that occur more than once.",
    category: "Algorithms, Bit Manipulation",
    complexity: "medium"
  },
  {
    title: "Course Schedule",
    description: "You are given an array prerequisites, return true if you can finish all courses.",
    category: "Data Structures, Algorithms",
    complexity: "medium"
  },
  {
    title: "LRU Cache Design",
    description: "Design and implement an LRU (Least Recently Used) cache.",
    category: "Data Structures",
    complexity: "medium"
  },
  {
    title: "Longest Common Subsequence",
    description: "Given two strings, return the length of their longest common subsequence.",
    category: "Strings, Algorithms",
    complexity: "medium"
  },
  {
    title: "Rotate Image",
    description: "You are given an n x n 2D matrix representing an image, rotate the image by 90 degrees (clockwise).",
    category: "Arrays, Algorithms",
    complexity: "medium"
  },
  {
    title: "Airplane Seat Assignment Probability",
    description: "Return the probability that the nth person gets his own seat on a plane.",
    category: "Brainteaser",
    complexity: "medium"
  },
  {
    title: "Validate Binary Search Tree",
    description: "Given the root of a binary tree, determine if it is a valid binary search tree (BST).",
    category: "Data Structures, Algorithms",
    complexity: "medium"
  },
  {
    title: "Sliding Window Maximum",
    description: "You are given an array of integers, return the maximum sliding window for each window of size k.",
    category: "Arrays, Algorithms",
    complexity: "hard"
  },
  {
    title: "N-Queen Problem",
    description: "Given an integer n, return all distinct solutions to the n-queens puzzle.",
    category: "Algorithms",
    complexity: "hard"
  },
  {
    title: "Serialize and Deserialize a Binary Tree",
    description: "Design an algorithm to serialize and deserialize a binary tree.",
    category: "Data Structures, Algorithms",
    complexity: "hard"
  },
  {
    title: "Wildcard Matching",
    description: "Given an input string and a pattern, implement wildcard pattern matching with support for '?' and '*'.",
    category: "Strings, Algorithms",
    complexity: "hard"
  },
  {
    title: "Chalkboard XOR Game",
    description: "Alice and Bob take turns erasing exactly one number from a chalkboard, the bitwise XOR of the elements decides the winner.",
    category: "Brainteaser",
    complexity: "hard"
  },
  {
    title: "Trips and Users",
    description: "Write a SQL solution to compute the cancellation rate of requests with unbanned users for a given date range.",
    category: "Databases",
    complexity: "hard"
  }
]);

print("20 questions inserted.");
EOF
