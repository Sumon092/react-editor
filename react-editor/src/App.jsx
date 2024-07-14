
import './App.css'
import EditorMain from './Editor/EditorMain'


function App() {

  return (
    <div className='w-full flex justify-center flex-col'>
      <h3 className='text-5xl mb-4'>Editor</h3>

      {/* <Editor /> */}
      <EditorMain />
    </div>
  )
}

export default App
