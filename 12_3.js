//app.tsx

import { useState } from 'react'
import {appContainer, board, buttons, deleteBoardButton, loggerButton } from './App.css'
import BoardList from './components/BoardList/BoardList'
import ListsContainer from './components/ListsContainer/ListsContainer';
import { useTypedDisPatch, useTypedSelector } from './hooks/redux';
import EditModal from './components/EditModal/EditModal';
import LoggerModal from './components/LoggerModal/LoggerModal';
import { deleteBoard } from './store/slices/boardSlice';
import { v4 } from 'uuid';
import { addLog } from './store/slices/loggerSlice';

function App() {
  const dispatch = useTypedDisPatch();

  const [isLoggerOpen, setIsLoggerOpen] = useState(false);

  const [activeBoardId, setActiveBoardId] = useState('board-0');
  const modalActive = useTypedSelector(state => state.boards.modalActive);
  const boards = useTypedSelector(state => state.boards.boardArray);

  const getActiveBoard = boards.filter(board => board.boardId === activeBoardId)[0];

  const lists = getActiveBoard.lists;

  const handleDeleteBoard = () => {
    if (boards.length > 1) {
      dispatch(
        deleteBoard({boardId: getActiveBoard.boardId})
      )

      dispatch(
        addLog({
          logId: v4(),
          logMessage: `게시판 지우기: ${getActiveBoard.boardName}`,
          logAuthor: "User",
          logTimestamp: String(Date.now())
        })
      )

      const newIndexToSet = () => {
        // 지울 보드의 아이디
        const indexToBeDeleted = boards.findIndex(
          board => board.boardId === activeBoardId
        )

        // 첫 번째 삭제했으면 그 다음 activeBoard는 원래 두 번째였던 보드
        // 다른 순서 보드 삭제한거면 그 다음 activeBoard는 그 앞에 위치했던 보드
        return indexToBeDeleted === 0
          ? indexToBeDeleted + 1
          : indexToBeDeleted - 1;
      }

      // 그렇게 설정된 activeBoard의 인덱스로 해당 board를 찾은 후, 
      // 그 board의 boardId를 activeBoardId로 설정.
      setActiveBoardId(boards[newIndexToSet()].boardId)

    } else {
      alert('최소 게시판 개수는 한 개입니다.')
    }
  }

  return (
    <div className={appContainer}>
      {isLoggerOpen ? <LoggerModal 
        setIsLoggerOpen={setIsLoggerOpen} /> : null}
      {modalActive ? <EditModal /> : null}

      <BoardList 
            activeBoardId={activeBoardId}
            setActiveBoardId={setActiveBoardId}
          />
      <div className={board}>
        <ListsContainer lists={lists} boardId={getActiveBoard.boardId}/>
      </div>

      <div className={buttons}>
        <button className={deleteBoardButton} onClick={handleDeleteBoard}>
          이 게시판 삭제하기
        </button>
        <button 
          className={loggerButton} 
          onClick={() => setIsLoggerOpen(!isLoggerOpen)}>
          {isLoggerOpen ? "활동 목록 숨기기" : "활동 목록 보이기"}
        </button>

      </div>

    </div>
  )
}

export default App
