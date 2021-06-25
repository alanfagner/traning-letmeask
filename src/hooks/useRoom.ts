import { useEffect, useState } from "react"
import { database } from "../services/firebase"
import { useAuth } from "./useAuth"

type LikeType = {
  authorId: string;
}

type QuestionType = {
  id: string;
  author: {
    name: string;
    avatar: string;
  }
  content: string;
  isAnswered: boolean;
  isHighlighted: boolean;
  likes: Record<string, LikeType>
  likeCount: number;
  likeId?: string;
}

type FirebaseQuestions = Record<string, QuestionType>

export function useRoom(roomId: string) {
  const { user } = useAuth();
  const [title, setTitle] = useState('')
  const [questions, setQuestions] = useState<QuestionType[]>([])


  useEffect(() => {
    const roomRef = database.ref(`rooms/${roomId}`)
    roomRef.on('value', room => {

      const databaseRoom = room.val()
      const firebaseQuestions: FirebaseQuestions = databaseRoom.questions ?? {}

      const parsedQuestion = Object.entries(firebaseQuestions).map(([key, value]) => {
        return {
          ...value,
          id: key,
          likeCount: Object.values(value.likes ?? {}).length,
          likeId: Object.entries(value.likes ?? {}).find(([key, like]) => like.authorId === user?.id)?.[0]
        }
      })

      setTitle(databaseRoom.title)
      setQuestions(parsedQuestion)
    })
    return () => {
      roomRef.off('value')
    }
  }, [roomId, user?.id])
  return { questions, title }
}