

import { useHistory, useParams } from 'react-router'

import logoIMG from '../assets/images/logo.svg'
import deleteIMG from '../assets/images/delete.svg'
import checkIMG from '../assets/images/check.svg'
import answerIMG from '../assets/images/answer.svg'

import { Question } from '../components/Question'
import { Button } from '../components/Button'
import { RoomCode } from '../components/RoomCode'

import "../styles/room.scss"
import { useRoom } from '../hooks/useRoom'
import { database } from '../services/firebase'

type RoomParams = {
  id: string;
}

export function AdminRoom() {
  const params = useParams<RoomParams>()
  const history = useHistory()

  const roomId = params.id

  const { questions, title } = useRoom(roomId);

  async function handleDeleteQuestion(questionId: string) {
    if (window.confirm('Tem certeza que você deseja excluir esta pergunta?')) {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).remove()
    }
  }

  async function handleEndRoom() {
    await database.ref(`rooms/${roomId}`).update({ endedAt: new Date() })
    history.push('/')
  }

  async function handleCheckQuestionAsAnswered(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isAnswered: true,
    })
  }


  async function handleHighlightQuestion(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isHighlighted: true,
    })
  }

  return <div id="page-room">
    <header>
      <div className="content">
        <img src={logoIMG} alt="Letmeask" />
        <div>
          <RoomCode code={roomId} />
          <Button onClick={handleEndRoom} isOutlined >Encerrar sala</Button>
        </div>
      </div>
    </header>

    <main>
      <div className="room-title">
        <h1>Sala {title}</h1>
        {questions.length > 0 && <span>{questions.length} perguntas</span>}
      </div>

      <div className="question-list">

        {questions.map((question) =>
          <Question isAnswered={question.isAnswered} isHighlighted={question.isHighlighted} key={question.id} author={question.author} content={question.content} >
            {
              !question.isAnswered &&
              (
                <>
                  <button type="button" onClick={() => handleHighlightQuestion(question.id)}>
                    <img src={checkIMG} alt="Marcar pergunta como respondida" />
                  </button>

                  <button type="button" onClick={() => handleCheckQuestionAsAnswered(question.id)}>
                    <img src={answerIMG} alt="Dar destaque à pergunta" />
                  </button>
                </>
              )
            }
            <button type="button" onClick={() => handleDeleteQuestion(question.id)}>
              <img src={deleteIMG} alt="Remover pergunta" />
            </button>
          </Question>
        )}
      </div>

    </main>
  </div >
}