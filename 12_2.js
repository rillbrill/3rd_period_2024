// BoardList.tsx
import React, { FC, useRef, useState } from 'react'
import { useTypedSelector } from '../../hooks/redux';
import { FiPlusCircle } from 'react-icons/fi';
import SideForm from './SideForm/SideForm';
import { addButton, addSection, boardItem, boardItemActive, container, title } from './BoardList.css';
import clsx from 'clsx';

type TBoardListProps = {
  activeBoardId: string;
  setActiveBoardId:
  React.Dispatch<React.SetStateAction<string>>
}

const BoardList: FC<TBoardListProps> = ({
  activeBoardId,
  setActiveBoardId
}) => {

  //store의 slices의 boardSlices의 하드코딩된 데이터들을 가져와야 한다 - selector 사용
  const {boardArray} = useTypedSelector(state => state.boards);
  // 새 게시판 추가 버튼 -> 클릭하면 게시판 이름 작성 폼으로 바뀜
  const [isFormOpen, setIsFormOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    setIsFormOpen(!isFormOpen)
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
    //인풋 부분이 렌더링 되고 나야 인풋이라고 인지되기 때문에 약간의 딜레이 줌
  }


  return (
    <div className={container}>
      <div className={title}>
        게시판:
      </div>
      {boardArray.map((board, index) => (
        <div key={board.boardId}
        onClick={() => setActiveBoardId(boardArray[index].boardId)}
          className={
            clsx(
              {
                [boardItemActive]: //1차 비교, 2차 비교. 다 같으면 boardItemActive 클래스(스타일) 사용.
                boardArray.findIndex(b => b.boardId === activeBoardId) ===index,
              },
              {
                [boardItem]:
                boardArray.findIndex(b => b.boardId === activeBoardId) !== index
              }
            )
          }
        >
          <div>
            {board.boardName}
          </div>
        </div>
      ))}
      <div className={addSection}>
        {
          isFormOpen ?
          <SideForm inputRef={inputRef} setIsFormOpen={setIsFormOpen} />
          :
          <FiPlusCircle className={addButton} onClick={handleClick} />
        }
      </div>
    </div>
  )
}

export default BoardList
