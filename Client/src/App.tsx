import React, { useState } from 'react'

function App() {
  const [showwarn,setshowwarn]=useState(true);
  const [showbutton,setshowbutton]=useState(false);
  const [filename,setfilename]=useState('');
  const [uploaded,setuploaded]=useState(false);
  const [btntext,setbtntext]=useState('Submit');
  const [errorMessage,seterrmessage]=useState('');
  function fileselecting()
  {
    document.getElementById('file')?.click();
  }
  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = event?.target?.files?.[0];
    console.log('selected file', selectedFile?.name);
    setfilename(String(selectedFile?.name));
    
    setshowbutton(true);
    document.getElementById('form')?.removeEventListener('click', fileselecting);
  }
  function fileupload(event: React.FormEvent<HTMLFormElement>)
  {
    event.preventDefault();

    const formElement = document.getElementById('form') as HTMLFormElement;
    const fileInput = document.getElementById('file') as HTMLInputElement;

    if (formElement && fileInput) {
      const formData = new FormData(formElement);
      formData.append('file', fileInput.files?.[0] || ''); 
      setbtntext('Uploading...');
      seterrmessage('');
      fetch("/upload", {
        method: "POST",
        body: formData,
      })
        .then((response) =>
        {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) =>
        {
          setuploaded(true);
          console.log("File uploaded successfully", data);
        })
        .catch((error) =>
        {
          seterrmessage(error.message);
          console.log("Error uploading file:", error);
          setuploaded(false);
          console.error("Error uploading file:", error);
        }).finally(()=>{setbtntext('Submit');})
    }
  }

  return (
    <div className='w-full h-screen p-10'>
      <div className='w-full h-full shadow-xl shadow-gray-300'>
        {showwarn && <div className={'bg-[#CAC069] p-2 flex justify-between items-center '}>
          <h1>Add from Excel</h1>
          <span className='text-3xl font-bold text-gray-600 rotate-45 cursor-pointer' onClick={()=>{setshowwarn(false)}}>+</span>
        </div>}
        <div className='w-4/5 flex flex-col h-[80%] border-0 mx-auto'>
          <h1 className='my-5'>Add Candidates to Database</h1>
          {
            uploaded?
              <div className='w-full border-2 border-gray-400 border-dotted  h-52 flex flex-col justify-center items-center gap-5'>
              <h1 className='text-green-500 font-bold'>Thank you!</h1>
              <h1 className='flex gap-2'><img className='w-fit h-fit text-green-500' src="./check-line.png" alt="" /> File uploaded Successfully</h1>
              <p>Your records will be process shortly.</p>
            </div>
              : <form id='form' onClick={() => { filename == "" && fileselecting() }} onSubmit={(e) => { fileupload(e) }} className='w-full border-2 border-gray-400 border-dotted  h-52 flex flex-col justify-center items-center gap-5'>
                <img className='w-10 h-10' src="./uploadicon.png" alt="" />
                <input onChange={(e) => { handleFileChange(e) }} className='hidden' type="file" name="file" id="file" accept='.xlsx,.xls' />
                {filename === "" ? <p>Upload a .xlsx or .xls file here</p> : <p>{filename} </p>}
                <p className='text-red-500'>{errorMessage}</p>
                {showbutton && <button className='bg-[#6AA84F] p-2 px-5 rounded text-white'>{btntext}</button>}
              </form>
          }
          
        </div>
      </div>
    </div>
  )
}

export default App;
