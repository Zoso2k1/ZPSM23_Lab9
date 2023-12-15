import React, { useState, useEffect } from 'react';
import { SafeAreaView, Text, View, TouchableOpacity, useWindowDimensions, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { styles } from '../styles/styles';
import { stylesQuiz } from '../styles/stylesQuiz';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';
import ScoreContext from '../screens/ScoreContext';


const QuizView: React.FC = () => {
  const navigation = useNavigation();
  const windowDimensions = useWindowDimensions();
  const isLandscape = windowDimensions.width > windowDimensions.height;
  const landscapeStyles = isLandscape ? { head: styles.landscapeHead, body: styles.landscapeBody } : {};

  const sendResults = async (nick, score, total, type) => {
    try {
      const response = await fetch('https://tgryl.pl/quiz/result', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nick,
          score,
          total,
          type,
        }),
      });
  
      if (!response.ok) {
        console.error('Server error:', response.statusText);
        throw new Error('Failed to send results');
      } else {
        console.log('Results sent successfully!');
      }
    } catch (error) {
      console.error('Error sending results:', error.message);
    }
  };

  const QuestionComponent: React.FC<{ question: string; answers: any[]; duration: number }> = ({
    question,
    answers,
    duration,
  }) => {
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [remainingTime, setRemainingTime] = useState(duration);

    useEffect(() => {
      if (remainingTime > 0 && !isAnswered) {
        const interval = setInterval(() => {
          setRemainingTime((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
        }, 1000);

        return () => clearInterval(interval);
      }
    }, [remainingTime, isAnswered]);

    const handleAnswer = (index: number) => {
      if (!isAnswered) {
        setSelectedAnswer(index);
        setIsAnswered(true);

        setTimeout(() => {
          handleNextQuestion();
        }, 1000);
      }
    };

    const handleNextQuestion = () => {
      setSelectedAnswer(null);
      setIsAnswered(false);
      setRemainingTime(duration);

      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      } else {
        sendResults('Radoslaw', 18, 20, 'skoki narciarskie');

        Alert.alert('Quiz ended', 'Congratulations! You have answered all the questions.', [
          { text: 'Return to HOME', onPress: handleGoHome },
        ]);
      }
    };

    return (
      <View style={[stylesQuiz.quizTestBox, { margin: 20, marginTop: 40, marginBottom: 20 }]}>
        <Text style={stylesQuiz.quizHeader}>{question}</Text>

        <View style={stylesQuiz.quizTestTimerBody}>
          <CountdownCircleTimer
            isPlaying={!isAnswered}
            duration={duration}
            size={100}
            strokeWidth={10}
            colors={['#C27EFF', '#0A192F']}>
            {({ remainingTime }) => <Text style={stylesQuiz.quizTestTimerText}>{remainingTime}</Text>}
          </CountdownCircleTimer>
        </View>

        <View style={stylesQuiz.quizTestAnserwsBody}>
          {answers.map((answer, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleAnswer(index)}
              style={[
                stylesQuiz.quizTextButton,
                selectedAnswer === index && isAnswered && answer.isCorrect
                  ? stylesQuiz.quizTextButtonCorrect
                  : selectedAnswer === index && isAnswered && !answer.isCorrect
                  ? stylesQuiz.quizTextButtonIncorrect
                  : null,
              ]}>
              <Text style={stylesQuiz.quizButtonText}>{answer.content}</Text>
            </TouchableOpacity>
          ))}
        </View>

      </View>
    );
  };

  const questions = [
    {
      question: "Jak nazywa się skoczek narciarski, który wygrał Puchar Kontynentalny w skokach narciarskich w sezonie 2002/2003?",
      answers: [
        { content: "Stefan Thurnbichler", isCorrect: true },
        { content: "Balthasar Schneider", isCorrect: false },
        { content: "Morten Solem", isCorrect: false },
        { content: "Janne Happonen", isCorrect: false },
      ],
      duration: 30,
    },
    {
      question: "W jakim mieście znajduje się skocznia Puijo?",
      answers: [
        { content: "Kuopio", isCorrect: true },
        { content: "Kuusamo", isCorrect: false },
        { content: "Lahti", isCorrect: false },
        { content: "Rovaniemi", isCorrect: false },
      ],
      duration: 30,
    },
    {
      question: "Który z tych polskich skoczków stał na podium zawodów Pucharu Świata?",
      answers: [
        { content: "wszyscy wymienieni", isCorrect: true },
        { content: "Andrzej Stękała", isCorrect: false },
        { content: "Maciej Kot", isCorrect: false },
        { content: "Jan Ziobro", isCorrect: false },
      ],
      duration: 30,
    },
    // Dodaj więcej pytań tutaj
    // {
    //   question: "Czwarte pytanie?",
    //   answers: [
    //     // Dodaj tablicę odpowiedzi dla czwartego pytania
    //   ],
    //   duration: 30,
    // },
    // {
    //   question: "Piąte pytanie?",
    //   answers: [
    //     // Dodaj tablicę odpowiedzi dla piątego pytania
    //   ],
    //   duration: 30,
    // },
  ];

 const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const handleGoHome = () => {
    navigation.navigate('Home');
  };

  return (
    <SafeAreaView style={[styles.head, landscapeStyles.head]}>
      <View style={styles.body}>
        <QuestionComponent {...questions[currentQuestionIndex]} />
      </View>
    </SafeAreaView>
  );



};


export default QuizView;