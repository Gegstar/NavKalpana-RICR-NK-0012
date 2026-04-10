'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  Checkbox,
  FormGroup,
  LinearProgress,
  Alert,
  CircularProgress,
  Divider,
} from '@mui/material';
import { AccessTime } from '@mui/icons-material';
import styles from '@/styles/ManageSubmitQuiz.module.css';

// Dummy data – replace with API call
const getQuizById = (id: number) => ({
  id,
  title: 'React Fundamentals Quiz',
  description: 'Test your knowledge of React basics.',
  duration: 10, // minutes
  totalQuestions: 5,
  questions: [
    {
      id: 1,
      text: 'What is React?',
      type: 'single',
      options: ['A library for building user interfaces', 'A framework for backend', 'A database', 'A programming language'],
      correctAnswer: 0,
    },
    {
      id: 2,
      text: 'Which of the following are React hooks?',
      type: 'multiple',
      options: ['useState', 'useEffect', 'useReducer', 'useContext'],
      correctAnswer: [0, 1, 2, 3],
    },
    {
      id: 3,
      text: 'What is JSX?',
      type: 'single',
      options: ['JavaScript XML', 'Java Syntax Extension', 'JSON XHR', 'JavaScript XHR'],
      correctAnswer: 0,
    },
    {
      id: 4,
      text: 'Which method is used to update state in a class component?',
      type: 'single',
      options: ['setState', 'updateState', 'changeState', 'modifyState'],
      correctAnswer: 0,
    },
    {
      id: 5,
      text: 'What is the purpose of useEffect?',
      type: 'single',
      options: ['To perform side effects', 'To manage state', 'To render UI', 'To handle events'],
      correctAnswer: 0,
    },
  ],
});

export default function SubmitQuiz() {
  const { id } = useParams();
  const router = useRouter();
  const [quiz, setQuiz] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<{ score: number; correct: number; total: number } | null>(null);
  const [error, setError] = useState('');

  // Fetch quiz
  useEffect(() => {
    setTimeout(() => {
      const data = getQuizById(Number(id));
      setQuiz(data);
      setTimeLeft(data.duration * 60);
      setLoading(false);
    }, 500);
  }, [id]);

  // Timer countdown
  useEffect(() => {
    if (loading || submitted || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [loading, submitted, timeLeft]);

  const handleAutoSubmit = () => {
    if (!submitted) {
      handleSubmit(true);
    }
  };

  const handleAnswerChange = (questionId: number, value: any, type: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSingleChoice = (questionId: number, optionIndex: number) => {
    handleAnswerChange(questionId, optionIndex, 'single');
  };

  const handleMultipleChoice = (questionId: number, optionIndex: number, checked: boolean) => {
    const current = answers[questionId] || [];
    const newValue = checked
      ? [...current, optionIndex]
      : current.filter((i: number) => i !== optionIndex);
    handleAnswerChange(questionId, newValue, 'multiple');
  };

  const calculateScore = () => {
    let correctCount = 0;
    for (const q of quiz.questions) {
      const userAnswer = answers[q.id];
      if (!userAnswer) continue;
      if (q.type === 'single') {
        if (userAnswer === q.correctAnswer) correctCount++;
      } else {
        const correctArr = q.correctAnswer as number[];
        if (Array.isArray(userAnswer) && userAnswer.length === correctArr.length &&
            userAnswer.every((val: number) => correctArr.includes(val))) {
          correctCount++;
        }
      }
    }
    const score = (correctCount / quiz.questions.length) * 100;
    return { score: Math.round(score), correct: correctCount, total: quiz.questions.length };
  };

  const handleSubmit = (isAuto = false) => {
    if (Object.keys(answers).length < quiz.questions.length && !isAuto) {
      setError('Please answer all questions before submitting.');
      return;
    }
    setError('');
    const scoreResult = calculateScore();
    setResult(scoreResult);
    setSubmitted(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (loading) {
    return (
      <Box className={styles.loadingContainer}>
        <CircularProgress />
        <Typography>Loading quiz...</Typography>
      </Box>
    );
  }

  if (!quiz) {
    return (
      <Container maxWidth="md" className={styles.container}>
        <Alert severity="error">Quiz not found.</Alert>
      </Container>
    );
  }

  if (submitted && result) {
    const isPassed = result.score >= 50;
    return (
      <Container maxWidth="md" className={styles.container}>
        <Paper className={styles.resultPaper}>
          <Typography variant="h4" gutterBottom>Quiz Completed</Typography>
          <Box className={styles.scoreCircle} sx={{ backgroundColor: isPassed ? 'var(--color-success)' : 'var(--color-error)' }}>
            <Typography variant="h2">{result.score}%</Typography>
          </Box>
          <Typography variant="h6" gutterBottom>
            You got {result.correct} out of {result.total} correct.
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            {isPassed ? 'Congratulations! You passed the quiz.' : 'Keep practicing! Review the material and try again.'}
          </Typography>
          <Button variant="contained" onClick={() => router.push('/student/quizzes')}>
            Back to Quizzes
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" className={styles.container}>
      <Paper className={styles.paper}>
        <Box className={styles.header}>
          <Typography variant="h4">{quiz.title}</Typography>
          <Box className={styles.timer}>
            <AccessTime />
            <Typography variant="h6">{formatTime(timeLeft)}</Typography>
          </Box>
        </Box>
        <Typography variant="body2" color="text.secondary" paragraph>
          {quiz.description}
        </Typography>
        <LinearProgress variant="determinate" value={(Object.keys(answers).length / quiz.questions.length) * 100} sx={{ mb: 2 }} />

        {quiz.questions.map((q: any, idx: number) => (
          <Box key={q.id} className={styles.questionCard}>
            <Typography variant="h6">
              {idx + 1}. {q.text}
            </Typography>
            {q.type === 'single' ? (
              <RadioGroup
                value={answers[q.id] ?? ''}
                onChange={(e) => handleSingleChoice(q.id, parseInt(e.target.value))}
              >
                {q.options.map((opt: string, optIdx: number) => (
                  <FormControlLabel
                    key={optIdx}
                    value={optIdx}
                    control={<Radio />}
                    label={opt}
                  />
                ))}
              </RadioGroup>
            ) : (
              <FormGroup>
                {q.options.map((opt: string, optIdx: number) => (
                  <FormControlLabel
                    key={optIdx}
                    control={
                      <Checkbox
                        checked={(answers[q.id] || []).includes(optIdx)}
                        onChange={(e) => handleMultipleChoice(q.id, optIdx, e.target.checked)}
                      />
                    }
                    label={opt}
                  />
                ))}
              </FormGroup>
            )}
          </Box>
        ))}

        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

        <Box className={styles.actions}>
          <Button variant="outlined" onClick={() => router.back()}>Cancel</Button>
          <Button variant="contained" onClick={() => handleSubmit(false)}>Submit Quiz</Button>
        </Box>
      </Paper>
    </Container>
  );
}
