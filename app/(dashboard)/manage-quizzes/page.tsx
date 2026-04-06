'use client';
import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Chip,
  Switch,
  FormControlLabel,
  Grid,
  Alert,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Visibility,
  Quiz,
} from '@mui/icons-material';
import styles from '@/styles/ManageQuizzes.module.css';

// Dummy data – replace with API call
interface Question {
  id: number;
  text: string;
  type: 'single' | 'multiple';
  options: string[];
  correctAnswer: number | number[];
  explanation?: string;
}

interface Quiz {
  id: number;
  title: string;
  description: string;
  duration: number; // minutes
  totalQuestions: number;
  status: 'draft' | 'published';
  questions: Question[];
}

const dummyQuizzes: Quiz[] = [
  {
    id: 1,
    title: 'React Fundamentals',
    description: 'Test your knowledge of React basics',
    duration: 45,
    totalQuestions: 10,
    status: 'published',
    questions: [
      {
        id: 1,
        text: 'What is React?',
        type: 'single',
        options: ['Library', 'Framework', 'Language', 'Database'],
        correctAnswer: 0,
        explanation: 'React is a JavaScript library for building user interfaces.',
      },
    ],
  },
  {
    id: 2,
    title: 'JavaScript Advanced',
    description: 'Advanced JavaScript concepts',
    duration: 60,
    totalQuestions: 15,
    status: 'draft',
    questions: [],
  },
];

