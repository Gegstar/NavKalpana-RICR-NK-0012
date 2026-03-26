"use client";
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { startQuiz, answerQuestion, submitQuiz } from '@/store/quizzesSlice';
import { incrementStreak } from '@/store/studentSlice';
import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  RadioGroup,
  Radio,
  FormControlLabel,
  Checkbox,
  LinearProgress,
  Box,
  Alert,
} from '@mui/material';

export default function QuizzesPage() {
  const dispatch = useDispatch();
  const quizzes = useSelector((state: RootState) => state.quizzes.quizzes);
  const [selectedQuiz, setSelectedQuiz] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const [currentAnswers, setCurrentAnswers] = useState<Record<number, number | number[]>>({});
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [quizStarted, setQuizStarted] = useState(false);

  const handleStartQuiz = (quiz: any) => {
    dispatch(startQuiz({ quizId: quiz.id }));
    setSelectedQuiz(quiz);
    setQuizStarted(true);
    setTimeLeft(quiz.duration * 60);
    setCurrentAnswers({});
    setOpen(true);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (quizStarted && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0 && quizStarted) {
      handleSubmitQuiz();
    }
    return () => clearInterval(timer);
  }, [timeLeft, quizStarted]);

  const handleAnswer = (questionId: number, answer: number | number[]) => {
    setCurrentAnswers(prev => ({ ...prev, [questionId]: answer }));
    dispatch(answerQuestion({ quizId: selectedQuiz.id, questionId, answer }));
  };

  const handleSubmitQuiz = () => {
    dispatch(submitQuiz({ quizId: selectedQuiz.id }));
    dispatch(incrementStreak()); // update streak
    setOpen(false);
    setQuizStarted(false);
    // Show result toast or something
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Quizzes
      </Typography>
      <Grid container spacing={3}>
        {quizzes.map((quiz) => (
          <Grid size={{xs:12,md:6}} key={quiz.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{quiz.title}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Duration: {quiz.duration} mins • Questions: {quiz.questions.length}
                </Typography>
                {quiz.attempt?.submitted && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2">
                      Score: {quiz.attempt.score?.toFixed(2)}% ({quiz.attempt.correctCount}/{quiz.questions.length} correct)
                    </Typography>
                    <LinearProgress variant="determinate" value={quiz.attempt.score || 0} sx={{ mt: 1 }} />
                  </Box>
                )}
                {!quiz.attempt?.submitted && (
                  <Button
                    variant="contained"
                    sx={{ mt: 2 }}
                    onClick={() => handleStartQuiz(quiz)}
                  >
                    Start Quiz
                  </Button>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Quiz Taking Modal */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md">
        <DialogTitle>
          {selectedQuiz?.title}
          <Box component="span" sx={{ float: 'right', color: timeLeft < 60 ? 'error.main' : 'text.secondary' }}>
            {formatTime(timeLeft)}
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedQuiz?.questions.map((q: any, idx: number) => (
            <Box key={q.id} sx={{ mb: 3 }}>
              <Typography variant="subtitle1">{idx+1}. {q.text}</Typography>
              {q.type === 'single' ? (
                <RadioGroup
                  value={currentAnswers[q.id] ?? null}
                  onChange={(e) => handleAnswer(q.id, parseInt(e.target.value))}
                >
                  {q.options.map((opt: string, optIdx: number) => (
                    <FormControlLabel key={optIdx} value={optIdx} control={<Radio />} label={opt} />
                  ))}
                </RadioGroup>
              ) : (
                <Box>
                  {/* {q.options.map((opt: string, optIdx: number) => (
                    <FormControlLabel
                      key={optIdx}
                      control={
                        <Checkbox
                          checked={Array.isArray(currentAnswers[q.id]) && currentAnswers[q.id].includes(optIdx)}
                          onChange={(e) => {
                            const current = (currentAnswers[q.id] as number[]) || [];
                            const newVal = e.target.checked
                              ? [...current, optIdx]
                              : current.filter(v => v !== optIdx);
                            handleAnswer(q.id, newVal);
                          }}
                        />
                      }
                      label={opt}
                    />
                  ))} */}
                </Box>
              )}
            </Box>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmitQuiz} variant="contained">Submit Quiz</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}