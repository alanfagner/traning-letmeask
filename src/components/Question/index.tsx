import { ReactNode } from 'react'
import cx from 'classnames'

import './styles.scss'

type QuestionProps = {
  children?: ReactNode;
  content: string;
  author: {
    name: string;
    avatar: string;
  },
  isAnswered?: boolean;
  isHighlighted?: boolean;

}

export function Question({ content, author, children, isAnswered = false, isHighlighted = false }: QuestionProps) {

  const { avatar, name } = author;

  return (
    <div className={cx('question', { 'answered': isAnswered }, { 'highlighted': isHighlighted && !isAnswered })}>
      <p>{content}</p>
      <footer>
        <div className="user-info">
          <img src={avatar} alt={name} />
          <span>{name}</span>
        </div>

        <div>{children}</div>
      </footer>
    </div>
  )
}