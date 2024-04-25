import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button } from 'react-bootstrap';
import { Modal } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';

const questionsData = [
  {
    question: "Co oznacza skrót API?",
    options: ["Application Programming Interface", "Advanced Programming Interface", "Automated Programming Interface", "Application Process Improvement"],
    correctAnswerIndex: 0
  },
  {
    question: "Który z poniższych języków jest statycznie typowany?",
    options: ["Python", "JavaScript", "C++", "Ruby"],
    correctAnswerIndex: 2
  },
  {
    question: "Co oznacza skrót CSS?",
    options: ["Creative Style Sheets", "Computer Style Sheets", "Cascading Style Sheets", "Cascading Script Sheets"],
    correctAnswerIndex: 2
  },
  {
    question: "Który z poniższych jest frameworkiem JavaScript?",
    options: ["Django", "React", "Flask", "Ruby on Rails"],
    correctAnswerIndex: 1
  },
  {
    question: "Co oznacza MVC w kontekście projektowania oprogramowania?",
    options: ["Model-View-Controller", "Maximum Viable Candidate", "Model-View-Component", "Minimum Viable Concept"],
    correctAnswerIndex: 0
  }
];

const resultsData = [
  {
    result: "Janusz Chmura: 3/5"
  },
  {
    result: "Adam Nowak: 1/5"
  },
  {
    result: "Tadeusz Kropka: 5/5"
  },
]

function App() {
  return (
    <div className='Main'>
      <div className='NavBar'>
        <WindowView/>
      </div>

      <div className='MainInMain'>
        <ModalWindow questions={questionsData}/>
      </div>

      <div className='Footer'>
        <Timer/>
      </div>
    </div>
  );
}

function Timer() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(seconds => seconds + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return <h1>Timer: {formatTime(seconds)}</h1>;
}

function formatTime(seconds) {
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(remainingSeconds).padStart(2, '0');

  return `${formattedMinutes}:${formattedSeconds}`;
}

function WindowView(){
  return(
    <h1>Quiz</h1>
  );
}

function ModalWindow({questions}) {
  const [show, setShow] = useState(false);
  const [nickName, setNickName] = useState('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [nickSubmitted, setNickSubmitted] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false); // Dodajemy stan dla okna modalnego z wynikami

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleNickSubmit = () => {
    setNickSubmitted(true);
    handleClose(); // Zamknięcie okna modalnego po zatwierdzeniu nicku
  }

  const handleNickChange = (event) => {
    setNickName(event.target.value);
  }

  const handleAnswerClick = (answerIndex) => {
    const currentQuestion = questions[currentQuestionIndex];
    if (answerIndex === currentQuestion.correctAnswerIndex) {
      setScore(score + 1); // Dodanie punktu do wyniku
    }
    // Przejście do następnego pytania
    setCurrentQuestionIndex(currentQuestionIndex + 1);
  }

  const renderModalContent = () => {
    if (nickSubmitted) {
      const currentQuestion = questions[currentQuestionIndex];
      if (currentQuestion) {
        return (
          <div className='quizWindow'>
            <div className='questionWindow'>
              <h3>{currentQuestion.question}</h3>
              <div className='answersWindow'>
                {currentQuestion.options.map((option, index) => (
                  <Button key={index} className='quizBtns' variant="secondary" onClick={() => handleAnswerClick(index)}>{option}</Button>
                ))}
              </div>
            </div>
          </div>
        );
      } else {
        // Wyświetlanie wyniku końcowego po zakończeniu wszystkich pytań
        return (
          <div>
            <h3>Koniec quizu!</h3>
            <p>Twój wynik: {score} / {questions.length}</p>
            <Button className='wynikiBtn' variant='secondary' onClick={() => setShowResultModal(true)}>Pokaż tabele wyników</Button>

          </div>
        );
      }
    } else {
      return (
        <Form>
          <Form.Group
            className="mb-3"
            controlId="exampleForm.ControlTextarea1"
          >
            <Form.Label>Wprowadź swoją nazwę: </Form.Label>
            <Form.Control as="input" value={nickName} onChange={handleNickChange}/>
          </Form.Group>
        </Form>
      );
    }
  }

  return (
    <>
      {!nickSubmitted &&
        <Button className='btn1' variant="secondary" onClick={handleShow}>
          Rozpocznij quiz
        </Button>
      }

      {nickSubmitted &&
        <div>
          {renderModalContent()}
        </div>
      }
      
      <Modal show={show} onHide={handleClose}>
        <Modal.Header className='modalHeader' closeButton>
          <Modal.Title>{nickSubmitted ? "Quiz" : "Nazwa gracza"}</Modal.Title>
        </Modal.Header>
        <Modal.Body className='modalBody'>
          <Form>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>Wprowadź swoją nazwę: </Form.Label>
              <Form.Control as="input" value={nickName} onChange={handleNickChange}/>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className='modalFooter'>
          {!nickSubmitted &&
            <Button variant="secondary" onClick={handleClose}>
              Zamknij
            </Button>
          }
          <Button variant="primary" onClick={nickSubmitted ? handleClose : handleNickSubmit}>
            {nickSubmitted ? "Gotowe" : "Zatwierdź"}
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showResultModal} onHide={() => setShowResultModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Wyniki quizu</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{nickName}: {score} / {questions.length}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowResultModal(false)}>
            Zamknij
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default App;
