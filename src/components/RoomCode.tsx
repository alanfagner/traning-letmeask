import CopyImg from '../assets/images/copy.svg'

import '../styles/room-code.scss'

type RoomCodeProps = {
  code: string;
}

export function RoomCode({ code }: RoomCodeProps) {

  function copyRoomCodeToClipboard() {
    navigator.clipboard.writeText(code)
  }

  return (
    <button onClick={copyRoomCodeToClipboard} className="room-code">
      <div>
        <img src={CopyImg} alt="Copy room code" />
      </div>

      <span>Sala {code}</span>
    </button>
  )
}