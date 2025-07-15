import { createSlice } from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit/react";

export interface CompilerSliceStateType {
  fullCode: {
    html: string;
  };
  currentLanguage: "html";
  isOwner: boolean;
}

const initialState: CompilerSliceStateType = {
  fullCode: {
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>To-Do List</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100vh;
      margin: 0;
      background-color: #f0f4f8;
    }

    .container {
      background: #fff;
      padding: 30px 40px;
      border-radius: 12px;
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
      text-align: center;
      width: 300px;
    }

    h1 {
      margin-bottom: 20px;
      color: #333;
    }

    input {
      padding: 10px;
      width: 70%;
      border: 1px solid #ccc;
      border-radius: 6px;
      margin-bottom: 10px;
    }

    button {
      padding: 10px 16px;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      margin-left: 5px;
    }

    button:hover {
      background-color: #0056b3;
    }

    ul {
      list-style-type: none;
      padding: 0;
      margin-top: 20px;
      text-align: left;
    }

    li {
      padding: 8px 12px;
      margin-bottom: 8px;
      background-color: #e9ecef;
      border-radius: 6px;
      cursor: pointer;
      transition: background-color 0.2s ease;
    }

    li:hover {
      background-color: #d6d8db;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>To-Do List</h1>
    <input type="text" id="taskInput" placeholder="Enter your task">
    <button onclick="addTask()">Add Task</button>
    <ul id="taskList"></ul>
  </div>

  <script>
    function addTask() {
      var taskInput = document.getElementById('taskInput');
      var taskList = document.getElementById('taskList');
      if (taskInput.value !== '') {
        var taskItem = document.createElement('li');
        taskItem.textContent = taskInput.value;
        taskList.appendChild(taskItem);
        taskInput.value = '';

        taskItem.addEventListener('click', function () {
          taskList.removeChild(taskItem);
        });
      }
    }
  </script>
</body>
</html>
`
  },
  currentLanguage: "html",
  isOwner: false,
};

const compilerSlice = createSlice({
  name: "compilerSlice",
  initialState,
  reducers: {
    updateCurrentLanguage: (
      state,
      action: PayloadAction<CompilerSliceStateType["currentLanguage"]>
    ) => {
      state.currentLanguage = action.payload;
    },
    updateCodeValue: (state, action: PayloadAction<string>) => {
      state.fullCode[state.currentLanguage] = action.payload;
    },
    updateIsOwner: (state, action: PayloadAction<boolean>) => {
      state.isOwner = action.payload;
    },
    updateFullCode: (
      state,
      action: PayloadAction<CompilerSliceStateType["fullCode"]>
    ) => {
      state.fullCode = action.payload;
    },
  },
});

export default compilerSlice.reducer;
export const {
  updateCurrentLanguage,
  updateCodeValue,
  updateFullCode,
  updateIsOwner,
} = compilerSlice.actions;
