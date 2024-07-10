import { useState } from 'react'
import './App.css'
import EditorCustom from './Component/EditorCustom'
import Editor from './Component/Editor'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h3 className='text-5xl'>Editor</h3>

      {/* <Editor /> */}
      <EditorCustom />
    </>
  )
}

export default App
