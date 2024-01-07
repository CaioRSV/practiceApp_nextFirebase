'use client'
import { useState, useEffect } from 'react';

import firebase from 'firebase/app';
import app from '../../firebase/appFirebase';
import { get, getDatabase, ref, remove, push , set } from 'firebase/database';
import dbRef_users from '../../firebase/databaseFirebase';

interface UserStuff {
  testId : string,
  testLogin : string,
  testPassword : string
};

export default function Home() {
  const database = getDatabase(app);

  const [users, setUsers] = useState<UserStuff[]>([]);

  const exemploUser : UserStuff = {
    testId : "testId",
    testLogin : "fulano123",
    testPassword : "123456"
  };

  useEffect( () => {
    const fetcharUsuarios = async () => {
      const imageGot = await get(dbRef_users);
      const imageValues = imageGot.val();
      const UserListResult = [];
      for (const userInst in imageValues){
        const ObjToUserStuff : UserStuff = {
          testId : userInst,
          testLogin : imageValues[userInst].testLogin,
          testPassword : imageValues[userInst].testPassword
        }
        UserListResult.push(ObjToUserStuff);
      }
      console.log(UserListResult);
      setUsers(UserListResult);
    };

    fetcharUsuarios();
  }, []);

  // ------------------------------------ Drag and Drop
  const draggingHandler = (e: React.DragEvent, content: string) => {
    e.dataTransfer.setData("widgetType", content);
    console.log("ARRASTANDO: "+content)
  }

  const [dropDivStuff, setDropDivStuff] = useState<string>("bg-blue-800 min-h-80 min-w-80");

  const dragOverHandler = (e: React.DragEvent) => {
    e.preventDefault();
    setDropDivStuff("bg-blue-400 min-h-80 min-w-80")
  }

  const mouseLeaveHandler = () => {
    setDropDivStuff("bg-blue-800 min-h-80 min-w-80")
  }

  // =====
  const [dropped, setDropped] = useState<string[]>([]);

  const dropHandler = (e: React.DragEvent) => {
    const contentOfElement = e.dataTransfer.getData("widgetType") as string
    if (!(dropped.includes(contentOfElement))){
      setDropped([...dropped, contentOfElement]);
    }
    
  }
  
  //=== Removendo da Div

  const dropRemoveHandler = (item: string) => {
    const newList = dropped.filter((a) => a != item)
    setDropped(newList);
    
  };


  // ---------------------------------

  const deletarUser = async (idUser: string) =>{

    const newList = [];

    for (const damned in users){
      if (users[damned].testId != idUser){
        newList.push(users[damned])
      }
    }

    setUsers(newList);

    try{
      const userDeletado = ref(database, `data/users/${idUser}`)
      console.log(userDeletado);
      await remove(userDeletado);
    }
    catch(error)
    {
      console.log(error)
    }
  }
  //

  const addUserDB = (userToAdd: string) => {
    console.log(userToAdd);
    const newUser: UserStuff = {
      testId: userToAdd,
      testLogin: "login-"+userToAdd,
      testPassword: "testPasswordSample"
    };

    setUsers([...users, newUser]);

    const refUserAdicionar = ref(database, `data/users/${userToAdd}`)

    set(refUserAdicionar, newUser);

  };
  //
  const editUserDB = (userEdited: string, newLogin: string) => {
    const userUpdated: UserStuff = {
      testId: userEdited,
      testLogin: newLogin,
      testPassword : "testPasswordSample"
    };

    const newList = [];

    for (const usuario in users){
      if (users[usuario].testId == userEdited)
      {
        newList.push(userUpdated);
      }
      else{
        newList.push(users[usuario]);
      }
    };

    setUsers(newList);
    
    const refUserEditar = ref(database, `data/users/${userEdited}`);

    set(refUserEditar, userUpdated);

  };

  //
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="font-bold">
        <h1 className="text-black">User list:</h1>
        {
          (users != null) && (users.length > 0) ? (
          <ul>
          {users.map((item, index) => (
            <div className="min-h-20">
              <li key={index} 
                  className="text-blue-800" 
                  draggable="true"
                  onDragStart={(e) => draggingHandler(e, item.testLogin)}
              >  
              - {item.testLogin}
              </li>

              <button className="bg-red-700" onClick={() => deletarUser(item.testId)}>Delete</button>
            </div>

          )
          )}
          </ul>
        ) : // Caso contrário
        (
          <p>shits rough</p>
        )
        }

      </div>
      <button onClick={() => {
        setUsers([...users, exemploUser])
      }}>asdsadsad</button>

      <div className={dropDivStuff} 
          onDrop={dropHandler} 
          onDragOver={dragOverHandler} 
          onMouseLeave={mouseLeaveHandler}
      >
        <ul>
          {dropped.map((item, index)=>{
            return <li key={index} 
            onDragStart={(e)=> draggingHandler(e, item)}
            onDragEnd={(e) => dropRemoveHandler(item)}
            draggable="true"
            >
              
              {item}
              
              </li>
          })}
        </ul>

      </div>
      <div className="min-h-20">
        <input type="text" id="userToBeAdded" className="text-black"></input>
        <button className="bg-green-900" onClick={() => {
          const userToAdd = document.getElementById('userToBeAdded') as HTMLInputElement | null;
          if (userToAdd && userToAdd.value) {
            const userName = userToAdd.value;
            console.log(userName);
            addUserDB(userName);
          }
          
        }
        
        }>AddLoginToDatabase</button>
      </div>

      <div className="min-h-20 text-black">
        <input type="text" id="idUserEdit" className="border-2 border-black"></input>
        <input type="text" id="newLoginUserEdit" className="border-2 border-black"></input>
        <button className="bg-blue-600" onClick={() => {
          const userToEdit = document.getElementById('idUserEdit') as HTMLInputElement | null;
          const userToEdit_newLogin = document.getElementById('newLoginUserEdit') as HTMLInputElement | null;
          if (userToEdit && userToEdit.value && userToEdit_newLogin && userToEdit_newLogin.value){
            const userEdited = userToEdit.value
            const newLogin = userToEdit_newLogin.value
            editUserDB(userEdited, newLogin);
          }
        }}>
          Editar
        </button>
      
      </div>

    </main>
  )
}
