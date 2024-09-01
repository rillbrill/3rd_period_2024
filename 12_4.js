// 로그아웃
// src/store/slices/userSlice.ts

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    email: '',
    id: ''
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {

        // 유저가 로그인할 때 유저 데이터를 store에 넣어주기 위해서
        setUser: (state, action) => {
            state.email = action.payload.email;
            state.id = action.payload.id;
        },

        removeUser: (state) => {
            state.email = '';
            state.id = '';
        }
    }
})

export const { setUser, removeUser} = userSlice.actions;
export const userReducer = userSlice.reducer;






// src/components/BoardList/BoardList.tsx

import React, { FC, useRef, useState } from 'react'
import { useTypedDisPatch, useTypedSelector } from '../../hooks/redux';
import { FiLogIn, FiPlusCircle } from 'react-icons/fi';
import SideForm from './SideForm/SideForm';
import { addButton, addSection, boardItem, boardItemActive, container, title } from './BoardList.css';
import clsx from 'clsx';
import { GoSignOut } from 'react-icons/go';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { app } from '../../firebase';
import { removeUser, setUser } from '../../store/slices/userSlice';
import { useAuth } from '../../hooks/useAuth';

type TBoardListProps = {
  activeBoardId: string;
  setActiveBoardId:
  React.Dispatch<React.SetStateAction<string>>
}

const BoardList: FC<TBoardListProps> = ({
  activeBoardId,
  setActiveBoardId
}) => {

  const dispatch = useTypedDisPatch();

  //store의 slices의 boardSlices의 하드코딩된 데이터들을 가져와야 한다 - selector 사용
  const {boardArray} = useTypedSelector(state => state.boards);
  // 새 게시판 추가 버튼 -> 클릭하면 게시판 이름 작성 폼으로 바뀜
  const [isFormOpen, setIsFormOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();

  const { isAuth } = useAuth();

  const handleLogin = () => {
    signInWithPopup(auth, provider)
    // 로그인에 성공했을 때
    .then(userCredential => {
      console.log(userCredential);

      dispatch(
        // 리덕스 스토어에 유저 데이터 넣기
        setUser({
          email: userCredential.user.email,
          id: userCredential.user.uid,
        })
      )
      console.log(userCredential.user.email, userCredential.user.uid);
    })
    // 로그인에 실패했을 때
    .catch(error => {
      console.error(error);
    })
  }

  const handleSignOut = () => {
    signOut(auth)
    // 구글 로그아웃과 동시에 유저데이터 초기화 시켜야 함
    .then(() => {
      dispatch(
        removeUser()
      )
    })
    // 로그아웃 실패한 경우
    .catch((error) => {
      console.log(error);
    })
  }

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

        {
          isAuth
          ?
          <GoSignOut className={addButton} onClick={handleSignOut}/>
          :
          <FiLogIn className={addButton} onClick={handleLogin}/>
        }

      </div>
    </div>
  )
}

export default BoardList