export default function ManageQuizzes() {
  const [quizzes, setQuizzes] = useState<Quiz[]>(dummyQuizzes);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);
  const [quizForm, setQuizForm] = useState({
    title: '',
    description: '',
    duration: 30,
    status: 'draft' as 'draft' | 'published',
  });
  const [questions, setQuestions] = useState<Question[]>([]);
  const [openQuestionDialog, setOpenQuestionDialog] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [questionForm, setQuestionForm] = useState({
    text: '',
    type: 'single' as 'single' | 'multiple',
    options: ['', ''],
    correctAnswer: [] as number[],
    explanation: '',
  });

  // Quiz CRUD
  const handleOpenQuizDialog = (quiz?: Quiz) => {
    if (quiz) {
      setEditingQuiz(quiz);
      setQuizForm({
        title: quiz.title,
        description: quiz.description,
        duration: quiz.duration,
        status: quiz.status,
      });
      setQuestions(quiz.questions);
    } else {
      setEditingQuiz(null);
      setQuizForm({ title: '', description: '', duration: 30, status: 'draft' });
      setQuestions([]);
    }
    setOpenDialog(true);
  };

  const handleSaveQuiz = () => {
    if (editingQuiz) {
      // Update existing quiz
      setQuizzes(quizzes.map(q => q.id === editingQuiz.id ? {
        ...editingQuiz,
        ...quizForm,
        totalQuestions: questions.length,
        questions,
      } : q));
    } else {
      // Create new quiz
      const newQuiz: Quiz = {
        id: Date.now(),
        ...quizForm,
        totalQuestions: questions.length,
        questions,
      };
      setQuizzes([...quizzes, newQuiz]);
    }
    setOpenDialog(false);
  };

  const handleDeleteQuiz = (id: number) => {
    if (confirm('Are you sure you want to delete this quiz?')) {
      setQuizzes(quizzes.filter(q => q.id !== id));
    }
  };

  // Question CRUD
  const handleOpenQuestionDialog = (question?: Question) => {
    if (question) {
      setEditingQuestion(question);
      setQuestionForm({
        text: question.text,
        type: question.type,
        options: [...question.options],
        correctAnswer: Array.isArray(question.correctAnswer) ? question.correctAnswer : [question.correctAnswer],
        explanation: question.explanation || '',
      });
    } else {
      setEditingQuestion(null);
      setQuestionForm({
        text: '',
        type: 'single',
        options: ['', ''],
        correctAnswer: [],
        explanation: '',
      });
    }
    setOpenQuestionDialog(true);
  };

  const handleAddOption = () => {
    setQuestionForm({ ...questionForm, options: [...questionForm.options, ''] });
  };

  const handleRemoveOption = (index: number) => {
    const newOptions = questionForm.options.filter((_, i) => i !== index);
    setQuestionForm({ ...questionForm, options: newOptions });
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...questionForm.options];
    newOptions[index] = value;
    setQuestionForm({ ...questionForm, options: newOptions });
  };

  const handleCorrectAnswerChange = (index: number) => {
    if (questionForm.type === 'single') {
      setQuestionForm({ ...questionForm, correctAnswer: [index] });
    } else {
      const current = questionForm.correctAnswer;
      const newCorrect = current.includes(index) ? current.filter(i => i !== index) : [...current, index];
      setQuestionForm({ ...questionForm, correctAnswer: newCorrect });
    }
  };

  const handleSaveQuestion = () => {
    const newQuestion: Question = {
      id: editingQuestion?.id || Date.now(),
      text: questionForm.text,
      type: questionForm.type,
      options: questionForm.options.filter(opt => opt.trim() !== ''),
      correctAnswer: questionForm.type === 'single' ? questionForm.correctAnswer[0] : questionForm.correctAnswer,
      explanation: questionForm.explanation,
    };
    if (editingQuestion) {
      setQuestions(questions.map(q => q.id === editingQuestion.id ? newQuestion : q));
    } else {
      setQuestions([...questions, newQuestion]);
    }
    setOpenQuestionDialog(false);
  };

  const handleDeleteQuestion = (id: number) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  return (
    <Box className={styles.container}>
      <Container maxWidth="xl">
        <Paper className={styles.paper}>
          <Box className={styles.header}>
            <Typography variant="h4">Manage Quizzes</Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => handleOpenQuizDialog()}
            >
              Create Quiz
            </Button>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Duration</TableCell>
                  <TableCell>Questions</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {quizzes.map((quiz) => (
                  <TableRow key={quiz.id}>
                    <TableCell>{quiz.title}</TableCell>
                    <TableCell>{quiz.description}</TableCell>
                    <TableCell>{quiz.duration} min</TableCell>
                    <TableCell>{quiz.totalQuestions}</TableCell>
                    <TableCell>
                      <Chip
                        label={quiz.status}
                        color={quiz.status === 'published' ? 'success' : 'warning'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton size="small" onClick={() => handleOpenQuizDialog(quiz)}>
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleDeleteQuiz(quiz.id)}>
                        <Delete fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Quiz Dialog */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
          <DialogTitle>{editingQuiz ? 'Edit Quiz' : 'Create Quiz'}</DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Title"
                  fullWidth
                  value={quizForm.title}
                  onChange={(e) => setQuizForm({ ...quizForm, title: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Description"
                  fullWidth
                  multiline
                  rows={2}
                  value={quizForm.description}
                  onChange={(e) => setQuizForm({ ...quizForm, description: e.target.value })}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Duration (minutes)"
                  type="number"
                  fullWidth
                  value={quizForm.duration}
                  onChange={(e) => setQuizForm({ ...quizForm, duration: parseInt(e.target.value) })}
                />
              </Grid>
              <Grid item xs={6}>
                <FormControlLabel
                  control={<Switch checked={quizForm.status === 'published'} />}
                  label="Published"
                  onChange={(e, checked) => setQuizForm({ ...quizForm, status: checked ? 'published' : 'draft' })}
                />
              </Grid>
            </Grid>

            <Box className={styles.questionsSection}>
              <Typography variant="h6" gutterBottom>Questions</Typography>
              <Button
                variant="outlined"
                startIcon={<Add />}
                onClick={() => handleOpenQuestionDialog()}
                size="small"
              >
                Add Question
              </Button>
              <Box mt={2}>
                {questions.map((q, idx) => (
                  <Paper key={q.id} className={styles.questionCard}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography variant="body1">
                        {idx + 1}. {q.text}
                      </Typography>
                      <Box>
                        <IconButton size="small" onClick={() => handleOpenQuestionDialog(q)}>
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton size="small" onClick={() => handleDeleteQuestion(q.id)}>
                          <Delete fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      Type: {q.type === 'single' ? 'Single Choice' : 'Multiple Choice'} | Options: {q.options.length}
                    </Typography>
                  </Paper>
                ))}
              </Box>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button onClick={handleSaveQuiz} variant="contained">Save Quiz</Button>
          </DialogActions>
        </Dialog>

        {/* Question Dialog */}
        <Dialog open={openQuestionDialog} onClose={() => setOpenQuestionDialog(false)} maxWidth="md" fullWidth>
          <DialogTitle>{editingQuestion ? 'Edit Question' : 'Add Question'}</DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Question Text"
                  fullWidth
                  multiline
                  rows={2}
                  value={questionForm.text}
                  onChange={(e) => setQuestionForm({ ...questionForm, text: e.target.value })}
                />
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Question Type</InputLabel>
                  <Select
                    value={questionForm.type}
                    label="Question Type"
                    onChange={(e) => setQuestionForm({ ...questionForm, type: e.target.value as 'single' | 'multiple', correctAnswer: [] })}
                  >
                    <MenuItem value="single">Single Choice</MenuItem>
                    <MenuItem value="multiple">Multiple Choice</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2">Options</Typography>
                {questionForm.options.map((opt, idx) => (
                  <Box key={idx} className={styles.optionRow}>
                    <TextField
                      size="small"
                      placeholder={`Option ${idx + 1}`}
                      value={opt}
                      onChange={(e) => handleOptionChange(idx, e.target.value)}
                      fullWidth
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={questionForm.correctAnswer.includes(idx)}
                          onChange={() => handleCorrectAnswerChange(idx)}
                          color="primary"
                        />
                      }
                      label="Correct"
                    />
                    <IconButton size="small" onClick={() => handleRemoveOption(idx)} disabled={questionForm.options.length <= 2}>
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
                <Button size="small" onClick={handleAddOption}>+ Add Option</Button>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Explanation (optional)"
                  fullWidth
                  multiline
                  rows={2}
                  value={questionForm.explanation}
                  onChange={(e) => setQuestionForm({ ...questionForm, explanation: e.target.value })}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenQuestionDialog(false)}>Cancel</Button>
            <Button onClick={handleSaveQuestion} variant="contained">Save Question</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
}