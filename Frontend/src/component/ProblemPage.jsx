import { useState, useEffect, useRef } from 'react';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-python';
import 'prismjs/themes/prism-tomorrow.css';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

const defaultCodes = {
  cpp: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello World";
    return 0;
}`,
  c: `#include <stdio.h>

int main() {
    printf("Hello World");
    return 0;
}`,
  java: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello World");
    }
}`,
  py: `print("Hello World")`
};

const ProblemPage = () => {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState('');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isReviewLoading, setIsReviewLoading] = useState(false);
  const [language, setLanguage] = useState('cpp');
  const [verdict, setVerdict] = useState('');
  const [testcaseFeedback, setTestcaseFeedback] = useState('');
  const [aiReview, setAiReview] = useState('');
  const [testResults, setTestResults] = useState([]);
  const [showAI, setShowAI] = useState(false);
  const outputRef = useRef(null);

  const AUTH_URL = import.meta.env.VITE_AUTH_URL || "http://localhost:2000";
  const COMPILER_URL = import.meta.env.VITE_COMPILER_URL || "http://localhost:8000/run";
  const SUBMIT_URL = import.meta.env.VITE_SUBMIT_URL || "http://localhost:2000/api/submit";

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const { data } = await axios.get(`${AUTH_URL}/api/problems/${id}`);
        setProblem(data);
        const starterCode = data?.starterCode?.[language] || defaultCodes[language];
        setCode(starterCode);
        setInput(data.defaultInput || '');
      } catch (err) {
        console.error("❌ Failed to fetch problem:", err);
      }
    };
    fetchProblem();
  }, [id]);

  useEffect(() => {
    if (!problem) return;
    const langCode = problem?.starterCode?.[language] || defaultCodes[language];
    setCode(langCode);
  }, [language, problem]);

  const handleSubmit = async () => {
    if (isLoading) return;
    setIsLoading(true);
    setOutput('');
    setVerdict('');
    setTestcaseFeedback('');
    setAiReview('');
    setTestResults([]);
    setShowAI(false);

    try {
      const { data } = await axios.post(COMPILER_URL, {
        language,
        code,
        input
      });

      if (data?.output) {
        setOutput(data.output);
      } else if (data?.error) {
        setOutput(`❌ ${data.error}`);
      } else {
        setOutput("⚠️ No output received from compiler.");
      }
    } catch (error) {
      console.error("Compiler error:", error);
      setOutput(error?.response?.data?.error || "❌ Server error occurred");
    } finally {
      setIsLoading(false);
      setTimeout(() => outputRef.current?.scrollIntoView({ behavior: 'smooth' }), 300);
    }
  };

  const handleVerdictSubmit = async () => {
    if (isLoading) return;
    setIsLoading(true);
    setOutput('');
    setVerdict('');
    setTestcaseFeedback('');
    setAiReview('');
    setTestResults([]);
    setShowAI(false);

    try {
      const res = await axios.post(SUBMIT_URL, {
        code,
        language,
        problemId: id,
      }, { withCredentials: true });

      const { verdict, error, aiReview: review, testResults = [] } = res.data;
      setVerdict(verdict);
      setTestResults(testResults);

      if (verdict === "Accepted") {
        setTestcaseFeedback("🎉 All test cases passed!");
      } else {
        const firstFailed = testResults.find(tc => !tc.passed);
        const failedText = firstFailed
          ? `Input: ${firstFailed.input}\nExpected: ${firstFailed.expectedOutput}\nActual: ${firstFailed.actualOutput || 'No Output'}`
          : '❌ Some test cases failed.';
        setTestcaseFeedback(failedText);
      }
    } catch (err) {
      setVerdict("Submission Failed");
      setOutput("❌ Server error while submitting.");
    } finally {
      setIsLoading(false);
      setTimeout(() => outputRef.current?.scrollIntoView({ behavior: 'smooth' }), 300);
    }
  };

  const generateAIReview = async () => {
    if (isReviewLoading) return;
    setIsReviewLoading(true);
    setAiReview('');
    setShowAI(false);

    try {
      const res = await axios.post(SUBMIT_URL, {
        code,
        language,
        problemId: id,
        verdict: "Accepted"
      }, { withCredentials: true });

      setAiReview(res.data.aiReview || "AI review not available");
      setShowAI(true);
    } catch (err) {
      setAiReview("❌ AI Review generation failed.");
    } finally {
      setIsReviewLoading(false);
      setTimeout(() => outputRef.current?.scrollIntoView({ behavior: 'smooth' }), 300);
    }
  };

  if (!problem) return <div className="p-4 text-center">⏳ Loading problem...</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 h-screen bg-white text-gray-900 dark:bg-[#1e1e1e] dark:text-white">
      <div className="p-6 overflow-y-auto border-r border-gray-200 dark:border-gray-700">
        <h1 className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-4">{problem.title}</h1>
        <p className="mb-6">{problem.description}</p>

        <h2 className="text-xl font-semibold mb-2 text-purple-600 dark:text-purple-300">Examples</h2>
        {problem.examples?.map((ex, i) => (
          <div key={i} className="bg-gray-100 dark:bg-gray-800 p-3 rounded mb-2">
            <p><strong className="text-green-600">Input:</strong> {ex.input}</p>
            <p><strong className="text-red-600">Output:</strong> {ex.output}</p>
          </div>
        ))}

        <h2 className="text-xl font-semibold mt-4 mb-2 text-purple-600 dark:text-purple-300">Constraints</h2>
        <ul className="list-disc pl-5">
          {problem.constraints?.map((c, i) => <li key={i}>{c}</li>)}
        </ul>

        {showAI && aiReview && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-indigo-500 mb-2">🧠 AI Code Review</h2>
            <div className="prose prose-sm dark:prose-invert bg-gray-100 dark:bg-gray-800 p-4 rounded">
              <ReactMarkdown>{aiReview}</ReactMarkdown>
            </div>
          </div>
        )}

        {testResults.length > 0 && verdict !== "Accepted" && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-red-500 mb-2">❌ Failed Test Case</h2>
            {testResults.filter(t => !t.passed).slice(0, 1).map((t, i) => (
              <div key={i} className="mb-2 bg-red-100 dark:bg-red-800 p-3 rounded">
                <p><strong>Input:</strong> {t.input}</p>
                <p><strong>Expected:</strong> {t.expectedOutput}</p>
                <p><strong>Actual:</strong> {t.actualOutput || 'No Output'}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="p-6 space-y-3 overflow-y-auto">
        <div>
          <label className="block text-sm font-medium mb-1">Language</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full p-2 border rounded bg-white dark:bg-gray-900"
          >
            <option value="cpp">C++</option>
            <option value="c">C</option>
            <option value="java">Java</option>
            <option value="py">Python</option>
          </select>
        </div>

        <div className="border rounded h-[400px] overflow-auto bg-white dark:bg-black">
          <Editor
            value={code}
            onValueChange={setCode}
            highlight={code => highlight(code, languages[language] || languages.clike)}
            padding={12}
            style={{
              fontFamily: 'Fira Code, monospace',
              fontSize: 14,
              minHeight: '100%',
              backgroundColor: 'transparent',
              color: 'inherit'
            }}
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className={`w-full py-2 font-bold text-white rounded ${isLoading ? 'bg-gray-400' : 'bg-purple-600 hover:bg-purple-700'}`}
        >
          ▶ {isLoading ? 'Running...' : 'Run Code'}
        </button>

        <button
          onClick={handleVerdictSubmit}
          disabled={isLoading}
          className={`w-full py-2 font-bold text-white rounded ${isLoading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'}`}
        >
          ✅ {isLoading ? 'Submitting...' : 'Submit & Judge'}
        </button>

        {verdict === 'Accepted' && (
          <button
            onClick={generateAIReview}
            disabled={isReviewLoading}
            className={`w-full py-2 font-bold text-white rounded ${isReviewLoading ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'}`}
          >
            🤖 {isReviewLoading ? 'Generating Review...' : 'Generate AI Code Review'}
          </button>
        )}

        {verdict && (
          <div className={`text-sm font-semibold mt-2 p-2 rounded ${
            verdict === 'Accepted' ? 'bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-200' :
            verdict === 'Wrong Answer' ? 'bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-200' :
            'bg-yellow-100 text-yellow-700 dark:bg-yellow-800 dark:text-yellow-200'
          }`}>
            Verdict: {verdict}
            {testcaseFeedback && <div className="mt-1 text-xs italic whitespace-pre-wrap">{testcaseFeedback}</div>}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-1">Program Input</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={3}
            className="w-full p-2 border rounded bg-white dark:bg-gray-900"
            placeholder="Enter input (optional)"
          />
        </div>

        <div ref={outputRef}>
          <label className="block text-sm font-medium mb-1">Output</label>
          <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded h-[120px] overflow-y-auto font-mono whitespace-pre-wrap">
            {output || 'Output will appear here...'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemPage;

